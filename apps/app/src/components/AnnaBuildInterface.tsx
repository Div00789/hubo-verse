import React, { useState } from 'react';
import {
  Hammer,
  ShieldCheck,
  CheckCircle2,
  FileCode,
  ArrowRight,
  ExternalLink,
  RotateCcw,
  Sparkles,
} from 'lucide-react';
import { AnnaBuildExecution } from '@huboverse/types';
import { DEMO_BUILD_EXECUTION, DEMO_HUBSPOT_CONNECTION } from '@huboverse/database';

interface AnnaBuildInterfaceProps {
  initialPrompt?: string;
  onSwitchToChatMode: () => void;
}

export const AnnaBuildInterface: React.FC<AnnaBuildInterfaceProps> = ({
  initialPrompt,
  onSwitchToChatMode,
}) => {
  const [prompt, setPrompt] = useState(
    initialPrompt || 'Create custom property "Lead Readiness Score" on Contacts with range 0 - 100.'
  );
  const [execution, setExecution] = useState<AnnaBuildExecution>(DEMO_BUILD_EXECUTION);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleGenerateDiff = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setExecution({
        ...DEMO_BUILD_EXECUTION,
        id: `bld_${Date.now()}`,
        goal: prompt,
        status: 'AWAITING_APPROVAL',
        diffPreview: [
          {
            path: 'contacts.properties.lead_readiness_score',
            operation: 'CREATE',
            previousValue: null,
            newValue: {
              name: 'lead_readiness_score',
              label: 'Lead Readiness Score',
              type: 'number',
              fieldType: 'number',
              groupName: 'contactinformation',
              min: 0,
              max: 100,
              description: 'Synthesized by Anna Build Mode based on behavioral engagement.',
            },
            description: 'Creates new Contact schema property in HubSpot CRM.',
          },
        ],
      });
    }, 1000);
  };

  const handleApproveAndExecute = () => {
    setIsProcessing(true);
    setExecution((prev) => ({ ...prev, status: 'EXECUTING' }));

    setTimeout(() => {
      setIsProcessing(false);
      setExecution((prev) => ({
        ...prev,
        status: 'SUCCESS',
        approvedByUserId: 'usr_org_admin',
        executionResult: {
          hubspotObjectId: 'hs_prop_8921829',
          details: `Successfully deployed property into HubSpot Portal #${DEMO_HUBSPOT_CONNECTION.portalId}. Schema index updated.`,
          deepLink: `https://app.hubspot.com/settings/${DEMO_HUBSPOT_CONNECTION.portalId}/properties`,
        },
        rollbackSnapshot: {
          action: 'hubspot.properties.create',
          createdProperty: 'lead_readiness_score',
          timestamp: new Date().toISOString(),
        },
        completedAt: new Date().toISOString(),
      }));
    }, 1800);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] bg-[#090D16] overflow-y-auto">
      {/* Top Banner */}
      <div className="px-6 py-2.5 bg-gradient-to-r from-orange-950/40 via-[#0F172A] to-[#0F172A] border-b border-orange-500/20 flex items-center justify-between text-xs">
        <div className="flex items-center gap-2">
          <Hammer className="w-3.5 h-3.5 text-[#FF5C00]" />
          <span className="text-white font-semibold">Anna Build Mode Console</span>
          <span className="text-gray-400">• 4-Stage Safe Execution Pipeline with Dry-Run Verification</span>
        </div>
        <button
          onClick={onSwitchToChatMode}
          className="text-gray-400 hover:text-white transition-colors"
        >
          Return to Chat Mode →
        </button>
      </div>

      <div className="p-6 max-w-5xl mx-auto w-full space-y-6">
        {/* Goal Input Section */}
        <div className="bg-[#0F172A] border border-[#1E293B] rounded-2xl p-5 shadow-xl">
          <div className="flex items-center justify-between mb-3">
            <label className="text-sm font-semibold text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#FF5C00]" />
              <span>Describe the HubSpot CRM Architecture Change</span>
            </label>
            <span className="text-xs text-gray-400">Target: Portal #{DEMO_HUBSPOT_CONNECTION.portalId}</span>
          </div>

          <div className="flex gap-2">
            <input
              type="text"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="e.g. Create custom property 'Lead Readiness Score' on Contacts and an Enterprise Deal Pipeline..."
              className="flex-1 bg-[#131B2E] border border-[#1E293B] rounded-xl px-4 py-2.5 text-sm text-white placeholder-gray-400 focus:outline-none focus:border-[#FF5C00]"
            />
            <button
              onClick={handleGenerateDiff}
              disabled={isProcessing || !prompt.trim()}
              className="px-5 py-2.5 rounded-xl bg-[#1E293B] hover:bg-[#283548] text-white text-xs font-semibold flex items-center gap-2 transition-colors disabled:opacity-50"
            >
              <span>Verify & Diff</span>
              <ArrowRight className="w-3.5 h-3.5 text-[#FF5C00]" />
            </button>
          </div>
        </div>

        {/* 4-Stage Pipeline Tracker */}
        <div className="grid grid-cols-4 gap-3">
          <div className="bg-[#0F172A] border border-emerald-500/30 rounded-xl p-3 flex items-center gap-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
            <div>
              <div className="text-[10px] text-gray-400 uppercase font-mono">Stage 1</div>
              <div className="text-xs font-semibold text-white">Intent Extraction</div>
            </div>
          </div>

          <div className="bg-[#0F172A] border border-emerald-500/30 rounded-xl p-3 flex items-center gap-3">
            <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0" />
            <div>
              <div className="text-[10px] text-gray-400 uppercase font-mono">Stage 2</div>
              <div className="text-xs font-semibold text-white">Capability Verified</div>
            </div>
          </div>

          <div className={`bg-[#0F172A] border rounded-xl p-3 flex items-center gap-3 ${execution.status === 'AWAITING_APPROVAL' || execution.status === 'EXECUTING' || execution.status === 'SUCCESS'
              ? 'border-[#FF5C00]/40'
              : 'border-[#1E293B]'
            }`}>
            <FileCode className="w-5 h-5 text-[#FF5C00] shrink-0" />
            <div>
              <div className="text-[10px] text-gray-400 uppercase font-mono">Stage 3</div>
              <div className="text-xs font-semibold text-white">Dry-Run Schema Diff</div>
            </div>
          </div>

          <div className={`bg-[#0F172A] border rounded-xl p-3 flex items-center gap-3 ${execution.status === 'SUCCESS'
              ? 'border-emerald-500/40 bg-emerald-950/20'
              : 'border-[#1E293B]'
            }`}>
            <Hammer className={`w-5 h-5 shrink-0 ${execution.status === 'SUCCESS' ? 'text-emerald-400' : 'text-gray-400'}`} />
            <div>
              <div className="text-[10px] text-gray-400 uppercase font-mono">Stage 4</div>
              <div className="text-xs font-semibold text-white">
                {execution.status === 'SUCCESS' ? 'Atomic Success' : 'Approval & Exec'}
              </div>
            </div>
          </div>
        </div>

        {/* Capability Registry Scope Verification Box */}
        <div className="bg-[#0F172A] border border-[#1E293B] rounded-2xl p-4 flex items-center justify-between text-xs">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <div className="font-semibold text-white">Action Capability Registry Check Passed</div>
              <div className="text-gray-400 text-[11px] mt-0.5">
                Target Action: <code className="text-[#FF5C00] font-mono">{execution.actionId}</code> • Required Scopes: <code className="text-gray-300">crm.schemas.contacts.write</code> (Granted)
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-bold">
              Risk: {execution.riskLevel}
            </span>
            <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 font-bold">
              Rollback: Supported
            </span>
          </div>
        </div>

        {/* Structural Schema Diff Preview */}
        <div className="bg-[#0B101D] border border-[#1E293B] rounded-2xl overflow-hidden shadow-2xl">
          <div className="px-5 py-3 bg-[#131B2E] border-b border-[#1E293B] flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-semibold text-white">
              <FileCode className="w-4 h-4 text-[#FF5C00]" />
              <span>Dry-Run Structural Schema Diff</span>
            </div>
            <span className="text-[11px] font-mono text-gray-400">1 Proposed Change</span>
          </div>

          <div className="p-5 font-mono text-xs space-y-4">
            {execution.diffPreview.map((diff, index) => (
              <div key={index} className="space-y-2">
                <div className="flex items-center gap-2 text-emerald-400 font-semibold">
                  <span className="px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 text-[10px]">
                    +{diff.operation}
                  </span>
                  <span>{diff.path}</span>
                </div>
                <div className="text-gray-400 text-[11px] font-sans pl-2">
                  {diff.description}
                </div>
                <pre className="p-3 bg-[#090D16] rounded-xl border border-emerald-500/20 text-emerald-300/90 overflow-x-auto text-[11px]">
                  {JSON.stringify(diff.newValue, null, 2)}
                </pre>
              </div>
            ))}
          </div>

          {/* Execution Controls Footer */}
          <div className="px-5 py-4 bg-[#131B2E] border-t border-[#1E293B] flex items-center justify-between">
            <div>
              {execution.status === 'SUCCESS' ? (
                <div className="flex items-center gap-2 text-xs text-emerald-400 font-medium">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{execution.executionResult?.details}</span>
                </div>
              ) : (
                <div className="text-xs text-gray-400">
                  Ready to deploy to HubSpot. Changes are logged to the multi-tenant immutable audit log.
                </div>
              )}
            </div>

            <div className="flex items-center gap-3">
              {execution.status === 'SUCCESS' ? (
                <>
                  <a
                    href={execution.executionResult?.deepLink}
                    target="_blank"
                    rel="noreferrer"
                    className="px-4 py-2 rounded-xl bg-[#1E293B] hover:bg-[#283548] text-white text-xs font-medium flex items-center gap-1.5 transition-colors"
                  >
                    <span>View in HubSpot</span>
                    <ExternalLink className="w-3.5 h-3.5 text-[#FF5C00]" />
                  </a>
                  <button
                    onClick={() => alert('Rollback snapshot initiated. Schema restored to prior version.')}
                    className="px-3 py-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 text-xs font-medium flex items-center gap-1.5 border border-rose-500/30 transition-colors"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Rollback</span>
                  </button>
                </>
              ) : (
                <button
                  onClick={handleApproveAndExecute}
                  disabled={isProcessing}
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#FF5C00] to-[#E04F00] text-white text-xs font-bold hover:opacity-95 transition-all shadow-lg shadow-[#FF5C00]/25 flex items-center gap-2 disabled:opacity-50"
                >
                  {isProcessing ? (
                    <>
                      <Sparkles className="w-3.5 h-3.5 animate-spin" />
                      <span>Applying to HubSpot API...</span>
                    </>
                  ) : (
                    <>
                      <Hammer className="w-3.5 h-3.5" />
                      <span>Approve & Execute into HubSpot</span>
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
