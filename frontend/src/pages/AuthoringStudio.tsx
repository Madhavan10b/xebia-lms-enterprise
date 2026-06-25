import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BarChart3, Film, ListPlus, ShieldAlert, Sparkles } from 'lucide-react';
import { courseServices, categoryServices } from '../services/api';
import { useToast } from '../context/ToastContext';
import { Course, Category } from '../types';

export const AuthoringStudio: React.FC = () => {
  const { showToast } = useToast();
  const [courses, setCourses] = useState<Course[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [activeTab, setActiveTab] = useState<'analytics' | 'create-course' | 'create-category'>('analytics');
  const [loading, setLoading] = useState(true);

  // Form States - Course
  const [courseTitle, setCourseTitle] = useState('');
  const [courseCategory, setCourseCategory] = useState('');
  const [courseSlug, setCourseSlug] = useState('');
  const [courseLevel, setCourseLevel] = useState<'Beginner' | 'Intermediate' | 'Advanced'>('Beginner');
  const [courseDuration, setCourseDuration] = useState('');
  const [courseDesc, setCourseDesc] = useState('');
  const [courseKeyword, setCourseKeyword] = useState('');
  const [courseSeo, setCourseSeo] = useState(85);

  // Form States - Category
  const [catName, setCatName] = useState('');
  const [catColor, setCatColor] = useState('#6C1D5F');
  const [catIcon, setCatIcon] = useState('code');
  const [catDesc, setCatDesc] = useState('');

  const loadData = async () => {
    try {
      const [loadedCourses, loadedCategories] = await Promise.all([
        courseServices.getAll(),
        categoryServices.getAll(),
      ]);
      setCourses(loadedCourses);
      setCategories(loadedCategories);
      
      // Auto select first category in select list
      if (loadedCategories.length > 0) {
        setCourseCategory(String(loadedCategories[0].id));
      }
    } catch (err) {
      console.error('Error loading authoring studio data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Auto-slug generation when course title changes
  const handleTitleChange = (val: string) => {
    setCourseTitle(val);
    const slug = val
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
    setCourseSlug(slug);
  };

  // Submit Category
  const handleSubmitCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!catName.trim()) return;

    try {
      const newCat = await categoryServices.create({
        name: catName,
        color: catColor,
        icon: catIcon,
        description: catDesc,
        isActive: true,
      });

      showToast(`Category "${newCat.name}" successfully created!`);
      
      // Reset form
      setCatName('');
      setCatColor('#6C1D5F');
      setCatIcon('code');
      setCatDesc('');
      
      // Reload lists
      await loadData();
      setActiveTab('analytics');
    } catch (err) {
      showToast('Error creating category. Please try again.');
      console.error(err);
    }
  };

  // Submit Course
  const handleSubmitCourse = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!courseTitle.trim() || !courseCategory || !courseSlug.trim()) return;

    try {
      const categoryId = parseInt(courseCategory);
      
      const newCourse = await courseServices.create({
        title: courseTitle,
        slug: courseSlug,
        description: courseDesc,
        shortDescription: courseDesc.substring(0, 150),
        level: courseLevel,
        duration: courseDuration,
        primaryKeyword: courseKeyword,
        seoScore: courseSeo,
        isPublished: true,
        isActive: true,
        isFeatured: false,
        allowIndexing: true,
        showInSearch: true,
        category: { id: categoryId } as Category,
      });

      showToast(`Course "${newCourse.title}" successfully published!`);
      
      // Reset form
      setCourseTitle('');
      setCourseSlug('');
      setCourseDuration('');
      setCourseDesc('');
      setCourseKeyword('');
      setCourseSeo(85);
      
      // Reload lists
      await loadData();
      setActiveTab('analytics');
    } catch (err) {
      showToast('Error publishing course. Please try again.');
      console.error(err);
    }
  };

  // Calculate overall stats
  let totalViews = 0;
  let totalClicks = 0;
  let totalSeoScore = 0;

  courses.forEach((c) => {
    totalViews += c.totalViews || 0;
    totalClicks += c.totalClicks || 0;
    totalSeoScore += c.seoScore || 0;
  });

  const avgCtr = totalViews > 0 ? ((totalClicks / totalViews) * 100).toFixed(1) + '%' : '0.0%';
  const avgSeoScore = courses.length > 0 ? Math.round(totalSeoScore / courses.length) : 0;

  if (loading) {
    return (
      <div className="flex-grow flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-brand-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const subTabs = [
    { id: 'analytics', label: 'SEO & Analytics', icon: BarChart3 },
    { id: 'create-course', label: 'Create Course', icon: Film },
    { id: 'create-category', label: 'Create Category', icon: ListPlus },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex-grow flex flex-col gap-6 md:gap-8"
    >
      {/* Subtab selection */}
      <div className="flex border-b border-[#E2E4F0]/60 gap-6 md:gap-8">
        {subTabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 py-3 px-1 border-b-2 font-bold text-xs md:text-sm transition-all duration-300 ${
                isActive
                  ? 'border-brand-primary text-brand-primary'
                  : 'border-transparent text-brand-muted hover:text-brand-primary'
              }`}
            >
              <Icon className="w-4 h-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Pages Container */}
      <div className="flex-grow">
        <AnimatePresence mode="wait">
          {activeTab === 'analytics' && (
            <motion.div
              key="analytics"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="flex flex-col gap-8"
            >
              {/* SEO Analytics Dashboard Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                <div className="glass-panel p-5 rounded-2xl flex flex-col justify-between transition-all duration-300 hover:shadow-md">
                  <div>
                    <span className="block text-[10px] font-bold text-brand-muted uppercase tracking-wider mb-2">Total Views</span>
                    <span className="text-3xl font-black text-brand-primaryDark">{totalViews.toLocaleString()}</span>
                  </div>
                  <span className="text-[10px] text-brand-success font-bold mt-2">across all pages</span>
                </div>

                <div className="glass-panel p-5 rounded-2xl flex flex-col justify-between transition-all duration-300 hover:shadow-md">
                  <div>
                    <span className="block text-[10px] font-bold text-brand-muted uppercase tracking-wider mb-2">Total Clicks</span>
                    <span className="text-3xl font-black text-brand-primaryDark">{totalClicks.toLocaleString()}</span>
                  </div>
                  <span className="text-[10px] text-brand-success font-bold mt-2">from search engines</span>
                </div>

                <div className="glass-panel p-5 rounded-2xl flex flex-col justify-between transition-all duration-300 hover:shadow-md">
                  <div>
                    <span className="block text-[10px] font-bold text-brand-muted uppercase tracking-wider mb-2">Average CTR</span>
                    <span className="text-3xl font-black text-brand-primaryDark">{avgCtr}</span>
                  </div>
                  <span className="text-[10px] text-brand-success font-bold mt-2">click-through-rate</span>
                </div>

                <div className="glass-panel p-5 rounded-2xl flex flex-col justify-between transition-all duration-300 hover:shadow-md">
                  <div>
                    <span className="block text-[10px] font-bold text-brand-muted uppercase tracking-wider mb-2">Average SEO Score</span>
                    <span className="text-3xl font-black text-brand-primaryDark">{avgSeoScore}</span>
                  </div>
                  <span className="text-[10px] text-brand-success font-bold mt-2">out of 100 max</span>
                </div>
              </div>

              {/* Indexing Table */}
              <div className="glass-panel rounded-2xl border border-white/60 overflow-hidden shadow-glass">
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse text-left text-xs md:text-sm">
                    <thead>
                      <tr className="bg-[#E2E4F0]/25 text-brand-primaryDark border-b border-[#E2E4F0]/40">
                        <th className="p-4 font-extrabold">Course Title</th>
                        <th className="p-4 font-extrabold text-center">Views</th>
                        <th className="p-4 font-extrabold text-center">Clicks</th>
                        <th className="p-4 font-extrabold text-center">CTR</th>
                        <th className="p-4 font-extrabold text-center">SEO Score</th>
                        <th className="p-4 font-extrabold text-center">Indexing Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#E2E4F0]/30">
                      {courses.map((c) => {
                        const ctrVal = c.totalViews ? ((c.totalClicks || 0) / c.totalViews * 100).toFixed(1) + '%' : '0.0%';
                        const isExcellent = (c.seoScore || 0) >= 90;
                        const isGood = (c.seoScore || 0) >= 80;

                        return (
                          <tr key={c.id} className="hover:bg-white/40 transition-all duration-200">
                            <td className="p-4 font-bold text-brand-primaryDark">{c.title}</td>
                            <td className="p-4 text-center text-brand-muted font-semibold">{(c.totalViews || 0).toLocaleString()}</td>
                            <td className="p-4 text-center text-brand-muted font-semibold">{(c.totalClicks || 0).toLocaleString()}</td>
                            <td className="p-4 text-center text-brand-muted font-semibold">{ctrVal}</td>
                            <td className="p-4 text-center">
                              <span
                                className={`px-2.5 py-1 rounded-md text-xs font-bold ${
                                  isExcellent
                                    ? 'bg-brand-success/15 text-brand-success'
                                    : isGood
                                    ? 'bg-brand-cta/15 text-brand-cta'
                                    : 'bg-brand-muted/15 text-brand-muted'
                                }`}
                              >
                                {c.seoScore || 0}/100
                              </span>
                            </td>
                            <td className="p-4 text-center font-extrabold text-xs">
                              <span className={c.isPublished ? 'text-brand-success' : 'text-brand-muted'}>
                                {c.isPublished ? 'Indexed' : 'Draft'}
                              </span>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'create-course' && (
            <motion.div
              key="create-course"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="glass-panel p-6 md:p-8 rounded-2xl border border-white/60 max-w-4xl shadow-glass"
            >
              <form onSubmit={handleSubmitCourse} className="flex flex-col gap-6">
                <div className="flex flex-col gap-2">
                  <label className="font-extrabold text-sm text-brand-primaryDark">Course Title *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Introduction to Spring Boot"
                    value={courseTitle}
                    onChange={(e) => handleTitleChange(e.target.value)}
                    className="px-4 py-3 rounded-xl border border-[#E2E4F0] bg-white/65 text-sm outline-none focus:bg-white focus:border-brand-primary focus:ring-4 focus:ring-brand-primary/5 transition-all duration-300"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="flex flex-col gap-2">
                    <label className="font-extrabold text-sm text-brand-primaryDark">Category *</label>
                    <select
                      required
                      value={courseCategory}
                      onChange={(e) => setCourseCategory(e.target.value)}
                      className="px-4 py-3 rounded-xl border border-[#E2E4F0] bg-white/65 text-sm outline-none focus:bg-white focus:border-brand-primary focus:ring-4 focus:ring-brand-primary/5 transition-all duration-300"
                    >
                      {categories.map((cat) => (
                        <option key={cat.id} value={cat.id}>
                          {cat.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="font-extrabold text-sm text-brand-primaryDark">URL Slug *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. intro-to-spring-boot"
                      value={courseSlug}
                      onChange={(e) => setCourseSlug(e.target.value)}
                      className="px-4 py-3 rounded-xl border border-[#E2E4F0] bg-white/65 text-sm outline-none focus:bg-white focus:border-brand-primary focus:ring-4 focus:ring-brand-primary/5 transition-all duration-300"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="flex flex-col gap-2">
                    <label className="font-extrabold text-sm text-brand-primaryDark">Difficulty Level</label>
                    <select
                      value={courseLevel}
                      onChange={(e) => setCourseLevel(e.target.value as any)}
                      className="px-4 py-3 rounded-xl border border-[#E2E4F0] bg-white/65 text-sm outline-none focus:bg-white focus:border-brand-primary focus:ring-4 focus:ring-brand-primary/5 transition-all duration-300"
                    >
                      <option value="Beginner">Beginner</option>
                      <option value="Intermediate">Intermediate</option>
                      <option value="Advanced">Advanced</option>
                    </select>
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="font-extrabold text-sm text-brand-primaryDark">Duration</label>
                    <input
                      type="text"
                      placeholder="e.g. 10 Hours"
                      value={courseDuration}
                      onChange={(e) => setCourseDuration(e.target.value)}
                      className="px-4 py-3 rounded-xl border border-[#E2E4F0] bg-white/65 text-sm outline-none focus:bg-white focus:border-brand-primary focus:ring-4 focus:ring-brand-primary/5 transition-all duration-300"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <label className="font-extrabold text-sm text-brand-primaryDark">Full Course Description</label>
                  <textarea
                    rows={4}
                    placeholder="Detailed syllabus or course brief..."
                    value={courseDesc}
                    onChange={(e) => setCourseDesc(e.target.value)}
                    className="px-4 py-3 rounded-xl border border-[#E2E4F0] bg-white/65 text-sm outline-none focus:bg-white focus:border-brand-primary focus:ring-4 focus:ring-brand-primary/5 transition-all duration-300"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="flex flex-col gap-2">
                    <label className="font-extrabold text-sm text-brand-primaryDark">Primary Focus Keyword</label>
                    <input
                      type="text"
                      placeholder="e.g. spring boot tutorial"
                      value={courseKeyword}
                      onChange={(e) => setCourseKeyword(e.target.value)}
                      className="px-4 py-3 rounded-xl border border-[#E2E4F0] bg-white/65 text-sm outline-none focus:bg-white focus:border-brand-primary focus:ring-4 focus:ring-brand-primary/5 transition-all duration-300"
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="font-extrabold text-sm text-brand-primaryDark">Starting SEO Rating (0-100)</label>
                    <input
                      type="number"
                      min={0}
                      max={100}
                      value={courseSeo}
                      onChange={(e) => setCourseSeo(parseInt(e.target.value) || 0)}
                      className="px-4 py-3 rounded-xl border border-[#E2E4F0] bg-white/65 text-sm outline-none focus:bg-white focus:border-brand-primary focus:ring-4 focus:ring-brand-primary/5 transition-all duration-300"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="bg-brand-primary hover:bg-brand-accent text-white font-extrabold py-3 px-6 rounded-xl self-start transition-all duration-300 shadow-md hover:shadow-lg hover:-translate-y-0.5"
                >
                  Publish Course
                </button>
              </form>
            </motion.div>
          )}

          {activeTab === 'create-category' && (
            <motion.div
              key="create-category"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="glass-panel p-6 md:p-8 rounded-2xl border border-white/60 max-w-4xl shadow-glass"
            >
              <form onSubmit={handleSubmitCategory} className="flex flex-col gap-6">
                <div className="flex flex-col gap-2">
                  <label className="font-extrabold text-sm text-brand-primaryDark">Category Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Software Development"
                    value={catName}
                    onChange={(e) => setCatName(e.target.value)}
                    className="px-4 py-3 rounded-xl border border-[#E2E4F0] bg-white/65 text-sm outline-none focus:bg-white focus:border-brand-primary focus:ring-4 focus:ring-brand-primary/5 transition-all duration-300"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="flex flex-col gap-2">
                    <label className="font-extrabold text-sm text-brand-primaryDark">Color HEX Code</label>
                    <input
                      type="text"
                      placeholder="e.g. #007bff"
                      value={catColor}
                      onChange={(e) => setCatColor(e.target.value)}
                      className="px-4 py-3 rounded-xl border border-[#E2E4F0] bg-white/65 text-sm outline-none focus:bg-white focus:border-brand-primary focus:ring-4 focus:ring-brand-primary/5 transition-all duration-300"
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="font-extrabold text-sm text-brand-primaryDark">Icon Name / URL</label>
                    <input
                      type="text"
                      placeholder="e.g. dev-icon"
                      value={catIcon}
                      onChange={(e) => setCatIcon(e.target.value)}
                      className="px-4 py-3 rounded-xl border border-[#E2E4F0] bg-white/65 text-sm outline-none focus:bg-white focus:border-brand-primary focus:ring-4 focus:ring-brand-primary/5 transition-all duration-300"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <label className="font-extrabold text-sm text-brand-primaryDark">Description</label>
                  <textarea
                    rows={3}
                    placeholder="Category purpose..."
                    value={catDesc}
                    onChange={(e) => setCatDesc(e.target.value)}
                    className="px-4 py-3 rounded-xl border border-[#E2E4F0] bg-white/65 text-sm outline-none focus:bg-white focus:border-brand-primary focus:ring-4 focus:ring-brand-primary/5 transition-all duration-300"
                  />
                </div>

                <button
                  type="submit"
                  className="bg-brand-primary hover:bg-brand-accent text-white font-extrabold py-3 px-6 rounded-xl self-start transition-all duration-300 shadow-md hover:shadow-lg hover:-translate-y-0.5"
                >
                  Create Category
                </button>
              </form>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};
