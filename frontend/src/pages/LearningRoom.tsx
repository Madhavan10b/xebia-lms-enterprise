import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ChevronUp, Copy, Check, Video, FileText, Code2, AlertCircle, Sparkles, BookOpen } from 'lucide-react';
import { courseServices } from '../services/api';
import { Course, Submodule, Content } from '../types';

export const LearningRoom: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [courses, setCourses] = useState<Course[]>([]);
  const [currentCourse, setCurrentCourse] = useState<Course | null>(null);
  const [openModules, setOpenModules] = useState<{ [key: number]: boolean }>({});
  const [activeSubmodule, setActiveSubmodule] = useState<Submodule | null>(null);
  const [copiedId, setCopiedId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  // Load all courses and identify the active one
  useEffect(() => {
    const loadCourses = async () => {
      try {
        const list = await courseServices.getAll();
        setCourses(list);

        const courseIdParam = searchParams.get('courseId');
        if (courseIdParam) {
          const matched = list.find((c) => String(c.id) === String(courseIdParam));
          if (matched) {
            setCurrentCourse(matched);
            
            // Auto open first module
            if (matched.modules && matched.modules.length > 0) {
              setOpenModules({ [matched.modules[0].id]: true });
              
              // Auto select first submodule
              if (matched.modules[0].submodules && matched.modules[0].submodules.length > 0) {
                setActiveSubmodule(matched.modules[0].submodules[0]);
              }
            }
          }
        }
      } catch (err) {
        console.error('Error loading learning room courses:', err);
      } finally {
        setLoading(false);
      }
    };
    loadCourses();
  }, [searchParams]);

  const handleCopyCode = (codeText: string, elementId: number) => {
    navigator.clipboard.writeText(codeText).then(() => {
      setCopiedId(elementId);
      setTimeout(() => setCopiedId(null), 2000);
    });
  };

  const toggleModule = (moduleId: number) => {
    setOpenModules((prev) => ({
      ...prev,
      [moduleId]: !prev[moduleId],
    }));
  };

  if (loading) {
    return (
      <div className="flex-grow flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-brand-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  // Welcome state if no course is selected
  if (!currentCourse) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex-grow flex flex-col items-center justify-center py-12 md:py-20 text-center px-4"
      >
        <div className="w-20 h-20 bg-brand-primary/10 rounded-2xl flex items-center justify-center text-brand-primary mb-6 animate-pulse">
          <BookOpen className="w-10 h-10" />
        </div>
        <h2 className="text-2xl md:text-3xl font-extrabold text-brand-primaryDark mb-3">Welcome to the learning lab</h2>
        <p className="text-brand-muted text-sm md:text-base max-w-lg mb-8 leading-relaxed">
          Please select a course from the catalog to load study material, coding sandboxes, and video lectures.
        </p>
        <button
          onClick={() => navigate('/catalog')}
          className="bg-gradient-to-r from-brand-primary to-brand-accent text-white font-extrabold px-6 py-3.5 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5"
        >
          Browse Courses
        </button>
      </motion.div>
    );
  }

  return (
    <div className="flex-grow flex flex-col lg:flex-row gap-6 md:gap-8 h-[calc(100vh-140px)]">
      {/* Curriculum Sidebar */}
      <aside className="w-full lg:w-[330px] flex-shrink-0 bg-white/60 backdrop-blur-md rounded-2xl border border-white/60 p-4 md:p-6 flex flex-col gap-5 overflow-y-auto shadow-glass">
        <div>
          <span className="text-[10px] font-extrabold tracking-wider text-brand-success uppercase">
            {currentCourse.category?.name || 'XEBIA LMS'}
          </span>
          <h3 className="font-extrabold text-lg text-brand-primaryDark mt-1 leading-snug">
            {currentCourse.title}
          </h3>
        </div>

        <hr className="border-[#E2E4F0]/65" />

        {/* Modules Accordion */}
        <div className="flex-1 flex flex-col gap-3">
          {!currentCourse.modules || currentCourse.modules.length === 0 ? (
            <div className="text-center text-brand-muted text-sm py-10 font-medium">
              No study modules uploaded for this course yet.
            </div>
          ) : (
            currentCourse.modules
              .slice()
              .sort((a, b) => (a.moduleOrder || 0) - (b.moduleOrder || 0))
              .map((mod) => {
                const isOpen = !!openModules[mod.id];
                return (
                  <div key={mod.id} className="flex flex-col gap-1.5">
                    {/* Header */}
                    <button
                      onClick={() => toggleModule(mod.id)}
                      className="w-full flex justify-between items-center text-left bg-gradient-to-r from-[#E2E4F0]/25 to-white/40 border border-[#E2E4F0]/40 p-4 rounded-xl border-l-4 border-l-brand-primary hover:bg-[#E2E4F0]/45 transition-all duration-300 group"
                    >
                      <span className="text-xs md:text-sm font-extrabold text-brand-primaryDark group-hover:text-brand-primary">
                        {mod.title}
                      </span>
                      {isOpen ? (
                        <ChevronUp className="w-4 h-4 text-brand-muted" />
                      ) : (
                        <ChevronDown className="w-4 h-4 text-brand-muted" />
                      )}
                    </button>

                    {/* Submodules List */}
                    <AnimatePresence initial={false}>
                      {isOpen && (
                        <motion.ul
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3 }}
                          className="pl-4 flex flex-col gap-1 overflow-hidden"
                        >
                          {mod.submodules && mod.submodules.length > 0 ? (
                            mod.submodules
                              .slice()
                              .sort((a, b) => (a.submoduleOrder || 0) - (b.submoduleOrder || 0))
                              .map((sub) => {
                                const isActive = activeSubmodule?.id === sub.id;
                                return (
                                  <li
                                    key={sub.id}
                                    onClick={() => setActiveSubmodule(sub)}
                                    className={`px-4 py-2.5 rounded-lg cursor-pointer text-xs md:text-sm font-semibold transition-all duration-300 ${
                                      isActive
                                        ? 'bg-brand-primary/10 text-brand-primary border-r-4 border-brand-primary font-bold'
                                        : 'text-brand-muted hover:bg-[#E2E4F0]/25 hover:text-brand-primary hover:pl-5'
                                    }`}
                                  >
                                    {sub.title}
                                  </li>
                                );
                              })
                          ) : (
                            <li className="px-4 py-2 text-xs text-brand-muted italic font-medium">
                              No lessons inside.
                            </li>
                          )}
                        </motion.ul>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })
          )}
        </div>
      </aside>

      {/* Lecture Content Pane */}
      <main className="flex-1 bg-white/60 backdrop-blur-md rounded-2xl border border-white/60 p-6 md:p-8 overflow-y-auto shadow-glass relative">
        <AnimatePresence mode="wait">
          {!activeSubmodule ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="h-full flex flex-col items-center justify-center text-center py-16"
            >
              <Sparkles className="w-12 h-12 text-brand-accent/50 mb-4 animate-spin" />
              <h3 className="font-extrabold text-lg text-brand-primaryDark">Select a lesson module</h3>
              <p className="text-brand-muted text-sm max-w-xs mt-1">
                Click on any submodule in the left sidebar to begin reading.
              </p>
            </motion.div>
          ) : (
            <motion.div
              key={activeSubmodule.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="flex flex-col gap-6"
            >
              {/* Header block */}
              <div className="pb-4 border-b border-[#E2E4F0]/65">
                <h1 className="text-xl md:text-3xl font-extrabold text-brand-primaryDark tracking-tight">
                  {activeSubmodule.title}
                </h1>
                {activeSubmodule.metaDescription && (
                  <p className="text-brand-muted text-xs md:text-sm font-medium italic mt-2">
                    {activeSubmodule.metaDescription}
                  </p>
                )}
              </div>

              {/* Elements Renderer */}
              {!activeSubmodule.contents || activeSubmodule.contents.length === 0 ? (
                <div className="text-center text-brand-muted text-sm py-16">
                  This submodule is empty. Add elements in the Authoring Studio.
                </div>
              ) : (
                activeSubmodule.contents
                  .slice()
                  .sort((a, b) => (a.contentOrder || 0) - (b.contentOrder || 0))
                  .map((el) => {
                    switch (el.type) {
                      case 'heading': {
                        const Tag = `h${el.headingLevel || 2}` as keyof JSX.IntrinsicElements;
                        const headerClass =
                          el.headingLevel === 1
                            ? 'text-lg md:text-2xl font-black text-brand-primaryDark mt-4 mb-2'
                            : 'text-base md:text-xl font-extrabold text-brand-primaryDark mt-4 mb-2';
                        return (
                          <Tag key={el.id} className={headerClass}>
                            {el.title}
                          </Tag>
                        );
                      }
                      case 'text':
                        return (
                          <p key={el.id} className="text-sm md:text-base text-brand-muted leading-relaxed font-medium">
                            {el.text}
                          </p>
                        );
                      case 'callout':
                        return (
                          <div
                            key={el.id}
                            className="bg-brand-primary/5 border-l-4 border-l-brand-accent p-4 md:p-5 rounded-r-xl border-y border-r border-brand-primary/10 shadow-sm"
                          >
                            <h4 className="font-extrabold text-brand-accent text-sm md:text-base mb-1">
                              {el.title || 'Important Note'}
                            </h4>
                            <p className="text-brand-muted text-xs md:text-sm leading-relaxed font-semibold">
                              {el.text}
                            </p>
                          </div>
                        );
                      case 'code':
                        return (
                          <div key={el.id} className="relative bg-zinc-950 rounded-xl p-4 pt-10 text-zinc-300 font-mono text-[11px] md:text-sm shadow-lg my-2 select-text overflow-hidden">
                            {/* Mac Window Dots */}
                            <div className="absolute left-4 top-3.5 flex gap-1.5">
                              <span className="w-2.5 h-2.5 rounded-full bg-[#ff5f56]"></span>
                              <span className="w-2.5 h-2.5 rounded-full bg-[#ffbd2e]"></span>
                              <span className="w-2.5 h-2.5 rounded-full bg-[#27c93f]"></span>
                            </div>

                            {/* Header */}
                            <div className="absolute right-4 top-2 flex items-center gap-3">
                              <span className="text-[10px] font-bold tracking-wider text-zinc-500 uppercase select-none">
                                {el.language || 'Code'}
                              </span>
                              <button
                                onClick={() => handleCopyCode(el.code || '', el.id)}
                                className="flex items-center gap-1 bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 text-zinc-400 hover:text-zinc-200 text-xs py-1 px-2.5 rounded-md transition-all duration-200"
                              >
                                {copiedId === el.id ? (
                                  <>
                                    <Check className="w-3 h-3 text-brand-success" />
                                    <span className="text-[10px] text-brand-success font-semibold">Copied</span>
                                  </>
                                ) : (
                                  <>
                                    <Copy className="w-3 h-3" />
                                    <span className="text-[10px]">Copy</span>
                                  </>
                                )}
                              </button>
                            </div>

                            {/* Code Text */}
                            <pre className="overflow-x-auto whitespace-pre leading-relaxed select-text mt-2 custom-scrollbar pr-2">
                              <code>{el.code}</code>
                            </pre>
                          </div>
                        );
                      case 'video':
                        return (
                          <div key={el.id} className="relative aspect-video rounded-2xl overflow-hidden shadow-lg border border-white/25 bg-black my-4">
                            <iframe
                              src={el.videoUrl}
                              allowFullScreen
                              className="absolute inset-0 w-full h-full border-0"
                            ></iframe>
                          </div>
                        );
                      case 'image':
                        return (
                          <div key={el.id} className="flex flex-col items-center gap-2 my-4">
                            <img
                              src={el.imageUrl}
                              alt={el.alt || 'Content Image'}
                              className="max-w-full h-auto rounded-xl border border-white/60 shadow-md"
                            />
                            {el.caption && (
                              <p className="text-xs text-brand-muted font-bold text-center">
                                {el.caption}
                              </p>
                            )}
                          </div>
                        );
                      default:
                        return null;
                    }
                  })
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
};
