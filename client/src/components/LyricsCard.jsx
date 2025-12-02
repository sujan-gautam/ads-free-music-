import React from 'react';
import { motion } from 'framer-motion';
import { Music } from 'lucide-react';

const LyricsCard = ({ currentTrack, currentLyric }) => {
    if (!currentTrack) return null;

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-sm mx-auto"
        >
            <div className="relative bg-gradient-to-br from-amber-900/40 via-stone-900/60 to-neutral-900/80 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-white/10">
                {/* Album Art & Track Info */}
                <div className="flex items-center gap-4 mb-8">
                    <div className="relative w-20 h-20 rounded-lg overflow-hidden shadow-xl ring-1 ring-white/20 shrink-0">
                        {currentTrack.thumbnail ? (
                            <img
                                src={currentTrack.thumbnail}
                                alt={currentTrack.title}
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <div className="w-full h-full bg-gradient-to-br from-amber-600 to-orange-800 flex items-center justify-center">
                                <Music className="text-white/50" size={32} />
                            </div>
                        )}
                    </div>
                    <div className="flex-1 min-w-0">
                        <h3 className="text-amber-200/90 font-bold text-lg truncate mb-1">
                            {currentTrack.title}
                        </h3>
                        <p className="text-amber-300/60 text-sm truncate">
                            {currentTrack.uploader}
                        </p>
                    </div>
                </div>

                {/* Current Lyric */}
                <div className="mb-6">
                    <motion.p
                        key={currentLyric}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="text-amber-100/90 text-2xl md:text-3xl font-bold leading-relaxed tracking-tight"
                        style={{
                            fontFamily: "'Inter', sans-serif",
                            textShadow: '0 2px 10px rgba(0,0,0,0.3)'
                        }}
                    >
                        {currentLyric || "♪ ♪ ♪"}
                    </motion.p>
                </div>

                {/* App Branding */}
                <div className="flex items-center gap-2 text-amber-300/40">
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M9 18V5l12-2v13" />
                        <circle cx="6" cy="18" r="3" />
                        <circle cx="18" cy="16" r="3" />
                    </svg>
                    <span className="text-xs font-semibold">StreamFlow</span>
                </div>

                {/* Decorative gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-3xl pointer-events-none" />
            </div>
        </motion.div>
    );
};

export default LyricsCard;
