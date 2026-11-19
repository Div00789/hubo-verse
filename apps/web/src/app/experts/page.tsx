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
} from 'lucide-react';
import { SiteHeader } from '@/components/SiteHeader';
import { SiteFooter } from '@/components/SiteFooter';
import { DEMO_EXPERTS, getCoursesByExpertId, getLiveClassesByExpertId } from '@huboverse/database';

export const metadata = {
  title: 'Meet Our HubSpot Experts | HuboVerse',
  description:
    'Learn from experienced HubSpot professionals who combine practical CRM expertise, advanced automation and modern AI technologies to help businesses grow.',
  openGraph: {
    title: 'Meet Our HubSpot Experts | HuboVerse',
    description:
      'Learn from experienced HubSpot professionals who combine practical CRM expertise, advanced automation and modern AI technologies to help businesses grow.',
    images: ['/experts/divyanshu-tuli.png'],
  },
};

export default function ExpertsPage() {
  const experts = DEMO_EXPERTS;

  return (
    <div className="min-h-screen bg-[#06090F] text-white flex flex-col justify-between">
      <SiteHeader />

      <main className="flex-1 max-w-7xl mx-auto px-6 py-16 space-y-16 w-full">
        {/* Hero Section */}
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FF5C00]/15 border border-[#FF5C00]/30 text-[#FF5C00] text-xs font-semibold">
            <Award className="w-3.5 h-3.5" />
            <span>Certified HubSpot Practitioners &amp; AI Architects</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-white">
            Meet Our HubSpot Experts
          </h1>
          <p className="text-sm sm:text-base text-gray-300 leading-relaxed">
            Learn from experienced HubSpot professionals who combine practical CRM expertise,
            advanced automation and modern AI technologies to help businesses grow.
          </p>
        </div>

        {/* Experts Directory Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {experts.map((expert) => {
            const courses = getCoursesByExpertId(expert.id);
            const liveClasses = getLiveClassesByExpertId(expert.id);

            return (
              <div
                key={expert.id}
                className="bg-[#0B0F19] border border-[#1E293B] rounded-3xl p-7 sm:p-9 hover:border-[#FF5C00]/40 transition-all shadow-2xl flex flex-col justify-between relative overflow-hidden group"
              >
                {/* Background Subtle Ambient Glow */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-[#FF5C00]/5 rounded-full blur-3xl pointer-events-none group-hover:bg-[#FF5C00]/10 transition-colors" />

                <div className="space-y-6 relative z-10">
                  {/* Top Profile Summary: Photo + Core Header */}
                  <div className="flex flex-col sm:flex-row gap-5 items-start sm:items-center">
                    <div className="relative w-28 h-28 sm:w-32 sm:h-32 rounded-2xl overflow-hidden border-2 border-[#1E293B] group-hover:border-[#FF5C00]/60 transition-colors shrink-0 bg-[#131B2E] shadow-xl">
                      <Image
                        src={expert.profileImagePath}
                        alt={expert.fullName}
                        fill
                        sizes="(max-width: 640px) 112px, 128px"
                        className="object-cover object-top"
                        priority
                      />
                    </div>

                    <div className="space-y-2 flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="px-2.5 py-0.5 rounded-full text-[11px] font-mono font-semibold bg-[#131B2E] text-[#FF5C00] border border-[#1E293B]">
                          {expert.experienceDisplay}
                        </span>
                        {expert.certifications.length > 0 && (
                          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3" />
                            <span>{expert.certifications[0]}</span>
                          </span>
                        )}
                      </div>

                      <h2 className="text-2xl font-bold text-white tracking-tight">
                        {expert.fullName}
                      </h2>
                      <p className="text-xs sm:text-sm text-gray-300 font-medium leading-snug">
                        {expert.professionalTitle}
                      </p>
                    </div>
                  </div>

                  {/* Short Bio */}
                  <p className="text-xs sm:text-sm text-gray-400 leading-relaxed border-t border-[#1E293B]/70 pt-4">
                    {expert.shortBio}
                  </p>

                  {/* Certifications (if available) */}
                  {expert.certifications.length > 0 && (
                    <div className="space-y-1.5">
                      <div className="text-[11px] font-mono uppercase text-gray-400 tracking-wider">
                        Verified Certifications
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {expert.certifications.map((cert) => (
                          <span
                            key={cert}
                            className="px-3 py-1 rounded-lg text-xs bg-[#131B2E] border border-[#1E293B] text-emerald-300 font-medium flex items-center gap-1.5"
                          >
                            <Award className="w-3.5 h-3.5 text-emerald-400" />
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
                      {expert.skills.slice(0, 6).map((skill) => (
                        <span
                          key={skill}
                          className="px-2.5 py-1 rounded-lg text-[11px] bg-[#101726] border border-[#1E293B] text-gray-300 font-medium"
                        >
                          {skill}
                        </span>
                      ))}
                      {expert.skills.length > 6 && (
                        <span className="px-2.5 py-1 rounded-lg text-[11px] bg-[#131B2E] border border-[#1E293B] text-gray-400 font-medium">
                          +{expert.skills.length - 6} more
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Academy Metrics Preview */}
                  <div className="p-3.5 rounded-2xl bg-[#090D16] border border-[#1E293B] flex items-center justify-between text-xs text-gray-400">
                    <div className="flex items-center gap-4">
                      <span className="flex items-center gap-1.5">
                        <BookOpen className="w-3.5 h-3.5 text-[#FF5C00]" />
                        <strong className="text-white">{courses.length}</strong> Courses
                      </span>
                      <span className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-cyan-400" />
                        <strong className="text-white">{liveClasses.length}</strong> Live Workshops
                      </span>
                    </div>
                    <span className="text-[11px] text-emerald-400 font-medium flex items-center gap-1">
                      <Star className="w-3 h-3 fill-emerald-400" />
                      4.95 Rating
                    </span>
                  </div>
                </div>

                {/* Card Action CTAs */}
                <div className="pt-6 mt-6 border-t border-[#1E293B] flex flex-wrap items-center gap-3 relative z-10">
                  <Link
                    href={`/experts/${expert.slug}`}
                    className="flex-1 py-3 px-4 rounded-xl bg-[#FF5C00] hover:bg-[#FF7A00] text-center text-xs font-bold text-white transition-all shadow-lg shadow-[#FF5C00]/20 flex items-center justify-center gap-2 group/btn"
                  >
                    <span>View Profile</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-1 transition-transform" />
                  </Link>

                  {courses.length > 0 && (
                    <Link
                      href={`/experts/${expert.slug}#courses`}
                      className="py-3 px-4 rounded-xl bg-[#131B2E] hover:bg-[#1E293B] text-white text-xs font-semibold border border-[#1E293B] transition-colors flex items-center gap-1.5"
                    >
                      <BookOpen className="w-3.5 h-3.5 text-[#FF5C00]" />
                      <span>View Courses ({courses.length})</span>
                    </Link>
                  )}
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
