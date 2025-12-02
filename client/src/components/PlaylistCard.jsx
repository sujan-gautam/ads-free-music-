import React from 'react';
import { Play } from 'lucide-react';
import { motion } from 'framer-motion';

const PlaylistCard = ({ playlist, onPlay, onClick }) => {
    // Generate a gradient thumbnail based on playlist name
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
        const index = name.length % gradients.length;
        return gradients[index];
    };

    return (
        <motion.div
            className="group relative cursor-pointer"
            whileHover={{ y: -5 }}
            onClick={onClick}
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
                <h3 className="text-white font-bold truncate text-base group-hover:text-accent transition-colors">{playlist.name}</h3>
                <p className="text-slate-400 text-sm truncate">{playlist.description}</p>
                <span className="text-xs text-slate-500 uppercase tracking-wider font-semibold">{playlist.songs} songs</span>
            </div>
        </motion.div>
    );
};

export default PlaylistCard;
