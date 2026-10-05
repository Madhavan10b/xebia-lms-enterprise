import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Award, 
  Download, 
  Share2, 
  X, 
  CheckCircle2, 
  Lock, 
  ArrowRight,
  Bookmark,
  Calendar,
  Search,
  Bell,
  Settings
} from 'lucide-react';
import { useToast } from '../context/ToastContext';

interface CourseCertificate {
  id: number;
  courseTitle: string;
  batchCode: string;
  progressPercentage: number;
  completedDate?: string;
  credentialId?: string;
  isUnlocked: boolean;
  syllabusOverview: string;
}

const getScallopPath = (cx: number, cy: number, rMax: number, rMin: number, steps: number) => {
  let d = "";
  for (let i = 0; i < steps; i++) {
    const a1 = (i * 2 * Math.PI) / steps;
    const aMid = ((i + 0.5) * 2 * Math.PI) / steps;
    const a2 = ((i + 1) * 2 * Math.PI) / steps;
    
    const xStart = cx + rMin * Math.cos(a1);
    const yStart = cy + rMin * Math.sin(a1);
    
    const xCtrl = cx + rMax * Math.cos(aMid);
    const yCtrl = cy + rMax * Math.sin(aMid);
    
    const xEnd = cx + rMin * Math.cos(a2);
    const yEnd = cy + rMin * Math.sin(a2);
    
    if (i === 0) {
      d += `M ${xStart} ${yStart}`;
    }
    d += ` Q ${xCtrl} ${yCtrl} ${xEnd} ${yEnd}`;
  }
  d += " Z";
  return d;
};

