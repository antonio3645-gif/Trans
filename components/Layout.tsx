import React from 'react';
import { BottomNav } from './BottomNav';

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col pb-24">
      {/* Added pt-[env(safe-area-inset-top)] to handle status bars/notches on mobile */}
      <div className="flex-1 max-w-md mx-auto w-full bg-gray-50 shadow-2xl min-h-screen relative overflow-hidden pt-[env(safe-area-inset-top)]">
        {children}
      </div>
      <BottomNav />
    </div>
  );
};