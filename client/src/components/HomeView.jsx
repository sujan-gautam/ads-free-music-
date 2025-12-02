import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Play, Clock, TrendingUp, Heart, ListPlus, Plus } from 'lucide-react';
import axios from 'axios';
import PlaylistCarousel from './PlaylistCarousel';
import { cn } from '../lib/utils';

const API_URL = "http://localhost:5000";

const HomeView = ({
    trendingTracks,
    playHistory,
    isLoadingTrending,
    playTrack,
    formatTime,
    toggleFavorite,
    favorites,
    openPlaylistModal,
    onPlaylistClick,
    onPlaylistPlay
}) => {
    const [youtubePlaylists, setYoutubePlaylists] = useState(null);
    const [isLoadingPlaylists, setIsLoadingPlaylists] = useState(true);

    useEffect(() => {
        fetchYoutubePlaylists();
    }, []);

    const fetchYoutubePlaylists = async () => {
        try {
            const res = await axios.get(`${API_URL}/youtube-music/playlists`);
            if (res.data.success) {
                setYoutubePlaylists(res.data.playlists);
            }
        } catch (error) {
            console.error("Failed to fetch YouTube playlists:", error);
        } finally {
            setIsLoadingPlaylists(false);
        }
    };

    const container = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: { staggerChildren: 0.1 }
        }
    };

    const item = {
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0 }
    };

    return (
        <motion.div
            className="flex-1 overflow-y-auto p-6 md:p-8 pb-32"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
        >
            {/* Hero Section / Trending */}
            <section className="mb-12">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                        <TrendingUp className="text-accent" size={28} /> Trending Now
                    </h2>
                </div>

                {isLoadingTrending ? (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                        {[...Array(5)].map((_, i) => (
                            <div key={i} className="bg-white/5 rounded-xl aspect-[3/4] animate-pulse" />
                        ))}
                    </div>
                ) : (
                    <motion.div
                        className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6"
                        variants={container}
                        initial="hidden"
                        animate="show"
                    >
                        {trendingTracks.map((track) => {
                            const isFav = favorites.some(t => t.videoId === track.videoId);
                            return (
                                <motion.div
                                    key={track.videoId}
                                    className="group bg-slate-800/40 rounded-xl p-4 hover:bg-slate-800 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 cursor-pointer relative border border-white/5 hover:border-white/10"
                                    variants={item}
                                    onClick={() => playTrack(track, trendingTracks)}
                                >
                                    {/* Thumbnail */}
                                    <div className="relative aspect-square mb-4 rounded-lg overflow-hidden shadow-lg bg-slate-900">
                                        <img
                                            src={track.thumbnail}
                                            alt={track.title}
                                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                            loading="lazy"
                                        />
                                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-2 backdrop-blur-[2px]">
                                            <button
                                                className="w-12 h-12 bg-accent rounded-full flex items-center justify-center text-white shadow-lg hover:scale-105 transition-transform hover:bg-accent-light"
                                                onClick={(e) => { e.stopPropagation(); playTrack(track, trendingTracks); }}
                                            >
                                                <Play fill="currentColor" className="ml-1" size={24} />
                                            </button>
                                        </div>
                                        <span className="absolute bottom-2 right-2 px-2 py-1 bg-black/80 backdrop-blur-md rounded text-[10px] font-bold text-white shadow-sm">
                                            {formatTime(track.duration)}
                                        </span>
                                    </div>

                                    {/* Info */}
                                    <div className="space-y-1">
                                        <h3 className="text-white font-bold truncate text-base" title={track.title}>{track.title}</h3>
                                        <p className="text-slate-400 text-sm truncate hover:text-accent transition-colors">{track.uploader}</p>
                                    </div>

                                    {/* Hover Actions */}
                                    <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0 flex flex-col gap-2">
                                        <button
                                            className={cn(
                                                "p-2 rounded-full shadow-lg hover:scale-105 transition-all backdrop-blur-md",
                                                isFav ? "bg-accent text-white" : "bg-black/60 text-white hover:bg-black/80"
                                            )}
                                            onClick={(e) => { e.stopPropagation(); toggleFavorite(track); }}
                                            title={isFav ? "Remove from Favorites" : "Add to Favorites"}
                                        >
                                            <Heart size={16} fill={isFav ? "currentColor" : "none"} />
                                        </button>
                                        <button
                                            className="p-2 rounded-full bg-black/60 text-white hover:bg-black/80 shadow-lg hover:scale-105 transition-all backdrop-blur-md"
                                            onClick={(e) => { e.stopPropagation(); openPlaylistModal(track); }}
                                            title="Add to Playlist"
                                        >
                                            <ListPlus size={16} />
                                        </button>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </motion.div>
                )}
            </section>

            {/* YouTube Music Playlists */}
            {!isLoadingPlaylists && youtubePlaylists && (
                <>
                    <PlaylistCarousel
                        title="New & Trending Songs"
                        playlists={youtubePlaylists.newTrending}
                        onPlaylistPlay={onPlaylistPlay}
                        onPlaylistClick={onPlaylistClick}
                    />
                    <PlaylistCarousel
                        title="Today's Biggest Hits"
                        playlists={youtubePlaylists.biggestHits}
                        onPlaylistPlay={onPlaylistPlay}
                        onPlaylistClick={onPlaylistClick}
                    />
                    <PlaylistCarousel
                        title="Music for any Mood, Moment, or Vibe"
                        playlists={youtubePlaylists.moodVibes}
                        onPlaylistPlay={onPlaylistPlay}
                        onPlaylistClick={onPlaylistClick}
                    />
                    <PlaylistCarousel
                        title="Fun Throwbacks"
                        playlists={youtubePlaylists.throwbacks}
                        onPlaylistPlay={onPlaylistPlay}
                        onPlaylistClick={onPlaylistClick}
                    />
                </>
            )}

            {/* Recently Played */}
            {playHistory.length > 0 && (
                <section className="mb-12">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                            <Clock className="text-accent" size={28} /> Recently Played
                        </h2>
                    </div>
                    <div className="flex flex-col gap-2">
                        {playHistory.map((track, index) => (
                            <motion.div
                                key={`${track.videoId}-${index}`}
                                className="flex items-center gap-4 p-3 rounded-xl hover:bg-white/5 transition-colors cursor-pointer group border border-transparent hover:border-white/5"
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.05 }}
                                onClick={() => playTrack(track, playHistory)}
                            >
                                <img src={track.thumbnail} alt={track.title} className="w-12 h-12 rounded-lg object-cover shadow-sm" />
                                <div className="flex-1 min-w-0">
                                    <div className="text-white font-medium truncate group-hover:text-accent transition-colors">{track.title}</div>
                                    <div className="text-slate-400 text-sm truncate">{track.uploader}</div>
                                </div>
                                <div className="text-slate-500 text-sm font-variant-numeric">
                                    {formatTime(track.duration)}
                                </div>
                                <button className="p-2 rounded-full bg-accent text-white opacity-0 group-hover:opacity-100 transition-opacity shadow-lg scale-90 group-hover:scale-100">
                                    <Play size={16} fill="currentColor" className="ml-0.5" />
                                </button>
                            </motion.div>
                        ))}
                    </div>
                </section>
            )}
        </motion.div>
    );
};

export default HomeView;
