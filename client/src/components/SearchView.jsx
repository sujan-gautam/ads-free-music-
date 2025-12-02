import React from 'react';
import { motion } from 'framer-motion';
import { Search, Play, Plus, Heart, ListPlus, Music } from 'lucide-react';
import { cn } from '../lib/utils';

const SearchView = ({
    searchQuery,
    setSearchQuery,
    handleSearch,
    isSearching,
    searchResults,
    playTrack,
    addToQueue,
    formatTime,
    toggleFavorite,
    favorites,
    openPlaylistModal
}) => {
    const [activeFilter, setActiveFilter] = React.useState('all');

    const filters = [
        { id: 'all', label: 'All' },
        { id: 'songs', label: 'Songs' },
        { id: 'videos', label: 'Videos' },
    ];

    const container = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: { staggerChildren: 0.05 }
        }
    };

    const item = {
        hidden: { opacity: 0, y: 10 },
        show: { opacity: 1, y: 0 }
    };

    // Filter results (client-side for now as ytsearch returns mixed/video content)
    // In a real app, this would trigger a backend refetch with type=...
    const filteredResults = searchResults;

    const topResult = searchResults[0];
    const otherResults = searchResults.slice(1);

    return (
        <motion.div
            className="flex-1 overflow-y-auto pb-32"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
        >
            {/* Search Header */}
            <div className="sticky top-0 z-30 px-8 py-6 bg-slate-900/95 backdrop-blur-xl border-b border-white/5 shadow-lg">
                <form onSubmit={handleSearch} className="relative max-w-3xl mx-auto group mb-6">
                    <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-accent transition-colors" size={20} />
                    <input
                        type="text"
                        className="w-full bg-slate-800/50 border border-white/5 rounded-full py-4 pl-14 pr-12 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-accent/50 focus:bg-slate-800 transition-all shadow-sm hover:shadow-md text-lg"
                        placeholder="Search songs, albums, artists..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        autoFocus
                    />
                    {isSearching && (
                        <div className="absolute right-5 top-1/2 -translate-y-1/2">
                            <div className="w-5 h-5 border-2 border-white/10 border-t-accent rounded-full animate-spin" />
                        </div>
                    )}
                </form>

                {/* Filters */}
                <div className="flex items-center justify-center gap-3">
                    {filters.map(filter => (
                        <button
                            key={filter.id}
                            onClick={() => setActiveFilter(filter.id)}
                            className={cn(
                                "px-6 py-2 rounded-full text-sm font-medium transition-all transform hover:scale-105",
                                activeFilter === filter.id
                                    ? "bg-white text-black shadow-md"
                                    : "bg-white/5 text-white hover:bg-white/10 border border-white/5"
                            )}
                        >
                            {filter.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Content */}
            <div className="max-w-7xl mx-auto">
                {isSearching ? (
                    <div className="space-y-8">
                        {/* Skeleton Top Result */}
                        <div className="flex gap-6 items-center p-6 bg-white/5 rounded-2xl animate-pulse">
                            <div className="w-32 h-32 bg-white/10 rounded-full" />
                            <div className="space-y-3 flex-1">
                                <div className="h-6 bg-white/10 rounded w-1/3" />
                                <div className="h-4 bg-white/10 rounded w-1/4" />
                                <div className="flex gap-2 mt-4">
                                    <div className="h-8 w-24 bg-white/10 rounded-full" />
                                    <div className="h-8 w-8 bg-white/10 rounded-full" />
                                </div>
                            </div>
                        </div>
                        {/* Skeleton List */}
                        <div className="space-y-2">
                            {[...Array(5)].map((_, i) => (
                                <div key={i} className="h-16 bg-white/5 rounded-lg animate-pulse" />
                            ))}
                        </div>
                    </div>
                ) : searchResults.length > 0 ? (
                    <motion.div
                        variants={container}
                        initial="hidden"
                        animate="show"
                        className="space-y-8"
                    >
                        {/* Top Result Section (Only for 'All' tab) */}
                        {activeFilter === 'all' && topResult && (
                            <section>
                                <h3 className="text-xl font-bold text-white mb-4">Top Result</h3>
                                <motion.div
                                    variants={item}
                                    className="group relative flex flex-col md:flex-row gap-6 items-center p-6 bg-gradient-to-br from-slate-800/80 to-slate-900/80 border border-white/5 rounded-3xl hover:bg-slate-800 transition-all duration-300"
                                >
                                    <div className="relative shrink-0">
                                        <img
                                            src={topResult.thumbnail}
                                            alt={topResult.title}
                                            className="w-32 h-32 md:w-40 md:h-40 rounded-full object-cover shadow-2xl group-hover:scale-105 transition-transform duration-500"
                                        />
                                        <div className="absolute inset-0 rounded-full bg-black/20 group-hover:bg-black/40 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                                            <button
                                                onClick={() => playTrack(topResult, searchResults)}
                                                className="w-14 h-14 bg-accent rounded-full flex items-center justify-center text-white shadow-xl hover:scale-110 transition-transform"
                                            >
                                                <Play fill="currentColor" className="ml-1" size={28} />
                                            </button>
                                        </div>
                                    </div>
                                    <div className="flex-1 text-center md:text-left space-y-2">
                                        <h2 className="text-2xl md:text-3xl font-bold text-white leading-tight">{topResult.title}</h2>
                                        <div className="flex items-center justify-center md:justify-start gap-2 text-slate-400 text-lg">
                                            <span className="text-white font-medium">{topResult.uploader}</span>
                                            <span>•</span>
                                            <span>Song</span>
                                            <span>•</span>
                                            <span>{formatTime(topResult.duration)}</span>
                                        </div>
                                        <div className="flex items-center justify-center md:justify-start gap-3 mt-4">
                                            <button
                                                onClick={() => playTrack(topResult, searchResults)}
                                                className="px-6 py-2 bg-white text-black rounded-full font-bold hover:bg-slate-200 transition-colors"
                                            >
                                                Play
                                            </button>
                                            <button
                                                onClick={() => toggleFavorite(topResult)}
                                                className={cn(
                                                    "p-2 rounded-full border border-white/10 hover:bg-white/10 transition-colors",
                                                    favorites.some(t => t.videoId === topResult.videoId) ? "text-accent border-accent/50" : "text-white"
                                                )}
                                            >
                                                <Heart size={20} fill={favorites.some(t => t.videoId === topResult.videoId) ? "currentColor" : "none"} />
                                            </button>
                                            <button
                                                onClick={() => openPlaylistModal(topResult)}
                                                className="p-2 rounded-full border border-white/10 text-white hover:bg-white/10 transition-colors"
                                            >
                                                <ListPlus size={20} />
                                            </button>
                                        </div>
                                    </div>
                                </motion.div>
                            </section>
                        )}

                        {/* Songs List Section */}
                        {(activeFilter === 'all' || activeFilter === 'songs') && (
                            <section>
                                <h3 className="text-xl font-bold text-white mb-4">Songs</h3>
                                <div className="space-y-1">
                                    {(activeFilter === 'all' ? otherResults : searchResults).map((track, index) => {
                                        const isFav = favorites.some(t => t.videoId === track.videoId);
                                        return (
                                            <motion.div
                                                key={track.videoId}
                                                variants={item}
                                                className="group flex items-center gap-4 p-2 rounded-xl hover:bg-white/5 transition-colors cursor-pointer"
                                                onClick={() => playTrack(track, searchResults)}
                                            >
                                                <div className="relative shrink-0 w-12 h-12 rounded overflow-hidden">
                                                    <img src={track.thumbnail} alt={track.title} className="w-full h-full object-cover" />
                                                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                                        <Play size={16} fill="currentColor" className="text-white" />
                                                    </div>
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <h4 className="text-white font-medium truncate group-hover:text-accent transition-colors">{track.title}</h4>
                                                    <p className="text-slate-400 text-sm truncate">{track.uploader}</p>
                                                </div>
                                                <div className="hidden md:block text-slate-400 text-sm">
                                                    {formatTime(track.duration)}
                                                </div>
                                                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <button
                                                        onClick={(e) => { e.stopPropagation(); toggleFavorite(track); }}
                                                        className={cn("p-2 hover:text-white transition-colors", isFav ? "text-accent" : "text-slate-400")}
                                                    >
                                                        <Heart size={16} fill={isFav ? "currentColor" : "none"} />
                                                    </button>
                                                    <button
                                                        onClick={(e) => { e.stopPropagation(); addToQueue(track); }}
                                                        className="p-2 text-slate-400 hover:text-white transition-colors"
                                                    >
                                                        <Plus size={16} />
                                                    </button>
                                                    <button
                                                        onClick={(e) => { e.stopPropagation(); openPlaylistModal(track); }}
                                                        className="p-2 text-slate-400 hover:text-white transition-colors"
                                                    >
                                                        <ListPlus size={16} />
                                                    </button>
                                                </div>
                                            </motion.div>
                                        );
                                    })}
                                </div>
                            </section>
                        )}

                        {/* Videos Grid Section */}
                        {activeFilter === 'videos' && (
                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                                {searchResults.map((track) => (
                                    <motion.div
                                        key={track.videoId}
                                        variants={item}
                                        className="group bg-slate-800/40 rounded-xl overflow-hidden hover:bg-slate-800 transition-all cursor-pointer"
                                        onClick={() => playTrack(track, searchResults)}
                                    >
                                        <div className="relative aspect-video">
                                            <img src={track.thumbnail} alt={track.title} className="w-full h-full object-cover" />
                                            <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                                <Play size={32} fill="currentColor" className="text-white" />
                                            </div>
                                            <span className="absolute bottom-2 right-2 px-1.5 py-0.5 bg-black/80 rounded text-xs font-bold text-white">
                                                {formatTime(track.duration)}
                                            </span>
                                        </div>
                                        <div className="p-3">
                                            <h4 className="text-white font-medium truncate">{track.title}</h4>
                                            <p className="text-slate-400 text-sm truncate">{track.uploader}</p>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        )}
                    </motion.div>
                ) : searchQuery && !isSearching ? (
                    <div className="flex flex-col items-center justify-center py-32 text-center opacity-50">
                        <div className="w-24 h-24 bg-white/5 rounded-full flex items-center justify-center mb-6">
                            <Music size={48} className="text-slate-500" />
                        </div>
                        <h3 className="text-2xl font-bold text-white mb-2">No results found</h3>
                        <p className="text-slate-400">We couldn't find any tracks matching "{searchQuery}"</p>
                    </div>
                ) : !searchQuery ? (
                    <div className="flex flex-col items-center justify-center py-32 text-center opacity-50">
                        <div className="w-24 h-24 bg-white/5 rounded-full flex items-center justify-center mb-6">
                            <Search size={48} className="text-slate-500" />
                        </div>
                        <h3 className="text-2xl font-bold text-white mb-2">Search StreamFlow</h3>
                        <p className="text-slate-400">Find your favorite songs, artists, and albums</p>
                    </div>
                ) : null}
            </div>
        </motion.div>
    );
};

export default SearchView;
