'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Disc, Search, User } from 'lucide-react';

const navItems = [
  { name: 'Home', href: '/', icon: Home },
  { name: 'Discover', href: '/discover', icon: Disc },
  { name: 'Search', href: '/search', icon: Search },
  { name: 'Taste', href: '/profile', icon: User },
];

export default function MobileNavbar() {
  const pathname = usePathname();

  return (
    <nav className="md:hidden fixed bottom-24 left-0 right-0 h-16 bg-void-eclipse/90 backdrop-blur-md border-t border-steel-accent/20 flex items-center justify-around px-4 z-40 text-silver-mist shadow-lg">
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = pathname === item.href;
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`flex flex-col items-center justify-center gap-1 w-16 h-full transition-colors ${
              isActive ? 'text-white' : 'text-slate-hint hover:text-white'
            }`}
          >
            <Icon size={20} className={isActive ? 'text-white' : 'text-slate-hint'} />
            <span className="font-interface text-[10px] font-medium">{item.name}</span>
          </Link>
        );
      })}
    </nav>
  );
}
