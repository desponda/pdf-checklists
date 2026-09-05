const { PDFDocument, rgb } = require('pdf-lib');
const fetch = require('node-fetch');
const fs = require('fs');
const path = require('path');
const { IMAGE_CACHE_DIR, ensureDir } = require('./cache');

const IMAGE_CACHE_TTL = 24 * 60 * 60 * 1000;

function getCategory(url = '') {
  if (url.includes('ebag_airliner')) return 'airliner';
  if (url.includes('ebag_general_aviation')) return 'general_aviation';
  if (url.includes('ebag_helicopter')) return 'helicopter';
  if (url.includes('ebag_military')) return 'military';
  if (url.includes('ebag_wip')) return 'wip';
  return 'misc';
}

function getCachedImage(cacheFile) {
  try {
    const stats = fs.statSync(cacheFile);
    if (Date.now() - stats.mtimeMs < IMAGE_CACHE_TTL) return fs.readFileSync(cacheFile);
  } catch {
    // A missing or incomplete cache entry is fetched below.
  }
  return null;
}

/** Fetch one checklist image, using the local /tmp cache on Vercel. */
async function loadImageBuffer(pageInfo) {
  const cacheDir = path.join(IMAGE_CACHE_DIR, getCategory(pageInfo.url));
  ensureDir(cacheDir);
  const cacheFile = path.join(cacheDir, pageInfo.filename);
  const cached = getCachedImage(cacheFile);
  if (cached) {
    console.log(`Loaded image from cache: ${cacheFile}`);
    return cached;
  }

  console.log(`Fetching image: ${pageInfo.filename}`);
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 30000);
  try {
    const imageResponse = await fetch(pageInfo.url, { signal: controller.signal });
    if (!imageResponse.ok) throw new Error(`Server returned ${imageResponse.status}: ${imageResponse.statusText}`);
    const imageBuffer = await imageResponse.buffer();
    if (!imageBuffer || imageBuffer.length === 0) throw new Error('Empty response or no image data received');
    fs.writeFileSync(cacheFile, imageBuffer);
    console.log(`Fetched and cached image: ${cacheFile}`);
    return imageBuffer;
  } finally {
    clearTimeout(timeoutId);
  }
}

function getImageData(imageBuffer) {
  return imageBuffer.buffer.slice(
    imageBuffer.byteOffset,
    imageBuffer.byteOffset + imageBuffer.byteLength
  );
}

async function embedImage(pdfDoc, imageBuffer) {
  const isJpeg = imageBuffer.length >= 2 && imageBuffer[0] === 0xFF && imageBuffer[1] === 0xD8;
  const isPng = imageBuffer.length >= 8 && imageBuffer[0] === 0x89 && imageBuffer[1] === 0x50 && imageBuffer[2] === 0x4E && imageBuffer[3] === 0x47;
  const imageData = getImageData(imageBuffer);

  try {
    if (isPng) return await pdfDoc.embedPng(imageData);
    return await pdfDoc.embedJpg(imageData);
  } catch (embedError) {
    console.warn(`Error embedding image as ${isPng ? 'PNG' : 'JPEG'}, trying alternative format: ${embedError.message}`);
    return isPng ? pdfDoc.embedJpg(imageData) : pdfDoc.embedPng(imageData);
  }
}

/**
 * Generate a PDF document from a list of image URLs.
 * Image downloads happen concurrently; PDF pages are still embedded in order.
 */
async function generatePDF(pages) {
  const pdfDoc = await PDFDocument.create();
  pdfDoc.setTitle('MSFS Aircraft Checklist');
  pdfDoc.setAuthor('PDF Checklist Generator');
  pdfDoc.setCreator('PDF Checklist Generator Web App');
  pdfDoc.setProducer('pdf-lib (https://github.com/Hopding/pdf-lib)');
  pdfDoc.setCreationDate(new Date());

  const results = await Promise.all(pages.map(async (pageInfo) => {
    try {
      return { pageInfo, imageBuffer: await loadImageBuffer(pageInfo) };
    } catch (error) {
      return { pageInfo, error };
    }
  }));

  const errors = [];
  let successCount = 0;
  for (const { pageInfo, imageBuffer, error: fetchError } of results) {
    try {
      if (fetchError) throw fetchError;
      const image = await embedImage(pdfDoc, imageBuffer);
      const imgWidth = image.width;
      const imgHeight = image.height;
      if (imgWidth < 10 || imgHeight < 10 || imgWidth > 10000 || imgHeight > 10000) {
        throw new Error(`Invalid image dimensions: ${imgWidth}x${imgHeight}`);
      }
      const page = pdfDoc.addPage([imgWidth, imgHeight]);
      page.drawImage(image, { x: 0, y: 0, width: imgWidth, height: imgHeight });
      successCount += 1;
      console.log(`Added page ${successCount} with dimensions ${imgWidth}x${imgHeight}`);
    } catch (imageError) {
      const errorMsg = `Error processing image ${pageInfo.filename}: ${imageError.message || 'Unknown error'}`;
      console.warn(errorMsg);
      errors.push({ page: pageInfo.page, message: errorMsg });
    }
  }

  if (successCount === 0) throw new Error('Failed to generate PDF - could not process any images');
  if (errors.length > 0) addWarningPage(pdfDoc, successCount, pages.length, errors);

  const pdfBytes = await pdfDoc.save();
  console.log(`PDF successfully created with ${successCount} pages. Size: ${pdfBytes.length} bytes`);
  return Buffer.from(pdfBytes);
}

function addWarningPage(pdfDoc, successCount, totalPages, errors) {
  const warningPage = pdfDoc.addPage([600, 800]);
  const { height } = warningPage.getSize();
  warningPage.drawText('Warning: Some images failed to load', { x: 50, y: height - 50, size: 20, color: rgb(0.8, 0, 0) });
  warningPage.drawText(`Successfully loaded ${successCount} of ${totalPages} pages.`, { x: 50, y: height - 80, size: 12 });
  let yPos = height - 120;
  warningPage.drawText('Failed images:', { x: 50, y: yPos, size: 12, color: rgb(0.7, 0, 0) });
  errors.slice(0, 10).forEach((err) => {
    yPos -= 20;
    warningPage.drawText(`Page ${err.page}: ${err.message.substring(0, 60)}...`, { x: 50, y: yPos, size: 10 });
  });
}

module.exports = { generatePDF };
