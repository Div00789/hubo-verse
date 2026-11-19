import React, { useEffect, useState } from 'react';
import { Building2, CreditCard, Users, Shield, CheckCircle2, Database, KeyRound, Server } from 'lucide-react';
import { DEMO_ORGANIZATION } from '@huboverse/database';
import { checkSupabaseConnection } from '@/lib/supabaseClient';

export const OrgSettings: React.FC = () => {
  const org = DEMO_ORGANIZATION;
  const [dbStatus, setDbStatus] = useState<'checking' | 'connected' | 'error'>('checking');

  useEffect(() => {
    checkSupabaseConnection().then((res) => {
      setDbStatus(res.connected ? 'connected' : 'error');
    });
  }, []);

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-8">
      <div>
        <h2 className="text-lg font-bold text-white">Organization & Subscription Management</h2>
        <p className="text-xs text-gray-400">
          Manage workspace settings, multi-tenant RBAC permissions, and Stripe enterprise billing.
        </p>
      </div>

      {/* Supabase & Cloud Infrastructure Live Status */}
      <div className="bg-[#0B101D] border border-[#1E293B] rounded-2xl p-5 shadow-xl">
        <div className="flex items-center justify-between pb-3 border-b border-[#1E293B]">
          <div className="flex items-center gap-2">
            <Database className="w-4 h-4 text-[#FF5C00]" />
            <h3 className="text-xs font-bold text-white uppercase tracking-wider">
              Supabase PostgreSQL & Security Status
            </h3>
          </div>
          <span className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            {dbStatus === 'checking' ? 'Testing Handshake...' : 'Live Connected'}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 text-xs">
          <div className="p-3 rounded-xl bg-[#131B2E] border border-[#1E293B] space-y-1">
            <div className="text-[10px] text-gray-400 flex items-center gap-1">
              <Server className="w-3 h-3 text-cyan-400" />
              <span>Project Endpoint</span>
            </div>
            <div className="font-mono text-white text-[11px] truncate">
              nuqzdunyntkzstpuebuf.supabase.co
            </div>
          </div>

          <div className="p-3 rounded-xl bg-[#131B2E] border border-[#1E293B] space-y-1">
            <div className="text-[10px] text-gray-400 flex items-center gap-1">
              <Shield className="w-3 h-3 text-emerald-400" />
              <span>Security Engine</span>
            </div>
            <div className="font-semibold text-white text-[11px]">
              PostgreSQL 16 + RLS Multi-Tenant
            </div>
          </div>

          <div className="p-3 rounded-xl bg-[#131B2E] border border-[#1E293B] space-y-1">
            <div className="text-[10px] text-gray-400 flex items-center gap-1">
              <KeyRound className="w-3 h-3 text-amber-400" />
              <span>Credential Vault</span>
            </div>
            <div className="font-semibold text-white text-[11px]">
              AES-256-GCM Encrypted Tokens
            </div>
          </div>
        </div>
      </div>

      {/* Plan Card */}
      <div className="bg-gradient-to-r from-orange-950/40 via-[#0F172A] to-[#0F172A] border border-orange-500/30 rounded-2xl p-6 shadow-xl flex items-center justify-between">
        <div>
          <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-orange-500/20 text-[#FF5C00] font-bold">
            Current Tier
          </span>
          <h3 className="text-xl font-bold text-white mt-1">{org.subscriptionTier} Plan</h3>
          <p className="text-xs text-gray-400 mt-0.5">
            Includes multi-portal connectivity, unlimited Anna Chat, 2M Anna Build tokens, and dedicated specialist support.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button className="px-4 py-2 rounded-xl bg-[#1E293B] hover:bg-[#283548] text-white text-xs font-semibold flex items-center gap-1.5 transition-colors border border-[#1E293B]">
            <CreditCard className="w-3.5 h-3.5 text-[#FF5C00]" />
            <span>Manage Stripe Billing</span>
          </button>
        </div>
      </div>

      {/* Team & RBAC Permissions Matrix */}
      <div className="bg-[#0F172A] border border-[#1E293B] rounded-2xl p-6 shadow-xl">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-[#FF5C00]" />
            <h3 className="text-sm font-bold text-white">Team Members & Role Access Control</h3>
          </div>
          <span className="text-xs text-gray-400">
            {org.maxSeats} Total Enterprise Seats Allocated
          </span>
        </div>

        <div className="divide-y divide-[#1E293B] text-xs">
          <div className="py-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-orange-600/30 border border-orange-500 text-[#FF5C00] font-bold flex items-center justify-center text-xs">
                AD
              </div>
              <div>
                <div className="font-semibold text-white">Organisation Administrator</div>
                <div className="text-[11px] text-gray-400">admin@acmeglobal.com</div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-mono text-[10px] font-semibold">
                CLIENT_ORG_ADMIN
              </span>
            </div>
          </div>

          <div className="py-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-orange-600/30 border border-orange-500 text-orange-300 font-bold flex items-center justify-center text-xs">
                AT
              </div>
              <div>
                <div className="font-semibold text-white">Alex Thorne (HuboExperts)</div>
                <div className="text-[11px] text-gray-400">alex@huboexperts.com</div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded bg-purple-500/20 text-purple-400 font-mono text-[10px] font-semibold">
                HUBSPOT_SPECIALIST
              </span>
            </div>
          </div>

          <div className="py-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-gray-700 text-gray-300 font-bold flex items-center justify-center text-xs">
                MK
              </div>
              <div>
                <div className="font-semibold text-white">Michael King</div>
                <div className="text-[11px] text-gray-400">michael@acmeglobal.com</div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded bg-blue-500/20 text-blue-400 font-mono text-[10px] font-semibold">
                STUDENT_LEARNER
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
