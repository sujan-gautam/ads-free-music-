import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Play, Shuffle, Heart, ListPlus, Clock } from 'lucide-react';
import { cn } from '../lib/utils';

const YoutubePlaylistView = ({
    playlist,
    tracks,
    goBack,
    playTrack,
    formatTime,
    toggleFavorite,
    favorites,
    openPlaylistModal
}) => {
    const playAll = () => {
        if (tracks && tracks.length > 0) {
            playTrack(tracks[0], tracks);
        }
    };

    const shufflePlay = () => {
        if (tracks && tracks.length > 0) {
            const shuffled = [...tracks].sort(() => Math.random() - 0.5);
            playTrack(shuffled[0], shuffled);
        }
    };

    return (
        <motion.div
            className="flex-1 overflow-y-auto p-6 md:p-8 pb-32"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
        >
            {/* Header */}
            <div className="flex flex-col md:flex-row items-start md:items-end gap-8 mb-8 relative">
                <button
                    className="absolute top-0 left-0 md:static p-2 rounded-full bg-black/40 hover:bg-white/10 text-white transition-colors z-10"
                    onClick={goBack}
                >
                    <ArrowLeft size={24} />
                </button>

                <div className="flex flex-col md:flex-row items-center md:items-end gap-8 w-full mt-12 md:mt-0">
                    <div
                        className="w-52 h-52 shadow-2xl rounded-lg overflow-hidden flex items-center justify-center shrink-0 ring-1 ring-white/10"
                        style={{
                            background: `linear-gradient(135deg, ${getGradientForPlaylist(playlist?.name)} 0%, #0f172a 100%)`
                        }}
                    >
                        <div className="text-white/80">
                            <svg width="80" height="80" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z" />
                            </svg>
                        </div>
                    </div>

                    <div className="flex flex-col gap-4 text-center md:text-left w-full">
                        <span className="text-sm font-bold uppercase tracking-wider text-white/80">Playlist</span>
                        <h1 className="text-3xl md:text-5xl font-black text-white tracking-tight">{playlist?.name || 'Playlist'}</h1>
                        <p className="text-slate-400 font-medium">{playlist?.description}</p>
                        <p className="text-slate-400 text-sm">{tracks?.length || 0} songs</p>

                        <div className="flex items-center justify-center md:justify-start gap-4 mt-2">
                            <button
                                className="flex items-center gap-2 px-8 py-3 bg-accent text-white rounded-full font-bold hover:scale-105 transition-transform shadow-lg hover:bg-accent-light"
                                onClick={playAll}
                            >
                                <Play size={24} fill="currentColor" />
                                Play
                            </button>
                            <button
                                className="p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors border border-white/5"
                                onClick={shufflePlay}
                                title="Shuffle Play"
                            >
                                <Shuffle size={24} />
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Track List */}
            <div className="flex flex-col">
                {tracks && tracks.length > 0 ? (
                    <>
                        <div className="flex items-center gap-4 p-3 text-sm font-medium text-slate-400 border-b border-white/10 mb-2 uppercase tracking-wider">
                            <div className="w-8 text-center">#</div>
                            <div className="flex-1">Title</div>
                            <div className="w-24 text-right flex items-center justify-end gap-1"><Clock size={14} /></div>
                            <div className="w-20"></div>
                        </div>
                        {tracks.map((track, index) => {
                            const isFav = favorites?.some(t => t.videoId === track.videoId);
                            return (
                                <motion.div
                                    key={track.videoId}
                                    className="flex items-center gap-4 p-3 rounded-xl hover:bg-white/5 transition-colors group border border-transparent hover:border-white/5"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.02 }}
                                >
                                    <div className="w-8 flex items-center justify-center text-slate-400 font-variant-numeric text-sm">
                                        <span className="group-hover:hidden">{index + 1}</span>
                                        <button
                                            className="hidden group-hover:flex text-white hover:text-accent transition-colors"
                                            onClick={() => playTrack(track, tracks)}
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

                                    <div className="w-20 flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
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
                                    </div>
                                </motion.div>
                            );
                        })}
                    </>
                ) : (
                    <div className="flex flex-col items-center justify-center py-32 text-center opacity-50">
                        <p className="text-xl text-white">No tracks found</p>
                    </div>
                )}
            </div>
        </motion.div>
    );
};

const getGradientForPlaylist = (name) => {
    const gradients = [
        '#667eea, #764ba2',
        '#f093fb, #f5576c',
        '#4facfe, #00f2fe',
        '#43e97b, #38f9d7',
        '#fa709a, #fee140',
        '#30cfd0, #330867',
        '#a8edea, #fed6e3',
        '#ff9a9e, #fecfef'
    ];
    const index = (name?.length || 0) % gradients.length;
    return gradients[index];
};

export default YoutubePlaylistView;
