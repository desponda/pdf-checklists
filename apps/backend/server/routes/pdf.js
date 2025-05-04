const express = require('express');
const router = express.Router();
const { generatePDF } = require('../utils/pdfGenerator');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

/**
 * API endpoint to generate PDF from selected aircraft images
 */
router.post('/', async (req, res) => {
  const startTime = Date.now();
  try {
    const { pages } = req.body;
    if (!pages || !Array.isArray(pages) || pages.length === 0) {
      return res.status(400).json({ error: 'No pages specified. Please select an aircraft and variant.' });
    }

    // Generate a unique cache key based on the pages array (aircraft, variant, and page filenames)
    const cacheKey = crypto.createHash('sha256')
      .update(JSON.stringify(pages.map(p => ({
        aircraft: p.aircraft || '',
        variant: p.variant || '',
        filename: p.filename
      }))))
      .digest('hex');
    const cacheDir = path.join(__dirname, '../cache/pdfs');
    if (!fs.existsSync(cacheDir)) {
      fs.mkdirSync(cacheDir, { recursive: true });
    }
    const cacheFile = path.join(cacheDir, `${cacheKey}.pdf`);

    // Check if cached PDF exists and is <24h old
    if (fs.existsSync(cacheFile)) {
      const stats = fs.statSync(cacheFile);
      const now = Date.now();
      const mtime = new Date(stats.mtime).getTime();
      if ((now - mtime) < 24 * 60 * 60 * 1000) {
        // Serve cached PDF
        const pdfBuffer = fs.readFileSync(cacheFile);
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', 'attachment; filename="aircraft-checklist.pdf"');
        res.setHeader('Content-Length', pdfBuffer.length.toString());
        res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
        res.setHeader('Pragma', 'no-cache');
        res.setHeader('Expires', '0');
        res.send(pdfBuffer);
        console.log(`Served cached PDF: ${cacheFile}`);
        return;
      }
    }

    // Not cached or cache expired, generate PDF
    console.log(`Generating new PDF for cacheKey: ${cacheKey}`);
    const pdfBuffer = await generatePDF(pages);
    // Save to cache
    fs.writeFileSync(cacheFile, pdfBuffer);

    // Set response headers
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename="aircraft-checklist.pdf"');
    res.setHeader('Content-Length', pdfBuffer.length.toString());
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
    res.send(pdfBuffer);
    const pdfSize = pdfBuffer.length;
    const pdfSizeMB = (pdfSize / (1024 * 1024)).toFixed(2);
    console.log(`PDF generated and cached: ${cacheFile} (${pdfSizeMB} MB)`);
    console.log({
      totalPages: pages.length,
      finalSize: pdfSizeMB + ' MB',
      generationTime: Date.now() - startTime + 'ms'
    });
  } catch (error) {
    console.error('Error generating PDF:', error);
    res.status(500).json({ error: 'Failed to generate PDF: ' + error.message });
  }
});

module.exports = router;
