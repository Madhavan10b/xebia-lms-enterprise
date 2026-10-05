import React, { useState, useEffect } from 'react';
import { Video, FileText, Sparkles, Brain, Clock, CheckCircle2, Play, RefreshCw, Layers, ArrowLeft, ChevronRight, Copy, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { courseServices } from '../services/api';
import { useToast } from '../context/ToastContext';
import { Course } from '../types';

interface Flashcard {
  question: string;
  answer: string;
  flipped: boolean;
}

interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswer: number;
  selectedAnswer: number | null;
}

interface TranscriptLine {
  time: string;
  text: string;
}

interface VideoSource {
  title: string;
  url: string;
  type: 'Trailer' | 'Lesson';
  submoduleName?: string;
}

export const VideoSummarizerPage: React.FC = () => {
  const { showToast } = useToast();
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Selected course & video states
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [availableVideos, setAvailableVideos] = useState<VideoSource[]>([]);
  const [selectedVideo, setSelectedVideo] = useState<VideoSource | null>(null);

  // Summarization stages
  const [stage, setStage] = useState<'idle' | 'processing' | 'completed'>('idle');
  const [activeTab, setActiveTab] = useState<'summary' | 'transcript' | 'flashcards'>('summary');
  const [processingLog, setProcessingLog] = useState<string>('');
  
  // Flashcards state
  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
  const [quiz, setQuiz] = useState<QuizQuestion[]>([]);
  const [transcript, setTranscript] = useState<TranscriptLine[]>([]);

  // Load courses
  useEffect(() => {
    const loadCourses = async () => {
      try {
        setLoading(true);
        const data = await courseServices.getAll();
        setCourses(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    loadCourses();
  }, []);

  // When a course is selected, find all trailer and lesson video URLs
  const handleSelectCourse = (course: Course) => {
    setSelectedCourse(course);
    
    const vids: VideoSource[] = [];
    
    // Add trailer video if URL is present
    if (course.trailerVideoUrl) {
      vids.push({
        title: `${course.title} - Official Trailer`,
        url: course.trailerVideoUrl,
        type: 'Trailer'
      });
    } else {
      // Fallback trailer url for mockup completeness
      vids.push({
        title: `${course.title} - Intro Trailer`,
        url: `https://www.youtube.com/watch?v=intro-${course.slug}`,
        type: 'Trailer'
      });
    }

    // Add submodule lesson videos
    course.modules?.forEach(mod => {
      mod.submodules?.forEach(sub => {
        sub.contents?.forEach(cnt => {
          if (cnt.type === 'video' && cnt.videoUrl) {
            vids.push({
              title: `${sub.title} - Lecture Frame`,
              url: cnt.videoUrl,
              type: 'Lesson',
              submoduleName: sub.title
            });
          }
        });
      });
    });

    // Fallback mock video if none exists
    if (vids.length === 1) {
      vids.push({
        title: "Module 1: Getting Started Lecture",
        url: `https://www.youtube.com/watch?v=lecture-${course.slug}`,
        type: 'Lesson',
        submoduleName: "Overview & Scaffolding"
      });
    }

    setAvailableVideos(vids);
    setSelectedVideo(null);
    setStage('idle');
  };

  // Start simulated summarization for a specific course video
  const handleSummarizeVideo = (vid: VideoSource) => {
    setSelectedVideo(vid);
    setStage('processing');
    setProcessingLog("Connecting to ASR server...");

    // Generate custom data based on course details
    const courseTitle = selectedCourse?.title || "Course";
    const videoTitle = vid.title;

    setTranscript([
      { time: "00:15", text: `Welcome to this lecture frame on ${courseTitle}. In this lesson, we will focus on core aspects of ${videoTitle}.` },
      { time: "01:30", text: `Let's break down the fundamental logic. When building architectures, we want each decoupling unit to map to clean interfaces.` },
      { time: "04:12", text: `Notice how auto-injections are simulated. By separating dependencies, we avoid cyclic serialization stack errors in runtime processes.` },
      { time: "07:45", text: `Verify that your routing parameters are clean. We configure navigation maps in App configuration paths.` },
      { time: "11:20", text: `That covers the baseline tutorial. Review the generated flashcards below to recap this session's concepts.` }
    ]);

    setFlashcards([
      { question: `What is the core focus of ${courseTitle}?`, answer: `Decoupled components, clean API design, and highly modular layouts.`, flipped: false },
      { question: `Why is ${videoTitle} useful?`, answer: `It provides students with instant, search-engine indexable summaries of complex visual course lessons.`, flipped: false },
      { question: "What is Inversion of Control?", answer: "A pattern where the container manages dependencies rather than the class instantiating them directly.", flipped: false }
    ]);

    setQuiz([
      {
        question: `Based on the lecture "${videoTitle}", what is the primary architectural goal?`,
        options: ["Maximized Decoupling", "Hardcoded Dependency Instances", "Synchronous File Blocking", "Monolithic Packaging"],
        correctAnswer: 0,
        selectedAnswer: null
      }
    ]);
  };

  // Simulation processing log timer
  useEffect(() => {
    if (stage === 'processing') {
      const logs = [
        "Downloading video track from database cache...",
        "Extracting audio streams...",
        "Running Whisper ASR transcription engine...",
        "Aligning speech timestamps...",
        "Generating conceptual semantic summaries via Gemini AI...",
        "Formulating interactive revision flashcards...",
        "Compiling timestamp transcript links..."
      ];
      let idx = 0;
      const interval = setInterval(() => {
        idx++;
        if (idx >= logs.length) {
          clearInterval(interval);
          setStage('completed');
          showToast(`Summarization of "${selectedVideo?.title}" finished successfully!`);
        } else {
          setProcessingLog(logs[idx]);
        }
      }, 750);
      return () => clearInterval(interval);
    }
  }, [stage, selectedVideo]);

  const toggleFlashcard = (idx: number) => {
    setFlashcards(flashcards.map((f, i) => {
      if (i === idx) return { ...f, flipped: !f.flipped };
      return f;
    }));
  };

  const handleQuizAnswer = (qIdx: number, oIdx: number) => {
    setQuiz(quiz.map((q, idx) => {
      if (idx === qIdx) return { ...q, selectedAnswer: oIdx };
      return q;
    }));
  };

  if (loading) {
    return (
      <div className="flex-grow flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-brand-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  // Framer Motion Stagger Variants
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.04
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 8 },
    show: { 
      opacity: 1, 
      y: 0,
      transition: { 
        type: "spring", 
        stiffness: 260, 
        damping: 24 
      } 
    }
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="flex-grow flex flex-col gap-6 md:gap-8 text-left"
    >
      
      {/* Page Header */}
      <motion.div 
        variants={itemVariants}
        className="flex justify-between items-start flex-wrap gap-4 border-b border-neutral-100 pb-4"
      >
        <div>
          <h2 className="text-xl md:text-2xl font-black text-brand-primaryDark tracking-tight mb-1">AI Video Summarizer</h2>
          <p className="text-brand-muted text-xs md:text-sm font-medium">Select a course to summarize and analyze its active lecture videos.</p>
        </div>
        {selectedCourse && (
          <motion.button 
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => { setSelectedCourse(null); setStage('idle'); }}
            className="flex items-center gap-1.5 text-xs font-bold text-brand-primary bg-brand-primary/5 hover:bg-brand-primary/10 px-3.5 py-1.5 rounded-full border border-brand-primary/10 transition-all duration-150"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Select Another Course
          </motion.button>
        )}
      </motion.div>

      {/* PHASE 1: SELECT COURSE GRID */}
      {!selectedCourse && (
        <motion.div 
          variants={itemVariants}
          className="flex flex-col gap-5"
        >
          <span className="text-[9px] font-black uppercase text-brand-muted tracking-widest block">Available Courses</span>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map(crs => {
              const modsCount = crs.modules?.length || 0;
              const catColor = crs.category?.color || '#6C1D5F';
              return (
                <motion.div 
                  whileHover={{ y: -3 }}
                  key={crs.id}
                  onClick={() => handleSelectCourse(crs)}
                  className="glass-panel p-5 rounded-2xl border border-neutral-200/80 shadow-sm flex flex-col justify-between cursor-pointer group hover:shadow-md transition-all duration-200 relative border-l-4"
                  style={{ borderLeftColor: catColor }}
                >
                  <div className="text-left space-y-3.5">
                    <span 
                      className="px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-wider inline-block"
                      style={{ 
                        backgroundColor: `${catColor}08`, 
                        color: catColor,
                        border: `1px solid ${catColor}15`
                      }}
                    >
                      {crs.category?.name || 'Standard'}
                    </span>
                    <h3 className="text-base font-black text-brand-primaryDark leading-snug tracking-tight">
                      {crs.title}
                    </h3>
                    <p className="text-brand-muted text-xs leading-relaxed line-clamp-2 font-semibold">
                      {crs.description || 'No description provided.'}
                    </p>
                  </div>

                  <div className="flex justify-between items-center border-t border-neutral-100 pt-4 mt-5">
                    <span className="text-[10px] text-brand-muted font-bold tracking-wide">{modsCount} Modules</span>
                    <span className="text-brand-primary hover:text-brand-accent font-extrabold text-xs flex items-center gap-0.5">
                      Select Video <ChevronRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
                    </span>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      )}

      {/* PHASE 2: SELECT VIDEO LIST */}
      {selectedCourse && stage === 'idle' && (
        <motion.div 
          variants={itemVariants}
          className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8 items-start"
        >
          
          {/* Left info column */}
          <div className="lg:col-span-4 flex flex-col gap-6 text-left">
            <div className="glass-panel p-6 rounded-2xl border border-neutral-200/80 shadow-sm flex flex-col gap-4">
              <img 
                src={selectedCourse.bannerImage || 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=400&q=80'} 
                alt={selectedCourse.title} 
                className="w-full aspect-[1.8] rounded-xl object-cover shadow-sm"
              />
              <div>
                <span 
                  className="px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-wider inline-block mb-2"
                  style={{ 
                    backgroundColor: `${selectedCourse.category?.color || '#6C1D5F'}08`, 
                    color: selectedCourse.category?.color || '#6C1D5F',
                    border: `1px solid ${selectedCourse.category?.color || '#6C1D5F'}15`
                  }}
                >
                  {selectedCourse.category?.name || 'Academy'}
                </span>
                <h3 className="text-base font-black text-brand-primaryDark leading-tight mb-1.5 tracking-tight">{selectedCourse.title}</h3>
                <p className="text-brand-muted text-xs leading-relaxed font-semibold">{selectedCourse.description}</p>
              </div>
            </div>
          </div>

          {/* Right Video list column */}
          <div className="lg:col-span-8 flex flex-col gap-4 text-left">
            <span className="text-[9px] font-black uppercase text-brand-muted tracking-widest block">Available Lecture Videos</span>
            
            <div className="flex flex-col gap-3">
              {availableVideos.map((vid, idx) => (
                <motion.div 
                  whileHover={{ y: -1 }}
                  key={idx}
                  className="glass-panel p-4 rounded-2xl border border-neutral-200/80 shadow-sm flex justify-between items-center hover:bg-neutral-50/50 transition-all gap-4"
                >
                  <div className="flex items-center gap-3.5 text-left">
                    <div className="w-10 h-10 rounded-xl bg-brand-primary/5 flex items-center justify-center text-brand-primary flex-shrink-0 border border-brand-primary/10">
                      <Video className="w-4.5 h-4.5" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-brand-primaryDark leading-snug tracking-tight">{vid.title}</h4>
                      <p className="text-[10px] text-brand-muted mt-1 font-bold">
                        Type: <span className="text-brand-primary">{vid.type}</span> 
                        {vid.submoduleName && ` • Lesson: ${vid.submoduleName}`}
                      </p>
                    </div>
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleSummarizeVideo(vid)}
                    className="bg-brand-success hover:bg-brand-success/90 text-white font-extrabold text-xs py-2 px-4 rounded-full flex items-center gap-1 shadow-sm transition-all"
                  >
                    <Sparkles className="w-3.5 h-3.5" /> Summarize
                  </motion.button>
                </motion.div>
              ))}
            </div>
          </div>

        </motion.div>
      )}

      {/* PHASE 3: SUMMARIZING PROGRESS & RESULTS */}
      {selectedCourse && stage === 'processing' && (
        <motion.div 
          variants={itemVariants}
          className="glass-panel p-10 md:p-14 rounded-2xl border border-neutral-200/80 shadow-sm flex flex-col items-center justify-center text-center gap-6 max-w-lg mx-auto w-full"
        >
          <div className="w-12 h-12 rounded-full bg-brand-success/10 flex items-center justify-center text-brand-success border border-brand-success/15">
            <RefreshCw className="w-5 h-5 animate-spin" />
          </div>
          <div className="space-y-1">
            <h3 className="text-xs font-black text-brand-primaryDark flex items-center gap-1.5 justify-center uppercase tracking-wider">
              <Sparkles className="w-4 h-4 text-brand-accent animate-pulse" /> AI is Analyzing Video...
            </h3>
            <p className="text-[10px] text-brand-muted font-bold h-4 text-center">{processingLog}</p>
          </div>
          <div className="w-44 h-1 bg-neutral-100 rounded-full overflow-hidden relative">
            <motion.div 
              animate={{ x: [-80, 180] }}
              transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
              className="h-full bg-brand-success w-1/3 rounded-full absolute"
            ></motion.div>
          </div>
        </motion.div>
      )}

      {/* COMPLETED RESULTS */}
      {selectedCourse && selectedVideo && stage === 'completed' && (
        <motion.div 
          variants={itemVariants}
          className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8 items-stretch"
        >
          
          {/* Left Column: video details and stats */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            
            {/* Simulated Video Player */}
            <div className="glass-panel rounded-2xl overflow-hidden border border-neutral-200/80 shadow-sm flex flex-col">
              <div className="relative aspect-[16/9] bg-slate-950 flex items-center justify-center overflow-hidden group">
                <div className="absolute inset-0 bg-cover bg-center filter blur-md opacity-20" style={{ backgroundImage: `url(${selectedCourse.bannerImage || ''})` }}></div>
                <Play className="w-12 h-12 text-white fill-white/80 filter drop-shadow-md group-hover:scale-110 transition-transform cursor-pointer relative z-10" />
                <span className="absolute bottom-3 right-3 bg-black/60 text-white font-mono text-[9px] px-2 py-0.5 rounded border border-white/10 z-10 font-bold">
                  18:42
                </span>
              </div>
              <div className="p-4 text-left border-t border-neutral-100">
                <span className="text-[9px] font-black uppercase tracking-wider text-brand-muted">Target Lecture Video</span>
                <h4 className="text-xs font-bold text-brand-primaryDark truncate mt-0.5 tracking-tight">{selectedVideo.title}</h4>
              </div>
            </div>

            {/* AI Summary stats card */}
            <div className="glass-panel p-5 rounded-2xl border border-neutral-200/80 shadow-sm flex flex-col gap-4 text-left">
              <h3 className="font-black text-[9px] text-brand-primaryDark uppercase tracking-wider border-b border-neutral-100 pb-2">
                Processing Statistics
              </h3>
              <div className="grid grid-cols-2 gap-4 text-left">
                <div className="flex flex-col">
                  <span className="text-[9px] font-bold text-brand-muted uppercase">Video Type</span>
                  <span className="text-xs font-bold text-brand-primaryDark flex items-center gap-1.5 mt-0.5">
                    <Video className="w-3.5 h-3.5 text-brand-muted" /> {selectedVideo.type}
                  </span>
                </div>
                <div className="flex flex-col">
                  <span className="text-[9px] font-bold text-brand-muted uppercase">ASR Word Count</span>
                  <span className="text-xs font-bold text-brand-primaryDark flex items-center gap-1.5 mt-0.5">
                    <FileText className="w-3.5 h-3.5 text-brand-muted" /> 3,450 words
                  </span>
                </div>
                <div className="flex flex-col">
                  <span className="text-[9px] font-bold text-brand-muted uppercase">Transcription accuracy</span>
                  <span className="text-xs font-bold text-brand-success flex items-center gap-1.5 mt-0.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-brand-success" /> 99.1%
                  </span>
                </div>
                <div className="flex flex-col">
                  <span className="text-[9px] font-bold text-brand-muted uppercase">Summary Engine</span>
                  <span className="text-xs font-bold text-brand-accent flex items-center gap-1.5 mt-0.5">
                    <Sparkles className="w-3.5 h-3.5 text-brand-accent" /> Gemini Core
                  </span>
                </div>
              </div>
              <motion.button 
                whileHover={{ scale: 1.015 }}
                whileTap={{ scale: 0.985 }}
                onClick={() => setStage('idle')}
                className="w-full bg-neutral-50 hover:bg-neutral-100 text-brand-primaryDark text-xs font-bold py-2.5 rounded-full border border-neutral-200 transition-all mt-2"
              >
                Summarize Another Video
              </motion.button>
            </div>

          </div>

          {/* Right Column: Summarized tabs content */}
          <div className="lg:col-span-7 flex flex-col gap-5">
            
            {/* Tabs Header bar */}
            <div className="glass-panel p-1 rounded-2xl border border-neutral-200/80 shadow-sm flex gap-1 bg-neutral-100">
              <button 
                onClick={() => setActiveTab('summary')}
                className={`flex-1 py-2 px-3 rounded-xl font-bold text-[11px] transition-all duration-150 ${activeTab === 'summary' ? 'bg-[#6C1D5F] text-white shadow-sm' : 'text-brand-muted hover:text-brand-primaryDark'}`}
              >
                AI Summary
              </button>
              <button 
                onClick={() => setActiveTab('transcript')}
                className={`flex-1 py-2 px-3 rounded-xl font-bold text-[11px] transition-all duration-150 ${activeTab === 'transcript' ? 'bg-[#6C1D5F] text-white shadow-sm' : 'text-brand-muted hover:text-brand-primaryDark'}`}
              >
                Transcript
              </button>
              <button 
                onClick={() => setActiveTab('flashcards')}
                className={`flex-1 py-2 px-3 rounded-xl font-bold text-[11px] transition-all duration-150 ${activeTab === 'flashcards' ? 'bg-[#6C1D5F] text-white shadow-sm' : 'text-brand-muted hover:text-brand-primaryDark'}`}
              >
                Flashcards & Quiz
              </button>
            </div>

            {/* TAB CONTENT: AI SUMMARY */}
            <AnimatePresence mode="wait">
              {activeTab === 'summary' && (
                <motion.div 
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -5 }}
                  className="glass-panel p-6 rounded-2xl border border-neutral-200/80 shadow-sm flex flex-col gap-6 text-left"
                >
                  <div className="border-b border-neutral-100 pb-3">
                    <h3 className="font-extrabold text-sm text-brand-primaryDark flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4 text-brand-accent animate-pulse" /> Core Insights & Summary
                    </h3>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <h4 className="text-[9px] font-black text-brand-primaryDark uppercase tracking-wider mb-1.5">Abstract</h4>
                      <p className="text-brand-muted text-xs leading-relaxed font-semibold">
                        This lecture covers the conceptual, architectural, and practical code implementations associated with {selectedVideo.title}. It outlines core integration points, interfaces, and decoupling logic.
                      </p>
                    </div>

                    <div>
                      <h4 className="text-[9px] font-black text-brand-primaryDark uppercase tracking-wider mb-2">Key Takeaways</h4>
                      <ul className="flex flex-col gap-2 text-xs text-brand-muted font-semibold">
                        <li className="flex items-start gap-2">
                          <CheckCircle2 className="w-4 h-4 text-brand-success flex-shrink-0 mt-0.5" />
                          <span>Decoupled parameters allow mutable references to be easily isolated.</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle2 className="w-4 h-4 text-brand-success flex-shrink-0 mt-0.5" />
                          <span>Timestamps mapping facilitates rapid searching and fast seeking through video segments.</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle2 className="w-4 h-4 text-brand-success flex-shrink-0 mt-0.5" />
                          <span>The AI extracts core queries and sets up contextual card structures.</span>
                        </li>
                      </ul>
                    </div>

                    <div>
                      <h4 className="text-[9px] font-black text-brand-primaryDark uppercase tracking-wider mb-2">Core Concepts Identified</h4>
                      <div className="flex gap-2 flex-wrap">
                        <span className="bg-brand-primary/5 border border-brand-primary/10 text-brand-primary font-bold text-[9px] px-2.5 py-1 rounded-full">{selectedCourse.title}</span>
                        <span className="bg-brand-primary/5 border border-brand-primary/10 text-brand-primary font-bold text-[9px] px-2.5 py-1 rounded-full">{selectedVideo.type} Video</span>
                        <span className="bg-brand-primary/5 border border-brand-primary/10 text-brand-primary font-bold text-[9px] px-2.5 py-1 rounded-full">Decoupled Architecture</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* TAB CONTENT: INTERACTIVE TRANSCRIPT */}
              {activeTab === 'transcript' && (
                <motion.div 
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -5 }}
                  className="glass-panel p-6 rounded-2xl border border-neutral-200/80 shadow-sm flex flex-col gap-4 text-left max-h-[480px] overflow-y-auto"
                >
                  <div className="border-b border-neutral-100 pb-3 mb-2 flex justify-between items-center flex-shrink-0">
                    <h3 className="font-extrabold text-sm text-brand-primaryDark flex items-center gap-1.5">
                      <FileText className="w-4 h-4 text-brand-primary" /> Timestamped Transcript
                    </h3>
                    <span className="text-[9px] text-brand-muted font-bold font-mono">Click timestamp to seek</span>
                  </div>

                  <div className="flex flex-col gap-3">
                    {transcript.map((line, idx) => (
                      <div key={idx} className="flex gap-4 items-start p-2 rounded-xl hover:bg-neutral-50 cursor-pointer transition-all duration-150 group">
                        <span 
                          onClick={() => showToast(`Seeking video player to ${line.time}`)}
                          className="bg-brand-primary/5 border border-brand-primary/10 text-brand-primary font-mono text-[10px] px-2.5 py-0.5 rounded-lg font-bold group-hover:bg-[#6C1D5F] group-hover:text-white transition-all flex-shrink-0"
                        >
                          {line.time}
                        </span>
                        <p className="text-brand-primaryDark text-xs font-semibold leading-relaxed pt-0.5">
                          {line.text}
                        </p>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* TAB CONTENT: FLASHCARDS & QUIZ */}
              {activeTab === 'flashcards' && (
                <motion.div 
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -5 }}
                  className="flex flex-col gap-6"
                >
                  
                  {/* Generated Flashcards */}
                  <div className="glass-panel p-6 rounded-2xl border border-neutral-200/80 shadow-sm flex flex-col gap-4 text-left">
                    <h3 className="font-extrabold text-sm text-brand-primaryDark flex items-center gap-1.5 border-b border-neutral-100 pb-3 mb-2">
                      <Brain className="w-4 h-4 text-brand-primary" /> Generated Revision Flashcards
                    </h3>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      {flashcards.map((card, idx) => (
                        <div 
                          key={idx}
                          onClick={() => toggleFlashcard(idx)}
                          className="h-44 cursor-pointer relative"
                          style={{ perspective: 1000 }}
                        >
                          <motion.div
                            animate={{ rotateY: card.flipped ? 180 : 0 }}
                            transition={{ type: "spring", stiffness: 220, damping: 22 }}
                            style={{ transformStyle: "preserve-3d" }}
                            className="w-full h-full relative"
                          >
                            {/* Front Side */}
                            <div 
                              style={{ backfaceVisibility: "hidden" }}
                              className="absolute inset-0 bg-neutral-50/50 border border-neutral-200/80 rounded-2xl p-4 flex flex-col justify-between shadow-sm"
                            >
                              <span className="text-[9px] font-black text-brand-muted uppercase tracking-wider">Concept {idx + 1}</span>
                              <p className="text-xs font-bold text-brand-primaryDark text-center leading-normal mb-6">{card.question}</p>
                              <span className="text-[8px] font-black text-brand-primary uppercase text-center tracking-widest">Click to Flip</span>
                            </div>
                            
                            {/* Back Side */}
                            <div 
                              style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
                              className="absolute inset-0 bg-gradient-to-br from-[#6C1D5F] to-[#45123D] border border-brand-primary/20 rounded-2xl p-4 flex flex-col justify-between shadow-sm text-white"
                            >
                              <span className="text-[9px] font-black text-white/50 uppercase tracking-wider">AI Answer</span>
                              <p className="text-[10px] font-semibold leading-relaxed overflow-y-auto mb-4 custom-scrollbar">{card.answer}</p>
                              <span className="text-[8px] font-black text-white/40 uppercase text-center tracking-widest">Click to Flip</span>
                            </div>
                          </motion.div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Generated Quiz */}
                  <div className="glass-panel p-6 rounded-2xl border border-neutral-200/80 shadow-sm flex flex-col gap-4 text-left">
                    <h3 className="font-extrabold text-sm text-brand-primaryDark flex items-center gap-1.5 border-b border-neutral-100 pb-3 mb-2">
                      <CheckCircle2 className="w-4 h-4 text-brand-success" /> Generated Micro-Quiz
                    </h3>

                    {quiz.map((q, qIdx) => (
                      <div key={qIdx} className="space-y-4">
                        <p className="text-xs font-extrabold text-brand-primaryDark">{q.question}</p>
                        <div className="flex flex-col gap-2.5">
                          {q.options.map((opt, oIdx) => {
                            const isSelected = q.selectedAnswer === oIdx;
                            const isCorrect = q.correctAnswer === oIdx;
                            let btnStyle = "bg-neutral-50/50 border-neutral-200 hover:bg-neutral-100/50 text-brand-primaryDark";

                            if (q.selectedAnswer !== null) {
                              if (isSelected) {
                                btnStyle = isCorrect 
                                  ? "bg-brand-success/15 border-brand-success/30 text-brand-success font-bold" 
                                  : "bg-red-50 border-red-200 text-red-700 font-bold";
                              } else if (isCorrect) {
                                btnStyle = "bg-brand-success/15 border-brand-success/30 text-brand-success font-bold";
                              }
                            }

                            return (
                              <motion.button
                                whileHover={{ x: 1 }}
                                whileTap={{ scale: 0.985 }}
                                key={oIdx}
                                disabled={q.selectedAnswer !== null}
                                onClick={() => handleQuizAnswer(qIdx, oIdx)}
                                className={`w-full p-3 rounded-xl border text-left text-xs font-semibold transition-all duration-150 flex items-center justify-between ${btnStyle}`}
                              >
                                <span>{opt}</span>
                                {q.selectedAnswer !== null && isCorrect && <CheckCircle2 className="w-4 h-4 text-brand-success flex-shrink-0" />}
                              </motion.button>
                            );
                          })}
                        </div>
                      </div>
                    ))}
                  </div>

                </motion.div>
              )}
            </AnimatePresence>

          </div>

        </motion.div>
      )}

    </motion.div>
  );
};
