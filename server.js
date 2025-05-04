const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');
const { PDFDocument } = require('pdf-lib');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Serve static files from the React app when in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, 'build')));
}

// API endpoint to fetch the file index from the source
app.get('/api/files', async (req, res) => {
  try {
    const response = await fetch('https://msfschecklist.de/ebag/file_index.js?dev=21');
    const data = await response.text();
    
    // Extract the file list from the JavaScript string
    const fileListMatch = data.match(/var files=`([\s\S]*?)`/);
    
    if (fileListMatch && fileListMatch[1]) {
      const fileList = fileListMatch[1].trim().split('\n');
      
      // Process file list to extract aircraft models and variants
      const aircraftMap = {};
      
      // Debug: Log the first few files for troubleshooting
      console.log("First 5 files:", fileList.slice(0, 5));
      console.log("Total file count:", fileList.length);
      
      fileList.forEach(file => {
        // Skip empty lines or the file_index.js entry
        if (!file || file === 'file_index.js') return;
        
        // Trim whitespace and carriage returns from the filename
        const cleanedFile = file.trim();
        
        // Parse aircraft type and page number from filename
        // More flexible pattern to capture aircraft names with various characters and formats
        const match = cleanedFile.match(/^(.+?)---(\d+)\.jpg$/);
        if (match) {
          const [, aircraft, pageNum] = match;
          if (!aircraftMap[aircraft]) {
            aircraftMap[aircraft] = [];
          }
          aircraftMap[aircraft].push({
            filename: cleanedFile,
            page: parseInt(pageNum)
          });
        } else {
          // Debug: Log any files that don't match our pattern
          console.log("Non-matching file:", cleanedFile);
        }
      });
      
      // Organize aircraft by model and variant
      const organizedAircraft = Object.keys(aircraftMap).reduce((acc, aircraft) => {
        // Sort pages by number
        const pages = aircraftMap[aircraft].sort((a, b) => a.page - b.page);
        
        // Check if this is a variant (e.g., dark mode)
        // More flexible pattern to detect variants with underscore separator
        const baseModelMatch = aircraft.match(/^(.+?)_(.+)$/);
        
        if (baseModelMatch) {
          const [, baseModel, variant] = baseModelMatch;
          
          if (!acc[baseModel]) {
            acc[baseModel] = {
              variants: {}
            };
          }
          
          acc[baseModel].variants[variant] = {
            name: `${baseModel} ${variant}`,
            pages: pages
          };
        } else {
          // This is a base model
          if (!acc[aircraft]) {
            acc[aircraft] = {
              variants: {}
            };
          }
          
          acc[aircraft].standard = {
            name: aircraft,
            pages: pages
          };
        }
        
        return acc;
      }, {});
      
      // Debug: Log the summary of aircraft detected
      console.log("Aircraft count:", Object.keys(organizedAircraft).length);
      console.log("First aircraft:", Object.keys(organizedAircraft)[0]);
      
      res.json(organizedAircraft);
    } else {
      throw new Error('Could not parse file index');
    }
  } catch (error) {
    console.error('Error fetching file index:', error);
    res.status(500).json({ error: 'Failed to fetch file index' });
  }
});

// API endpoint to generate PDF from selected aircraft images
app.post('/api/generate-pdf', async (req, res) => {
  try {
    const { pages } = req.body;
    
    if (!pages || !Array.isArray(pages) || pages.length === 0) {
      return res.status(400).json({ error: 'Invalid pages data' });
    }
    
    // Create a new PDF document
    const pdfDoc = await PDFDocument.create();
    
    // Store any errors that occur during image processing
    let errors = [];
    let successCount = 0;
    
    // Fetch and embed all images
    for (const pageInfo of pages) {
      try {
        const imageUrl = `https://msfschecklist.de/ebag/${pageInfo.filename}`;
        
        // Set a timeout on the fetch to prevent hanging forever
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout
        
        const imageResponse = await fetch(imageUrl, { 
          signal: controller.signal,
          headers: {
            'User-Agent': 'PDF Checklist Generator (educational project)'
          }
        });
        
        // Clear the timeout
        clearTimeout(timeoutId);
        
        if (!imageResponse.ok) {
          const errorMsg = `Failed to fetch image: ${imageUrl}, status: ${imageResponse.status}`;
          console.warn(errorMsg);
          errors.push({ page: pageInfo.page, message: errorMsg });
          continue;
        }
        
        const imageData = await imageResponse.arrayBuffer();
        
        // Make sure we actually got image data
        if (!imageData || imageData.byteLength === 0) {
          const errorMsg = `Empty image data received for ${pageInfo.filename}`;
          console.warn(errorMsg);
          errors.push({ page: pageInfo.page, message: errorMsg });
          continue;
        }
        
        // Embed the JPEG image into the PDF
        const image = await pdfDoc.embedJpg(imageData);
        
        // Add a page to the PDF with the image dimensions
        const page = pdfDoc.addPage([image.width, image.height]);
        
        // Draw the image to fill the page
        page.drawImage(image, {
          x: 0,
          y: 0,
          width: image.width,
          height: image.height,
        });
        
        successCount++;
      } catch (imageError) {
        const errorMsg = `Error processing image ${pageInfo.filename}: ${imageError.message || 'Unknown error'}`;
        console.warn(errorMsg);
        errors.push({ page: pageInfo.page, message: errorMsg });
        // Continue with next image
      }
    }
    
    // If no images were processed successfully, return an error
    if (successCount === 0) {
      return res.status(500).json({ 
        error: 'Failed to generate PDF - could not process any images',
        details: errors
      });
    }
    
    // If some images failed but others succeeded, add a warning page to the PDF
    if (errors.length > 0) {
      const warningPage = pdfDoc.addPage([600, 800]);
      const { width, height } = warningPage.getSize();
      
      warningPage.drawText('Warning: Some images failed to load', {
        x: 50,
        y: height - 50,
        size: 20,
        color: PDFDocument.rgb(0.8, 0, 0)
      });
      
      warningPage.drawText(`Successfully loaded ${successCount} of ${pages.length} pages.`, {
        x: 50,
        y: height - 80,
        size: 12
      });
      
      let yPos = height - 120;
      warningPage.drawText('Failed images:', {
        x: 50,
        y: yPos,
        size: 12,
        color: PDFDocument.rgb(0.7, 0, 0)
      });
      
      errors.forEach((err, i) => {
        if (i < 10) { // Limit to showing first 10 errors
          yPos -= 20;
          warningPage.drawText(`Page ${err.page}: ${err.message.substring(0, 60)}...`, {
            x: 50,
            y: yPos,
            size: 10
          });
        }
      });
    }
    
    // Add document info
    pdfDoc.setTitle('MSFS Aircraft Checklist');
    pdfDoc.setAuthor('PDF Checklist Generator');
    pdfDoc.setCreator('PDF Checklist Generator');
    pdfDoc.setProducer('pdf-lib (https://github.com/Hopding/pdf-lib)');
    pdfDoc.setCreationDate(new Date());
    
    // Serialize the PDF to bytes
    const pdfBytes = await pdfDoc.save();
    
    // Set response headers
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename="aircraft-checklist.pdf"');
    
    // Send the PDF bytes as response
    res.send(Buffer.from(pdfBytes));
  } catch (error) {
    console.error('Error generating PDF:', error);
    res.status(500).json({ error: 'Failed to generate PDF: ' + error.message });
  }
});

// The "catchall" handler for any request not handled by routes above
// This serves the React app
if (process.env.NODE_ENV === 'production') {
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'build', 'index.html'));
  });
}

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});