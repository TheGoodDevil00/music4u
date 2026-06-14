'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Disc, Search, User } from 'lucide-react';
import { useUserStore } from '../../_store/userStore';
import Image from 'next/image';

const navItems = [
  { name: 'Home', href: '/', icon: Home },
  { name: 'Discover', href: '/discover', icon: Disc },
  { name: 'Search', href: '/search', icon: Search },
  { name: 'Taste', href: '/profile', icon: User },
];

export default function MobileNavbar() {
  const pathname = usePathname();
  const { spotifyUser } = useUserStore();

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-void-eclipse/90 backdrop-blur-md border-t border-steel-accent/20 flex items-center justify-around px-4 z-40 text-silver-mist shadow-lg">
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = pathname === item.href;
        const isProfile = item.href === '/profile';

        return (
          <Link
            key={item.href}
            href={item.href}
            className={`flex flex-col items-center justify-center gap-1 w-16 h-full transition-colors ${
              isActive ? 'text-white' : 'text-slate-hint hover:text-white'
            }`}
          >
            {isProfile && spotifyUser ? (
              <div className="relative w-5 h-5 rounded-full overflow-hidden border border-white/20 flex-shrink-0">
                <Image
                  src={spotifyUser.avatarUrl}
                  alt={spotifyUser.name}
                  fill
                  sizes="20px"
                  className="object-cover"
                />
                <span className="absolute bottom-0 right-0 w-1.5 h-1.5 bg-[#1DB954] rounded-full border border-void-eclipse" />
              </div>
            ) : (
              <Icon size={20} className={isActive ? 'text-white' : 'text-slate-hint'} />
            )}
            <span className="font-interface text-[10px] font-medium">{item.name}</span>
          </Link>
        );
      })}
    </nav>
  );
}
