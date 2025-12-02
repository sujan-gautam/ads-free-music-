import React, { useRef, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Music, RefreshCw, Sparkles, Radio, Zap, Play, Mic2, LayoutGrid, List, Music2 } from 'lucide-react';
import { cn } from '../lib/utils';
import LyricsCard from './LyricsCard';

const LyricsView = ({
    lyrics,
    currentTime,
    isPlaying,
    isLoading,
    error,
    karaokeMode = false,
    onToggleKaraoke,
    onRefetch,
    currentTrack
}) => {
    const containerRef = useRef(null);
    const lineRefs = useRef({});
    const [userScrolling, setUserScrolling] = useState(false);
    const [cardView, setCardView] = useState(false);
    const scrollTimeoutRef = useRef(null);
    const lastScrollTime = useRef(0);

    const getCurrentLineIndex = () => {
        if (!lyrics?.lines || lyrics.lines.length === 0) return -1;
        for (let i = lyrics.lines.length - 1; i >= 0; i--) {
            if (currentTime >= lyrics.lines[i].time) return i;
        }
        return -1;
    };

    const currentLineIndex = getCurrentLineIndex();

    useEffect(() => {
        if (userScrolling || !isPlaying || currentLineIndex === -1) return;

        const currentLineElement = lineRefs.current[currentLineIndex];
        if (currentLineElement && containerRef.current) {
            const container = containerRef.current;
            const lineTop = currentLineElement.offsetTop;
            const lineHeight = currentLineElement.offsetHeight;
            const containerHeight = container.offsetHeight;
            const scrollTo = lineTop - (containerHeight / 2) + (lineHeight / 2);

            container.scrollTo({ top: scrollTo, behavior: 'smooth' });
        }
    }, [currentLineIndex, userScrolling, isPlaying]);

    const handleScroll = () => {
        const now = Date.now();
        if (now - lastScrollTime.current > 100) {
            setUserScrolling(true);
            if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current);
            scrollTimeoutRef.current = setTimeout(() => setUserScrolling(false), 3000);
        }
        lastScrollTime.current = now;
    };

    const getSourceBadge = () => {
        if (!lyrics?.source) return null;
        const badges = {
            'youtube_captions': { icon: Play, text: 'YouTube', color: 'text-red-400', bg: 'bg-red-500/10', border: 'border-red-500/20' },
            'lrclib': { icon: Zap, text: 'LRCLIB', color: 'text-accent', bg: 'bg-accent/10', border: 'border-accent/20' },
            'genius_generated': { icon: Sparkles, text: 'Genius', color: 'text-yellow-400', bg: 'bg-yellow-400/10', border: 'border-yellow-400/20' }
        };
        return badges[lyrics.source] || { icon: Music, text: 'Lyrics', color: 'text-slate-400', bg: 'bg-white/5', border: 'border-white/10' };
    };

    const sourceBadge = getSourceBadge();

    if (isLoading) {
        return (
            <div className="flex-1 flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <div className="relative w-12 h-12">
                        <div className="absolute inset-0 border-2 border-transparent border-t-accent rounded-full animate-spin" />
                        <Music className="absolute inset-0 m-auto text-accent/50" size={20} />
                    </div>
                    <p className="text-sm text-slate-400 animate-pulse">
                        Loading lyrics...
                    </p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex-1 flex items-center justify-center p-8">
                <div className="flex flex-col items-center gap-4 text-center max-w-sm">
                    <div className="w-14 h-14 flex items-center justify-center bg-white/5 rounded-full">
                        <Music size={28} className="text-white/20" />
                    </div>
                    <h3 className="text-lg font-semibold text-white">No Lyrics Found</h3>
                    <p className="text-sm text-slate-400 leading-relaxed">{error}</p>
                    {onRefetch && (
                        <button
                            onClick={onRefetch}
                            className="mt-2 flex items-center gap-2 px-5 py-2.5 bg-white text-black rounded-full font-semibold text-sm hover:scale-105 transition-transform"
                        >
                            <RefreshCw size={14} />
                            Try Again
                        </button>
                    )}
                </div>
            </div>
        );
    }

    if (!lyrics || !lyrics.lines || lyrics.lines.length === 0) {
        return (
            <div className="flex-1 flex items-center justify-center p-8">
                <div className="flex flex-col items-center gap-4 text-center">
                    <div className="w-14 h-14 flex items-center justify-center bg-white/5 rounded-full">
                        <Mic2 size={28} className="text-white/20" />
                    </div>
                    <h3 className="text-lg font-semibold text-white">No Lyrics Available</h3>
                    <p className="text-sm text-slate-400">We couldn't find lyrics for this track</p>
                </div>
            </div>
        );
    }

    return (
        <div
            ref={containerRef}
            onScroll={handleScroll}
            className="flex-1 overflow-y-auto overflow-x-hidden scroll-smooth relative"
            style={{
                scrollbarWidth: 'thin',
                scrollbarColor: 'rgba(255,255,255,0.2) transparent'
            }}
        >
            {/* Sticky Header */}
            <div className="sticky top-0 z-50 px-6 py-3 bg-slate-900/80 backdrop-blur-xl border-b border-white/5 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    {sourceBadge && (
                        <div className={cn(
                            "flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-[10px] font-semibold uppercase tracking-wider",
                            sourceBadge.color,
                            sourceBadge.bg,
                            sourceBadge.border
                        )}>
                            <sourceBadge.icon size={10} />
                            <span>{sourceBadge.text}</span>
                        </div>
                    )}
                </div>

                <div className="flex items-center gap-2">
                    {/* Card View Toggle */}
                    <button
                        onClick={() => setCardView(!cardView)}
                        className={cn(
                            "flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all",
                            cardView
                                ? "bg-accent text-white shadow-lg shadow-accent/20"
                                : "bg-white/10 text-slate-300 hover:bg-white/15 hover:text-white"
                        )}
                        title={cardView ? "Show full lyrics" : "Show card view"}
                    >
                        {cardView ? <List size={12} /> : <LayoutGrid size={12} />}
                        <span>{cardView ? "Full" : "Card"}</span>
                    </button>

                    {/* Karaoke Toggle */}
                    {onToggleKaraoke && !cardView && (
                        <button
                            onClick={onToggleKaraoke}
                            className={cn(
                                "flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all",
                                karaokeMode
                                    ? "bg-accent text-white shadow-lg shadow-accent/20"
                                    : "bg-white/10 text-slate-300 hover:bg-white/15 hover:text-white"
                            )}
                        >
                            <Sparkles size={12} className={karaokeMode ? "fill-white" : ""} />
                            <span>Karaoke</span>
                        </button>
                    )}
                </div>
            </div>

            {/* Scroll Indicator */}
            <AnimatePresence>
                {userScrolling && !cardView && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="fixed top-16 left-1/2 -translate-x-1/2 z-40 px-3 py-1.5 bg-white text-black rounded-full text-xs font-semibold shadow-xl flex items-center gap-1.5"
                    >
                        <Radio size={10} className="text-accent animate-pulse" />
                        <span>Auto-scroll paused</span>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Card View */}
            {cardView ? (
                <div className="flex-1 flex items-center justify-center p-8">
                    <LyricsCard
                        currentTrack={currentTrack}
                        currentLyric={lyrics?.lines?.[currentLineIndex]?.text}
                    />
                </div>
            ) : (
                /* Full Lyrics View */
                <>
                    {/* Lyrics Container */}
                    <div className="px-6 py-12 flex flex-col gap-3 min-h-full">
                        {lyrics.lines.map((line, index) => {
                            const isActive = index === currentLineIndex;
                            const distance = Math.abs(index - currentLineIndex);

                            // Better opacity gradient - more visible
                            const getOpacity = () => {
                                if (isActive) return 1;
                                if (distance === 1) return 0.75;
                                if (distance === 2) return 0.6;
                                if (distance === 3) return 0.5;
                                return 0.4;
                            };

                            return (
                                <motion.div
                                    key={index}
                                    ref={el => lineRefs.current[index] = el}
                                    initial={false}
                                    animate={{
                                        opacity: getOpacity(),
                                    }}
                                    transition={{
                                        duration: 0.6,
                                        ease: [0.25, 0.1, 0.25, 1],
                                    }}
                                    className="relative cursor-pointer"
                                    onClick={() => {
                                        // Optional: Seek to this line
                                    }}
                                >
                                    {karaokeMode && isActive ? (
                                        <KaraokeLine
                                            text={line.text}
                                            lineTime={line.time}
                                            nextLineTime={lyrics.lines[index + 1]?.time}
                                            currentTime={currentTime}
                                        />
                                    ) : (
                                        <motion.p
                                            initial={false}
                                            animate={{
                                                scale: isActive ? 1 : 0.85,
                                                fontWeight: isActive ? 700 : 500,
                                                color: isActive ? '#ffffff' : '#94a3b8'
                                            }}
                                            transition={{
                                                duration: 0.6,
                                                ease: [0.25, 0.1, 0.25, 1],
                                                scale: { duration: 0.5, ease: [0.34, 1.56, 0.64, 1] },
                                                fontWeight: { duration: 0.4 },
                                                color: { duration: 0.5 }
                                            }}
                                            className="text-center leading-snug origin-center px-4"
                                            style={{
                                                fontFamily: "'Inter', sans-serif",
                                                fontSize: isActive ? '28px' : '20px',
                                                letterSpacing: isActive ? '-0.01em' : '0',
                                                willChange: 'transform'
                                            }}
                                        >
                                            {line.text}
                                        </motion.p>
                                    )}
                                </motion.div>
                            );
                        })}
                    </div>

                    {/* Bottom Spacer */}
                    <div className="h-[50vh]" />
                </>
            )}
        </div>
    );
};

const KaraokeLine = ({ text, lineTime, nextLineTime, currentTime }) => {
    const words = text.split(' ');
    const lineDuration = nextLineTime ? nextLineTime - lineTime : 3;
    const timePerWord = lineDuration / words.length;

    return (
        <p className="text-center text-[28px] font-bold leading-snug tracking-tight origin-center px-4">
            {words.map((word, i) => {
                const wordStartTime = lineTime + (i * timePerWord);
                const wordEndTime = wordStartTime + timePerWord;
                const isActive = currentTime >= wordStartTime && currentTime < wordEndTime;
                const isPast = currentTime > wordEndTime;

                return (
                    <span
                        key={i}
                        className={cn(
                            "inline-block mx-1 transition-all duration-200",
                            isActive || isPast ? "text-accent scale-105" : "text-white/25"
                        )}
                    >
                        {word}
                    </span>
                );
            })}
        </p>
    );
};

export default LyricsView;
