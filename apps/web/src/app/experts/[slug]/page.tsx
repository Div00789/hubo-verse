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
  Briefcase,
  Star,
  Bot,
  Video,
  Play,
  ShieldCheck,
  Check,
  Users,
  Workflow,
  Cpu,
  Layers,
  Settings,
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
} from '@huboverse/database';

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

  // Helper icon selector for skill cards
  const getSkillIcon = (skillName: string) => {
    const lower = skillName.toLowerCase();
    if (lower.includes('workflow') || lower.includes('automation')) {
      return <Workflow className="w-4 h-4 text-[#FF5C00]" />;
    }
    if (lower.includes('ai') || lower.includes('tools')) {
      return <Bot className="w-4 h-4 text-cyan-400" />;
    }
    if (lower.includes('crm') || lower.includes('hubspot')) {
      return <Layers className="w-4 h-4 text-orange-400" />;
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

      <main className="flex-1 max-w-7xl mx-auto px-6 py-12 space-y-16 w-full">
        {/* Back Link */}
        <div>
          <Link
            href="/experts"
            className="inline-flex items-center gap-1.5 text-xs text-gray-400 hover:text-white transition-colors"
          >
            &larr; Back to All Experts
          </Link>
        </div>

        {/* SECTION A: HERO SECTION */}
        <section className="bg-[#0B0F19] border border-[#1E293B] rounded-3xl p-8 sm:p-12 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#FF5C00]/10 rounded-full blur-3xl pointer-events-none" />

          <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 items-start lg:items-center relative z-10">
            {/* Large Professional Headshot */}
            <div className="relative w-44 h-44 sm:w-56 sm:h-56 rounded-3xl overflow-hidden border-2 border-[#1E293B] shadow-2xl shrink-0 bg-[#131B2E]">
              <Image
                src={expert.profileImagePath}
                alt={expert.fullName}
                fill
                sizes="(max-width: 640px) 176px, 224px"
                className="object-cover object-top"
                priority
              />
            </div>

            {/* Profile Overview Details */}
            <div className="space-y-4 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-[#FF5C00]/15 text-[#FF5C00] border border-[#FF5C00]/30">
                  {expert.experienceDisplay}
                </span>

                {expert.certifications.map((cert) => (
                  <span
                    key={cert}
                    className="px-3 py-1 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center gap-1"
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

              {/* CTAs */}
              <div className="pt-2 flex flex-wrap items-center gap-3">
                {courses.length > 0 && (
                  <a
                    href="#courses"
                    className="px-6 py-3 rounded-xl bg-[#FF5C00] hover:bg-[#FF7A00] text-white text-xs font-bold transition-all shadow-lg shadow-[#FF5C00]/25 flex items-center gap-2"
                  >
                    <BookOpen className="w-4 h-4" />
                    <span>View Courses ({courses.length})</span>
                  </a>
                )}

                <a
                  href="#ask-anna"
                  className="px-6 py-3 rounded-xl bg-[#131B2E] hover:bg-[#1E293B] text-white text-xs font-semibold border border-[#1E293B] transition-colors flex items-center gap-2"
                >
                  <Bot className="w-4 h-4 text-cyan-400" />
                  <span>Ask Anna About {expert.fullName.split(' ')[0]}</span>
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION B & C: ABOUT & AREAS OF EXPERTISE (2 Columns) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* SECTION B: About the Expert */}
          <section className="lg:col-span-7 bg-[#0B0F19] border border-[#1E293B] rounded-3xl p-8 sm:p-10 shadow-xl space-y-6">
            <div className="border-b border-[#1E293B] pb-4">
              <div className="text-xs font-mono uppercase text-[#FF5C00] tracking-wider font-semibold">
                Professional Background
              </div>
              <h2 className="text-2xl font-bold text-white mt-1">About the Expert</h2>
            </div>

            <div className="space-y-4 text-xs sm:text-sm text-gray-300 leading-relaxed whitespace-pre-line">
              {expert.fullBio}
            </div>

            {/* SECTION D: Verified Certifications */}
            {expert.certifications.length > 0 ? (
              <div className="pt-6 border-t border-[#1E293B] space-y-3">
                <div className="text-xs font-mono uppercase text-gray-400 tracking-wider">
                  Verified Industry Credentials
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {expert.certifications.map((cert) => (
                    <div
                      key={cert}
                      className="p-3.5 rounded-xl bg-[#131B2E] border border-emerald-500/30 flex items-center gap-3 text-xs text-white"
                    >
                      <Award className="w-5 h-5 text-emerald-400 shrink-0" />
                      <div>
                        <div className="font-bold">{cert}</div>
                        <div className="text-[10px] text-gray-400">Verified HuboVerse Instructor</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="pt-6 border-t border-[#1E293B] space-y-2">
                <div className="text-xs font-mono uppercase text-gray-400 tracking-wider">
                  Implementation Credentials
                </div>
                <div className="p-3.5 rounded-xl bg-[#131B2E] border border-[#1E293B] flex items-center gap-3 text-xs text-gray-300">
                  <ShieldCheck className="w-5 h-5 text-[#FF5C00] shrink-0" />
                  <div>
                    <div className="font-semibold text-white">HuboVerse Certified Automation Specialist</div>
                    <div className="text-[10px] text-gray-400">
                      Verified international CRM delivery &amp; workflow engineering track record
                    </div>
                  </div>
                </div>
              </div>
            )}
          </section>

          {/* SECTION C: Areas of Expertise */}
          <section className="lg:col-span-5 bg-[#0B0F19] border border-[#1E293B] rounded-3xl p-8 sm:p-10 shadow-xl space-y-6">
            <div className="border-b border-[#1E293B] pb-4">
              <div className="text-xs font-mono uppercase text-[#FF5C00] tracking-wider font-semibold">
                Competencies &amp; Toolkit
              </div>
              <h2 className="text-2xl font-bold text-white mt-1">Areas of Expertise</h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {expert.skills.map((skill) => (
                <div
                  key={skill}
                  className="p-3 rounded-xl bg-[#101726] border border-[#1E293B] hover:border-[#FF5C00]/40 transition-colors flex items-center gap-2.5 text-xs text-gray-200"
                >
                  <div className="p-1.5 rounded-lg bg-[#131B2E] border border-[#1E293B] shrink-0">
                    {getSkillIcon(skill)}
                  </div>
                  <span className="font-medium text-xs leading-snug">{skill}</span>
                </div>
              ))}
            </div>

            <div className="p-4 rounded-2xl bg-[#090D16] border border-[#1E293B] space-y-1.5 text-xs">
              <div className="text-gray-400 font-medium">Practitioner Engagement</div>
              <p className="text-[11px] text-gray-500 leading-relaxed">
                All training and workflows designed by {expert.fullName} conform to certified enterprise
                HubSpot standards with safe execution testing.
              </p>
            </div>
          </section>
        </div>

        {/* SECTION E: COURSES BY THIS EXPERT */}
        <section id="courses" className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-[#1E293B] pb-4">
            <div>
              <div className="text-xs font-mono uppercase text-[#FF5C00] tracking-wider font-semibold">
                Learning Academy Curriculum
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
                Courses by {expert.fullName}
              </h2>
            </div>
            <span className="text-xs text-gray-400 font-mono">
              {courses.length} Certified Masterclass{courses.length === 1 ? '' : 'es'}
            </span>
          </div>

          {courses.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {courses.map((course) => (
                <div
                  key={course.id}
                  className="bg-[#0B0F19] border border-[#1E293B] rounded-2xl p-6 hover:border-[#FF5C00]/50 transition-all shadow-xl space-y-4 flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-[#131B2E] text-[#FF5C00] border border-[#1E293B]">
                        {course.hubCategory} Hub
                      </span>
                      <span className="text-[11px] text-gray-400 font-medium">{course.level}</span>
                    </div>

                    <h3 className="text-lg font-bold text-white hover:text-[#FF5C00] transition-colors">
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
                      className="px-3 py-1.5 rounded-lg bg-[#FF5C00] hover:bg-[#FF7A00] text-white font-bold text-xs transition-colors"
                    >
                      Enroll in Course
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-8 rounded-2xl bg-[#0B0F19] border border-[#1E293B] text-center text-xs text-gray-400">
              No on-demand masterclasses currently published for this expert. Check back soon or request custom cohort training.
            </div>
          )}
        </section>

        {/* SECTION F: UPCOMING LIVE CLASSES */}
        <section className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-[#1E293B] pb-4">
            <div>
              <div className="text-xs font-mono uppercase text-cyan-400 tracking-wider font-semibold">
                LiveKit Cloud Coaching
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
                Upcoming Live Sessions
              </h2>
            </div>
            <span className="text-xs text-gray-400 font-mono">Real-Time Interactive Studios</span>
          </div>

          {liveClasses.length > 0 ? (
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
          ) : (
            <div className="p-8 rounded-2xl bg-[#0B0F19] border border-[#1E293B] text-center text-xs text-gray-400">
              No live classes currently scheduled for this week. Private enterprise coaching cohorts can be scheduled directly with HuboExperts.
            </div>
          )}
        </section>

        {/* SECTION G: RECORDED LECTURES & WORKSHOPS */}
        <section className="space-y-6">
          <div className="border-b border-[#1E293B] pb-4">
            <div className="text-xs font-mono uppercase text-[#FF5C00] tracking-wider font-semibold">
              Mux Video Library
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
              Recorded Workshops &amp; Masterclasses
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            <div className="bg-[#0B0F19] border border-[#1E293B] rounded-2xl p-5 space-y-3 hover:border-[#FF5C00]/40 transition-colors">
              <div className="h-32 rounded-xl bg-gradient-to-br from-[#131B2E] to-[#0E1526] border border-[#1E293B] flex items-center justify-center relative group/vid">
                <Play className="w-10 h-10 text-[#FF5C00] fill-[#FF5C00]/20 group-hover/vid:scale-110 transition-transform" />
                <span className="absolute bottom-2 right-2 px-1.5 py-0.5 rounded bg-black/70 text-[10px] text-gray-300 font-mono">
                  42:15
                </span>
              </div>
              <div className="font-bold text-white text-xs leading-snug">
                CRM Data Normalization &amp; Association Modeling
              </div>
              <div className="text-[11px] text-gray-400">
                Led by {expert.fullName} &bull; Streamed on Mux
              </div>
            </div>

            <div className="bg-[#0B0F19] border border-[#1E293B] rounded-2xl p-5 space-y-3 hover:border-[#FF5C00]/40 transition-colors">
              <div className="h-32 rounded-xl bg-gradient-to-br from-[#131B2E] to-[#0E1526] border border-[#1E293B] flex items-center justify-center relative group/vid">
                <Play className="w-10 h-10 text-[#FF5C00] fill-[#FF5C00]/20 group-hover/vid:scale-110 transition-transform" />
                <span className="absolute bottom-2 right-2 px-1.5 py-0.5 rounded bg-black/70 text-[10px] text-gray-300 font-mono">
                  38:50
                </span>
              </div>
              <div className="font-bold text-white text-xs leading-snug">
                High-Volume Workflow Logic &amp; Failure Recovery
              </div>
              <div className="text-[11px] text-gray-400">
                Led by {expert.fullName} &bull; Streamed on Mux
              </div>
            </div>

            <div className="bg-[#0B0F19] border border-[#1E293B] rounded-2xl p-5 space-y-3 hover:border-[#FF5C00]/40 transition-colors">
              <div className="h-32 rounded-xl bg-gradient-to-br from-[#131B2E] to-[#0E1526] border border-[#1E293B] flex items-center justify-center relative group/vid">
                <Play className="w-10 h-10 text-[#FF5C00] fill-[#FF5C00]/20 group-hover/vid:scale-110 transition-transform" />
                <span className="absolute bottom-2 right-2 px-1.5 py-0.5 rounded bg-black/70 text-[10px] text-gray-300 font-mono">
                  51:00
                </span>
              </div>
              <div className="font-bold text-white text-xs leading-snug">
                Anna AI Automation &amp; Dry-Run Operations
              </div>
              <div className="text-[11px] text-gray-400">
                Led by {expert.fullName} &bull; Streamed on Mux
              </div>
            </div>
          </div>
        </section>

        {/* SECTION H: ASK ANNA */}
        <section id="ask-anna" className="rounded-3xl bg-gradient-to-r from-[#131B2E] via-[#0E1526] to-[#1E293B] border border-[#1E293B] p-8 sm:p-12 shadow-2xl relative overflow-hidden space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 text-xs font-bold text-cyan-400">
                <Bot className="w-4 h-4" />
                <span>Ask Anna AI</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
                Have questions about {expert.fullName}&apos;s courses or specialisations?
              </h2>
              <p className="text-xs sm:text-sm text-gray-300 max-w-2xl leading-relaxed">
                Anna uses verified HuboVerse curriculum and scheduling data to advise you on which of{' '}
                {expert.fullName}&apos;s workshops best fit your CRM maturity level.
              </p>
            </div>

            <Link
              href="/app"
              className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-[#FF5C00] to-[#E04F00] text-white text-xs font-bold shadow-xl shadow-[#FF5C00]/25 hover:opacity-95 transition-all shrink-0 flex items-center gap-2"
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
              <span>&ldquo;When is {expert.fullName.split(' ')[0]}&apos;s next live class?&rdquo;</span>
              <ArrowRight className="w-3 h-3 text-cyan-400 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
