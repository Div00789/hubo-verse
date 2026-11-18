import React from 'react';
import Link from 'next/link';
import {
  ShieldCheck,
  Radio,
  Layers,
  Key,
  Database,
  Lock,
  ArrowRight,
  Cpu,
  CheckCircle2,
  Workflow,
  Sparkles,
} from 'lucide-react';
import { SiteHeader } from '@/components/SiteHeader';
import { SiteFooter } from '@/components/SiteFooter';

export const metadata = {
  title: 'Platform Architecture & Features — HuboVerse',
  description: 'Enterprise multi-tenant infrastructure, Action Capability Registry, and scoped HubSpot integrations.',
};

export default function FeaturesPage() {
  return (
    <div className="min-h-screen bg-[#06090F] text-white flex flex-col justify-between">
      <SiteHeader />

      <main className="flex-1 py-16 px-6 max-w-7xl mx-auto space-y-20">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#131B2E] border border-[#1E293B] text-xs text-[#FF5C00] font-semibold">
            <Cpu className="w-3.5 h-3.5" />
            <span>Enterprise System Architecture</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-white">
            Built for High-Growth HubSpot Operations
          </h1>
          <p className="text-sm sm:text-base text-gray-400 leading-relaxed">
            Engineered with Supabase Row Level Security, LangGraph.js autonomous agents, and a strict HubSpot Action Capability Registry that prevents unauthorized schema changes.
          </p>
        </div>

        {/* Feature Grid */}
        <div className="grid md:grid-cols-3 gap-6">
          {/* Feature 1 */}
          <div className="bg-[#0B0F19] border border-[#1E293B] rounded-2xl p-7 shadow-xl space-y-4">
            <div className="w-12 h-12 rounded-xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-[#FF5C00]">
              <Radio className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white">Multi-Portal Scoped OAuth</h3>
            <p className="text-xs text-gray-400 leading-relaxed">
              Connect multiple HubSpot portals per client organisation. Switch between sandbox and production portals seamlessly with dedicated synchronization engines.
            </p>
            <ul className="space-y-2 text-xs text-gray-300 pt-2">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>Isolated portal credentials</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>Automatic OAuth token refresh cycle</span>
              </li>
            </ul>
          </div>

          {/* Feature 2 */}
          <div id="registry" className="bg-[#0B0F19] border border-[#1E293B] rounded-2xl p-7 shadow-xl space-y-4">
            <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white">Action Capability Registry</h3>
            <p className="text-xs text-gray-400 leading-relaxed">
              Anna never attempts operations unauthorized by your portal tier. Pre-execution checks verify Marketing, Sales, Service, or Operations Hub licenses before proposing changes.
            </p>
            <ul className="space-y-2 text-xs text-gray-300 pt-2">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" />
                <span>Tier eligibility validation (Free &rarr; Enterprise)</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" />
                <span>Risk rating on every registered action</span>
              </li>
            </ul>
          </div>

          {/* Feature 3 */}
          <div id="vault" className="bg-[#0B0F19] border border-[#1E293B] rounded-2xl p-7 shadow-xl space-y-4">
            <div className="w-12 h-12 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
              <Lock className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white">AES-256 GCM Credential Vault</h3>
            <p className="text-xs text-gray-400 leading-relaxed">
              HubSpot API tokens, client secrets, and webhook signatures are encrypted at rest with industry-standard AES-256-GCM. Multi-tenant database RLS prevents cross-organization leaks.
            </p>
            <ul className="space-y-2 text-xs text-gray-300 pt-2">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-purple-400" />
                <span>Zero cross-tenant data leakage</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-purple-400" />
                <span>Immutable audit trail of all executions</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Architecture Pipeline */}
        <div className="bg-[#0B0F19] border border-[#1E293B] rounded-3xl p-8 sm:p-12 shadow-2xl">
          <div className="text-center max-w-2xl mx-auto mb-10 space-y-2">
            <h2 className="text-2xl font-bold text-white">Unified Multi-Tenant Pipeline</h2>
            <p className="text-xs text-gray-400">
              How HuboVerse orchestrates user requests through LangGraph, Supabase, and the HubSpot API.
            </p>
          </div>

          <div className="grid sm:grid-cols-4 gap-4 text-xs font-mono text-center">
            <div className="bg-[#111827] border border-[#1E293B] p-4 rounded-xl">
              <div className="text-[#FF5C00] font-bold mb-1">01. INGESTION</div>
              <div className="text-white font-semibold">User Prompt / Goal</div>
              <div className="text-[10px] text-gray-400 mt-1">Tenant &amp; Portal Scoped</div>
            </div>
            <div className="bg-[#111827] border border-[#1E293B] p-4 rounded-xl">
              <div className="text-cyan-400 font-bold mb-1">02. CAPABILITY</div>
              <div className="text-white font-semibold">Scope &amp; Tier Check</div>
              <div className="text-[10px] text-gray-400 mt-1">Registry Verification</div>
            </div>
            <div className="bg-[#111827] border border-[#1E293B] p-4 rounded-xl">
              <div className="text-amber-400 font-bold mb-1">03. DRY-RUN</div>
              <div className="text-white font-semibold">Schema Diff Preview</div>
              <div className="text-[10px] text-gray-400 mt-1">Human-in-the-Loop Sign-off</div>
            </div>
            <div className="bg-[#111827] border border-[#1E293B] p-4 rounded-xl">
              <div className="text-emerald-400 font-bold mb-1">04. COMMIT</div>
              <div className="text-white font-semibold">Atomic Execution</div>
              <div className="text-[10px] text-gray-400 mt-1">Rollback Snapshot Logged</div>
            </div>
          </div>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
