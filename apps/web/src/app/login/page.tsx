'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Lock,
  Mail,
  ArrowRight,
  ShieldCheck,
  Sparkles,
  CheckCircle2,
  Building2,
  Play,
} from 'lucide-react';
import { BrandLogo } from '@/components/BrandLogo';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Simulate real auth handshake and redirect to the application
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

      {/* Main Login Card */}
      <main className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-md bg-[#0B0F19] border border-[#1E293B] rounded-2xl p-8 sm:p-10 shadow-2xl space-y-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-48 h-48 bg-[#FF5C00]/10 rounded-full blur-2xl pointer-events-none" />

          <div className="text-center space-y-2 relative z-10">
            <h1 className="text-2xl font-extrabold text-white">Sign In to HuboVerse</h1>
            <p className="text-xs text-gray-400">
              Access your multi-tenant HubSpot intelligence workspace
            </p>
          </div>

          {/* Quick Demo Preview Button */}
          <div className="p-3.5 rounded-xl bg-[#131B2E] border border-[#1E293B] space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-white flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-[#FF5C00]" />
                Explore Without Credentials
              </span>
              <span className="text-[10px] text-emerald-400 font-mono">Instant</span>
            </div>
            <a
              href="http://localhost:3001"
              className="w-full py-2 rounded-lg bg-[#FF5C00] hover:bg-[#FF7A00] text-center text-xs font-bold text-white block transition-colors shadow-md shadow-[#FF5C00]/20"
            >
              Launch Interactive Client Workspace &rarr;
            </a>
          </div>

          <div className="relative flex items-center justify-center">
            <div className="border-t border-[#1E293B] w-full" />
            <span className="bg-[#0B0F19] px-3 text-[11px] text-gray-500 uppercase tracking-wider relative">
              Or Sign In
            </span>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gray-300">Corporate Email</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-gray-500 absolute left-3.5 top-3" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@company.com"
                  className="w-full bg-[#131B2E] border border-[#1E293B] rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#FF5C00]"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <label className="font-semibold text-gray-300">Password</label>
                <a href="#" className="text-gray-400 hover:text-[#FF5C00] text-[11px]">
                  Forgot password?
                </a>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-gray-500 absolute left-3.5 top-3" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full bg-[#131B2E] border border-[#1E293B] rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#FF5C00]"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-[#1E293B] hover:bg-[#283548] text-white font-bold text-xs flex items-center justify-center gap-2 transition-all border border-[#1E293B]"
            >
              {loading ? (
                <span>Authenticating with Supabase...</span>
              ) : (
                <>
                  <span>Sign In to HuboVerse</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          </form>

          <div className="pt-2 text-center text-xs text-gray-400">
            Don&apos;t have an enterprise account?{' '}
            <Link href="/register" className="text-[#FF5C00] font-semibold hover:underline">
              Create an Organization
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
