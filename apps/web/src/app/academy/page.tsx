import React from 'react';
import Link from 'next/link';
import {
  GraduationCap,
  Video,
  Radio,
  BookOpen,
  Calendar,
  Clock,
  CheckCircle2,
  Users,
  Award,
  ArrowRight,
  Sparkles,
  Play,
} from 'lucide-react';
import { SiteHeader } from '@/components/SiteHeader';
import { SiteFooter } from '@/components/SiteFooter';

export const metadata = {
  title: 'Learning Academy & Live Coaching — HuboVerse',
  description: 'Enterprise HubSpot training, LiveKit interactive coaching studios, and certified masterclasses.',
};

const COURSES = [
  {
    id: 'course-1',
    title: 'HubSpot Custom Objects & Relational Architecture',
    instructor: 'David Reynolds',
    role: 'Principal HubSpot Architect',
    level: 'Advanced',
    duration: '4h 30m',
    lessons: 12,
    badge: 'Popular',
    desc: 'Master 1-to-many and many-to-many associations, custom schema definitions, and automated deal pipeline synchronizations.',
  },
  {
    id: 'course-2',
    title: 'Enterprise Workflow Automation & Branching Logic',
    instructor: 'Elena Rostova',
    role: 'RevOps Specialist',
    level: 'Intermediate',
    duration: '3h 45m',
    lessons: 9,
    badge: 'Hands-on Labs',
    desc: 'Construct fault-tolerant multi-branch workflows with automated lead rotation, webhook enrichment, and SLA escalations.',
  },
  {
    id: 'course-3',
    title: 'Multi-Touch Revenue Attribution & Reporting',
    instructor: 'Marcus Chen',
    role: 'Head of Growth Operations',
    level: 'Advanced',
    duration: '5h 15m',
    lessons: 15,
    badge: 'Executive',
    desc: 'Deploy first-touch, last-touch, and W-shaped attribution models to prove marketing ROI across complex enterprise sales cycles.',
  },
  {
    id: 'course-4',
    title: 'Anna AI Prompt Engineering for CRM Specialists',
    instructor: 'Sarah Jenkins',
    role: 'Lead AI Engineer',
    level: 'All Levels',
    duration: '2h 30m',
    lessons: 8,
    badge: 'New',
    desc: 'Unleash Anna AI Chat & Build modes to diagnose property conflicts, generate dry-run diffs, and safely automate schema updates.',
  },
];

const UPCOMING_LIVE = [
  {
    date: 'Tomorrow, 2:00 PM EST',
    title: 'Live Workshop: Clean Up HubSpot Duplicate Data at Scale',
    host: 'David Reynolds',
    seats: '8 seats left',
    status: 'Upcoming',
  },
  {
    date: 'Friday, 11:00 AM EST',
    title: 'Interactive Studio: Building Custom Quotes & CPQ in HubSpot',
    host: 'Elena Rostova',
    seats: '14 seats left',
    status: 'Upcoming',
  },
];