export const CertificatePage: React.FC = () => {
  const { showToast } = useToast();

  const [activeCertificate, setActiveCertificate] = useState<CourseCertificate | null>(null);

  // Load dynamic username from session
  const currentUser = useMemo(() => {
    const saved = localStorage.getItem('currentUser');
    return saved ? JSON.parse(saved) : { name: 'Student User', email: 'student@xebia.com', role: 'student' };
  }, []);

  // Certificates Database
  const certificatesDatabase: CourseCertificate[] = [
    {
      id: 1,
      courseTitle: 'UI/UX Design Principles & Design Systems',
      batchCode: 'BATCH A',
      progressPercentage: 100,
      completedDate: '12/07/2026',
      credentialId: 'XEB-UX-990812',
      isUnlocked: true,
      syllabusOverview: 'Figma layout components, typography hierarchies, micro-interactions, layout grids, and brand guidelines.'
    },
    {
      id: 2,
      courseTitle: 'React Frontend Development & App Router Architecture',
      batchCode: 'BATCH B',
      progressPercentage: 65,
      isUnlocked: false,
      syllabusOverview: 'Next.js 15 routing parameters, client vs server rendering, Redux RTK hooks, and tailwind variables.'
    },
    {
      id: 3,
      courseTitle: 'Node.js Backend Relational Schema Normalization',
      batchCode: 'BATCH C',
      progressPercentage: 35,
      isUnlocked: false,
      syllabusOverview: 'Entity relationships, 1NF/2NF/3NF schema rules, transaction logs, and API index routes.'
    }
  ];

  const handleDownload = (courseName: string) => {
    showToast(`Generating high-resolution PDF for "${courseName}"...`);
  };

  const handleShare = () => {
    showToast('Credential link copied to clipboard!');
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex-grow flex flex-col gap-6 md:gap-8 pb-10 relative"
    >
      {/* Top Search & Profile Panel */}
      <div className="flex flex-col md:flex-row justify-between items-stretch md:items-center gap-4 bg-white/45 backdrop-blur-md border border-neutral-200/40 p-4 rounded-2xl shadow-[0_2px_12px_rgba(0,0,0,0.01)]">
        <div className="relative flex-1 max-w-md">
          <input 
            type="text" 
            placeholder="Search credentials, syllabuses, grades..." 
            className="w-full bg-white border border-neutral-200 rounded-xl py-2 px-4 pl-10 text-xs font-semibold text-neutral-800 placeholder-neutral-400 outline-none focus:border-brand-primary/40 focus:ring-2 focus:ring-brand-primary/5 transition-all"
          />
          <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
        </div>
        <div className="flex items-center justify-end gap-3.5">
          <button className="relative p-2 rounded-xl bg-white border border-neutral-200 text-neutral-600 hover:text-brand-primary hover:border-brand-primary/20 transition-all">
            <Bell className="w-4 h-4" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-brand-cta rounded-full"></span>
          </button>
          <button className="p-2 rounded-xl bg-white border border-neutral-200 text-neutral-600 hover:text-brand-primary hover:border-brand-primary/20 transition-all">
            <Settings className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Page Header */}
      <div className="text-left border-b border-neutral-200/60 pb-5">
        <h2 className="text-xl md:text-2xl font-black text-brand-primaryDark tracking-tight">
          My Certificates
        </h2>
        <p className="text-brand-muted text-xs md:text-sm leading-relaxed mt-0.5">
          Earn professional credentials after completing your course curriculums and quizzes.
        </p>
      </div>

      {/* Grid List layout (Standard compiled grid-cols-3) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {certificatesDatabase.map((cert) => {
          return (
            <motion.div
              layout
              key={cert.id}
              className={`bg-white border rounded-3xl p-5 shadow-xs relative flex flex-col justify-between text-left hover:shadow-md transition-all duration-200 ${
                cert.isUnlocked 
                  ? 'border-brand-primary/20 bg-gradient-to-br from-white to-brand-primary/[0.02]' 
                  : 'border-neutral-200 opacity-90'
              }`}
            >
              {/* Badge Icon Header */}
              <div className="flex items-start justify-between">
                <div className={`w-11 h-11 rounded-xl flex items-center justify-center border shrink-0 ${
                  cert.isUnlocked 
                    ? 'bg-brand-primary/5 text-brand-primary border-brand-primary/10' 
                    : 'bg-neutral-50 text-neutral-400 border-neutral-100'
                }`}>
                  {cert.isUnlocked ? <Award className="w-5 h-5" /> : <Lock className="w-5 h-5" />}
                </div>

                <span className={`text-[8px] font-black uppercase tracking-wider px-2 py-0.5 rounded ${
                  cert.isUnlocked 
                    ? 'bg-brand-success/5 text-brand-success border border-brand-success/15' 
                    : 'bg-neutral-100 text-neutral-400'
                }`}>
                  {cert.isUnlocked ? 'COMPLETED' : 'IN PROGRESS'}
                </span>
              </div>

              {/* Course Title and details */}
              <div className="mt-4 flex-grow text-left">
                <span className="text-[9px] font-black uppercase tracking-wider text-brand-muted">
                  {cert.batchCode}
                </span>
                <h4 className="font-extrabold text-xs text-neutral-900 mt-1 leading-snug">
                  {cert.courseTitle}
                </h4>
                <p className="text-[9px] text-neutral-500 font-semibold mt-2 leading-relaxed line-clamp-2">
                  {cert.syllabusOverview}
                </p>
              </div>

              {/* Progress slider bar */}
              <div className="mt-5 mb-5 text-left">
                <div className="flex justify-between items-center text-[10px] font-black text-neutral-500 mb-1.5">
                  <span>Course Progress</span>
                  <span className={cert.isUnlocked ? 'text-brand-success' : 'text-brand-primary'}>
                    {cert.progressPercentage}%
                  </span>
                </div>
                <div className="w-full h-1.5 bg-neutral-100 rounded-full overflow-hidden">
                  <div 
                    className={`h-full rounded-full transition-all duration-300 ${
                      cert.isUnlocked ? 'bg-brand-success' : 'bg-brand-primary'
                    }`}
                    style={{ width: `${cert.progressPercentage}%` }}
                  ></div>
                </div>
              </div>

              {/* Claim / locked actions */}
              <div className="border-t border-neutral-50 pt-4 flex items-center justify-between">
                <span className="text-[9px] text-neutral-400 font-extrabold">
                  {cert.isUnlocked ? `Earned ${cert.completedDate}` : 'Remaining units left'}
                </span>

                {cert.isUnlocked ? (
                  <button
                    onClick={() => setActiveCertificate(cert)}
                    className="bg-brand-primary hover:bg-brand-primaryDark text-white font-extrabold text-[10px] py-1.5 px-4 rounded-lg flex items-center gap-1 transition-all"
                  >
                    View Certificate <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                ) : (
                  <button
                    disabled
                    className="bg-neutral-100 text-neutral-400 font-extrabold text-[10px] py-1.5 px-4 rounded-lg flex items-center gap-1 cursor-not-allowed"
                  >
                    Locked
                  </button>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Certificate Viewer Lightbox Overlay */}
      <AnimatePresence>
        {activeCertificate && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-900/60 backdrop-blur-xs">
            <style>{`
              @import url('https://fonts.googleapis.com/css2?family=Alex+Brush&family=Playfair+Display:ital,wght@0,600;0,700;0,900;1,400;1,700&family=Montserrat:wght@400;500;600;700;800&display=swap');
            `}</style>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl border border-neutral-200/40 shadow-2xl max-w-3xl w-full p-5 text-center relative overflow-hidden"
            >
              {/* Close button */}
              <button 
                onClick={() => setActiveCertificate(null)}
                className="absolute top-4 right-4 p-1.5 rounded-lg text-brand-muted hover:text-red-500 hover:bg-neutral-50 transition-all z-10"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Certificate Template Card */}
              <div className="border border-[#C5A059] p-1 bg-white relative mx-auto max-w-full">
                <div className="border-[3.5px] border-[#6C1D5F] p-0.5 bg-white relative">
                  <div className="border border-[#C5A059] relative p-8 rounded-none bg-[#FAF9F5] text-center select-none overflow-hidden my-0.5 shadow-inner">
                    
                    {/* Background watermark Xebia X logo */}
                    <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none opacity-[0.012] text-[#6C1D5F]">
                      <svg className="w-72 h-72" viewBox="0 0 100 100" fill="currentColor">
                        <path d="M22.5 5.5H35.5L47.5 24.5L59.5 5.5H72.5L54.5 28.5L72.5 51.5H59.5L47.5 32.5L35.5 51.5H22.5L40.5 28.5L22.5 5.5Z" />
                      </svg>
                    </div>

                    {/* SVG Corner Triangles (Top-Right & Bottom-Left) */}
                    {/* Top-Right Corner */}
                    <svg className="absolute top-0 right-0 w-48 h-48 pointer-events-none" viewBox="0 0 100 100" preserveAspectRatio="none">
                      <defs>
                        <linearGradient id="goldCornerGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" stopColor="#C5A059" />
                          <stop offset="35%" stopColor="#F3E7C4" />
                          <stop offset="65%" stopColor="#B8860B" />
                          <stop offset="100%" stopColor="#E6CA97" />
                        </linearGradient>
                      </defs>
                      {/* Purple corner background */}
                      <polygon points="100,0 35,0 100,65" fill="#6C1D5F" />
                      {/* White line divider */}
                      <polygon points="100,65 100,68 32,0 35,0" fill="#FAF9F5" />
                      {/* Gold band */}
                      <polygon points="100,0 52,0 100,48" fill="url(#goldCornerGrad)" />
                      {/* White stripe divider inside gold tip */}
                      <line x1="51.5" y1="0" x2="100" y2="48.5" stroke="#FFFFFF" strokeWidth="0.8" />
                      {/* Gold tip */}
                      <polygon points="100,0 75,0 100,25" fill="url(#goldCornerGrad)" />
                    </svg>

                    {/* Bottom-Left Corner */}
                    <svg className="absolute bottom-0 left-0 w-48 h-48 pointer-events-none" viewBox="0 0 100 100" preserveAspectRatio="none">
                      {/* Purple corner background */}
                      <polygon points="0,100 0,35 65,100" fill="#6C1D5F" />
                      {/* White line divider */}
                      <polygon points="0,35 0,32 68,100 65,100" fill="#FAF9F5" />
                      {/* Gold band */}
                      <polygon points="0,100 0,52 48,100" fill="url(#goldCornerGrad)" />
                      {/* White stripe divider inside gold tip */}
                      <line x1="0" y1="51.5" x2="48.5" y2="100" stroke="#FFFFFF" strokeWidth="0.8" />
                      {/* Gold tip */}
                      <polygon points="0,100 0,75 25,100" fill="url(#goldCornerGrad)" />
                      
                      {/* Dot Grid Pattern in Bottom-Left Corner */}
                      <circle cx="6" cy="94" r="0.8" fill="#FFFFFF" opacity="0.35" />
                      <circle cx="11" cy="89" r="0.8" fill="#FFFFFF" opacity="0.35" />
                      <circle cx="16" cy="84" r="0.8" fill="#FFFFFF" opacity="0.35" />
                      <circle cx="6" cy="89" r="0.8" fill="#FFFFFF" opacity="0.35" />
                      <circle cx="11" cy="84" r="0.8" fill="#FFFFFF" opacity="0.35" />
                      <circle cx="6" cy="84" r="0.8" fill="#FFFFFF" opacity="0.35" />
                      <circle cx="21" cy="79" r="0.8" fill="#FFFFFF" opacity="0.35" />
                    </svg>

                    {/* Security Wavy Guilloche Background Lines */}
                    <svg className="absolute inset-0 w-full h-full opacity-[0.025] pointer-events-none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M 0,20 C 150,110 350,10 500,80 C 650,150 850,40 1000,90" fill="none" stroke="#6C1D5F" strokeWidth="1" />
                      <path d="M 0,40 C 180,160 300,30 520,110 C 740,190 800,80 1000,130" fill="none" stroke="#6C1D5F" strokeWidth="1" />
                      <path d="M 0,70 C 120,180 280,50 490,140 C 700,230 850,70 1000,170" fill="none" stroke="#6C1D5F" strokeWidth="1" />
                    </svg>

                    {/* Top Left Xebia Corporate Header Logo */}
                    <div className="flex justify-start pl-4 mt-2 mb-2 select-none relative z-10">
                      <div className="flex flex-col items-start">
                        <svg className="h-9 w-auto" viewBox="0 0 160 56" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M22.5 5.5H35.5L47.5 24.5L59.5 5.5H72.5L54.5 28.5L72.5 51.5H59.5L47.5 32.5L35.5 51.5H22.5L40.5 28.5L22.5 5.5Z" fill="#6C1D5F" />
                          <text x="74" y="38" fontFamily="Outfit, sans-serif" fontWeight="900" fontSize="34" fill="#6C1D5F" letterSpacing="-1.5">ebia</text>
                        </svg>
                        <div className="text-[5.5px] font-bold uppercase tracking-[0.22em] text-[#6C1D5F]/60 mt-0.5 pl-5.5">
                          TRANSFORM • INNOVATE • ACCELERATE
                        </div>
                      </div>
                    </div>

                    {/* Certificate Main Title Header */}
                    <div className="flex flex-col items-center mt-3 relative z-10">
                      <h3 
                        style={{ fontFamily: "'Playfair Display', serif", letterSpacing: '4px' }}
                        className="text-3xl font-bold text-[#6C1D5F]"
                      >
                        CERTIFICATE
                      </h3>

                      {/* OF COMPLETION spacer row */}
                      <div className="flex items-center justify-center gap-3.5 w-full max-w-sm mt-1">
                        <div className="h-[0.8px] bg-[#C5A059] flex-1"></div>
                        <span 
                          style={{ fontFamily: "'Montserrat', sans-serif", letterSpacing: '2px' }}
                          className="text-[9.5px] font-extrabold text-[#6C1D5F]"
                        >
                          OF COMPLETION
                        </span>
                        <div className="h-[0.8px] bg-[#C5A059] flex-1"></div>
                      </div>

                      {/* Tiny Gold Diamond Flourish */}
                      <div className="flex justify-center mt-1.5 text-[#C5A059] text-[7px] tracking-widest">
                        ♦ ✦ ♦
                      </div>
                    </div>

                    {/* Credential Recipient Text */}
                    <div className="mt-4 relative z-10">
                      <p 
                        style={{ fontFamily: "'Montserrat', sans-serif" }}
                        className="text-[9.5px] font-semibold text-neutral-500 uppercase tracking-wider"
                      >
                        THIS IS TO CERTIFY THAT
                      </p>

                      {/* Cursive script recipient name */}
                      <h2 
                        style={{ fontFamily: "'Alex Brush', cursive" }}
                        className="text-4xl md:text-5xl text-[#6C1D5F] mt-2 mb-1.5 drop-shadow-[0_1px_1px_rgba(0,0,0,0.02)]"
                      >
                        {currentUser.name}
                      </h2>

                      {/* Horizontal gold line below name */}
                      <div className="w-64 h-[1px] bg-[#C5A059]/40 mx-auto my-3"></div>

                      <p 
                        style={{ fontFamily: "'Montserrat', sans-serif" }}
                        className="text-[10px] text-neutral-500 font-medium"
                      >
                        has successfully completed the training program on
                      </p>

                      {/* Course name block */}
                      <h4 
                        style={{ fontFamily: "'Montserrat', sans-serif" }}
                        className="text-xs md:text-sm font-extrabold text-[#6C1D5F] mt-2 leading-relaxed max-w-md mx-auto"
                      >
                        {activeCertificate.courseTitle}
                      </h4>

                      <p 
                        style={{ fontFamily: "'Montserrat', sans-serif" }}
                        className="text-[9px] text-neutral-500 font-semibold mt-1"
                      >
                        conducted by Xebia.
                      </p>
                    </div>

                    {/* Date & ID Grid Row */}
                    <div className="flex items-center justify-center gap-4 mt-6 text-[9.5px] text-neutral-500 font-bold relative z-10">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-[#6C1D5F]/75" />
                        <span>Date: {activeCertificate.completedDate ? activeCertificate.completedDate : '25 May 2026'}</span>
                      </div>
                      <span className="text-[#C5A059] opacity-60">|</span>
                      <div className="flex items-center gap-1.5">
                        <Award className="w-3.5 h-3.5 text-[#6C1D5F]/75" />
                        <span>Certificate ID: {activeCertificate.credentialId || 'XEB/2026/0525'}</span>
                      </div>
                    </div>

                    {/* Signatures Bottom Layout */}
                    <div className="grid grid-cols-3 gap-4 w-full mt-7 relative z-10 items-end px-3">
                      {/* Signature 1 (Left - Aditya Rao replacing Rohit Kapoor) */}
                      <div className="flex flex-col items-center text-center">
                        <span 
                          style={{ fontFamily: "'Alex Brush', cursive" }}
                          className="text-lg text-[#6C1D5F] leading-none mb-1 rotate-[-2deg]"
                        >
                          Aditya Rao
                        </span>
                        <div className="w-24 border-b border-neutral-300 my-0.5"></div>
                        <span className="text-[8px] font-bold text-neutral-800 tracking-tight leading-normal">Aditya Rao</span>
                        <span className="text-[7px] font-semibold text-neutral-500 uppercase tracking-wider leading-none">Head - Learning & Development</span>
                        <span className="text-[6.5px] font-bold text-[#6C1D5F] uppercase mt-0.5">Xebia</span>
                      </div>

                      {/* Center Medal Seal with Purple Ribbons */}
                      <div className="flex flex-col items-center justify-center relative h-16 select-none mt-2">
                        {/* Master SVG containing Ribbons, Scallops, Laurels, and Centered X */}
                        <svg className="w-[68px] h-[84px] filter drop-shadow-[0_2.5px_4px_rgba(0,0,0,0.12)]" viewBox="0 0 100 120" xmlns="http://www.w3.org/2000/svg">
                          <defs>
                            <linearGradient id="sealGoldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                              <stop offset="0%" stopColor="#FFE8A3" />
                              <stop offset="35%" stopColor="#E4C068" />
                              <stop offset="65%" stopColor="#C99E41" />
                              <stop offset="100%" stopColor="#8F6A15" />
                            </linearGradient>
                            <g id="leftLaurel" fill="#8F6A15" opacity="0.95">
                              {/* Stem */}
                              <path d="M 32.5,60.5 C 24,56.5 22,42.5 27,29.5" fill="none" stroke="#8F6A15" strokeWidth="1.2" strokeLinecap="round" />
                              {/* Leaves pointing upward/inward along the stem */}
                              <path d="M 32.5,58.5 C 29.5,55.5 29.5,52.5 31.5,51.5 C 33.5,50.5 35,53 32.5,58.5 Z" />
                              <path d="M 30,59 C 27,56.5 26.5,54 28.5,52.5 C 30.5,51 31.5,53 30,59 Z" />
                              
                              <path d="M 29.5,52 C 26.5,49.5 25.5,47 27.5,45.5 C 29.5,44 30.5,46 29.5,52 Z" />
                              <path d="M 26.5,52.5 C 23.5,50.5 22.5,48 24.5,46.5 C 26.5,45 27.5,47 26.5,52.5 Z" />
                              
                              <path d="M 27,45 C 24.5,42.5 23,40 25,38.5 C 27,37 28,39 27,45 Z" />
                              <path d="M 24,45.5 C 21.5,43.5 20,41 22,39.5 C 24,38 25,40 24,45.5 Z" />
                              
                              <path d="M 26,38 C 24,35.5 22.5,33 24.5,31.5 C 26.5,30 27.5,32 26,38 Z" />
                              <path d="M 23,38.5 C 21,36.5 19.5,34 21.5,32.5 C 23.5,31 24.5,33 23,38.5 Z" />
                              
                              <path d="M 26.5,31 C 25,28.5 24,26 26,24.5 C 28,23 29,25 26.5,31 Z" />
                              <path d="M 23.5,31.5 C 22,29 21,26.5 23,25 C 25,23.5 26,25.5 23.5,31.5 Z" />
                            </g>
                            <g id="laurelStar">
                              <polygon points="0,-2.2 0.6,-0.6 2.2,-0.6 1,0.4 1.4,2 0,1.1 -1.4,2 -1,0.4 -2.2,-0.6 -0.6,-0.6" fill="#8F6A15" />
                            </g>
                          </defs>

                          {/* 1. Purple Slanting ribbons extending from behind the seal */}
                          <g fill="#6C1D5F" opacity="0.95">
                            {/* Left Ribbon */}
                            <polygon points="42,42 16,114 34,104 48,114 45,42" />
                            {/* Right Ribbon */}
                            <polygon points="55,42 52,114 66,104 84,114 58,42" />
                          </g>

                          {/* 2. Outer Scalloped Gold Medallion */}
                          <path d={getScallopPath(50, 46, 44.5, 41.5, 32)} fill="url(#sealGoldGrad)" stroke="#B88E3E" strokeWidth="0.8" />

                          {/* 3. Outer Seal Gold Circle */}
                          <circle cx="50" cy="46" r="39" fill="url(#sealGoldGrad)" stroke="#B88E3E" strokeWidth="1" />

                          {/* 4. Inner White Highlight Circle */}
                          <circle cx="50" cy="46" r="36.5" fill="none" stroke="#FFFFFF" strokeWidth="0.8" opacity="0.45" />

                          {/* 5. Concentric Inner Circle Rim */}
                          <circle cx="50" cy="46" r="35.5" fill="none" stroke="#B88E3E" strokeWidth="0.5" opacity="0.65" />

                          {/* 6. Laurel Wreaths flanking the left and right sides */}
                          <use href="#leftLaurel" />
                          <use href="#leftLaurel" transform="translate(100, 0) scale(-1, 1)" />

                          {/* 7. Two small gold stars at the bottom of the circle */}
                          <use href="#laurelStar" x="43" y="69.5" />
                          <use href="#laurelStar" x="57" y="69.5" />

                          {/* 8. Purple Xebia X logo centered vertically and horizontally */}
                          <g transform="translate(21.5, 28.9) scale(0.6)">
                            <path d="M22.5 5.5H35.5L47.5 24.5L59.5 5.5H72.5L54.5 28.5L72.5 51.5H59.5L47.5 32.5L35.5 51.5H22.5L40.5 28.5L22.5 5.5Z" fill="#6C1D5F" />
                          </g>
                        </svg>
                      </div>

                      {/* Signature 2 (Right - Vikram Malhotra replacing Sanjeev Sharma) */}
                      <div className="flex flex-col items-center text-center">
                        <span 
                          style={{ fontFamily: "'Alex Brush', cursive" }}
                          className="text-lg text-[#6C1D5F] leading-none mb-1 rotate-[3deg]"
                        >
                          Vikram Malhotra
                        </span>
                        <div className="w-24 border-b border-neutral-300 my-0.5"></div>
                        <span className="text-[8px] font-bold text-neutral-800 tracking-tight leading-normal">Vikram Malhotra</span>
                        <span className="text-[7px] font-semibold text-neutral-500 uppercase tracking-wider leading-none">Managing Director</span>
                        <span className="text-[6.5px] font-bold text-[#6C1D5F] uppercase mt-0.5">Xebia</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-3 mt-4 border-t border-neutral-100 pt-3 relative z-20">
                <button
                  onClick={() => handleShare()}
                  className="py-1.5 px-3.5 rounded-xl text-xs font-extrabold text-brand-muted hover:bg-neutral-100 transition-all flex items-center gap-1.5"
                >
                  <Share2 className="w-4 h-4" /> Share Credential
                </button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    handleDownload(activeCertificate.courseTitle);
                    setActiveCertificate(null);
                  }}
                  className="bg-brand-primary hover:bg-brand-primaryDark text-white font-extrabold text-xs py-2 px-4.5 rounded-xl transition-all shadow-sm flex items-center gap-1.5"
                >
                  <Download className="w-4 h-4" /> Download PDF Certificate
                </motion.button>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </motion.div>
  );
};
export default CertificatePage;
