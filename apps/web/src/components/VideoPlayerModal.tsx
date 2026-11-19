'use client';

import React, { useEffect, useState } from 'react';
import { Minus, Maximize2, Minimize2, X, ExternalLink } from 'lucide-react';
import type { RecordedExpertVideo } from '@huboverse/types';

export type PlayerState = 'closed' | 'normal' | 'maximised' | 'minimised';

interface VideoPlayerModalProps {
  video: RecordedExpertVideo | null;
  onClose: () => void;
}

export const VideoPlayerModal: React.FC<VideoPlayerModalProps> = ({ video, onClose }) => {
  const [playerState, setPlayerState] = useState<PlayerState>('normal');
  const [iframeLoading, setIframeLoading] = useState(true);

  // When a new video is selected, reset to normal state and loading indicator
  useEffect(() => {
    if (video) {
      setPlayerState('normal');
      setIframeLoading(true);
    } else {
      setPlayerState('closed');
    }
  }, [video]);

  // Lock background scroll only in normal or maximised overlay modes
  useEffect(() => {
    if (video && (playerState === 'normal' || playerState === 'maximised')) {
      const prevOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = prevOverflow || 'unset';
      };
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [video, playerState]);

  // Handle Escape key to close modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && (playerState === 'normal' || playerState === 'maximised')) {
        handleClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [playerState]);

  if (!video || playerState === 'closed') {
    return null;
  }

  const handleClose = () => {
    setPlayerState('closed');
    onClose();
  };

  const embedSrc = video.embedUrl.includes('?')
    ? `${video.embedUrl}&autoplay=1`
    : `${video.embedUrl}?autoplay=1`;

  // 1. MINIMISED FLOATING PLAYER (Picture-in-Picture at bottom-right)
  if (playerState === 'minimised') {
    return (
      <aside
        aria-label={`Mini video player: ${video.title}`}
        className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 w-80 sm:w-96 rounded-2xl bg-[#0B0F19] border-2 border-[#2F6FED]/60 shadow-2xl shadow-black/80 overflow-hidden flex flex-col transition-all duration-300 ring-2 ring-[#2F6FED]/25"
      >
        {/* Floating Mini Header */}
        <div className="px-3.5 py-2.5 bg-[#080D1A] border-b border-[#1E293B] flex items-center justify-between gap-2 select-none">
          <div className="flex items-center gap-2 min-w-0 flex-1">
            <span className="w-2 h-2 rounded-full bg-[#2F6FED] animate-pulse shrink-0" />
            <h4 className="text-xs font-bold text-white truncate" title={video.title}>
              {video.title}
            </h4>
          </div>

          <div className="flex items-center gap-1 shrink-0">
            {/* Restore / Expand Control */}
            <button
              type="button"
              onClick={() => setPlayerState('normal')}
              className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-[#131B2E] transition-colors"
              title="Expand video player"
              aria-label="Expand video player"
            >
              <Maximize2 className="w-3.5 h-3.5" />
            </button>

            {/* Close Control */}
            <button
              type="button"
              onClick={handleClose}
              className="p-1.5 rounded-lg text-gray-400 hover:text-red-400 hover:bg-[#131B2E] transition-colors"
              title="Close video"
              aria-label="Close video"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Mini 16:9 Video Canvas */}
        <div className="relative w-full pb-[56.25%] bg-black">
          <iframe
            src={embedSrc}
            title={video.title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            onLoad={() => setIframeLoading(false)}
            className="absolute inset-0 w-full h-full border-0"
          />
        </div>
      </aside>
    );
  }

  // 2. MODAL PLAYER (Normal & Maximised states)
  const isMaximised = playerState === 'maximised';

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={video.title}
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 md:p-6"
    >
      {/* Dark Translucent Backdrop */}
      <div
        onClick={handleClose}
        className="fixed inset-0 bg-black/85 backdrop-blur-md transition-opacity duration-300"
        aria-hidden="true"
      />

      {/* Modal Dialog Card */}
      <div
        className={`relative z-10 bg-[#0B0F19] border ${
          isMaximised ? 'border-[#2F6FED]/50 max-w-6xl max-h-[96vh]' : 'border-[#1E293B] max-w-4xl'
        } rounded-2xl sm:rounded-3xl w-full shadow-2xl shadow-black/90 overflow-hidden flex flex-col transition-all duration-300`}
      >
        {/* Popup Header with Title and Three Required Controls */}
        <div className="p-4 sm:p-5 border-b border-[#1E293B] flex items-center justify-between gap-3 bg-[#080D1A] select-none">
          <div className="space-y-0.5 min-w-0 flex-1">
            <span className="text-[10px] font-mono text-[#2F6FED] uppercase tracking-wider font-semibold">
              {video.category}
            </span>
            <h3 className="text-sm sm:text-base md:text-lg font-bold text-white truncate" title={video.title}>
              {video.title}
            </h3>
          </div>

          {/* Three Functional Header Controls in Top-Right Corner */}
          <div className="flex items-center gap-1 sm:gap-1.5 shrink-0">
            {/* 1. Minimise Button */}
            <button
              type="button"
              onClick={() => setPlayerState('minimised')}
              className="p-2 rounded-xl text-gray-400 hover:text-white hover:bg-[#131B2E] transition-colors"
              title="Minimise to floating player"
              aria-label="Minimise to floating player"
            >
              <Minus className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>

            {/* 2. Maximise / Restore Button */}
            {isMaximised ? (
              <button
                type="button"
                onClick={() => setPlayerState('normal')}
                className="p-2 rounded-xl text-[#2F6FED] hover:text-blue-300 hover:bg-[#131B2E] transition-colors"
                title="Restore normal size"
                aria-label="Restore normal size"
              >
                <Minimize2 className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
            ) : (
              <button
                type="button"
                onClick={() => setPlayerState('maximised')}
                className="p-2 rounded-xl text-gray-400 hover:text-white hover:bg-[#131B2E] transition-colors"
                title="Maximise player"
                aria-label="Maximise player"
              >
                <Maximize2 className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
            )}

            {/* 3. Close Button (X) */}
            <button
              type="button"
              onClick={handleClose}
              className="p-2 rounded-xl text-gray-400 hover:text-red-400 hover:bg-[#131B2E] transition-colors"
              title="Close video player"
              aria-label="Close video player"
            >
              <X className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          </div>
        </div>

        {/* Responsive 16:9 Video Canvas */}
        <div className="relative w-full pb-[56.25%] bg-black overflow-hidden">
          {iframeLoading && (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 text-xs text-gray-400 bg-[#090D16]">
              <div className="w-8 h-8 border-2 border-[#2F6FED] border-t-transparent rounded-full animate-spin" />
              <span>Loading Loom video stream...</span>
            </div>
          )}

          <iframe
            src={embedSrc}
            title={video.title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            onLoad={() => setIframeLoading(false)}
            className="absolute inset-0 w-full h-full border-0"
          />
        </div>

        {/* Modal Footer with Fallback */}
        <div className="px-4 py-3 sm:px-5 sm:py-3.5 border-t border-[#1E293B] flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 text-xs text-gray-400 bg-[#080D1A]">
          <p className="text-xs text-gray-300 max-w-xl line-clamp-1">
            {video.description}
          </p>

          <div className="flex items-center gap-2 shrink-0">
            <span className="text-[11px] text-gray-500 hidden sm:inline">
              Embedding unavailable?
            </span>
            <a
              href={video.videoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs font-semibold text-[#2F6FED] hover:underline inline-flex items-center gap-1"
            >
              <span>Watch on Loom</span>
              <ExternalLink className="w-3 h-3 text-[#2F6FED]" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
