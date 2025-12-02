import React, { useRef } from 'react';
import { ChevronLeft, ChevronRight, Play } from 'lucide-react';
import { motion } from 'framer-motion';

const PlaylistCarousel = ({ title, playlists, onPlaylistPlay, onPlaylistClick }) => {
    const scrollRef = useRef(null);

    const scroll = (direction) => {
        if (scrollRef.current) {
            const scrollAmount = 600;
            scrollRef.current.scrollBy({
                left: direction === 'left' ? -scrollAmount : scrollAmount,
                behavior: 'smooth'
            });
        }
    };

    return (
        <div className="mb-12">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-white tracking-tight">{title}</h2>
                <div className="flex gap-2">
                    <button
                        onClick={() => scroll('left')}
                        className="p-2 rounded-full bg-white/5 hover:bg-white/10 text-white transition-colors disabled:opacity-50 border border-white/5"
                    >
                        <ChevronLeft size={24} />
                    </button>
                    <button
                        onClick={() => scroll('right')}
                        className="p-2 rounded-full bg-white/5 hover:bg-white/10 text-white transition-colors disabled:opacity-50 border border-white/5"
                    >
                        <ChevronRight size={24} />
                    </button>
                </div>
            </div>
            <div
                className="flex gap-6 overflow-x-auto pb-4 scrollbar-hide snap-x"
                ref={scrollRef}
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
                {playlists.map((playlist, index) => (
                    <PlaylistCardInline
                        key={playlist.id}
                        playlist={playlist}
                        onPlay={onPlaylistPlay}
                        onClick={onPlaylistClick}
                        index={index}
                    />
                ))}
            </div>
        </div>
    );
};

const PlaylistCardInline = ({ playlist, onPlay, onClick, index }) => {
    const getGradient = (name) => {
        const gradients = [
            'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
            'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
            'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
            'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
            'linear-gradient(135deg, #30cfd0 0%, #330867 100%)',
            'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
            'linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)'
        ];
        return gradients[index % gradients.length];
    };

    return (
        <motion.div
            className="min-w-[200px] w-[200px] snap-start cursor-pointer group"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            whileHover={{ y: -5 }}
            onClick={() => onClick(playlist)}
        >
            <div
                className="aspect-square rounded-xl mb-4 relative overflow-hidden shadow-lg group-hover:shadow-xl transition-all duration-300 ring-1 ring-white/10"
                style={{ background: getGradient(playlist.name) }}
            >
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors duration-300" />

                <motion.button
                    className="absolute bottom-2 right-2 w-12 h-12 bg-accent rounded-full flex items-center justify-center text-white shadow-lg translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 hover:bg-accent-light"
                    onClick={(e) => {
                        e.stopPropagation();
                        onPlay(playlist);
                    }}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                >
                    <Play size={24} fill="currentColor" className="ml-1" />
                </motion.button>
            </div>
            <div className="space-y-1">
                <h4 className="text-white font-bold truncate text-base group-hover:text-accent transition-colors">{playlist.name}</h4>
                <p className="text-slate-400 text-sm truncate">{playlist.description}</p>
                <span className="text-xs text-slate-500 uppercase tracking-wider font-semibold">{playlist.songs} songs</span>
            </div>
        </motion.div>
    );
};

export default PlaylistCarousel;
