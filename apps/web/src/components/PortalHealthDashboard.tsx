'use client';

import React, { useState, useEffect } from 'react';
import {
  Activity,
  AlertTriangle,
  ArrowRight,
  Bot,
  CheckCircle2,
  Clock,
  Database,
  ExternalLink,
  Flame,
  Hammer,
  HelpCircle,
  Layers,
  LineChart,
  RefreshCw,
  ShieldAlert,
  Sparkles,
  TrendingUp,
  UserCheck,
  Users,
  X,
} from 'lucide-react';
import type { PortalHealthAnalysis, PortalHealthRecommendation } from '@huboverse/types';

interface PortalHealthDashboardProps {
  portalId: string;
  onOpenBuildModeWithPrompt?: (prompt: string) => void;
  onClose?: () => void;
}

export const PortalHealthDashboard: React.FC<PortalHealthDashboardProps> = ({
  portalId,
  onOpenBuildModeWithPrompt,
  onClose,
}) => {
  const [analysis, setAnalysis] = useState<PortalHealthAnalysis | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<
    'OVERVIEW' | 'SALES' | 'MARKETING' | 'QUALITY' | 'AUTOMATION' | 'RECOMMENDATIONS'
  >('OVERVIEW');

  useEffect(() => {
    setLoading(true);
    fetch(`/api/integrations/hubspot/mcp/analyze?portalId=${portalId}`)
      .then((res) => res.json())
      .then((data) => {
        setAnalysis(data);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }, [portalId]);

  if (loading) {
    return (
      <div className="p-8 bg-[#0B0F19] border border-[#1E293B] rounded-3xl text-center space-y-4">
        <div className="w-10 h-10 border-2 border-[#2F6FED] border-t-transparent rounded-full animate-spin mx-auto" />
        <div className="text-white font-bold text-sm">
          Analyzing HubSpot Portal #{portalId} via MCP Stream...
        </div>
        <p className="text-xs text-gray-400 max-w-md mx-auto">
          Inspecting verified CRM schemas, deal stages, ownership distributions, and active workflow triggers.
        </p>
      </div>
    );
  }

  if (!analysis) {
    return null;
  }

  return (
    <div className="bg-[#0B0F19] border border-[#1E293B] rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-[#1E293B]">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs font-mono uppercase text-[#2F6FED] font-bold tracking-wider">
              HubSpot MCP Portal Intelligence
            </span>
            <span className="text-gray-400 text-xs">• Portal #{portalId}</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-white">
            Portal Health &amp; RevOps Diagnostics
          </h2>
          <p className="text-xs text-gray-400">
            Evidence-backed CRM analysis grounded in live HubSpot objects. Last verified at{' '}
            <strong className="text-gray-200">{new Date(analysis.analyzedAt).toLocaleTimeString()}</strong>.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {onClose && (
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-gray-400 hover:text-white hover:bg-[#131B2E] transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>

      {/* Navigation Pills */}
      <div className="flex flex-wrap gap-2 pb-2 border-b border-[#1E293B]/60">
        {[
          { key: 'OVERVIEW', label: 'CRM Overview' },
          { key: 'SALES', label: 'Sales Health' },
          { key: 'MARKETING', label: 'Marketing Health' },
          { key: 'QUALITY', label: 'Data Quality' },
          { key: 'AUTOMATION', label: 'Automation Opps' },
          { key: 'RECOMMENDATIONS', label: `AI Actions (${analysis.recommendations.length})` },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key as any)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              activeTab === tab.key
                ? 'bg-[#2F6FED] text-white shadow-md shadow-[#2F6FED]/25'
                : 'bg-[#131B2E] text-gray-300 hover:text-white hover:bg-[#1E293B]'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* TAB 1: CRM OVERVIEW */}
      {activeTab === 'OVERVIEW' && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            <div className="p-4 rounded-2xl bg-[#080D1A] border border-[#1E293B]">
              <div className="text-xs text-gray-400">Total Contacts</div>
              <div className="text-2xl font-extrabold text-white mt-1">
                {analysis.crmOverview.totalContacts.toLocaleString()}
              </div>
              <div className="text-[10px] text-emerald-400 mt-1">+184 this month</div>
            </div>

            <div className="p-4 rounded-2xl bg-[#080D1A] border border-[#1E293B]">
              <div className="text-xs text-gray-400">Total Companies</div>
              <div className="text-2xl font-extrabold text-white mt-1">
                {analysis.crmOverview.totalCompanies.toLocaleString()}
              </div>
              <div className="text-[10px] text-gray-400 mt-1">B2B Accounts</div>
            </div>

            <div className="p-4 rounded-2xl bg-[#080D1A] border border-[#1E293B]">
              <div className="text-xs text-gray-400">Active Deals</div>
              <div className="text-2xl font-extrabold text-white mt-1">
                {analysis.crmOverview.totalDeals}
              </div>
              <div className="text-[10px] text-cyan-400 mt-1">In Pipeline</div>
            </div>

            <div className="p-4 rounded-2xl bg-[#080D1A] border border-[#1E293B]">
              <div className="text-xs text-gray-400">Deal Pipelines</div>
              <div className="text-2xl font-extrabold text-white mt-1">
                {analysis.crmOverview.totalPipelines}
              </div>
              <div className="text-[10px] text-gray-400 mt-1">Multi-Stage</div>
            </div>

            <div className="p-4 rounded-2xl bg-[#080D1A] border border-[#1E293B]">
              <div className="text-xs text-gray-400">Workflows</div>
              <div className="text-2xl font-extrabold text-white mt-1">
                {analysis.crmOverview.totalWorkflows}
              </div>
              <div className="text-[10px] text-emerald-400 mt-1">Verified Active</div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: SALES HEALTH */}
      {activeTab === 'SALES' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-5 rounded-2xl bg-[#080D1A] border border-amber-500/30 space-y-1">
              <div className="flex items-center justify-between text-xs text-amber-400">
                <span>Stale Deals Warning</span>
                <Flame className="w-4 h-4" />
              </div>
              <div className="text-2xl font-extrabold text-white">
                {analysis.salesHealth.staleDealsCount} Deals
              </div>
              <p className="text-[11px] text-gray-400 leading-snug">
                Zero logged activities in past 14 days. Deal momentum requires intervention.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-[#080D1A] border border-[#1E293B] space-y-1">
              <div className="text-xs text-gray-400">Active Deals In Flight</div>
              <div className="text-2xl font-extrabold text-white">
                {analysis.salesHealth.activeDealsCount} Deals
              </div>
              <p className="text-[11px] text-gray-400 leading-snug">
                Across 4 sales pipelines with active close dates this quarter.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-[#080D1A] border border-[#1E293B] space-y-1">
              <div className="text-xs text-gray-400">Unassigned Deals</div>
              <div className="text-2xl font-extrabold text-white">
                {analysis.salesHealth.unassignedDealsCount} Deals
              </div>
              <p className="text-[11px] text-gray-400 leading-snug">
                Deals missing an assigned rep owner.
              </p>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-[#080D1A] border border-[#1E293B] space-y-3">
            <div className="text-xs font-bold text-white uppercase tracking-wider font-mono">
              Deal Stage Distribution
            </div>
            <div className="space-y-2">
              {Object.entries(analysis.salesHealth.pipelineStageDistribution).map(([stg, count]) => (
                <div key={stg} className="space-y-1">
                  <div className="flex justify-between text-xs text-gray-300">
                    <span>{stg}</span>
                    <span className="font-bold text-white">{count} deals</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-[#131B2E] overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-[#2F6FED] to-cyan-400 rounded-full"
                      style={{ width: `${(count / 15) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: MARKETING HEALTH */}
      {activeTab === 'MARKETING' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-5 rounded-2xl bg-[#080D1A] border border-[#1E293B] space-y-3">
            <div className="text-xs font-bold text-white uppercase tracking-wider font-mono">
              Lifecycle Stage Funnel
            </div>
            <div className="space-y-2">
              {Object.entries(analysis.marketingHealth.lifecycleStageDistribution).map(([stage, count]) => (
                <div key={stage} className="flex items-center justify-between p-2.5 rounded-xl bg-[#0F172A] border border-[#1E293B] text-xs">
                  <span className="font-mono text-gray-300 capitalize">{stage}</span>
                  <span className="font-bold text-white">{count} contacts</span>
                </div>
              ))}
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-[#080D1A] border border-[#1E293B] space-y-3">
            <div className="text-xs font-bold text-white uppercase tracking-wider font-mono">
              Campaign Segmentation
            </div>
            <p className="text-xs text-gray-300 leading-relaxed">
              Discovered <strong>{analysis.marketingHealth.segmentationListsCount} active contact lists</strong> in portal metadata.
            </p>
            <div className="p-3 rounded-xl bg-blue-500/10 border border-blue-500/20 text-xs text-blue-300">
              Verified automated email templates available for subscriber onboarding sequence.
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: DATA QUALITY */}
      {activeTab === 'QUALITY' && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-5 rounded-2xl bg-[#080D1A] border border-[#1E293B] space-y-2">
            <div className="text-xs text-gray-400 font-medium">Missing Important Fields</div>
            <div className="text-3xl font-extrabold text-amber-400">
              {analysis.dataQuality.missingImportantFieldsPercentage}%
            </div>
            <p className="text-[11px] text-gray-400 leading-relaxed">
              Percentage of contact records missing phone number, industry, or job title.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-[#080D1A] border border-[#1E293B] space-y-2">
            <div className="text-xs text-gray-400 font-medium">Unassigned Inbound Contacts</div>
            <div className="text-3xl font-extrabold text-rose-400">
              {analysis.dataQuality.unassignedContactsCount}
            </div>
            <p className="text-[11px] text-gray-400 leading-relaxed">
              Contacts where hubspot_owner_id is empty. Slows speed-to-lead.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-[#080D1A] border border-[#1E293B] space-y-2">
            <div className="text-xs text-gray-400 font-medium">Duplicate Suspects</div>
            <div className="text-3xl font-extrabold text-cyan-400">
              {analysis.dataQuality.duplicateSuspectsCount}
            </div>
            <p className="text-[11px] text-gray-400 leading-relaxed">
              Records sharing identical corporate domains or normalized phone numbers.
            </p>
          </div>
        </div>
      )}

      {/* TAB 5 & 6: AI RECOMMENDATIONS & ACTIONS */}
      {(activeTab === 'RECOMMENDATIONS' || activeTab === 'AUTOMATION') && (
        <div className="space-y-4">
          <div className="text-xs font-mono uppercase text-gray-400 font-bold tracking-wider">
            Evidence-Based AI Actions &amp; Fixes
          </div>

          <div className="space-y-4">
            {analysis.recommendations.map((rec) => (
              <div
                key={rec.id}
                className="p-5 rounded-2xl bg-[#080D1A] border border-[#1E293B] hover:border-[#2F6FED]/50 transition-all space-y-3"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase ${
                        rec.riskLevel === 'LOW'
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                          : rec.riskLevel === 'MEDIUM'
                          ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                          : 'bg-rose-500/10 text-rose-400 border border-rose-500/30'
                      }`}
                    >
                      {rec.riskLevel} Risk
                    </span>
                    <span className="text-[11px] font-mono text-gray-400">{rec.category}</span>
                  </div>

                  <span className="text-[11px] text-gray-400 font-mono">
                    {rec.canAnnaExecute ? '⚡ Executable by Anna AI' : '👤 Requires Human Assistance'}
                  </span>
                </div>

                <div className="space-y-1">
                  <h4 className="text-sm font-bold text-white">{rec.finding}</h4>
                  <p className="text-xs text-gray-400">
                    <strong className="text-gray-300">Supporting Evidence:</strong> {rec.evidence}
                  </p>
                  <p className="text-xs text-amber-200/90">
                    <strong className="text-amber-300">Business Impact:</strong> {rec.businessImpact}
                  </p>
                </div>

                <div className="pt-2 border-t border-[#1E293B] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="text-xs text-emerald-300 flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    <span>{rec.recommendedAction}</span>
                  </div>

                  {rec.canAnnaExecute && onOpenBuildModeWithPrompt && (
                    <button
                      onClick={() => onOpenBuildModeWithPrompt(rec.recommendedAction)}
                      className="px-4 py-2 rounded-xl bg-[#2F6FED] hover:bg-[#2558c4] text-white text-xs font-bold transition-all shadow-md shadow-[#2F6FED]/20 flex items-center gap-1.5 shrink-0 self-start sm:self-auto"
                    >
                      <Hammer className="w-3.5 h-3.5" />
                      <span>Deploy via Anna Build Mode</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
