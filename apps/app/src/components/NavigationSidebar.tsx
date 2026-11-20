import React from 'react';
import {
  LayoutDashboard,
  Bot,
  Hammer,
  Radio,
  BookOpen,
  FolderKanban,
  Settings,
  Building2,
  CheckCircle2,
  ChevronDown,
  ExternalLink,
  ShieldAlert,
} from 'lucide-react';
import { BrandLogo } from './BrandLogo';

export type ActiveTab = 'home' | 'anna' | 'portals' | 'academy' | 'projects' | 'settings';

interface NavigationSidebarProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  annaMode: 'CHAT' | 'BUILD';
  setAnnaMode: (mode: 'CHAT' | 'BUILD') => void;
  portalName: string;
  isPortalConnected: boolean;
}

export const NavigationSidebar: React.FC<NavigationSidebarProps> = ({
  activeTab,
  setActiveTab,
  annaMode,
  setAnnaMode,
  portalName,
  isPortalConnected,
}) => {
  return (
    <aside className="w-64 bg-[#0B101D] border-r border-[#1E293B] flex flex-col justify-between shrink-0 h-screen select-none">
      {/* Header & Logo with Click-to-Home */}
      <div className="p-4 border-b border-[#1E293B]">
        <button
          onClick={() => setActiveTab('home')}
          className="w-full flex items-center text-left hover:opacity-90 transition-opacity"
          title="Return to Home Dashboard"
        >
          <BrandLogo size="md" />
        </button>

        {/* Workspace Mode / Tenant State */}
        <div className="mt-4 p-2.5 rounded-lg bg-[#131B2E] border border-[#1E293B] flex items-center justify-between cursor-pointer hover:border-[#FF5C00]/40 transition-colors">
          <div className="flex items-center gap-2 overflow-hidden">
            <Building2 className="w-4 h-4 text-[#FF5C00] shrink-0" />
            <div className="truncate">
              <div className="text-xs font-semibold text-white truncate">Demo Workspace</div>
              <div className="text-[10px] text-amber-400 font-medium">Guest Mode • Not Logged In</div>
            </div>
          </div>
          <ChevronDown className="w-3.5 h-3.5 text-gray-400 shrink-0" />
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-3 py-4 space-y-1.5 overflow-y-auto">
        {/* Home Screen Link */}
        <button
          onClick={() => setActiveTab('home')}
          className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all ${activeTab === 'home'
              ? 'bg-[#FF5C00] text-white shadow-lg shadow-[#FF5C00]/25'
              : 'text-gray-300 hover:bg-[#131B2E] hover:text-white'
            }`}
        >
          <LayoutDashboard className="w-4 h-4" />
          <span>Home Dashboard</span>
        </button>

        {/* Anna AI Section */}
        <div className="pt-3 pb-1">
          <div className="px-3 text-[10px] font-semibold tracking-wider text-gray-400 uppercase">
            Anna Central Intelligence
          </div>

          <button
            onClick={() => {
              setActiveTab('anna');
              setAnnaMode('CHAT');
            }}
            className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium transition-all mt-1 ${activeTab === 'anna' && annaMode === 'CHAT'
                ? 'bg-[#1E293B] text-white border-l-2 border-cyan-400 font-semibold'
                : 'text-gray-300 hover:bg-[#131B2E] hover:text-white'
              }`}
          >
            <div className="flex items-center gap-2.5">
              <Bot className="w-4 h-4 text-cyan-400" />
              <span>Anna Chat Mode</span>
            </div>
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-cyan-500/20 text-cyan-300 font-mono">
              Q&A
            </span>
          </button>

          <button
            onClick={() => {
              setActiveTab('anna');
              setAnnaMode('BUILD');
            }}
            className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium transition-all mt-1 ${activeTab === 'anna' && annaMode === 'BUILD'
                ? 'bg-[#1E293B] text-white border-l-2 border-[#FF5C00] font-semibold'
                : 'text-gray-300 hover:bg-[#131B2E] hover:text-white'
              }`}
          >
            <div className="flex items-center gap-2.5">
              <Hammer className="w-4 h-4 text-orange-400" />
              <span>Anna Build Mode</span>
            </div>
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-orange-500/20 text-orange-300 font-mono font-bold">
              Exec
            </span>
          </button>
        </div>

        {/* Workspace Operations */}
        <div className="pt-3">
          <div className="px-3 text-[10px] font-semibold tracking-wider text-gray-400 uppercase">
            HubSpot Workspace
          </div>

          <button
            onClick={() => setActiveTab('portals')}
            className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium transition-all mt-1 ${activeTab === 'portals'
                ? 'bg-[#1E293B] text-white border-l-2 border-emerald-400 font-semibold'
                : 'text-gray-300 hover:bg-[#131B2E] hover:text-white'
              }`}
          >
            <Radio className="w-4 h-4 text-emerald-400" />
            <span>Connected Portals</span>
          </button>

          <button
            onClick={() => setActiveTab('academy')}
            className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium transition-all mt-1 ${activeTab === 'academy'
                ? 'bg-[#1E293B] text-white border-l-2 border-purple-400 font-semibold'
                : 'text-gray-300 hover:bg-[#131B2E] hover:text-white'
              }`}
          >
            <BookOpen className="w-4 h-4 text-purple-400" />
            <span>Learning Academy</span>
          </button>

          <button
            onClick={() => setActiveTab('projects')}
            className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium transition-all mt-1 ${activeTab === 'projects'
                ? 'bg-[#1E293B] text-white border-l-2 border-blue-400 font-semibold'
                : 'text-gray-300 hover:bg-[#131B2E] hover:text-white'
              }`}
          >
            <FolderKanban className="w-4 h-4 text-blue-400" />
            <span>Projects & Roadmaps</span>
          </button>

          <button
            onClick={() => setActiveTab('settings')}
            className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium transition-all mt-1 ${activeTab === 'settings'
                ? 'bg-[#1E293B] text-white border-l-2 border-slate-400 font-semibold'
                : 'text-gray-300 hover:bg-[#131B2E] hover:text-white'
              }`}
          >
            <Settings className="w-4 h-4 text-slate-400" />
            <span>Settings & Team</span>
          </button>
        </div>
      </nav>

      {/* Cross-App Navigation & Portal Footer */}
      <div className="p-3 border-t border-[#1E293B] bg-[#090D16] space-y-2.5">
        <div className="flex items-center gap-2 text-[11px]">
          <a
            href="http://localhost:3000"
            className="flex-1 p-1.5 rounded-lg bg-[#131B2E] border border-[#1E293B] text-gray-300 hover:text-white flex items-center justify-center gap-1 transition-colors"
            title="Open Public Website"
          >
            <span>Public Site</span>
            <ExternalLink className="w-2.5 h-2.5 text-[#FF5C00]" />
          </a>
          <a
            href="http://localhost:3002"
            className="flex-1 p-1.5 rounded-lg bg-[#131B2E] border border-[#1E293B] text-gray-300 hover:text-white flex items-center justify-center gap-1 transition-colors"
            title="Open Staff Operations Admin"
          >
            <ShieldAlert className="w-3 h-3 text-rose-400" />
            <span>Admin</span>
          </a>
        </div>

        <div className="pt-1 border-t border-[#1E293B]/60">
          <div className="text-[10px] text-gray-400 flex items-center justify-between">
            <span>CRM Sync</span>
            <span className="flex items-center gap-1 text-emerald-400 font-mono text-[10px]">
              <CheckCircle2 className="w-3 h-3" /> Live
            </span>
          </div>
          <div className="text-xs text-white font-medium truncate mt-0.5">{portalName}</div>
          <div className="text-[10px] text-gray-400 font-mono">Portal #46100478</div>
        </div>
      </div>
    </aside>
  );
};
