import React from 'react';
import { BookOpen, Video, Star, Clock, Users, Calendar, Play } from 'lucide-react';
import { DEMO_COURSES, DEMO_LIVE_CLASSES } from '@huboverse/database';

export const AcademyCatalog: React.FC = () => {
  return (
    <div className="w-full p-4 sm:p-6 lg:p-8 max-w-6xl mx-auto space-y-8 pb-16">
      {/* Live Classes Section (LiveKit Integration) */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping" />
              <h2 className="text-base sm:text-lg font-bold text-white">Live Classes & Workshops (LiveKit Cloud)</h2>
            </div>
            <p className="text-xs text-gray-400">
              Interactive instructor-led studio sessions with LiveKit real-time audio/video and cloud egress.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
          {DEMO_LIVE_CLASSES.map((cls) => (
            <div
              key={cls.id}
              className="bg-[#0F172A] border border-[#1E293B] rounded-2xl p-5 hover:border-[#FF5C00]/40 transition-colors shadow-lg flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between text-xs mb-2">
                  <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-mono text-[10px] font-semibold">
                    {cls.status}
                  </span>
                  <div className="flex items-center gap-1 text-gray-400 text-[11px]">
                    <Users className="w-3 h-3" />
                    <span>Max {cls.maxAttendees}</span>
                  </div>
                </div>

                <h3 className="text-sm font-bold text-white leading-snug">{cls.title}</h3>
                <p className="text-xs text-gray-400 mt-1 line-clamp-2">{cls.description}</p>

                <div className="mt-3 flex items-center gap-3 text-xs text-gray-300">
                  <div className="flex items-center gap-1 text-[11px]">
                    <Calendar className="w-3.5 h-3.5 text-[#FF5C00]" />
                    <span>{new Date(cls.scheduledStartTime).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center gap-1 text-[11px]">
                    <Clock className="w-3.5 h-3.5 text-gray-400" />
                    <span>{cls.durationMinutes} mins</span>
                  </div>
                </div>
              </div>

              <div className="mt-5 pt-3 border-t border-[#1E293B] flex items-center justify-between">
                <span className="text-xs text-gray-400 font-medium">Instructor: {cls.instructorName}</span>
                <button
                  onClick={() => alert(`Connecting to LiveKit Room: ${cls.roomName}...`)}
                  className="px-3 py-1.5 rounded-lg bg-[#FF5C00] hover:bg-[#FF7A00] text-white text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-md shadow-[#FF5C00]/20"
                >
                  <Video className="w-3.5 h-3.5" />
                  <span>Join LiveKit Room</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* On-Demand Courses (Mux Video Integration) */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-bold text-white">HuboVerse Learning Academy</h2>
            <p className="text-xs text-gray-400">
              Curated masterclasses with Mux HLS streaming, assessments, and verifiable certifications.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
          {DEMO_COURSES.map((course) => (
            <div
              key={course.id}
              className="bg-[#0F172A] border border-[#1E293B] rounded-2xl overflow-hidden hover:border-[#FF5C00]/40 transition-colors shadow-lg flex flex-col justify-between"
            >
              {/* Thumbnail Placeholder */}
              <div className="h-32 bg-gradient-to-tr from-[#131B2E] via-[#1E293B] to-[#0F172A] p-4 flex flex-col justify-between relative">
                <div className="flex items-center justify-between">
                  <span className="px-2 py-0.5 rounded bg-black/40 text-[10px] text-[#FF5C00] font-mono font-semibold uppercase">
                    {course.hubCategory} Hub
                  </span>
                  <div className="flex items-center gap-1 text-amber-400 text-xs font-semibold">
                    <Star className="w-3 h-3 fill-amber-400" />
                    <span>{course.rating}</span>
                  </div>
                </div>
                <div className="w-8 h-8 rounded-full bg-[#FF5C00]/90 text-white flex items-center justify-center self-center shadow-lg">
                  <Play className="w-4 h-4 ml-0.5" />
                </div>
                <span className="text-[10px] text-gray-400 self-end font-mono">
                  {course.estimatedHours} Hours
                </span>
              </div>

              <div className="p-4 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-xs font-bold text-white line-clamp-2">{course.title}</h3>
                  <p className="text-[11px] text-gray-400 mt-1 line-clamp-2">{course.description}</p>
                </div>

                <div className="mt-4 pt-3 border-t border-[#1E293B] flex items-center justify-between text-[11px]">
                  <span className="text-gray-400">{course.totalEnrollments} Students</span>
                  <button className="text-[#FF5C00] hover:text-[#FF7A00] font-semibold flex items-center gap-1">
                    <span>View Syllabus</span>
                    <BookOpen className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
