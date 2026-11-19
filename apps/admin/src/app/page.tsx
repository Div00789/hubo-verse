'use client';

import React from 'react';
import Link from 'next/link';
import {
  ShieldAlert,
  Building2,
  Radio,
  Hammer,
  Bot,
  Activity,
  CheckCircle2,
  AlertTriangle,
  ArrowUpRight,
  Video,
  Users,
} from 'lucide-react';
import { DEMO_ORGANIZATION } from '@huboverse/database';
import { ExpertManagement } from '@/components/ExpertManagement';

export default function AdminDashboardPage() {
  return (
    <div className="min-h-screen bg-[#090D16] text-white">
      {/* Header */}
      <header className="border-b border-[#1E293B] bg-[#0B101D] px-8 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/huboverse-logo-dark.png"
            alt="HuboVerse"
            className="h-7 w-auto object-contain"
          />
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 font-bold uppercase">
            SUPER ADMIN
          </span>
        </div>

        <div className="flex items-center gap-4 text-xs">
          <span className="flex items-center gap-1.5 text-emerald-400 font-mono">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            Supabase RLS & Cluster Operational
          </span>
          <Link
            href="/"
            className="px-3 py-1.5 rounded-lg bg-[#131B2E] border border-[#1E293B] text-gray-300 hover:text-white flex items-center gap-1"
          >
            <span>Public Site View</span>
            <ArrowUpRight className="w-3.5 h-3.5 text-[#FF5C00]" />
          </Link>
        </div>
      </header>

      {/* Main Container */}
      <main className="p-8 max-w-7xl mx-auto space-y-8">
        {/* Global KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <div className="bg-[#0F172A] border border-[#1E293B] rounded-2xl p-5 shadow-xl">
            <div className="flex items-center justify-between text-xs text-gray-400">
              <span>Active Organizations</span>
              <Building2 className="w-4 h-4 text-[#FF5C00]" />
            </div>
            <div className="text-2xl font-extrabold text-white mt-2">128</div>
            <div className="text-[11px] text-emerald-400 mt-1">+14% vs last month</div>
          </div>

          <div className="bg-[#0F172A] border border-[#1E293B] rounded-2xl p-5 shadow-xl">
            <div className="flex items-center justify-between text-xs text-gray-400">
              <span>Connected HubSpot Portals</span>
              <Radio className="w-4 h-4 text-cyan-400" />
            </div>
            <div className="text-2xl font-extrabold text-white mt-2">241</div>
            <div className="text-[11px] text-gray-400 mt-1">99.8% Sync uptime</div>
          </div>

          <div className="bg-[#0F172A] border border-[#1E293B] rounded-2xl p-5 shadow-xl">
            <div className="flex items-center justify-between text-xs text-gray-400">
              <span>Anna Build Executions</span>
              <Hammer className="w-4 h-4 text-orange-400" />
            </div>
            <div className="text-2xl font-extrabold text-white mt-2">1,894</div>
            <div className="text-[11px] text-emerald-400 mt-1">0 Rollback failures</div>
          </div>

          <div className="bg-[#0F172A] border border-[#1E293B] rounded-2xl p-5 shadow-xl">
            <div className="flex items-center justify-between text-xs text-gray-400">
              <span>LiveKit Studio Streams</span>
              <Video className="w-4 h-4 text-purple-400" />
            </div>
            <div className="text-2xl font-extrabold text-white mt-2">42</div>
            <div className="text-[11px] text-purple-400 mt-1">Active this week</div>
          </div>
        </div>

        {/* Real-Time Anna AI Execution Telemetry */}
        <div className="bg-[#0F172A] border border-[#1E293B] rounded-2xl p-6 shadow-xl">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Activity className="w-4 h-4 text-[#FF5C00]" />
              <h2 className="text-sm font-bold text-white">Cross-Tenant Anna Build Execution Stream</h2>
            </div>
            <span className="text-xs text-gray-400 font-mono">Live Telemetry Feed</span>
          </div>

          <div className="divide-y divide-[#1E293B] text-xs font-mono">
            <div className="py-3 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <div>
                  <div className="font-semibold text-white">
                    Acme Global (Portal #44891204) &bull; <span className="text-[#FF5C00]">hubspot.properties.create</span>
                  </div>
                  <div className="text-[11px] text-gray-400">Property: lead_readiness_score &bull; Risk: LOW</div>
                </div>
              </div>
              <span className="text-emerald-400 font-bold">COMMITTED</span>
            </div>

            <div className="py-3 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <div>
                  <div className="font-semibold text-white">
                    Solaria Dynamics (Portal #82910411) &bull; <span className="text-[#FF5C00]">hubspot.pipelines.create</span>
                  </div>
                  <div className="text-[11px] text-gray-400">Pipeline: Enterprise Retainers (5 Stages)</div>
                </div>
              </div>
              <span className="text-emerald-400 font-bold">COMMITTED</span>
            </div>

            <div className="py-3 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
                <div>
                  <div className="font-semibold text-white">
                    Fintech Horizon (Portal #19827362) &bull; <span className="text-gray-300">hubspot.workflows.create_webhook_action</span>
                  </div>
                  <div className="text-[11px] text-gray-400">Requires Operations Pro or Enterprise. Blocked by Capability Registry.</div>
                </div>
              </div>
              <span className="text-amber-400 font-bold">BLOCKED_BY_REGISTRY</span>
            </div>
          </div>
        </div>

        {/* Managed Experts Section */}
        <div className="bg-[#0F172A] border border-[#1E293B] rounded-2xl p-6 sm:p-8 shadow-xl">
          <ExpertManagement />
        </div>

        {/* Tenant Organization Table */}
        <div className="bg-[#0F172A] border border-[#1E293B] rounded-2xl p-6 shadow-xl">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-bold text-white">Managed Client Organisations</h2>
            <button className="px-3 py-1.5 rounded-lg bg-[#FF5C00] hover:bg-[#FF7A00] text-white text-xs font-semibold">
              + Onboard New Client
            </button>
          </div>

          <table className="w-full text-xs text-left">
            <thead className="border-b border-[#1E293B] text-gray-400 uppercase text-[10px] font-mono">
              <tr>
                <th className="py-2">Organization</th>
                <th className="py-2">Plan</th>
                <th className="py-2">Portals</th>
                <th className="py-2">Assigned Specialist</th>
                <th className="py-2 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1E293B] text-gray-300">
              <tr>
                <td className="py-3 font-semibold text-white">Acme Global Ventures</td>
                <td className="py-3 font-mono text-[#FF5C00]">ENTERPRISE</td>
                <td className="py-3">1 / 3 Connected</td>
                <td className="py-3">Alex Thorne</td>
                <td className="py-3 text-right">
                  <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-semibold font-mono text-[10px]">
                    ACTIVE
                  </span>
                </td>
              </tr>
              <tr>
                <td className="py-3 font-semibold text-white">Solaria Dynamics</td>
                <td className="py-3 font-mono text-cyan-400">GROWTH</td>
                <td className="py-3">2 / 3 Connected</td>
                <td className="py-3">Elena Rostova</td>
                <td className="py-3 text-right">
                  <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-semibold font-mono text-[10px]">
                    ACTIVE
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}
