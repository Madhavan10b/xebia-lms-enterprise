import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Compass, BookOpen } from 'lucide-react';
import { courseServices, categoryServices } from '../services/api';
import { Course, Category } from '../types';

// Independent 3D Tilt Card Component
interface CourseCardProps {
  course: Course;
  progress: number;
  onClick: () => void;
  onStartClick: (e: React.MouseEvent) => void;
}

const CourseCard: React.FC<CourseCardProps> = ({ course, progress, onClick, onStartClick }) => {
  const [tiltX, setTiltX] = useState(0);
  const [tiltY, setTiltY] = useState(0);
  const catColor = course.category?.color || '#6C1D5F';

  const handleTiltMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    // Limit tilt degree to be extremely professional
    setTiltX(-y / 15);
    setTiltY(x / 15);
  };

  const handleTiltLeave = () => {
    setTiltX(0);
    setTiltY(0);
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.25 }}
      whileHover={{ y: -3 }}
      onMouseMove={handleTiltMove}
      onMouseLeave={handleTiltLeave}
      style={{
        transform: `perspective(1000px) rotateX(${tiltX}deg) rotateY(${tiltY}deg)`,
        transformStyle: 'preserve-3d',
        transition: 'transform 0.1s ease-out',
        borderLeftColor: catColor
      }}
      onClick={onClick}
      className="glass-panel glass-panel-hover p-5 rounded-2xl flex flex-col justify-between cursor-pointer border-l-4"
    >
      <div>
        {/* Badge and Duration */}
        <div className="flex justify-between items-start mb-4">
          <span
            className="text-[9px] font-black px-2.5 py-1 rounded-full uppercase border"
            style={{
              backgroundColor: `${catColor}08`,
              color: catColor,
              borderColor: `${catColor}15`,
            }}
          >
            {course.category?.name || 'Learning'}
          </span>
          <span className="text-[11px] text-brand-muted font-semibold">
            {course.duration || 'Self-Paced'}
          </span>
        </div>

        <h3 className="text-base font-black text-brand-primaryDark mb-2 leading-snug line-clamp-1 tracking-tight">
          {course.title}
        </h3>
        <p className="text-brand-muted text-xs md:text-sm leading-relaxed mb-6 line-clamp-3">
          {course.description || 'No description provided.'}
        </p>

        {/* Progress indicator */}
        <div className="space-y-1.5 mb-6">
          <div className="flex justify-between text-[10px] font-bold text-brand-muted">
            <span>Progress</span>
            <span>{progress}%</span>
          </div>
          <div className="w-full h-1 bg-neutral-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-[#01AC9F] rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>
      </div>

      <div className="flex justify-between items-center pt-3 border-t border-neutral-100">
        <span className="text-[10px] font-bold text-brand-muted bg-neutral-50 border border-neutral-100 px-2 py-0.5 rounded-md">
          {course.level || 'Beginner'}
        </span>
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={onStartClick}
          className="bg-gradient-to-r from-brand-cta to-orange-500 hover:from-orange-500 hover:to-brand-cta text-white font-bold text-xs py-2 px-4 rounded-full flex items-center gap-1 transition-all duration-150 shadow-sm"
        >
          <BookOpen className="w-3.5 h-3.5" /> Start Course
        </motion.button>
      </div>
    </motion.div>
  );
};

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
      className="flex-grow flex flex-col gap-6 md:gap-8"
    >
      {/* Search and Hero Area */}
      <motion.div 
        variants={itemVariants}
        className="bg-gradient-to-br from-brand-primaryDark to-brand-primary border border-brand-primaryDark/20 rounded-2xl p-6 md:p-8 text-white shadow-sm flex flex-col lg:flex-row justify-between items-stretch lg:items-center gap-6 relative overflow-hidden"
      >
        <div className="relative z-10 max-w-xl">
          <h2 className="text-xl md:text-2xl font-black mb-1.5 tracking-tight">Expand your engineering horizon</h2>
          <p className="text-white/80 text-xs md:text-sm">High-fidelity, interactive lectures on Spring Boot, JPA persistence, System Architecture, and DevOps.</p>
        </div>
        <div className="relative z-10 w-full lg:w-80 flex-shrink-0">
          <input
            type="text"
            placeholder="Search courses, topics, or skills..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-full border border-white/15 bg-white/10 text-white placeholder-white/50 text-xs focus:bg-white/15 focus:border-white/30 focus:outline-none focus:ring-4 focus:ring-white/5 backdrop-blur-md transition-all duration-200"
          />
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-white/50 pointer-events-none" />
        </div>
      </motion.div>

      {/* Category Filters */}
      <motion.div 
        variants={itemVariants}
        className="flex gap-2 pb-1 -mx-1 px-1 scrollbar-none flex-wrap"
      >
        <motion.button
          whileHover={{ y: -1 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => handleFilterChange('all')}
          className={`px-4 py-2 rounded-full font-bold text-xs border transition-all duration-150 ${
            selectedCategory === 'all'
              ? 'bg-[#6C1D5F] border-transparent text-white shadow-sm'
              : 'bg-white border-neutral-200/80 text-brand-muted hover:border-brand-primary/20'
          }`}
        >
          All Fields
        </motion.button>
        {categories.map((cat) => (
          <motion.button
            whileHover={{ y: -1 }}
            whileTap={{ scale: 0.97 }}
            key={cat.id}
            onClick={() => handleFilterChange(String(cat.id))}
            className={`px-4 py-2 rounded-full font-bold text-xs border transition-all duration-150 ${
              String(selectedCategory) === String(cat.id)
                ? 'border-transparent text-white shadow-sm'
                : 'bg-white border-neutral-200/80 text-brand-muted hover:border-brand-primary/20'
            }`}
            style={{
              background: String(selectedCategory) === String(cat.id) ? cat.color || '#6C1D5F' : undefined,
            }}
          >
            {cat.name}
          </motion.button>
        ))}
      </motion.div>

      {/* Courses Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence mode="popLayout">
          {filteredCourses.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="col-span-full py-16 flex flex-col items-center justify-center text-brand-muted gap-2.5"
            >
              <Compass className="w-10 h-10 text-brand-muted/40 animate-bounce" />
              <p className="font-extrabold text-sm">No courses match your filter criteria.</p>
            </motion.div>
          ) : (
            filteredCourses.map((course) => (
              <CourseCard
                key={course.id}
                course={course}
                progress={getProgress(course.id)}
                onClick={() => navigate(`/learning?courseId=${course.id}`)}
                onStartClick={(e) => {
                  e.stopPropagation();
                  navigate(`/learning?courseId=${course.id}`);
                }}
              />
            ))
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};
export default CourseCatalog;
