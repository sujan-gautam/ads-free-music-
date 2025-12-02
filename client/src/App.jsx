import React, { useState, useEffect, useRef, useCallback } from "react";
import io from "socket.io-client";
import axios from "axios";
import { AnimatePresence, motion } from 'framer-motion';


// Components
import Sidebar from './components/Sidebar';
import MobileNav from './components/MobileNav';
import PlayerBar from './components/PlayerBar';
import HomeView from './components/HomeView';
import ExploreView from './components/ExploreView';
import SearchView from './components/SearchView';
import QueueView from './components/QueueView';
import LibraryView from './components/LibraryView';
import PlaylistDetailView from './components/PlaylistDetailView';
import YoutubePlaylistView from './components/YoutubePlaylistView';
import AddToPlaylistModal from './components/AddToPlaylistModal';
import LyricsView from './components/LyricsView';
import { useLyrics } from './hooks/useLyrics';

const API_URL = "http://localhost:5000";
const socket = io(API_URL);

function App() {
    // -- State --
    const [activeView, setActiveView] = useState('home');
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    // Player State
    const [currentTrack, setCurrentTrack] = useState(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [queue, setQueue] = useState([]);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [volume, setVolume] = useState(1);
    const [isMuted, setIsMuted] = useState(false);
    const [shuffle, setShuffle] = useState(false);
    const [repeat, setRepeat] = useState(false);

    // Data State
    const [searchQuery, setSearchQuery] = useState("");
    const [searchResults, setSearchResults] = useState([]);
    const [isSearching, setIsSearching] = useState(false);
    const [favorites, setFavorites] = useState([]);
    const [playlists, setPlaylists] = useState([]);
    const [trendingTracks, setTrendingTracks] = useState([]);
    const [playHistory, setPlayHistory] = useState([]);
    const [isLoadingTrending, setIsLoadingTrending] = useState(true);

    // Modal State
    const [isPlaylistModalOpen, setIsPlaylistModalOpen] = useState(false);
    const [trackToAdd, setTrackToAdd] = useState(null);
    const [selectedPlaylistId, setSelectedPlaylistId] = useState(null);

    // YouTube Music Playlist State
    const [selectedYoutubePlaylist, setSelectedYoutubePlaylist] = useState(null);
    const [youtubePlaylistTracks, setYoutubePlaylistTracks] = useState([]);

    // Lyrics State
    const [isLyricsPanelOpen, setIsLyricsPanelOpen] = useState(false);
    const [karaokeMode, setKaraokeMode] = useState(false);
    const { lyrics, isLoading: isLoadingLyrics, error: lyricsError, refetch: refetchLyrics } = useLyrics(currentTrack);

    const audioRef = useRef(new Audio());
    const cacheRefs = useRef(new Map()); // Cache for preloaded audio elements
    const isPlayingRef = useRef(false); // Track if we're currently playing to prevent race conditions

    // -- Effects --

    // Initial Data Fetch
    useEffect(() => {
        fetchFavorites();
        fetchPlaylists();
        fetchTrending();
        fetchHistory();
    }, []);

    // Socket Events
    useEffect(() => {
        socket.on("audio_chunk", (data) => {
            // Handle audio chunks if using MSE
        });

        socket.on("stream_start", (data) => {
            console.log("Stream started:", data);
            setDuration(data.duration);
        });

        socket.on("stream_error", (err) => {
            console.error("Stream error:", err);
        });

        return () => {
            socket.off("audio_chunk");
            socket.off("stream_start");
            socket.off("stream_error");
        };
    }, []);

    // Audio Element Setup
    useEffect(() => {
        const audio = audioRef.current;

        const updateTime = () => setCurrentTime(audio.currentTime);
        const updateDuration = () => setDuration(audio.duration);
        const onEnded = () => handleNext();

        audio.addEventListener('timeupdate', updateTime);
        audio.addEventListener('loadedmetadata', updateDuration);
        audio.addEventListener('ended', onEnded);

        return () => {
            audio.removeEventListener('timeupdate', updateTime);
            audio.removeEventListener('loadedmetadata', updateDuration);
            audio.removeEventListener('ended', onEnded);
        };
    }, [queue, currentTrack, repeat, shuffle]);

    // Media Session
    useEffect(() => {
        if ('mediaSession' in navigator && currentTrack) {
            navigator.mediaSession.metadata = new MediaMetadata({
                title: currentTrack.title,
                artist: currentTrack.uploader,
                artwork: [{ src: currentTrack.thumbnail, sizes: '512x512', type: 'image/jpeg' }]
            });

            navigator.mediaSession.setActionHandler('play', togglePlay);
            navigator.mediaSession.setActionHandler('pause', togglePlay);
            navigator.mediaSession.setActionHandler('previoustrack', handlePrev);
            navigator.mediaSession.setActionHandler('nexttrack', handleNext);
        }
    }, [currentTrack, isPlaying]);

    // Precache next 2-3 tracks for smooth playback
    useEffect(() => {
        if (!currentTrack || queue.length === 0) return;

        const currentIndex = queue.findIndex(t => t.videoId === currentTrack.videoId);
        if (currentIndex === -1) return;

        const tracksToCache = new Set();

        // Get next 3 tracks (considering shuffle and repeat)
        for (let i = 1; i <= 3; i++) {
            let nextIndex;
            if (shuffle) {
                // For shuffle, cache random tracks from queue
                nextIndex = Math.floor(Math.random() * queue.length);
            } else {
                nextIndex = currentIndex + i;
                if (nextIndex >= queue.length) {
                    if (repeat) {
                        nextIndex = nextIndex % queue.length;
                    } else {
                        break; // Don't cache beyond queue end if not repeating
                    }
                }
            }
            if (queue[nextIndex]) {
                tracksToCache.add(queue[nextIndex].videoId);
            }
        }

        // Precache tracks
        tracksToCache.forEach(videoId => {
            const track = queue.find(t => t.videoId === videoId);
            if (track && !cacheRefs.current.has(videoId)) {
                const audio = new Audio();
                const streamUrl = `${API_URL}/stream?url=${encodeURIComponent(track.url)}`;
                audio.src = streamUrl;
                audio.preload = 'auto';
                cacheRefs.current.set(videoId, audio);
                console.log('Precached:', track.title);
            }
        });

        // Cleanup: Remove cached tracks that are no longer needed
        const keysToRemove = [];
        cacheRefs.current.forEach((audio, videoId) => {
            if (!tracksToCache.has(videoId) && videoId !== currentTrack.videoId) {
                audio.pause();
                audio.src = '';
                keysToRemove.push(videoId);
            }
        });
        keysToRemove.forEach(key => cacheRefs.current.delete(key));

        // Cleanup on unmount
        return () => {
            cacheRefs.current.forEach(audio => {
                audio.pause();
                audio.src = '';
            });
        };
    }, [currentTrack, queue, shuffle, repeat]);

    // -- Actions --

    const fetchTrending = async () => {
        setIsLoadingTrending(true);
        try {
            const res = await axios.get(`${API_URL}/trending`);
            setTrendingTracks(res.data.results || []);
        } catch (err) {
            console.error("Failed to fetch trending", err);
        } finally {
            setIsLoadingTrending(false);
        }
    };

    const fetchHistory = async () => {
        try {
            const res = await axios.get(`${API_URL}/history`);
            setPlayHistory(res.data.history || []);
        } catch (err) {
            console.error("Failed to fetch history", err);
        }
    };

    const fetchFavorites = async () => {
        try {
            const res = await axios.get(`${API_URL}/favorites`);
            setFavorites(res.data.favorites || []);
        } catch (err) {
            console.error("Failed to fetch favorites", err);
        }
    };

    const fetchPlaylists = async () => {
        try {
            const res = await axios.get(`${API_URL}/playlists`);
            setPlaylists(res.data.playlists || []);
        } catch (err) {
            console.error("Failed to fetch playlists", err);
        }
    };

    const playTrack = useCallback(async (track, contextTracks = null) => {
        if (!track || isPlayingRef.current) return;

        isPlayingRef.current = true;

        setCurrentTrack(track);
        setIsPlaying(true);

        // Pause current audio before switching
        if (audioRef.current) {
            try {
                audioRef.current.pause();
            } catch (e) {
                // Ignore errors when pausing
            }
        }

        // Set the audio source
        const streamUrl = `${API_URL}/stream?url=${encodeURIComponent(track.url)}`;
        audioRef.current.src = streamUrl;
        audioRef.current.currentTime = 0;

        // Small delay to ensure previous audio is fully stopped
        await new Promise(resolve => setTimeout(resolve, 50));

        // Try to play with better error handling
        try {
            await audioRef.current.play();
        } catch (e) {
            if (e.name === 'NotSupportedError') {
                console.error("Audio format not supported:", e);
                alert("⚠️ Cannot play this track.\n\nThe backend server may not be processing the stream correctly.\nPlease check the server console for errors.");
                setIsPlaying(false);
                isPlayingRef.current = false;
                return;
            } else if (e.name === 'NotAllowedError') {
                console.error("Playback not allowed:", e);
                alert("⚠️ Playback blocked by browser.\n\nPlease interact with the page first (click anywhere) to allow audio playback.");
                setIsPlaying(false);
                isPlayingRef.current = false;
                return;
            } else if (e.name !== 'AbortError') {
                console.error("Playback failed:", e);
                alert(`⚠️ Playback error: ${e.message}\n\nPlease check:\n1. Backend server is running\n2. Internet connection is stable\n3. YouTube video is available`);
                setIsPlaying(false);
                isPlayingRef.current = false;
                return;
            }
        }

        isPlayingRef.current = false;

        // Set queue based on context
        if (contextTracks && contextTracks.length > 0) {
            // Set entire context as queue for contextual next/prev navigation
            setQueue(contextTracks);
        } else {
            // Fallback to current behavior
            setQueue(prev => {
                // If queue is empty, start a new queue with this track
                if (prev.length === 0) {
                    return [track];
                }
                // If track is already in queue, keep the queue as is
                if (prev.some(t => t.videoId === track.videoId)) {
                    return prev;
                }
                // Otherwise, add it to the queue
                return [...prev, track];
            });
        }

        setPlayHistory(prev => {
            const newHistory = [track, ...prev.filter(t => t.videoId !== track.videoId)].slice(0, 20);
            return newHistory;
        });
    }, []);

    const togglePlay = () => {
        if (audioRef.current.paused) {
            audioRef.current.play();
            setIsPlaying(true);
        } else {
            audioRef.current.pause();
            setIsPlaying(false);
        }
    };

    const handleNext = useCallback(() => {
        if (queue.length === 0) return;

        const currentIndex = queue.findIndex(t => t.videoId === currentTrack?.videoId);
        let nextIndex;

        if (shuffle) {
            // Random track from queue
            nextIndex = Math.floor(Math.random() * queue.length);
        } else {
            // If current track not found in queue, start from beginning
            if (currentIndex === -1) {
                nextIndex = 0;
            } else {
                nextIndex = currentIndex + 1;
                // Handle end of queue
                if (nextIndex >= queue.length) {
                    if (repeat) {
                        nextIndex = 0; // Loop back to start
                    } else {
                        return; // Stop at end
                    }
                }
            }
        }

        playTrack(queue[nextIndex]);
    }, [queue, currentTrack, shuffle, repeat, playTrack]);

    const handlePrev = useCallback(() => {
        if (queue.length === 0) return;

        const currentIndex = queue.findIndex(t => t.videoId === currentTrack?.videoId);
        let prevIndex;

        // If current track not found in queue, start from end
        if (currentIndex === -1) {
            prevIndex = queue.length - 1;
        } else {
            prevIndex = currentIndex - 1;
            // If at the beginning, wrap to end
            if (prevIndex < 0) {
                prevIndex = queue.length - 1;
            }
        }

        playTrack(queue[prevIndex]);
    }, [queue, currentTrack, playTrack]);

    const handleSeek = (e) => {
        const progressBar = e.currentTarget;
        const rect = progressBar.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const width = rect.width;
        const percentage = x / width;
        const newTime = percentage * duration;

        audioRef.current.currentTime = newTime;
        setCurrentTime(newTime);
    };

    const handleVolumeChange = (newVolume) => {
        setVolume(newVolume);
        audioRef.current.volume = newVolume;
        setIsMuted(newVolume === 0);
    };

    const addToQueue = (track) => {
        setQueue(prev => [...prev, track]);
    };

    const removeFromQueue = (index) => {
        setQueue(prev => prev.filter((_, i) => i !== index));
    };

    const playFromQueue = (index) => {
        playTrack(queue[index]);
    };

    const handleSearch = async (e) => {
        e.preventDefault();
        if (!searchQuery.trim()) return;

        setIsSearching(true);
        try {
            const res = await axios.get(`${API_URL}/search?q=${encodeURIComponent(searchQuery)}`);
            setSearchResults(res.data.results || []);
        } catch (err) {
            console.error("Search failed:", err);
            try {
                const res = await axios.get(`${API_URL}/explore?category=trending`);
            } catch (e) { }
        } finally {
            setIsSearching(false);
        }
    };

    const toggleFavorite = async (track) => {
        try {
            const res = await axios.post(`${API_URL}/favorites`, track);
            if (res.data.success) {
                setFavorites(res.data.favorites);
            }
        } catch (err) {
            console.error("Failed to toggle favorite", err);
        }
    };

    const createPlaylist = async (name) => {
        try {
            const res = await axios.post(`${API_URL}/playlists`, { name });
            if (res.data.success) {
                setPlaylists(prev => [...prev, res.data.playlist]);
            }
        } catch (err) {
            console.error("Failed to create playlist", err);
        }
    };

    const deletePlaylist = async (id) => {
        try {
            const res = await axios.delete(`${API_URL}/playlists/${id}`);
            if (res.data.success) {
                setPlaylists(prev => prev.filter(p => p.id !== id));
            }
        } catch (err) {
            console.error("Failed to delete playlist", err);
        }
    };

    const addToPlaylist = async (playlistId, track) => {
        try {
            const res = await axios.post(`${API_URL}/playlists/${playlistId}/add`, track);
            if (res.data.success) {
                setPlaylists(prev => prev.map(p => p.id === playlistId ? res.data.playlist : p));
            }
        } catch (err) {
            console.error("Failed to add to playlist", err);
        }
    };

    const removeFromPlaylist = async (playlistId, videoId) => {
        try {
            const res = await axios.delete(`${API_URL}/playlists/${playlistId}/tracks/${videoId}`);
            if (res.data.success) {
                setPlaylists(prev => prev.map(p => p.id === playlistId ? res.data.playlist : p));
            }
        } catch (err) {
            console.error("Failed to remove from playlist", err);
        }
    };

    const viewPlaylist = (id) => {
        setSelectedPlaylistId(id);
        setActiveView('playlist-detail');
    };

    // YouTube Music Playlist Handlers
    const handlePlaylistClick = async (playlist) => {
        try {
            const res = await axios.get(`${API_URL}/youtube-music/playlist/${playlist.id}`);
            if (res.data.success) {
                setSelectedYoutubePlaylist(playlist);
                setYoutubePlaylistTracks(res.data.tracks);
                setActiveView('youtube-playlist-detail');
            }
        } catch (error) {
            console.error("Failed to fetch playlist tracks:", error);
        }
    };

    const handlePlaylistPlay = async (playlist) => {
        try {
            const res = await axios.get(`${API_URL}/youtube-music/playlist/${playlist.id}`);
            if (res.data.success && res.data.tracks.length > 0) {
                // Play first track and set entire playlist as queue
                playTrack(res.data.tracks[0], res.data.tracks);
            }
        } catch (error) {
            console.error("Failed to play playlist:", error);
        }
    };

    const openPlaylistModal = (track) => {
        setTrackToAdd(track);
        setIsPlaylistModalOpen(true);
    };

    const closePlaylistModal = () => {
        setIsPlaylistModalOpen(false);
        setTrackToAdd(null);
    };

    const formatTime = (seconds) => {
        if (!seconds) return "0:00";
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
    };

    return (
        <div className="flex h-screen w-screen bg-slate-950 overflow-hidden font-sans text-white selection:bg-accent selection:text-white">
            <Sidebar activeView={activeView} setActiveView={setActiveView} />

            <main className="flex-1 flex flex-col bg-gradient-to-b from-slate-800 to-slate-950 overflow-hidden relative">
                <AnimatePresence mode="wait">
                    {activeView === 'home' && (
                        <HomeView
                            key="home"
                            trendingTracks={trendingTracks}
                            playTrack={playTrack}
                            playHistory={playHistory}
                            favorites={favorites}
                            toggleFavorite={toggleFavorite}
                            addToQueue={addToQueue}
                            formatTime={formatTime}
                            openPlaylistModal={openPlaylistModal}
                            onPlaylistClick={handlePlaylistClick}
                            onPlaylistPlay={handlePlaylistPlay}
                        />
                    )}
                    {activeView === 'explore' && (
                        <ExploreView
                            key="explore"
                            playTrack={playTrack}
                            addToQueue={addToQueue}
                            toggleFavorite={toggleFavorite}
                            favorites={favorites}
                            openPlaylistModal={openPlaylistModal}
                            formatTime={formatTime}
                        />
                    )}
                    {activeView === 'search' && (
                        <SearchView
                            key="search"
                            searchQuery={searchQuery}
                            setSearchQuery={setSearchQuery}
                            handleSearch={handleSearch}
                            isSearching={isSearching}
                            searchResults={searchResults}
                            playTrack={playTrack}
                            addToQueue={addToQueue}
                            formatTime={formatTime}
                            toggleFavorite={toggleFavorite}
                            favorites={favorites}
                            openPlaylistModal={openPlaylistModal}
                        />
                    )}
                    {activeView === 'queue' && (
                        <QueueView
                            key="queue"
                            queue={queue}
                            currentTrack={currentTrack}
                            playTrack={playTrack}
                            removeFromQueue={removeFromQueue}
                            // clearQueue={clearQueue} // Not implemented in App.jsx state yet
                            formatTime={formatTime}
                        />
                    )}
                    {activeView === 'library' && (
                        <LibraryView
                            key="library"
                            favorites={favorites}
                            playlists={playlists}
                            playTrack={playTrack}
                            addToQueue={addToQueue}
                            toggleFavorite={toggleFavorite}
                            formatTime={formatTime}
                            createPlaylist={createPlaylist}
                            deletePlaylist={deletePlaylist}
                            viewPlaylist={viewPlaylist}
                            openPlaylistModal={openPlaylistModal}
                        />
                    )}
                    {activeView === 'playlist-detail' && (
                        <PlaylistDetailView
                            key="playlist-detail"
                            playlist={playlists.find(p => p.id === selectedPlaylistId)}
                            goBack={() => setActiveView('library')}
                            playTrack={playTrack}
                            removeFromPlaylist={removeFromPlaylist}
                            formatTime={formatTime}
                        />
                    )}
                    {activeView === 'youtube-playlist-detail' && (
                        <YoutubePlaylistView
                            key="youtube-playlist-detail"
                            playlist={selectedYoutubePlaylist}
                            tracks={youtubePlaylistTracks}
                            goBack={() => setActiveView('home')}
                            playTrack={playTrack}
                            formatTime={formatTime}
                            toggleFavorite={toggleFavorite}
                            favorites={favorites}
                            openPlaylistModal={openPlaylistModal}
                        />
                    )}
                </AnimatePresence>
            </main>

            <PlayerBar
                currentTrack={currentTrack}
                isPlaying={isPlaying}
                togglePlayPause={togglePlay}
                playNext={handleNext}
                playPrev={handlePrev}
                shuffle={shuffle}
                setShuffle={setShuffle}
                repeat={repeat}
                setRepeat={setRepeat}
                currentTime={currentTime}
                duration={duration}
                handleProgressClick={handleSeek}
                volume={volume}
                setVolume={handleVolumeChange}
                isMuted={isMuted}
                setIsMuted={setIsMuted}
                formatTime={formatTime}
                progressPercent={duration ? (currentTime / duration) * 100 : 0}
                toggleFavorite={toggleFavorite}
                favorites={favorites}
                openPlaylistModal={openPlaylistModal}
                isLyricsPanelOpen={isLyricsPanelOpen}
                toggleLyrics={() => setIsLyricsPanelOpen(!isLyricsPanelOpen)}
            />

            <MobileNav activeView={activeView} setActiveView={setActiveView} />

            <AddToPlaylistModal
                isOpen={isPlaylistModalOpen}
                onClose={closePlaylistModal}
                track={trackToAdd}
                playlists={playlists}
                createPlaylist={createPlaylist}
                addToPlaylist={addToPlaylist}
            />

            {/* Lyrics Panel Overlay */}
            <AnimatePresence>
                {isLyricsPanelOpen && currentTrack && (
                    <motion.div
                        initial={{ x: '100%', opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        exit={{ x: '100%', opacity: 0 }}
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                        className="fixed right-0 top-0 bottom-24 w-full md:w-[450px] bg-slate-900/95 backdrop-blur-2xl border-l border-white/5 z-40 flex flex-col shadow-2xl"
                    >
                        <div className="flex items-center justify-between px-6 py-4 border-b border-white/5 bg-white/5">
                            <h2 className="text-lg font-bold text-white flex items-center gap-2">
                                <span className="text-accent">Lyrics</span>
                            </h2>
                            <button
                                className="p-2 rounded-full hover:bg-white/10 text-white/60 hover:text-white transition-colors"
                                onClick={() => setIsLyricsPanelOpen(false)}
                                title="Close Lyrics"
                            >
                                ✕
                            </button>
                        </div>
                        <LyricsView
                            currentTrack={currentTrack}
                            lyrics={lyrics}
                            currentTime={currentTime}
                            isPlaying={isPlaying}
                            isLoading={isLoadingLyrics}
                            error={lyricsError}
                            karaokeMode={karaokeMode}
                            onToggleKaraoke={() => setKaraokeMode(!karaokeMode)}
                            onRefetch={refetchLyrics}
                        />
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

export default App;
