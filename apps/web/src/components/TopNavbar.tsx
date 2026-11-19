import React from 'react';
import Link from 'next/link';
import { Search, Bell, Sparkles, ShieldCheck, Home, ExternalLink, LogIn } from 'lucide-react';

interface TopNavbarProps {
  title: string;
  subtitle?: string;
  onGoHome?: () => void;
  isHome?: boolean;
}

export const TopNavbar: React.FC<TopNavbarProps> = ({ title, subtitle, onGoHome, isHome }) => {
  const tokenUsed = 342150;
  const tokenLimit = 2000000;
  const percentUsed = Math.round((tokenUsed / tokenLimit) * 100);

  return (
    <header className="h-16 bg-[#0B101D] border-b border-[#1E293B] px-6 flex items-center justify-between shrink-0 select-none">
      <div className="flex items-center gap-3">
        {!isHome && onGoHome && (
          <button
            onClick={onGoHome}
            className="p-1.5 rounded-lg bg-[#131B2E] border border-[#1E293B] text-gray-400 hover:text-white hover:border-[#FF5C00]/40 transition-colors flex items-center gap-1.5 text-xs"
            title="Back to Home Dashboard"
          >
            <Home className="w-3.5 h-3.5 text-[#FF5C00]" />
            <span className="hidden sm:inline">Home</span>
          </button>
        )}

        <div>
          <h1 className="text-base sm:text-lg font-bold text-white tracking-tight flex items-center gap-2">
            {!isHome && <span className="text-gray-400 font-normal hidden sm:inline">/</span>}
            <span>{title}</span>
          </h1>
          {subtitle && <p className="text-[11px] text-gray-400 truncate max-w-md">{subtitle}</p>}
        </div>
      </div>

      <div className="flex items-center gap-3 sm:gap-4">
        {/* Link to Public Website */}
        <Link
          href="/"
          className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#131B2E] border border-[#1E293B] text-xs text-gray-300 hover:text-white hover:border-[#FF5C00]/40 transition-colors"
          title="Open Public Website"
        >
          <span>Public Website</span>
          <ExternalLink className="w-3 h-3 text-[#FF5C00]" />
        </Link>

        {/* Global Search */}
        <div className="relative w-48 lg:w-56 hidden md:block">
          <Search className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search CRM, tools, courses..."
            className="w-full bg-[#131B2E] border border-[#1E293B] rounded-xl pl-9 pr-3 py-1.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#FF5C00]"
          />
        </div>

        {/* AI Token Allowance Meter */}
        <div className="hidden lg:flex items-center gap-2 bg-[#131B2E] border border-[#1E293B] px-3 py-1.5 rounded-xl">
          <Sparkles className="w-3.5 h-3.5 text-[#FF5C00]" />
          <div className="text-right">
            <div className="text-[10px] text-gray-400">Anna Tokens</div>
            <div className="text-xs font-mono font-medium text-white">
              {(tokenUsed / 1000).toFixed(0)}k / {(tokenLimit / 1000).toFixed(0)}k ({percentUsed}%)
            </div>
          </div>
          <div className="w-10 h-1.5 bg-[#1E293B] rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-orange-500 to-[#FF5C00]"
              style={{ width: `${percentUsed}%` }}
            />
          </div>
        </div>

        {/* Auth / Explore State (No assumed personal name) */}
        <div className="flex items-center gap-2">
          <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#131B2E] border border-[#1E293B] text-[11px] font-medium text-amber-400">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
            <span>Interactive Demo</span>
          </div>

          <Link
            href="/login"
            className="px-3 py-1.5 rounded-xl bg-[#1E293B] hover:bg-[#283548] border border-[#1E293B] text-xs font-semibold text-white flex items-center gap-1.5 transition-colors"
            title="Sign in with your corporate account"
          >
            <LogIn className="w-3.5 h-3.5 text-[#FF5C00]" />
            <span>Sign In</span>
          </Link>
        </div>
      </div>
    </header>
  );
};
