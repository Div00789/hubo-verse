'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  Users,
  Award,
  CheckCircle2,
  Edit3,
  Plus,
  Save,
  Trash2,
  Eye,
  EyeOff,
  Sparkles,
  Star,
  BookOpen,
  Calendar,
  AlertCircle,
  X,
  Upload,
  ArrowRight,
} from 'lucide-react';
import {
  DEMO_EXPERTS,
  getCoursesByExpertId,
  getLiveClassesByExpertId,
} from '@huboverse/database';
import type { ExpertProfile } from '@huboverse/types';

export const ExpertManagement: React.FC = () => {
  const [experts, setExperts] = useState<ExpertProfile[]>(DEMO_EXPERTS);
  const [selectedExpert, setSelectedExpert] = useState<ExpertProfile | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isCreating, setIsCreating] = useState(false);

  // Form State
  const [formData, setFormData] = useState<Partial<ExpertProfile>>({});
  const [newSkill, setNewSkill] = useState('');
  const [newCert, setNewCert] = useState('');
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const startEdit = (expert: ExpertProfile) => {
    setSelectedExpert(expert);
    setFormData({ ...expert });
    setIsEditing(true);
    setIsCreating(false);
    setSuccessMsg(null);
    setErrorMsg(null);
  };

  const startCreate = () => {
    const newTemplate: Partial<ExpertProfile> = {
      id: `exp_${Date.now()}`,
      slug: '',
      fullName: '',
      professionalTitle: '',
      shortBio: '',
      fullBio: '',
      yearsExperience: 1,
      experienceDisplay: '1+ Years of Experience',
      profileImagePath: '/experts/divyanshu-tuli.png',
      skills: [],
      certifications: [],
      isActive: true,
      isFeatured: false,
      displayOrder: experts.length + 1,
    };
    setSelectedExpert(null);
    setFormData(newTemplate);
    setIsEditing(true);
    setIsCreating(true);
    setSuccessMsg(null);
    setErrorMsg(null);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setLoading(true);

    // Validation
    if (!formData.fullName?.trim()) {
      setErrorMsg('Full Name is required.');
      setLoading(false);
      return;
    }
    if (!formData.professionalTitle?.trim()) {
      setErrorMsg('Professional Title is required.');
      setLoading(false);
      return;
    }
    if (!formData.shortBio?.trim()) {
      setErrorMsg('Short Biography is required.');
      setLoading(false);
      return;
    }

    const slug =
      formData.slug?.trim() ||
      formData.fullName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

    const updatedProfile: ExpertProfile = {
      id: formData.id || `exp_${Date.now()}`,
      userId: formData.userId || null,
      slug,
      fullName: formData.fullName,
      professionalTitle: formData.professionalTitle,
      shortBio: formData.shortBio,
      fullBio: formData.fullBio || formData.shortBio,
      yearsExperience: Number(formData.yearsExperience) || 1,
      experienceDisplay: formData.experienceDisplay || `${formData.yearsExperience}+ Years of Experience`,
      profileImagePath: formData.profileImagePath || '/experts/divyanshu-tuli.png',
      skills: formData.skills || [],
      certifications: formData.certifications || [],
      isActive: formData.isActive ?? true,
      isFeatured: formData.isFeatured ?? false,
      displayOrder: Number(formData.displayOrder) || 1,
      createdAt: formData.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setTimeout(() => {
      if (isCreating) {
        setExperts([...experts, updatedProfile]);
      } else {
        setExperts(experts.map((exp) => (exp.id === updatedProfile.id ? updatedProfile : exp)));
      }
      setLoading(false);
      setIsEditing(false);
      setSuccessMsg(`Successfully saved profile for ${updatedProfile.fullName}!`);
      setTimeout(() => setSuccessMsg(null), 4000);
    }, 600);
  };

  const togglePublish = (expertId: string) => {
    setExperts(
      experts.map((exp) => (exp.id === expertId ? { ...exp, isActive: !exp.isActive } : exp))
    );
  };

  const addSkill = () => {
    if (newSkill.trim() && !formData.skills?.includes(newSkill.trim())) {
      setFormData({
        ...formData,
        skills: [...(formData.skills || []), newSkill.trim()],
      });
      setNewSkill('');
    }
  };

  const removeSkill = (skillToRemove: string) => {
    setFormData({
      ...formData,
      skills: formData.skills?.filter((s) => s !== skillToRemove) || [],
    });
  };

  const addCert = () => {
    if (newCert.trim() && !formData.certifications?.includes(newCert.trim())) {
      setFormData({
        ...formData,
        certifications: [...(formData.certifications || []), newCert.trim()],
      });
      setNewCert('');
    }
  };

  const removeCert = (certToRemove: string) => {
    setFormData({
      ...formData,
      certifications: formData.certifications?.filter((c) => c !== certToRemove) || [],
    });
  };

  return (
    <div className="w-full max-w-6xl mx-auto space-y-8 pb-16">
      {/* Top Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#1E293B]">
        <div>
          <div className="text-xs font-mono uppercase text-[#FF5C00] tracking-wider font-semibold">
            Directory &amp; Instructor Management
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
            Learn from Industry Experts
          </h2>
          <p className="text-xs sm:text-sm text-gray-300 mt-1 max-w-2xl leading-relaxed">
            Gain practical insights, explore expert-led tutorials, and learn directly from experienced professionals.
          </p>
        </div>

        <button
          onClick={startCreate}
          className="px-4 py-2.5 rounded-xl bg-[#FF5C00] hover:bg-[#FF7A00] text-white text-xs font-bold transition-all shadow-md shadow-[#FF5C00]/20 flex items-center gap-2 self-start sm:self-auto shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Expert Profile</span>
        </button>
      </div>

      {/* Global Success Notification */}
      {successMsg && (
        <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Active Experts List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {experts.map((exp) => {
          const courses = getCoursesByExpertId(exp.id);
          const liveClasses = getLiveClassesByExpertId(exp.id);

          const isBlueTheme = exp.slug === 'divyanshu-tuli';
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

          return (
            <div
              key={exp.id}
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
                  src={exp.profileImagePath}
                  alt={exp.fullName}
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
                  {exp.isFeatured ? (
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
                    <span>{exp.experienceDisplay}</span>
                  </span>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-6 sm:p-7 flex-1 flex flex-col justify-between space-y-5 bg-[#0B0F19]">
                <div className="space-y-4">
                  {/* Name, Title & Order */}
                  <div className="space-y-1.5">
                    <div className="flex items-start justify-between gap-3">
                      <h3 className="font-extrabold text-[#FFFFFF] text-2xl tracking-tight">
                        {exp.fullName}
                      </h3>
                      <span className="text-[11px] font-mono text-gray-400 bg-[#131B2E] px-2.5 py-1 rounded-md border border-[#1E293B] shrink-0">
                        Order #{exp.displayOrder}
                      </span>
                    </div>
                    <p className={`text-sm font-semibold ${themeTitleColor} leading-snug`}>
                      {exp.professionalTitle}
                    </p>
                  </div>

                  {/* Verified Certifications */}
                  {exp.certifications && exp.certifications.length > 0 && (
                    <div className="flex flex-wrap gap-2 pt-1">
                      {exp.certifications.map((cert) => (
                        <span
                          key={cert}
                          className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold bg-[#2F6FED]/15 text-blue-200 border border-[#2F6FED]/30"
                        >
                          <Award className="w-3.5 h-3.5 text-[#2F6FED]" />
                          <span>{cert}</span>
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Biography */}
                  <p className="text-xs sm:text-sm text-gray-300 leading-relaxed line-clamp-3">
                    {exp.shortBio}
                  </p>

                  {/* Core Specialisations */}
                  <div className="space-y-2">
                    <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                      Core Specialisations
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {exp.skills.slice(0, 5).map((skill) => (
                        <span
                          key={skill}
                          className="px-2.5 py-1 rounded-lg text-xs bg-[#131B2E] text-gray-200 border border-[#1E293B]"
                        >
                          {skill}
                        </span>
                      ))}
                      {exp.skills.length > 5 && (
                        <span className="px-2.5 py-1 rounded-lg text-xs bg-[#131B2E] text-gray-400 border border-[#1E293B]">
                          +{exp.skills.length - 5} more
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Linked Academy Content */}
                  <div className="pt-3 border-t border-[#1E293B] flex items-center justify-between text-xs text-gray-300">
                    <div className="flex items-center gap-4">
                      <span className="flex items-center gap-1.5">
                        <BookOpen className="w-4 h-4 text-[#FF5C00]" />
                        <strong className="text-white font-bold">{courses.length}</strong> Courses
                      </span>
                      <span className="flex items-center gap-1.5">
                        <Calendar className="w-4 h-4 text-cyan-400" />
                        <strong className="text-white font-bold">{liveClasses.length}</strong> Live Workshops
                      </span>
                    </div>
                  </div>
                </div>

                {/* Primary Action Button — Single Full-Width "View Profile" Button */}
                <div className="pt-2">
                  <Link
                    href={`/experts/${exp.slug}`}
                    className={`w-full py-3.5 px-5 rounded-xl ${themeBtn} text-white font-bold text-sm shadow-lg transition-all duration-200 flex items-center justify-center gap-2 group/btn cursor-pointer`}
                  >
                    <span>View Profile</span>
                    <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1.5 transition-transform" />
                  </Link>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Profile Edit / Create Modal */}
      {isEditing && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-[#0B0F19] border border-[#1E293B] rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl p-6 sm:p-8 space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-[#1E293B]">
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-[#FF5C00]" />
                <h3 className="text-lg font-bold text-white">
                  {isCreating ? 'Create Expert Profile' : `Edit Profile — ${formData.fullName}`}
                </h3>
              </div>
              <button
                onClick={() => setIsEditing(false)}
                className="p-1 rounded-lg text-gray-400 hover:text-white hover:bg-[#131B2E]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {errorMsg && (
              <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            <form onSubmit={handleSave} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-gray-300">Full Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.fullName || ''}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    placeholder="e.g. Divyanshu Tuli"
                    className="w-full bg-[#131B2E] border border-[#1E293B] rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-[#FF5C00]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-gray-300">URL Slug *</label>
                  <input
                    type="text"
                    value={formData.slug || ''}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                    placeholder="e.g. divyanshu-tuli"
                    className="w-full bg-[#131B2E] border border-[#1E293B] rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-[#FF5C00]"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-gray-300">Professional Title *</label>
                <input
                  type="text"
                  required
                  value={formData.professionalTitle || ''}
                  onChange={(e) => setFormData({ ...formData, professionalTitle: e.target.value })}
                  placeholder="e.g. HubSpot & RevOps Certified Expert | AI Automation Specialist"
                  className="w-full bg-[#131B2E] border border-[#1E293B] rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-[#FF5C00]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-gray-300">Years Experience</label>
                  <input
                    type="number"
                    min="1"
                    value={formData.yearsExperience || 1}
                    onChange={(e) => setFormData({ ...formData, yearsExperience: Number(e.target.value) })}
                    className="w-full bg-[#131B2E] border border-[#1E293B] rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-[#FF5C00]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-gray-300">Experience Badge Display</label>
                  <input
                    type="text"
                    value={formData.experienceDisplay || ''}
                    onChange={(e) => setFormData({ ...formData, experienceDisplay: e.target.value })}
                    placeholder="e.g. 10+ Years of Experience"
                    className="w-full bg-[#131B2E] border border-[#1E293B] rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-[#FF5C00]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-gray-300">Display Order</label>
                  <input
                    type="number"
                    value={formData.displayOrder || 1}
                    onChange={(e) => setFormData({ ...formData, displayOrder: Number(e.target.value) })}
                    className="w-full bg-[#131B2E] border border-[#1E293B] rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-[#FF5C00]"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-gray-300">Headshot Image Path (or Supabase URL)</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={formData.profileImagePath || ''}
                    onChange={(e) => setFormData({ ...formData, profileImagePath: e.target.value })}
                    placeholder="/experts/divyanshu-tuli.png"
                    className="flex-1 bg-[#131B2E] border border-[#1E293B] rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-[#FF5C00]"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-gray-300">Short Professional Introduction *</label>
                <textarea
                  rows={2}
                  required
                  value={formData.shortBio || ''}
                  onChange={(e) => setFormData({ ...formData, shortBio: e.target.value })}
                  placeholder="1-2 sentences summarizing experience and expertise..."
                  className="w-full bg-[#131B2E] border border-[#1E293B] rounded-xl p-3 text-xs text-white focus:outline-none focus:border-[#FF5C00]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-gray-300">Full Professional Biography</label>
                <textarea
                  rows={4}
                  value={formData.fullBio || ''}
                  onChange={(e) => setFormData({ ...formData, fullBio: e.target.value })}
                  placeholder="Detailed biography..."
                  className="w-full bg-[#131B2E] border border-[#1E293B] rounded-xl p-3 text-xs text-white focus:outline-none focus:border-[#FF5C00]"
                />
              </div>

              {/* Skills Manager */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-gray-300">Core Specialisations &amp; Skills</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newSkill}
                    onChange={(e) => setNewSkill(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        addSkill();
                      }
                    }}
                    placeholder="Add skill (press Enter)..."
                    className="flex-1 bg-[#131B2E] border border-[#1E293B] rounded-xl px-4 py-2 text-xs text-white focus:outline-none focus:border-[#FF5C00]"
                  />
                  <button
                    type="button"
                    onClick={addSkill}
                    className="px-3.5 py-2 rounded-xl bg-[#1E293B] hover:bg-[#283548] text-white text-xs font-semibold"
                  >
                    Add
                  </button>
                </div>

                <div className="flex flex-wrap gap-1.5 max-h-32 overflow-y-auto pt-1">
                  {formData.skills?.map((skill) => (
                    <span
                      key={skill}
                      className="px-2.5 py-1 rounded-lg text-xs bg-[#131B2E] text-gray-300 border border-[#1E293B] flex items-center gap-1.5"
                    >
                      <span>{skill}</span>
                      <button
                        type="button"
                        onClick={() => removeSkill(skill)}
                        className="text-gray-500 hover:text-rose-400"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              {/* Certifications Manager */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-gray-300">Verified Certifications</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newCert}
                    onChange={(e) => setNewCert(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        addCert();
                      }
                    }}
                    placeholder="Add certification (e.g. HubSpot Certified)..."
                    className="flex-1 bg-[#131B2E] border border-[#1E293B] rounded-xl px-4 py-2 text-xs text-white focus:outline-none focus:border-[#FF5C00]"
                  />
                  <button
                    type="button"
                    onClick={addCert}
                    className="px-3.5 py-2 rounded-xl bg-[#1E293B] hover:bg-[#283548] text-white text-xs font-semibold"
                  >
                    Add
                  </button>
                </div>

                <div className="flex flex-wrap gap-1.5 pt-1">
                  {formData.certifications?.map((cert) => (
                    <span
                      key={cert}
                      className="px-2.5 py-1 rounded-lg text-xs bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center gap-1.5"
                    >
                      <Award className="w-3.5 h-3.5" />
                      <span>{cert}</span>
                      <button
                        type="button"
                        onClick={() => removeCert(cert)}
                        className="text-emerald-500 hover:text-rose-400 ml-1"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              {/* Switches: Active & Featured */}
              <div className="flex flex-wrap gap-6 pt-2">
                <label className="flex items-center gap-2.5 cursor-pointer text-xs">
                  <input
                    type="checkbox"
                    checked={formData.isActive ?? true}
                    onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                    className="rounded bg-[#131B2E] border-[#1E293B] text-[#FF5C00] focus:ring-[#FF5C00]"
                  />
                  <span className="text-white font-medium">Published / Visible in Public Directory</span>
                </label>

                <label className="flex items-center gap-2.5 cursor-pointer text-xs">
                  <input
                    type="checkbox"
                    checked={formData.isFeatured ?? false}
                    onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                    className="rounded bg-[#131B2E] border-[#1E293B] text-[#FF5C00] focus:ring-[#FF5C00]"
                  />
                  <span className="text-white font-medium">Mark as Featured Expert</span>
                </label>
              </div>

              {/* Form Action Buttons */}
              <div className="pt-4 border-t border-[#1E293B] flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-5 py-2.5 rounded-xl bg-[#131B2E] hover:bg-[#1E293B] text-gray-300 text-xs font-semibold transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-2.5 rounded-xl bg-[#FF5C00] hover:bg-[#FF7A00] text-white text-xs font-bold transition-all shadow-md shadow-[#FF5C00]/25 flex items-center gap-2"
                >
                  {loading ? (
                    <span>Saving...</span>
                  ) : (
                    <>
                      <Save className="w-3.5 h-3.5" />
                      <span>Save Profile Changes</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
