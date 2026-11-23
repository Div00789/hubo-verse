'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  RefreshCw,
  ExternalLink,
  ChevronDown,
  Plus,
  ShieldCheck,
  Building,
  Users,
  DollarSign,
  Workflow,
  Check,
  X,
  AlertCircle,
  FolderGit2,
  Lock,
  Layers,
  ArrowRight,
  TrendingUp,
} from 'lucide-react';
import type { UnifiedPortalMetrics } from '@huboverse/types';

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
}

interface PortalStatusCardProps {
  onSelectPortalForAnna?: (portalId: string) => void;
  onOpenBuildWithPrompt?: (prompt: string) => void;
  activePortalId?: string;
  onActivePortalChange?: (portalId: string, portalName: string) => void;
}

type CrmTab = 'contacts' | 'companies' | 'deals' | 'pipelines';

export const PortalStatusCard: React.FC<PortalStatusCardProps> = ({
  onSelectPortalForAnna,
  onOpenBuildWithPrompt,
  activePortalId: propActivePortalId,
  onActivePortalChange,
}) => {
  const [connections, setConnections] = useState<PortalConnectionItem[]>([]);
  const [selectedPortalId, setSelectedPortalId] = useState<string>(propActivePortalId || '');
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [syncNotice, setSyncNotice] = useState<string | null>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // Live Metrics
  const [unifiedMetrics, setUnifiedMetrics] = useState<UnifiedPortalMetrics | null>(null);
  const [isLoadingMetrics, setIsLoadingMetrics] = useState(false);
  const [metricsError, setMetricsError] = useState<string | null>(null);

  // CRM Data Tabs
  const [activeTab, setActiveTab] = useState<CrmTab>('contacts');
  const [tabRecords, setTabRecords] = useState<any[]>([]);
  const [tabPaging, setTabPaging] = useState<{ next?: { after: string } } | undefined>();
  const [tabOwners, setTabOwners] = useState<Record<string, string>>({});
  const [isLoadingRecords, setIsLoadingRecords] = useState(false);
  const [tabError, setTabError] = useState<string | null>(null);
  const [pageCursorHistory, setPageCursorHistory] = useState<string[]>([]);
  const [currentCursor, setCurrentCursor] = useState<string | undefined>(undefined);

  // Connect Modal states
  const [isConnectModalOpen, setIsConnectModalOpen] = useState(false);
  const [connectTab, setConnectTab] = useState<'OAUTH' | 'DIRECT'>('OAUTH');
  const [manualPortalId, setManualPortalId] = useState('');
  const [manualPortalName, setManualPortalName] = useState('');
  const [manualToken, setManualToken] = useState('');
  const [manualUser, setManualUser] = useState('');
  const [isAddingManual, setIsAddingManual] = useState(false);

  // Active query tracker to prevent race conditions
  const activePortalQueryRef = useRef<string>('');

  // Sync with prop when parent updates
  useEffect(() => {
    if (propActivePortalId && propActivePortalId !== selectedPortalId) {
      setSelectedPortalId(propActivePortalId);
    }
  }, [propActivePortalId]);

  // Load connections from server
  const fetchConnections = useCallback(async () => {
    try {
      const res = await fetch('/api/hubspot/connections');
      if (res.ok) {
        const data = await res.json();
        const list: PortalConnectionItem[] = data.connections || [];
        setConnections(list);

        // Determine active portal ID
        const resolvedActive =
          data.activePortalId ||
          propActivePortalId ||
          (list.length > 0 ? list[0].portalId : '');

        if (resolvedActive) {
          setSelectedPortalId(resolvedActive);
          const match = list.find((c) => c.portalId === resolvedActive);
          if (match && onActivePortalChange) {
            onActivePortalChange(match.portalId, match.portalName);
          }
        }
      }
    } catch {
      // Handled silently
    } finally {
      setIsLoading(false);
    }
  }, [propActivePortalId, onActivePortalChange]);

  useEffect(() => {
    fetchConnections();
  }, [fetchConnections]);

  const activeConnection = connections.find((c) => c.portalId === selectedPortalId) || null;

  // Fetch Live Metrics for active portal (Strict Isolation)
  const fetchLiveMetrics = useCallback(async (portalId: string) => {
    if (!portalId) {
      setUnifiedMetrics(null);
      return;
    }
    activePortalQueryRef.current = portalId;
    setIsLoadingMetrics(true);
    setMetricsError(null);

    try {
      const res = await fetch(`/api/hubspot/metrics?portalId=${encodeURIComponent(portalId)}`);
      if (activePortalQueryRef.current !== portalId) return; // Prevent race conditions

      const data = await res.json();
      if (res.ok && data.success && data.metrics) {
        setUnifiedMetrics(data.metrics);
      } else {
        setUnifiedMetrics(null);
        if (data.error === 'NEEDS_REAUTH') {
          setMetricsError(`HubSpot portal #${portalId} requires authentication.`);
        } else {
          setMetricsError(data.error || 'Failed to fetch live CRM metrics.');
        }
      }
    } catch (err: any) {
      if (activePortalQueryRef.current === portalId) {
        setUnifiedMetrics(null);
        setMetricsError(err.message || 'Network error fetching metrics.');
      }
    } finally {
      if (activePortalQueryRef.current === portalId) {
        setIsLoadingMetrics(false);
      }
    }
  }, []);

  // Fetch Live Tabular Records (Contacts, Companies, Deals, Pipelines)
  const fetchLiveRecords = useCallback(
    async (portalId: string, objectType: CrmTab, cursor?: string) => {
      if (!portalId) {
        setTabRecords([]);
        return;
      }
      activePortalQueryRef.current = portalId;
      setIsLoadingRecords(true);
      setTabError(null);

      try {
        const queryParams = new URLSearchParams({
          portalId,
          objectType,
          limit: '15',
        });
        if (cursor) {
          queryParams.append('after', cursor);
        }

        const res = await fetch(`/api/hubspot/records?${queryParams.toString()}`);
        if (activePortalQueryRef.current !== portalId) return; // Race condition check

        const data = await res.json();
        if (res.ok && data.success) {
          setTabRecords(data.results || []);
          setTabPaging(data.paging);
          if (data.owners) {
            setTabOwners(data.owners);
          }
        } else {
          setTabRecords([]);
          setTabPaging(undefined);
          setTabError(data.message || data.error || `Unable to retrieve ${objectType}.`);
        }
      } catch (err: any) {
        if (activePortalQueryRef.current === portalId) {
          setTabRecords([]);
          setTabPaging(undefined);
          setTabError(err.message || 'Failed to connect to HubSpot API.');
        }
      } finally {
        if (activePortalQueryRef.current === portalId) {
          setIsLoadingRecords(false);
        }
      }
    },
    []
  );

  // Trigger metrics and record fetch whenever active portal or tab changes
  useEffect(() => {
    if (selectedPortalId) {
      fetchLiveMetrics(selectedPortalId);
      setCurrentCursor(undefined);
      setPageCursorHistory([]);
      fetchLiveRecords(selectedPortalId, activeTab);
    }
  }, [selectedPortalId, fetchLiveMetrics]);

  useEffect(() => {
    if (selectedPortalId) {
      setCurrentCursor(undefined);
      setPageCursorHistory([]);
      fetchLiveRecords(selectedPortalId, activeTab);
    }
  }, [activeTab, selectedPortalId, fetchLiveRecords]);

  // Handle account selection
  const handleSelectAccount = async (targetPortalId: string) => {
    setIsDropdownOpen(false);
    if (targetPortalId === selectedPortalId) return;

    // Immediately clear previous account data to prevent cross-account display
    setSelectedPortalId(targetPortalId);
    setUnifiedMetrics(null);
    setTabRecords([]);
    setTabPaging(undefined);
    setMetricsError(null);
    setTabError(null);

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

      setSyncNotice(`Active account switched to ${targetAccount?.portalName || `#${targetPortalId}`}.`);
      setTimeout(() => setSyncNotice(null), 3500);
    } catch {
      // Silent error fallback
    }
  };

  // Manual Refresh
  const handleRefresh = async () => {
    if (!selectedPortalId || isRefreshing) return;
    setIsRefreshing(true);
    await Promise.all([
      fetchConnections(),
      fetchLiveMetrics(selectedPortalId),
      fetchLiveRecords(selectedPortalId, activeTab, currentCursor),
    ]);
    setIsRefreshing(false);
    setSyncNotice('Account data refreshed from HubSpot API.');
    setTimeout(() => setSyncNotice(null), 3000);
  };

  // Disconnect Account
  const handleDisconnect = async (portalIdToDisconnect: string) => {
    if (!confirm(`Are you sure you want to disconnect HubSpot Account #${portalIdToDisconnect}?`)) {
      return;
    }

    try {
      const res = await fetch('/api/hubspot/connections', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'disconnect',
          portalId: portalIdToDisconnect,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setSyncNotice(`Disconnected portal #${portalIdToDisconnect}.`);
        setTimeout(() => setSyncNotice(null), 4000);
        await fetchConnections();
        if (data.nextActivePortalId) {
          handleSelectAccount(data.nextActivePortalId);
        } else {
          setSelectedPortalId('');
          setUnifiedMetrics(null);
          setTabRecords([]);
        }
      }
    } catch (err: any) {
      setSyncNotice(`Failed to disconnect: ${err.message}`);
    }
  };

  // Pagination Handlers
  const handleNextPage = () => {
    if (tabPaging?.next?.after && selectedPortalId) {
      const nextCursor = tabPaging.next.after;
      setPageCursorHistory((prev) => [...prev, currentCursor || '']);
      setCurrentCursor(nextCursor);
      fetchLiveRecords(selectedPortalId, activeTab, nextCursor);
    }
  };

  const handlePrevPage = () => {
    if (pageCursorHistory.length > 0 && selectedPortalId) {
      const prevCursors = [...pageCursorHistory];
      const prevCursor = prevCursors.pop();
      setPageCursorHistory(prevCursors);
      const targetCursor = prevCursor === '' ? undefined : prevCursor;
      setCurrentCursor(targetCursor);
      fetchLiveRecords(selectedPortalId, activeTab, targetCursor);
    }
  };

  // Direct Manual Add
  const handleAddManualPortal = async (e: React.FormEvent) => {
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
          portalName: manualPortalName.trim() || `HubSpot Account #${manualPortalId.trim()}`,
          accessToken: manualToken.trim() || undefined,
          connectedUser: manualUser.trim() || 'Authorized User',
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setIsConnectModalOpen(false);
        setManualPortalId('');
        setManualPortalName('');
        setManualToken('');
        setManualUser('');
        await fetchConnections();
        handleSelectAccount(data.portalId);
        setSyncNotice(`Added and activated HubSpot Portal #${data.portalId}.`);
        setTimeout(() => setSyncNotice(null), 4000);
      } else {
        const err = await res.json();
        alert(err.message || 'Failed to add connection.');
      }
    } catch (err: any) {
      alert(`Error: ${err.message}`);
    } finally {
      setIsAddingManual(false);
    }
  };

  const formatCurrency = (val: number | null | undefined) => {
    if (val == null) return '$0';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(val);
  };

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return '—';
    try {
      return new Date(dateStr).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      });
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {syncNotice && (
        <div className="flex items-center gap-2 p-3 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-sm rounded-xl animate-fade-in shadow-lg">
          <Check className="w-4 h-4 shrink-0" />
          <span>{syncNotice}</span>
        </div>
      )}

      {/* A. PAGE HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/5">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Connected HubSpot Accounts</h1>
          <p className="text-sm text-slate-400 mt-1">
            Manage your HubSpot connections and view live CRM data.
          </p>
        </div>
        <button
          onClick={() => setIsConnectModalOpen(true)}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-500 text-white text-sm font-medium transition shadow-lg shadow-orange-600/20 active:scale-95"
        >
          <Plus className="w-4 h-4" />
          <span>Connect HubSpot Account</span>
        </button>
      </div>

      {/* B. ACCOUNT SELECTOR & CONTROLS */}
      <div className="bg-[#0F1626] border border-white/10 rounded-2xl p-5 shadow-xl">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          {/* Custom Account Dropdown */}
          <div className="relative flex-1 max-w-xl">
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
              Active HubSpot Account
            </label>
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="w-full flex items-center justify-between gap-3 px-4 py-3 bg-[#090D16] border border-white/10 hover:border-white/20 rounded-xl text-left transition focus:outline-none focus:ring-2 focus:ring-orange-500/40"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-9 h-9 rounded-lg bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-orange-400 shrink-0">
                  <Building className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <div className="text-sm font-semibold text-white truncate">
                    {activeConnection?.portalName || (selectedPortalId ? `HubSpot Account #${selectedPortalId}` : (isLoading ? 'Loading connections...' : 'No Account Selected'))}
                  </div>
                  <div className="text-xs text-slate-400 flex items-center gap-2 mt-0.5">
                    <span>Portal ID: {selectedPortalId || '—'}</span>
                    {(activeConnection || selectedPortalId) && (
                      <span
                        className={`inline-flex items-center px-1.5 py-0.2 rounded text-[10px] font-medium ${
                          activeConnection?.status === 'CONNECTED' || (!activeConnection && unifiedMetrics !== null)
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                            : activeConnection?.status === 'NEEDS_REAUTH'
                            ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                            : 'bg-red-500/10 text-red-400 border border-red-500/20'
                        }`}
                      >
                        {activeConnection?.status === 'CONNECTED' || (!activeConnection && unifiedMetrics !== null)
                          ? 'CONNECTED'
                          : activeConnection?.status === 'NEEDS_REAUTH'
                          ? 'NEEDS REAUTH'
                          : 'DISCONNECTED'}
                      </span>
                    )}
                  </div>
                </div>
              </div>
              <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
            </button>

            {/* Dropdown Menu */}
            {isDropdownOpen && (
              <div className="absolute top-full left-0 right-0 mt-2 z-50 bg-[#0C121E] border border-white/15 rounded-xl shadow-2xl overflow-hidden py-1 divide-y divide-white/5">
                {connections.length === 0 ? (
                  <div className="p-4 text-center text-xs text-slate-400">
                    No connected HubSpot accounts. Click &quot;Connect HubSpot Account&quot; to add one.
                  </div>
                ) : (
                  connections.map((c) => {
                    const isSelected = c.portalId === selectedPortalId;
                    return (
                      <div
                        key={c.portalId}
                        onClick={() => handleSelectAccount(c.portalId)}
                        className={`flex items-center justify-between px-4 py-3 cursor-pointer transition ${
                          isSelected ? 'bg-orange-500/10' : 'hover:bg-white/5'
                        }`}
                      >
                        <div className="min-w-0 pr-3">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-medium text-white truncate">{c.portalName}</span>
                            {isSelected && (
                              <span className="px-1.5 py-0.5 rounded text-[10px] bg-orange-500/20 text-orange-400 font-semibold border border-orange-500/30">
                                ACTIVE
                              </span>
                            )}
                          </div>
                          <div className="text-xs text-slate-400 mt-0.5 flex items-center gap-2">
                            <span>Portal #{c.portalId}</span>
                            <span>•</span>
                            <span
                              className={
                                c.status === 'CONNECTED'
                                  ? 'text-emerald-400'
                                  : c.status === 'NEEDS_REAUTH'
                                  ? 'text-amber-400'
                                  : 'text-red-400'
                              }
                            >
                              {c.status === 'CONNECTED'
                                ? 'Connected'
                                : c.status === 'NEEDS_REAUTH'
                                ? 'Needs Reauth'
                                : 'Disconnected'}
                            </span>
                          </div>
                        </div>
                        {isSelected && <Check className="w-4 h-4 text-orange-400 shrink-0" />}
                      </div>
                    );
                  })
                )}
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2 self-end lg:self-center">
            <button
              onClick={handleRefresh}
              disabled={isRefreshing || !selectedPortalId}
              className="inline-flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white text-xs font-medium transition border border-white/5 disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
              <span>Refresh Data</span>
            </button>

            {activeConnection && (
              <button
                onClick={() => handleDisconnect(activeConnection.portalId)}
                className="inline-flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 hover:text-red-300 text-xs font-medium transition border border-red-500/20"
              >
                <span>Disconnect</span>
              </button>
            )}
          </div>
        </div>

        {/* C. SELECTED ACCOUNT COMPACT OVERVIEW */}
        {activeConnection && (
          <div className="mt-5 pt-4 border-t border-white/5 grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div>
              <div className="text-[11px] font-medium uppercase tracking-wider text-slate-400">Account Name</div>
              <div className="text-sm font-semibold text-white mt-1 truncate">{activeConnection.portalName}</div>
            </div>
            <div>
              <div className="text-[11px] font-medium uppercase tracking-wider text-slate-400">Portal ID</div>
              <div className="text-sm font-semibold text-white mt-1 flex items-center gap-1.5">
                <span>#{activeConnection.portalId}</span>
                <a
                  href={`https://${activeConnection.hubspotDomain}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-slate-400 hover:text-orange-400 transition"
                  title="Open in HubSpot"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
            <div>
              <div className="text-[11px] font-medium uppercase tracking-wider text-slate-400">Connection Status</div>
              <div className="text-sm font-semibold mt-1 flex items-center gap-1.5">
                <span
                  className={`w-2 h-2 rounded-full ${
                    activeConnection.status === 'CONNECTED'
                      ? 'bg-emerald-500'
                      : activeConnection.status === 'NEEDS_REAUTH'
                      ? 'bg-amber-500'
                      : 'bg-red-500'
                  }`}
                />
                <span
                  className={
                    activeConnection.status === 'CONNECTED'
                      ? 'text-emerald-400'
                      : activeConnection.status === 'NEEDS_REAUTH'
                      ? 'text-amber-400'
                      : 'text-red-400'
                  }
                >
                  {activeConnection.status === 'CONNECTED'
                    ? 'Connected (Live)'
                    : activeConnection.status === 'NEEDS_REAUTH'
                    ? 'Needs Re-authorization'
                    : 'Disconnected'}
                </span>
              </div>
            </div>
            <div>
              <div className="text-[11px] font-medium uppercase tracking-wider text-slate-400">Last Successful Sync</div>
              <div className="text-sm font-medium text-slate-300 mt-1 truncate">
                {activeConnection.lastSuccessfulCheck || 'Just now'}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Warning if account needs re-authentication */}
      {activeConnection?.status === 'NEEDS_REAUTH' && (
        <div className="flex items-start justify-between gap-4 p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-sm">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 shrink-0 text-amber-400 mt-0.5" />
            <div>
              <div className="font-semibold text-amber-300">Action Required: Reconnect HubSpot Account</div>
              <div className="text-xs text-amber-400/80 mt-1">
                Account #{activeConnection.portalId} does not have active OAuth tokens. Please authorize it with HubSpot to view live contacts, companies, and deals.
              </div>
            </div>
          </div>
          <button
            onClick={() => (window.location.href = '/api/integrations/hubspot/mcp/authorize')}
            className="px-3.5 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-semibold text-xs whitespace-nowrap transition active:scale-95"
          >
            Authorize with HubSpot
          </button>
        </div>
      )}

      {/* D. LIVE CRM OVERVIEW (6 CLEAN METRIC CARDS) */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-base font-semibold text-white tracking-tight">Live CRM Overview</h2>
          <span className="text-xs text-slate-400">
            Portal ID: <span className="font-mono text-slate-300">#{selectedPortalId || '—'}</span>
          </span>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          {/* 1. Total Contacts */}
          <div className="bg-[#0F1626] border border-white/10 rounded-xl p-4 shadow-md group relative">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-xs font-medium">Total Contacts</span>
              <Users className="w-4 h-4 text-blue-400" />
            </div>
            <div className="text-2xl font-bold text-white mt-2">
              {isLoadingMetrics ? (
                <div className="h-7 w-16 bg-white/5 animate-pulse rounded" />
              ) : unifiedMetrics?.contacts?.status === 'verified' ? (
                unifiedMetrics.contacts.total?.toLocaleString() ?? '0'
              ) : (
                <span className="text-xs text-amber-400 font-normal">
                  {unifiedMetrics?.contacts?.status === 'unavailable' ? 'Unavailable' : 'Needs Reauth'}
                </span>
              )}
            </div>
            <div className="text-[11px] text-slate-400 mt-1 truncate" title={unifiedMetrics?.contacts?.notes || ''}>
              {unifiedMetrics?.contacts?.status === 'verified'
                ? unifiedMetrics.contacts.unassigned != null
                  ? `${unifiedMetrics.contacts.unassigned.toLocaleString()} unassigned`
                  : 'Portal-Wide'
                : 'HubSpot /contacts'}
            </div>
          </div>

          {/* 2. Total Companies */}
          <div className="bg-[#0F1626] border border-white/10 rounded-xl p-4 shadow-md">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-xs font-medium">Companies</span>
              <Building className="w-4 h-4 text-purple-400" />
            </div>
            <div className="text-2xl font-bold text-white mt-2">
              {isLoadingMetrics ? (
                <div className="h-7 w-16 bg-white/5 animate-pulse rounded" />
              ) : unifiedMetrics?.companies?.status === 'verified' ? (
                unifiedMetrics.companies.total?.toLocaleString() ?? '0'
              ) : (
                <span className="text-xs text-amber-400 font-normal">
                  {unifiedMetrics?.companies?.status === 'unavailable' ? 'Unavailable' : 'Needs Reauth'}
                </span>
              )}
            </div>
            <div className="text-[11px] text-slate-400 mt-1">
              {unifiedMetrics?.companies?.status === 'verified' ? 'CRM Accounts' : 'HubSpot /companies'}
            </div>
          </div>

          {/* 3. Total Deals */}
          <div className="bg-[#0F1626] border border-white/10 rounded-xl p-4 shadow-md">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-xs font-medium">Total Deals</span>
              <DollarSign className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="text-2xl font-bold text-white mt-2">
              {isLoadingMetrics ? (
                <div className="h-7 w-16 bg-white/5 animate-pulse rounded" />
              ) : unifiedMetrics?.deals?.status === 'verified' ? (
                unifiedMetrics.deals.total?.toLocaleString() ?? '0'
              ) : (
                <span className="text-xs text-amber-400 font-normal">
                  {unifiedMetrics?.deals?.status === 'unavailable' ? 'Unavailable' : 'Needs Reauth'}
                </span>
              )}
            </div>
            <div className="text-[11px] text-slate-400 mt-1 truncate">
              {unifiedMetrics?.deals?.status === 'verified'
                ? unifiedMetrics.deals.closedWonCount != null
                  ? `${unifiedMetrics.deals.closedWonCount} Won / ${unifiedMetrics.deals.closedLostCount ?? 0} Lost`
                  : 'All Pipelines'
                : 'HubSpot /deals'}
            </div>
          </div>

          {/* 4. Open Deals */}
          <div className="bg-[#0F1626] border border-white/10 rounded-xl p-4 shadow-md">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-xs font-medium">Open Deals</span>
              <TrendingUp className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="text-2xl font-bold text-white mt-2">
              {isLoadingMetrics ? (
                <div className="h-7 w-20 bg-white/5 animate-pulse rounded" />
              ) : unifiedMetrics?.deals?.status === 'verified' ? (
                unifiedMetrics.deals.openCount != null
                  ? unifiedMetrics.deals.openCount.toLocaleString()
                  : '0'
              ) : (
                <span className="text-xs text-amber-400 font-normal">
                  {unifiedMetrics?.deals?.status === 'unavailable' ? 'Unavailable' : 'Needs Reauth'}
                </span>
              )}
            </div>
            <div className="text-[11px] text-slate-400 mt-1 truncate">
              {unifiedMetrics?.deals?.formattedPipelineValue
                ? `${unifiedMetrics.deals.formattedPipelineValue} Pipeline`
                : 'Active pipeline stages'}
            </div>
          </div>

          {/* 5. Total Deal Pipelines */}
          <div className="bg-[#0F1626] border border-white/10 rounded-xl p-4 shadow-md">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-xs font-medium">Deal Pipelines</span>
              <Layers className="w-4 h-4 text-cyan-400" />
            </div>
            <div className="text-2xl font-bold text-white mt-2">
              {isLoadingMetrics ? (
                <div className="h-7 w-12 bg-white/5 animate-pulse rounded" />
              ) : unifiedMetrics?.dealPipelines?.status === 'verified' ? (
                unifiedMetrics.dealPipelines.total ?? '0'
              ) : (
                <span className="text-xs text-slate-400 font-normal">Unavailable</span>
              )}
            </div>
            <div className="text-[11px] text-slate-400 mt-1">
              {unifiedMetrics?.dealPipelines?.totalStages != null
                ? `${unifiedMetrics.dealPipelines.totalStages} Total Stages`
                : 'Pipeline schema'}
            </div>
          </div>

          {/* 6. Active Workflows */}
          <div className="bg-[#0F1626] border border-white/10 rounded-xl p-4 shadow-md">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-xs font-medium">Workflows</span>
              <Workflow className="w-4 h-4 text-amber-400" />
            </div>
            <div className="text-2xl font-bold text-white mt-2">
              {isLoadingMetrics ? (
                <div className="h-7 w-12 bg-white/5 animate-pulse rounded" />
              ) : unifiedMetrics?.workflows?.status === 'verified' ? (
                (unifiedMetrics.workflows.active ?? unifiedMetrics.workflows.total) ?? '0'
              ) : (
                <span className="text-xs text-slate-400 font-normal">
                  {unifiedMetrics?.workflows?.status === 'permission_denied' ? 'Scope Limited' : 'Unavailable'}
                </span>
              )}
            </div>
            <div className="text-[11px] text-slate-400 mt-1">
              {unifiedMetrics?.workflows?.status === 'permission_denied' ? 'OAuth Scope Limited' : 'Automation Hub'}
            </div>
          </div>
        </div>
      </div>

      {/* E. CRM DATA TABS (Contacts | Companies | Deals | Pipelines) */}
      <div className="bg-[#0F1626] border border-white/10 rounded-2xl p-5 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/5 pb-4">
          <div className="flex items-center gap-2">
            {(['contacts', 'companies', 'deals', 'pipelines'] as CrmTab[]).map((tab) => {
              const isActive = activeTab === tab;
              return (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-medium capitalize transition ${
                    isActive
                      ? 'bg-orange-500 text-white shadow-md shadow-orange-500/20'
                      : 'bg-white/5 text-slate-400 hover:text-white hover:bg-white/10'
                  }`}
                >
                  {tab}
                </button>
              );
            })}
          </div>

          {/* Pagination Controls */}
          <div className="flex items-center gap-2 text-xs text-slate-400 self-end sm:self-center">
            {pageCursorHistory.length > 0 && (
              <button
                onClick={handlePrevPage}
                disabled={isLoadingRecords}
                className="px-2.5 py-1 rounded bg-white/5 hover:bg-white/10 text-white transition disabled:opacity-50"
              >
                Previous
              </button>
            )}
            {tabPaging?.next?.after && (
              <button
                onClick={handleNextPage}
                disabled={isLoadingRecords}
                className="px-2.5 py-1 rounded bg-white/5 hover:bg-white/10 text-white transition disabled:opacity-50"
              >
                Next Page
              </button>
            )}
          </div>
        </div>

        {/* Tab Content Display */}
        <div className="mt-4">
          {isLoadingRecords ? (
            <div className="py-12 flex flex-col items-center justify-center text-slate-400 text-sm gap-3">
              <RefreshCw className="w-6 h-6 animate-spin text-orange-400" />
              <span>Fetching live {activeTab} from HubSpot portal #{selectedPortalId}...</span>
            </div>
          ) : tabError ? (
            <div className="py-10 px-4 text-center">
              <AlertCircle className="w-8 h-8 text-amber-400 mx-auto mb-2 opacity-80" />
              <div className="text-sm font-semibold text-slate-300">Data Unavailable for this Account</div>
              <div className="text-xs text-slate-400 mt-1 max-w-md mx-auto">{tabError}</div>
              {activeConnection?.status === 'NEEDS_REAUTH' && (
                <button
                  onClick={() => (window.location.href = '/api/integrations/hubspot/mcp/authorize')}
                  className="mt-4 px-4 py-2 rounded-xl bg-orange-600 hover:bg-orange-500 text-white text-xs font-semibold transition"
                >
                  Reconnect Account
                </button>
              )}
            </div>
          ) : tabRecords.length === 0 ? (
            <div className="py-12 text-center text-sm text-slate-400">
              No {activeTab} found in this HubSpot portal.
            </div>
          ) : (
            <div className="overflow-x-auto">
              {/* TAB 1: CONTACTS */}
              {activeTab === 'contacts' && (
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#090D16] text-slate-400 uppercase tracking-wider font-semibold border-b border-white/5">
                    <tr>
                      <th className="py-3 px-4">Contact Name</th>
                      <th className="py-3 px-4">Email</th>
                      <th className="py-3 px-4">Contact Owner</th>
                      <th className="py-3 px-4">Create Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5 text-slate-300">
                    {tabRecords.map((c) => (
                      <tr key={c.id} className="hover:bg-white/[0.02] transition">
                        <td className="py-3 px-4 font-medium text-white">{c.name}</td>
                        <td className="py-3 px-4 text-slate-400 font-mono text-[11px]">{c.email}</td>
                        <td className="py-3 px-4">{c.owner}</td>
                        <td className="py-3 px-4 text-slate-400">{formatDate(c.createdAt)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}

              {/* TAB 2: COMPANIES */}
              {activeTab === 'companies' && (
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#090D16] text-slate-400 uppercase tracking-wider font-semibold border-b border-white/5">
                    <tr>
                      <th className="py-3 px-4">Company Name</th>
                      <th className="py-3 px-4">Domain</th>
                      <th className="py-3 px-4">Company Owner</th>
                      <th className="py-3 px-4">Create Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5 text-slate-300">
                    {tabRecords.map((co) => (
                      <tr key={co.id} className="hover:bg-white/[0.02] transition">
                        <td className="py-3 px-4 font-medium text-white">{co.name}</td>
                        <td className="py-3 px-4 text-slate-400 font-mono text-[11px]">{co.domain}</td>
                        <td className="py-3 px-4">{co.owner}</td>
                        <td className="py-3 px-4 text-slate-400">{formatDate(co.createdAt)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}

              {/* TAB 3: DEALS */}
              {activeTab === 'deals' && (
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#090D16] text-slate-400 uppercase tracking-wider font-semibold border-b border-white/5">
                    <tr>
                      <th className="py-3 px-4">Deal Name</th>
                      <th className="py-3 px-4">Amount</th>
                      <th className="py-3 px-4">Pipeline</th>
                      <th className="py-3 px-4">Stage</th>
                      <th className="py-3 px-4">Deal Owner</th>
                      <th className="py-3 px-4">Create Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5 text-slate-300">
                    {tabRecords.map((d) => (
                      <tr key={d.id} className="hover:bg-white/[0.02] transition">
                        <td className="py-3 px-4 font-medium text-white">{d.dealname}</td>
                        <td className="py-3 px-4 font-semibold text-emerald-400">
                          {d.amount != null ? formatCurrency(d.amount) : '—'}
                        </td>
                        <td className="py-3 px-4 text-slate-400">{d.pipeline}</td>
                        <td className="py-3 px-4">
                          <span className="inline-flex px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20 text-[11px]">
                            {d.dealstage}
                          </span>
                        </td>
                        <td className="py-3 px-4">{d.owner}</td>
                        <td className="py-3 px-4 text-slate-400">{formatDate(d.createdAt)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}

              {/* TAB 4: PIPELINES */}
              {activeTab === 'pipelines' && (
                <div className="space-y-4 py-2">
                  {tabRecords.map((p) => (
                    <div key={p.id} className="p-4 bg-[#090D16] border border-white/5 rounded-xl">
                      <div className="flex items-center justify-between pb-3 border-b border-white/5">
                        <div className="font-semibold text-white text-sm">{p.label}</div>
                        <span className="text-xs text-slate-400 font-mono">ID: {p.id}</span>
                      </div>
                      <div className="mt-3 flex flex-wrap gap-2">
                        {(p.stages || []).map((stage: any, idx: number) => (
                          <div
                            key={stage.id}
                            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 border border-white/5 text-xs text-slate-300"
                          >
                            <span className="w-4 h-4 rounded-full bg-orange-500/20 text-orange-400 flex items-center justify-center text-[10px] font-bold">
                              {stage.displayOrder != null ? stage.displayOrder + 1 : idx + 1}
                            </span>
                            <span className="font-medium">{stage.label}</span>
                            {stage.probability != null && (
                              <span className="text-slate-400 text-[10px]">({Math.round(stage.probability * 100)}%)</span>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* CONNECT HUBSPOT ACCOUNT MODAL */}
      {isConnectModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="bg-[#0F1626] border border-white/10 rounded-2xl w-full max-w-md p-6 shadow-2xl relative">
            <button
              onClick={() => setIsConnectModalOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-white/5 transition"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-lg font-bold text-white tracking-tight">Connect HubSpot Account</h3>
            <p className="text-xs text-slate-400 mt-1">
              Connect any HubSpot portal dynamically via Official OAuth 2.0 or Direct Token.
            </p>

            <div className="flex rounded-xl bg-[#090D16] p-1 border border-white/10 mt-4">
              <button
                type="button"
                onClick={() => setConnectTab('OAUTH')}
                className={`flex-1 py-2 text-xs font-semibold rounded-lg transition ${
                  connectTab === 'OAUTH'
                    ? 'bg-orange-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                HubSpot OAuth 2.0
              </button>
              <button
                type="button"
                onClick={() => setConnectTab('DIRECT')}
                className={`flex-1 py-2 text-xs font-semibold rounded-lg transition ${
                  connectTab === 'DIRECT'
                    ? 'bg-orange-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Direct Portal Connect
              </button>
            </div>

            {connectTab === 'OAUTH' ? (
              <div className="mt-5 space-y-4">
                <div className="p-3.5 bg-white/5 rounded-xl border border-white/5 text-xs text-slate-300 space-y-2">
                  <div className="flex items-center gap-2 text-orange-400 font-semibold">
                    <ShieldCheck className="w-4 h-4" />
                    <span>Official HubSpot App Authorization</span>
                  </div>
                  <p className="text-slate-400 text-[11px] leading-relaxed">
                    Authenticate via HubSpot&apos;s standard OAuth flow with PKCE S256 encryption. You can choose which portal from your HubSpot account to authorize.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => (window.location.href = '/api/integrations/hubspot/mcp/authorize')}
                  className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-orange-600 hover:bg-orange-500 text-white text-sm font-semibold transition shadow-lg shadow-orange-600/20 active:scale-95"
                >
                  <span>Authorize with HubSpot OAuth</span>
                  <ExternalLink className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <form onSubmit={handleAddManualPortal} className="mt-4 space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">
                    HubSpot Portal ID <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 39611297"
                    value={manualPortalId}
                    onChange={(e) => setManualPortalId(e.target.value)}
                    className="w-full px-3 py-2 bg-[#090D16] border border-white/10 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-orange-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">Account Display Name</label>
                  <input
                    type="text"
                    placeholder="e.g. HuboExperts Production"
                    value={manualPortalName}
                    onChange={(e) => setManualPortalName(e.target.value)}
                    className="w-full px-3 py-2 bg-[#090D16] border border-white/10 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-orange-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">
                    Access Token / Private App Token (PAT)
                  </label>
                  <input
                    type="password"
                    placeholder="pat-na1-... or access token"
                    value={manualToken}
                    onChange={(e) => setManualToken(e.target.value)}
                    className="w-full px-3 py-2 bg-[#090D16] border border-white/10 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-orange-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">Authorized User Email</label>
                  <input
                    type="email"
                    placeholder="e.g. user@company.com"
                    value={manualUser}
                    onChange={(e) => setManualUser(e.target.value)}
                    className="w-full px-3 py-2 bg-[#090D16] border border-white/10 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-orange-500"
                  />
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isAddingManual}
                    className="w-full py-2.5 px-4 rounded-xl bg-orange-600 hover:bg-orange-500 text-white text-sm font-semibold transition disabled:opacity-50"
                  >
                    {isAddingManual ? 'Connecting...' : 'Connect Portal'}
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
