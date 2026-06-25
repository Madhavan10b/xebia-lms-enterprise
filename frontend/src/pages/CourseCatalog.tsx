import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Compass, BookOpen } from 'lucide-react';
import { courseServices, categoryServices } from '../services/api';
import { Course, Category } from '../types';

export const CourseCatalog: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [courses, setCourses] = useState<Course[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [loading, setLoading] = useState(true);

  // Read URL query parameters
  useEffect(() => {
    const categoryParam = searchParams.get('category');
    if (categoryParam) {
      setSelectedCategory(categoryParam);
    }
  }, [searchParams]);

  useEffect(() => {
    const loadCatalogData = async () => {
      try {
        const [loadedCourses, loadedCategories] = await Promise.all([
          courseServices.getAll(),
          categoryServices.getAll(),
        ]);
        setCourses(loadedCourses);
        setCategories(loadedCategories);
      } catch (err) {
        console.error('Error loading catalog data:', err);
      } finally {
        setLoading(false);
      }
    };
    loadCatalogData();
  }, []);

  const getProgress = (courseId: number) => {
    return courseId === 1 ? 75 : courseId === 2 ? 30 : 0;
  };

  const handleFilterChange = (categoryId: string) => {
    setSelectedCategory(categoryId);
    if (categoryId === 'all') {
      searchParams.delete('category');
    } else {
      searchParams.set('category', categoryId);
    }
    setSearchParams(searchParams);
  };

  const filteredCourses = courses.filter((course) => {
    // Category match
    const courseCatId = course.category && typeof course.category === 'object' ? course.category.id : course.category;
    const matchesCategory = selectedCategory === 'all' || String(courseCatId) === String(selectedCategory);

    // Search query match
    const query = searchQuery.toLowerCase();
    const matchesSearch =
      course.title.toLowerCase().includes(query) ||
      (course.description && course.description.toLowerCase().includes(query)) ||
      (course.shortDescription && course.shortDescription.toLowerCase().includes(query));

    return matchesCategory && matchesSearch;
  });

  if (loading) {
    return (
      <div className="flex-grow flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-brand-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="flex-grow flex flex-col gap-6 md:gap-8"
    >
      {/* Search and Hero Area */}
      <div className="bg-gradient-to-br from-brand-primaryDark/95 to-brand-primary/90 border border-white/10 rounded-3xl p-6 md:p-10 text-white shadow-xl flex flex-col lg:flex-row justify-between items-stretch lg:items-center gap-6 relative overflow-hidden">
        <div className="absolute right-0 bottom-0 w-80 h-80 rounded-full bg-brand-success/10 blur-[60px] pointer-events-none"></div>
        <div className="relative z-10 max-w-xl">
          <h2 className="text-xl md:text-3xl font-extrabold mb-2 tracking-tight">Expand your engineering horizon</h2>
          <p className="text-white/70 text-xs md:text-sm">High-fidelity, interactive lectures on Spring Boot, JPA persistence, System Architecture, and DevOps.</p>
        </div>
        <div className="relative z-10 w-full lg:w-80 flex-shrink-0">
          <input
            type="text"
            placeholder="Search courses, topics, or skills..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-11 pr-4 py-3 rounded-xl border border-white/15 bg-white/10 text-white placeholder-white/50 text-sm focus:bg-white/20 focus:border-white/30 focus:outline-none focus:ring-4 focus:ring-white/5 backdrop-blur-md transition-all duration-300"
          />
          <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-white/60 pointer-events-none" />
        </div>
      </div>

      {/* Category Filters */}
      <div className="flex gap-2.5 overflow-x-auto pb-2 -mx-2 px-2 scrollbar-none flex-wrap">
        <button
          onClick={() => handleFilterChange('all')}
          className={`px-5 py-2.5 rounded-full font-bold text-xs md:text-sm border transition-all duration-300 hover:shadow-md ${
            selectedCategory === 'all'
              ? 'bg-gradient-to-r from-brand-primary to-brand-accent border-transparent text-white shadow-md'
              : 'bg-white/60 backdrop-blur-md border-[#E2E4F0] text-brand-muted hover:-translate-y-0.5'
          }`}
        >
          All Fields
        </button>
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => handleFilterChange(String(cat.id))}
            className={`px-5 py-2.5 rounded-full font-bold text-xs md:text-sm border transition-all duration-300 hover:shadow-md ${
              String(selectedCategory) === String(cat.id)
                ? 'border-transparent text-white shadow-md'
                : 'bg-white/60 backdrop-blur-md border-[#E2E4F0] text-brand-muted hover:-translate-y-0.5'
            }`}
            style={{
              background: String(selectedCategory) === String(cat.id) ? cat.color || '#6C1D5F' : undefined,
            }}
          >
            {cat.name}
          </button>
        ))}
      </div>

      {/* Courses Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence mode="popLayout">
          {filteredCourses.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="col-span-full py-16 flex flex-col items-center justify-center text-brand-muted gap-3"
            >
              <Compass className="w-12 h-12 text-brand-muted/60 animate-bounce" />
              <p className="font-bold text-base">No courses match your filter criteria.</p>
            </motion.div>
          ) : (
            filteredCourses.map((course) => {
              const catColor = course.category?.color || '#6C1D5F';
              const progress = getProgress(course.id);

              return (
                <motion.div
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.4 }}
                  key={course.id}
                  onClick={() => navigate(`/learning?courseId=${course.id}`)}
                  className="glass-panel glass-panel-hover p-6 rounded-2xl flex flex-col justify-between cursor-pointer border-l-4"
                  style={{ borderLeftColor: catColor }}
                >
                  <div>
                    {/* Badge and Duration */}
                    <div className="flex justify-between items-start mb-4">
                      <span
                        className="text-[10px] font-bold px-2.5 py-1 rounded-full uppercase border"
                        style={{
                          backgroundColor: `${catColor}15`,
                          color: catColor,
                          borderColor: `${catColor}20`,
                        }}
                      >
                        {course.category?.name || 'Learning'}
                      </span>
                      <span className="text-xs text-brand-muted font-bold">
                        {course.duration || 'Self-Paced'}
                      </span>
                    </div>

                    <h3 className="text-lg font-extrabold text-brand-primaryDark mb-2 leading-snug line-clamp-1">
                      {course.title}
                    </h3>
                    <p className="text-brand-muted text-xs md:text-sm leading-relaxed mb-6 line-clamp-3">
                      {course.description || 'No description provided.'}
                    </p>

                    {/* Progress indicator */}
                    <div className="space-y-1.5 mb-6">
                      <div className="flex justify-between text-[11px] font-bold text-brand-muted">
                        <span>Progress</span>
                        <span>{progress}%</span>
                      </div>
                      <div className="w-full h-1.5 bg-brand-primary/5 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-brand-success to-brand-accent rounded-full transition-all duration-500"
                          style={{ width: `${progress}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-between items-center pt-3 border-t border-[#E2E4F0]/65">
                    <span className="text-xs font-bold text-brand-muted bg-brand-bg/60 border border-[#E2E4F0]/60 px-2.5 py-1 rounded-md">
                      {course.level || 'Beginner'}
                    </span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/learning?courseId=${course.id}`);
                      }}
                      className="bg-gradient-to-r from-brand-cta to-orange-500 hover:from-orange-500 hover:to-brand-cta text-white font-extrabold text-xs py-2 px-4 rounded-lg flex items-center gap-1.5 transition-all duration-300 shadow-sm hover:shadow-md hover:-translate-y-0.5"
                    >
                      <BookOpen className="w-3.5 h-3.5" /> Start Course
                    </button>
                  </div>
                </motion.div>
              );
            })
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};
