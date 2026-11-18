import React from 'react';
import { Building2, CreditCard, Users, Shield, CheckCircle2 } from 'lucide-react';
import { DEMO_ORGANIZATION } from '@huboverse/database';

export const OrgSettings: React.FC = () => {
  const org = DEMO_ORGANIZATION;

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-8">
      <div>
        <h2 className="text-lg font-bold text-white">Organization & Subscription Management</h2>
        <p className="text-xs text-gray-400">
          Manage workspace settings, multi-tenant RBAC permissions, and Stripe enterprise billing.
        </p>
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
              <div className="w-8 h-8 rounded-full bg-blue-600/30 border border-blue-500 text-blue-300 font-bold flex items-center justify-center text-xs">
                ST
              </div>
              <div>
                <div className="font-semibold text-white">Sarah T. (You)</div>
                <div className="text-[11px] text-gray-400">sarah@acmeglobal.com</div>
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
