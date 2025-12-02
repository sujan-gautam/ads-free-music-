const { fetchYoutubeCaptions } = require('./youtubeCaptions');
const { generateTimestamps } = require('./generateTimestamps');
const { fetchGeniusLyrics } = require('./geniusLyrics');
const { fetchLRCLIBLyrics } = require('./lrclibLyrics');
const { 
    getCachedLyrics, 
    saveLyricsToCache, 
    clearAllCache, 
    cleanExpiredCache,
    getCacheStats: getCacheStatsFromManager 
} = require('./lyricsCache');

/**
 * Main function to get synced lyrics with fallback chain
 * @param {string} videoId - YouTube video ID
 * @param {string} title - Song title
 * @param {string} artist - Artist name
 * @param {number} duration - Song duration in seconds
 * @returns {Promise<import('./types').LyricsData|null>} - Lyrics data or null
 */
async function getSyncedLyrics(videoId, title, artist, duration) {
    console.log(`\n🎵 Fetching lyrics for: ${title} by ${artist}`);
    
    // Check cache first (both memory and file cache)
    const cachedLyrics = await getCachedLyrics(title, artist, duration);
    if (cachedLyrics) {
        return cachedLyrics;
    }
    
    let lyricsData = null;
    
    // Strategy 1: Try YouTube Captions (best quality, already synced)
    try {
        const captionLines = await fetchYoutubeCaptions(videoId);
        if (captionLines && captionLines.length > 0) {
            lyricsData = {
                lines: captionLines,
                source: 'youtube_captions',
                synced: true,
                metadata: {
                    title,
                    artist,
                    videoId
                }
            };
            console.log("✅ Successfully fetched YouTube captions");
        }
    } catch (error) {
        console.warn("⚠️ YouTube captions failed:", error.message);
    }
    
    // Strategy 2: Try LRCLIB (high-quality synced lyrics)
    if (!lyricsData) {
        try {
            const lrclibLines = await fetchLRCLIBLyrics(title, artist, duration);
            if (lrclibLines && lrclibLines.length > 0) {
                lyricsData = {
                    lines: lrclibLines,
                    source: 'lrclib',
                    synced: true,
                    metadata: {
                        title,
                        artist,
                        videoId
                    }
                };
                console.log("✅ Successfully fetched LRCLIB synced lyrics");
            }
        } catch (error) {
            console.warn("⚠️ LRCLIB failed:", error.message);
        }
    }
    
    // Strategy 3: Try Genius API + Generate Timestamps
    if (!lyricsData) {
        try {
            const plainLyrics = await fetchGeniusLyrics(title, artist);
            if (plainLyrics && plainLyrics.length > 0) {
                console.log("🎤 Generating timestamps for Genius lyrics...");
                const timestampedLines = await generateTimestamps(plainLyrics, duration, title, artist);
                
                if (timestampedLines && timestampedLines.length > 0) {
                    lyricsData = {
                        lines: timestampedLines,
                        source: 'genius_generated',
                        synced: true,
                        metadata: {
                            title,
                            artist,
                            videoId,
                            note: 'Timestamps generated automatically'
                        }
                    };
                    console.log("✅ Successfully generated synced lyrics from Genius");
                }
            }
        } catch (error) {
            console.warn("⚠️ Genius lyrics failed:", error.message);
        }
    }
    
    // No lyrics found
    if (!lyricsData) {
        console.log("❌ No lyrics available from any source");
        return null;
    }
    
    // Save to cache (both memory and file)
    if (lyricsData) {
        await saveLyricsToCache(title, artist, duration, lyricsData);
    }
    
    return lyricsData;
}

/**
 * Clear all lyrics cache (memory and file)
 */
async function clearCache() {
    return await clearAllCache();
}

/**
 * Clean expired cache entries
 */
async function cleanCache() {
    return await cleanExpiredCache();
}

/**
 * Get cache statistics
 * @returns {Promise<Object>} - Cache stats
 */
async function getCacheStats() {
    return await getCacheStatsFromManager();
}

module.exports = {
    getSyncedLyrics,
    clearCache,
    cleanCache,
    getCacheStats
};
