/**
 * Generate timestamps for plain lyrics using LLM or heuristic approach
 * @param {string} plainLyrics - Plain text lyrics without timestamps
 * @param {number} duration - Song duration in seconds
 * @param {string} title - Song title
 * @param {string} artist - Artist name
 * @returns {Promise<import('./types').LyricLine[]>} - Array of synced lyric lines
 */
async function generateTimestamps(plainLyrics, duration, title, artist) {
    console.log(`🤖 Generating timestamps for: ${title} by ${artist}`);
    
    // Split lyrics into lines
    const lines = plainLyrics
        .split('\n')
        .map(line => line.trim())
        .filter(line => line.length > 0);
    
    if (lines.length === 0) {
        return [];
    }
    
    // Try LLM-based generation first (if API key is configured)
    if (process.env.OPENAI_API_KEY) {
        try {
            return await generateWithLLM(lines, duration, title, artist);
        } catch (error) {
            console.warn("⚠️ LLM generation failed, falling back to heuristic:", error.message);
        }
    }
    
    // Fallback to heuristic-based generation
    return generateWithHeuristic(lines, duration);
}

/**
 * Generate timestamps using LLM (OpenAI GPT)
 * @param {string[]} lines - Array of lyric lines
 * @param {number} duration - Song duration in seconds
 * @param {string} title - Song title
 * @param {string} artist - Artist name
 * @returns {Promise<import('./types').LyricLine[]>} - Array of synced lyric lines
 */
async function generateWithLLM(lines, duration, title, artist) {
    const axios = require('axios');
    
    const prompt = `Generate realistic timestamps for these song lyrics. The song is "${title}" by ${artist} and has a duration of ${duration} seconds.

Lyrics:
${lines.join('\n')}

Return a JSON array where each element has:
- "time": timestamp in seconds (float)
- "text": the lyric line

Consider:
- Natural pacing and rhythm
- Typical verse/chorus patterns
- Instrumental breaks
- Start at 0-5 seconds
- End before ${duration} seconds
- Distribute lines realistically (not evenly)

Return ONLY the JSON array, no other text.`;

    const response = await axios.post(
        'https://api.openai.com/v1/chat/completions',
        {
            model: 'gpt-3.5-turbo',
            messages: [
                { role: 'system', content: 'You are a music timing expert. Generate realistic song lyric timestamps.' },
                { role: 'user', content: prompt }
            ],
            temperature: 0.7,
            max_tokens: 2000
        },
        {
            headers: {
                'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
                'Content-Type': 'application/json'
            }
        }
    );
    
    const content = response.data.choices[0].message.content.trim();
    
    // Extract JSON from response (handle markdown code blocks)
    let jsonStr = content;
    if (content.includes('```')) {
        jsonStr = content.match(/```(?:json)?\s*([\s\S]*?)```/)?.[1] || content;
    }
    
    const timestampedLines = JSON.parse(jsonStr);
    
    console.log(`✅ Generated ${timestampedLines.length} timestamps with LLM`);
    return timestampedLines;
}

/**
 * Generate timestamps using heuristic approach (even distribution with variations)
 * @param {string[]} lines - Array of lyric lines
 * @param {number} duration - Song duration in seconds
 * @returns {import('./types').LyricLine[]} - Array of synced lyric lines
 */
function generateWithHeuristic(lines, duration) {
    const timestampedLines = [];
    
    // Start at 5 seconds (typical intro)
    const startTime = 5;
    // End 5 seconds before the end (typical outro)
    const endTime = duration - 5;
    const availableTime = endTime - startTime;
    
    // Calculate average time per line
    const avgTimePerLine = availableTime / lines.length;
    
    let currentTime = startTime;
    
    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        
        // Add some variation based on line length
        const lineLength = line.length;
        const avgLength = lines.reduce((sum, l) => sum + l.length, 0) / lines.length;
        const lengthFactor = lineLength / avgLength;
        
        // Adjust time based on line length (longer lines get slightly more time)
        const adjustedTime = avgTimePerLine * (0.8 + 0.4 * lengthFactor);
        
        timestampedLines.push({
            time: parseFloat(currentTime.toFixed(2)),
            text: line
        });
        
        currentTime += adjustedTime;
    }
    
    console.log(`✅ Generated ${timestampedLines.length} timestamps with heuristic`);
    return timestampedLines;
}

/**
 * Configuration helper for LLM API keys
 * @returns {Object} - Configuration status
 */
function getConfig() {
    return {
        hasOpenAI: !!process.env.OPENAI_API_KEY,
        hasAnthropic: !!process.env.ANTHROPIC_API_KEY,
        method: process.env.OPENAI_API_KEY ? 'llm' : 'heuristic'
    };
}

module.exports = {
    generateTimestamps,
    getConfig
};
