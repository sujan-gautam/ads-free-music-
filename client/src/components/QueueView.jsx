import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ListMusic, Play, X, GripVertical, Heart, ListPlus, Music } from 'lucide-react';
import { cn } from '../lib/utils';

const QueueView = ({
    queue,
    playFromQueue,
    removeFromQueue,
    currentTrack,
    toggleFavorite,
    favorites,
    openPlaylistModal
}) => {
    return (
        <motion.div
            className="flex-1 overflow-y-auto p-6 md:p-8 pb-32"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
        >
            <div className="flex items-center justify-between mb-8">
                <h2 className="text-3xl font-bold text-white flex items-center gap-3 tracking-tight">
                    <ListMusic className="text-accent" size={32} /> Up Next
                </h2>
                <span className="text-slate-400 text-sm font-medium bg-white/5 px-3 py-1 rounded-full border border-white/5">
                    {queue.length} tracks
                </span>
            </div>

            <div className="max-w-4xl mx-auto">
                {queue.length > 0 ? (
                    <div className="flex flex-col gap-2">
                        <AnimatePresence mode="popLayout">
                            {queue.map((track, index) => {
                                const isFav = favorites.some(t => t.videoId === track.videoId);
                                const isCurrent = currentTrack?.videoId === track.videoId;

                                return (
                                    <motion.div
                                        key={`${track.videoId}-${index}`}
                                        className={cn(
                                            "flex items-center gap-4 p-3 rounded-xl transition-all group border border-transparent",
                                            isCurrent ? "bg-white/10 border-white/5 shadow-lg" : "hover:bg-white/5 hover:border-white/5"
                                        )}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: 20 }}
                                        layout
                                    >
                                        <div className="w-8 flex items-center justify-center text-slate-400 font-variant-numeric text-sm">
                                            <span className="group-hover:hidden">{index + 1}</span>
                                            <button
                                                className="hidden group-hover:flex text-white hover:text-accent transition-colors"
                                                onClick={() => playFromQueue(index)}
                                            >
                                                <Play size={16} fill="currentColor" />
                                            </button>
                                        </div>

                                        <img
                                            src={track.thumbnail}
                                            alt={track.title}
                                            className={cn(
                                                "w-12 h-12 rounded-lg object-cover shadow-sm",
                                                isCurrent && "animate-pulse-slow ring-2 ring-accent/50"
                                            )}
                                        />

                                        <div className="flex-1 min-w-0">
                                            <div className={cn(
                                                "font-medium truncate transition-colors",
                                                isCurrent ? "text-accent" : "text-white group-hover:text-white"
                                            )}>
                                                {track.title}
                                            </div>
                                            <div className="text-slate-400 text-sm truncate">{track.uploader}</div>
                                        </div>

                                        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button
                                                className={cn(
                                                    "p-2 rounded-full hover:bg-white/10 transition-colors",
                                                    isFav ? "text-accent" : "text-slate-400 hover:text-white"
                                                )}
                                                onClick={(e) => { e.stopPropagation(); toggleFavorite(track); }}
                                                title={isFav ? "Remove from Favorites" : "Add to Favorites"}
                                            >
                                                <Heart size={18} fill={isFav ? "currentColor" : "none"} />
                                            </button>
                                            <button
                                                className="p-2 rounded-full text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
                                                onClick={(e) => { e.stopPropagation(); openPlaylistModal(track); }}
                                                title="Add to Playlist"
                                            >
                                                <ListPlus size={18} />
                                            </button>
                                            <button
                                                className="p-2 rounded-full text-slate-400 hover:text-red-500 hover:bg-red-500/10 transition-colors"
                                                onClick={() => removeFromQueue(index)}
                                                title="Remove from queue"
                                            >
                                                <X size={18} />
                                            </button>
                                        </div>
                                    </motion.div>
                                );
                            })}
                        </AnimatePresence>
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center py-32 text-center opacity-50">
                        <div className="w-24 h-24 bg-white/5 rounded-full flex items-center justify-center mb-6">
                            <ListMusic size={48} className="text-slate-500" />
                        </div>
                        <h3 className="text-2xl font-bold text-white mb-2">Your queue is empty</h3>
                        <p className="text-slate-400">Add songs from search to build your playlist</p>
                    </div>
                )}
            </div>
        </motion.div>
    );
};

export default QueueView;
