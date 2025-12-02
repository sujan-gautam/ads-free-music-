/**
 * @typedef {Object} LyricLine
 * @property {number} time - Timestamp in seconds
 * @property {string} text - Lyric line text
 * @property {number} [duration] - Optional duration of the line
 */

/**
 * @typedef {Object} LyricsData
 * @property {LyricLine[]} lines - Array of synced lyric lines
 * @property {string} source - Source of lyrics (youtube_captions, llm_generated, etc.)
 * @property {boolean} synced - Whether lyrics have timestamps
 * @property {Object} metadata - Additional metadata
 * @property {string} metadata.title - Song title
 * @property {string} metadata.artist - Artist name
 * @property {string} metadata.videoId - YouTube video ID
 */

/**
 * @typedef {Object} LyricsSource
 * @property {string} name - Name of the source
 * @property {number} priority - Priority order (lower = higher priority)
 * @property {boolean} requiresApiKey - Whether this source requires an API key
 */

module.exports = {
    // Export types for JSDoc usage
};
