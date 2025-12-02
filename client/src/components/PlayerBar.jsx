import React from 'react';
import { Play, Pause, SkipBack, SkipForward, Repeat, Shuffle, Volume2, VolumeX, Maximize2, Heart, ListPlus, Mic2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '../lib/utils';

const PlayerBar = ({
    currentTrack,
    isPlaying,
    togglePlayPause,
    playNext,
    playPrev,
    shuffle,
    setShuffle,
    repeat,
    setRepeat,
    currentTime,
    duration,
    handleProgressClick,
    handleProgressDrag,
    volume,
    setVolume,
    isMuted,
    setIsMuted,
    formatTime,
    progressPercent,
    toggleFavorite,
    favorites,
    openPlaylistModal,
    isLyricsPanelOpen,
    toggleLyrics
}) => {
    if (!currentTrack) return null;

    const isFav = favorites.some(t => t.videoId === currentTrack.videoId);

    return (
        <motion.div
            initial={{ y: 100 }}
            animate={{ y: 0 }}
            className="fixed bottom-[60px] md:bottom-0 left-0 right-0 h-16 md:h-24 bg-slate-900/95 backdrop-blur-xl border-t border-white/5 flex items-center justify-between px-4 md:px-6 z-50 shadow-2xl"
        >
            {/* Mobile Progress Bar (Top) */}
            <div
                className="absolute top-0 left-0 right-0 h-[2px] bg-slate-800 md:hidden"
                onClick={handleProgressClick}
            >
                <div
                    className="h-full bg-accent"
                    style={{ width: `${progressPercent}%` }}
                />
            </div>

            {/* Track Info */}
            <div className="flex items-center flex-1 md:w-[30%] md:min-w-[200px] gap-3 md:gap-4 overflow-hidden">
                <motion.div
                    className="relative group shrink-0"
                    whileHover={{ scale: 1.05 }}
                >
                    <img
                        src={currentTrack.thumbnail}
                        alt={currentTrack.title}
                        className="h-10 w-10 md:h-16 md:w-16 rounded-lg md:rounded-xl shadow-lg object-cover"
                    />
                    <div className="absolute inset-0 bg-black/20 rounded-lg md:rounded-xl opacity-0 group-hover:opacity-100 transition-opacity hidden md:block" />
                </motion.div>
                <div className="flex flex-col justify-center overflow-hidden min-w-0">
                    <div className="text-sm md:text-base font-bold text-white truncate hover:underline cursor-pointer">
                        {currentTrack.title}
                    </div>
                    <div className="text-xs md:text-sm text-slate-400 truncate hover:text-white cursor-pointer transition-colors">
                        {currentTrack.uploader}
                    </div>
                </div>
                <div className="hidden md:flex items-center gap-1 ml-2">
                    <button
                        className={cn(
                            "p-2 rounded-full transition-all hover:bg-white/10",
                            isFav ? "text-accent" : "text-slate-400 hover:text-white"
                        )}
                        onClick={() => toggleFavorite(currentTrack)}
                        title={isFav ? "Remove from Favorites" : "Add to Favorites"}
                    >
                        <Heart size={20} fill={isFav ? "currentColor" : "none"} />
                    </button>
                    <button
                        className="p-2 rounded-full text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
                        onClick={() => openPlaylistModal(currentTrack)}
                        title="Add to Playlist"
                    >
                        <ListPlus size={20} />
                    </button>
                </div>
            </div>

            {/* Controls & Progress (Desktop) / Play Controls (Mobile) */}
            <div className="flex flex-col items-center md:w-[40%] md:max-w-2xl gap-2 shrink-0">
                <div className="flex items-center gap-3 md:gap-6">
                    <button
                        className={cn(
                            "hidden md:block p-2 rounded-full transition-all hover:bg-white/5",
                            shuffle ? "text-accent relative after:content-[''] after:absolute after:-bottom-1 after:left-1/2 after:-translate-x-1/2 after:w-1 after:h-1 after:bg-accent after:rounded-full" : "text-slate-400 hover:text-white"
                        )}
                        onClick={() => setShuffle(!shuffle)}
                        title="Shuffle"
                    >
                        <Shuffle size={20} />
                    </button>

                    <button
                        className="hidden md:block text-slate-300 hover:text-white transition-colors p-2 hover:bg-white/5 rounded-full"
                        onClick={playPrev}
                        title="Previous"
                    >
                        <SkipBack size={24} fill="currentColor" />
                    </button>

                    <button
                        className="w-10 h-10 md:w-12 md:h-12 bg-white rounded-full text-black flex items-center justify-center hover:scale-105 transition-transform shadow-lg hover:shadow-xl"
                        onClick={togglePlayPause}
                    >
                        {isPlaying ? <Pause size={20} md:size={24} fill="currentColor" /> : <Play size={20} md:size={24} fill="currentColor" className="ml-1" />}
                    </button>

                    <button
                        className="text-slate-300 hover:text-white transition-colors p-2 hover:bg-white/5 rounded-full"
                        onClick={playNext}
                        title="Next"
                    >
                        <SkipForward size={24} fill="currentColor" />
                    </button>

                    <button
                        className={cn(
                            "hidden md:block p-2 rounded-full transition-all hover:bg-white/5",
                            repeat ? "text-accent relative after:content-[''] after:absolute after:-bottom-1 after:left-1/2 after:-translate-x-1/2 after:w-1 after:h-1 after:bg-accent after:rounded-full" : "text-slate-400 hover:text-white"
                        )}
                        onClick={() => setRepeat(!repeat)}
                        title="Repeat"
                    >
                        <Repeat size={20} />
                    </button>
                </div>

                <div className="hidden md:flex w-full items-center gap-3 text-xs text-slate-400 font-medium font-variant-numeric">
                    <span className="min-w-[40px] text-right">{formatTime(currentTime)}</span>
                    <div
                        className="flex-1 h-1.5 bg-slate-700/50 rounded-full relative group cursor-pointer overflow-hidden"
                        onClick={handleProgressClick}
                    >
                        <div
                            className="absolute inset-y-0 left-0 bg-white rounded-full group-hover:bg-accent transition-colors shadow-[0_0_10px_rgba(255,255,255,0.5)] group-hover:shadow-[0_0_15px_rgba(16,185,129,0.6)]"
                            style={{ width: `${progressPercent}%` }}
                        />
                    </div>
                    <span className="min-w-[40px]">{formatTime(duration)}</span>
                </div>
            </div>

            {/* Right Controls (Desktop Only) */}
            <div className="hidden md:flex items-center justify-end w-[30%] min-w-[200px] gap-4">
                <button
                    className={cn(
                        "p-2 rounded-full transition-colors hover:bg-white/10",
                        isLyricsPanelOpen ? "text-accent bg-white/5" : "text-slate-400 hover:text-white"
                    )}
                    onClick={toggleLyrics}
                    title="Lyrics"
                >
                    <Mic2 size={20} />
                </button>

                <div className="flex items-center gap-2 group w-32">
                    <button
                        className="p-2 text-slate-400 hover:text-white transition-colors"
                        onClick={() => setIsMuted(!isMuted)}
                    >
                        {isMuted || volume === 0 ? <VolumeX size={20} /> : <Volume2 size={20} />}
                    </button>
                    <div className="flex-1 h-1 bg-slate-700 rounded-full relative overflow-hidden">
                        <input
                            type="range"
                            min="0"
                            max="1"
                            step="0.01"
                            value={isMuted ? 0 : volume}
                            onChange={(e) => setVolume(parseFloat(e.target.value))}
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                        />
                        <div
                            className="h-full bg-white rounded-full group-hover:bg-accent transition-colors"
                            style={{ width: `${(isMuted ? 0 : volume) * 100}%` }}
                        />
                    </div>
                </div>

                <button className="p-2 text-slate-400 hover:text-white transition-colors hover:bg-white/10 rounded-full">
                    <Maximize2 size={20} />
                </button>
            </div>
        </motion.div>
    );
};

export default PlayerBar;
