
import React from 'react';
import { cn } from '@/lib/utils';

interface HeaderProps {
  className?: string;
}

const Header: React.FC<HeaderProps> = ({ className }) => {
  return (
    <header className={cn('w-full flex justify-center items-center py-6 bg-transparent z-10', className)}>
      <div className="container flex items-center justify-between px-6">
        <div className="flex items-center space-x-2">
          <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-burgundy">
            {/* Heart with sunglasses and cherry stem */}
            <path d="M16 26C16 26 27 19 27 11C27 7 24 4 20 4C18 4 16.5 5 16 6C15.5 5 14 4 12 4C8 4 5 7 5 11C5 19 16 26 16 26Z" 
              fill="hsl(var(--burgundy))" stroke="white" strokeWidth="1.5" />
            {/* Cherry stem - now angled with a knot */}
            <path d="M16 4C16 4 17 2.5 17.5 1.5 M17.5 1.5C17.8 1.8 17.2 2.2 17 2.5" stroke="hsl(var(--burgundy))" strokeWidth="1.5" strokeLinecap="round" />
            {/* Sunglasses - Left lens */}
            <circle cx="12" cy="10" r="3.5" fill="none" stroke="white" strokeWidth="1.75" />
            {/* Sunglasses - Right lens */}
            <circle cx="20" cy="10" r="3.5" fill="none" stroke="white" strokeWidth="1.75" />
            {/* Sunglasses - Bridge */}
            <line x1="15" y1="10" x2="17" y2="10" stroke="white" strokeWidth="1.75" />
            {/* Sunglasses - Left Arm */}
            <line x1="8.5" y1="10" x2="5" y2="9" stroke="white" strokeWidth="1.75" />
            {/* Sunglasses - Right Arm */}
            <line x1="23.5" y1="10" x2="27" y2="9" stroke="white" strokeWidth="1.75" />
          </svg>
          <span className="text-xl font-semibold text-foreground font-comic-sans">Beekae</span>
        </div>
      </div>
    </header>
  );
};

export default Header;
