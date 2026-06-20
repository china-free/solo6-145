import React from 'react';
import { NavLink } from 'react-router-dom';
import { Shirt, Calendar, Sparkles, BarChart3 } from 'lucide-react';

const navItems = [
  { path: '/', label: '衣橱', icon: Shirt },
  { path: '/outfits', label: '穿搭', icon: Calendar },
  { path: '/recommend', label: '推荐', icon: Sparkles },
  { path: '/stats', label: '统计', icon: BarChart3 },
];

export const Navbar: React.FC = () => {
  return (
    <nav className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-cream-200 shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-rose-brown-300 to-terracotta-400 rounded-xl flex items-center justify-center shadow-soft">
              <span className="text-xl">👗</span>
            </div>
            <h1 className="text-xl font-display font-bold bg-gradient-to-r from-rose-brown-500 to-terracotta-500 bg-clip-text text-transparent">
              Wardrobe
            </h1>
          </div>

          <div className="flex items-center gap-1">
            {navItems.map(({ path, label, icon: Icon }) => (
              <NavLink
                key={path}
                to={path}
                end={path === '/'}
                className={({ isActive }) =>
                  `flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                    isActive
                      ? 'bg-rose-brown-100 text-rose-brown-600 shadow-soft'
                      : 'text-gray-600 hover:bg-cream-100 hover:text-gray-800'
                  }`
                }
              >
                <Icon className="w-4 h-4" />
                <span className="hidden sm:inline">{label}</span>
              </NavLink>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
};
