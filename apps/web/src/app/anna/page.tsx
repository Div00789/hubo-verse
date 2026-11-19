import React from 'react';
import Link from 'next/link';
import {
  Bot,
  Hammer,
  ShieldCheck,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  FileCode,
  RotateCcw,
  BookOpen,
} from 'lucide-react';
import { SiteHeader } from '@/components/SiteHeader';
import { SiteFooter } from '@/components/SiteFooter';

export const metadata = {
  title: 'Anna AI — Dual-Mode Central Intelligence | HuboVerse',
  description: 'Discover Anna AI Chat Mode and Build Mode for HubSpot advisory and safe execution.',
};

export default function AnnaPage() {
  return (
    <div className="min-h-screen bg-[#06090F] text-white flex flex-col justify-between">
      <SiteHeader />

      <main className="flex-1 py-16 px-6 max-w-7xl mx-auto space-y-20">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/20 text-xs text-[#FF5C00] font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Dual-Engine HubSpot AI</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-white">
            Meet Anna: Your Enterprise HubSpot Intelligence Partner
          </h1>
          <p className="text-sm sm:text-base text-gray-400 leading-relaxed">
            Anna is designed exclusively for HubSpot. Operating in two distinct user-selectable modes—<strong>Chat Mode</strong> and <strong>Build Mode</strong>—she combines conversational advisory with safe, atomic CRM execution.
          </p>
        </div>

        {/* Section 1: Chat Mode */}
        <div id="chat" className="grid md:grid-cols-2 gap-10 items-center">
          <div className="space-y-5">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-xs text-cyan-400 font-semibold">
              <Bot className="w-4 h-4" />
              <span>Mode 1: Conversational Intelligence</span>
            </div>
            <h2 className="text-3xl font-extrabold text-white">Anna Chat Mode</h2>
            <p className="text-xs sm:text-sm text-gray-300 leading-relaxed">
              Anna Chat Mode leverages hybrid semantic retrieval via Supabase pgvector over official HubSpot documentation, HuboVerse masterclass transcripts, and your connected portal&apos;s active schema.
            </p>

            <div className="space-y-3 text-xs text-gray-300">
              <div className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                <span><strong>Verifiable Knowledge Citations:</strong> Every recommendation links directly to authoritative HubSpot documentation and academy modules.</span>
              </div>
              <div className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                <span><strong>Context-Aware Diagnostics:</strong> Anna analyzes your portal&apos;s specific Hub tiers and flags if a suggested workflow requires Marketing Pro or Operations Enterprise.</span>
              </div>
              <div className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                <span><strong>Streaming Responses:</strong> Fast, markdown-formatted answers with syntax-highlighted code blocks and follow-up prompt chips.</span>
              </div>
            </div>

            <div className="pt-2">
              <Link
                href="/app"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#131B2E] hover:bg-[#1E293B] text-white text-xs font-semibold border border-[#1E293B] transition-colors"
              >
                <span>Try Chat Mode in Workspace</span>
                <ArrowRight className="w-3.5 h-3.5 text-cyan-400" />
              </Link>
            </div>
          </div>

          {/* Interactive Chat Mockup Card */}
          <div className="bg-[#0B0F19] border border-[#1E293B] rounded-2xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#1E293B] text-xs">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse" />
                <span className="font-semibold text-white">Anna Chat Session</span>
              </div>
              <span className="text-gray-400 font-mono text-[11px]">Portal #44891204</span>
            </div>
            <div className="bg-[#111827] rounded-xl p-3 text-xs text-gray-200">
              <span className="text-gray-400 text-[10px] block font-mono">USER</span>
              Why are our workflows not enrolling newly created contacts?
            </div>
            <div className="bg-[#0E1526] border border-cyan-500/20 rounded-xl p-4 text-xs text-gray-200 space-y-2">
              <span className="text-cyan-400 text-[10px] block font-mono font-bold">ANNA AI</span>
              <p>Based on your <strong>Marketing Pro</strong> portal configuration:</p>
              <ul className="list-disc pl-4 space-y-1 text-gray-300 text-[11px]">
                <li>Re-enrollment trigger for property <em>&apos;Lifecycle Stage&apos;</em> is currently disabled.</li>
                <li>Verify if contacts match the active suppression list criteria.</li>
              </ul>
              <div className="mt-3 pt-2 border-t border-[#1E293B] flex items-center justify-between text-[10px] text-gray-400">
                <span className="flex items-center gap-1 text-cyan-400">
                  <BookOpen className="w-3 h-3" /> Citation: HubSpot Workflow Troubleshooting
                </span>
                <span>210 tokens</span>
              </div>
            </div>
          </div>
        </div>

        {/* Section 2: Build Mode */}
        <div id="build" className="grid md:grid-cols-2 gap-10 items-center pt-8 border-t border-[#1E293B]">
          {/* Build Diff Preview Card */}
          <div className="bg-[#0B0F19] border border-orange-500/30 rounded-2xl p-6 shadow-2xl space-y-4 order-2 md:order-1">
            <div className="flex items-center justify-between pb-3 border-b border-[#1E293B] text-xs">
              <div className="flex items-center gap-2">
                <Hammer className="w-3.5 h-3.5 text-[#FF5C00]" />
                <span className="font-semibold text-white">Anna Build Console</span>
              </div>
              <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-mono text-[10px] font-bold">
                Capability Verified
              </span>
            </div>
            <div className="bg-[#111827] rounded-xl p-3 text-xs text-gray-200">
              <span className="text-gray-400 text-[10px] block font-mono">GOAL</span>
              Create custom property &quot;Lead Readiness Score&quot; on Contacts (0 - 100)
            </div>
            <div className="bg-[#06090F] border border-emerald-500/20 rounded-xl p-4 font-mono text-[11px] text-emerald-300 space-y-1 overflow-x-auto">
              <div className="text-gray-400 font-sans text-[10px] uppercase font-bold mb-1">
                Dry-Run Schema Diff (1 Addition)
              </div>
              <div>+ contacts.properties.lead_readiness_score: &#123;</div>
              <div className="pl-4">label: &quot;Lead Readiness Score&quot;,</div>
              <div className="pl-4">type: &quot;number&quot;, min: 0, max: 100</div>
              <div>&#125;</div>
            </div>
            <div className="pt-2 flex items-center justify-between text-xs">
              <span className="text-gray-400 flex items-center gap-1 text-[11px]">
                <RotateCcw className="w-3 h-3 text-orange-400" /> Automatic Rollback Ready
              </span>
              <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-[#131B2E] text-white">
                Risk: LOW
              </span>
            </div>
          </div>

          <div className="space-y-5 order-1 md:order-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/20 text-xs text-[#FF5C00] font-semibold">
              <Hammer className="w-4 h-4" />
              <span>Mode 2: Safe Autonomous Execution</span>
            </div>
            <h2 className="text-3xl font-extrabold text-white">Anna Build Mode</h2>
            <p className="text-xs sm:text-sm text-gray-300 leading-relaxed">
              When it is time to implement changes in HubSpot, switch to Build Mode. Anna enforces a rigorous 4-stage pipeline that guarantees safety, transparency, and auditability.
            </p>

            <div className="space-y-3 text-xs text-gray-300">
              <div className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-[#FF5C00] shrink-0 mt-0.5" />
                <span><strong>Capability Registry Gate:</strong> Blocks operations requiring higher subscription tiers before generating requests.</span>
              </div>
              <div className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-[#FF5C00] shrink-0 mt-0.5" />
                <span><strong>Dry-Run Visual Schema Diffs:</strong> Inspect exact JSON additions and property labels prior to committing.</span>
              </div>
              <div className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-[#FF5C00] shrink-0 mt-0.5" />
                <span><strong>Human-in-the-Loop Sign-off:</strong> High-impact operations require authorized admin approval.</span>
              </div>
              <div className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-[#FF5C00] shrink-0 mt-0.5" />
                <span><strong>Deterministic Rollback Snapshots:</strong> Every change creates a restore point for instant reversibility.</span>
              </div>
            </div>

            <div className="pt-2">
              <Link
                href="/app"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#FF5C00] to-[#E04F00] text-white text-xs font-bold shadow-lg shadow-[#FF5C00]/25 hover:opacity-95 transition-all"
              >
                <span>Launch Build Mode</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}

