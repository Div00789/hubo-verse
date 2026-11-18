import React from 'react';
import Link from 'next/link';
import {
  Users,
  Target,
  Sparkles,
  ShieldCheck,
  Award,
  ArrowRight,
  Compass,
  CheckCircle2,
  HeartHandshake,
} from 'lucide-react';
import { SiteHeader } from '@/components/SiteHeader';
import { SiteFooter } from '@/components/SiteFooter';

export const metadata = {
  title: 'About Us — Built by HuboExperts | HuboVerse',
  description: 'The story behind HuboVerse: uniting certified HubSpot consulting with safe, autonomous AI.',
};

const VALUES = [
  {
    icon: ShieldCheck,
    title: 'Zero Risk CRM Mutability',
    desc: 'Generic LLMs should never write directly to enterprise CRMs without strict sandboxing. We built the Action Capability Registry so every execution is previewed, verified, and audited.',
  },
  {
    icon: Target,
    title: 'HubSpot Domain Depth',
    desc: 'We do not build generic AI for 50 different CRMs. We specialize exclusively in HubSpot—custom objects, associations, HubL templates, and pipeline attribution logic.',
  },
  {
    icon: HeartHandshake,
    title: 'Consultant-Grade Intelligence',
    desc: 'Anna AI is trained and fine-tuned on hundreds of real enterprise HubSpot implementations completed by HuboExperts solutions architects.',
  },
  {
    icon: Compass,
    title: 'Empowerment Through Education',
    desc: 'We do not believe in black-box consulting. Through HuboVerse Academy and LiveKit coaching rooms, we upskill your internal team to become independent HubSpot powerhouses.',
  },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#06090F] text-white flex flex-col justify-between">
      <SiteHeader />

      <main className="flex-1 py-16 px-6 max-w-7xl mx-auto space-y-20">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/20 text-xs text-[#FF5C00] font-semibold">
            <Award className="w-3.5 h-3.5" />
            <span>Certified HubSpot Specialists</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-white">
            We Are Transforming How Enterprises Master &amp; Operate HubSpot
          </h1>
          <p className="text-sm sm:text-base text-gray-400 leading-relaxed">
            HuboVerse was born inside <strong>HuboExperts</strong>—a certified HubSpot partner agency that witnessed companies spend hundreds of thousands on repetitive consulting retainers while still suffering broken workflows and dirty data.
          </p>
        </div>

        {/* The HuboExperts Connection */}
        <div className="bg-[#0B0F19] border border-[#1E293B] rounded-2xl p-8 sm:p-12 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 bg-[#FF5C00]/10 rounded-full blur-3xl pointer-events-none" />
          <div className="relative z-10 grid md:grid-cols-2 gap-10 items-center">
            <div className="space-y-5">
              <span className="text-xs font-bold text-[#FF5C00] uppercase tracking-wider">Our Origin</span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
                From Agency Retainers to Scalable Intelligence
              </h2>
              <p className="text-xs sm:text-sm text-gray-300 leading-relaxed">
                For over a decade, the architects behind HuboExperts have designed custom HubSpot architectures for Fortune 500s, high-growth SaaS, and global service firms.
              </p>
              <p className="text-xs sm:text-sm text-gray-300 leading-relaxed">
                We realized that 80% of CRM maintenance—duplicate cleanup, workflow routing, schema modeling, and user permission audits—can be executed autonomously and error-free when an AI agent is paired with rigorous constraint checking.
              </p>
              <div className="pt-2">
                <a
                  href="https://huboexperts.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-xs font-semibold text-[#FF5C00] hover:underline"
                >
                  <span>Visit HuboExperts Agency</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>

            <div className="space-y-4 bg-[#101728] border border-[#1E293B] p-6 rounded-xl">
              <div className="text-xs font-bold text-white uppercase tracking-wider">HuboVerse Milestones</div>
              <div className="space-y-3 text-xs text-gray-300">
                <div className="p-3 rounded-lg bg-[#090D16] border border-[#1E293B] flex items-center justify-between">
                  <span className="font-semibold text-white">100+ Enterprise Implementations</span>
                  <span className="text-emerald-400 font-mono text-[11px]">Certified</span>
                </div>
                <div className="p-3 rounded-lg bg-[#090D16] border border-[#1E293B] flex items-center justify-between">
                  <span className="font-semibold text-white">1,500+ RevOps Specialists Trained</span>
                  <span className="text-emerald-400 font-mono text-[11px]">Academy</span>
                </div>
                <div className="p-3 rounded-lg bg-[#090D16] border border-[#1E293B] flex items-center justify-between">
                  <span className="font-semibold text-white">99.98% Safe Execution Rate</span>
                  <span className="text-emerald-400 font-mono text-[11px]">Anna AI</span>
                </div>
                <div className="p-3 rounded-lg bg-[#090D16] border border-[#1E293B] flex items-center justify-between">
                  <span className="font-semibold text-white">Multi-Tenant Supabase Architecture</span>
                  <span className="text-emerald-400 font-mono text-[11px]">RLS &amp; AES-256</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Core Values */}
        <div className="space-y-8">
          <div className="text-center space-y-2">
            <div className="text-xs font-bold text-[#FF5C00] uppercase tracking-wider">Our Philosophy</div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">The Engineering Principles Behind HuboVerse</h2>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {VALUES.map((val, idx) => {
              const Icon = val.icon;
              return (
                <div
                  key={idx}
                  className="bg-[#0B0F19] border border-[#1E293B] rounded-2xl p-7 space-y-3 hover:border-[#FF5C00]/40 transition-colors"
                >
                  <div className="w-10 h-10 rounded-xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-[#FF5C00]">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="text-lg font-bold text-white">{val.title}</h3>
                  <p className="text-xs text-gray-400 leading-relaxed">{val.desc}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* CTA */}
        <div className="text-center rounded-2xl bg-[#0B0F19] border border-[#1E293B] p-10 space-y-4">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white">Ready to Elevate Your HubSpot Operations?</h2>
          <p className="text-xs sm:text-sm text-gray-400 max-w-xl mx-auto leading-relaxed">
            Experience Anna AI and our complete learning ecosystem inside the HuboVerse interactive workspace today.
          </p>
          <div className="pt-2 flex justify-center gap-4">
            <a
              href="http://localhost:3001"
              className="px-6 py-3 rounded-xl bg-[#FF5C00] hover:bg-[#FF7A00] text-white font-bold text-xs transition-all shadow-md flex items-center gap-2"
            >
              <span>Open Interactive Workspace</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </a>
            <Link
              href="/contact"
              className="px-6 py-3 rounded-xl bg-[#131B2E] hover:bg-[#1E293B] text-gray-300 hover:text-white font-semibold text-xs border border-[#1E293B] transition-colors"
            >
              Contact Our Architects
            </Link>
          </div>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
