import React from 'react';
import { Home, Search, ListMusic, Music2, Compass, Library, Settings } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '../lib/utils';

const Sidebar = ({ activeView, setActiveView }) => {
    const navItems = [
        { id: 'home', icon: Home, label: 'Home' },
        { id: 'explore', icon: Compass, label: 'Explore' },
        { id: 'search', icon: Search, label: 'Search' },
        { type: 'separator' },
        { id: 'library', icon: Library, label: 'Library' },
        { id: 'queue', icon: ListMusic, label: 'Queue' }
    ];

    return (
        <aside className="hidden md:flex flex-col w-20 lg:w-64 h-screen bg-gradient-to-b from-slate-800 to-slate-900 text-slate-300 border-r border-white/5 backdrop-blur-lg z-50 transition-all duration-300 ease-in-out">
            <div className="flex items-center justify-center h-20 mb-4">
                <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="flex items-center gap-3 text-accent"
                >
                    <Music2 className="w-8 h-8" />
                    <h1 className="hidden lg:block text-2xl font-bold tracking-tight text-white">StreamFlow</h1>
                </motion.div>
            </div>

            <nav className="flex flex-col gap-2 px-3 flex-1">
                {navItems.map((item, index) => {
                    if (item.type === 'separator') {
                        return <div key={index} className="h-px bg-white/10 my-4 mx-2" />;
                    }

                    const Icon = item.icon;
                    const isActive = activeView === item.id;

                    return (
                        <button
                            key={item.id}
                            onClick={() => setActiveView(item.id)}
                            className={cn(
                                "group flex items-center gap-4 px-3 py-3 rounded-xl transition-all duration-200 relative overflow-hidden",
                                isActive
                                    ? "bg-white/10 text-white shadow-md"
                                    : "text-slate-400 hover:text-white hover:bg-white/5"
                            )}
                            title={item.label}
                        >
                            <Icon size={22} className={cn("transition-colors min-w-[22px]", isActive ? "text-accent" : "group-hover:text-white")} />
                            <span className="hidden lg:inline text-sm font-medium">{item.label}</span>

                            {isActive && (
                                <motion.div
                                    layoutId="activeNav"
                                    className="absolute left-0 top-1/2 -translate-y-1/2 h-8 w-1 bg-accent rounded-r-full"
                                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                />
                            )}
                        </button>
                    );
                })}
            </nav>

            <div className="mt-auto p-4">
                <button className="w-full flex items-center justify-center lg:justify-start gap-4 p-3 rounded-xl hover:bg-white/5 text-slate-400 hover:text-white transition-all">
                    <Settings size={22} />
                    <span className="hidden lg:inline text-sm font-medium">Settings</span>
                </button>
                <div className="mt-4 text-[10px] text-slate-600 text-center lg:text-left px-2 hidden lg:block">
                    v1.0.0 • Premium
                </div>
            </div>
        </aside>
    );
};

export default Sidebar;
