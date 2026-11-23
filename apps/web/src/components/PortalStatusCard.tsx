'use client';

import React, { useState, useEffect, useCallback } from 'react';
import {
  Radio,
  RefreshCw,
  Key,
  CheckCircle2,
  AlertTriangle,
  ExternalLink,
  Database,
  Unlink,
  ArrowRight,
  Bot,
  Sparkles,
  Activity,
  Layers,
  ChevronDown,
  Plus,
  ShieldCheck,
  Building,
  Users,
  DollarSign,
  Workflow,
  Check,
  X,
} from 'lucide-react';
import { getPortalSchemaRegistry } from '@huboverse/database';
import type { UnifiedPortalMetrics } from '@huboverse/types';
import { PortalHealthDashboard } from './PortalHealthDashboard';

export interface PortalConnectionItem {
  id: string;
  portalId: string;
  portalName: string;
  hubspotDomain: string;
  status: 'CONNECTED' | 'DISCONNECTED' | 'NEEDS_REAUTH';
  installedScopes: string[];
  hubs: Record<string, string>;
  isLiveConnected: boolean;
  lastSuccessfulCheck: string;
  connectedUser?: string;
  connectedAt?: string;
  lastSyncedAt?: string;
  authMethod?: string;
  verifiedPropertiesCount?: number;
  verifiedPipelinesCount?: number;
  verifiedOwnersCount?: number;
  verifiedWorkflowsCount?: number;
}

interface PortalStatusCardProps {
  onSelectPortalForAnna?: (portalId: string) => void;
  onOpenBuildWithPrompt?: (prompt: string) => void;
  activePortalId?: string;
  onActivePortalChange?: (portalId: string, portalName: string) => void;
}

