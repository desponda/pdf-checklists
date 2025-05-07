
"use strict";
const express = require("express");
const fetch = require("node-fetch");
const fs = require("fs");
const path = require("path");

const router = express.Router();



const { ensureDir, PDF_CACHE_DIR } = require("../utils/cache");

const CATEGORIES = [
  { name: "airliner", url: "https://msfschecklist.de/ebag_airliner/file_index.js", baseUrl: "https://msfschecklist.de/ebag_airliner/" },
  { name: "general_aviation", url: "https://msfschecklist.de/ebag_general_aviation/file_index.js", baseUrl: "https://msfschecklist.de/ebag_general_aviation/" },
  { name: "helicopter", url: "https://msfschecklist.de/ebag_helicopter/file_index.js", baseUrl: "https://msfschecklist.de/ebag_helicopter/" },
  { name: "military", url: "https://msfschecklist.de/ebag_military/file_index.js", baseUrl: "https://msfschecklist.de/ebag_military/" },
  { name: "wip", url: "https://msfschecklist.de/ebag_wip/file_index.js", baseUrl: "https://msfschecklist.de/ebag_wip/" },
];



function getCacheFilePath(category) {
  // Use the same cache dir as before, or define a new one for file indexes if needed
  const dir = PDF_CACHE_DIR.replace(/pdfs$/, ""); // fallback to ../cache
  ensureDir(dir);
  return path.join(dir, `file_index_${category}.json`);
}

// Local cache validity check for file index cache (not PDF cache)
const CACHE_TTL = 24 * 60 * 60 * 1000; // 24 hours
function isCacheValid(filePath) {
  try {
    const stats = fs.statSync(filePath);
    return Date.now() - new Date(stats.mtime).getTime() < CACHE_TTL;
  } catch {
    return false;
  }
}

function parseFileList(fileData) {
  const match = fileData.match(/var\s+files\s*=\s*`\s*([\s\S]+?)`\s*;/);
  if (!match || !match[1]) return [];
  return match[1].trim().split("\n").filter(f => f.trim() && f !== "file_index.js");
}

function addFileToAircraftData(filename, baseUrl, aircraftData, categoryName) {
  // Parse filename: "AircraftName[_Dark]---001.jpg"
  const [aircraftRaw, pageRaw] = filename.split("---");
  if (!aircraftRaw || !pageRaw) return;

  // Determine aircraft name and variant
  let aircraftName = aircraftRaw;
  const isDark = /_Dark$/i.test(aircraftName);
  const variant = isDark ? "dark" : "standard";
  if (isDark) aircraftName = aircraftName.replace(/_Dark$/i, "");

  // Parse page number
  const pageNumber = parseInt(pageRaw.replace(/\.jpg$/, ""), 10);
  if (isNaN(pageNumber)) return;

  // Initialize aircraft entry if needed
  if (!aircraftData[aircraftName]) {
    aircraftData[aircraftName] = {
      variants: {},
      category: categoryName,
    };
  }

  // Helper to add a page to a variant
  function addPage(target, name) {
    if (!target[name]) {
      target[name] = {
        name: name === "standard" ? aircraftName.replace(/_/g, " ") : `${aircraftName.replace(/_/g, " ")} (Dark)`,
        pages: [],
      };
    }
    target[name].pages.push({
      page: pageNumber,
      filename,
      url: baseUrl + filename,
    });
    target[name].pages.sort((a, b) => a.page - b.page);
  }

  if (variant === "standard") {
    addPage(aircraftData[aircraftName], "standard");
  } else {
    addPage(aircraftData[aircraftName].variants, "dark");
  }
}

async function getFileListForCategory(category, headers) {
  const cacheFile = getCacheFilePath(category.name);
  if (isCacheValid(cacheFile)) {
    try {
      const cached = JSON.parse(fs.readFileSync(cacheFile, "utf8"));
      if (Array.isArray(cached.fileList)) return cached.fileList;
    } catch (e) {
      // ignore cache read error, will fetch
    }
  }
  try {
    const response = await fetch(category.url, { headers });
    const fileData = await response.text();
    const fileList = parseFileList(fileData);
    fs.writeFileSync(cacheFile, JSON.stringify({ fileList, fetched: Date.now() }, null, 2));
    return fileList;
  } catch {
    return [];
  }
}


// Main route handler: returns all aircraft data, using cache for each category
router.get("/", async (req, res) => {
  const headers = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/112.0.0.0 Safari/537.36",
    Accept: "text/javascript,application/javascript,*/*;q=0.8",
    "Accept-Language": "en-US,en;q=0.9",
    "Cache-Control": "no-cache",
    Pragma: "no-cache",
  };
  const aircraftData = {};
  try {
    for (const category of CATEGORIES) {
      const fileList = await getFileListForCategory(category, headers);
      fileList.forEach(filename => addFileToAircraftData(filename, category.baseUrl, aircraftData, category.name));
    }
    res.json(aircraftData);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch file indexes", details: error.message });
  }
});

module.exports = router;
