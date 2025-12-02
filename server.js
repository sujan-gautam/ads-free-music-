// -------------------------------
// Ultra-Fast YouTube Music Streamer
// -------------------------------

// Load environment variables
require('dotenv').config();

const express = require("express");
const cors = require("cors");
const { spawn } = require("child_process");
const fs = require("fs");
const crypto = require("crypto");
const path = require("path");
const { getSyncedLyrics, clearCache: clearLyricsCache, cleanCache: cleanLyricsCache, getCacheStats: getLyricsCacheStats } = require("./server/lyrics/getLyrics");


const app = express();
const http = require("http").createServer(app);
const io = require("socket.io")(http, { 
  cors: { 
    origin: "*",
    methods: ["GET", "POST"]
  } 
});

const PORT = process.env.PORT || 5000;

// Use bundled yt-dlp.exe from bin directory
const YTDLP = path.join(__dirname, "bin", "yt-dlp.exe");

console.log(`Using yt-dlp from: ${YTDLP}`);

// Store connected clients
const clients = new Map();

// Cache directory for downloaded audio
const CACHE_DIR = path.join(__dirname, "cache");
if (!fs.existsSync(CACHE_DIR)) {
  fs.mkdirSync(CACHE_DIR, { recursive: true });
}

// Play history storage
const HISTORY_FILE = path.join(__dirname, "play-history.json");
let playHistory = [];

// Load play history
if (fs.existsSync(HISTORY_FILE)) {
  try {
    playHistory = JSON.parse(fs.readFileSync(HISTORY_FILE, 'utf8'));
  } catch (e) {
    playHistory = [];
  }
}

// Save play history
function savePlayHistory() {
  fs.writeFileSync(HISTORY_FILE, JSON.stringify(playHistory.slice(0, 50), null, 2));
}

// Add to play history
function addToHistory(track) {
  const existing = playHistory.findIndex(t => t.videoId === track.videoId);
  if (existing !== -1) {
    playHistory.splice(existing, 1);
  }
  playHistory.unshift({
    ...track,
    playedAt: new Date().toISOString()
  });
  savePlayHistory();
}

// Generate cache key from URL
function getCacheKey(url) {
  return crypto.createHash('md5').update(url).digest('hex');
}

// Get cache file path
function getCachePath(url) {
  const key = getCacheKey(url);
  return path.join(CACHE_DIR, `${key}.webm`);
}

app.use(cors());
app.use(express.json());

// ----------------------------------------------------------
// CACHING & PRE-FETCHING
// ----------------------------------------------------------
const exploreCache = {};
const EXPLORE_CATEGORIES = [
    { id: 'trending', query: 'popular music 2024' },
    { id: 'top-charts', query: 'top 50 global hits' },
    { id: 'new-releases', query: 'new music releases 2024' },
    { id: 'lo-fi', query: 'lofi hip hop radio' },
    { id: 'pop', query: 'pop music hits' },
    { id: 'rock', query: 'rock music hits' },
    { id: 'hip-hop', query: 'hip hop hits' }
];

// Reusable Search Function
function searchYouTube(query, limit = 20) {
    return new Promise((resolve, reject) => {
        const search = spawn(YTDLP, [
            "--dump-json",
            "--flat-playlist",
            "--skip-download",
            "--no-warnings",
            "--no-call-home",
            "--no-check-certificate",
            "--prefer-insecure",
            "--socket-timeout", "10",
            "--extractor-args", "youtube:player_client=android",
            `ytsearch${limit}:${query}`
        ]);

        let output = "";
        search.stdout.on("data", (data) => output += data.toString());
        
        search.on("close", (code) => {
            if (code !== 0) return reject(new Error("Search process failed"));
            try {
                const results = output.trim().split("\n").filter(l => l.trim()).map(l => {
                    try {
                        const d = JSON.parse(l);
                        return {
                            videoId: d.id,
                            title: d.title,
                            uploader: d.uploader || d.channel || "Unknown",
                            thumbnail: d.thumbnail || `https://i.ytimg.com/vi/${d.id}/hqdefault.jpg`,
                            duration: d.duration || 0,
                            url: `https://www.youtube.com/watch?v=${d.id}`
                        };
                    } catch (e) { return null; }
                }).filter(i => i);
                resolve(results);
            } catch (e) { reject(e); }
        });
    });
}

