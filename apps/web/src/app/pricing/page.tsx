import React from 'react';
import Link from 'next/link';
import {
  Check,
  ShieldCheck,
  Zap,
  Building,
  HelpCircle,
  ArrowRight,
  Sparkles,
  Bot,
  Lock,
} from 'lucide-react';
import { SiteHeader } from '@/components/SiteHeader';
import { SiteFooter } from '@/components/SiteFooter';

export const metadata = {
  title: 'Transparent Enterprise Pricing — HuboVerse',
  description: 'Predictable pricing for HubSpot intelligence, Anna AI Chat & Build modes, and certified live coaching.',
};

const PLANS = [
  {
    name: 'Starter RevOps',
    tagline: 'Ideal for single-portal teams standardizing CRM processes.',
    price: '$299',
    period: 'per month',
    highlighted: false,
    badge: null,
    features: [
      '1 Connected HubSpot Portal',
      '500,000 Anna AI Tokens / mo',
      'Anna AI Chat Mode (RAG Advisory)',
      'Full HuboVerse Academy Video Access',
      'Bi-weekly LiveKit Office Hours',
      'AES-256 Encrypted Credential Vault',
      'Standard Email & Community Support',
    ],
    ctaText: 'Start Free 14-Day Trial',
    ctaHref: '/register?plan=starter',
  },
  {
    name: 'Growth Enterprise',
    tagline: 'Full power for fast-moving RevOps teams needing automated execution.',
    price: '$799',
    period: 'per month',
    highlighted: true,
    badge: 'Most Popular',
    features: [
      '3 Connected HubSpot Portals (Sandbox + Prod)',
      '2,000,000 Anna AI Tokens / mo',
      'Anna AI Chat Mode + Safe Build Mode',
      'Action Capability Registry with Dry-Run Diffs',
      '1-Click Schema Rollback Protection',
      'Dedicated Weekly 1-on-1 LiveKit Coaching',
      'Multi-Role Team Access (5 Seats included)',
      'Priority 4-hour SLA Support from HuboExperts',
    ],
    ctaText: 'Start Enterprise Trial',
    ctaHref: '/register?plan=growth',
  },
  {
    name: 'Agency & Partner',
    tagline: 'Custom infrastructure for agencies managing multiple client portals.',
    price: '$1,899',
    period: 'per month',
    highlighted: false,
    badge: 'Multi-Tenant',
    features: [
      'Unlimited Connected HubSpot Portals',
      '10,000,000 Anna AI Tokens / mo',
      'Custom LLM Fine-Tuning on Portal Docs',
      'Complete Client Multi-Tenancy with RLS',
      'White-Label Client Academy & Reports',
      'Dedicated HubSpot Solutions Principal',
      '24/7 Emergency Incident Hotline',
      'Custom BAA / Enterprise DPA Agreements',
    ],
    ctaText: 'Speak with Sales',
    ctaHref: '/contact?tier=agency',
  },
];

