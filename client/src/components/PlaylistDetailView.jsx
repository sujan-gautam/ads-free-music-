import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Play, Trash2, Clock, Music } from 'lucide-react';
import PlaylistCover from './PlaylistCover';
import { cn } from '../lib/utils';

const PlaylistDetailView = ({
    playlist,
    goBack,
    playTrack,
    removeFromPlaylist,
    formatTime
}) => {
    if (!playlist) return null;

    const handlePlayAll = () => {
        if (playlist.tracks.length > 0) {
            playTrack(playlist.tracks[0], playlist.tracks);
        }
    };

    return (
        <motion.div
            className="flex-1 overflow-y-auto p-6 md:p-8 pb-32"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
        >
            <div className="flex flex-col md:flex-row items-start md:items-end gap-8 mb-8">
                <button
                    className="absolute top-6 left-6 md:static p-2 rounded-full bg-black/40 hover:bg-white/10 text-white transition-colors"
                    onClick={goBack}
                >
                    <ArrowLeft size={24} />
                </button>

                <div className="w-52 h-52 shadow-2xl rounded-lg overflow-hidden shrink-0 mx-auto md:mx-0 ring-1 ring-white/10">
                    <PlaylistCover tracks={playlist.tracks} />
                </div>

                <div className="flex flex-col gap-4 text-center md:text-left w-full">
                    <span className="text-sm font-bold uppercase tracking-wider text-white/80">Playlist</span>
                    <h2 className="text-4xl md:text-6xl font-black text-white tracking-tight">{playlist.name}</h2>
                    <div className="flex items-center justify-center md:justify-start gap-2 text-slate-400 text-sm font-medium">
                        <span>{playlist.tracks.length} tracks</span>
                    </div>
                    <button
                        className="flex items-center gap-2 px-8 py-3 bg-accent text-white rounded-full font-bold hover:scale-105 transition-transform shadow-lg w-fit mx-auto md:mx-0 disabled:opacity-50 disabled:hover:scale-100 hover:bg-accent-light"
                        onClick={handlePlayAll}
                        disabled={playlist.tracks.length === 0}
                    >
                        <Play fill="currentColor" size={20} />
                        Play All
                    </button>
                </div>
            </div>

            <div className="flex flex-col">
                {playlist.tracks.length > 0 ? (
                    <>
                        <div className="flex items-center gap-4 p-3 text-sm font-medium text-slate-400 border-b border-white/10 mb-2 uppercase tracking-wider">
                            <div className="w-8 text-center">#</div>
                            <div className="flex-1">Title</div>
                            <div className="w-24 text-right flex items-center justify-end gap-1"><Clock size={14} /></div>
                            <div className="w-12"></div>
                        </div>
                        {playlist.tracks.map((track, index) => (
                            <motion.div
                                key={`${track.videoId}-${index}`}
                                className="flex items-center gap-4 p-3 rounded-xl hover:bg-white/5 transition-colors group border border-transparent hover:border-white/5"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.03 }}
                            >
                                <div className="w-8 flex items-center justify-center text-slate-400 font-variant-numeric text-sm">
                                    <span className="group-hover:hidden">{index + 1}</span>
                                    <button
                                        className="hidden group-hover:flex text-white hover:text-accent transition-colors"
                                        onClick={() => playTrack(track, playlist.tracks)}
                                    >
                                        <Play size={16} fill="currentColor" />
                                    </button>
                                </div>

                                <div className="flex-1 flex items-center gap-4 min-w-0">
                                    <img src={track.thumbnail} alt={track.title} className="w-10 h-10 rounded-lg object-cover shadow-sm" />
                                    <div className="min-w-0">
                                        <div className="text-white font-medium truncate group-hover:text-accent transition-colors">{track.title}</div>
                                        <div className="text-slate-400 text-sm truncate">{track.uploader}</div>
                                    </div>
                                </div>

                                <div className="w-24 text-right text-slate-400 text-sm font-variant-numeric">
                                    {formatTime(track.duration)}
                                </div>

                                <div className="w-12 flex justify-end opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button
                                        className="p-2 rounded-full text-slate-400 hover:text-red-500 hover:bg-red-500/10 transition-colors"
                                        onClick={() => removeFromPlaylist(playlist.id, track.videoId)}
                                        title="Remove from playlist"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </motion.div>
                        ))}
                    </>
                ) : (
                    <div className="flex flex-col items-center justify-center py-32 text-center opacity-50">
                        <div className="w-24 h-24 bg-white/5 rounded-full flex items-center justify-center mb-6">
                            <Music size={48} className="text-slate-500" />
                        </div>
                        <h3 className="text-2xl font-bold text-white mb-2">This playlist is empty</h3>
                        <p className="text-slate-400">Add songs from the Explore or Search pages</p>
                    </div>
                )}
            </div>
        </motion.div>
    );
};

export default PlaylistDetailView;