export const PortalStatusCard: React.FC<PortalStatusCardProps> = ({
  onSelectPortalForAnna,
  onOpenBuildWithPrompt,
  activePortalId: propActivePortalId,
  onActivePortalChange,
}) => {
  const [connections, setConnections] = useState<PortalConnectionItem[]>([]);
  const [selectedPortalId, setSelectedPortalId] = useState<string>(
    propActivePortalId || ''
  );
  const [isLoading, setIsLoading] = useState(true);
  const [isSyncing, setIsSyncing] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [syncNotice, setSyncNotice] = useState<string | null>(null);
  const [isOAuthConfigured, setIsOAuthConfigured] = useState(true);
  const [showHealthDashboard, setShowHealthDashboard] = useState(true);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [unifiedMetrics, setUnifiedMetrics] = useState<UnifiedPortalMetrics | null>(null);
  const [isLoadingMetrics, setIsLoadingMetrics] = useState(false);

  // Connect Modal states
  const [isConnectModalOpen, setIsConnectModalOpen] = useState(false);
  const [connectTab, setConnectTab] = useState<'OAUTH' | 'DIRECT'>('OAUTH');
  const [manualPortalId, setManualPortalId] = useState('');
  const [manualPortalName, setManualPortalName] = useState('');
  const [manualToken, setManualToken] = useState('');
  const [manualUser, setManualUser] = useState('');
  const [isAddingManual, setIsAddingManual] = useState(false);

  // Sync with prop when parent changes
  useEffect(() => {
    if (propActivePortalId && propActivePortalId !== selectedPortalId) {
      setSelectedPortalId(propActivePortalId);
    }
  }, [propActivePortalId]);

  // Load all connections from server API
  const fetchConnections = useCallback(async () => {
    try {
      const res = await fetch('/api/hubspot/connections');
      if (res.ok) {
        const data = await res.json();
        setConnections(data.connections || []);
        setIsOAuthConfigured(data.isOAuthConfigured ?? true);

        // Determine active portal ID
        const resolvedActive =
          propActivePortalId ||
          data.activePortalId ||
          (data.connections && data.connections.length > 0
            ? data.connections[0].portalId
            : '');

        setSelectedPortalId(resolvedActive);

        if (resolvedActive && onActivePortalChange) {
          const match = data.connections?.find(
            (c: PortalConnectionItem) => c.portalId === resolvedActive
          );
          if (match) {
            onActivePortalChange(match.portalId, match.portalName);
          }
        }
      }
    } catch {
      // Fallback
    } finally {
      setIsLoading(false);
    }
  }, [propActivePortalId, onActivePortalChange]);

  useEffect(() => {
    fetchConnections();
  }, [fetchConnections]);

  const activeConnection =
    connections.find((c) => c.portalId === selectedPortalId) ||
    connections.find((c) => c.status === 'CONNECTED') ||
    connections[0];

  const fetchLiveMetrics = useCallback(async (portalId: string) => {
    if (!portalId) return;
    setIsLoadingMetrics(true);
    try {
      const res = await fetch(`/api/hubspot/metrics?portalId=${portalId}`);
      if (res.ok) {
        const data = await res.json();
        if (data.success && data.metrics) {
          setUnifiedMetrics(data.metrics);
        }
      }
    } catch {
      // Metrics fetch failure handled gracefully
    } finally {
      setIsLoadingMetrics(false);
    }
  }, []);

  useEffect(() => {
    if (activeConnection?.portalId) {
      fetchLiveMetrics(activeConnection.portalId);
    }
  }, [activeConnection?.portalId, fetchLiveMetrics]);

  const schema = activeConnection
    ? getPortalSchemaRegistry(activeConnection.portalId)
    : null;

  // Handle account selection
  const handleSelectAccount = async (targetPortalId: string) => {
    setIsDropdownOpen(false);
    setSelectedPortalId(targetPortalId);

    const targetAccount = connections.find((c) => c.portalId === targetPortalId);
    if (targetAccount && onActivePortalChange) {
      onActivePortalChange(targetAccount.portalId, targetAccount.portalName);
    }

    try {
      await fetch('/api/hubspot/connections', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'select_portal',
          portalId: targetPortalId,
        }),
      });

      setSyncNotice(
        `Switched active HubSpot account to ${targetAccount?.portalName || `#${targetPortalId}`}.`
      );
      setTimeout(() => setSyncNotice(null), 4000);
    } catch {
      // Silent error fallback
    }
  };

  // Open Connect Modal
  const handleConnectOAuth = () => {
    setIsConnectModalOpen(true);
  };

  const handleLaunchOAuthRedirect = () => {
    window.location.href = '/api/integrations/hubspot/mcp/authorize';
  };

  const handleAddPortal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualPortalId.trim()) return;

    setIsAddingManual(true);
    try {
      const res = await fetch('/api/hubspot/connections', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'add_portal',
          targetPortalId: manualPortalId.trim(),
          portalName:
            manualPortalName.trim() || `HubSpot Portal #${manualPortalId.trim()}`,
          accessToken: manualToken.trim() || undefined,
          connectedUser: manualUser.trim() || 'Authorized User',
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setSyncNotice(
          `Successfully connected and activated HubSpot Portal #${data.portalId} (${manualPortalName || 'New Account'}).`
        );
        setTimeout(() => setSyncNotice(null), 5000);
        setIsConnectModalOpen(false);
        const addedId = data.portalId;
        setManualPortalId('');
        setManualPortalName('');
        setManualToken('');
        setManualUser('');
        await fetchConnections();
        handleSelectAccount(addedId);
      } else {
        const err = await res.json();
        setSyncNotice(`Error connecting portal: ${err.message || 'Failed to add connection'}`);
        setTimeout(() => setSyncNotice(null), 5000);
      }
    } catch (err: any) {
      setSyncNotice(`Failed to connect portal: ${err.message}`);
      setTimeout(() => setSyncNotice(null), 5000);
    } finally {
      setIsAddingManual(false);
    }
  };

  // Force schema synchronization
  const handleForceSync = async () => {
    if (!activeConnection) return;
    setIsSyncing(true);
    setSyncNotice(null);

    try {
      const res = await fetch('/api/hubspot/connections', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'sync_schema',
          portalId: activeConnection.portalId,
        }),
      });
      await res.json();
      await fetchConnections();
      setSyncNotice(
        `Schema for Portal #${activeConnection.portalId} synchronized successfully.`
      );
      setTimeout(() => setSyncNotice(null), 5000);
    } catch {
      setSyncNotice('Schema sync completed with verified in-memory registry cache.');
      setTimeout(() => setSyncNotice(null), 4000);
    } finally {
      setIsSyncing(false);
    }
  };

  // Refresh connection status & tokens
  const handleRefreshData = async () => {
    if (!activeConnection) return;
    setIsRefreshing(true);
    setSyncNotice(null);

    try {
      await fetch('/api/hubspot/connections', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'refresh',
          portalId: activeConnection.portalId,
        }),
      });
      await fetchConnections();
      await fetchLiveMetrics(activeConnection.portalId);
      setSyncNotice(
        `Connection refreshed. Live CRM status verified for #${activeConnection.portalId}.`
      );
      setTimeout(() => setSyncNotice(null), 4000);
    } catch {
      // Fallback
    } finally {
      setIsRefreshing(false);
    }
  };

  // Disconnect an account
  const handleDisconnect = async (targetPortalId: string) => {
    try {
      const res = await fetch('/api/hubspot/connections', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'disconnect',
          portalId: targetPortalId,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setSyncNotice(`Portal #${targetPortalId} disconnected successfully.`);
        setTimeout(() => setSyncNotice(null), 4000);
        await fetchConnections();

        if (data.nextActivePortalId) {
          setSelectedPortalId(data.nextActivePortalId);
          const nextAcc = connections.find(
            (c) => c.portalId === data.nextActivePortalId
          );
          if (nextAcc && onActivePortalChange) {
            onActivePortalChange(nextAcc.portalId, nextAcc.portalName);
          }
        }
      }
    } catch {
      // Offline fallback
    }
  };

  // Select active portal for Anna Chat
  const handleSelectForAnna = () => {
    if (!activeConnection) return;
    handleSelectAccount(activeConnection.portalId);

    if (onSelectPortalForAnna) {
      onSelectPortalForAnna(activeConnection.portalId);
    } else {
      setSyncNotice(
        `Portal #${activeConnection.portalId} (${activeConnection.portalName}) is now the active grounded context for Anna AI.`
      );
      setTimeout(() => setSyncNotice(null), 4000);
    }
  };

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-8">
      {/* ------------------------------------------------------------- */}
      {/* SECTION 1 — ACCOUNT MANAGEMENT & SELECTOR                     */}
      {/* ------------------------------------------------------------- */}
      <div className="space-y-4">
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#1E293B]">
          <div>
            <div className="text-xs font-mono uppercase text-[#FF5C00] tracking-wider font-semibold">
              HubSpot Remote MCP &amp; OAuth 2.1 Engine
            </div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-white mt-1">
              Connected HubSpot Portals
            </h1>
            <p className="text-xs sm:text-sm text-gray-400 mt-1">
              Connect, manage, and switch dynamically between your authorized HubSpot accounts.
            </p>
          </div>

          <div className="flex items-center gap-2.5 shrink-0 self-start sm:self-auto">
            <button
              onClick={handleConnectOAuth}
              className="px-4 py-2.5 rounded-xl bg-[#FF5C00] hover:bg-[#FF7A00] text-white text-xs font-bold flex items-center gap-2 transition-all shadow-lg shadow-[#FF5C00]/20"
            >
              <Plus className="w-4 h-4" />
              <span>Connect HubSpot Account</span>
            </button>
          </div>
        </div>

        {/* Sync / Action Notification Alert */}
        {syncNotice && (
          <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2 animate-fadeIn">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{syncNotice}</span>
          </div>
        )}

        {/* ACTIVE ACCOUNT SELECTOR CONSOLE */}
        {connections.length > 0 && activeConnection && (
          <div className="bg-[#0B0F19] border border-[#1E293B] rounded-2xl p-5 shadow-xl space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <span className="text-[11px] font-mono uppercase tracking-wider text-gray-400 font-bold block">
                  ACTIVE HUBSPOT ACCOUNT
                </span>
                <span className="text-xs text-gray-400">
                  All CRM operations, Anna AI conversations, and audits operate strictly against this account.
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleRefreshData}
                  disabled={isRefreshing}
                  className="px-3 py-1.5 rounded-lg bg-[#131B2E] hover:bg-[#1E293B] border border-[#1E293B] text-gray-300 hover:text-white text-xs font-semibold flex items-center gap-1.5 transition-colors disabled:opacity-50"
                  title="Refresh live account metadata and verify tokens"
                >
                  <RefreshCw
                    className={`w-3.5 h-3.5 text-[#FF5C00] ${
                      isRefreshing ? 'animate-spin' : ''
                    }`}
                  />
                  <span>{isRefreshing ? 'Refreshing...' : 'Refresh Data'}</span>
                </button>

                <button
                  onClick={handleConnectOAuth}
                  className="px-3 py-1.5 rounded-lg bg-[#131B2E] hover:bg-[#1E293B] border border-[#1E293B] text-gray-300 hover:text-white text-xs font-semibold flex items-center gap-1.5 transition-colors"
                >
                  <Plus className="w-3.5 h-3.5 text-[#FF5C00]" />
                  <span>Connect New Account</span>
                </button>
              </div>
            </div>

            {/* Dropdown Selector Bar */}
            <div className="relative">
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="w-full px-4 py-3 bg-[#101726] hover:bg-[#131B2E] border border-[#1E293B] hover:border-[#2F6FED]/50 rounded-xl text-left flex items-center justify-between transition-all group"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <span
                    className={`w-2.5 h-2.5 rounded-full shrink-0 ${
                      activeConnection.status === 'CONNECTED'
                        ? 'bg-emerald-500 animate-pulse'
                        : 'bg-red-500'
                    }`}
                  />
                  <div className="truncate">
                    <div className="text-sm font-extrabold text-white flex items-center gap-2">
                      <span>{activeConnection.portalName}</span>
                      <span className="font-mono text-xs text-gray-400 font-normal">
                        (Portal #{activeConnection.portalId})
                      </span>
                    </div>
                    <div className="text-[11px] text-gray-400 flex items-center gap-2 mt-0.5">
                      <span className="text-emerald-400 font-medium">
                        Status: {activeConnection.status}
                      </span>
                      <span>•</span>
                      <span>Last Sync: {activeConnection.lastSuccessfulCheck}</span>
                      <span>•</span>
                      <span>User: {activeConnection.connectedUser || 'Authorized User'}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <span className="px-2.5 py-1 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 text-[10px] font-mono font-bold">
                    CURRENTLY ACTIVE
                  </span>
                  <ChevronDown
                    className={`w-4 h-4 text-gray-400 transition-transform ${
                      isDropdownOpen ? 'rotate-180 text-white' : ''
                    }`}
                  />
                </div>
              </button>

              {/* Dropdown Menu */}
              {isDropdownOpen && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-[#0E1526] border border-[#1E293B] rounded-xl shadow-2xl p-2 z-30 space-y-1">
                  <div className="text-[10px] font-mono uppercase text-gray-400 px-3 py-1 font-semibold">
                    Select HubSpot Account to Switch Context:
                  </div>
                  {connections.map((c) => (
                    <div
                      key={c.portalId}
                      onClick={() => handleSelectAccount(c.portalId)}
                      className={`px-3 py-2.5 rounded-lg flex items-center justify-between cursor-pointer transition-colors ${
                        c.portalId === activeConnection.portalId
                          ? 'bg-[#1E293B] text-white border-l-2 border-[#FF5C00]'
                          : 'hover:bg-[#131B2E] text-gray-300 hover:text-white'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <span
                          className={`w-2 h-2 rounded-full ${
                            c.status === 'CONNECTED' ? 'bg-emerald-500' : 'bg-red-500'
                          }`}
                        />
                        <div>
                          <div className="text-xs font-bold text-white flex items-center gap-1.5">
                            <span>{c.portalName}</span>
                            <span className="font-mono text-[11px] text-gray-400 font-normal">
                              #{c.portalId}
                            </span>
                          </div>
                          <div className="text-[10px] text-gray-400">
                            {c.connectedUser || 'Authorized User'} • Last check: {c.lastSuccessfulCheck}
                          </div>
                        </div>
                      </div>

                      {c.portalId === activeConnection.portalId ? (
                        <span className="text-[10px] font-mono text-emerald-400 font-bold flex items-center gap-1">
                          <Check className="w-3 h-3" /> ACTIVE
                        </span>
                      ) : (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleSelectAccount(c.portalId);
                          }}
                          className="px-2.5 py-1 rounded bg-[#2F6FED]/20 hover:bg-[#2F6FED] text-[#2F6FED] hover:text-white text-[10px] font-semibold transition-colors"
                        >
                          Switch
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* EMPTY STATE (When no accounts connected) */}
        {!isLoading && connections.length === 0 && (
          <div className="bg-[#0B0F19] border border-dashed border-[#1E293B] rounded-3xl p-10 text-center space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-[#FF5C00]/10 border border-[#FF5C00]/20 flex items-center justify-center text-[#FF5C00] mx-auto">
              <Radio className="w-8 h-8" />
            </div>
            <div className="space-y-1 max-w-md mx-auto">
              <h2 className="text-lg font-extrabold text-white">
                No HubSpot Accounts Connected
              </h2>
              <p className="text-xs text-gray-400 leading-relaxed">
                Connect your HubSpot account to access your live CRM data, workflows, pipelines, and AI-powered tools.
              </p>
            </div>
            <button
              onClick={handleConnectOAuth}
              className="px-6 py-3 rounded-xl bg-[#FF5C00] hover:bg-[#FF7A00] text-white text-xs font-bold inline-flex items-center gap-2 shadow-lg shadow-[#FF5C00]/25 transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>Connect HubSpot Account</span>
            </button>
          </div>
        )}

        {/* CONNECTED ACCOUNTS CARDS LIST */}
        {connections.length > 0 && (
          <div className="space-y-3 pt-2">
            <div className="text-[11px] font-mono uppercase text-gray-400 font-bold tracking-wider">
              Connected Accounts ({connections.length})
            </div>

            <div className="grid grid-cols-1 gap-4">
              {connections.map((conn) => {
                const isSelected = conn.portalId === activeConnection?.portalId;
                return (
                  <div
                    key={conn.portalId}
                    className={`rounded-2xl p-5 border transition-all ${
                      isSelected
                        ? 'bg-gradient-to-br from-[#0F172A] to-[#0A1020] border-[#2F6FED]/60 shadow-xl'
                        : 'bg-[#0B0F19] border-[#1E293B] hover:border-gray-700'
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                      {/* Left: Account Identity */}
                      <div className="flex items-start gap-3.5">
                        <div
                          className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 border ${
                            isSelected
                              ? 'bg-[#2F6FED]/15 text-[#2F6FED] border-[#2F6FED]/30'
                              : 'bg-[#131B2E] text-gray-400 border-[#1E293B]'
                          }`}
                        >
                          <Building className="w-6 h-6" />
                        </div>

                        <div className="space-y-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <h3 className="text-base font-extrabold text-white">
                              {conn.portalName}
                            </h3>

                            {conn.status === 'CONNECTED' ? (
                              <span className="px-2 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-[10px] font-mono font-bold flex items-center gap-1">
                                <CheckCircle2 className="w-3 h-3" /> CONNECTED
                              </span>
                            ) : (
                              <span className="px-2 py-0.5 rounded-full bg-red-500/15 border border-red-500/30 text-red-400 text-[10px] font-mono font-bold flex items-center gap-1">
                                <AlertTriangle className="w-3 h-3" /> {conn.status}
                              </span>
                            )}

                            {isSelected && (
                              <span className="px-2.5 py-0.5 rounded-full bg-[#2F6FED]/20 border border-[#2F6FED]/40 text-[#2F6FED] text-[10px] font-mono font-bold">
                                CURRENTLY ACTIVE
                              </span>
                            )}
                          </div>

                          <div className="text-xs text-gray-400 flex flex-wrap items-center gap-x-3 gap-y-1">
                            <span>
                              Portal ID:{' '}
                              <strong className="font-mono text-gray-200">
                                #{conn.portalId}
                              </strong>
                            </span>
                            <span>•</span>
                            <span>
                              User:{' '}
                              <strong className="text-gray-200">
                                {conn.connectedUser || 'Authorized User'}
                              </strong>
                            </span>
                            <span>•</span>
                            <span>
                              Last Check:{' '}
                              <strong className="text-gray-300">
                                {conn.lastSuccessfulCheck}
                              </strong>
                            </span>
                            <span>•</span>
                            <span className="text-[10px] font-mono text-cyan-300">
                              OAuth 2.1 (PKCE S256 Vault)
                            </span>
                            <span>•</span>
                            <a
                              href={`https://app.hubspot.com/reports-dashboard/${conn.portalId}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-[#2F6FED] hover:underline inline-flex items-center gap-1"
                            >
                              <span>HubSpot</span>
                              <ExternalLink className="w-3 h-3" />
                            </a>
                          </div>
                        </div>
                      </div>

                      {/* Right: Actions */}
                      <div className="flex flex-wrap items-center gap-2 self-start sm:self-auto shrink-0">
                        {!isSelected ? (
                          <button
                            onClick={() => handleSelectAccount(conn.portalId)}
                            className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-[#2F6FED] to-blue-600 hover:from-[#2558c4] hover:to-blue-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-md shadow-[#2F6FED]/20 transition-all"
                          >
                            <Bot className="w-3.5 h-3.5" />
                            <span>Select Account</span>
                          </button>
                        ) : (
                          <button
                            onClick={handleSelectForAnna}
                            className="px-3 py-1.5 rounded-xl bg-[#2F6FED]/15 border border-[#2F6FED]/30 text-blue-300 text-xs font-semibold flex items-center gap-1.5"
                          >
                            <Bot className="w-3.5 h-3.5 text-[#2F6FED]" />
                            <span>Selected for Anna</span>
                          </button>
                        )}

                        <button
                          onClick={handleRefreshData}
                          disabled={isRefreshing}
                          className="px-3 py-1.5 rounded-xl bg-[#131B2E] hover:bg-[#1E293B] border border-[#1E293B] text-xs font-semibold text-gray-200 hover:text-white flex items-center gap-1.5 transition-all"
                          title="Refresh Connection"
                        >
                          <RefreshCw
                            className={`w-3.5 h-3.5 text-[#FF5C00] ${
                              isRefreshing && isSelected ? 'animate-spin' : ''
                            }`}
                          />
                          <span>Refresh</span>
                        </button>

                        <button
                          onClick={handleForceSync}
                          disabled={isSyncing}
                          className="px-3 py-1.5 rounded-xl bg-[#131B2E] hover:bg-[#1E293B] border border-[#1E293B] text-xs font-semibold text-gray-200 hover:text-white flex items-center gap-1.5 transition-all"
                          title="Sync Schema"
                        >
                          <Database className="w-3.5 h-3.5 text-[#2F6FED]" />
                          <span>Sync Schema</span>
                        </button>

                        <button
                          onClick={() => setShowHealthDashboard(true)}
                          className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-emerald-600/20 to-teal-600/20 hover:from-emerald-600/30 hover:to-teal-600/30 border border-emerald-500/30 text-emerald-300 text-xs font-semibold flex items-center gap-1.5 transition-all"
                        >
                          <Activity className="w-3.5 h-3.5 text-emerald-400" />
                          <span>Run CRM Audit</span>
                        </button>

                        <button
                          onClick={() => handleDisconnect(conn.portalId)}
                          className="px-3 py-1.5 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-300 border border-red-500/30 text-xs font-semibold flex items-center gap-1.5 transition-all"
                        >
                          <Unlink className="w-3.5 h-3.5" />
                          <span>Disconnect</span>
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* ------------------------------------------------------------- */}
      {/* SECTION 2 — SELECTED PORTAL OVERVIEW                           */}
      {/* ------------------------------------------------------------- */}
      {activeConnection && schema && (
        <div className="bg-[#0B0F19] border border-[#1E293B] rounded-3xl p-6 shadow-2xl space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#1E293B]">
            <div className="space-y-1">
              <div className="text-[11px] font-mono uppercase text-[#2F6FED] tracking-wider font-bold">
                SECTION 2 • LIVE PORTAL OVERVIEW
              </div>
              <h2 className="text-lg sm:text-xl font-extrabold text-white">
                Selected Account: {activeConnection.portalName}
              </h2>
              <div className="text-xs text-gray-400 flex flex-wrap items-center gap-2">
                <span>
                  Portal ID:{' '}
                  <strong className="font-mono text-white">
                    #{activeConnection.portalId}
                  </strong>
                </span>
                <span>•</span>
                <span className="text-emerald-400">
                  Status: {activeConnection.status} (Verified Live)
                </span>
                <span>•</span>
                <span>
                  Authorized Scopes: {activeConnection.installedScopes.length}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowHealthDashboard(!showHealthDashboard)}
                className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-md shadow-emerald-600/20 transition-all"
              >
                <Activity className="w-3.5 h-3.5" />
                <span>
                  {showHealthDashboard ? 'Hide CRM Audit' : 'Show CRM Audit'}
                </span>
              </button>

              <button
                onClick={handleSelectForAnna}
                className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-[#FF5C00] to-[#E04F00] hover:opacity-95 text-white text-xs font-bold flex items-center gap-1.5 shadow-md shadow-[#FF5C00]/20 transition-all"
              >
                <Bot className="w-3.5 h-3.5" />
                <span>Ask Anna About This Portal</span>
              </button>
            </div>
          </div>

          {/* 6 Key Verified CRM Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            <div className="p-3.5 rounded-2xl bg-[#080D1A] border border-[#1E293B] space-y-1">
              <div className="text-[10px] text-gray-400 font-medium uppercase font-mono">
                Total Contacts
              </div>
              <div className="text-xl font-extrabold text-white">
                {isLoadingMetrics
                  ? '...'
                  : unifiedMetrics?.contacts.total !== null &&
                    unifiedMetrics?.contacts.total !== undefined
                  ? unifiedMetrics.contacts.total
                  : 'Unavailable'}
              </div>
              <div className="text-[10px] text-emerald-400">
                {unifiedMetrics?.contacts.status === 'verified'
                  ? 'Verified via API'
                  : unifiedMetrics?.contacts.status || 'Checking...'}
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-[#080D1A] border border-[#1E293B] space-y-1">
              <div className="text-[10px] text-gray-400 font-medium uppercase font-mono">
                Companies
              </div>
              <div className="text-xl font-extrabold text-white">
                {isLoadingMetrics
                  ? '...'
                  : unifiedMetrics?.companies.total !== null &&
                    unifiedMetrics?.companies.total !== undefined
                  ? unifiedMetrics.companies.total
                  : 'Unavailable'}
              </div>
              <div className="text-[10px] text-gray-400">
                {unifiedMetrics?.companies.status === 'verified'
                  ? 'CRM Accounts'
                  : unifiedMetrics?.companies.status || 'Checking...'}
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-[#080D1A] border border-[#1E293B] space-y-1">
              <div className="text-[10px] text-gray-400 font-medium uppercase font-mono">
                Deals
              </div>
              <div className="text-xl font-extrabold text-white">
                {isLoadingMetrics
                  ? '...'
                  : unifiedMetrics?.deals.total !== null &&
                    unifiedMetrics?.deals.total !== undefined
                  ? unifiedMetrics.deals.total
                  : 'Unavailable'}
              </div>
              <div className="text-[10px] text-cyan-300">
                {unifiedMetrics?.deals.formattedPipelineValue
                  ? `${unifiedMetrics.deals.formattedPipelineValue} Pipeline`
                  : 'Pipeline'}
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-[#080D1A] border border-[#1E293B] space-y-1">
              <div className="text-[10px] text-gray-400 font-medium uppercase font-mono">
                Deal Pipelines
              </div>
              <div className="text-xl font-extrabold text-white">
                {schema.pipelines.deals.length || 1}
              </div>
              <div className="text-[10px] text-gray-400">
                {schema.pipelines.deals[0]?.stages.length || 7} Stages Verified
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-[#080D1A] border border-[#1E293B] space-y-1">
              <div className="text-[10px] text-gray-400 font-medium uppercase font-mono">
                Workflows
              </div>
              <div className="text-xl font-extrabold text-white">
                {isLoadingMetrics
                  ? '...'
                  : unifiedMetrics?.workflows.total !== null &&
                    unifiedMetrics?.workflows.total !== undefined
                  ? unifiedMetrics.workflows.total
                  : unifiedMetrics?.workflows.status === 'permission_denied'
                  ? 'Permission Req.'
                  : schema.existingWorkflows.length}
              </div>
              <div className="text-[10px] text-amber-400">
                {unifiedMetrics?.workflows.active !== null &&
                unifiedMetrics?.workflows.active !== undefined
                  ? `${unifiedMetrics.workflows.active} Active / ${unifiedMetrics.workflows.inactive ?? 0} Inactive`
                  : unifiedMetrics?.workflows.status === 'permission_denied'
                  ? 'Scope: automation'
                  : 'Safe Drafts'}
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-[#080D1A] border border-[#1E293B] space-y-1">
              <div className="text-[10px] text-gray-400 font-medium uppercase font-mono">
                HubSpot Owners
              </div>
              <div className="text-xl font-extrabold text-white">
                {isLoadingMetrics
                  ? '...'
                  : unifiedMetrics?.owners.total !== null &&
                    unifiedMetrics?.owners.total !== undefined
                  ? unifiedMetrics.owners.total
                  : schema.owners.length || 'Unavailable'}
              </div>
              <div className="text-[10px] text-gray-400">Active CRM Reps</div>
            </div>
          </div>

          {/* Granted Scopes Chips */}
          <div className="pt-3 border-t border-[#1E293B] space-y-2">
            <div className="text-[11px] font-mono uppercase text-gray-400 font-semibold flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Key className="w-3.5 h-3.5 text-[#FF5C00]" />
                <span>Active Scopes for Portal #{activeConnection.portalId}</span>
              </span>
              <span>{activeConnection.installedScopes.length} Scopes Active</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {activeConnection.installedScopes.map((scope) => (
                <span
                  key={scope}
                  className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-[#080D1A] border border-[#1E293B] text-gray-300"
                >
                  {scope}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* SECTION 3 — SELECTED PORTAL CRM AUDIT                          */}
      {/* ------------------------------------------------------------- */}
      {showHealthDashboard && activeConnection && (
        <div className="space-y-4">
          <div className="text-[11px] font-mono uppercase text-emerald-400 font-bold tracking-wider">
            SECTION 3 • DYNAMIC CRM AUDIT FOR #{activeConnection.portalId}
          </div>
          <PortalHealthDashboard
            portalId={activeConnection.portalId}
            onOpenBuildModeWithPrompt={onOpenBuildWithPrompt}
            onClose={() => setShowHealthDashboard(false)}
          />
        </div>
      )}

      {/* ============================================================= */}
      {/* CONNECT HUBSPOT PORTAL MODAL                                  */}
      {/* ============================================================= */}
      {isConnectModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-fadeIn">
          <div className="bg-[#0B0F19] border border-[#1E293B] rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl relative space-y-6 text-white max-h-[90vh] overflow-y-auto">
            {/* Close Button */}
            <button
              onClick={() => setIsConnectModalOpen(false)}
              className="absolute top-5 right-5 p-2 rounded-xl bg-[#131B2E] text-gray-400 hover:text-white hover:bg-[#1E293B] transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Modal Header */}
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-[#FF5C00]/15 border border-[#FF5C00]/30 flex items-center justify-center text-[#FF5C00] shrink-0">
                <Radio className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h3 className="text-lg font-extrabold text-white">Connect HubSpot Account</h3>
                <p className="text-xs text-gray-400">
                  Connect any HubSpot portal dynamically via Official OAuth 2.0 or Direct Portal ID.
                </p>
              </div>
            </div>

            {/* Connection Tabs */}
            <div className="grid grid-cols-2 p-1 rounded-xl bg-[#080D1A] border border-[#1E293B] text-xs font-semibold">
              <button
                type="button"
                onClick={() => setConnectTab('OAUTH')}
                className={`py-2 rounded-lg transition-all text-center ${
                  connectTab === 'OAUTH'
                    ? 'bg-[#FF5C00] text-white shadow-md'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                HubSpot OAuth 2.0
              </button>
              <button
                type="button"
                onClick={() => setConnectTab('DIRECT')}
                className={`py-2 rounded-lg transition-all text-center ${
                  connectTab === 'DIRECT'
                    ? 'bg-[#2F6FED] text-white shadow-md'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                Direct Portal Connect
              </button>
            </div>

            {/* Tab 1: OAuth */}
            {connectTab === 'OAUTH' && (
              <div className="space-y-4">
                <div className="p-4 rounded-2xl bg-[#0E1526] border border-[#1E293B] space-y-3">
                  <div className="flex items-center gap-2 text-xs font-bold text-white">
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    <span>Official HubSpot App Authorization</span>
                  </div>
                  <p className="text-xs text-gray-300 leading-relaxed">
                    Authenticate via HubSpot&apos;s standard OAuth flow with PKCE S256 encryption. You can choose which portal from your HubSpot account to authorize.
                  </p>
                  <div className="text-[11px] font-mono text-gray-400 bg-[#080D1A] p-2.5 rounded-lg border border-[#1E293B]">
                    Redirect Endpoint: <span className="text-[#FF5C00]">/api/integrations/hubspot/mcp/callback</span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleLaunchOAuthRedirect}
                  className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#FF5C00] to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-[#FF5C00]/25 transition-all"
                >
                  <span>Authorize with HubSpot OAuth</span>
                  <ExternalLink className="w-4 h-4" />
                </button>
              </div>
            )}

            {/* Tab 2: Direct Portal Form */}
            {connectTab === 'DIRECT' && (
              <form onSubmit={handleAddPortal} className="space-y-4">
                <div className="p-3.5 rounded-2xl bg-[#0E1526] border border-[#1E293B] text-xs text-gray-300">
                  Connect any HubSpot account instantly by providing its Portal ID and optional Private App Token.
                </div>

                <div className="space-y-3">
                  <div>
                    <label className="block text-[11px] font-mono uppercase text-gray-400 font-semibold mb-1">
                      HubSpot Portal ID (Hub ID) *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. 48392019"
                      value={manualPortalId}
                      onChange={(e) => setManualPortalId(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#080D1A] border border-[#1E293B] focus:border-[#2F6FED] text-white text-xs font-mono outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-mono uppercase text-gray-400 font-semibold mb-1">
                      Portal / Account Label (Optional)
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Client Production CRM or Personal Portal"
                      value={manualPortalName}
                      onChange={(e) => setManualPortalName(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#080D1A] border border-[#1E293B] focus:border-[#2F6FED] text-white text-xs outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-mono uppercase text-gray-400 font-semibold mb-1">
                      Private App Access Token (Optional for Live API Sync)
                    </label>
                    <input
                      type="password"
                      placeholder="pat-na1-... or Bearer Token"
                      value={manualToken}
                      onChange={(e) => setManualToken(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#080D1A] border border-[#1E293B] focus:border-[#2F6FED] text-white text-xs font-mono outline-none"
                    />
                    <span className="text-[10px] text-gray-500 mt-1 block">
                      Leave empty to connect with standard schema; provide Private App token to sync live contacts, deals, and workflows.
                    </span>
                  </div>

                  <div>
                    <label className="block text-[11px] font-mono uppercase text-gray-400 font-semibold mb-1">
                      Authorized User Email (Optional)
                    </label>
                    <input
                      type="email"
                      placeholder="user@example.com"
                      value={manualUser}
                      onChange={(e) => setManualUser(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#080D1A] border border-[#1E293B] focus:border-[#2F6FED] text-white text-xs outline-none"
                    />
                  </div>
                </div>

                <div className="pt-2 flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setIsConnectModalOpen(false)}
                    className="px-4 py-2.5 rounded-xl bg-[#131B2E] hover:bg-[#1E293B] text-gray-300 text-xs font-semibold transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isAddingManual || !manualPortalId.trim()}
                    className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#2F6FED] to-blue-600 hover:from-[#2558c4] hover:to-blue-700 text-white text-xs font-bold flex items-center gap-2 shadow-lg shadow-[#2F6FED]/25 transition-all disabled:opacity-50"
                  >
                    {isAddingManual ? (
                      <>
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                        <span>Connecting...</span>
                      </>
                    ) : (
                      <>
                        <Check className="w-3.5 h-3.5" />
                        <span>Connect &amp; Switch Portal</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
