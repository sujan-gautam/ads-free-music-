import React from 'react';
import { Home, Search, ListMusic, Compass, Library } from 'lucide-react';
import { cn } from '../lib/utils';

const MobileNav = ({ activeView, setActiveView }) => {
    const navItems = [
        { id: 'home', icon: Home, label: 'Home' },
        { id: 'explore', icon: Compass, label: 'Explore' },
        { id: 'search', icon: Search, label: 'Search' },
        { id: 'library', icon: Library, label: 'Library' },
        { id: 'queue', icon: ListMusic, label: 'Queue' }
    ];

    return (
        <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-slate-900/95 backdrop-blur-xl border-t border-white/5 z-50 pb-safe">
            <div className="flex items-center justify-around p-2">
                {navItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = activeView === item.id;

                    return (
                        <button
                            key={item.id}
                            onClick={() => setActiveView(item.id)}
                            className={cn(
                                "flex flex-col items-center gap-1 p-2 rounded-lg transition-all duration-200 w-full",
                                isActive ? "text-accent" : "text-slate-400 hover:text-white"
                            )}
                        >
                            <Icon size={24} strokeWidth={isActive ? 2.5 : 2} />
                            <span className="text-[10px] font-medium">{item.label}</span>
                        </button>
                    );
                })}
            </div>
        </nav>
    );
};

export default MobileNav;