const FAQS = [
  {
    q: 'How does Anna AI Build Mode protect my live HubSpot portal?',
    a: 'Every write operation is gated by the Action Capability Registry. Anna simulates the mutation in an isolated dry-run sandbox, displays an exact color-coded JSON schema diff, and requires explicit multi-factor confirmation before committing changes via the HubSpot API.',
  },
  {
    q: 'Can I connect both HubSpot Sandbox and Production portals?',
    a: 'Yes! On Growth Enterprise and Agency plans, you can link both Sandbox and Production portals. Anna can test schema changes on your sandbox before staging them for production rollout.',
  },
  {
    q: 'Is my HubSpot CRM data shared or used to train public AI models?',
    a: 'Never. HuboVerse enforces strict enterprise multi-tenancy with Supabase Row Level Security (RLS) and zero-retention API calls. Your proprietary CRM schema and customer data are never used to train public foundation models.',
  },
  {
    q: 'What if I exceed my monthly Anna AI token limit?',
    a: 'You can easily purchase token packs or enable auto-bursting at a transparent rate of $15 per 1,000,000 tokens. You will never face unexpected service interruptions.',
  },
];

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-[#06090F] text-white flex flex-col justify-between">
      <SiteHeader />

      <main className="flex-1 py-16 px-6 max-w-7xl mx-auto space-y-20">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/20 text-xs text-[#FF5C00] font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Transparent, High-ROI Plans</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-white">
            Invest in CRM Excellence with Total Safety
          </h1>
          <p className="text-sm sm:text-base text-gray-400 leading-relaxed">
            Eliminate consultant retainers and human error. Choose the tier tailored to your team size, HubSpot portal count, and automation complexity.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid lg:grid-cols-3 gap-8 items-stretch">
          {PLANS.map((plan) => (
            <div
              key={plan.name}
              className={`rounded-2xl p-8 flex flex-col justify-between transition-all relative ${
                plan.highlighted
                  ? 'bg-gradient-to-b from-[#141C30] to-[#0D1322] border-2 border-[#FF5C00] shadow-2xl shadow-[#FF5C00]/15 scale-105'
                  : 'bg-[#0B0F19] border border-[#1E293B] shadow-xl hover:border-[#1E293B]/80'
              }`}
            >
              {plan.badge && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full text-[11px] font-bold bg-[#FF5C00] text-white shadow-md">
                  {plan.badge}
                </div>
              )}

              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-bold text-white">{plan.name}</h3>
                  <p className="text-xs text-gray-400 mt-1 min-h-[32px]">{plan.tagline}</p>
                </div>

                <div className="pb-6 border-b border-[#1E293B]">
                  <div className="flex items-baseline gap-2">
                    <span className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight">
                      {plan.price}
                    </span>
                    <span className="text-xs text-gray-400 font-medium">{plan.period}</span>
                  </div>
                  <div className="text-[11px] text-gray-400 mt-1">Billed annually or month-to-month</div>
                </div>

                {/* Features List */}
                <div className="space-y-3">
                  <div className="text-[11px] font-bold text-gray-300 uppercase tracking-wider">
                    Included Capabilities
                  </div>
                  <ul className="space-y-2.5 text-xs text-gray-300">
                    {plan.features.map((feat, idx) => (
                      <li key={idx} className="flex items-start gap-2.5">
                        <Check className="w-4 h-4 text-[#FF5C00] shrink-0 mt-0.5" />
                        <span className="leading-snug">{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="pt-8">
                <Link
                  href={plan.ctaHref}
                  className={`w-full py-3 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all ${
                    plan.highlighted
                      ? 'bg-[#FF5C00] hover:bg-[#FF7A00] text-white shadow-lg shadow-[#FF5C00]/25'
                      : 'bg-[#131B2E] hover:bg-[#1E293B] text-white border border-[#1E293B]'
                  }`}
                >
                  <span>{plan.ctaText}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Security & Compliance Callout */}
        <div className="bg-[#0B0F19] border border-[#1E293B] rounded-2xl p-8 max-w-4xl mx-auto flex flex-col sm:flex-row items-center gap-6">
          <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
            <ShieldCheck className="w-7 h-7" />
          </div>
          <div className="space-y-1 text-center sm:text-left">
            <h4 className="text-base font-bold text-white">Enterprise Security &amp; SOC2 Compliance Ready</h4>
            <p className="text-xs text-gray-400 leading-relaxed">
              All credentials are stored in client-isolated encrypted vaults using AES-256-GCM. We support custom Single Sign-On (Okta, Azure AD, Google Workspace) and dedicated audit log export.
            </p>
          </div>
          <Link
            href="/contact"
            className="px-4 py-2 rounded-xl bg-[#131B2E] hover:bg-[#1E293B] text-white text-xs font-semibold border border-[#1E293B] shrink-0 whitespace-nowrap"
          >
            Review Security Whitepaper
          </Link>
        </div>

        {/* FAQs */}
        <div className="max-w-3xl mx-auto space-y-6">
          <div className="text-center space-y-2">
            <div className="text-xs font-bold text-[#FF5C00] uppercase tracking-wider">Frequently Asked Questions</div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">Everything You Need to Know</h2>
          </div>

          <div className="space-y-4">
            {FAQS.map((faq, idx) => (
              <div key={idx} className="bg-[#0B0F19] border border-[#1E293B] rounded-xl p-5 space-y-2">
                <h4 className="text-sm font-bold text-white flex items-center gap-2">
                  <HelpCircle className="w-4 h-4 text-[#FF5C00] shrink-0" />
                  <span>{faq.q}</span>
                </h4>
                <p className="text-xs text-gray-400 leading-relaxed pl-6">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
