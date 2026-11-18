import React from 'react';
import {
  Bot,
  Hammer,
  Radio,
  BookOpen,
  FolderKanban,
  Settings,
  Building2,
  CheckCircle2,
  ChevronDown,
} from 'lucide-react';
import { BrandLogo } from './BrandLogo';

export type ActiveTab = 'anna' | 'portals' | 'academy' | 'projects' | 'settings';

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
      {/* Header & Logo */}
      <div className="p-4 border-b border-[#1E293B]">
        <BrandLogo size="md" />

        {/* Tenant Organization Switcher */}
        <div className="mt-4 p-2.5 rounded-lg bg-[#131B2E] border border-[#1E293B] flex items-center justify-between cursor-pointer hover:border-[#FF5C00]/40 transition-colors">
          <div className="flex items-center gap-2 overflow-hidden">
            <Building2 className="w-4 h-4 text-[#FF5C00] shrink-0" />
            <div className="truncate">
              <div className="text-xs font-semibold text-white truncate">Acme Global</div>
              <div className="text-[10px] text-gray-400">Enterprise Plan</div>
            </div>
          </div>
          <ChevronDown className="w-3.5 h-3.5 text-gray-400 shrink-0" />
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-3 py-4 space-y-1.5 overflow-y-auto">
        {/* Anna AI Section */}
        <div className="pt-1 pb-2">
          <div className="px-3 text-[10px] font-semibold tracking-wider text-gray-400 uppercase">
            AI Operations
          </div>
          <button
            onClick={() => {
              setActiveTab('anna');
              setAnnaMode('CHAT');
            }}
            className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium transition-all mt-1 ${
              activeTab === 'anna' && annaMode === 'CHAT'
                ? 'bg-[#FF5C00] text-white shadow-lg shadow-[#FF5C00]/20'
                : 'text-gray-300 hover:bg-[#131B2E] hover:text-white'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <Bot className="w-4 h-4" />
              <span>Anna Chat Mode</span>
            </div>
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-black/25 font-mono">Advisory</span>
          </button>

          <button
            onClick={() => {
              setActiveTab('anna');
              setAnnaMode('BUILD');
            }}
            className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium transition-all mt-1 ${
              activeTab === 'anna' && annaMode === 'BUILD'
                ? 'bg-gradient-to-r from-[#FF5C00] to-[#E04F00] text-white shadow-lg shadow-[#FF5C00]/25'
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

        {/* Modules Section */}
        <div className="pt-2">
          <div className="px-3 text-[10px] font-semibold tracking-wider text-gray-400 uppercase">
            HubSpot Workspace
          </div>

          <button
            onClick={() => setActiveTab('portals')}
            className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium transition-all mt-1 ${
              activeTab === 'portals'
                ? 'bg-[#1E293B] text-white border-l-2 border-[#FF5C00]'
                : 'text-gray-300 hover:bg-[#131B2E] hover:text-white'
            }`}
          >
            <Radio className="w-4 h-4 text-cyan-400" />
            <span>Connected Portals</span>
          </button>

          <button
            onClick={() => setActiveTab('academy')}
            className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium transition-all mt-1 ${
              activeTab === 'academy'
                ? 'bg-[#1E293B] text-white border-l-2 border-[#FF5C00]'
                : 'text-gray-300 hover:bg-[#131B2E] hover:text-white'
            }`}
          >
            <BookOpen className="w-4 h-4 text-emerald-400" />
            <span>Learning Academy</span>
          </button>

          <button
            onClick={() => setActiveTab('projects')}
            className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium transition-all mt-1 ${
              activeTab === 'projects'
                ? 'bg-[#1E293B] text-white border-l-2 border-[#FF5C00]'
                : 'text-gray-300 hover:bg-[#131B2E] hover:text-white'
            }`}
          >
            <FolderKanban className="w-4 h-4 text-purple-400" />
            <span>Projects & Audits</span>
          </button>
        </div>

        {/* Administration */}
        <div className="pt-2">
          <div className="px-3 text-[10px] font-semibold tracking-wider text-gray-400 uppercase">
            Organization
          </div>
          <button
            onClick={() => setActiveTab('settings')}
            className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium transition-all mt-1 ${
              activeTab === 'settings'
                ? 'bg-[#1E293B] text-white border-l-2 border-[#FF5C00]'
                : 'text-gray-300 hover:bg-[#131B2E] hover:text-white'
            }`}
          >
            <Settings className="w-4 h-4 text-slate-400" />
            <span>Settings & Billing</span>
          </button>
        </div>
      </nav>

      {/* Connected Portal Footer Indicator */}
      <div className="p-3 border-t border-[#1E293B] bg-[#090D16]">
        <div className="text-[11px] text-gray-400 mb-1 flex items-center justify-between">
          <span>Active CRM Sync</span>
          <span className="flex items-center gap-1 text-emerald-400 font-mono text-[10px]">
            <CheckCircle2 className="w-3 h-3" /> Live
          </span>
        </div>
        <div className="text-xs text-white font-medium truncate">{portalName}</div>
        <div className="text-[10px] text-gray-400 font-mono mt-0.5">Portal #44891204</div>
      </div>
    </aside>
  );
};
