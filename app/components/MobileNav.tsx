'use client';

import { useState } from 'react';
import { Menu, X, Network, BookOpen, Users, ArrowLeft, Sparkles, User, Zap, BarChart3, Clock } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import AuthButton from './AuthButton';

interface NavItem {
  href: string;
  label: string;
  icon: React.ReactNode;
}

const navItems: NavItem[] = [
  { href: '/', label: 'Home', icon: <Network className="w-5 h-5" /> },
  { href: '/explore', label: 'Explore', icon: <BookOpen className="w-5 h-5" /> },
  { href: '/six-degrees', label: '6 Degrees', icon: <Zap className="w-5 h-5" /> },
  { href: '/insights', label: 'Insights', icon: <BarChart3 className="w-5 h-5" /> },
  { href: '/timeline', label: 'Timeline', icon: <Clock className="w-5 h-5" /> },
  { href: '/community', label: 'Community', icon: <Users className="w-5 h-5" /> },
  { href: '/recommendations', label: 'For You', icon: <Sparkles className="w-5 h-5" /> },
  { href: '/profile', label: 'Profile', icon: <User className="w-5 h-5" /> },
];

interface MobileNavProps {
  currentPage?: string;
  showBackButton?: boolean;
  backHref?: string;
  backLabel?: string;
}

export default function MobileNav({ 
  currentPage,
  showBackButton = false,
  backHref = '/',
  backLabel = 'Back'
}: MobileNavProps) {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  const toggleMenu = () => setIsOpen(!isOpen);
  const closeMenu = () => setIsOpen(false);

  return (
    <>
      {/* Mobile Header Bar */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-zinc-900/95 backdrop-blur-md border-b border-zinc-800/50 lg:hidden">
        <div className="flex items-center justify-between px-4 h-14">
          {/* Left: Back button or Logo */}
          <div className="flex items-center">
            {showBackButton ? (
              <Link 
                href={backHref}
                className="flex items-center gap-2 text-zinc-400 hover:text-amber-400 transition min-h-[44px] min-w-[44px] -ml-2 px-2 rounded-lg"
              >
                <ArrowLeft className="w-5 h-5" />
                <span className="text-sm">{backLabel}</span>
              </Link>
            ) : (
              <Link href="/" className="flex items-center gap-2 min-h-[44px] -ml-2 px-2 rounded-lg">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center">
                  <Network className="w-5 h-5 text-zinc-900" />
                </div>
                <span className="font-bold bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-transparent">
                  Lineage
                </span>
              </Link>
            )}
          </div>

          {/* Right: Menu Button */}
          <button
            onClick={toggleMenu}
            className="flex items-center justify-center w-11 h-11 rounded-lg bg-zinc-800/50 hover:bg-zinc-800 transition"
            aria-label={isOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={isOpen}
          >
            {isOpen ? (
              <X className="w-6 h-6 text-zinc-300" />
            ) : (
              <Menu className="w-6 h-6 text-zinc-300" />
            )}
          </button>
        </div>

        {/* Current Page Title (optional) */}
        {currentPage && (
          <div className="px-4 pb-2 -mt-1">
            <h1 className="text-lg font-semibold text-zinc-100">{currentPage}</h1>
          </div>
        )}
      </div>

      {/* Mobile Menu Overlay */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
            onClick={closeMenu}
          />
          
          {/* Menu Panel */}
          <div className="fixed top-14 left-0 right-0 bottom-0 bg-zinc-900 z-40 lg:hidden overflow-y-auto">
            <nav className="p-4">
              <ul className="space-y-1">
                {navItems.map((item) => {
                  const isActive = pathname === item.href;
                  return (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        onClick={closeMenu}
                        className={`flex items-center gap-3 px-4 py-4 rounded-xl transition min-h-[56px] ${
                          isActive
                            ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                            : 'text-zinc-400 hover:bg-zinc-800/50 hover:text-zinc-200'
                        }`}
                      >
                        <span className={isActive ? 'text-amber-400' : 'text-zinc-500'}>
                          {item.icon}
                        </span>
                        <span className="font-medium">{item.label}</span>
                        {isActive && (
                          <span className="ml-auto w-2 h-2 rounded-full bg-amber-400" />
                        )}
                      </Link>
                    </li>
                  );
                })}
              </ul>

              {/* Mobile-specific info */}
              <div className="mt-8 pt-6 border-t border-zinc-800">
                <p className="text-xs text-zinc-500 text-center">
                  Lineage Lit — Discover the lineage of ideas
                </p>
              </div>
            </nav>
          </div>
        </>
      )}

      {/* Bottom Navigation Bar (Mobile) */}
      <nav className="fixed bottom-0 left-0 right-0 bg-zinc-900/95 backdrop-blur-md border-t border-zinc-800/50 z-40 lg:hidden pb-safe">
        <div className="flex items-center justify-around h-16">
          {navItems.slice(0, 5).map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex flex-col items-center justify-center gap-1 flex-1 h-full min-h-[64px] transition ${
                  isActive
                    ? 'text-amber-400'
                    : 'text-zinc-500 hover:text-zinc-300'
                }`}
              >
                <span className={isActive ? 'text-amber-400' : ''}>{item.icon}</span>
                <span className="text-[10px] font-medium">{item.label}</span>
                {isActive && (
                  <span className="absolute bottom-1 w-1 h-1 rounded-full bg-amber-400" />
                )}
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
}

// Desktop Navigation (for use in layouts)
export function DesktopNav() {
  const pathname = usePathname();

  return (
    <nav className="hidden lg:flex items-center gap-1">
      {navItems.map((item) => {
        const isActive = pathname === item.href;
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition min-h-[44px] ${
              isActive
                ? 'bg-amber-500/10 text-amber-400'
                : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50'
            }`}
          >
            {item.icon}
            <span>{item.label}</span>
          </Link>
        );
      })}
      <AuthButton />
    </nav>
  );
}

// Spacer components for layout
export function MobileHeaderSpacer() {
  return <div className="h-14 lg:hidden" />;
}

export function MobileBottomSpacer() {
  return <div className="h-20 lg:hidden" />;
}
