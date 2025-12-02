const { spawn } = require("child_process");
const path = require("path");

// Use bundled yt-dlp binary (works on both Windows and Linux)
const YTDLP_BINARY = process.platform === 'win32' ? 'yt-dlp.exe' : 'yt-dlp';
const YTDLP = path.join(__dirname, "..", "..", "bin", YTDLP_BINARY);

/**
 * Parse WebVTT timestamp to seconds
 * @param {string} timestamp - WebVTT timestamp (e.g., "00:01:23.456")
 * @returns {number} - Time in seconds
 */
function parseTimestamp(timestamp) {
    const parts = timestamp.split(':');
    if (parts.length === 3) {
        const hours = parseFloat(parts[0]);
        const minutes = parseFloat(parts[1]);
        const seconds = parseFloat(parts[2]);
        return hours * 3600 + minutes * 60 + seconds;
    } else if (parts.length === 2) {
        const minutes = parseFloat(parts[0]);
        const seconds = parseFloat(parts[1]);
        return minutes * 60 + seconds;
    }
    return parseFloat(timestamp);
}

/**
 * Clean caption text (remove formatting, duplicates, etc.)
 * @param {string} text - Raw caption text
 * @returns {string} - Cleaned text
 */
function cleanCaptionText(text) {
    return text
        .replace(/<[^>]*>/g, '') // Remove HTML tags
        .replace(/\[.*?\]/g, '') // Remove [Music], [Applause], etc.
        .replace(/♪/g, '') // Remove music notes
        .trim();
}

/**
 * Fetch synced lyrics from YouTube automatic captions
 * @param {string} videoId - YouTube video ID
 * @returns {Promise<import('./types').LyricLine[]|null>} - Array of synced lyric lines or null
 */
async function fetchYoutubeCaptions(videoId) {
    return new Promise((resolve) => {
        const videoUrl = `https://www.youtube.com/watch?v=${videoId}`;
        
        console.log(`🎵 Fetching YouTube captions for: ${videoId}`);
        
        // Get subtitle list first
        const listSubs = spawn(YTDLP, [
            "--list-subs",
            "--skip-download",
            videoUrl
        ]);

        let hasSubtitles = false;
        let output = "";

        listSubs.stdout.on("data", (data) => {
            output += data.toString();
            if (output.includes("Available subtitles")) {
                hasSubtitles = true;
            }
        });

        listSubs.on("close", (code) => {
            if (!hasSubtitles) {
                console.log("❌ No captions available for this video");
                return resolve(null);
            }

            // Download subtitles in VTT format
            const getSubs = spawn(YTDLP, [
                "--write-auto-sub",
                "--sub-lang", "en",
                "--sub-format", "vtt",
                "--skip-download",
                "--output", "temp_subs",
                videoUrl
            ]);

            getSubs.on("close", (code) => {
                if (code !== 0) {
                    console.log("❌ Failed to download captions");
                    return resolve(null);
                }

                // Parse VTT file
                const fs = require("fs");
                const vttPath = "temp_subs.en.vtt";
                
                if (!fs.existsSync(vttPath)) {
                    console.log("❌ VTT file not found");
                    return resolve(null);
                }

                try {
                    const vttContent = fs.readFileSync(vttPath, "utf8");
                    const lines = parseVTT(vttContent);
                    
                    // Clean up temp file
                    fs.unlinkSync(vttPath);
                    
                    console.log(`✅ Fetched ${lines.length} caption lines`);
                    resolve(lines);
                } catch (error) {
                    console.error("❌ Error parsing VTT:", error);
                    resolve(null);
                }
            });
        });
    });
}

/**
 * Parse VTT content into lyric lines
 * @param {string} vttContent - Raw VTT file content
 * @returns {import('./types').LyricLine[]} - Array of lyric lines
 */
function parseVTT(vttContent) {
    const lines = [];
    const blocks = vttContent.split('\n\n');
    
    for (const block of blocks) {
        const blockLines = block.split('\n');
        
        // Find timestamp line (format: 00:00:00.000 --> 00:00:05.000)
        const timestampLine = blockLines.find(line => line.includes('-->'));
        if (!timestampLine) continue;
        
        const [startTime] = timestampLine.split('-->').map(t => t.trim());
        const time = parseTimestamp(startTime);
        
        // Get text lines (everything after timestamp)
        const textLines = blockLines.slice(blockLines.indexOf(timestampLine) + 1);
        const text = cleanCaptionText(textLines.join(' '));
        
        if (text && text.length > 0) {
            lines.push({ time, text });
        }
    }
    
    // Merge duplicate/similar consecutive lines
    const merged = [];
    for (let i = 0; i < lines.length; i++) {
        if (i === 0 || lines[i].text !== lines[i - 1].text) {
            merged.push(lines[i]);
        }
    }
    
    return merged;
}

module.exports = {
    fetchYoutubeCaptions
};
