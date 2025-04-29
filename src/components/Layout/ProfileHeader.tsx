
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { User, Settings, PencilLine } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import useBookkeeping from '@/hooks/useBookkeeping';

interface ProfileHeaderProps {
  className?: string;
}

const ProfileHeader: React.FC<ProfileHeaderProps> = ({ className }) => {
  const { resetChat, clearEntries } = useBookkeeping();
  
  return (
    <header className={cn('w-full border-b border-border h-16 flex items-center px-4', className)}>
      <div className="container flex items-center justify-between">
        <Link to="/" className="flex items-center space-x-2">
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
          </svg>
          <span className="text-xl font-semibold text-foreground font-comic-sans">Beekay</span>
        </Link>

        <div className="flex items-center space-x-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-secondary cursor-pointer hover:bg-secondary/80 transition-colors">
                <User className="w-4 h-4 text-muted-foreground" />
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>User Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <Settings className="mr-2 h-4 w-4" />
                <span>Settings</span>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <User className="mr-2 h-4 w-4" />
                <span>Profile</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={clearEntries}>
                <PencilLine className="mr-2 h-4 w-4" />
                <span>Clear Entries</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <span className="text-sm font-medium">User</span>
        </div>
      </div>
    </header>
  );
};

export default ProfileHeader;
