'use client';

import React from 'react';
import {
  Bot,
  Hammer,
  Radio,
  BookOpen,
  ShieldCheck,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  Video,
  Database,
  Building2,
  ExternalLink,
} from 'lucide-react';

export default function MarketingLandingPage() {
  return (
    <div className="min-h-screen bg-[#090D16] text-white overflow-x-hidden">
      {/* Navigation */}
      <header className="border-b border-[#1E293B] bg-[#0B101D]/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-18 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 relative flex items-center justify-center">
              <svg viewBox="0 0 100 100" fill="none" className="w-full h-full">
                <ellipse
                  cx="50"
                  cy="50"
                  rx="46"
                  ry="18"
                  transform="rotate(-25 50 50)"
                  stroke="#FF5C00"
                  strokeWidth="6"
                  strokeLinecap="round"
                />
                <circle cx="16" cy="62" r="6" fill="#FF5C00" />
                <path
                  d="M26 22 H40 L34 46 H54 L60 22 H74 L62 78 H48 L54 54 H34 L28 78 H14 L26 22 Z"
                  fill="#F8FAFC"
                />
                <path d="M37 46 H57 L55 54 H35 L37 46 Z" fill="#FF5C00" />
                <circle cx="84" cy="38" r="6" fill="#FF7A00" />
              </svg>
            </div>
            <span className="text-2xl font-extrabold tracking-tight">
              <span>Hubo</span>
              <span className="text-[#FF5C00]">Verse</span>
            </span>
            <span className="ml-2 px-2 py-0.5 rounded text-[10px] font-mono bg-[#1E293B] text-gray-400">
              by HuboExperts
            </span>
          </div>

          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-300">
            <a href="#features" className="hover:text-[#FF5C00] transition-colors">
              Platform
            </a>
            <a href="#anna" className="hover:text-[#FF5C00] transition-colors">
              Anna AI
            </a>
            <a href="#academy" className="hover:text-[#FF5C00] transition-colors">
              Academy & LiveKit
            </a>
            <a href="#pricing" className="hover:text-[#FF5C00] transition-colors">
              Pricing
            </a>
          </nav>

          <div className="flex items-center gap-3">
            <a
              href="http://localhost:3001"
              className="px-4 py-2 rounded-xl text-xs font-semibold text-gray-300 hover:text-white hover:bg-[#131B2E] transition-colors"
            >
              Sign In
            </a>
            <a
              href="http://localhost:3001"
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#FF5C00] to-[#E04F00] text-white text-xs font-bold hover:opacity-95 shadow-lg shadow-[#FF5C00]/25 transition-all flex items-center gap-1.5"
            >
              <span>Launch App</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-20 pb-28 px-6 max-w-7xl mx-auto text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#131B2E] border border-[#1E293B] text-xs text-gray-300 mb-8">
          <span className="w-2 h-2 rounded-full bg-[#FF5C00] animate-pulse" />
          <span>Announcing HuboVerse 1.0 Enterprise SaaS</span>
          <span className="text-gray-400">• Powered by Anna AI</span>
        </div>

        <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight max-w-4xl mx-auto leading-tight">
          The Enterprise Platform for <br />
          <span className="bg-gradient-to-r from-white via-orange-200 to-[#FF5C00] bg-clip-text text-transparent">
            HubSpot Learning & Autonomous Execution
          </span>
        </h1>

        <p className="mt-6 text-base sm:text-lg text-gray-400 max-w-2xl mx-auto leading-relaxed">
          HuboVerse merges expert HubSpot training, LiveKit live coaching studios, and <strong>Anna AI</strong>—an
          intelligent copilot capable of both advisory analysis and verifiable CRM build execution.
        </p>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <a
            href="http://localhost:3001"
            className="px-7 py-3.5 rounded-xl bg-gradient-to-r from-[#FF5C00] to-[#E04F00] text-white font-bold text-sm hover:opacity-95 shadow-xl shadow-[#FF5C00]/30 transition-all flex items-center gap-2"
          >
            <span>Launch Client Workspace</span>
            <ArrowRight className="w-4 h-4" />
          </a>
          <button
            onClick={() => alert('Demo booking form opening...')}
            className="px-6 py-3.5 rounded-xl bg-[#131B2E] hover:bg-[#1E293B] text-white font-semibold text-sm border border-[#1E293B] transition-colors"
          >
            Book an Enterprise Demonstration
          </button>
        </div>

        {/* Feature Badges */}
        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto text-left text-xs">
          <div className="p-4 rounded-xl bg-[#0F172A] border border-[#1E293B]">
            <Radio className="w-4 h-4 text-[#FF5C00] mb-2" />
            <div className="font-bold text-white">Multi-Portal Hubs</div>
            <div className="text-gray-400 text-[11px] mt-0.5">Scoped OAuth + encrypted vault</div>
          </div>
          <div className="p-4 rounded-xl bg-[#0F172A] border border-[#1E293B]">
            <Bot className="w-4 h-4 text-cyan-400 mb-2" />
            <div className="font-bold text-white">Anna Chat Mode</div>
            <div className="text-gray-400 text-[11px] mt-0.5">RAG citations & CRM troubleshooting</div>
          </div>
          <div className="p-4 rounded-xl bg-[#0F172A] border border-[#1E293B]">
            <Hammer className="w-4 h-4 text-orange-400 mb-2" />
            <div className="font-bold text-white">Anna Build Mode</div>
            <div className="text-gray-400 text-[11px] mt-0.5">Dry-run schema diffs & rollbacks</div>
          </div>
          <div className="p-4 rounded-xl bg-[#0F172A] border border-[#1E293B]">
            <Video className="w-4 h-4 text-emerald-400 mb-2" />
            <div className="font-bold text-white">LiveKit Cloud Studio</div>
            <div className="text-gray-400 text-[11px] mt-0.5">Live workshops & Mux streaming</div>
          </div>
        </div>
      </section>

      {/* Anna AI Deep-Dive */}
      <section id="anna" className="py-20 bg-[#0B101D] border-t border-b border-[#1E293B] px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-xs font-mono uppercase text-[#FF5C00] font-bold tracking-wider">
              Central Intelligence System
            </span>
            <h2 className="text-3xl font-extrabold text-white mt-2">
              Meet Anna: Dual-Engine HubSpot Intelligence
            </h2>
            <p className="text-sm text-gray-400 mt-2 max-w-xl mx-auto">
              Never choose between an AI that only talks or a tool that risks breaking your CRM schema.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Chat Mode Card */}
            <div className="bg-[#0F172A] border border-[#1E293B] rounded-2xl p-6 shadow-xl flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <Bot className="w-5 h-5 text-cyan-400" />
                    <h3 className="text-lg font-bold text-white">Anna Chat Mode</h3>
                  </div>
                  <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 font-bold">
                    Advisory Engine
                  </span>
                </div>
                <p className="text-xs text-gray-300 leading-relaxed">
                  Real-time conversational partner backed by Supabase pgvector hybrid search. Grounded on official
                  HubSpot documentation, HuboVerse masterclasses, and your portal&apos;s active schema metadata.
                </p>

                <ul className="mt-5 space-y-2.5 text-xs text-gray-300">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
                    <span>Explain lead scoring decay rules and SQL thresholds</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
                    <span>Diagnose un-enrolling workflow triggers and suppression lists</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
                    <span>Verifiable source citations directly linked to HubSpot docs</span>
                  </li>
                </ul>
              </div>

              <div className="mt-6 pt-4 border-t border-[#1E293B] text-xs text-gray-400 font-mono">
                Prompt: &quot;Anna, why are our workflows not enrolling contacts?&quot;
              </div>
            </div>

            {/* Build Mode Card */}
            <div className="bg-[#0F172A] border border-orange-500/40 rounded-2xl p-6 shadow-xl flex flex-col justify-between relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/10 rounded-full blur-2xl" />
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <Hammer className="w-5 h-5 text-[#FF5C00]" />
                    <h3 className="text-lg font-bold text-white">Anna Build Mode</h3>
                  </div>
                  <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-orange-500/20 text-[#FF5C00] font-bold">
                    Safe Execution Engine
                  </span>
                </div>
                <p className="text-xs text-gray-300 leading-relaxed">
                  A 4-stage safe pipeline: Intent Analysis &rarr; Capability Registry & Scope Verification &rarr; Dry-Run
                  Diff Generation &rarr; Human Approval & Atomic Execution.
                </p>

                <ul className="mt-5 space-y-2.5 text-xs text-gray-300">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#FF5C00] shrink-0" />
                    <span>Validates HubSpot Tier (Starter vs Pro vs Enterprise) first</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#FF5C00] shrink-0" />
                    <span>Generates interactive JSON schema diffs before changing CRM</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#FF5C00] shrink-0" />
                    <span>Automatic rollback snapshots and immutable audit log</span>
                  </li>
                </ul>
              </div>

              <div className="mt-6 pt-4 border-t border-[#1E293B] text-xs text-gray-400 font-mono">
                Prompt: &quot;Anna, create a custom property &apos;Lead Readiness Score&apos; on Contacts.&quot;
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 px-6 max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <span className="text-xs font-mono uppercase text-[#FF5C00] font-bold tracking-wider">
            Enterprise Subscriptions
          </span>
          <h2 className="text-3xl font-extrabold text-white mt-2">Scalable Commercial Plans</h2>
          <p className="text-sm text-gray-400 mt-2">
            Multi-tenant workspaces tailored for businesses, high-growth scale-ups, and HubSpot partner agencies.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-[#0F172A] border border-[#1E293B] rounded-2xl p-6 flex flex-col justify-between">
            <div>
              <div className="text-sm font-bold text-gray-300">Starter Workspace</div>
              <div className="text-3xl font-extrabold text-white mt-2">$299<span className="text-xs text-gray-400 font-normal">/mo</span></div>
              <p className="text-xs text-gray-400 mt-2">For growing teams standardizing their HubSpot CRM.</p>
              <ul className="mt-6 space-y-2 text-xs text-gray-300">
                <li>• 1 Connected HubSpot Portal</li>
                <li>• 5 Team Member Seats</li>
                <li>• 500,000 Anna AI Tokens/mo</li>
                <li>• Full On-Demand Academy Access</li>
              </ul>
            </div>
            <button className="mt-8 w-full py-2.5 rounded-xl bg-[#131B2E] hover:bg-[#1E293B] text-white text-xs font-semibold border border-[#1E293B] transition-colors">
              Get Started
            </button>
          </div>

          <div className="bg-[#0F172A] border-2 border-[#FF5C00] rounded-2xl p-6 flex flex-col justify-between relative shadow-2xl shadow-[#FF5C00]/10">
            <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-[#FF5C00] text-white text-[10px] font-bold uppercase tracking-wider">
              Most Popular
            </span>
            <div>
              <div className="text-sm font-bold text-[#FF5C00]">Growth Tier</div>
              <div className="text-3xl font-extrabold text-white mt-2">$799<span className="text-xs text-gray-400 font-normal">/mo</span></div>
              <p className="text-xs text-gray-400 mt-2">For mid-market companies scaling revenue operations.</p>
              <ul className="mt-6 space-y-2 text-xs text-gray-300">
                <li>• Up to 3 Connected HubSpot Portals</li>
                <li>• 15 Team Seats + RBAC Matrix</li>
                <li>• 2,000,000 Anna AI Tokens/mo</li>
                <li>• LiveKit Live Masterclasses</li>
                <li>• Full Anna Build Mode Automation</li>
              </ul>
            </div>
            <button className="mt-8 w-full py-2.5 rounded-xl bg-[#FF5C00] hover:bg-[#FF7A00] text-white text-xs font-bold shadow-lg shadow-[#FF5C00]/25 transition-colors">
              Upgrade to Growth
            </button>
          </div>

          <div className="bg-[#0F172A] border border-[#1E293B] rounded-2xl p-6 flex flex-col justify-between">
            <div>
              <div className="text-sm font-bold text-gray-300">Agency & Enterprise</div>
              <div className="text-3xl font-extrabold text-white mt-2">Custom</div>
              <p className="text-xs text-gray-400 mt-2">For global enterprise brands and elite HubSpot agencies.</p>
              <ul className="mt-6 space-y-2 text-xs text-gray-300">
                <li>• Unlimited Connected Portals</li>
                <li>• Dedicated HuboExperts Consultant</li>
                <li>• Custom pgvector Knowledge Ingestion</li>
                <li>• Custom Webhook Ingestion & SLAs</li>
                <li>• SOC2 & GDPR Compliance Vault</li>
              </ul>
            </div>
            <button className="mt-8 w-full py-2.5 rounded-xl bg-[#131B2E] hover:bg-[#1E293B] text-white text-xs font-semibold border border-[#1E293B] transition-colors">
              Contact Sales
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[#1E293B] py-12 px-6 bg-[#0B101D] text-xs text-gray-400">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-bold text-white">HuboVerse</span>
            <span>— Developed by HuboExperts. All rights reserved.</span>
          </div>
          <div className="flex items-center gap-6">
            <a href="#" className="hover:text-white">Terms of Service</a>
            <a href="#" className="hover:text-white">Privacy Policy</a>
            <a href="#" className="hover:text-white">Security & RLS</a>
            <a href="#" className="hover:text-white">Status</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
