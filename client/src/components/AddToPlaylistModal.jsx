import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Plus, ListMusic, Check } from 'lucide-react';
import { cn } from '../lib/utils';

const AddToPlaylistModal = ({ isOpen, onClose, track, playlists, createPlaylist, addToPlaylist }) => {
    const [newPlaylistName, setNewPlaylistName] = useState("");
    const [isCreating, setIsCreating] = useState(false);

    if (!isOpen || !track) return null;

    const handleCreate = (e) => {
        e.preventDefault();
        if (newPlaylistName.trim()) {
            createPlaylist(newPlaylistName);
            setNewPlaylistName("");
            setIsCreating(false);
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4" onClick={onClose}>
                    <motion.div
                        className="bg-slate-900 border border-white/10 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl"
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        onClick={e => e.stopPropagation()}
                    >
                        <div className="flex items-center justify-between p-6 border-b border-white/5 bg-white/5">
                            <h3 className="text-xl font-bold text-white">Add to Playlist</h3>
                            <button
                                className="p-2 rounded-full hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
                                onClick={onClose}
                            >
                                <X size={20} />
                            </button>
                        </div>

                        <div className="p-6 flex items-center gap-4 border-b border-white/5">
                            <img src={track.thumbnail} alt={track.title} className="w-16 h-16 rounded-lg object-cover shadow-md" />
                            <div className="min-w-0">
                                <p className="text-white font-medium truncate">{track.title}</p>
                                <p className="text-slate-400 text-sm truncate">{track.uploader}</p>
                            </div>
                        </div>

                        <div className="p-4 max-h-[300px] overflow-y-auto space-y-2 custom-scrollbar">
                            {playlists.map(playlist => {
                                const isAdded = playlist.tracks.some(t => t.videoId === track.videoId);
                                return (
                                    <button
                                        key={playlist.id}
                                        className={cn(
                                            "w-full flex items-center justify-between p-4 rounded-xl transition-all border border-transparent",
                                            isAdded
                                                ? "bg-accent/10 border-accent/20 text-accent cursor-default"
                                                : "bg-white/5 hover:bg-white/10 text-white hover:border-white/10"
                                        )}
                                        onClick={() => {
                                            if (!isAdded) {
                                                addToPlaylist(playlist.id, track);
                                            }
                                        }}
                                        disabled={isAdded}
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className={cn(
                                                "w-8 h-8 rounded-full flex items-center justify-center",
                                                isAdded ? "bg-accent/20" : "bg-white/10"
                                            )}>
                                                <ListMusic size={16} />
                                            </div>
                                            <span className="font-medium">{playlist.name}</span>
                                        </div>
                                        {isAdded ? <Check size={18} /> : <Plus size={18} />}
                                    </button>
                                );
                            })}
                        </div>

                        <div className="p-6 border-t border-white/5 bg-white/5">
                            {isCreating ? (
                                <form onSubmit={handleCreate} className="flex flex-col gap-4">
                                    <input
                                        autoFocus
                                        type="text"
                                        placeholder="Playlist Name"
                                        value={newPlaylistName}
                                        onChange={e => setNewPlaylistName(e.target.value)}
                                        className="w-full bg-slate-800 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-accent/50"
                                    />
                                    <div className="flex gap-3">
                                        <button
                                            type="submit"
                                            className="flex-1 bg-accent text-white py-2.5 rounded-xl font-bold hover:bg-accent-light transition-colors shadow-lg"
                                        >
                                            Create
                                        </button>
                                        <button
                                            type="button"
                                            className="flex-1 bg-white/10 text-white py-2.5 rounded-xl font-bold hover:bg-white/20 transition-colors"
                                            onClick={() => setIsCreating(false)}
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </form>
                            ) : (
                                <button
                                    className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-white/10 text-white font-bold hover:bg-white/20 transition-all border border-white/5 hover:border-white/10"
                                    onClick={() => setIsCreating(true)}
                                >
                                    <Plus size={18} /> Create New Playlist
                                </button>
                            )}
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default AddToPlaylistModal;
