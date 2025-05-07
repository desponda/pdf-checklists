"use strict";
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

const PDF_CACHE_DIR = path.join(__dirname, "../cache/pdfs");
const PDF_CACHE_TTL = 24 * 60 * 60 * 1000; // 24 hours

function ensureDir(dir) {
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

function getPdfCacheKey(pages) {
    return crypto.createHash("sha256").update(
        JSON.stringify(
            pages.map((p) => ({
                aircraft: p.aircraft || "",
                variant: p.variant || "",
                filename: p.filename,
            }))
        )
    ).digest("hex");
}

function getPdfCacheFilePath(cacheKey) {
    ensureDir(PDF_CACHE_DIR);
    return path.join(PDF_CACHE_DIR, `${cacheKey}.pdf`);
}

function isPdfCacheValid(filePath) {
    try {
        const stats = fs.statSync(filePath);
        return Date.now() - new Date(stats.mtime).getTime() < PDF_CACHE_TTL;
    } catch {
        return false;
    }
}

module.exports = {
    getPdfCacheKey,
    getPdfCacheFilePath,
    isPdfCacheValid,
    ensureDir,
    PDF_CACHE_DIR,
    PDF_CACHE_TTL,
};
