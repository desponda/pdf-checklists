const express = require('express');
const fetch = require('node-fetch');
const router = express.Router();


const fs = require('fs');
const path = require('path');

// Helper to get cache file path for a category
function getCacheFilePath(category) {
    const cacheDir = path.join(__dirname, '../cache');
    if (!fs.existsSync(cacheDir)) {
        fs.mkdirSync(cacheDir, { recursive: true });
    }
    return path.join(cacheDir, `file_index_${category}.json`);
}

// Helper to check if cache file is valid (less than 24h old)
function isCacheValid(filePath) {
    try {
        const stats = fs.statSync(filePath);
        const now = Date.now();
        const mtime = new Date(stats.mtime).getTime();
        return (now - mtime) < 24 * 60 * 60 * 1000; // 24 hours
    } catch {
        return false;
    }
}

/**
 * Process files from a category and add them to the aircraft data
 * @param {Array} fileList - Array of filenames
 * @param {String} baseUrl - Base URL for this category
 * @param {Object} aircraftData - Combined aircraft data object
 */
function processFiles(fileList, baseUrl, aircraftData) {
    fileList.forEach(filename => {
        // Parse out aircraft info from filename
        // Format is typically Aircraft_Name---001.jpg or Aircraft_Name_Dark---001.jpg
        const filenameParts = filename.split('---');

        if (filenameParts.length === 2) {
            let aircraftName = filenameParts[0];
            const pageNumber = parseInt(filenameParts[1].replace(/\.jpg$/, ''));

            // Determine if this is a dark variant
            const isDark = aircraftName.toLowerCase().includes('dark');
            let variant = 'standard';

            if (isDark) {
                // Remove _Dark from aircraft name and set variant
                aircraftName = aircraftName.replace(/_Dark$/i, '');
                variant = 'dark';
            }

            // Initialize aircraft entry if needed
            if (!aircraftData[aircraftName]) {
                aircraftData[aircraftName] = {
                    variants: {}
                };
            }

            // Add to standard list or dark variant
            if (variant === 'standard') {
                if (!aircraftData[aircraftName].standard) {
                    aircraftData[aircraftName].standard = {
                        name: aircraftName.replace(/_/g, ' '),
                        pages: []
                    };
                }

                aircraftData[aircraftName].standard.pages.push({
                    page: pageNumber,
                    filename: filename,
                    url: baseUrl + filename
                });

                // Sort pages by page number
                aircraftData[aircraftName].standard.pages.sort((a, b) => a.page - b.page);
            } else {
                if (!aircraftData[aircraftName].variants[variant]) {
                    aircraftData[aircraftName].variants[variant] = {
                        name: `${aircraftName.replace(/_/g, ' ')} (Dark)`,
                        pages: []
                    };
                }

                aircraftData[aircraftName].variants[variant].pages.push({
                    page: pageNumber,
                    filename: filename,
                    url: baseUrl + filename
                });

                // Sort pages by page number
                aircraftData[aircraftName].variants[variant].pages.sort((a, b) => a.page - b.page);
            }
        }
    });
}

/**
 * API endpoint to fetch the file index from all categories
 */
router.get('/', async (req, res) => {
    try {
        const categories = [
            {
                name: 'airliner',
                url: 'https://msfschecklist.de/ebag_airliner/file_index.js',
                baseUrl: 'https://msfschecklist.de/ebag_airliner/'
            },
            {
                name: 'general_aviation',
                url: 'https://msfschecklist.de/ebag_general_aviation/file_index.js',
                baseUrl: 'https://msfschecklist.de/ebag_general_aviation/'
            },
            {
                name: 'helicopter',
                url: 'https://msfschecklist.de/ebag_helicopter/file_index.js',
                baseUrl: 'https://msfschecklist.de/ebag_helicopter/'
            },
            {
                name: 'military',
                url: 'https://msfschecklist.de/ebag_military/file_index.js',
                baseUrl: 'https://msfschecklist.de/ebag_military/'
            },
            {
                name: 'wip',
                url: 'https://msfschecklist.de/ebag_wip/file_index.js',
                baseUrl: 'https://msfschecklist.de/ebag_wip/'
            }
        ];

        const aircraftData = {};
        const headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/112.0.0.0 Safari/537.36',
            'Accept': 'text/javascript,application/javascript,*/*;q=0.8',
            'Accept-Language': 'en-US,en;q=0.9',
            'Cache-Control': 'no-cache',
            'Pragma': 'no-cache'
        };

        // For each category, use cache if valid, else fetch and update cache
        for (const category of categories) {
            const cacheFile = getCacheFilePath(category.name);
            let fileList = null;
            if (isCacheValid(cacheFile)) {
                // Read from cache
                try {
                    const cached = JSON.parse(fs.readFileSync(cacheFile, 'utf8'));
                    fileList = cached.fileList;
                    console.log(`Loaded ${category.name} file index from cache (${fileList.length} files)`);
                } catch (e) {
                    console.warn(`Failed to read cache for ${category.name}, will refetch.`);
                }
            }
            if (!fileList) {
                // Fetch from remote
                try {
                    console.log(`Fetching ${category.name} file index from ${category.url}`);
                    const response = await fetch(category.url, { headers });
                    const fileData = await response.text();
                    const fileListPattern = /var\s+files\s*=\s*`\s*([\s\S]+?)`\s*;/;
                    const fileListMatch = fileData.match(fileListPattern);
                    if (fileListMatch && fileListMatch[1]) {
                        fileList = fileListMatch[1].trim().split('\n').filter(file => file.trim() !== '' && file !== 'file_index.js');
                        // Write to cache
                        fs.writeFileSync(cacheFile, JSON.stringify({ fileList, fetched: Date.now() }, null, 2));
                        console.log(`Fetched and cached ${fileList.length} files for ${category.name}`);
                    } else {
                        console.error(`Could not find file list in ${category.name} source page`);
                        fileList = [];
                    }
                } catch (err) {
                    console.error(`Error fetching ${category.name} file index:`, err);
                    fileList = [];
                }
            }
            // Process files for this category
            processFiles(fileList, category.baseUrl, aircraftData);
        }

        res.json(aircraftData);
    } catch (error) {
        console.error('Error fetching file indexes:', error);
        res.status(500).json({ error: 'Failed to fetch file indexes', details: error.message });
    }
});

module.exports = router;
