'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Building2,
  Mail,
  Lock,
  ArrowRight,
  ShieldCheck,
  Sparkles,
  CheckCircle2,
} from 'lucide-react';
import { BrandLogo } from '@/components/BrandLogo';

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    orgName: '',
    fullName: '',
    email: '',
    password: '',
    plan: 'growth',
  });
  const [loading, setLoading] = useState(false);

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      window.location.href = 'http://localhost:3001';
    }, 900);
  };

  return (
    <div className="min-h-screen bg-[#06090F] text-white flex flex-col justify-between">
      {/* Top Header with Logo */}
      <header className="border-b border-[#1E293B]/80 bg-[#06090F]/90 backdrop-blur-xl px-6 h-20 flex items-center justify-between">
        <BrandLogo size="md" variant="dark" href="/" />
        <Link
          href="/"
          className="text-xs text-gray-400 hover:text-white transition-colors"
        >
          &larr; Back to Public Site
        </Link>
      </header>

      {/* Main Register Card */}
      <main className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-md bg-[#0B0F19] border border-[#1E293B] rounded-2xl p-8 sm:p-10 shadow-2xl space-y-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-48 h-48 bg-[#FF5C00]/10 rounded-full blur-2xl pointer-events-none" />

          <div className="text-center space-y-2 relative z-10">
            <h1 className="text-2xl font-extrabold text-white">Create Your Organization</h1>
            <p className="text-xs text-gray-400">
              Start your 14-day free trial of HuboVerse &amp; Anna AI
            </p>
          </div>

          <form onSubmit={handleRegister} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gray-300">Company / Organization Name</label>
              <div className="relative">
                <Building2 className="w-4 h-4 text-gray-500 absolute left-3.5 top-3" />
                <input
                  type="text"
                  required
                  value={formData.orgName}
                  onChange={(e) => setFormData({ ...formData, orgName: e.target.value })}
                  placeholder="Acme Global Inc"
                  className="w-full bg-[#131B2E] border border-[#1E293B] rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#FF5C00]"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gray-300">Your Full Name</label>
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
              <label className="text-xs font-semibold text-gray-300">Work Email</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-gray-500 absolute left-3.5 top-3" />
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="jane@acmeglobal.com"
                  className="w-full bg-[#131B2E] border border-[#1E293B] rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#FF5C00]"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gray-300">Create Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-gray-500 absolute left-3.5 top-3" />
                <input
                  type="password"
                  required
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  placeholder="Minimum 8 characters"
                  className="w-full bg-[#131B2E] border border-[#1E293B] rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#FF5C00]"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-[#FF5C00] hover:bg-[#FF7A00] text-white font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-lg shadow-[#FF5C00]/25"
            >
              {loading ? (
                <span>Provisioning Supabase Tenant...</span>
              ) : (
                <>
                  <span>Create Workspace &amp; Start Trial</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          </form>

          <div className="pt-2 text-center text-xs text-gray-400">
            Already have an account?{' '}
            <Link href="/login" className="text-[#FF5C00] font-semibold hover:underline">
              Sign In
            </Link>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-[#1E293B] py-6 px-6 text-center text-xs text-gray-500">
        HuboVerse &bull; Certified HubSpot AI &amp; Learning Platform by HuboExperts &bull; Supabase RLS Protected
      </footer>
    </div>
  );
}