async function prefetchExploreData() {
    console.log("[PREFETCH] Starting background pre-fetch for Explore categories...");
    for (const cat of EXPLORE_CATEGORIES) {
        try {
            console.log(`[PREFETCH] Fetching: ${cat.id}...`);
            const results = await searchYouTube(cat.query, 25);
            exploreCache[cat.id] = results;
            console.log(`[PREFETCH] Cached ${results.length} tracks for ${cat.id}`);
        } catch (err) {
            console.error(`[PREFETCH] Failed to pre-fetch ${cat.id}:`, err.message);
        }
    }
    console.log("[PREFETCH] Complete! Explore page is now instant.");
}

// ----------------------------------------------------------
// TRENDING MUSIC ENDPOINT
// ----------------------------------------------------------
app.get("/trending", async (req, res) => {
  try {
    // Serve from cache if available
    if (exploreCache['trending']) {
        console.log("[TRENDING] Serving from cache");
        return res.json({ results: exploreCache['trending'] });
    }

    console.log("[TRENDING] Fetching uncached...");
    const results = await searchYouTube("popular music 2024", 25);
    exploreCache['trending'] = results; // Cache it for next time
    res.json({ results });

  } catch (error) {
    console.error("[TRENDING] Error:", error.message);
    res.status(500).json({ error: "Failed to fetch trending" });
  }
});

// ----------------------------------------------------------
// PLAY HISTORY ENDPOINT
// ----------------------------------------------------------
app.get("/history", (req, res) => {
  res.json({ history: playHistory.slice(0, 20) });
});

