'use client';

import React from 'react';
import Link from 'next/link';
import {
  Bot,
  Hammer,
  Radio,
  BookOpen,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  Video,
  ShieldCheck,
  ChevronRight,
  TrendingUp,
} from 'lucide-react';
import { SiteHeader } from '@/components/SiteHeader';
import { SiteFooter } from '@/components/SiteFooter';

export default function MarketingHomePage() {
  return (
    <div className="min-h-screen bg-[#06090F] text-white selection:bg-[#FF5C00] selection:text-white flex flex-col justify-between">
      <SiteHeader />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative pt-24 pb-32 px-6 max-w-7xl mx-auto text-center overflow-hidden">
          {/* Orbital Ambient Glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-gradient-to-tr from-[#FF5C00]/15 via-orange-600/10 to-transparent blur-3xl pointer-events-none rounded-full" />

          {/* Announcement Pill with Brand Logo */}
          <div className="inline-flex items-center gap-3 px-5 py-2 rounded-full bg-[#0E1526] border border-[#1E293B] text-xs text-gray-300 mb-8 shadow-xl">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/huboverse-logo-dark.png" alt="HuboVerse" className="h-5 w-auto object-contain" />
            <span className="w-1.5 h-1.5 rounded-full bg-[#FF5C00] animate-pulse" />
            <span className="font-semibold text-white">HuboVerse 1.0</span>
            <span className="text-gray-400">• Powered by Anna AI</span>
          </div>

          {/* Main Title */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight max-w-5xl mx-auto leading-[1.12]">
            The Enterprise SaaS for{' '}
            <span className="bg-gradient-to-r from-white via-orange-100 to-[#FF5C00] bg-clip-text text-transparent">
              HubSpot Learning &amp; Autonomous Execution
            </span>
          </h1>

          <p className="mt-7 text-base sm:text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Unite certified HubSpot training, LiveKit coaching studios, and <strong>Anna AI</strong>—a dual-engine copilot that provides advisory intelligence and executes verified CRM schema changes safely.
          </p>

          {/* CTA Buttons */}
          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <a
              href="http://localhost:3001"
              className="px-8 py-4 rounded-2xl bg-gradient-to-r from-[#FF5C00] to-[#E04F00] text-white font-bold text-sm hover:opacity-95 shadow-xl shadow-[#FF5C00]/30 transition-all flex items-center gap-2 group"
            >
              <span>Explore Client Workspace</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </a>
            <Link
              href="/contact"
              className="px-7 py-4 rounded-2xl bg-[#0E1526] hover:bg-[#152038] text-white font-semibold text-sm border border-[#1E293B] transition-colors shadow-lg"
            >
              Book an Enterprise Demo
            </Link>
          </div>

          {/* 4 Interactive Feature Pillars with Dedicated Links */}
          <div className="mt-20 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-left">
            <Link
              href="/features"
              className="p-5 rounded-2xl bg-[#0B0F19] border border-[#1E293B] hover:border-[#FF5C00]/50 transition-all shadow-lg group"
            >
              <div className="w-10 h-10 rounded-xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-[#FF5C00] mb-3 group-hover:scale-105 transition-transform">
                <Radio className="w-5 h-5" />
              </div>
              <div className="text-sm font-bold text-white group-hover:text-[#FF5C00] transition-colors flex items-center justify-between">
                <span>Multi-Portal Hubs</span>
                <ChevronRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              <p className="text-xs text-gray-400 mt-1.5 leading-relaxed">
                Connect multiple portals per organization with AES-256 encrypted OAuth vaults.
              </p>
            </Link>

            <Link
              href="/anna"
              className="p-5 rounded-2xl bg-[#0B0F19] border border-[#1E293B] hover:border-cyan-500/50 transition-all shadow-lg group"
            >
              <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 mb-3 group-hover:scale-105 transition-transform">
                <Bot className="w-5 h-5" />
              </div>
              <div className="text-sm font-bold text-white group-hover:text-cyan-300 transition-colors flex items-center justify-between">
                <span>Anna Chat Mode</span>
                <ChevronRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              <p className="text-xs text-gray-400 mt-1.5 leading-relaxed">
                RAG hybrid retrieval over HubSpot docs with citations and guided troubleshooting.
              </p>
            </Link>

            <Link
              href="/anna#build"
              className="p-5 rounded-2xl bg-[#0B0F19] border border-[#1E293B] hover:border-orange-500/50 transition-all shadow-lg group"
            >
              <div className="w-10 h-10 rounded-xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-[#FF5C00] mb-3 group-hover:scale-105 transition-transform">
                <Hammer className="w-5 h-5" />
              </div>
              <div className="text-sm font-bold text-white group-hover:text-[#FF5C00] transition-colors flex items-center justify-between">
                <span>Anna Build Mode</span>
                <ChevronRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              <p className="text-xs text-gray-400 mt-1.5 leading-relaxed">
                4-stage safe execution pipeline with dry-run schema diffs &amp; atomic rollbacks.
              </p>
            </Link>

            <Link
              href="/academy"
              className="p-5 rounded-2xl bg-[#0B0F19] border border-[#1E293B] hover:border-purple-500/50 transition-all shadow-lg group"
            >
              <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 mb-3 group-hover:scale-105 transition-transform">
                <Video className="w-5 h-5" />
              </div>
              <div className="text-sm font-bold text-white group-hover:text-purple-300 transition-colors flex items-center justify-between">
                <span>LiveKit Coaching</span>
                <ChevronRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              <p className="text-xs text-gray-400 mt-1.5 leading-relaxed">
                Interactive instructor-led video classes with cloud egress and Mux streaming.
              </p>
            </Link>
          </div>
        </section>

        {/* Dual Mode Intelligence Feature Section */}
        <section className="py-24 bg-[#0B0F19]/60 border-t border-b border-[#1E293B] px-6">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <span className="text-xs font-mono uppercase text-[#FF5C00] font-bold tracking-wider">
                Central Intelligence
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white mt-2">
                Why Enterprise Teams Choose Anna AI
              </h2>
              <p className="text-sm sm:text-base text-gray-400 mt-3 max-w-2xl mx-auto">
                Unlike generic LLM wrappers, Anna understands HubSpot permissions, checks API tier eligibility, and enforces human-in-the-loop approval before touching live data.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              {/* Chat Mode Card */}
              <div className="bg-[#0E1526] border border-[#1E293B] rounded-3xl p-8 shadow-xl flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center">
                        <Bot className="w-5 h-5" />
                      </div>
                      <h3 className="text-xl font-bold text-white">Anna Chat Mode</h3>
                    </div>
                    <span className="text-[10px] font-mono px-2.5 py-1 rounded-full bg-cyan-500/20 text-cyan-300 font-semibold uppercase">
                      Advisory
                    </span>
                  </div>

                  <p className="text-xs text-gray-300 leading-relaxed">
                    Conversational advisor grounded in official HubSpot API schemas, HuboVerse masterclasses, and your portal&apos;s active setup via Supabase pgvector hybrid search.
                  </p>

                  <div className="mt-6 space-y-3 text-xs text-gray-300">
                    <div className="flex items-center gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
                      <span>Diagnose workflow un-enrollment triggers and suppression lists</span>
                    </div>
                    <div className="flex items-center gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
                      <span>Design multi-touch lead scoring rules and SQL thresholds</span>
                    </div>
                    <div className="flex items-center gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
                      <span>Direct citations linked to HubSpot knowledge articles</span>
                    </div>
                  </div>
                </div>

                <div className="mt-8 pt-4 border-t border-[#1E293B] flex items-center justify-between">
                  <span className="text-xs text-gray-400 font-mono">Status: Read-Only RAG</span>
                  <Link href="/anna" className="text-xs font-semibold text-cyan-400 hover:text-cyan-300 flex items-center gap-1">
                    <span>Learn more</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>

              {/* Build Mode Card */}
              <div className="bg-[#0E1526] border border-orange-500/30 rounded-3xl p-8 shadow-xl flex flex-col justify-between relative overflow-hidden">
                <div className="absolute top-0 right-0 w-40 h-40 bg-orange-500/10 rounded-full blur-2xl pointer-events-none" />
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-orange-500/10 text-[#FF5C00] flex items-center justify-center">
                        <Hammer className="w-5 h-5" />
                      </div>
                      <h3 className="text-xl font-bold text-white">Anna Build Mode</h3>
                    </div>
                    <span className="text-[10px] font-mono px-2.5 py-1 rounded-full bg-orange-500/20 text-[#FF5C00] font-semibold uppercase">
                      Execution
                    </span>
                  </div>

                  <p className="text-xs text-gray-300 leading-relaxed">
                    A deterministic 4-stage pipeline: Capability Check &rarr; Scope Validation &rarr; Dry-Run JSON Schema Diff &rarr; Human Approval &amp; Atomic Execution.
                  </p>

                  <div className="mt-6 space-y-3 text-xs text-gray-300">
                    <div className="flex items-center gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-[#FF5C00] shrink-0" />
                      <span>Verifies HubSpot Tier (Starter vs Pro vs Enterprise)</span>
                    </div>
                    <div className="flex items-center gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-[#FF5C00] shrink-0" />
                      <span>Dry-run diffs prevent inadvertent CRM collisions</span>
                    </div>
                    <div className="flex items-center gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-[#FF5C00] shrink-0" />
                      <span>Automatic rollback snapshots and immutable audit log</span>
                    </div>
                  </div>
                </div>

                <div className="mt-8 pt-4 border-t border-[#1E293B] flex items-center justify-between">
                  <span className="text-xs text-gray-400 font-mono">Status: Authorized Safe Execution</span>
                  <Link href="/anna#build" className="text-xs font-semibold text-[#FF5C00] hover:text-orange-400 flex items-center gap-1">
                    <span>Inspect Pipeline</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Call to Action Banner */}
        <section className="py-20 px-6 max-w-5xl mx-auto text-center">
          <div className="rounded-3xl bg-gradient-to-r from-[#131B2E] via-[#0E1526] to-[#1E293B] border border-[#1E293B] p-10 sm:p-14 shadow-2xl relative overflow-hidden">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Ready to Accelerate Your HubSpot Operations?
            </h2>
            <p className="text-sm sm:text-base text-gray-300 mt-4 max-w-xl mx-auto">
              Join leading B2B enterprises and HubSpot agencies using HuboVerse for unified training, AI consulting, and autonomous execution.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
              <a
                href="http://localhost:3001"
                className="px-8 py-3.5 rounded-xl bg-gradient-to-r from-[#FF5C00] to-[#E04F00] text-white font-bold text-sm shadow-xl shadow-[#FF5C00]/25 hover:opacity-95 transition-all"
              >
                Launch Client Workspace
              </a>
              <Link
                href="/pricing"
                className="px-6 py-3.5 rounded-xl bg-[#0B0F19] hover:bg-[#111827] text-white font-semibold text-sm border border-[#1E293B] transition-colors"
              >
                View Plans &amp; Pricing
              </Link>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
