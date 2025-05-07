"use strict";
const express = require("express");
const fs = require("fs");
const { getPdfCacheKey, getPdfCacheFilePath, isPdfCacheValid } = require("../utils/cache");
const { generatePDF } = require("../utils/pdfGenerator");

const router = express.Router();



/**
 * API endpoint to generate PDF from selected aircraft images.
 */
router.post("/", async (req, res) => {
  const startTime = Date.now();
  try {
    const { pages } = req.body;
    if (!Array.isArray(pages) || pages.length === 0) {
      return res.status(400).json({
        error: "No pages specified. Please select an aircraft and variant.",
      });
    }

    const cacheKey = getPdfCacheKey(pages);
    const cacheFile = getPdfCacheFilePath(cacheKey);

    if (isPdfCacheValid(cacheFile)) {
      const pdfBuffer = fs.readFileSync(cacheFile);
      res.setHeader("Content-Type", "application/pdf");
      res.setHeader(
        "Content-Disposition",
        "attachment; filename=\"aircraft-checklist.pdf\""
      );
      res.setHeader("Content-Length", pdfBuffer.length.toString());
      res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");
      res.setHeader("Pragma", "no-cache");
      res.setHeader("Expires", "0");
      res.send(pdfBuffer);
      console.log(`Served cached PDF: ${cacheFile}`);
      return;
    }

    // Not cached or cache expired, generate PDF
    console.log(`Generating new PDF for cacheKey: ${cacheKey}`);
    const pdfBuffer = await generatePDF(pages);
    fs.writeFileSync(cacheFile, pdfBuffer);

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      "attachment; filename=\"aircraft-checklist.pdf\""
    );
    res.setHeader("Content-Length", pdfBuffer.length.toString());
    res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");
    res.setHeader("Pragma", "no-cache");
    res.setHeader("Expires", "0");
    res.send(pdfBuffer);
    const pdfSizeMB = (pdfBuffer.length / (1024 * 1024)).toFixed(2);
    console.log(
      `PDF generated and cached: ${cacheFile} (${pdfSizeMB} MB)`,
      {
        totalPages: pages.length,
        finalSize: pdfSizeMB + " MB",
        generationTime: Date.now() - startTime + "ms",
      }
    );
  } catch (error) {
    console.error("Error generating PDF:", error);
    res.status(500).json({ error: "Failed to generate PDF: " + error.message });
  }
});

module.exports = router;
