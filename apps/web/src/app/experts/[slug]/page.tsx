import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import {
  Award,
  Sparkles,
  ArrowRight,
  BookOpen,
  Calendar,
  CheckCircle2,
  Clock,
  Star,
  Bot,
  Video,
  Play,
  ShieldCheck,
  Film,
  Workflow,
  Cpu,
  Layers,
  Globe,
  LineChart,
} from 'lucide-react';
import { SiteHeader } from '@/components/SiteHeader';
import { SiteFooter } from '@/components/SiteFooter';
import {
  DEMO_EXPERTS,
  getExpertBySlug,
  getCoursesByExpertId,
  getLiveClassesByExpertId,
  getRecordedVideosByExpertId,
} from '@huboverse/database';
import { RecordedTrainingSection } from '@/components/RecordedTrainingSection';

interface ExpertProfilePageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateStaticParams() {
  return DEMO_EXPERTS.map((expert) => ({
    slug: expert.slug,
  }));
}

export async function generateMetadata({ params }: ExpertProfilePageProps) {
  const { slug } = await params;
  const expert = getExpertBySlug(slug);

  if (!expert) {
    return {
      title: 'Expert Profile Not Found | HuboVerse',
    };
  }

  return {
    title: `${expert.fullName} — ${expert.professionalTitle} | HuboVerse Experts`,
    description: expert.shortBio,
    openGraph: {
      title: `${expert.fullName} — HubSpot & AI Expert | HuboVerse`,
      description: expert.shortBio,
      images: [expert.profileImagePath],
    },
  };
}

