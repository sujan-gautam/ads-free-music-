const axios = require('axios');
const cheerio = require('cheerio');

/**
 * Search for a song on Genius and get lyrics
 * @param {string} title - Song title
 * @param {string} artist - Artist name
 * @returns {Promise<string|null>} - Plain text lyrics or null
 */
async function fetchGeniusLyrics(title, artist) {
    const GENIUS_API_TOKEN = process.env.GENIUS_API_TOKEN;
    
    if (!GENIUS_API_TOKEN) {
        console.log("⚠️ GENIUS_API_TOKEN not configured, skipping Genius");
        return null;
    }
    
    try {
        // Clean up the title and artist for better Genius search results
        let cleanTitle = title
            .replace(/\(Lyrics\)/gi, '')
            .replace(/\(Official .*?\)/gi, '')
            .replace(/\(Audio\)/gi, '')
            .replace(/\(Video\)/gi, '')
            .replace(/\(.*?Music Video\)/gi, '')
            .replace(/\[.*?\]/g, '') // Remove [Official Video], etc.
            .replace(/\s+-\s+Topic$/i, '') // Remove "- Topic"
            .trim();
        
        // Extract artist from title if it's in "Artist - Song" format
        let cleanArtist = artist;
        if (cleanTitle.includes(' - ')) {
            const parts = cleanTitle.split(' - ');
            if (parts.length === 2) {
                cleanArtist = parts[0].trim();
                cleanTitle = parts[1].trim();
            }
        }
        
        // Remove common YouTube channel suffixes from artist
        cleanArtist = cleanArtist
            .replace(/\s+by\s+.*$/i, '') // Remove "by ChannelName"
            .replace(/\s+-\s+Topic$/i, '')
            .trim();
        
        console.log(`🔍 Searching Genius for: "${cleanTitle}" by "${cleanArtist}"`);
        
        // Step 1: Search for the song
        const searchQuery = `${cleanTitle} ${cleanArtist}`;
        const searchUrl = 'https://api.genius.com/search';
        
        const searchResponse = await axios.get(searchUrl, {
            params: { q: searchQuery },
            headers: {
                'Authorization': `Bearer ${GENIUS_API_TOKEN}`
            }
        });
        
        const hits = searchResponse.data.response.hits;
        
        if (!hits || hits.length === 0) {
            console.log("❌ No results found on Genius");
            return null;
        }
        
        // Filter out translations and prefer original versions
        const filteredHits = hits.filter(hit => {
            const title = hit.result.full_title.toLowerCase();
            // Filter out translations in various languages
            const translationKeywords = [
                'türkçe', 'çeviri', // Turkish
                'traducción', 'español', // Spanish
                'traduction', 'française', // French
                'tradução', 'português', // Portuguese
                'übersetzung', 'deutsche', // German
                'traduzione', 'italiana', // Italian
                '翻訳', '日本語', // Japanese
                '中文', '翻译', // Chinese
                'перевод', 'русский', // Russian
                'translation',
                'remix', 'cover', 'acoustic', 'live'
            ];
            
            return !translationKeywords.some(keyword => title.includes(keyword));
        });
        
        // Use filtered results if available, otherwise fall back to all results
        const resultsToUse = filteredHits.length > 0 ? filteredHits : hits;
        
        // Get the first result (most relevant)
        const song = resultsToUse[0].result;
        const songUrl = song.url;
        
        console.log(`✅ Found song on Genius: ${song.full_title}`);
        console.log(`📄 Fetching lyrics from: ${songUrl}`);
        
        // Step 2: Scrape lyrics from the song page
        const pageResponse = await axios.get(songUrl);
        const $ = cheerio.load(pageResponse.data);
        
        // Genius uses different selectors, try multiple approaches
        let lyrics = '';
        
        // Try the main lyrics container
        const lyricsContainers = $('[class*="Lyrics__Container"]');
        
        if (lyricsContainers.length > 0) {
            lyricsContainers.each((i, elem) => {
                // Get text and preserve line breaks
                const text = $(elem).html();
                if (text) {
                    // Replace <br> tags with newlines
                    const cleanText = text
                        .replace(/<br\s*\/?>/gi, '\n')
                        .replace(/<[^>]*>/g, '') // Remove other HTML tags
                        .trim();
                    
                    lyrics += cleanText + '\n\n';
                }
            });
        }
        
        // Fallback: try older Genius HTML structure
        if (!lyrics) {
            const oldContainer = $('.lyrics');
            if (oldContainer.length > 0) {
                lyrics = oldContainer.text().trim();
            }
        }
        
        if (!lyrics) {
            console.log("❌ Could not extract lyrics from Genius page");
            return null;
        }
        
        // Clean up the lyrics - remove obvious metadata but keep lyrics
        lyrics = lyrics
            .split('\n')
            .map(line => line.trim())
            .filter(line => {
                // Filter out empty lines
                if (line.length === 0) return false;
                
                // Filter out only very obvious metadata patterns
                if (line.match(/^\d+\s+Contributors?$/i)) return false;
                if (line.match(/^\d+\s+Contributor/i)) return false; // "1 Contributor"
                if (line.match(/^Translations?$/i)) return false;
                if (line.match(/^Romanization$/i)) return false;
                if (line.match(/^English$/i)) return false;
                if (line.match(/Lyrics$/i) && line.length < 15) return false; // Only if it's just "Lyrics"
                if (line.match(/^Read More\.\.\.$/i)) return false;
                if (line === '&nbsp;') return false;
                if (line.match(/Türkçe|Çeviri|Traducción|Traduction/i)) return false; // Translation headers
                
                // Keep everything else (including actual lyrics)
                return true;
            })
            .join('\n');
        
        // Remove section markers like [Verse 1], [Chorus], etc. for cleaner display
        lyrics = lyrics.replace(/\[.*?\]\n?/g, '');
        
        // Final cleanup - remove any remaining multiple newlines
        lyrics = lyrics.replace(/\n{3,}/g, '\n\n').trim();
        
        if (!lyrics || lyrics.length < 20) {
            console.log("❌ Lyrics too short or invalid after filtering");
            return null;
        }
        
        console.log(`✅ Successfully fetched lyrics from Genius (${lyrics.split('\n').length} lines)`);
        return lyrics;
        
    } catch (error) {
        console.error("❌ Genius API error:", error.message);
        return null;
    }
}

module.exports = {
    fetchGeniusLyrics
};
