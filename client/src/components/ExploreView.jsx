import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Play, TrendingUp, Music, Disc, Radio, Heart, ListPlus, Plus } from 'lucide-react';
import axios from 'axios';
import { cn } from '../lib/utils';

const API_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

const ExploreView = ({
    playTrack,
    addToQueue,
    formatTime,
    toggleFavorite,
    favorites,
    openPlaylistModal
}) => {
    const [activeTab, setActiveTab] = useState('trending');
    const [tracks, setTracks] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    const categories = [
        { id: 'trending', label: 'Trending', icon: TrendingUp },
        { id: 'top-charts', label: 'Top Charts', icon: Disc },
        { id: 'new-releases', label: 'New Releases', icon: Music },
        { id: 'lo-fi', label: 'Lo-Fi', icon: Radio },
        { id: 'pop', label: 'Pop', icon: Music },
        { id: 'hip-hop', label: 'Hip Hop', icon: Music },
    ];

    useEffect(() => {
        loadCategory(activeTab);
    }, [activeTab]);

    const loadCategory = async (category) => {
        setIsLoading(true);
        try {
            const response = await axios.get(`${API_URL}/explore?category=${category}`);
            setTracks(response.data.results || []);
        } catch (error) {
            console.error("Failed to load category:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const container = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: { staggerChildren: 0.05 }
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
            <div className="flex flex-col gap-6 mb-8">
                <h2 className="text-3xl font-bold text-white tracking-tight">Explore</h2>
                <div className="flex flex-wrap gap-3">
                    {categories.map((cat) => {
                        const Icon = cat.icon;
                        const isActive = activeTab === cat.id;
                        return (
                            <button
                                key={cat.id}
                                className={cn(
                                    "flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200",
                                    isActive
                                        ? "bg-accent text-white shadow-lg shadow-accent/20 scale-105"
                                        : "bg-white/5 text-slate-300 hover:bg-white/10 hover:text-white"
                                )}
                                onClick={() => setActiveTab(cat.id)}
                            >
                                <Icon size={16} />
                                <span>{cat.label}</span>
                            </button>
                        );
                    })}
                </div>
            </div>

            {isLoading ? (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                    {[...Array(10)].map((_, i) => (
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
                    {tracks.map((track) => {
                        const isFav = favorites.some(t => t.videoId === track.videoId);
                        return (
                            <motion.div
                                key={track.videoId}
                                className="group bg-slate-800/40 backdrop-blur-sm rounded-xl p-4 hover:bg-slate-800/80 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 cursor-pointer relative border border-white/5 hover:border-white/10"
                                variants={item}
                                onClick={() => playTrack(track, tracks)}
                            >
                                <div className="relative aspect-square mb-4 rounded-lg overflow-hidden shadow-lg">
                                    <img
                                        src={track.thumbnail}
                                        alt={track.title}
                                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                        loading="lazy"
                                    />
                                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-3 backdrop-blur-[2px]">
                                        <button
                                            className="w-12 h-12 bg-accent rounded-full flex items-center justify-center text-white shadow-lg hover:scale-105 transition-transform hover:bg-accent-light"
                                            onClick={(e) => { e.stopPropagation(); playTrack(track, tracks); }}
                                        >
                                            <Play fill="currentColor" className="ml-1" size={24} />
                                        </button>
                                    </div>
                                    <span className="absolute bottom-2 right-2 px-2 py-1 bg-black/60 backdrop-blur-md rounded text-[10px] font-bold text-white shadow-sm">
                                        {formatTime(track.duration)}
                                    </span>
                                </div>

                                <div className="space-y-1">
                                    <h3 className="text-white font-bold truncate text-base group-hover:text-accent transition-colors" title={track.title}>
                                        {track.title}
                                    </h3>
                                    <p className="text-slate-400 text-sm truncate hover:text-white transition-colors">
                                        {track.uploader}
                                    </p>
                                </div>

                                <div className="absolute top-2 right-2 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0">
                                    <button
                                        className={cn(
                                            "p-2 rounded-full shadow-lg hover:scale-105 transition-all",
                                            isFav ? "bg-accent text-white" : "bg-black/60 text-white hover:bg-white hover:text-black"
                                        )}
                                        onClick={(e) => { e.stopPropagation(); toggleFavorite(track); }}
                                        title={isFav ? "Remove from Favorites" : "Add to Favorites"}
                                    >
                                        <Heart size={16} fill={isFav ? "currentColor" : "none"} />
                                    </button>
                                    <button
                                        className="p-2 rounded-full bg-black/60 text-white shadow-lg hover:scale-105 transition-all hover:bg-white hover:text-black"
                                        onClick={(e) => { e.stopPropagation(); openPlaylistModal(track); }}
                                        title="Add to Playlist"
                                    >
                                        <ListPlus size={16} />
                                    </button>
                                    <button
                                        className="p-2 rounded-full bg-black/60 text-white shadow-lg hover:scale-105 transition-all hover:bg-white hover:text-black"
                                        onClick={(e) => { e.stopPropagation(); addToQueue(track); }}
                                        title="Add to Queue"
                                    >
                                        <Plus size={16} />
                                    </button>
                                </div>
                            </motion.div>
                        );
                    })}
                </motion.div>
            )}
        </motion.div>
    );
};

export default ExploreView;
