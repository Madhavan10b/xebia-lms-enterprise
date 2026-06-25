import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { BookOpen, Award, Clock, ArrowRight, Play } from 'lucide-react';
import { courseServices, categoryServices } from '../services/api';
import { Course, Category } from '../types';

export const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [courses, setCourses] = useState<Course[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [loadedCourses, loadedCategories] = await Promise.all([
          courseServices.getAll(),
          categoryServices.getAll(),
        ]);
        setCourses(loadedCourses);
        setCategories(loadedCategories);
      } catch (err) {
        console.error('Error loading dashboard data:', err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const getProgress = (courseId: number) => {
    return courseId === 1 ? 75 : courseId === 2 ? 30 : 0;
  };

  const activeCoursesCount = courses.filter(c => getProgress(c.id) > 0 && getProgress(c.id) < 100).length;
  const completedCoursesCount = courses.filter(c => getProgress(c.id) === 100).length;

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-brand-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  // Find course in progress to recommend
  const inProgressCourse = courses.find(c => getProgress(c.id) > 0 && getProgress(c.id) < 100) || courses[0];

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex-grow flex flex-col gap-6 md:gap-8"
    >
      {/* Welcome Hero Banner */}
      <div className="bg-gradient-to-br from-brand-primaryDark/95 to-brand-primary/90 border border-white/10 rounded-3xl p-6 md:p-10 text-white shadow-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-6 relative overflow-hidden">
        {/* Glow */}
        <div className="absolute right-0 bottom-0 w-80 h-80 rounded-full bg-brand-success/10 blur-[60px] pointer-events-none"></div>
        <div className="relative z-10 max-w-xl">
          <h2 className="text-2xl md:text-4xl font-extrabold mb-3 tracking-tight">
            Expand your engineering horizon
          </h2>
          <p className="text-white/75 text-sm md:text-base leading-relaxed">
            Access high-fidelity, interactive lectures on Spring Boot, JPA persistence, System Architecture, and DevOps.
          </p>
        </div>
        <button
          onClick={() => navigate('/catalog')}
          className="relative z-10 bg-gradient-to-r from-brand-cta to-orange-500 hover:from-orange-500 hover:to-brand-cta text-white font-extrabold text-sm md:text-base px-6 py-3.5 rounded-xl flex items-center gap-2 transition-all duration-300 shadow-[0_4px_12px_rgba(255,98,0,0.3)] hover:shadow-[0_8px_24px_rgba(255,98,0,0.5)] hover:-translate-y-0.5"
        >
          Explore Catalog <ArrowRight className="w-5 h-5" />
        </button>
      </div>

      {/* Analytics Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        <div className="glass-panel p-6 rounded-2xl flex items-center gap-5">
          <div className="w-12 h-12 rounded-xl bg-brand-primary/10 flex items-center justify-center text-brand-primary">
            <BookOpen className="w-6 h-6" />
          </div>
          <div>
            <span className="block text-[11px] font-bold text-brand-muted uppercase tracking-wider">Courses Enrolled</span>
            <span className="text-2xl font-black text-brand-primaryDark">{courses.length}</span>
          </div>
        </div>

        <div className="glass-panel p-6 rounded-2xl flex items-center gap-5">
          <div className="w-12 h-12 rounded-xl bg-brand-success/10 flex items-center justify-center text-brand-success">
            <Award className="w-6 h-6" />
          </div>
          <div>
            <span className="block text-[11px] font-bold text-brand-muted uppercase tracking-wider">In Progress</span>
            <span className="text-2xl font-black text-brand-primaryDark">{activeCoursesCount}</span>
          </div>
        </div>

        <div className="glass-panel p-6 rounded-2xl flex items-center gap-5">
          <div className="w-12 h-12 rounded-xl bg-brand-cta/10 flex items-center justify-center text-brand-cta">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <span className="block text-[11px] font-bold text-brand-muted uppercase tracking-wider">Study Time</span>
            <span className="text-2xl font-black text-brand-primaryDark">43 Hours</span>
          </div>
        </div>
      </div>

      {/* Main Grid: Recommended Course & Categories */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
        {/* Recommended / Continue Learning */}
        {inProgressCourse && (
          <div className="lg:col-span-2 glass-panel p-6 rounded-2xl flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-start mb-4">
                <span className="text-[10px] uppercase font-extrabold tracking-wider px-2.5 py-1 rounded-full bg-brand-accent/10 text-brand-accent border border-brand-accent/15">
                  Continue Learning
                </span>
                <span className="text-xs text-brand-muted font-bold">{inProgressCourse.duration || 'Self-paced'}</span>
              </div>
              <h3 className="text-xl md:text-2xl font-black text-brand-primaryDark mb-2">
                {inProgressCourse.title}
              </h3>
              <p className="text-brand-muted text-sm line-clamp-3 mb-6">
                {inProgressCourse.description || 'No description provided.'}
              </p>

              {/* Progress bar */}
              <div className="space-y-2 mb-6">
                <div className="flex justify-between text-xs font-bold text-brand-muted">
                  <span>Current Progress</span>
                  <span>{getProgress(inProgressCourse.id)}%</span>
                </div>
                <div className="w-full h-2.5 bg-brand-primary/5 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-brand-success to-brand-accent rounded-full transition-all duration-500"
                    style={{ width: `${getProgress(inProgressCourse.id)}%` }}
                  ></div>
                </div>
              </div>
            </div>

            <button
              onClick={() => navigate(`/learning?courseId=${inProgressCourse.id}`)}
              className="bg-brand-primaryDark hover:bg-brand-primary text-white font-extrabold text-sm py-3 px-5 rounded-xl flex items-center justify-center gap-2 transition-all duration-300 shadow-md self-start"
            >
              <Play className="w-4 h-4 fill-white" /> Resume Lecture
            </button>
          </div>
        )}

        {/* Categories Panel */}
        <div className="glass-panel p-6 rounded-2xl">
          <h3 className="text-lg font-extrabold text-brand-primaryDark mb-4">Learning Fields</h3>
          <div className="flex flex-col gap-3">
            {categories.map((cat) => {
              const courseCount = courses.filter((c) => {
                const cCatId = c.category && typeof c.category === 'object' ? c.category.id : c.category;
                return String(cCatId) === String(cat.id);
              }).length;

              return (
                <div
                  key={cat.id}
                  onClick={() => navigate(`/catalog?category=${cat.id}`)}
                  className="flex justify-between items-center p-3.5 rounded-xl border border-white/60 bg-white/40 hover:bg-white/80 cursor-pointer transition-all duration-300 group hover:-translate-y-0.5"
                >
                  <div className="flex items-center gap-3">
                    <span
                      className="w-2.5 h-2.5 rounded-full"
                      style={{ backgroundColor: cat.color || '#6C1D5F' }}
                    ></span>
                    <span className="text-sm font-bold text-brand-primaryDark group-hover:text-brand-primary">
                      {cat.name}
                    </span>
                  </div>
                  <span className="text-xs bg-brand-primary/5 text-brand-primary px-2.5 py-1 rounded-lg font-bold border border-brand-primary/10">
                    {courseCount} {courseCount === 1 ? 'course' : 'courses'}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </motion.div>
  );
};