// ----------------------------------------------------------
// HYBRID STREAMING ROUTE - with caching for faster playback
// ----------------------------------------------------------
app.get("/stream", async (req, res) => {
    const videoURL = req.query.url;
    if (!videoURL) return res.status(400).send("Missing URL");

    // Handle HEAD requests for health checks
    if (req.method === 'HEAD') {
        res.setHeader("Access-Control-Allow-Origin", "*");
        res.setHeader("Content-Type", "audio/webm");
        return res.status(200).end();
    }

    const cachePath = getCachePath(videoURL);
    const range = req.headers.range;

    res.setHeader("Access-Control-Allow-Origin", "*");

    // ===============================
    // 1. SERVE FROM CACHE WITH SEEKING
    // ===============================
    if (fs.existsSync(cachePath)) {
        // Check if file is empty (failed download)
        const stat = fs.statSync(cachePath);
        if (stat.size === 0) {
            fs.unlinkSync(cachePath); // Delete empty file
        } else {
            console.log("[STREAM] Serving from cache with Range support:", cachePath);
            const fileSize = stat.size;

            if (!range) {
                res.writeHead(200, {
                    "Content-Type": "audio/webm",
                    "Content-Length": fileSize
                });
                return fs.createReadStream(cachePath).pipe(res);
            }

            const parts = range.replace(/bytes=/, "").split("-");
            const start = parseInt(parts[0], 10);
            const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;

            console.log(`[STREAM] Cache Range Request: ${start} - ${end}`);

            res.writeHead(206, {
                "Content-Range": `bytes ${start}-${end}/${fileSize}`,
                "Accept-Ranges": "bytes",
                "Content-Length": end - start + 1,
                "Content-Type": "audio/webm"
            });

            return fs.createReadStream(cachePath, { start, end }).pipe(res);
        }
    }

    // ===============================
    // 2. LIVE STREAM (REDIRECT + BACKGROUND CACHE)
    // ===============================
    console.log("[STREAM] Fetching direct URL for live streaming...");

    // Try multiple format options with fallbacks
    const formatOptions = [
        "bestaudio[ext=m4a]/bestaudio[ext=webm]/bestaudio",  // Prefer m4a or webm
        "bestaudio/best",  // Fallback to any best audio
        "worst"  // Last resort
    ];

    let formatIndex = 0;

    const tryGetUrl = () => {
        if (formatIndex >= formatOptions.length) {
            console.error("[STREAM] All format options failed");
            return res.status(500).send("Streaming failed - no available formats");
        }

        const currentFormat = formatOptions[formatIndex];
        console.log(`[STREAM] Trying format: ${currentFormat}`);

        const getUrl = spawn(YTDLP, [
            "-g",
            "-f", currentFormat,
            "--extractor-args", "youtube:player_client=android,ios",
            "--geo-bypass",
            "--no-check-certificate",
            "--prefer-insecure",
            "--no-warnings",
            "--socket-timeout", "30",
            videoURL
        ]);

        let directUrl = "";
        let error = "";

        getUrl.stdout.on("data", (data) => {
            directUrl += data.toString().trim();
        });

        getUrl.stderr.on("data", (data) => {
            error += data.toString();
        });

        getUrl.on("close", (code) => {
            if (code !== 0 || !directUrl) {
                console.warn(`[STREAM] Format ${currentFormat} failed:`, error.substring(0, 200));
                formatIndex++;
                tryGetUrl();  // Try next format
                return;
            }

            console.log(`[STREAM] Successfully got URL with format: ${currentFormat}`);
            console.log("[STREAM] Redirecting to direct URL (supports seeking)");
            res.redirect(directUrl);

            // Start background download to cache
            console.log("[STREAM] Starting background cache download...");
            const download = spawn(YTDLP, [
                "-f", currentFormat,
                "-o", cachePath,
                "--no-playlist",
                "--quiet",
                "--no-warnings",
                "--extractor-args", "youtube:player_client=android,ios",
                "--geo-bypass",
                "--no-check-certificate",
                "--retries", "10",
                "--fragment-retries", "10",
                videoURL
            ]);

            download.on("close", (code) => {
                if (code === 0) {
                    console.log("[STREAM] Background cache complete:", cachePath);
                } else {
                    console.error("[STREAM] Background cache failed");
                    if (fs.existsSync(cachePath)) fs.unlinkSync(cachePath);
                }
            });
        });

        getUrl.on("error", (err) => {
            console.error("[STREAM] Spawn error:", err);
            formatIndex++;
            tryGetUrl();  // Try next format
        });
    };

    try {
        tryGetUrl();
    } catch (err) {
        console.error("[STREAM] Error:", err);
        res.status(500).send("Server Error");
    }
});

// ----------------------------------------------------------
// TRACK PLAY ENDPOINT - for history tracking
// ----------------------------------------------------------
app.post("/play", express.json(), (req, res) => {
  const track = req.body;
  
  if (!track || !track.videoId) {
    return res.status(400).json({ error: "Invalid track data" });
  }
  
  addToHistory(track);
  console.log("[HISTORY] Added:", track.title);
  
  res.json({ success: true });
});

