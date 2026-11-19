import React from 'react';
import { Radio, RefreshCw, Key, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { DEMO_HUBSPOT_CONNECTION } from '@huboverse/database';

export const PortalStatusCard: React.FC = () => {
  const conn = DEMO_HUBSPOT_CONNECTION;

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-white">Connected HubSpot Portals</h2>
          <p className="text-xs text-gray-400">
            Multi-portal connectivity with scoped OAuth credentials and automated sync.
          </p>
        </div>
        <button className="px-4 py-2 rounded-xl bg-[#FF5C00] hover:bg-[#FF7A00] text-white text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-lg shadow-[#FF5C00]/20">
          <Radio className="w-3.5 h-3.5" />
          <span>Connect New Portal</span>
        </button>
      </div>

      {/* Primary Portal Card */}
      <div className="bg-[#0F172A] border border-[#1E293B] rounded-2xl p-6 shadow-xl">
        <div className="flex items-start justify-between pb-5 border-b border-[#1E293B]">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-[#FF5C00]">
              <Radio className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-white">{conn.portalName}</h3>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-mono font-semibold flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" /> CONNECTED
                </span>
              </div>
              <div className="text-xs text-gray-400 mt-0.5">
                Portal ID: <span className="font-mono text-gray-200">#{conn.portalId}</span> • Domain:{' '}
                <span className="font-mono text-gray-200">{conn.hubspotDomain}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button className="px-3 py-1.5 rounded-lg bg-[#131B2E] border border-[#1E293B] text-xs text-gray-300 hover:text-white flex items-center gap-1.5 transition-colors">
              <RefreshCw className="w-3 h-3 text-[#FF5C00]" />
              <span>Force Sync</span>
            </button>
          </div>
        </div>

        {/* Installed Hubs Grid */}
        <div className="mt-5">
          <div className="text-xs font-semibold text-gray-300 mb-3 uppercase tracking-wider text-[10px]">
            Licensed HubSpot Hubs & Tiers
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {Object.entries(conn.hubs).map(([hub, tier]) => (
              <div key={hub} className="bg-[#131B2E] border border-[#1E293B] rounded-xl p-3">
                <div className="text-xs text-gray-400">{hub} Hub</div>
                <div className="text-sm font-bold text-white mt-0.5">{tier}</div>
              </div>
            ))}
          </div>
        </div>

        {/* OAuth Scopes Breakdown */}
        <div className="mt-5 pt-5 border-t border-[#1E293B]">
          <div className="flex items-center justify-between mb-2">
            <div className="text-xs font-semibold text-gray-300 flex items-center gap-1.5">
              <Key className="w-3.5 h-3.5 text-[#FF5C00]" />
              <span>Installed OAuth Scopes (AES-256 Encrypted Vault)</span>
            </div>
            <span className="text-[11px] text-gray-400">{conn.installedScopes.length} Scopes Active</span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {conn.installedScopes.map((scope) => (
              <span
                key={scope}
                className="text-[11px] font-mono px-2 py-0.5 rounded bg-[#131B2E] border border-[#1E293B] text-gray-300"
              >
                {scope}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
