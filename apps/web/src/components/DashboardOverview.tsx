import React from 'react';
import {
  Bot,
  Hammer,
  Radio,
  BookOpen,
  FolderKanban,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  TrendingUp,
  Clock,
  Calendar,
  Layers,
  ExternalLink,
} from 'lucide-react';
import { DEMO_HUBSPOT_CONNECTION, DEMO_LIVE_CLASSES, DEMO_PROJECTS } from '@huboverse/database';

interface DashboardOverviewProps {
  onNavigate: (tab: 'anna' | 'portals' | 'academy' | 'projects' | 'settings', mode?: 'CHAT' | 'BUILD') => void;
  portalId?: string;
  portalName?: string;
  isPortalConnected?: boolean;
}

export const DashboardOverview: React.FC<DashboardOverviewProps> = ({
  onNavigate,
  portalId,
  portalName,
  isPortalConnected = false,
}) => {
  const nextClass = DEMO_LIVE_CLASSES[0];
  const activeProject = DEMO_PROJECTS[0];

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-8 overflow-y-auto">
      {/* Welcome Banner */}
      <div className="relative rounded-2xl bg-gradient-to-r from-[#131B2E] via-[#0F172A] to-[#1E293B] border border-[#1E293B] p-7 shadow-2xl overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-[#FF5C00]/15 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FF5C00]/15 border border-[#FF5C00]/30 text-[#FF5C00] text-xs font-semibold">
              <span className="w-2 h-2 rounded-full bg-[#FF5C00] animate-pulse" />
              <span>HuboVerse Enterprise Workspace • Interactive Preview</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Executive Overview Dashboard
            </h1>
            <p className="text-xs sm:text-sm text-gray-300 max-w-xl leading-relaxed">
              {isPortalConnected ? (
                <>
                  Connected to <strong>Portal #{portalId}</strong> ({portalName}). Anna AI is primed to diagnose CRM workflows, analyze pipeline velocity, and safely commit verified schema mutations.
                </>
              ) : (
                <>
                  No HubSpot account currently active. Connect an authorized portal to start diagnosing CRM workflows, inspecting pipelines, and running audits.
                </>
              )}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => onNavigate('portals')}
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-bold shadow-md shadow-emerald-600/20 flex items-center gap-2 transition-all"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Live Portal Audit</span>
            </button>
            <button
              onClick={() => onNavigate('anna', 'CHAT')}
              className="px-4 py-2.5 rounded-xl bg-[#131B2E] hover:bg-[#1E293B] text-white text-xs font-semibold border border-[#1E293B] flex items-center gap-2 transition-colors shadow-md"
            >
              <Bot className="w-4 h-4 text-cyan-400" />
              <span>Ask Anna AI</span>
            </button>
            <button
              onClick={() => onNavigate('anna', 'BUILD')}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#FF5C00] to-[#E04F00] text-white text-xs font-bold shadow-lg shadow-[#FF5C00]/25 hover:opacity-95 flex items-center gap-2 transition-all"
            >
              <Hammer className="w-4 h-4" />
              <span>Anna Build Mode</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Quick KPI Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Portal Status */}
        <div
          onClick={() => onNavigate('portals')}
          className="bg-[#0F172A] border border-[#1E293B] hover:border-emerald-500/40 rounded-2xl p-5 cursor-pointer transition-all shadow-lg group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-400 font-medium">HubSpot CRM Sync</span>
            <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="text-lg font-bold text-white mt-2">
            {isPortalConnected ? 'Active & Verified' : 'No Account'}
          </div>
          <div className="text-[11px] text-gray-400 mt-1 flex items-center justify-between">
            <span className="font-mono text-gray-300">
              {isPortalConnected ? `Portal #${portalId}` : 'Connect Portal'}
            </span>
            <span className="text-emerald-400 group-hover:underline">Inspect &rarr;</span>
          </div>
        </div>

        {/* AI Tokens */}
        <div
          onClick={() => onNavigate('anna', 'CHAT')}
          className="bg-[#0F172A] border border-[#1E293B] hover:border-orange-500/40 rounded-2xl p-5 cursor-pointer transition-all shadow-lg group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-400 font-medium">Anna Token Allowance</span>
            <div className="p-2 rounded-lg bg-orange-500/10 text-[#FF5C00]">
              <Sparkles className="w-4 h-4" />
            </div>
          </div>
          <div className="text-lg font-bold text-white mt-2 font-mono">342k / 2.0M Used</div>
          <div className="w-full bg-[#1E293B] h-1.5 rounded-full mt-2 overflow-hidden">
            <div className="bg-[#FF5C00] h-full" style={{ width: '17%' }} />
          </div>
          <div className="text-[11px] text-gray-400 mt-1.5 flex items-center justify-between">
            <span>83% Quota Free</span>
            <span className="text-[#FF5C00] group-hover:underline">Chat &rarr;</span>
          </div>
        </div>

        {/* Learning Academy */}
        <div
          onClick={() => onNavigate('academy')}
          className="bg-[#0F172A] border border-[#1E293B] hover:border-purple-500/40 rounded-2xl p-5 cursor-pointer transition-all shadow-lg group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-400 font-medium">Learning Academy</span>
            <div className="p-2 rounded-lg bg-purple-500/10 text-purple-400">
              <BookOpen className="w-4 h-4" />
            </div>
          </div>
          <div className="text-lg font-bold text-white mt-2">3 Masterclasses</div>
          <div className="text-[11px] text-gray-400 mt-1 flex items-center justify-between">
            <span>Live workshop in 2d</span>
            <span className="text-purple-400 group-hover:underline">Browse &rarr;</span>
          </div>
        </div>

        {/* Projects */}
        <div
          onClick={() => onNavigate('projects')}
          className="bg-[#0F172A] border border-[#1E293B] hover:border-blue-500/40 rounded-2xl p-5 cursor-pointer transition-all shadow-lg group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-400 font-medium">Active Roadmaps</span>
            <div className="p-2 rounded-lg bg-blue-500/10 text-blue-400">
              <FolderKanban className="w-4 h-4" />
            </div>
          </div>
          <div className="text-lg font-bold text-white mt-2">CRM Overhaul</div>
          <div className="text-[11px] text-gray-400 mt-1 flex items-center justify-between">
            <span>2 Milestones active</span>
            <span className="text-blue-400 group-hover:underline">Roadmap &rarr;</span>
          </div>
        </div>
      </div>

      {/* Two Column Section: Quick Launch Hub & Upcoming Schedule */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Quick Launch Cards (2 cols) */}
        <div className="lg:col-span-2 space-y-4">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <Layers className="w-4 h-4 text-[#FF5C00]" />
            <span>Workspace Operations</span>
          </h2>

          <div className="grid sm:grid-cols-2 gap-4">
            {/* Anna Chat Card */}
            <div
              onClick={() => onNavigate('anna', 'CHAT')}
              className="bg-[#0F172A] border border-[#1E293B] hover:border-cyan-500/40 rounded-2xl p-5 cursor-pointer transition-all group shadow-md"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
                  <Bot className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-sm font-bold text-white group-hover:text-cyan-300 transition-colors">
                    Anna Chat Mode
                  </div>
                  <div className="text-xs text-gray-400">HubSpot Q&amp;A &amp; Diagnostics</div>
                </div>
              </div>
              <p className="text-xs text-gray-400 mt-3 leading-relaxed">
                Troubleshoot workflow enrollment errors, configure lead scoring rules, or receive step-by-step guidance.
              </p>
              <div className="mt-4 flex items-center text-xs text-cyan-400 font-semibold gap-1">
                <span>Start conversation</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>

            {/* Anna Build Card */}
            <div
              onClick={() => onNavigate('anna', 'BUILD')}
              className="bg-[#0F172A] border border-[#1E293B] hover:border-orange-500/40 rounded-2xl p-5 cursor-pointer transition-all group shadow-md"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-[#FF5C00]">
                  <Hammer className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-sm font-bold text-white group-hover:text-[#FF5C00] transition-colors">
                    Anna Build Mode
                  </div>
                  <div className="text-xs text-gray-400">One-Click CRM Automation</div>
                </div>
              </div>
              <p className="text-xs text-gray-400 mt-3 leading-relaxed">
                Generate custom properties and deal pipelines with safe dry-run JSON schema diffs and rollback protection.
              </p>
              <div className="mt-4 flex items-center text-xs text-[#FF5C00] font-semibold gap-1">
                <span>Open Build Console</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>

            {/* Connected Portals */}
            <div
              onClick={() => onNavigate('portals')}
              className="bg-[#0F172A] border border-[#1E293B] hover:border-emerald-500/40 rounded-2xl p-5 cursor-pointer transition-all group shadow-md"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                  <Radio className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-sm font-bold text-white group-hover:text-emerald-300 transition-colors">
                    Connected Portals
                  </div>
                  <div className="text-xs text-gray-400">OAuth Credentials &amp; Scopes</div>
                </div>
              </div>
              <p className="text-xs text-gray-400 mt-3 leading-relaxed">
                Manage connected HubSpot portals, verify token refresh status, and inspect licensed Hub capabilities.
              </p>
              <div className="mt-4 flex items-center text-xs text-emerald-400 font-semibold gap-1">
                <span>Manage Portals</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>

            {/* Learning Academy */}
            <div
              onClick={() => onNavigate('academy')}
              className="bg-[#0F172A] border border-[#1E293B] hover:border-purple-500/40 rounded-2xl p-5 cursor-pointer transition-all group shadow-md"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
                  <BookOpen className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-sm font-bold text-white group-hover:text-purple-300 transition-colors">
                    Learning Academy
                  </div>
                  <div className="text-xs text-gray-400">Masterclasses &amp; Live Workshops</div>
                </div>
              </div>
              <p className="text-xs text-gray-400 mt-3 leading-relaxed">
                Stream recorded video masterclasses with Mux and participate in LiveKit live coaching studios.
              </p>
              <div className="mt-4 flex items-center text-xs text-purple-400 font-semibold gap-1">
                <span>Explore Courses</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </div>
        </div>

        {/* Right Sidebar: Upcoming Event & Active Roadmap */}
        <div className="space-y-4">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <Calendar className="w-4 h-4 text-[#FF5C00]" />
            <span>Next Live Training</span>
          </h2>

          {/* LiveKit Upcoming Class Card */}
          <div className="bg-[#0F172A] border border-[#1E293B] rounded-2xl p-5 shadow-lg flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between text-xs mb-2">
                <span className="px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-400 font-mono text-[10px] font-semibold flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-ping" /> LiveKit Studio
                </span>
                <span className="text-[11px] text-gray-400">{nextClass.durationMinutes} mins</span>
              </div>
              <h3 className="text-sm font-bold text-white mt-1 leading-snug">{nextClass.title}</h3>
              <p className="text-xs text-gray-400 mt-2 line-clamp-2">{nextClass.description}</p>
              <div className="mt-3 text-xs text-gray-300 font-medium">
                Instructor: <span className="text-white">{nextClass.instructorName}</span>
              </div>
            </div>

            <div className="mt-5 pt-4 border-t border-[#1E293B] flex items-center justify-between">
              <span className="text-[11px] text-gray-400 font-mono">In 2 days</span>
              <button
                onClick={() => onNavigate('academy')}
                className="px-3 py-1.5 rounded-lg bg-[#FF5C00] hover:bg-[#FF7A00] text-white text-xs font-semibold flex items-center gap-1 transition-colors"
              >
                <span>View Session</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          </div>

          {/* Active Implementation Roadmap */}
          <div className="bg-[#0F172A] border border-[#1E293B] rounded-2xl p-5 shadow-lg">
            <div className="text-xs text-gray-400 uppercase tracking-wider text-[10px] font-semibold">
              Current Roadmap
            </div>
            <div className="text-sm font-bold text-white mt-1">{activeProject.title}</div>
            <div className="mt-3 space-y-2 text-xs">
              <div className="flex items-center justify-between p-2 rounded-lg bg-[#131B2E] border border-[#1E293B]">
                <span className="text-gray-300">HubSpot Architecture Audit</span>
                <span className="text-[10px] font-mono text-emerald-400 font-semibold">DONE</span>
              </div>
              <div className="flex items-center justify-between p-2 rounded-lg bg-[#131B2E] border border-[#1E293B]">
                <span className="text-gray-300">Custom Object Association</span>
                <span className="text-[10px] font-mono text-amber-400 font-semibold">IN PROGRESS</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
