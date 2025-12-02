import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Heart, ListMusic, Play, Plus, Trash2 } from 'lucide-react';
import PlaylistCover from './PlaylistCover';
import { cn } from '../lib/utils';

const LibraryView = ({
    favorites,
    playlists,
    createPlaylist,
    deletePlaylist,
    playTrack,
    formatTime,
    toggleFavorite,
    viewPlaylist
}) => {
    const [activeTab, setActiveTab] = useState('favorites');
    const [newPlaylistName, setNewPlaylistName] = useState("");
    const [showCreateInput, setShowCreateInput] = useState(false);

    const handleCreatePlaylist = (e) => {
        e.preventDefault();
        if (newPlaylistName.trim()) {
            createPlaylist(newPlaylistName);
            setNewPlaylistName("");
            setShowCreateInput(false);
        }
    };

    return (
        <motion.div
            className="flex-1 overflow-y-auto p-6 md:p-8 pb-32"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
        >
            <div className="flex items-center justify-between mb-8">
                <h2 className="text-3xl font-bold text-white tracking-tight">Your Library</h2>
                <div className="flex gap-1 p-1 bg-white/5 rounded-full border border-white/5">
                    <button
                        className={cn(
                            "flex items-center gap-2 px-6 py-2 rounded-full text-sm font-medium transition-all",
                            activeTab === 'favorites' ? "bg-accent text-white shadow-lg" : "text-slate-400 hover:text-white hover:bg-white/5"
                        )}
                        onClick={() => setActiveTab('favorites')}
                    >
                        <Heart size={16} fill={activeTab === 'favorites' ? "currentColor" : "none"} />
                        <span>Favorites</span>
                    </button>
                    <button
                        className={cn(
                            "flex items-center gap-2 px-6 py-2 rounded-full text-sm font-medium transition-all",
                            activeTab === 'playlists' ? "bg-accent text-white shadow-lg" : "text-slate-400 hover:text-white hover:bg-white/5"
                        )}
                        onClick={() => setActiveTab('playlists')}
                    >
                        <ListMusic size={16} />
                        <span>Playlists</span>
                    </button>
                </div>
            </div>

            {activeTab === 'favorites' && (
                <div className="w-full">
                    {favorites.length > 0 ? (
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                            {favorites.map((track) => (
                                <motion.div
                                    key={track.videoId}
                                    className="group bg-slate-800/40 backdrop-blur-sm rounded-xl p-4 hover:bg-slate-800/80 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 cursor-pointer relative border border-white/5 hover:border-white/10"
                                    whileHover={{ y: -5 }}
                                    onClick={() => playTrack(track, favorites)}
                                >
                                    <div className="relative aspect-square mb-4 rounded-lg overflow-hidden shadow-lg">
                                        <img src={track.thumbnail} alt={track.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-2 backdrop-blur-[2px]">
                                            <button
                                                className="w-12 h-12 bg-accent rounded-full flex items-center justify-center text-white shadow-lg hover:scale-105 transition-transform"
                                                onClick={(e) => { e.stopPropagation(); playTrack(track, favorites); }}
                                            >
                                                <Play fill="currentColor" className="ml-1" size={24} />
                                            </button>
                                        </div>
                                        <span className="absolute bottom-2 right-2 px-2 py-1 bg-black/80 backdrop-blur-md rounded text-[10px] font-bold text-white shadow-sm">
                                            {formatTime(track.duration)}
                                        </span>
                                    </div>
                                    <div className="space-y-1">
                                        <h3 className="text-white font-bold truncate text-base group-hover:text-accent transition-colors" title={track.title}>{track.title}</h3>
                                        <p className="text-slate-400 text-sm truncate hover:text-white transition-colors">{track.uploader}</p>
                                    </div>
                                    <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0">
                                        <button
                                            className="p-2 rounded-full bg-accent text-white shadow-lg hover:scale-105 transition-all"
                                            onClick={(e) => { e.stopPropagation(); toggleFavorite(track); }}
                                        >
                                            <Heart size={16} fill="currentColor" />
                                        </button>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center py-32 text-center opacity-50">
                            <div className="w-24 h-24 bg-white/5 rounded-full flex items-center justify-center mb-6">
                                <Heart size={48} className="text-slate-500" />
                            </div>
                            <h3 className="text-2xl font-bold text-white mb-2">No favorites yet</h3>
                            <p className="text-slate-400">Save songs you love to find them here</p>
                        </div>
                    )}
                </div>
            )}

            {activeTab === 'playlists' && (
                <div className="w-full">
                    <div className="mb-8">
                        {!showCreateInput ? (
                            <button
                                className="flex items-center gap-2 px-6 py-3 bg-accent text-white rounded-full font-bold hover:scale-105 transition-transform shadow-lg hover:bg-accent-light"
                                onClick={() => setShowCreateInput(true)}
                            >
                                <Plus size={20} /> Create New Playlist
                            </button>
                        ) : (
                            <form onSubmit={handleCreatePlaylist} className="flex items-center gap-4 animate-in fade-in slide-in-from-left-4 duration-300">
                                <input
                                    type="text"
                                    placeholder="Playlist Name"
                                    value={newPlaylistName}
                                    onChange={(e) => setNewPlaylistName(e.target.value)}
                                    autoFocus
                                    className="bg-white/10 border border-white/10 rounded-full px-6 py-3 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-accent/50 w-64"
                                />
                                <button type="submit" className="px-6 py-3 bg-accent text-white rounded-full font-bold hover:bg-opacity-90 transition-colors shadow-lg">Create</button>
                                <button type="button" className="px-6 py-3 bg-white/10 text-white rounded-full font-bold hover:bg-white/20 transition-colors" onClick={() => setShowCreateInput(false)}>Cancel</button>
                            </form>
                        )}
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                        {playlists.map((playlist) => (
                            <motion.div
                                key={playlist.id}
                                className="group bg-slate-800/40 backdrop-blur-sm rounded-xl p-4 hover:bg-slate-800/80 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 cursor-pointer relative border border-white/5 hover:border-white/10"
                                whileHover={{ y: -5 }}
                                onClick={() => viewPlaylist(playlist.id)}
                            >
                                <div className="aspect-square mb-4 rounded-lg overflow-hidden shadow-lg bg-white/5 relative group-hover:shadow-2xl transition-all">
                                    <PlaylistCover tracks={playlist.tracks} />
                                    <div className="absolute inset-0 bg-black/20 group-hover:bg-black/0 transition-colors" />
                                </div>
                                <div className="space-y-1">
                                    <h3 className="text-white font-bold truncate text-base group-hover:text-accent transition-colors">{playlist.name}</h3>
                                    <span className="text-sm text-slate-400">{playlist.tracks.length} tracks</span>
                                </div>
                                <button
                                    className="absolute top-2 right-2 p-2 rounded-full bg-black/60 text-white hover:bg-red-500 hover:text-white opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0 shadow-lg"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        deletePlaylist(playlist.id);
                                    }}
                                    title="Delete Playlist"
                                >
                                    <Trash2 size={16} />
                                </button>
                            </motion.div>
                        ))}
                    </div>
                </div>
            )}
        </motion.div>
    );
};

export default LibraryView;
