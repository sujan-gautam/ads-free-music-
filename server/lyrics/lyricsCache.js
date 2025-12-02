const fs = require('fs').promises;
const path = require('path');
const crypto = require('crypto');

// Cache configuration
const CACHE_DIR = path.join(__dirname, '../../cache/lyrics');
const CACHE_TTL_MS = 30 * 24 * 60 * 60 * 1000; // 30 days
const MAX_MEMORY_CACHE_SIZE = 200; // Keep 200 most recent in memory

// In-memory cache for fast access
const memoryCache = new Map();

/**
 * Generate a cache key from song metadata
 * @param {string} title - Song title
 * @param {string} artist - Artist name
 * @param {number} duration - Song duration in seconds
 * @returns {string} - Cache key
 */
function generateCacheKey(title, artist, duration) {
    // Normalize the inputs
    const normalizedTitle = title.toLowerCase().trim();
    const normalizedArtist = artist.toLowerCase().trim();
    const normalizedDuration = Math.round(duration);
    
    // Create a hash for the filename
    const data = `${normalizedTitle}|${normalizedArtist}|${normalizedDuration}`;
    return crypto.createHash('md5').update(data).digest('hex');
}

/**
 * Ensure cache directory exists
 */
async function ensureCacheDir() {
    try {
        await fs.mkdir(CACHE_DIR, { recursive: true });
    } catch (error) {
        console.error('Failed to create cache directory:', error);
    }
}

/**
 * Get cached lyrics
 * @param {string} title - Song title
 * @param {string} artist - Artist name
 * @param {number} duration - Song duration in seconds
 * @returns {Promise<Object|null>} - Cached lyrics data or null
 */
async function getCachedLyrics(title, artist, duration) {
    const cacheKey = generateCacheKey(title, artist, duration);
    
    // Check memory cache first
    if (memoryCache.has(cacheKey)) {
        const cached = memoryCache.get(cacheKey);
        
        // Check if still valid
        if (Date.now() - cached.timestamp < CACHE_TTL_MS) {
            console.log(`💾 Lyrics served from memory cache for: ${title}`);
            return cached.data;
        } else {
            // Expired, remove from memory
            memoryCache.delete(cacheKey);
        }
    }
    
    // Check file cache
    try {
        await ensureCacheDir();
        const cacheFile = path.join(CACHE_DIR, `${cacheKey}.json`);
        
        const stats = await fs.stat(cacheFile);
        const age = Date.now() - stats.mtimeMs;
        
        // Check if cache is still valid
        if (age < CACHE_TTL_MS) {
            const content = await fs.readFile(cacheFile, 'utf8');
            const data = JSON.parse(content);
            
            // Add to memory cache for faster subsequent access
            memoryCache.set(cacheKey, {
                data,
                timestamp: stats.mtimeMs
            });
            
            // Manage memory cache size
            if (memoryCache.size > MAX_MEMORY_CACHE_SIZE) {
                const firstKey = memoryCache.keys().next().value;
                memoryCache.delete(firstKey);
            }
            
            console.log(`💾 Lyrics served from file cache for: ${title}`);
            return data;
        } else {
            // Cache expired, delete the file
            await fs.unlink(cacheFile);
            console.log(`🗑️ Expired cache deleted for: ${title}`);
        }
    } catch (error) {
        // Cache miss or error reading cache
        if (error.code !== 'ENOENT') {
            console.warn('Cache read error:', error.message);
        }
    }
    
    return null;
}

/**
 * Save lyrics to cache
 * @param {string} title - Song title
 * @param {string} artist - Artist name
 * @param {number} duration - Song duration in seconds
 * @param {Object} lyricsData - Lyrics data to cache
 */
async function saveLyricsToCache(title, artist, duration, lyricsData) {
    const cacheKey = generateCacheKey(title, artist, duration);
    
    try {
        await ensureCacheDir();
        
        // Save to file cache
        const cacheFile = path.join(CACHE_DIR, `${cacheKey}.json`);
        await fs.writeFile(cacheFile, JSON.stringify(lyricsData, null, 2), 'utf8');
        
        // Save to memory cache
        memoryCache.set(cacheKey, {
            data: lyricsData,
            timestamp: Date.now()
        });
        
        // Manage memory cache size
        if (memoryCache.size > MAX_MEMORY_CACHE_SIZE) {
            const firstKey = memoryCache.keys().next().value;
            memoryCache.delete(firstKey);
        }
        
        console.log(`💾 Lyrics cached for: ${title}`);
    } catch (error) {
        console.error('Failed to save lyrics to cache:', error.message);
    }
}

/**
 * Clear all cached lyrics
 */
async function clearAllCache() {
    try {
        // Clear memory cache
        memoryCache.clear();
        
        // Clear file cache
        await ensureCacheDir();
        const files = await fs.readdir(CACHE_DIR);
        
        for (const file of files) {
            if (file.endsWith('.json')) {
                await fs.unlink(path.join(CACHE_DIR, file));
            }
        }
        
        console.log('🗑️ All lyrics cache cleared');
        return { success: true, filesDeleted: files.length };
    } catch (error) {
        console.error('Failed to clear cache:', error.message);
        return { success: false, error: error.message };
    }
}

/**
 * Clean expired cache entries
 */
async function cleanExpiredCache() {
    try {
        await ensureCacheDir();
        const files = await fs.readdir(CACHE_DIR);
        let deletedCount = 0;
        
        for (const file of files) {
            if (!file.endsWith('.json')) continue;
            
            const filePath = path.join(CACHE_DIR, file);
            const stats = await fs.stat(filePath);
            const age = Date.now() - stats.mtimeMs;
            
            if (age > CACHE_TTL_MS) {
                await fs.unlink(filePath);
                deletedCount++;
            }
        }
        
        console.log(`🗑️ Cleaned ${deletedCount} expired cache entries`);
        return { success: true, deletedCount };
    } catch (error) {
        console.error('Failed to clean expired cache:', error.message);
        return { success: false, error: error.message };
    }
}

/**
 * Get cache statistics
 */
async function getCacheStats() {
    try {
        await ensureCacheDir();
        const files = await fs.readdir(CACHE_DIR);
        const jsonFiles = files.filter(f => f.endsWith('.json'));
        
        let totalSize = 0;
        let validCount = 0;
        let expiredCount = 0;
        
        for (const file of jsonFiles) {
            const filePath = path.join(CACHE_DIR, file);
            const stats = await fs.stat(filePath);
            totalSize += stats.size;
            
            const age = Date.now() - stats.mtimeMs;
            if (age < CACHE_TTL_MS) {
                validCount++;
            } else {
                expiredCount++;
            }
        }
        
        return {
            totalEntries: jsonFiles.length,
            validEntries: validCount,
            expiredEntries: expiredCount,
            memoryCacheSize: memoryCache.size,
            totalSizeBytes: totalSize,
            totalSizeMB: (totalSize / (1024 * 1024)).toFixed(2),
            cacheTTLDays: CACHE_TTL_MS / (24 * 60 * 60 * 1000)
        };
    } catch (error) {
        console.error('Failed to get cache stats:', error.message);
        return { error: error.message };
    }
}

module.exports = {
    getCachedLyrics,
    saveLyricsToCache,
    clearAllCache,
    cleanExpiredCache,
    getCacheStats,
    generateCacheKey
};