// ----------------------------------------------------------
// METADATA EXTRACTION ROUTE - yt-dlp (reliable)
// ----------------------------------------------------------
app.get("/metadata", async (req, res) => {
  const videoURL = req.query.url;
  if (!videoURL) return res.status(400).json({ error: "Missing URL" });

  try {
    console.log("[METADATA] Fetching for:", videoURL);
    
    const proc = spawn(YTDLP, [
      "--dump-json",
      "--no-playlist",
      "--no-warnings",
      "--extractor-args", "youtube:player_client=android",
      videoURL
    ]);

    let output = "";
    
    proc.stdout.on("data", (data) => output += data.toString());
    
    proc.on("close", (code) => {
        if (code !== 0) {
            return res.status(500).json({ error: "Metadata fetch failed" });
        }
        try {
            const data = JSON.parse(output);
            const metadata = {
                title: data.title,
                uploader: data.uploader || data.channel,
                thumbnail: data.thumbnail,
                duration: data.duration,
                viewCount: data.view_count,
                videoId: data.id,
                url: videoURL
            };
            console.log("[METADATA] Fetched:", metadata.title);
            res.json(metadata);
        } catch (e) {
            res.status(500).json({ error: "Parse error" });
        }
    });

  } catch (error) {
    console.error("[METADATA] Error:", error.message);
    res.status(500).json({ error: "Failed to fetch metadata" });
  }
});

// ----------------------------------------------------------
// SEARCH ROUTE (OPTIMIZED FOR SPEED)
// ----------------------------------------------------------
app.get("/search", async (req, res) => {
  const query = req.query.q;
  if (!query) return res.status(400).json({ error: "Missing query" });

  try {
    console.log("[SEARCH] Searching for:", query);

    // Use yt-dlp to search YouTube with speed optimizations
    const search = spawn(YTDLP, [
      "--dump-json",
      "--flat-playlist",
      "--skip-download",
      "--no-warnings",
      "--no-call-home",
      "--no-check-certificate",
      "--prefer-insecure",
      "--socket-timeout", "10",
      "--extractor-args", "youtube:player_client=android",
      `ytsearch50:${query}` // Increased to 50 results for comprehensive search
    ]);

    let output = "";
    let errorOutput = "";

    search.stdout.on("data", (data) => {
      output += data.toString();
    });

    search.stderr.on("data", (data) => {
      errorOutput += data.toString();
    });

    search.on("close", (code) => {
      if (code !== 0) {
        console.error("[SEARCH] Error:", errorOutput);
        return res.status(500).json({ error: "Search failed" });
      }

      try {
        // Parse JSON lines
        const results = output
          .trim()
          .split("\n")
          .filter(line => line.trim())
          .map(line => {
            try {
              const data = JSON.parse(line);
              return {
                videoId: data.id,
                title: data.title,
                uploader: data.uploader || data.channel || "Unknown",
                thumbnail: data.thumbnail || `https://i.ytimg.com/vi/${data.id}/hqdefault.jpg`,
                duration: data.duration || 0,
                url: `https://www.youtube.com/watch?v=${data.id}`
              };
            } catch (e) {
              return null;
            }
          })
          .filter(item => item !== null);

        console.log(`[SEARCH] Found ${results.length} results for: ${query}`);
        res.json({ results });
      } catch (error) {
        console.error("[SEARCH] Parse Error:", error);
        res.status(500).json({ error: "Failed to parse search results" });
      }
    });

    search.on("error", (err) => {
      console.error("[SEARCH] Spawn error:", err);
      res.status(500).json({ error: "Search failed" });
    });

  } catch (error) {
    console.error("[SEARCH] Error:", error.message);
    res.status(500).json({ error: "Search failed" });
  }
});

// ----------------------------------------------------------
// DATA STORAGE (Playlists & Favorites)
// ----------------------------------------------------------
const PLAYLISTS_FILE = path.join(__dirname, "playlists.json");
const FAVORITES_FILE = path.join(__dirname, "favorites.json");

let playlists = [];
let favorites = [];

// Load data
try {
    if (fs.existsSync(PLAYLISTS_FILE)) playlists = JSON.parse(fs.readFileSync(PLAYLISTS_FILE, 'utf8'));
    if (fs.existsSync(FAVORITES_FILE)) favorites = JSON.parse(fs.readFileSync(FAVORITES_FILE, 'utf8'));
} catch (e) {
    console.error("Error loading data:", e);
}

function saveData() {
    fs.writeFileSync(PLAYLISTS_FILE, JSON.stringify(playlists, null, 2));
    fs.writeFileSync(FAVORITES_FILE, JSON.stringify(favorites, null, 2));
}

