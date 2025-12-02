const axios = require('axios');

/**
 * Fetch synced lyrics from LRCLIB API
 * LRCLIB provides high-quality synced lyrics with accurate timestamps
 * @param {string} title - Song title
 * @param {string} artist - Artist name
 * @param {number} duration - Song duration in seconds
 * @returns {Promise<Array<{time: number, text: string}>|null>} - Synced lyric lines or null
 */
async function fetchLRCLIBLyrics(title, artist, duration) {
    try {
        console.log(`🎵 Searching LRCLIB for: "${title}" by "${artist}"`);
        
        // Clean up title and artist
        const cleanTitle = title
            .replace(/\(Lyrics\)/gi, '')
            .replace(/\(Official .*?\)/gi, '')
            .replace(/\(Audio\)/gi, '')
            .replace(/\(Video\)/gi, '')
            .replace(/\[.*?\]/g, '')
            .trim();
        
        let cleanArtist = artist;
        if (cleanTitle.includes(' - ')) {
            const parts = cleanTitle.split(' - ');
            if (parts.length === 2) {
                cleanArtist = parts[0].trim();
            }
        }
        
        cleanArtist = cleanArtist
            .replace(/\s+by\s+.*$/i, '')
            .replace(/\s+-\s+Topic$/i, '')
            .trim();
        
        // LRCLIB API endpoint
        const searchUrl = 'https://lrclib.net/api/get';
        
        const response = await axios.get(searchUrl, {
            params: {
                artist_name: cleanArtist,
                track_name: cleanTitle,
                duration: Math.round(duration)
            },
            headers: {
                'User-Agent': 'YouTube Music Player v1.0'
            }
        });
        
        if (!response.data || !response.data.syncedLyrics) {
            console.log("⚠️ No synced lyrics found on LRCLIB");
            return null;
        }
        
        // Parse LRC format
        const lrcContent = response.data.syncedLyrics;
        const lines = parseLRC(lrcContent);
        
        if (!lines || lines.length === 0) {
            console.log("❌ Failed to parse LRCLIB lyrics");
            return null;
        }
        
        console.log(`✅ Successfully fetched synced lyrics from LRCLIB (${lines.length} lines)`);
        return lines;
        
    } catch (error) {
        if (error.response && error.response.status === 404) {
            console.log("⚠️ Song not found on LRCLIB");
        } else {
            console.error("❌ LRCLIB API error:", error.message);
        }
        return null;
    }
}

/**
 * Parse LRC format lyrics into timestamped lines
 * @param {string} lrcContent - LRC format lyrics
 * @returns {Array<{time: number, text: string}>} - Parsed lyric lines
 */
function parseLRC(lrcContent) {
    const lines = [];
    const lrcLines = lrcContent.split('\n');
    
    for (const line of lrcLines) {
        // Match [mm:ss.xx] or [mm:ss] format
        const match = line.match(/\[(\d+):(\d+)\.?(\d+)?\](.*)/);
        
        if (match) {
            const minutes = parseInt(match[1]);
            const seconds = parseInt(match[2]);
            const centiseconds = match[3] ? parseInt(match[3]) : 0;
            const text = match[4].trim();
            
            // Skip empty lines and metadata
            if (!text || text.length === 0) continue;
            if (text.startsWith('[') && text.endsWith(']')) continue; // Skip metadata like [ar:Artist]
            
            const time = minutes * 60 + seconds + centiseconds / 100;
            
            lines.push({
                time: parseFloat(time.toFixed(2)),
                text: text
            });
        }
    }
    
    // Sort by time
    lines.sort((a, b) => a.time - b.time);
    
    return lines;
}

module.exports = {
    fetchLRCLIBLyrics
};
