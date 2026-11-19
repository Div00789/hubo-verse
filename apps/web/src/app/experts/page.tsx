import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Award,
  Sparkles,
  ArrowRight,
  BookOpen,
  Calendar,
  CheckCircle2,
  Clock,
  Briefcase,
  Star,
  Bot,
  ExternalLink,
  Play,
} from 'lucide-react';
import { SiteHeader } from '@/components/SiteHeader';
import { SiteFooter } from '@/components/SiteFooter';
import {
  DEMO_EXPERTS,
  getCoursesByExpertId,
  getLiveClassesByExpertId,
  getRecordedVideosByExpertId,
} from '@huboverse/database';

export const metadata = {
  title: 'Learn from Industry Experts — HubSpot Specialists | HuboVerse',
  description:
    'Gain practical insights, explore expert-led tutorials, and learn directly from experienced professionals.',
  openGraph: {
    title: 'Learn from Industry Experts — HubSpot Specialists | HuboVerse',
    description:
      'Gain practical insights, explore expert-led tutorials, and learn directly from experienced professionals.',
    images: ['/experts/divyanshu-tuli-blue.png'],
  },
};

export default function ExpertsPage() {
  const experts = DEMO_EXPERTS;

  return (
    <div className="min-h-screen bg-[#06090F] text-white flex flex-col justify-between">
      <SiteHeader />

      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 space-y-12 sm:space-y-16">
        {/* Hero Section */}
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FF5C00]/15 border border-[#FF5C00]/30 text-[#FF5C00] text-xs font-semibold">
            <Award className="w-3.5 h-3.5" />
            <span>Certified HubSpot Practitioners &amp; AI Architects</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-white">
            Learn from Industry Experts
          </h1>
          <p className="text-sm sm:text-base text-gray-300 leading-relaxed max-w-2xl mx-auto">
            Gain practical insights, explore expert-led tutorials, and learn directly from experienced professionals.
          </p>
        </div>

        {/* Experts Directory Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {experts.map((expert) => {
            const courses = getCoursesByExpertId(expert.id);
            const liveClasses = getLiveClassesByExpertId(expert.id);
            const recordedVideos = getRecordedVideosByExpertId(expert.id);

            const isBlueTheme = expert.slug === 'divyanshu-tuli';
            const themeTitleColor = isBlueTheme ? 'text-[#2F6FED]' : 'text-[#FF5C00]';
            const themeCardHover = isBlueTheme
              ? 'hover:border-[#2F6FED]/60 hover:shadow-2xl hover:shadow-[#2F6FED]/15'
              : 'hover:border-[#FF5C00]/60 hover:shadow-2xl hover:shadow-[#FF5C00]/15';
            const themeImageBg = isBlueTheme
              ? 'from-[#17387E] via-[#0F224D] to-[#0B0F19]'
              : 'from-[#55230C] via-[#26120A] to-[#0B0F19]';
            const themeGlow = isBlueTheme ? 'bg-[#2F6FED]/25' : 'bg-[#FF5C00]/25';
            const themeBtn = isBlueTheme
              ? 'bg-gradient-to-r from-[#2F6FED] to-blue-600 hover:from-[#2558c4] hover:to-blue-700 shadow-[#2F6FED]/25'
              : 'bg-gradient-to-r from-[#FF5C00] to-orange-600 hover:from-[#d94e00] hover:to-orange-700 shadow-[#FF5C00]/25';
            const themeCertPill = isBlueTheme
              ? 'bg-[#2F6FED]/15 border-[#2F6FED]/30 text-blue-200'
              : 'bg-[#FF5C00]/15 border-[#FF5C00]/30 text-orange-200';

            return (
              <div
                key={expert.id}
                className={`group bg-[#0B0F19] border border-[#1E293B] ${themeCardHover} rounded-3xl overflow-hidden shadow-2xl transition-all duration-300 flex flex-col justify-between`}
              >
                {/* Image Container with Ambient Themed Background & Glow */}
                <div
                  className={`relative w-full h-[320px] sm:h-[360px] overflow-hidden bg-gradient-to-b ${themeImageBg}`}
                >
                  {/* Subtle Ambient Radial Lighting */}
                  <div
                    className={`absolute top-4 left-1/2 -translate-x-1/2 w-64 h-64 ${themeGlow} rounded-full blur-3xl pointer-events-none`}
                  />

                  <Image
                    src={expert.profileImagePath}
                    alt={expert.fullName}
                    fill
                    priority
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 45vw"
                    className="object-contain object-bottom pt-5 transition-transform duration-500 ease-out group-hover:scale-105"
                  />

                  {/* Subtle bottom fade into card dark base */}
                  <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-[#0B0F19] via-[#0B0F19]/60 to-transparent pointer-events-none" />

                  {/* Top Badges Overlay: FEATURED on top-left, Experience on top-right */}
                  <div className="absolute top-4 left-4 right-4 flex items-center justify-between gap-2 z-10 pointer-events-none">
                    {/* Top-Left: FEATURED Badge */}
                    {expert.isFeatured ? (
                      <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-gradient-to-r from-[#FF5C00] to-amber-500 text-white text-[11px] font-extrabold tracking-wider uppercase shadow-lg shadow-[#FF5C00]/30 shrink-0 pointer-events-auto">
                        <Star className="w-3 h-3 fill-white" />
                        <span>Featured</span>
                      </span>
                    ) : (
                      <div />
                    )}

                    {/* Top-Right: Experience Badge */}
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/70 backdrop-blur-md border border-white/15 text-white text-xs font-semibold shadow-lg shrink-0 pointer-events-auto">
                      <Sparkles className="w-3.5 h-3.5 text-[#FF5C00]" />
                      <span>{expert.experienceDisplay}</span>
                    </span>
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-6 sm:p-8 flex-1 flex flex-col justify-between space-y-6 bg-[#0B0F19]">
                  <div className="space-y-4">
                    {/* Name & Title */}
                    <div className="space-y-1.5">
                      <h2 className="text-2xl sm:text-3xl font-extrabold text-[#FFFFFF] tracking-tight">
                        {expert.fullName}
                      </h2>
                      <p className={`text-sm font-semibold ${themeTitleColor} leading-snug`}>
                        {expert.professionalTitle}
                      </p>
                    </div>

                    {/* Short Bio */}
                    <p className="text-xs sm:text-sm text-gray-300 leading-relaxed line-clamp-3">
                      {expert.shortBio}
                    </p>

                    {/* Verified Certifications */}
                    {expert.certifications.length > 0 && (
                      <div className="space-y-1.5">
                        <div className="text-[11px] font-mono uppercase text-gray-400 tracking-wider">
                          Verified Certifications
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {expert.certifications.map((cert) => (
                            <span
                              key={cert}
                              className={`px-3 py-1 rounded-lg text-xs font-semibold flex items-center gap-1.5 border ${themeCertPill}`}
                            >
                              <Award className="w-3.5 h-3.5 text-current" />
                              <span>{cert}</span>
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Specialisation Badges */}
                    <div className="space-y-2">
                      <div className="text-[11px] font-mono uppercase text-gray-400 tracking-wider">
                        Core Specialisations
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {expert.skills.slice(0, 5).map((skill) => (
                          <span
                            key={skill}
                            className="px-2.5 py-1 rounded-lg text-xs bg-[#131B2E] border border-[#1E293B] text-gray-200 font-medium"
                          >
                            {skill}
                          </span>
                        ))}
                        {expert.skills.length > 5 && (
                          <span className="px-2.5 py-1 rounded-lg text-xs bg-[#131B2E] border border-[#1E293B] text-gray-400 font-medium">
                            +{expert.skills.length - 5} more
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Academy & Video Metrics Preview */}
                    <div className="p-3.5 rounded-2xl bg-[#090D16] border border-[#1E293B] flex items-center justify-between text-xs text-gray-400">
                      <div className="flex flex-wrap items-center gap-4">
                        {courses.length > 0 && (
                          <span className="flex items-center gap-1.5">
                            <BookOpen className="w-3.5 h-3.5 text-[#2F6FED]" />
                            <strong className="text-white">{courses.length}</strong> Courses
                          </span>
                        )}
                        {recordedVideos.length > 0 && (
                          <span className="flex items-center gap-1.5">
                            <Play className="w-3.5 h-3.5 text-[#2F6FED] fill-current" />
                            <strong className="text-white">{recordedVideos.length}</strong> Videos
                          </span>
                        )}
                        {liveClasses.length > 0 && (
                          <span className="flex items-center gap-1.5">
                            <Calendar className="w-3.5 h-3.5 text-cyan-400" />
                            <strong className="text-white">{liveClasses.length}</strong> Live
                          </span>
                        )}
                      </div>
                      <span className="text-[11px] text-emerald-400 font-medium flex items-center gap-1">
                        <Star className="w-3 h-3 fill-emerald-400" />
                        4.95
                      </span>
                    </div>
                  </div>

                  {/* Card Action CTAs */}
                  <div className="pt-4 border-t border-[#1E293B] flex flex-wrap items-center gap-3">
                    <Link
                      href={`/experts/${expert.slug}`}
                      className={`flex-1 py-3.5 px-5 rounded-xl ${themeBtn} text-center text-sm font-bold text-white transition-all shadow-lg flex items-center justify-center gap-2 group/btn`}
                    >
                      <span>View Profile</span>
                      <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1.5 transition-transform" />
                    </Link>

                    {courses.length > 0 && (
                      <Link
                        href={`/experts/${expert.slug}#courses`}
                        className="py-3.5 px-4 rounded-xl bg-[#131B2E] hover:bg-[#1E293B] text-white text-xs font-semibold border border-[#1E293B] transition-colors flex items-center gap-1.5"
                      >
                        <BookOpen className="w-3.5 h-3.5 text-[#2F6FED]" />
                        <span>Courses ({courses.length})</span>
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Anna AI Integration Banner */}
        <div className="rounded-3xl bg-gradient-to-r from-[#131B2E] via-[#0E1526] to-[#1E293B] border border-[#1E293B] p-8 sm:p-10 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center md:text-left">
            <div className="inline-flex items-center gap-2 text-xs font-bold text-cyan-400">
              <Bot className="w-4 h-4" />
              <span>Ask Anna AI About Our Instructors</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-white">
              Need personalized training recommendations?
            </h3>
            <p className="text-xs sm:text-sm text-gray-300 max-w-xl">
              Anna can match your team&apos;s HubSpot CRM and Operations goals with Divyanshu Tuli or
              Aadesh Dhall&apos;s upcoming masterclasses and implementation workshops.
            </p>
          </div>

          <Link
            href="/app"
            className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-[#FF5C00] to-[#E04F00] text-white text-xs font-bold shadow-xl shadow-[#FF5C00]/25 hover:opacity-95 transition-all shrink-0 flex items-center gap-2"
          >
            <Sparkles className="w-4 h-4" />
            <span>Consult Anna in Workspace</span>
          </Link>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