export default async function ExpertDetailPage({ params }: ExpertProfilePageProps) {
  const { slug } = await params;
  const expert = getExpertBySlug(slug);

  if (!expert) {
    notFound();
  }

  const courses = getCoursesByExpertId(expert.id);
  const liveClasses = getLiveClassesByExpertId(expert.id);
  const recordedVideos = getRecordedVideosByExpertId(expert.id);

  // Helper icon selector for skill cards
  const getSkillIcon = (skillName: string) => {
    const lower = skillName.toLowerCase();
    if (lower.includes('workflow') || lower.includes('automation')) {
      return <Workflow className="w-4 h-4 text-[#2F6FED]" />;
    }
    if (lower.includes('ai') || lower.includes('tools')) {
      return <Bot className="w-4 h-4 text-cyan-400" />;
    }
    if (lower.includes('crm') || lower.includes('hubspot')) {
      return <Layers className="w-4 h-4 text-[#2F6FED]" />;
    }
    if (lower.includes('revops') || lower.includes('revenue') || lower.includes('strategy')) {
      return <LineChart className="w-4 h-4 text-emerald-400" />;
    }
    if (lower.includes('international') || lower.includes('client')) {
      return <Globe className="w-4 h-4 text-blue-400" />;
    }
    return <Cpu className="w-4 h-4 text-purple-400" />;
  };

  // Structured Data (JSON-LD) for SEO
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: expert.fullName,
    jobTitle: expert.professionalTitle,
    description: expert.shortBio,
    image: `https://huboverse.com${expert.profileImagePath}`,
    worksFor: {
      '@type': 'Organization',
      name: 'HuboVerse by HuboExperts',
    },
    knowsAbout: expert.skills,
  };

  return (
    <div className="min-h-screen bg-[#06090F] text-white flex flex-col justify-between">
      {/* Schema.org Person metadata */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <SiteHeader />

      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 space-y-12 sm:space-y-16">
        {/* Navigation Breadcrumb */}
        <div>
          <Link
            href="/experts"
            className="inline-flex items-center gap-1.5 text-xs text-gray-400 hover:text-white transition-colors"
          >
            &larr; Back to Learn from Industry Experts
          </Link>
        </div>

        {/* 1. PROFESSIONAL PROFILE HERO WITH THEMED BACKDROP */}
        <section className="bg-gradient-to-r from-[#0B0F19] via-[#0E1526] to-[#0A1020] border border-[#1E293B] rounded-3xl p-6 sm:p-10 lg:p-12 shadow-2xl relative overflow-hidden">
          {/* Ambient Glow */}
          <div
            className={`absolute top-0 right-0 w-[500px] h-[500px] ${
              expert.slug === 'divyanshu-tuli' ? 'bg-[#2F6FED]/15' : 'bg-[#FF5C00]/15'
            } rounded-full blur-3xl pointer-events-none`}
          />

          <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 items-start lg:items-center relative z-10">
            {/* Polished Headshot Container with Expert Brand Gradient */}
            <div className="relative group shrink-0">
              <div
                className={`absolute -inset-1 rounded-[28px] bg-gradient-to-tr ${
                  expert.slug === 'divyanshu-tuli'
                    ? 'from-[#2F6FED] to-cyan-400 opacity-40'
                    : 'from-[#FF5C00] to-amber-400 opacity-40'
                } blur-md group-hover:opacity-60 transition-opacity`}
              />
              <div
                className={`relative w-48 h-48 sm:w-60 sm:h-60 rounded-3xl overflow-hidden border-2 ${
                  expert.slug === 'divyanshu-tuli' ? 'border-[#2F6FED]/50' : 'border-[#FF5C00]/50'
                } bg-gradient-to-b ${
                  expert.slug === 'divyanshu-tuli'
                    ? 'from-[#17387E] via-[#0D172E] to-[#080D1A]'
                    : 'from-[#55230C] via-[#26120A] to-[#080D1A]'
                } shadow-2xl flex items-center justify-center`}
              >
                <Image
                  src={expert.profileImagePath}
                  alt={expert.fullName}
                  fill
                  sizes="(max-width: 640px) 192px, 240px"
                  className="object-contain object-bottom pt-2"
                  priority
                />
              </div>
            </div>

            {/* Profile Overview Details */}
            <div className="space-y-4 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-[#2F6FED]/15 text-[#2F6FED] border border-[#2F6FED]/35">
                  {expert.experienceDisplay}
                </span>

                {expert.certifications.map((cert) => (
                  <span
                    key={cert}
                    className="px-3 py-1 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center gap-1.5"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>{cert}</span>
                  </span>
                ))}
              </div>

              <div>
                <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                  {expert.fullName}
                </h1>
                <p className="text-sm sm:text-base text-gray-300 font-medium mt-1 leading-snug">
                  {expert.professionalTitle}
                </p>
              </div>

              <p className="text-xs sm:text-sm text-gray-400 leading-relaxed max-w-3xl">
                {expert.shortBio}
              </p>

              {/* Action CTAs */}
              <div className="pt-2 flex flex-wrap items-center gap-3">
                {courses.length > 0 && (
                  <a
                    href="#courses"
                    className="px-6 py-3 rounded-xl bg-[#2F6FED] hover:bg-[#2558c4] text-white text-xs font-bold transition-all shadow-lg shadow-[#2F6FED]/25 flex items-center gap-2"
                  >
                    <BookOpen className="w-4 h-4" />
                    <span>View Courses ({courses.length})</span>
                  </a>
                )}

                {recordedVideos.length > 0 && (
                  <a
                    href="#recordings"
                    className="px-6 py-3 rounded-xl bg-[#131B2E] hover:bg-[#1E293B] text-white text-xs font-semibold border border-[#1E293B] hover:border-[#2F6FED]/50 transition-colors flex items-center gap-2"
                  >
                    <Play className="w-4 h-4 text-[#2F6FED] fill-current" />
                    <span>Watch Recorded Sessions ({recordedVideos.length})</span>
                  </a>
                )}

                <a
                  href="#ask-anna"
                  className="px-6 py-3 rounded-xl bg-[#0F172A] hover:bg-[#152038] text-gray-300 hover:text-white text-xs font-semibold border border-[#1E293B] transition-colors flex items-center gap-2"
                >
                  <Bot className="w-4 h-4 text-cyan-400" />
                  <span>Ask Anna AI</span>
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* 2. ABOUT DIVYANSHU TULI */}
        <section className="bg-[#0B0F19] border border-[#1E293B] rounded-3xl p-8 sm:p-10 shadow-xl space-y-6">
          <div className="border-b border-[#1E293B] pb-4">
            <div className="text-xs font-mono uppercase text-[#2F6FED] tracking-wider font-semibold">
              Professional Biography
            </div>
            <h2 className="text-2xl font-bold text-white mt-1">About {expert.fullName}</h2>
          </div>

          <div className="text-xs sm:text-sm text-gray-300 leading-relaxed whitespace-pre-line space-y-4">
            {expert.fullBio}
          </div>
        </section>

        {/* 3. CERTIFICATIONS & EXPERIENCE */}
        <section className="bg-[#0B0F19] border border-[#1E293B] rounded-3xl p-8 sm:p-10 shadow-xl space-y-6">
          <div className="border-b border-[#1E293B] pb-4">
            <div className="text-xs font-mono uppercase text-[#2F6FED] tracking-wider font-semibold">
              Industry Accreditation
            </div>
            <h2 className="text-2xl font-bold text-white mt-1">Certifications &amp; Experience</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {expert.certifications.length > 0 ? (
              expert.certifications.map((cert) => (
                <div
                  key={cert}
                  className="p-5 rounded-2xl bg-[#131B2E] border border-emerald-500/30 flex items-start gap-3.5 shadow-md"
                >
                  <Award className="w-6 h-6 text-emerald-400 shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <div className="font-bold text-white text-sm">{cert}</div>
                    <div className="text-[11px] text-gray-400">
                      Verified HubSpot Practitioner &amp; RevOps Specialist
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-5 rounded-2xl bg-[#131B2E] border border-[#1E293B] flex items-start gap-3.5 shadow-md">
                <ShieldCheck className="w-6 h-6 text-[#2F6FED] shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <div className="font-bold text-white text-sm">HuboVerse Automation Specialist</div>
                  <div className="text-[11px] text-gray-400">
                    Verified international CRM delivery &amp; workflow engineering track record
                  </div>
                </div>
              </div>
            )}

            <div className="p-5 rounded-2xl bg-[#131B2E] border border-[#2F6FED]/30 flex items-start gap-3.5 shadow-md">
              <Clock className="w-6 h-6 text-[#2F6FED] shrink-0 mt-0.5" />
              <div className="space-y-1">
                <div className="font-bold text-white text-sm">{expert.experienceDisplay}</div>
                <div className="text-[11px] text-gray-400">
                  CRM architecture, automation pipelines and enterprise solutions
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 4. AREAS OF EXPERTISE */}
        <section className="bg-[#0B0F19] border border-[#1E293B] rounded-3xl p-8 sm:p-10 shadow-xl space-y-6">
          <div className="border-b border-[#1E293B] pb-4">
            <div className="text-xs font-mono uppercase text-[#2F6FED] tracking-wider font-semibold">
              Competencies &amp; Technical Toolkit
            </div>
            <h2 className="text-2xl font-bold text-white mt-1">Areas of Expertise</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
            {expert.skills.map((skill) => (
              <div
                key={skill}
                className="p-3.5 rounded-xl bg-[#101726] border border-[#1E293B] hover:border-[#2F6FED]/50 transition-colors flex items-center gap-2.5 text-xs text-gray-200"
              >
                <div className="p-1.5 rounded-lg bg-[#131B2E] border border-[#1E293B] shrink-0">
                  {getSkillIcon(skill)}
                </div>
                <span className="font-medium text-xs leading-snug">{skill}</span>
              </div>
            ))}
          </div>
        </section>

        {/* 5. RECORDED HUBSPOT TRAINING SESSIONS */}
        <RecordedTrainingSection expertName={expert.fullName} videos={recordedVideos} />

        {/* 6. AVAILABLE COURSES (Hide if empty) */}
        {courses.length > 0 && (
          <section id="courses" className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-[#1E293B] pb-4">
              <div>
                <div className="text-xs font-mono uppercase text-[#2F6FED] tracking-wider font-semibold">
                  Learning Academy Curriculum
                </div>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
                  Available Courses by {expert.fullName}
                </h2>
              </div>
              <span className="text-xs text-gray-400 font-mono">
                {courses.length} Certified Masterclass{courses.length === 1 ? '' : 'es'}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {courses.map((course) => (
                <div
                  key={course.id}
                  className="bg-[#0B0F19] border border-[#1E293B] rounded-2xl p-6 hover:border-[#2F6FED]/50 transition-all shadow-xl space-y-4 flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-[#2F6FED]/15 text-[#2F6FED] border border-[#2F6FED]/30">
                        {course.hubCategory} Hub
                      </span>
                      <span className="text-[11px] text-gray-400 font-medium">{course.level}</span>
                    </div>

                    <h3 className="text-lg font-bold text-white hover:text-[#2F6FED] transition-colors">
                      {course.title}
                    </h3>
                    <p className="text-xs text-gray-400 leading-relaxed">{course.description}</p>
                  </div>

                  <div className="pt-4 border-t border-[#1E293B] flex items-center justify-between text-xs text-gray-400">
                    <div className="flex items-center gap-4">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-gray-500" />
                        {course.estimatedHours} hrs
                      </span>
                      <span className="flex items-center gap-1 text-emerald-400 font-semibold">
                        <Star className="w-3 h-3 fill-emerald-400" />
                        {course.rating}
                      </span>
                    </div>

                    <Link
                      href="/app"
                      className="px-3.5 py-1.5 rounded-lg bg-[#2F6FED] hover:bg-[#2558c4] text-white font-bold text-xs transition-colors"
                    >
                      Enroll in Course
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* 7. UPCOMING LIVE CLASSES (Hide if empty) */}
        {liveClasses.length > 0 && (
          <section className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-[#1E293B] pb-4">
              <div>
                <div className="text-xs font-mono uppercase text-cyan-400 tracking-wider font-semibold">
                  LiveKit Cloud Coaching
                </div>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
                  Upcoming Live Classes
                </h2>
              </div>
              <span className="text-xs text-gray-400 font-mono">Real-Time Interactive Studios</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {liveClasses.map((session) => (
                <div
                  key={session.id}
                  className="bg-[#0B0F19] border border-[#1E293B] rounded-2xl p-6 hover:border-cyan-500/40 transition-all shadow-xl space-y-4 flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                        {session.durationMinutes} Minutes Live Studio
                      </span>
                      <span className="text-[11px] text-gray-400 font-mono">
                        Max {session.maxAttendees} Seats
                      </span>
                    </div>

                    <h3 className="text-lg font-bold text-white">{session.title}</h3>
                    <p className="text-xs text-gray-400 leading-relaxed">{session.description}</p>
                  </div>

                  <div className="pt-4 border-t border-[#1E293B] flex items-center justify-between text-xs text-gray-400">
                    <span className="flex items-center gap-1.5 text-white font-mono text-[11px]">
                      <Calendar className="w-3.5 h-3.5 text-cyan-400" />
                      {new Date(session.scheduledStartTime).toLocaleDateString(undefined, {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </span>

                    <Link
                      href="/app"
                      className="px-3.5 py-1.5 rounded-lg bg-[#131B2E] hover:bg-[#1E293B] text-cyan-400 font-semibold text-xs border border-cyan-500/30 transition-colors"
                    >
                      Reserve Seat
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* 8. ASK ANNA ABOUT THIS EXPERT */}
        <section
          id="ask-anna"
          className="rounded-3xl bg-gradient-to-r from-[#131B2E] via-[#0E1526] to-[#1E293B] border border-[#1E293B] p-8 sm:p-12 shadow-2xl relative overflow-hidden space-y-6"
        >
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 text-xs font-bold text-cyan-400">
                <Bot className="w-4 h-4" />
                <span>Ask Anna AI</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
                Have questions about {expert.fullName}&apos;s training or specialisations?
              </h2>
              <p className="text-xs sm:text-sm text-gray-300 max-w-2xl leading-relaxed">
                Anna uses verified HuboVerse curriculum and scheduling data to advise you on which of{' '}
                {expert.fullName}&apos;s tutorials or live workshops best fit your CRM requirements.
              </p>
            </div>

            <Link
              href="/app"
              className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-[#2F6FED] to-blue-600 text-white text-xs font-bold shadow-xl shadow-[#2F6FED]/25 hover:opacity-95 transition-all shrink-0 flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4" />
              <span>Ask Anna in Workspace</span>
            </Link>
          </div>

          {/* Quick Consultation Chips */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-4 border-t border-[#1E293B]">
            <Link
              href="/app"
              className="p-3.5 rounded-xl bg-[#0B0F19]/80 border border-[#1E293B] hover:border-cyan-500/50 text-xs text-gray-300 hover:text-white transition-all flex items-center justify-between group"
            >
              <span>&ldquo;What skills does {expert.fullName.split(' ')[0]} teach?&rdquo;</span>
              <ArrowRight className="w-3 h-3 text-cyan-400 group-hover:translate-x-1 transition-transform" />
            </Link>

            <Link
              href="/app"
              className="p-3.5 rounded-xl bg-[#0B0F19]/80 border border-[#1E293B] hover:border-cyan-500/50 text-xs text-gray-300 hover:text-white transition-all flex items-center justify-between group"
            >
              <span>&ldquo;Which courses are recommended for my team?&rdquo;</span>
              <ArrowRight className="w-3 h-3 text-cyan-400 group-hover:translate-x-1 transition-transform" />
            </Link>

            <Link
              href="/app"
              className="p-3.5 rounded-xl bg-[#0B0F19]/80 border border-[#1E293B] hover:border-cyan-500/50 text-xs text-gray-300 hover:text-white transition-all flex items-center justify-between group"
            >
              <span>&ldquo;Tell me about {expert.fullName.split(' ')[0]}&apos;s Loom tutorials&rdquo;</span>
              <ArrowRight className="w-3 h-3 text-cyan-400 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
