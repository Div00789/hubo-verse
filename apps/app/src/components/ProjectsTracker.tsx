import React from 'react';
import { FolderKanban, CheckCircle2, Clock, Calendar, ShieldCheck } from 'lucide-react';
import { DEMO_PROJECTS } from '@huboverse/database';

export const ProjectsTracker: React.FC = () => {
  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-white">Client Projects & Implementation Roadmaps</h2>
          <p className="text-xs text-gray-400">
            Collaborative initiatives steered by HuboExperts certified consultants and Anna AI.
          </p>
        </div>
        <button className="px-4 py-2 rounded-xl bg-[#1E293B] hover:bg-[#283548] text-white text-xs font-semibold flex items-center gap-1.5 transition-colors border border-[#1E293B]">
          <FolderKanban className="w-3.5 h-3.5 text-[#FF5C00]" />
          <span>New Client Project</span>
        </button>
      </div>

      <div className="space-y-4">
        {DEMO_PROJECTS.map((proj) => (
          <div key={proj.id} className="bg-[#0F172A] border border-[#1E293B] rounded-2xl p-6 shadow-xl">
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-bold text-white">{proj.title}</h3>
                  <span className="px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-400 text-[10px] font-mono font-semibold">
                    {proj.status}
                  </span>
                </div>
                <p className="text-xs text-gray-400 mt-1 max-w-2xl">{proj.description}</p>
              </div>

              <div className="text-right">
                <div className="text-xs text-gray-400">Target Delivery</div>
                <div className="text-xs font-semibold text-white flex items-center gap-1 mt-0.5">
                  <Calendar className="w-3.5 h-3.5 text-[#FF5C00]" />
                  <span>{proj.targetCompletionDate}</span>
                </div>
              </div>
            </div>

            {/* Milestones Checklist */}
            <div className="mt-6 pt-5 border-t border-[#1E293B]">
              <div className="text-xs font-semibold text-gray-300 uppercase tracking-wider text-[10px] mb-3">
                Key Implementation Milestones
              </div>
              <div className="space-y-2">
                <div className="bg-[#131B2E] p-3 rounded-xl border border-[#1E293B] flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span className="text-gray-200">HubSpot Architecture Audit & Duplicate Cleansing</span>
                  </div>
                  <span className="text-[10px] font-mono text-emerald-400">COMPLETED</span>
                </div>

                <div className="bg-[#131B2E] p-3 rounded-xl border border-[#1E293B] flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2.5">
                    <Clock className="w-4 h-4 text-amber-400 shrink-0" />
                    <span className="text-gray-200">Custom Object Association Modeling (Deals & Retainers)</span>
                  </div>
                  <span className="text-[10px] font-mono text-amber-400">IN PROGRESS</span>
                </div>

                <div className="bg-[#131B2E] p-3 rounded-xl border border-[#1E293B] flex items-center justify-between text-xs opacity-60">
                  <div className="flex items-center gap-2.5">
                    <div className="w-4 h-4 rounded-full border border-gray-400 shrink-0" />
                    <span className="text-gray-400">Anna Build Pipeline Automation & Executive Dashboard</span>
                  </div>
                  <span className="text-[10px] font-mono text-gray-400">PENDING</span>
                </div>
              </div>
            </div>

            <div className="mt-5 pt-4 border-t border-[#1E293B] flex items-center justify-between text-xs text-gray-400">
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-[#FF5C00]" />
                Assigned Specialist: <strong className="text-white">Alex Thorne (HuboExperts)</strong>
              </span>
              <span>Updated 2 hours ago</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
