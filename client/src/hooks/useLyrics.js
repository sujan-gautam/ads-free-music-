import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

/**
 * Custom hook for managing lyrics fetching and caching
 * @param {Object} currentTrack - Current playing track
 * @returns {Object} - { lyrics, isLoading, error, refetch }
 */
export function useLyrics(currentTrack) {
    const [lyrics, setLyrics] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    
    // In-memory cache
    const [cache] = useState(new Map());
    
    const loadLyrics = useCallback(async (videoId, title, artist, duration) => {
        if (!videoId) {
            setLyrics(null);
            return;
        }
        
        // Check cache first
        const cacheKey = videoId;
        if (cache.has(cacheKey)) {
            console.log("📦 Loading lyrics from cache");
            setLyrics(cache.get(cacheKey));
            setError(null);
            return;
        }
        
        setIsLoading(true);
        setError(null);
        
        try {
            const response = await axios.get(`${API_URL}/lyrics`, {
                params: {
                    videoId,
                    title: title || 'Unknown',
                    artist: artist || 'Unknown',
                    duration: duration || 180
                }
            });
            
            if (response.data.success && response.data.lyrics) {
                const lyricsData = response.data.lyrics;
                setLyrics(lyricsData);
                cache.set(cacheKey, lyricsData);
                
                // Limit cache size
                if (cache.size > 50) {
                    const firstKey = cache.keys().next().value;
                    cache.delete(firstKey);
                }
            } else {
                setLyrics(null);
                setError(response.data.message || 'No lyrics available');
            }
        } catch (err) {
            console.error("Failed to fetch lyrics:", err);
            setLyrics(null);
            setError(err.response?.data?.message || 'Failed to load lyrics');
        } finally {
            setIsLoading(false);
        }
    }, [cache]);
    
    // Auto-load lyrics when track changes
    useEffect(() => {
        if (currentTrack) {
            loadLyrics(
                currentTrack.videoId,
                currentTrack.title,
                currentTrack.uploader,
                currentTrack.duration
            );
        } else {
            setLyrics(null);
            setError(null);
        }
    }, [currentTrack, loadLyrics]);
    
    const refetch = useCallback(() => {
        if (currentTrack) {
            // Clear cache for this track
            cache.delete(currentTrack.videoId);
            loadLyrics(
                currentTrack.videoId,
                currentTrack.title,
                currentTrack.uploader,
                currentTrack.duration
            );
        }
    }, [currentTrack, cache, loadLyrics]);
    
    return {
        lyrics,
        isLoading,
        error,
        refetch
    };
}
