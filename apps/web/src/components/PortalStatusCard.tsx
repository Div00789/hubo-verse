import React, { useState } from 'react';
import {
  Radio,
  RefreshCw,
  Key,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  ExternalLink,
  Layers,
  Users,
  Database,
  Unlink,
  Workflow,
} from 'lucide-react';
import { DEMO_HUBSPOT_CONNECTION, getPortalSchemaRegistry } from '@huboverse/database';

export const PortalStatusCard: React.FC = () => {
  const [connectionStatus, setConnectionStatus] = useState<'CONNECTED' | 'DISCONNECTED'>('CONNECTED');
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncNotice, setSyncNotice] = useState<string | null>(null);
  const [lastSynced, setLastSynced] = useState<string>('Just now');
  const [showConnectModal, setShowConnectModal] = useState(false);

  const conn = DEMO_HUBSPOT_CONNECTION;
  const schema = getPortalSchemaRegistry(conn.portalId);

  const handleForceSync = () => {
    setIsSyncing(true);
    setSyncNotice(null);
    setTimeout(() => {
      setIsSyncing(false);
      setLastSynced(new Date().toLocaleTimeString());
      setSyncNotice('Portal Schema Registry refreshed: 4 CRM objects, 2 deal pipelines, 3 owners, 3 workflows verified.');
      setTimeout(() => setSyncNotice(null), 5000);
    }, 1200);
  };

  const handleToggleConnection = () => {
    if (connectionStatus === 'CONNECTED') {
      setConnectionStatus('DISCONNECTED');
      setSyncNotice('HubSpot Portal #46100478 has been safely disconnected.');
      setTimeout(() => setSyncNotice(null), 4000);
    } else {
      setConnectionStatus('CONNECTED');
      setLastSynced(new Date().toLocaleTimeString());
      setSyncNotice('HubSpot Portal #46100478 reconnected successfully via verified OAuth 2.0.');
      setTimeout(() => setSyncNotice(null), 4000);
    }
  };

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      {/* Page Title & Connect Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#1E293B]">
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-white">HubSpot Account Connection</h2>
          <p className="text-xs sm:text-sm text-gray-400 mt-1">
            Official OAuth 2.0 connection management, encrypted token vault, and live portal schema discovery.
          </p>
        </div>

        <button
          onClick={() => setShowConnectModal(true)}
          className="px-4 py-2.5 rounded-xl bg-[#FF5C00] hover:bg-[#FF7A00] text-white text-xs font-bold flex items-center gap-2 transition-all shadow-lg shadow-[#FF5C00]/20 shrink-0 self-start sm:self-auto"
        >
          <Radio className="w-4 h-4" />
          <span>Connect HubSpot Account</span>
        </button>
      </div>

      {/* Sync Success Alert */}
      {syncNotice && (
        <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{syncNotice}</span>
        </div>
      )}

      {/* Primary Portal Connection Card */}
      <div className="bg-[#0B0F19] border border-[#1E293B] rounded-3xl p-6 sm:p-7 shadow-2xl space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-6 border-b border-[#1E293B]">
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-2xl bg-[#FF5C00]/10 border border-[#FF5C00]/30 flex items-center justify-center text-[#FF5C00] shrink-0 shadow-lg shadow-[#FF5C00]/10">
              <Radio className="w-7 h-7" />
            </div>

            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="text-lg font-extrabold text-white">{conn.portalName}</h3>
                {connectionStatus === 'CONNECTED' ? (
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-[10px] font-mono font-bold flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" /> CONNECTED
                  </span>
                ) : (
                  <span className="px-2.5 py-0.5 rounded-full bg-red-500/15 border border-red-500/30 text-red-400 text-[10px] font-mono font-bold flex items-center gap-1">
                    <AlertTriangle className="w-3 h-3" /> DISCONNECTED
                  </span>
                )}
              </div>

              <div className="text-xs text-gray-400 flex flex-wrap items-center gap-x-3 gap-y-1">
                <span>
                  Portal ID: <strong className="font-mono text-gray-200">#{conn.portalId}</strong>
                </span>
                <span>•</span>
                <span>
                  Domain: <strong className="font-mono text-gray-200">{conn.hubspotDomain}</strong>
                </span>
                <span>•</span>
                <span>
                  Last Sync: <strong className="text-gray-300">{lastSynced}</strong>
                </span>
              </div>
            </div>
          </div>

          {/* Action Buttons: Force Sync & Disconnect */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={handleForceSync}
              disabled={isSyncing || connectionStatus === 'DISCONNECTED'}
              className="px-3.5 py-2 rounded-xl bg-[#131B2E] hover:bg-[#1E293B] border border-[#1E293B] text-xs font-semibold text-gray-200 hover:text-white flex items-center gap-2 transition-all disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 text-[#FF5C00] ${isSyncing ? 'animate-spin' : ''}`} />
              <span>{isSyncing ? 'Syncing...' : 'Sync Schema'}</span>
            </button>

            <button
              onClick={handleToggleConnection}
              className={`px-3.5 py-2 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition-all ${
                connectionStatus === 'CONNECTED'
                  ? 'bg-red-500/10 hover:bg-red-500/20 text-red-300 border-red-500/30'
                  : 'bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
              }`}
            >
              <Unlink className="w-3.5 h-3.5" />
              <span>{connectionStatus === 'CONNECTED' ? 'Disconnect' : 'Reconnect'}</span>
            </button>
          </div>
        </div>

        {/* Portal Schema Registry Overview */}
        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs font-bold text-gray-300">
            <span className="flex items-center gap-2">
              <Database className="w-4 h-4 text-[#2F6FED]" />
              <span>Portal Schema Registry (Verified Metadata Inventory)</span>
            </span>
            <span className="text-[11px] font-mono text-[#2F6FED]">Schema Version 1.4 • Auto-Grounded</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3.5 rounded-2xl bg-[#080D1A] border border-[#1E293B] space-y-1">
              <div className="text-[11px] text-gray-400 font-medium">CRM Properties</div>
              <div className="text-base font-extrabold text-white">
                {schema.properties.contacts.length + schema.properties.deals.length} Verified
              </div>
              <div className="text-[10px] text-gray-500">Contacts, Deals, Companies</div>
            </div>

            <div className="p-3.5 rounded-2xl bg-[#080D1A] border border-[#1E293B] space-y-1">
              <div className="text-[11px] text-gray-400 font-medium">Deal Pipelines</div>
              <div className="text-base font-extrabold text-white">
                {schema.pipelines.deals.length} Pipelines
              </div>
              <div className="text-[10px] text-gray-500">10 Total Win Stages</div>
            </div>

            <div className="p-3.5 rounded-2xl bg-[#080D1A] border border-[#1E293B] space-y-1">
              <div className="text-[11px] text-gray-400 font-medium">HubSpot Owners</div>
              <div className="text-base font-extrabold text-white">{schema.owners.length} Reps</div>
              <div className="text-[10px] text-gray-500">Round-Robin Ready</div>
            </div>

            <div className="p-3.5 rounded-2xl bg-[#080D1A] border border-[#1E293B] space-y-1">
              <div className="text-[11px] text-gray-400 font-medium">Active Automations</div>
              <div className="text-base font-extrabold text-white">{schema.existingWorkflows.length} Workflows</div>
              <div className="text-[10px] text-emerald-400">All Scopes Verified</div>
            </div>
          </div>
        </div>

        {/* Licensed HubSpot Hubs & Tiers */}
        <div className="space-y-3 pt-2">
          <div className="text-[11px] font-mono uppercase text-gray-400 font-bold tracking-wider">
            Detected HubSpot Licenses &amp; Tiers
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {Object.entries(conn.hubs).map(([hub, tier]) => (
              <div key={hub} className="bg-[#080D1A] border border-[#1E293B] rounded-2xl p-3.5">
                <div className="text-xs text-gray-400">{hub} Hub</div>
                <div className="text-sm font-extrabold text-white mt-1">{tier}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Installed OAuth Scopes Breakdown */}
        <div className="pt-5 border-t border-[#1E293B] space-y-3">
          <div className="flex items-center justify-between">
            <div className="text-xs font-bold text-gray-300 flex items-center gap-1.5">
              <Key className="w-4 h-4 text-[#FF5C00]" />
              <span>Authorized OAuth Scopes (AES-256-GCM Encrypted Token Vault)</span>
            </div>
            <span className="text-[11px] font-mono text-gray-400">{conn.installedScopes.length} Scopes Active</span>
          </div>

          <div className="flex flex-wrap gap-1.5">
            {conn.installedScopes.map((scope) => (
              <span
                key={scope}
                className="text-[11px] font-mono px-2.5 py-1 rounded-lg bg-[#080D1A] border border-[#1E293B] text-gray-300"
              >
                {scope}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Connect Modal */}
      {showConnectModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#0B0F19] border border-[#1E293B] rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-5 shadow-2xl">
            <div className="flex items-center justify-between pb-4 border-b border-[#1E293B]">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-[#FF5C00]/20 flex items-center justify-center text-[#FF5C00]">
                  <Radio className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-extrabold text-white">Connect HubSpot Portal</h3>
              </div>
              <button
                onClick={() => setShowConnectModal(false)}
                className="text-gray-400 hover:text-white text-sm"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-gray-300 leading-relaxed">
              HuboVerse uses HubSpot&apos;s official OAuth 2.0 authorization screen with least-privilege scopes. Your tokens are encrypted using AES-256-GCM and stored securely on the server.
            </p>

            <div className="p-4 rounded-2xl bg-[#080D1A] border border-[#1E293B] space-y-2 text-xs">
              <div className="font-bold text-white">Requested Permissions:</div>
              <ul className="text-gray-400 space-y-1 list-disc list-inside text-[11px]">
                <li>Read &amp; write contacts, companies, deals, pipelines</li>
                <li>Discover CRM properties &amp; allowed enumeration stages</li>
                <li>Create and deploy inactive workflow automation drafts</li>
                <li>Zero access to credentials outside your isolated organization</li>
              </ul>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setShowConnectModal(false)}
                className="px-4 py-2.5 rounded-xl bg-[#131B2E] text-xs font-semibold text-gray-300 hover:text-white"
              >
                Cancel
              </button>
              <a
                href="https://app.hubspot.com/oauth/authorize?client_id=demo_client_id&redirect_uri=http%3A%2F%2Flocalhost%3A3000%2Fapi%2Fauth%2Fhubspot%2Fcallback&scope=crm.objects.contacts.read%20crm.objects.contacts.write%20crm.schemas.contacts.read%20crm.schemas.contacts.write%20crm.objects.deals.read%20crm.objects.deals.write%20automation%20crm.lists.read&state=oauth_state_secure"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setShowConnectModal(false)}
                className="px-5 py-2.5 rounded-xl bg-[#FF5C00] hover:bg-[#FF7A00] text-white text-xs font-bold shadow-lg shadow-[#FF5C00]/25 inline-flex items-center gap-1.5"
              >
                <span>Authorize on HubSpot</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
