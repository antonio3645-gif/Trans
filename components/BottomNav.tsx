import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Truck, PlusCircle } from 'lucide-react';

export const BottomNav: React.FC = () => {
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  const navItems = [
    { path: '/', icon: LayoutDashboard, label: 'Início' },
    { path: '/freights', icon: Truck, label: 'Fretes' },
    { path: '/add', icon: PlusCircle, label: 'Novo', highlight: true },
  ];

  return (
    // Added pb-[env(safe-area-inset-bottom)] specifically for iPhone Home Indicator
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 pt-2 px-4 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] z-50 pb-[env(safe-area-inset-bottom)]">
      {/* Added extra padding bottom to lift icons above the safe area */}
      <div className="flex justify-around items-end pb-2">
        {navItems.map((item) => {
          const active = isActive(item.path);
          const Icon = item.icon;
          
          if (item.highlight) {
            return (
              <Link key={item.path} to={item.path} className="relative -top-5">
                <div className="bg-brand-600 text-white p-4 rounded-full shadow-lg shadow-brand-500/40 hover:scale-105 transition-transform">
                  <Icon size={28} />
                </div>
              </Link>
            );
          }

          return (
            <Link 
              key={item.path} 
              to={item.path}
              className={`flex flex-col items-center gap-1 p-2 min-w-[60px] ${active ? 'text-brand-600' : 'text-gray-400'}`}
            >
              <Icon size={24} strokeWidth={active ? 2.5 : 2} />
              <span className="text-[10px] font-medium">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
};