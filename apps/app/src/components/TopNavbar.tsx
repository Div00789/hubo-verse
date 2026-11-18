import React from 'react';
import { Search, Bell, Sparkles, ShieldCheck } from 'lucide-react';

interface TopNavbarProps {
  title: string;
  subtitle?: string;
}

export const TopNavbar: React.FC<TopNavbarProps> = ({ title, subtitle }) => {
  const tokenUsed = 342150;
  const tokenLimit = 2000000;
  const percentUsed = Math.round((tokenUsed / tokenLimit) * 100);

  return (
    <header className="h-16 bg-[#0B101D] border-b border-[#1E293B] px-6 flex items-center justify-between shrink-0 select-none">
      <div>
        <h1 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
          {title}
        </h1>
        {subtitle && <p className="text-xs text-gray-400">{subtitle}</p>}
      </div>

      <div className="flex items-center gap-4">
        {/* Global Search */}
        <div className="relative w-64 hidden md:block">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search schemas, courses, tools..."
            className="w-full bg-[#131B2E] border border-[#1E293B] rounded-lg pl-9 pr-3 py-1.5 text-xs text-white placeholder-gray-400 focus:outline-none focus:border-[#FF5C00]"
          />
        </div>

        {/* AI Token Allowance Meter */}
        <div className="hidden lg:flex items-center gap-2 bg-[#131B2E] border border-[#1E293B] px-3 py-1.5 rounded-lg">
          <Sparkles className="w-3.5 h-3.5 text-[#FF5C00]" />
          <div className="text-right">
            <div className="text-[10px] text-gray-400">Anna Token Quota</div>
            <div className="text-xs font-mono font-medium text-white">
              {(tokenUsed / 1000).toFixed(0)}k / {(tokenLimit / 1000).toFixed(0)}k ({percentUsed}%)
            </div>
          </div>
          <div className="w-12 h-1.5 bg-[#1E293B] rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-orange-500 to-[#FF5C00]"
              style={{ width: `${percentUsed}%` }}
            />
          </div>
        </div>

        {/* User Role Badge */}
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#131B2E] border border-[#1E293B] text-[11px] font-medium text-emerald-400">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Org Admin</span>
        </div>

        {/* Notifications */}
        <button className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-[#131B2E] relative">
          <Bell className="w-4 h-4" />
          <span className="w-2 h-2 rounded-full bg-[#FF5C00] absolute top-1.5 right-1.5" />
        </button>

        {/* User Profile Avatar */}
        <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#FF5C00] to-amber-500 flex items-center justify-center font-bold text-xs text-white border border-[#1E293B]">
          ST
        </div>
      </div>
    </header>
  );
};
