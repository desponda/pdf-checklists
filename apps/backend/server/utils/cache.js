"use strict";
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

// Vercel's function filesystem is read-only apart from /tmp.  Keep the local
// development layout unchanged, while routing ephemeral serverless caches to
// the writable temp directory in production.
const CACHE_ROOT = process.env.VERCEL
    ? path.join("/tmp", "pdf-checklists")
    : path.join(__dirname, "../cache");
const PDF_CACHE_DIR = path.join(CACHE_ROOT, "pdfs");
const IMAGE_CACHE_DIR = path.join(CACHE_ROOT, "images");
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
    CACHE_ROOT,
    PDF_CACHE_DIR,
    IMAGE_CACHE_DIR,
    PDF_CACHE_TTL,
};