// ----------------------------------------------------------
// EXPLORE / TRENDING ENDPOINT
// ----------------------------------------------------------
app.get("/explore", async (req, res) => {
    const category = req.query.category || "trending";
    
    // Check cache first
    if (exploreCache[category]) {
        console.log(`[EXPLORE] Serving ${category} from cache`);
        return res.json({ results: exploreCache[category] });
    }

    // Fallback logic
    const catConfig = EXPLORE_CATEGORIES.find(c => c.id === category);
    const searchTerm = catConfig ? catConfig.query : "popular music 2024";

    try {
        console.log(`[EXPLORE] Fetching (uncached): ${category} (${searchTerm})`);
        const results = await searchYouTube(searchTerm, 25);
        exploreCache[category] = results; // Cache it
        res.json({ results });
    } catch (e) { 
        console.error("Explore error:", e);
        res.status(500).json({ error: "Server error" }); 
    }
});

// ----------------------------------------------------------
// FAVORITES ENDPOINTS
// ----------------------------------------------------------
app.get("/favorites", (req, res) => res.json({ favorites }));

app.post("/favorites", (req, res) => {
    const track = req.body;
    if (!track || !track.videoId) return res.status(400).json({ error: "Invalid track" });

    const index = favorites.findIndex(t => t.videoId === track.videoId);
    if (index === -1) {
        favorites.unshift(track); // Add
    } else {
        favorites.splice(index, 1); // Remove
    }
    saveData();
    res.json({ success: true, isFavorite: index === -1, favorites });
});

// ----------------------------------------------------------
// PLAYLISTS ENDPOINTS
// ----------------------------------------------------------
app.get("/playlists", (req, res) => res.json({ playlists }));

app.post("/playlists", (req, res) => {
    const { name } = req.body;
    if (!name) return res.status(400).json({ error: "Name required" });

    const newPlaylist = {
        id: crypto.randomUUID(),
        name,
        tracks: [],
        createdAt: new Date().toISOString()
    };
    playlists.push(newPlaylist);
    saveData();
    res.json({ success: true, playlist: newPlaylist });
});

app.post("/playlists/:id/add", (req, res) => {
    const { id } = req.params;
    const track = req.body;
    const playlist = playlists.find(p => p.id === id);
    
    if (!playlist) return res.status(404).json({ error: "Playlist not found" });
    
    // Avoid duplicates
    if (!playlist.tracks.some(t => t.videoId === track.videoId)) {
        playlist.tracks.push(track);
        saveData();
    }
    res.json({ success: true, playlist });
});

app.delete("/playlists/:id/tracks/:videoId", (req, res) => {
    const { id, videoId } = req.params;
    const playlist = playlists.find(p => p.id === id);
    
    if (!playlist) return res.status(404).json({ error: "Playlist not found" });
    
    playlist.tracks = playlist.tracks.filter(t => t.videoId !== videoId);
    saveData();
    res.json({ success: true, playlist });
});

app.delete("/playlists/:id", (req, res) => {
    const { id } = req.params;
    playlists = playlists.filter(p => p.id !== id);
    saveData();
    res.json({ success: true });
});

// ----------------------------------------------------------
// YOUTUBE MUSIC PLAYLISTS
// ----------------------------------------------------------

