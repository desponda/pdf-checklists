const { PDFDocument } = require('pdf-lib');
const fetch = require('node-fetch');
const { Buffer } = require('buffer');
const fs = require('fs');
const path = require('path');

/**
 * Generate a PDF document from a list of image URLs
 * @param {Array} pages - Array of page objects containing image URLs and metadata
 * @returns {Promise<Buffer>} - PDF file as buffer
 */
async function generatePDF(pages) {
  const pdfDoc = await PDFDocument.create();

  // Add document info
  pdfDoc.setTitle('MSFS Aircraft Checklist');
  pdfDoc.setAuthor('PDF Checklist Generator');
  pdfDoc.setCreator('PDF Checklist Generator Web App');
  pdfDoc.setProducer('pdf-lib (https://github.com/Hopding/pdf-lib)');
  pdfDoc.setCreationDate(new Date());

  // Store any errors that occur during image processing
  let errors = [];
  let successCount = 0;

  // Fetch and embed all images
  for (const pageInfo of pages) {
    try {
      // Determine cache path for this image
      let category = 'misc';
      if (pageInfo.url.includes('ebag_airliner')) category = 'airliner';
      else if (pageInfo.url.includes('ebag_general_aviation')) category = 'general_aviation';
      else if (pageInfo.url.includes('ebag_helicopter')) category = 'helicopter';
      else if (pageInfo.url.includes('ebag_military')) category = 'military';
      else if (pageInfo.url.includes('ebag_wip')) category = 'wip';
      const cacheDir = path.join(__dirname, '../cache/images', category);
      if (!fs.existsSync(cacheDir)) {
        fs.mkdirSync(cacheDir, { recursive: true });
      }
      const cacheFile = path.join(cacheDir, pageInfo.filename);

      let imageBuffer = null;
      let fromCache = false;
      // Check if cache file exists and is <24h old
      if (fs.existsSync(cacheFile)) {
        const stats = fs.statSync(cacheFile);
        const now = Date.now();
        const mtime = new Date(stats.mtime).getTime();
        if ((now - mtime) < 24 * 60 * 60 * 1000) {
          // Use cached image
          imageBuffer = fs.readFileSync(cacheFile);
          fromCache = true;
          console.log(`Loaded image from cache: ${cacheFile}`);
        }
      }
      if (!imageBuffer) {
        // Fetch from remote
        console.log(`Fetching image: ${pageInfo.filename}`);
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout
        const imageResponse = await fetch(pageInfo.url, { signal: controller.signal });
        clearTimeout(timeoutId);
        if (!imageResponse.ok) {
          throw new Error(`Server returned ${imageResponse.status}: ${imageResponse.statusText}`);
        }
        imageBuffer = await imageResponse.buffer();
        if (!imageBuffer || imageBuffer.length === 0) {
          throw new Error('Empty response or no image data received');
        }
        // Save to cache
        fs.writeFileSync(cacheFile, imageBuffer);
        console.log(`Fetched and cached image: ${cacheFile}`);
      }

      // Get the content type to determine the image format (optional, not used for embedding)
      // const contentType = imageResponse.headers.get('content-type');

      // Verify the image format by checking file signature/magic numbers
      const isJpeg = imageBuffer.length >= 2 &&
        imageBuffer[0] === 0xFF &&
        imageBuffer[1] === 0xD8;
      const isPng = imageBuffer.length >= 8 &&
        imageBuffer[0] === 0x89 &&
        imageBuffer[1] === 0x50 &&
        imageBuffer[2] === 0x4E &&
        imageBuffer[3] === 0x47;

      // Convert buffer to arrayBuffer for pdf-lib
      const imageData = imageBuffer.buffer.slice(
        imageBuffer.byteOffset,
        imageBuffer.byteOffset + imageBuffer.byteLength
      );

      // Try to embed the image based on detected format
      let image;
      try {
        if (isPng) {
          image = await pdfDoc.embedPng(imageData);
        } else if (isJpeg) {
          image = await pdfDoc.embedJpg(imageData);
        } else {
          // Default to JPEG as a fallback
          image = await pdfDoc.embedJpg(imageData);
        }
      } catch (embedError) {
        // If embedding fails, try the alternative format
        console.warn(`Error embedding image as ${isPng ? 'PNG' : 'JPEG'}, trying alternative format: ${embedError.message}`);
        try {
          image = isPng ?
            await pdfDoc.embedJpg(imageData) :
            await pdfDoc.embedPng(imageData);
        } catch (fallbackError) {
          throw new Error(`Failed to embed image in either format: ${fallbackError.message}`);
        }
      }

      // Get the image dimensions
      const imgWidth = image.width;
      const imgHeight = image.height;

      // Check for reasonable dimensions
      if (imgWidth < 10 || imgHeight < 10 || imgWidth > 10000 || imgHeight > 10000) {
        throw new Error(`Invalid image dimensions: ${imgWidth}x${imgHeight}`);
      }

      // Add a page to the PDF with the image dimensions
      const page = pdfDoc.addPage([imgWidth, imgHeight]);

      // Draw the image to fill the page
      page.drawImage(image, {
        x: 0,
        y: 0,
        width: imgWidth,
        height: imgHeight,
      });

      // Log successful page addition
      console.log(`Added page ${successCount + 1} with dimensions ${imgWidth}x${imgHeight}`);

      successCount++;
    } catch (imageError) {
      const errorMsg = `Error processing image ${pageInfo.filename}: ${imageError.message || 'Unknown error'}`;
      console.warn(errorMsg);
      errors.push({ page: pageInfo.page, message: errorMsg });
      // Continue with next image
    }
  }

  // If no images were processed successfully, throw an error
  if (successCount === 0) {
    throw new Error('Failed to generate PDF - could not process any images');
  }

  // If some images failed but others succeeded, add a warning page to the PDF
  if (errors.length > 0) {
    addWarningPage(pdfDoc, successCount, pages.length, errors);
  }

  // Serialize the PDF to bytes
  const pdfBytes = await pdfDoc.save();

  console.log(`PDF successfully created with ${successCount} pages. Size: ${pdfBytes.length} bytes`);

  // Create and return a buffer from the PDF bytes
  return Buffer.from(pdfBytes);
}

/**
 * Add a warning page to the PDF when some images fail to load
 * @param {PDFDocument} pdfDoc - PDF document to add the warning page to
 * @param {Number} successCount - Number of successfully loaded pages
 * @param {Number} totalPages - Total number of pages attempted
 * @param {Array} errors - Array of error objects
 */
function addWarningPage(pdfDoc, successCount, totalPages, errors) {
  const warningPage = pdfDoc.addPage([600, 800]);
  const { width, height } = warningPage.getSize();

  warningPage.drawText('Warning: Some images failed to load', {
    x: 50,
    y: height - 50,
    size: 20,
    color: PDFDocument.rgb(0.8, 0, 0)
  });

  warningPage.drawText(`Successfully loaded ${successCount} of ${totalPages} pages.`, {
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

module.exports = { generatePDF };