export default function AcademyPage() {
  return (
    <div className="min-h-screen bg-[#06090F] text-white flex flex-col justify-between">
      <SiteHeader />

      <main className="flex-1 py-16 px-6 max-w-7xl mx-auto space-y-20">
        {/* Header Hero */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-400 font-semibold">
            <GraduationCap className="w-3.5 h-3.5" />
            <span>HuboVerse Academy &amp; LiveKit Studios</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-white">
            Transform Your Team into Certified HubSpot Masters
          </h1>
          <p className="text-sm sm:text-base text-gray-400 leading-relaxed">
            High-definition video curriculum powered by Mux, combined with interactive real-time coaching rooms powered by LiveKit. Taught by certified HuboExperts professionals.
          </p>

          <div className="pt-2 flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/app"
              className="px-6 py-3 rounded-xl bg-[#FF5C00] hover:bg-[#FF7A00] text-white font-bold text-sm transition-all shadow-lg shadow-[#FF5C00]/25 flex items-center gap-2"
            >
              <span>Explore Course Catalog</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/contact"
              className="px-6 py-3 rounded-xl bg-[#131B2E] hover:bg-[#1E293B] text-gray-300 hover:text-white font-semibold text-sm border border-[#1E293B] transition-colors"
            >
              Request Enterprise Cohort
            </Link>
          </div>
        </div>

        {/* LiveKit Studio Highlight */}
        <div className="bg-gradient-to-r from-[#101726] via-[#0B101D] to-[#141C30] border border-[#1E293B] rounded-2xl p-8 sm:p-10 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#FF5C00]/10 rounded-full blur-3xl pointer-events-none" />
          <div className="relative z-10 grid md:grid-cols-2 gap-8 items-center">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/20 text-xs text-rose-400 font-semibold">
                <Radio className="w-3.5 h-3.5 animate-pulse" />
                <span>Real-Time LiveKit Infrastructure</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
                Interactive Group Workshops &amp; 1-on-1 Office Hours
              </h2>
              <p className="text-xs sm:text-sm text-gray-300 leading-relaxed">
                Connect directly with certified HubSpot solution architects in low-latency WebRTC studios. Share your screen, debug live portal schemas together, and get instantaneous guidance.
              </p>
              <ul className="space-y-2 text-xs text-gray-300">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Interactive screen-sharing with synchronized schema sandbox</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Breakout rooms for team RevOps sprint planning</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Automated transcript &amp; recording archive stored directly in your portal</span>
                </li>
              </ul>
            </div>

            {/* Upcoming Live Sessions Card */}
            <div className="bg-[#090D16] border border-[#1E293B] rounded-xl p-6 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-[#1E293B]">
                <div className="flex items-center gap-2 text-sm font-bold text-white">
                  <Calendar className="w-4 h-4 text-[#FF5C00]" />
                  <span>Upcoming Live Classes</span>
                </div>
                <span className="text-[11px] text-emerald-400 font-medium">Updated today</span>
              </div>

              <div className="space-y-3">
                {UPCOMING_LIVE.map((session, idx) => (
                  <div key={idx} className="p-3.5 rounded-lg bg-[#101728] border border-[#1E293B] space-y-1.5">
                    <div className="flex items-center justify-between text-[11px] text-gray-400">
                      <span className="text-[#FF5C00] font-semibold">{session.date}</span>
                      <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px]">
                        {session.seats}
                      </span>
                    </div>
                    <div className="text-xs font-semibold text-white">{session.title}</div>
                    <div className="text-[11px] text-gray-400 flex items-center gap-1.5">
                      <Users className="w-3 h-3 text-gray-500" />
                      <span>Led by {session.host}</span>
                    </div>
                  </div>
                ))}
              </div>

              <Link
                href="/app"
                className="w-full py-2.5 rounded-lg bg-[#1E293B] hover:bg-[#283548] text-center text-xs font-semibold text-white block transition-colors border border-[#1E293B]"
              >
                Join Live Class in App
              </Link>
            </div>
          </div>
        </div>

        {/* Masterclass Video Catalog */}
        <div className="space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <div className="text-xs font-bold text-[#FF5C00] uppercase tracking-wider">Mux On-Demand Masterclasses</div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">Featured Video Curriculum</h2>
            </div>
            <Link
              href="/app"
              className="text-xs font-semibold text-[#FF5C00] hover:underline inline-flex items-center gap-1"
            >
              <span>View all 34 courses in App</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {COURSES.map((course) => (
              <div
                key={course.id}
                className="bg-[#0B0F19] border border-[#1E293B] rounded-2xl p-6 hover:border-[#FF5C00]/40 transition-all space-y-4 flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-[#131B2E] text-[#FF5C00] border border-[#1E293B]">
                      {course.badge}
                    </span>
                    <span className="text-[11px] text-gray-400 font-medium">{course.level}</span>
                  </div>
                  <h3 className="text-lg font-bold text-white hover:text-[#FF5C00] transition-colors cursor-pointer">
                    {course.title}
                  </h3>
                  <p className="text-xs text-gray-400 leading-relaxed">{course.desc}</p>
                </div>

                <div className="pt-4 border-t border-[#1E293B] flex items-center justify-between text-xs text-gray-400">
                  <div className="flex items-center gap-4">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-gray-500" />
                      {course.duration}
                    </span>
                    <span className="flex items-center gap-1">
                      <Play className="w-3.5 h-3.5 text-gray-500" />
                      {course.lessons} lessons
                    </span>
                  </div>
                  <Link
                    href="/app"
                    className="text-xs font-semibold text-[#FF5C00] hover:underline"
                  >
                    Start Course &rarr;
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="text-center rounded-2xl bg-gradient-to-r from-[#131B2E] to-[#1E293B] border border-[#1E293B] p-10 space-y-4">
          <Award className="w-10 h-10 text-[#FF5C00] mx-auto" />
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white">Earn Recognized HubSpot Certification</h2>
          <p className="text-xs sm:text-sm text-gray-300 max-w-xl mx-auto leading-relaxed">
            Every course completion awards a cryptographically verifiable HuboVerse Certificate of Mastery recognized by leading RevOps hiring managers.
          </p>
          <div className="pt-2">
            <Link
              href="/app"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#FF5C00] hover:bg-[#FF7A00] text-white font-bold text-xs transition-all shadow-md"
            >
              <span>Enroll in HuboVerse Workspace</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