// Curated playlist categories using search queries
const YOUTUBE_MUSIC_PLAYLISTS = {
    newTrending: [
        { id: "new-releases-2024", name: "RELEASED", description: "The hottest new songs this week, served up fresh to you every Friday.", songs: 20, query: "new music 2024" },
        { id: "trending-shorts", name: "The Short List", description: "Check out the biggest trending tracks on YouTube Shorts.", songs: 20, query: "trending music shorts 2024" },
        { id: "pop-hits-2024", name: "Pop Before It Breaks", description: "An essential preview of tomorrow's pop hits.", songs: 20, query: "new pop hits 2024" },
        { id: "viral-hits", name: "Hashtag Hits", description: "Check out all the tracks that are buzzing right now on socials.", songs: 20, query: "viral songs 2024" }
    ],
    biggestHits: [
        { id: "hit-list-us", name: "The Hit List", description: "Today's biggest hits and hottest tracks from across the US pop landscape.", songs: 20, query: "top hits 2024" },
        { id: "pop-certified", name: "Pop Certified", description: "The biggest and best pop songs in the USA right now.", songs: 20, query: "popular pop songs 2024" },
        { id: "hip-hop-hits", name: "On Everything: Today's Hip-Hop Hits", description: "The hottest US hip-hop tracks out now... and that's on everything.", songs: 20, query: "hip hop hits 2024" },
        { id: "latin-now", name: "Latin Now", description: "Today's biggest Latin Hits.", songs: 20, query: "latin hits 2024" }
    ],
    moodVibes: [
        { id: "beast-mode", name: "Beast Mode Hip Hop", description: "Enter beast mode with this aggressive, hard-hitting mix of new and classic hip hop tracks.", songs: 20, query: "workout hip hop" },
        { id: "pump-up-pop", name: "Pump-Up Pop", description: "Elevate your mood (and your heart rate) with these pop anthems.", songs: 20, query: "upbeat pop songs" },
        { id: "country-tailgate", name: "Country Tailgate", description: "Drop the tailgate and turn up this collection of infectious country hits to get the party started.", songs: 20, query: "country party songs" },
        { id: "lofi-loft", name: "Lofi Loft", description: "Kick back and coast to these chillhop and lofi beats.", songs: 20, query: "lofi hip hop beats" }
    ],
    throwbacks: [
        { id: "hits-10s", name: "The Hits: '10s", description: "Relive some of the biggest tracks of the 2010s.", songs: 20, query: "2010s hits" },
        { id: "classic-rock", name: "Classic Rock's Greatest Hits", description: "The most empowering hits from the classic rock era.", songs: 20, query: "classic rock greatest hits" },
        { id: "00s-hip-hop", name: "Essential '00s Hip Hop", description: "Take a trip through a triumphant decade of some of the biggest contemporary hip hop hits.", songs: 20, query: "2000s hip hop" },
        { id: "90s-country", name: "'90s Country", description: "Go back to the golden era of country music with the hits that defined the decade.", songs: 20, query: "90s country hits" }
    ]
};

// Cache for playlist data
const playlistCache = {};

// Get curated playlists
app.get("/youtube-music/playlists", (req, res) => {
    try {
        res.json({
            success: true,
            playlists: YOUTUBE_MUSIC_PLAYLISTS
        });
    } catch (error) {
        console.error("Failed to fetch playlists:", error);
        res.status(500).json({ error: "Failed to fetch playlists" });
    }
});

// Get specific playlist tracks using search
app.get("/youtube-music/playlist/:id", async (req, res) => {
    try {
        const playlistId = req.params.id;
        
        // Check cache first
        if (playlistCache[playlistId]) {
            return res.json({
                success: true,
                tracks: playlistCache[playlistId]
            });
        }

        // Find the playlist config
        let playlistConfig = null;
        for (const category of Object.values(YOUTUBE_MUSIC_PLAYLISTS)) {
            playlistConfig = category.find(p => p.id === playlistId);
            if (playlistConfig) break;
        }

        if (!playlistConfig) {
            return res.status(404).json({ error: "Playlist not found" });
        }

        // Use search to get tracks
        const tracks = await searchYouTube(playlistConfig.query, 20);
        
        // Cache the results
        playlistCache[playlistId] = tracks;
        
        res.json({
            success: true,
            tracks: tracks
        });
    } catch (error) {
        console.error("Playlist fetch failed:", error);
        res.status(500).json({ error: "Playlist fetch failed" });
    }
});

