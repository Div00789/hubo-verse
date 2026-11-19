'use client';

import React, { useState } from 'react';
import { Play, ExternalLink, Film } from 'lucide-react';
import type { RecordedExpertVideo } from '@huboverse/types';
import { VideoPlayerModal } from './VideoPlayerModal';

interface RecordedTrainingSectionProps {
  expertName: string;
  videos: RecordedExpertVideo[];
}

export const RecordedTrainingSection: React.FC<RecordedTrainingSectionProps> = ({
  expertName,
  videos,
}) => {
  const [activeVideo, setActiveVideo] = useState<RecordedExpertVideo | null>(null);

  if (!videos || videos.length === 0) {
    return null;
  }

  const openPlayer = (video: RecordedExpertVideo) => {
    setActiveVideo(video);
  };

  return (
    <section id="recordings" className="space-y-6">
      {/* Section Header */}
      <div className="border-b border-[#1E293B] pb-4">
        <div className="inline-flex items-center gap-2 text-xs font-mono uppercase text-[#2F6FED] font-bold tracking-wider">
          <Film className="w-3.5 h-3.5 text-[#2F6FED]" />
          <span>On-Demand Masterclass Videos</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
          Recorded HubSpot Training Sessions
        </h2>
        <p className="text-xs sm:text-sm text-gray-400 mt-1 max-w-2xl leading-relaxed">
          Explore practical HubSpot tutorials by {expertName}, covering CRM integrations, deal
          management and productivity tools.
        </p>
      </div>

      {/* Responsive Video Cards Grid (Desktop: 3 in a row, Tablet: 2-col, Mobile: 1-col) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {videos.map((video) => (
          <div
            key={video.id}
            className="bg-[#0B0F19] border border-[#1E293B] hover:border-[#2F6FED]/60 rounded-2xl p-6 shadow-xl flex flex-col justify-between transition-all group/card relative overflow-hidden"
          >
            {/* Ambient hover glow */}
            <div className="absolute top-0 right-0 w-48 h-48 bg-[#2F6FED]/5 rounded-full blur-2xl pointer-events-none group-hover/card:bg-[#2F6FED]/15 transition-colors" />

            <div className="space-y-4 relative z-10">
              {/* Video Thumbnail / Interactive Preview Banner */}
              <button
                type="button"
                onClick={() => openPlayer(video)}
                className="w-full h-44 rounded-xl bg-gradient-to-br from-[#0F172A] via-[#131F38] to-[#0A1020] border border-[#1E293B] group-hover/card:border-[#2F6FED]/50 flex flex-col items-center justify-center relative overflow-hidden transition-all text-left"
              >
                {/* Background Tech Motif */}
                <div className="absolute inset-0 bg-[radial-gradient(#2F6FED_1px,transparent_1px)] [background-size:16px_16px] opacity-20" />

                {/* Central Glowing Play Button */}
                <div className="w-14 h-14 rounded-full bg-[#2F6FED]/20 border border-[#2F6FED]/60 group-hover/card:bg-[#2F6FED] flex items-center justify-center shadow-lg shadow-[#2F6FED]/30 group-hover/card:scale-110 transition-all z-10">
                  <Play className="w-6 h-6 text-[#2F6FED] group-hover/card:text-white fill-current ml-0.5 transition-colors" />
                </div>

                <div className="absolute bottom-2.5 left-3 right-3 flex items-center justify-between text-[11px] text-gray-400 z-10">
                  <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-black/60 text-cyan-300 border border-cyan-500/20">
                    Loom Recording
                  </span>
                  <span className="text-[10px] text-gray-300 flex items-center gap-1 font-medium">
                    Click to Play
                  </span>
                </div>
              </button>

              {/* Category Badge & Meta */}
              <div className="flex items-center justify-between pt-1">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-semibold bg-[#2F6FED]/15 text-[#2F6FED] border border-[#2F6FED]/30">
                  {video.category}
                </span>
                <span className="text-[10px] text-gray-500 font-mono">HD 1080p</span>
              </div>

              {/* Title & Description */}
              <div className="space-y-1.5">
                <h3 className="font-bold text-white text-base group-hover/card:text-[#2F6FED] transition-colors line-clamp-2">
                  {video.title}
                </h3>
                <p className="text-xs text-gray-400 leading-relaxed line-clamp-3">
                  {video.description}
                </p>
              </div>
            </div>

            {/* Action Bar */}
            <div className="pt-5 mt-5 border-t border-[#1E293B] flex items-center gap-2 relative z-10">
              <button
                type="button"
                onClick={() => openPlayer(video)}
                className="flex-1 py-2.5 px-3 rounded-xl bg-[#2F6FED] hover:bg-[#2558c4] text-white font-bold text-xs shadow-md shadow-[#2F6FED]/20 flex items-center justify-center gap-1.5 transition-all"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Watch Recording</span>
              </button>

              <a
                href={video.videoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 rounded-xl bg-[#131B2E] hover:bg-[#1E293B] text-gray-300 hover:text-white border border-[#1E293B] transition-colors"
                title="Open in Loom (new tab)"
              >
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        ))}
      </div>

      {/* Advanced Video Popup Modal with Minimise, Maximise & Close Controls */}
      <VideoPlayerModal video={activeVideo} onClose={() => setActiveVideo(null)} />
    </section>
  );
};
