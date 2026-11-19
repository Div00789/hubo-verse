'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ArrowRight, Menu, X, Sparkles } from 'lucide-react';
import { BrandLogo } from './BrandLogo';

export const SiteHeader: React.FC = () => {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { label: 'Platform', href: '/features' },
    { label: 'Anna AI', href: '/anna' },
    { label: 'Academy & LiveKit', href: '/academy' },
    { label: 'Pricing', href: '/pricing' },
    { label: 'About', href: '/about' },
    { label: 'Contact', href: '/contact' },
  ];

  return (
    <header className="border-b border-[#1E293B]/80 bg-[#06090F]/90 backdrop-blur-xl sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        {/* Brand Logo - Clicking always routes home cleanly */}
        <div className="flex items-center gap-3">
          <BrandLogo size="md" variant="dark" href="/" />
          <span className="hidden sm:inline-block px-2.5 py-0.5 rounded-full text-[10px] font-mono font-medium bg-[#131B2E] text-gray-400 border border-[#1E293B]">
            by HuboExperts
          </span>
        </div>

        {/* Desktop Navigation Links to Dedicated Pages */}
        <nav className="hidden lg:flex items-center gap-7 text-sm font-medium">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`transition-colors py-1 relative ${isActive
                  ? 'text-white font-semibold'
                  : 'text-gray-300 hover:text-[#FF5C00]'
                  }`}
              >
                {link.label}
                {isActive && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#FF5C00] rounded-full" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Action CTAs */}
        <div className="hidden sm:flex items-center gap-3">
          <Link
            href="/login"
            className="px-4 py-2 rounded-xl text-xs font-semibold text-gray-300 hover:text-white hover:bg-[#131B2E] transition-colors"
          >
            Sign In
          </Link>
          <Link
            href="/app"
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#FF5C00] to-[#E04F00] text-white text-xs font-bold hover:opacity-95 shadow-lg shadow-[#FF5C00]/25 transition-all flex items-center gap-1.5"
          >
            <span>Launch App</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Mobile Hamburger */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="lg:hidden p-2 rounded-lg text-gray-400 hover:text-white hover:bg-[#131B2E]"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden px-6 py-4 bg-[#0B0F19] border-b border-[#1E293B] space-y-3">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 text-sm text-gray-300 hover:text-[#FF5C00]"
            >
              {link.label}
            </Link>
          ))}
          <div className="pt-3 border-t border-[#1E293B] flex gap-3">
            <Link
              href="/login"
              onClick={() => setMobileMenuOpen(false)}
              className="flex-1 text-center py-2 rounded-lg bg-[#131B2E] text-xs font-semibold text-white"
            >
              Sign In
            </Link>
            <Link
              href="/app"
              className="flex-1 text-center py-2 rounded-lg bg-[#FF5C00] text-xs font-bold text-white shadow-md shadow-[#FF5C00]/25"
            >
              Launch App
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};