// ----------------------------------------------------------
// LYRICS ENDPOINT
// ----------------------------------------------------------
app.get("/lyrics", async (req, res) => {
    try {
        const { videoId, title, artist, duration } = req.query;
        
        if (!videoId) {
            return res.status(400).json({ error: "videoId is required" });
        }
        
        const songTitle = title || "Unknown";
        const songArtist = artist || "Unknown";
        const songDuration = duration ? parseFloat(duration) : 180; // Default 3 minutes
        
        console.log(`\n[LYRICS] Request: ${songTitle} by ${songArtist} (${videoId})`);
        
        const lyricsData = await getSyncedLyrics(videoId, songTitle, songArtist, songDuration);
        
        if (!lyricsData) {
            return res.json({
                success: false,
                message: "No lyrics available for this track",
                lyrics: null
            });
        }
        
        res.json({
            success: true,
            lyrics: lyricsData
        });
        
    } catch (error) {
        console.error("[LYRICS] Error:", error);
        res.status(500).json({ 
            success: false,
            error: "Failed to fetch lyrics",
            message: error.message
        });
    }
});

// Lyrics cache management endpoints
app.get("/lyrics/cache/stats", async (req, res) => {
    try {
        const stats = await getLyricsCacheStats();
        res.json({ success: true, stats });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

app.post("/lyrics/cache/clear", async (req, res) => {
    try {
        const result = await clearLyricsCache();
        res.json({ success: true, message: "Lyrics cache cleared", result });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

app.post("/lyrics/cache/clean", async (req, res) => {
    try {
        const result = await cleanLyricsCache();
        res.json({ success: true, message: "Expired cache entries cleaned", result });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// ----------------------------------------------------------
// HEALTH CHECK
// ----------------------------------------------------------
app.get("/health", (req, res) => {
  res.json({ 
    status: "ok", 
    timestamp: new Date().toISOString(),
    connectedClients: clients.size
  });
});

// ----------------------------------------------------------
// SOCKET.IO
// ----------------------------------------------------------
io.on("connection", (socket) => {
  const clientId = socket.id;
  clients.set(clientId, socket);
  console.log(`[SOCKET] User connected: ${clientId} (Total: ${clients.size})`);

  socket.on("disconnect", () => {
    clients.delete(clientId);
    console.log(`[SOCKET] User disconnected: ${clientId} (Total: ${clients.size})`);
  });

  // Handle custom events
  socket.on("requestProgress", (data) => {
    socket.emit("progressEventSocket", data);
  });
});

// ----------------------------------------------------------
// START SERVER
// ----------------------------------------------------------
http.listen(PORT, () => {
  console.log(`
==========================================================
   ROCKET YouTube Music Streamer - Backend Server          
   -------------------------------------------------  
   Server running at: http://localhost:${PORT}            
   yt-dlp path: ${YTDLP}                                  
   -------------------------------------------------  
   Endpoints:                                           
     GET  /stream?url=<youtube_url>                     
     GET  /metadata?url=<youtube_url>                   
     GET  /search?q=<search_query>                      
     GET  /health                                       
==========================================================
  `);
  
  // Start pre-fetching data
  prefetchExploreData();
  
  // Clean expired lyrics cache on startup
  cleanLyricsCache().then(result => {
    console.log(`[CACHE] Cleaned ${result.deletedCount || 0} expired lyrics cache entries on startup`);
  }).catch(err => {
    console.error('[CACHE] Failed to clean lyrics cache on startup:', err);
  });
  
  // Schedule periodic cache cleaning (every 24 hours)
  setInterval(async () => {
    try {
      const result = await cleanLyricsCache();
      console.log(`[CACHE] Periodic cleanup: Removed ${result.deletedCount || 0} expired entries`);
    } catch (err) {
      console.error('[CACHE] Periodic cleanup failed:', err);
    }
  }, 24 * 60 * 60 * 1000); // 24 hours
});
