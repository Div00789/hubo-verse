'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Mail,
  Phone,
  MapPin,
  Clock,
  Send,
  CheckCircle2,
  Sparkles,
  ShieldCheck,
  Building2,
  Calendar,
} from 'lucide-react';
import { SiteHeader } from '@/components/SiteHeader';
import { SiteFooter } from '@/components/SiteFooter';

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    company: '',
    portalTier: 'enterprise',
    inquiryType: 'general',
    message: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-[#06090F] text-white flex flex-col justify-between">
      <SiteHeader />

      <main className="flex-1 py-16 px-6 max-w-7xl mx-auto space-y-16">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/20 text-xs text-[#FF5C00] font-semibold">
            <Mail className="w-3.5 h-3.5" />
            <span>Consultant &amp; Engineering Support</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-white">
            Connect with Our HubSpot Solutions Architects
          </h1>
          <p className="text-sm sm:text-base text-gray-400 leading-relaxed">
            Have a question about Anna AI Build Mode, custom API capability policies, or enterprise live coaching cohorts? We are here to help.
          </p>
        </div>

        <div className="grid lg:grid-cols-5 gap-10 items-start">
          {/* Contact Details & Info */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-[#0B0F19] border border-[#1E293B] rounded-2xl p-7 space-y-6">
              <h3 className="text-lg font-bold text-white">HuboVerse Headquarters</h3>

              <div className="space-y-4 text-xs text-gray-300">
                <div className="flex items-start gap-3">
                  <Building2 className="w-4 h-4 text-[#FF5C00] shrink-0 mt-0.5" />
                  <div>
                    <div className="font-semibold text-white">HuboExperts Enterprise LLC</div>
                    <div className="text-gray-400">Certified HubSpot Solutions Elite Partner</div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Mail className="w-4 h-4 text-[#FF5C00] shrink-0 mt-0.5" />
                  <div>
                    <div className="font-semibold text-white">Direct Support &amp; Inquiries</div>
                    <a href="mailto:solutions@huboverse.ai" className="text-gray-400 hover:text-[#FF5C00]">
                      solutions@huboverse.ai
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Clock className="w-4 h-4 text-[#FF5C00] shrink-0 mt-0.5" />
                  <div>
                    <div className="font-semibold text-white">Enterprise Response SLA</div>
                    <div className="text-gray-400">Under 4 hours for enterprise inquiries</div>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-[#1E293B] space-y-2">
                <div className="text-xs font-bold text-white">Need an Instant Tour?</div>
                <p className="text-xs text-gray-400 leading-relaxed">
                  You can explore the HuboVerse client dashboard immediately without waiting for a sales call.
                </p>
                <div className="pt-1">
                  <Link
                    href="/app"
                    className="inline-flex items-center gap-2 text-xs font-bold text-[#FF5C00] hover:underline"
                  >
                    <span>Launch Interactive Demo &rarr;</span>
                  </Link>
                </div>
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-gradient-to-br from-[#101726] to-[#0A0E18] border border-[#1E293B] space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-emerald-400">
                <ShieldCheck className="w-4 h-4" />
                <span>NDA &amp; Security Guaranteed</span>
              </div>
              <p className="text-xs text-gray-400 leading-relaxed">
                All inquiries and portal discussions are held under strict non-disclosure. We never disclose your CRM topology or internal schemas.
              </p>
            </div>
          </div>

          {/* Form */}
          <div className="lg:col-span-3 bg-[#0B0F19] border border-[#1E293B] rounded-2xl p-8 sm:p-10 shadow-xl">
            {submitted ? (
              <div className="py-12 text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 mx-auto flex items-center justify-center">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-bold text-white">Inquiry Received!</h3>
                <p className="text-xs sm:text-sm text-gray-300 max-w-md mx-auto leading-relaxed">
                  Thank you, <strong>{formData.fullName}</strong>. A certified HubSpot solutions principal from HuboVerse will contact you at <strong>{formData.email}</strong> within 4 business hours.
                </p>
                <div className="pt-4">
                  <button
                    onClick={() => setSubmitted(false)}
                    className="text-xs font-semibold text-[#FF5C00] hover:underline"
                  >
                    Send another inquiry
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-1">
                  <h3 className="text-xl font-bold text-white">Send Us a Direct Message</h3>
                  <p className="text-xs text-gray-400">Fill out this form and our technical leadership will reply promptly.</p>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-gray-300">Your Full Name *</label>
                    <input
                      type="text"
                      required
                      value={formData.fullName}
                      onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                      placeholder="Jane Doe"
                      className="w-full bg-[#131B2E] border border-[#1E293B] rounded-xl px-4 py-2.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#FF5C00]"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-gray-300">Corporate Email *</label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="jane@company.com"
                      className="w-full bg-[#131B2E] border border-[#1E293B] rounded-xl px-4 py-2.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#FF5C00]"
                    />
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-gray-300">Company Name *</label>
                    <input
                      type="text"
                      required
                      value={formData.company}
                      onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                      placeholder="Acme Global Inc"
                      className="w-full bg-[#131B2E] border border-[#1E293B] rounded-xl px-4 py-2.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#FF5C00]"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-gray-300">HubSpot Portal Tier</label>
                    <select
                      value={formData.portalTier}
                      onChange={(e) => setFormData({ ...formData, portalTier: e.target.value })}
                      className="w-full bg-[#131B2E] border border-[#1E293B] rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-[#FF5C00]"
                    >
                      <option value="enterprise">Enterprise (Sales/Marketing Hub)</option>
                      <option value="professional">Professional Hub</option>
                      <option value="starter">Starter / Free</option>
                      <option value="evaluating">Evaluating HubSpot</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-gray-300">Primary Objective</label>
                  <select
                    value={formData.inquiryType}
                    onChange={(e) => setFormData({ ...formData, inquiryType: e.target.value })}
                    className="w-full bg-[#131B2E] border border-[#1E293B] rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-[#FF5C00]"
                  >
                    <option value="general">Anna AI Demo &amp; Build Mode Consultation</option>
                    <option value="academy">Corporate Academy Cohort Training</option>
                    <option value="portal-audit">HubSpot Schema &amp; Workflow Audit</option>
                    <option value="agency">Agency / White-Label Partner Inquiry</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-gray-300">How Can We Help? *</label>
                  <textarea
                    required
                    rows={4}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Tell us about your current HubSpot challenges or goals..."
                    className="w-full bg-[#131B2E] border border-[#1E293B] rounded-xl px-4 py-2.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#FF5C00] resize-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 rounded-xl bg-[#FF5C00] hover:bg-[#FF7A00] text-white font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-lg shadow-[#FF5C00]/25"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Submit Inquiry to HuboVerse Team</span>
                </button>
              </form>
            )}
          </div>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
