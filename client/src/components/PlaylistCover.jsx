import React from 'react';
import { Music } from 'lucide-react';
import { cn } from '../lib/utils';

const PlaylistCover = ({ tracks, className = "" }) => {
    // If no tracks, show placeholder
    if (!tracks || tracks.length === 0) {
        return (
            <div className={cn("w-full h-full bg-gradient-to-br from-slate-800 to-slate-900 flex items-center justify-center text-slate-500", className)}>
                <Music size={48} />
            </div>
        );
    }

    // If only 1 track, show single image with subtle overlay
    if (tracks.length === 1) {
        return (
            <div className={cn("w-full h-full relative overflow-hidden", className)}>
                <img
                    src={tracks[0].thumbnail}
                    alt="Playlist cover"
                    className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
            </div>
        );
    }

    // If 2-3 tracks, show 2x1 grid
    if (tracks.length < 4) {
        return (
            <div className={cn("w-full h-full grid grid-cols-2 gap-0.5 bg-slate-950", className)}>
                {tracks.slice(0, 2).map((track, index) => (
                    <div key={index} className="relative overflow-hidden">
                        <img
                            src={track.thumbnail}
                            alt={`Cover part ${index + 1}`}
                            className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-black/10" />
                    </div>
                ))}
            </div>
        );
    }

    // If 4 or more tracks, show 2x2 grid with cute aesthetic
    return (
        <div className={cn("w-full h-full grid grid-cols-2 gap-0.5 bg-slate-950 p-0.5", className)}>
            {tracks.slice(0, 4).map((track, index) => (
                <div
                    key={index}
                    className="relative overflow-hidden rounded-sm group"
                >
                    <img
                        src={track.thumbnail}
                        alt={`Cover part ${index + 1}`}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                    />
                    {/* Subtle overlay for depth */}
                    <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-black/20" />

                    {/* Cute corner accent */}
                    <div className={cn(
                        "absolute w-3 h-3 bg-accent/30 backdrop-blur-sm",
                        index === 0 && "top-0 left-0 rounded-br-full",
                        index === 1 && "top-0 right-0 rounded-bl-full",
                        index === 2 && "bottom-0 left-0 rounded-tr-full",
                        index === 3 && "bottom-0 right-0 rounded-tl-full"
                    )} />
                </div>
            ))}
        </div>
    );
};

export default PlaylistCover;
