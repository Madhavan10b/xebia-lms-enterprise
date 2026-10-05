import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, Search, Edit2, Trash2, ArrowLeft, Star, Check, Sparkles, HelpCircle, 
  ArrowRight, BookOpen, Share2, Twitter, Cpu, Code 
} from 'lucide-react';
import { courseServices, categoryServices } from '../services/api';
import { useToast } from '../context/ToastContext';
import { Course, Category } from '../types';

export const CoursesPage: React.FC = () => {
  const { showToast } = useToast();
  const [courses, setCourses] = useState<Course[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);

  const userRole = React.useMemo(() => {
    const saved = localStorage.getItem('currentUser');
    if (saved) {
      try {
        return JSON.parse(saved).role;
      } catch (e) {
        return 'admin';
      }
    }
    return 'admin';
  }, []);

  const [portalTarget, setPortalTarget] = useState<HTMLElement | null>(null);
  useEffect(() => {
    setPortalTarget(document.getElementById('header-actions-portal'));
  }, []);

  // Filter States
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [levelFilter, setLevelFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [publishFilter, setPublishFilter] = useState('all');
  const [featuredFilter, setFeaturedFilter] = useState('all');

  // Wizard tab state: 'basic' | 'seo'
  const [wizardTab, setWizardTab] = useState<'basic' | 'seo'>('basic');

  // Form States - Step 1: Basic Details
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [category, setCategory] = useState('');
  const [level, setLevel] = useState<'Beginner' | 'Intermediate' | 'Advanced'>('Beginner');
  const [language, setLanguage] = useState('English');
  const [duration, setDuration] = useState('');
  const [shortDescription, setShortDescription] = useState('');
  const [description, setDescription] = useState('');
  
  // Media
  const [youtubeVideoUrl, setYoutubeVideoUrl] = useState('');
  const [previewVideoUrl, setPreviewVideoUrl] = useState('');
  const [bannerImage, setBannerImage] = useState('https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=400&q=80');

  // Lists (Outcomes, Prereqs, Highlights, Careers)
  const [outcomes, setOutcomes] = useState<string[]>(['']);
  const [prereqs, setPrereqs] = useState<string[]>(['']);
  const [audience, setAudience] = useState<string[]>(['']);
  const [highlights, setHighlights] = useState<string[]>(['']);
  const [careers, setCareers] = useState<string[]>(['']);

  // Flags
  const [isActive, setIsActive] = useState(true);
  const [isFeatured, setIsFeatured] = useState(false);
  const [isPublished, setIsPublished] = useState(true);
  const [allowIndexing, setAllowIndexing] = useState(true);
  const [showInSearch, setShowInSearch] = useState(true);

  // Form States - Step 2: SEO & Meta
  const [metaTitle, setMetaTitle] = useState('');
  const [metaDescription, setMetaDescription] = useState('');
  const [metaKeywords, setMetaKeywords] = useState('');
  const [canonicalUrl, setCanonicalUrl] = useState('');
  const [primaryKeyword, setPrimaryKeyword] = useState('');
  const [secondaryKeywords, setSecondaryKeywords] = useState('');
  const [focusKeywords, setFocusKeywords] = useState('');
  const [robots, setRobots] = useState('index, follow');
  const [author, setAuthor] = useState('Xebia Admin');
  const [schemaMarkup, setSchemaMarkup] = useState('');
  const [faqSchema, setFaqSchema] = useState('');
  const [breadcrumbSchema, setBreadcrumbSchema] = useState('');
  
  // Extra mockup SEO states for 100% exact design match
  const [seocategory, setSeocategory] = useState('');
  const [seotags, setSeotags] = useState('');
  const [semanticKeywords, setSemanticKeywords] = useState('');
  const [searchSynonyms, setSearchSynonyms] = useState('');
  const [searchIntent, setSearchIntent] = useState('');
  const [relatedTopics, setRelatedTopics] = useState('');
  const [ogTitle, setOgTitle] = useState('');
  const [ogDescription, setOgDescription] = useState('');
  const [ogImage, setOgImage] = useState('');
  const [ogType, setOgType] = useState('website');
  const [ogUrl, setOgUrl] = useState('');
  const [twitterTitle, setTwitterTitle] = useState('');
  const [twitterDescription, setTwitterDescription] = useState('');
  const [twitterImage, setTwitterImage] = useState('');
  const [twitterCard, setTwitterCard] = useState('summary_large_image');
  const [faqContent, setFaqContent] = useState('');

  // Script tags
  const [customHeadScript, setCustomHeadScript] = useState('');
  const [customBodyScript, setCustomBodyScript] = useState('');

  const loadData = async () => {
    try {
      setLoading(true);
      const [cats, crs] = await Promise.all([
        categoryServices.getAll(),
        courseServices.getAll()
      ]);
      setCategories(cats);
      setCourses(crs);
      
      if (cats.length > 0 && !category) {
        setCategory(String(cats[0].id));
      }
    } catch (err) {
      console.error(err);
      showToast('Error loading courses page data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Handle slug change
  const handleTitleChange = (val: string) => {
    setTitle(val);
    const slg = val
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
    setSlug(slg);
  };

  // Open Create Wizard
  const handleOpenCreate = () => {
    setTitle('');
    setSlug('');
    if (categories.length > 0) setCategory(String(categories[0].id));
    setLevel('Beginner');
    setLanguage('English');
    setDuration('');
    setShortDescription('');
    setDescription('');
    setYoutubeVideoUrl('');
    setPreviewVideoUrl('');
    setBannerImage('https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=400&q=80');
    
    setOutcomes(['']);
    setPrereqs(['']);
    setAudience(['']);
    setHighlights(['']);
    setCareers(['']);
    
    setIsActive(true);
    setIsFeatured(false);
    setIsPublished(true);
    setAllowIndexing(true);
    setShowInSearch(true);

    // SEO reset
    setMetaTitle('');
    setMetaDescription('');
    setMetaKeywords('');
    setCanonicalUrl('');
    setPrimaryKeyword('');
    setSecondaryKeywords('');
    setFocusKeywords('');
    setRobots('index, follow');
    setAuthor('Xebia Admin');
    setSchemaMarkup('');
    setFaqSchema('');
    setBreadcrumbSchema('');
    setOgTitle('');
    setOgDescription('');
    setOgImage('');
    setTwitterTitle('');
    setTwitterDescription('');
    setTwitterImage('');
    setCustomHeadScript('');
    setCustomBodyScript('');

    setEditingId(null);
    setWizardTab('basic');
    setIsEditing(true);
  };

  // Open Edit Wizard
  const handleOpenEdit = (crs: Course) => {
    setTitle(crs.title);
    setSlug(crs.slug);
    setCategory(String(crs.category?.id || ''));
    setLevel(crs.level || 'Beginner');
    setLanguage(crs.language || 'English');
    setDuration(crs.duration || '');
    setShortDescription(crs.shortDescription || '');
    setDescription(crs.description || '');
    setYoutubeVideoUrl(crs.youtubeVideoUrl || '');
    setPreviewVideoUrl(crs.previewVideoUrl || '');
    setBannerImage(crs.bannerImage || 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=400&q=80');

    setOutcomes(crs.learningOutcomes ? JSON.parse(crs.learningOutcomes) : ['']);
    setPrereqs(crs.prerequisites ? JSON.parse(crs.prerequisites) : ['']);
    setAudience(crs.targetAudience ? JSON.parse(crs.targetAudience) : ['']);
    setHighlights(crs.courseHighlights ? JSON.parse(crs.courseHighlights) : ['']);
    setCareers(crs.careerOpportunities ? JSON.parse(crs.careerOpportunities) : ['']);

    setIsActive(crs.isActive ?? true);
    setIsFeatured(crs.isFeatured ?? false);
    setIsPublished(crs.isPublished ?? true);
    setAllowIndexing(crs.allowIndexing ?? true);
    setShowInSearch(crs.showInSearch ?? true);

    setMetaTitle(crs.metaTitle || '');
    setMetaDescription(crs.metaDescription || '');
    setMetaKeywords(crs.metaKeywords || '');
    setCanonicalUrl(crs.canonicalUrl || '');
    setPrimaryKeyword(crs.primaryKeyword || '');
    setSecondaryKeywords(crs.secondaryKeywords || '');
    setFocusKeywords(crs.focusKeywords || '');
    setRobots(crs.robots || 'index, follow');
    setAuthor(crs.author || 'Xebia Admin');
    setSchemaMarkup(crs.schemaMarkup || '');
    setFaqSchema(crs.faqSchema || '');
    setBreadcrumbSchema(crs.breadcrumbSchema || '');
    setOgTitle(crs.ogTitle || '');
    setOgDescription(crs.ogDescription || '');
    setOgImage(crs.ogImage || '');
    setTwitterTitle(crs.twitterTitle || '');
    setTwitterDescription(crs.twitterDescription || '');
    setTwitterImage(crs.twitterImage || '');
    setCustomHeadScript(crs.customHeadScript || '');
    setCustomBodyScript(crs.customBodyScript || '');

    setEditingId(crs.id);
    setWizardTab('basic');
    setIsEditing(true);
  };

  // Dynamic SEO Score calculation
  const calculateSeoScore = () => {
    let score = 10; // base score
    if (metaTitle.trim()) score += 15;
    if (metaTitle.length >= 45 && metaTitle.length <= 65) score += 10;
    if (metaDescription.trim()) score += 15;
    if (metaDescription.length >= 110 && metaDescription.length <= 165) score += 10;
    if (primaryKeyword.trim() && metaTitle.toLowerCase().includes(primaryKeyword.toLowerCase())) score += 10;
    if (primaryKeyword.trim() && metaDescription.toLowerCase().includes(primaryKeyword.toLowerCase())) score += 10;
    if (focusKeywords.trim()) score += 5;
    if (canonicalUrl.trim()) score += 10;
    if (schemaMarkup.trim() || faqSchema.trim()) score += 10;
    if (score > 100) return 100;
    return score;
  };

  const seoScore = calculateSeoScore();

  // Handle Save
  const handleSave = async (e: React.FormEvent, asDraft: boolean = false) => {
    e.preventDefault();
    if (!title.trim() || !category) {
      showToast('Title and Category are required.');
      return;
    }

    const matchedCat = categories.find(c => String(c.id) === String(category));

    const courseData: Course = {
      id: editingId || 0,
      title,
      slug,
      description,
      shortDescription,
      level,
      language,
      duration,
      bannerImage,
      isActive,
      isFeatured,
      isPublished: asDraft ? false : isPublished,
      allowIndexing,
      showInSearch,
      
      category: matchedCat || { id: parseInt(category) } as Category,
      
      // JSON strings for list fields
      learningOutcomes: JSON.stringify(outcomes.filter(o => o.trim())),
      prerequisites: JSON.stringify(prereqs.filter(p => p.trim())),
      targetAudience: JSON.stringify(audience.filter(a => a.trim())),
      courseHighlights: JSON.stringify(highlights.filter(h => h.trim())),
      careerOpportunities: JSON.stringify(careers.filter(c => c.trim())),

      // SEO
      metaTitle,
      metaDescription,
      metaKeywords,
      canonicalUrl,
      primaryKeyword,
      secondaryKeywords,
      focusKeywords,
      robots,
      author,
      schemaMarkup,
      faqSchema,
      breadcrumbSchema,
      
      // OG / Twitter
      ogTitle,
      ogDescription,
      ogImage,
      twitterTitle,
      twitterDescription,
      twitterImage,
      
      customHeadScript,
      customBodyScript,
      
      seoScore,
    };

    try {
      if (editingId) {
        await courseServices.update(editingId, courseData);
        showToast(`Course "${title}" successfully updated!`);
      } else {
        await courseServices.create(courseData);
        showToast(`Course "${title}" successfully created!`);
      }
      setIsEditing(false);
      setEditingId(null);
      loadData();
    } catch (err) {
      console.error(err);
      showToast('Error saving course.');
    }
  };

  // Handle Delete
  const handleDelete = async (id: number, crsTitle: string) => {
    if (window.confirm(`Are you sure you want to delete course "${crsTitle}"?`)) {
      try {
        await courseServices.delete(id);
        showToast(`Course "${crsTitle}" deleted successfully.`);
        loadData();
      } catch (err) {
        console.error(err);
        showToast('Error deleting course.');
      }
    }
  };

  // Toggle flags directly from table
  const handleToggleActive = async (crs: Course) => {
    try {
      await courseServices.update(crs.id, { ...crs, isActive: !crs.isActive });
      showToast(`Toggled status for "${crs.title}"`);
      loadData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleToggleFeatured = async (crs: Course) => {
    try {
      await courseServices.update(crs.id, { ...crs, isFeatured: !crs.isFeatured });
      showToast(`Updated featured status for "${crs.title}"`);
      loadData();
    } catch (err) {
      console.error(err);
    }
  };

  // Filter computation
  const filteredCourses = courses.filter((crs) => {
    const query = searchQuery.toLowerCase();
    const matchesSearch = 
      (crs.title || '').toLowerCase().includes(query) || 
      (crs.slug || '').toLowerCase().includes(query);
      
    const courseCatId = crs.category && typeof crs.category === 'object' ? crs.category.id : crs.category;
    const matchesCategory = categoryFilter === 'all' || String(courseCatId) === String(categoryFilter);
    const matchesLevel = levelFilter === 'all' || crs.level === levelFilter;
    const matchesStatus = 
      statusFilter === 'all' || 
      (statusFilter === 'active' && crs.isActive) ||
      (statusFilter === 'inactive' && !crs.isActive);

    const matchesPublished = 
      publishFilter === 'all' || 
      (publishFilter === 'published' && crs.isPublished) ||
      (publishFilter === 'draft' && !crs.isPublished);

    const matchesFeatured = 
      featuredFilter === 'all' || 
      (featuredFilter === 'featured' && crs.isFeatured) ||
      (featuredFilter === 'standard' && !crs.isFeatured);

    return matchesSearch && matchesCategory && matchesLevel && matchesStatus && matchesPublished && matchesFeatured;
  });

  // Dynamic add/remove inputs helpers
  const handleListChange = (index: number, val: string, list: string[], setList: React.Dispatch<React.SetStateAction<string[]>>) => {
    const next = [...list];
    next[index] = val;
    setList(next);
  };

  const handleAddInput = (list: string[], setList: React.Dispatch<React.SetStateAction<string[]>>) => {
    setList([...list, '']);
  };

  const handleRemoveInput = (index: number, list: string[], setList: React.Dispatch<React.SetStateAction<string[]>>) => {
    if (list.length === 1) {
      setList(['']);
    } else {
      setList(list.filter((_, idx) => idx !== index));
    }
  };

  return (
    <div className="flex-grow flex flex-col gap-6 relative">
      {/* Top Right Create Button Overlay via Portal */}
      {portalTarget && !isEditing && userRole !== 'student' && createPortal(
        <button
          onClick={handleOpenCreate}
          className="bg-[#0f3443] hover:bg-[#0f3443]/90 text-white font-extrabold text-xs py-2.5 px-4.5 rounded-xl flex items-center justify-center gap-1.5 shadow-sm transition-all duration-300 hover:-translate-y-0.5"
        >
          <Plus className="w-4 h-4" /> Create Course
        </button>,
        portalTarget
      )}
      <AnimatePresence mode="wait">
        {!isEditing ? (
          <motion.div
            key="list"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="flex flex-col gap-6"
          >
            {/* Filter controls panel */}
            <div className="glass-panel p-4 rounded-2xl flex flex-wrap items-center justify-between gap-4 border border-white/60 shadow-glass">
              <div className="flex flex-wrap items-center gap-3 flex-grow">
                {/* Search */}
                <div className="relative w-full sm:w-64 flex-shrink-0">
                  <input
                    type="text"
                    placeholder="Search by title or slug..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-9 pr-4 py-2 rounded-xl text-xs font-semibold glass-input outline-none"
                  />
                  <Search className="w-4 h-4 text-brand-muted absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>

                {/* Filters */}
                <select
                  value={levelFilter}
                  onChange={(e) => setLevelFilter(e.target.value)}
                  className="px-3.5 py-2 rounded-xl text-xs font-bold bg-white/65 border border-[#E2E4F0] outline-none text-brand-primaryDark flex-shrink-0 min-w-[120px]"
                >
                  <option value="all">All Levels</option>
                  <option value="Beginner">Beginner</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Advanced">Advanced</option>
                  <option value="Expert">Expert</option>
                </select>

                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="px-3.5 py-2 rounded-xl text-xs font-bold bg-white/65 border border-[#E2E4F0] outline-none text-brand-primaryDark flex-shrink-0 min-w-[130px]"
                >
                  <option value="all">All Categories</option>
                  {categories.map(c => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>

                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-3.5 py-2 rounded-xl text-xs font-bold bg-white/65 border border-[#E2E4F0] outline-none text-brand-primaryDark flex-shrink-0 min-w-[120px]"
                >
                  <option value="all">All Status</option>
                  <option value="active">Active Only</option>
                  <option value="inactive">Inactive Only</option>
                </select>

                <select
                  value={publishFilter}
                  onChange={(e) => setPublishFilter(e.target.value)}
                  className="px-3.5 py-2 rounded-xl text-xs font-bold bg-white/65 border border-[#E2E4F0] outline-none text-brand-primaryDark flex-shrink-0 min-w-[120px]"
                >
                  <option value="all">All Published</option>
                  <option value="published">Published</option>
                  <option value="draft">Draft</option>
                </select>

                <select
                  value={featuredFilter}
                  onChange={(e) => setFeaturedFilter(e.target.value)}
                  className="px-3.5 py-2 rounded-xl text-xs font-bold bg-white/65 border border-[#E2E4F0] outline-none text-brand-primaryDark flex-shrink-0 min-w-[120px]"
                >
                  <option value="all">All Featured</option>
                  <option value="featured">Featured Only</option>
                  <option value="standard">Standard Only</option>
                </select>
              </div>

              {/* Course count */}
              <div className="flex items-center gap-2 ml-auto flex-shrink-0">
                <span className="text-xs text-brand-muted font-bold tracking-wide">{filteredCourses.length} courses</span>
              </div>
            </div>

            {/* Courses Table Container */}
            <div className="glass-panel rounded-2xl border border-white/60 overflow-hidden shadow-glass">
              <div className="overflow-x-auto">
                <table className="w-full border-collapse text-left text-xs md:text-sm">
                  <thead>
                    <tr className="bg-[#E2E4F0]/25 text-brand-primaryDark border-b border-[#E2E4F0]/40">
                      <th className="px-6 py-4 font-bold w-12 text-center tracking-wider">#</th>
                      <th className="px-6 py-4 font-bold tracking-wider">COURSE</th>
                      <th className="px-6 py-4 font-bold tracking-wider">CATEGORY</th>
                      <th className="px-6 py-4 font-bold tracking-wider">LEVEL</th>
                      <th className="px-6 py-4 font-bold tracking-wider">LANGUAGE</th>
                      <th className="px-6 py-4 font-bold tracking-wider">DURATION</th>
                      <th className="px-6 py-4 font-bold text-center tracking-wider">STATUS</th>
                      <th className="px-6 py-4 font-bold text-center tracking-wider">FEATURED</th>
                      <th className="px-6 py-4 font-bold text-center w-28 tracking-wider">ACTIONS</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E2E4F0]/20">
                    {filteredCourses.length === 0 ? (
                      <tr>
                        <td colSpan={9} className="px-6 py-10 text-center text-brand-muted font-bold">
                          No courses matching current filter rules.
                        </td>
                      </tr>
                    ) : (
                      filteredCourses.map((crs, idx) => {
                        const levelColors = crs.level === 'Advanced' 
                          ? 'bg-[#FF6200]/10 text-[#FF6200] border-[#FF6200]/25' 
                          : crs.level === 'Intermediate' 
                          ? 'bg-[#7928CA]/10 text-[#7928CA] border-[#7928CA]/25' 
                          : crs.level === 'Expert' 
                          ? 'bg-slate-900 text-slate-100 border-slate-950'
                          : 'bg-[#01AC9F]/10 text-[#01AC9F] border-[#01AC9F]/25';

                        const catColor = crs.category?.color || '#6C1D5F';
                        const catName = crs.category?.name || 'Academy';

                        return (
                          <tr key={crs.id} className="hover:bg-white/40 transition-all duration-200">
                            <td className="px-6 py-4 text-center font-bold text-brand-muted">{idx + 1}</td>
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-3">
                                <img 
                                  src={crs.bannerImage || 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=100&q=80'} 
                                  alt={crs.title} 
                                  className="w-10 h-10 rounded-xl object-cover border border-white/40 shadow-sm flex-shrink-0"
                                />
                                <div className="flex flex-col text-left">
                                  <span className="font-extrabold text-brand-primaryDark tracking-wide leading-tight text-xs md:text-sm">{crs.title}</span>
                                  <span className="text-[10px] text-brand-muted/70 font-mono mt-0.5">{crs.slug}</span>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full inline-block flex-shrink-0" style={{ backgroundColor: catColor }}></span>
                                <span className="text-xs font-extrabold text-brand-primaryDark">{catName}</span>
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <span className={`px-3 py-1 rounded-full text-[10px] font-black tracking-wide border ${levelColors}`}>
                                {crs.level || 'Beginner'}
                              </span>
                            </td>
                            <td className="px-6 py-4 text-brand-primaryDark font-bold text-xs tracking-wide">{crs.language || 'English'}</td>
                            <td className="px-6 py-4 text-brand-primaryDark font-bold text-xs tracking-wide">{crs.duration || 'Self-Paced'}</td>
                            <td className="px-6 py-4 text-center">
                              <div className="flex items-center justify-center gap-2">
                                <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-wider ${
                                  crs.isActive 
                                    ? 'bg-brand-success/15 text-brand-success' 
                                    : 'bg-slate-100 text-slate-500'
                                }`}>
                                  {crs.isActive ? 'Active' : 'Inactive'}
                                </span>
                                <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-wider ${
                                  crs.isPublished 
                                    ? 'bg-purple-100 text-purple-700' 
                                    : 'bg-slate-100 text-slate-500'
                                }`}>
                                  {crs.isPublished ? 'Published' : 'Draft'}
                                </span>
                              </div>
                            </td>
                            <td className="px-6 py-4 text-center">
                              <button 
                                onClick={() => userRole !== 'student' && handleToggleFeatured(crs)}
                                disabled={userRole === 'student'}
                                className={`transition-colors duration-200 ${userRole === 'student' ? 'cursor-default' : 'hover:text-yellow-400'} ${crs.isFeatured ? 'text-yellow-500' : 'text-zinc-300'}`}
                              >
                                <Star className={`w-4 h-4 ${crs.isFeatured ? 'fill-yellow-500' : ''}`} />
                              </button>
                            </td>
                            <td className="px-6 py-4">
                              {userRole !== 'student' ? (
                                <div className="flex items-center justify-center gap-1.5">
                                  <button
                                    onClick={() => handleOpenEdit(crs)}
                                    className="p-1.5 rounded-lg bg-white/70 hover:bg-brand-primary hover:text-white border border-[#E2E4F0] text-brand-muted transition-all duration-200"
                                    title="Edit Course"
                                  >
                                    <Edit2 className="w-3.5 h-3.5" />
                                  </button>
                                  <button
                                    onClick={() => handleDelete(crs.id, crs.title)}
                                    className="p-1.5 rounded-lg bg-white/70 hover:bg-red-500 hover:text-white border border-[#E2E4F0] text-brand-muted transition-all duration-200"
                                    title="Delete Course"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              ) : (
                                <span className="text-[10px] text-brand-muted font-bold italic">Read Only</span>
                              )}
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>

              {/* Pagination Controls */}
              {filteredCourses.length > 0 && (
                <div className="flex justify-between items-center px-6 py-4 border-t border-[#E2E4F0]/60 bg-white/20">
                  <span className="text-[11px] text-brand-muted font-bold">Showing 1-{filteredCourses.length} of {filteredCourses.length} courses</span>
                  <div className="flex items-center gap-1.5">
                    <button className="p-1.5 rounded-lg text-brand-muted hover:bg-[#E2E4F0]/30 transition-all font-bold text-xs" disabled>&lt;</button>
                    <button className="w-7 h-7 rounded-lg bg-brand-primary text-white text-xs font-black shadow-sm">1</button>
                    <button className="p-1.5 rounded-lg text-brand-muted hover:bg-[#E2E4F0]/30 transition-all font-bold text-xs" disabled>&gt;</button>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="wizard"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="flex flex-col gap-6"
          >
            {/* Header info with breadcrumbs and wizard navigation step pills */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#E2E4F0]/60 pb-5">
              <div>
                <div className="flex items-center gap-2 text-[10px] text-brand-muted font-bold tracking-wider uppercase mb-1">
                  <span>Courses</span>
                  <span>&gt;</span>
                  <span className="text-[#0f3443]">{editingId ? 'Edit Course' : 'Create Course'}</span>
                </div>
                <h2 className="text-xl font-black text-brand-primaryDark tracking-wide">
                  {editingId ? 'Edit Course' : 'Create Course'} — {wizardTab === 'basic' ? 'Basic Details' : 'SEO & Meta'}
                </h2>
                <p className="text-xs text-brand-muted font-semibold mt-1">
                  {wizardTab === 'basic' 
                    ? 'Core information, media, content builders and course settings' 
                    : 'Search engine optimization, microdata schemas, Open Graph and Twitter cards'}
                </p>
              </div>

              {/* Step indicator pills */}
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setWizardTab('basic')}
                  className={`px-3 py-1.5 rounded-full text-xs font-black transition-all ${
                    wizardTab === 'basic'
                      ? 'bg-[#84117C] text-white'
                      : 'bg-white border border-[#E2E4F0] text-brand-muted hover:text-brand-primary'
                  }`}
                >
                  Basic Details
                </button>
                <button
                  type="button"
                  onClick={() => setWizardTab('seo')}
                  className={`px-3 py-1.5 rounded-full text-xs font-black transition-all flex items-center gap-1.5 ${
                    wizardTab === 'seo'
                      ? 'bg-[#84117C] text-white'
                      : 'bg-white border border-[#E2E4F0] text-brand-muted hover:text-brand-primary'
                  }`}
                >
                  <span>SEO & Meta</span>
                  <span className={`text-[9px] px-1.5 py-0.5 rounded font-black ${
                    wizardTab === 'seo' ? 'bg-white/20 text-white' : 'bg-brand-success/10 text-brand-success'
                  }`}>
                    {seoScore}
                  </span>
                </button>
                <button
                  type="button"
                  className="px-3 py-1.5 rounded-full text-xs font-black bg-white border border-[#E2E4F0] text-brand-muted cursor-not-allowed opacity-60"
                  disabled
                >
                  Shell / Audio Upload
                </button>
              </div>
            </div>

            {/* Wizard Content layout splitscreen */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8 items-start mt-4">
              
              {/* Left/Middle Content Form */}
              <div className="lg:col-span-2 flex flex-col gap-6">
                
                {/* Rendering Tab Content */}
                <form onSubmit={(e) => handleSave(e)} className="flex flex-col text-left">
                  {wizardTab === 'basic' ? (
                    <div className="flex flex-col gap-6">
                      {/* Identity Card */}
                      <div className="glass-panel p-6 md:p-8 rounded-3xl border border-white/60 shadow-glass flex flex-col gap-5 border-t-4 border-t-[#84117C] bg-white/70">
                        <h3 className="text-base font-black text-brand-primaryDark flex items-center gap-2 border-b border-[#E2E4F0]/60 pb-2">
                          <BookOpen className="w-4.5 h-4.5 text-[#84117C]" /> Course Identity
                        </h3>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                          {/* Title */}
                          <div className="flex flex-col gap-1.5 sm:col-span-2">
                            <div className="flex justify-between items-center">
                              <label className="font-extrabold text-xs text-brand-primaryDark">title *</label>
                              <span className="text-[10px] text-brand-muted font-bold">{title.length}/100</span>
                            </div>
                            <input
                              type="text"
                              required
                              placeholder="e.g. Spring Boot Masterclass"
                              value={title}
                              onChange={(e) => handleTitleChange(e.target.value)}
                              className="px-4 py-3 rounded-xl text-xs font-semibold glass-input outline-none"
                            />
                          </div>

                          {/* Slug */}
                          <div className="flex flex-col gap-1.5 sm:col-span-2">
                            <div className="flex justify-between items-center">
                              <label className="font-extrabold text-xs text-brand-primaryDark">slug * <span className="text-[9px] text-brand-muted font-normal">(unique • max 200)</span></label>
                              <span className="text-[10px] bg-emerald-500/10 text-emerald-600 px-2 py-0.5 rounded font-black border border-emerald-500/20 flex items-center gap-1">Unique</span>
                            </div>
                            <div className="relative">
                              <input
                                type="text"
                                placeholder="spring-boot-masterclass"
                                value={slug}
                                onChange={(e) => setSlug(e.target.value)}
                                className="w-full pl-4 pr-10 py-3 rounded-xl text-xs font-semibold glass-input outline-none font-mono"
                              />
                              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-brand-muted"><Check className="w-4 h-4 text-emerald-500" /></span>
                            </div>
                            <span className="text-[10px] text-brand-muted font-semibold mt-0.5">Auto-generated from title. Click lock to edit manually.</span>
                          </div>

                          {/* Category */}
                          <div className="flex flex-col gap-1.5">
                            <label className="font-extrabold text-xs text-brand-primaryDark">category *</label>
                            <select
                              required
                              value={category}
                              onChange={(e) => setCategory(e.target.value)}
                              className="px-4 py-3 rounded-xl text-xs font-bold bg-white/65 border border-[#E2E4F0] outline-none text-brand-primaryDark"
                            >
                              {categories.map((c) => (
                                <option key={c.id} value={c.id}>
                                  {c.name}
                                </option>
                              ))}
                            </select>
                          </div>

                          {/* Level */}
                          <div className="flex flex-col gap-1.5">
                            <label className="font-extrabold text-xs text-brand-primaryDark">level</label>
                            <select
                              value={level}
                              onChange={(e) => setLevel(e.target.value as any)}
                              className="px-4 py-3 rounded-xl text-xs font-bold bg-white/65 border border-[#E2E4F0] outline-none text-brand-primaryDark"
                            >
                              <option value="Beginner">Beginner</option>
                              <option value="Intermediate">Intermediate</option>
                              <option value="Advanced">Advanced</option>
                              <option value="Expert">Expert</option>
                            </select>
                          </div>

                          {/* Language */}
                          <div className="flex flex-col gap-1.5">
                            <label className="font-extrabold text-xs text-brand-primaryDark">language <span className="text-[9px] text-brand-muted font-normal">(max 100)</span></label>
                            <input
                              type="text"
                              placeholder="English"
                              value={language}
                              onChange={(e) => setLanguage(e.target.value)}
                              className="px-4 py-3 rounded-xl text-xs font-semibold glass-input outline-none"
                            />
                          </div>

                          {/* Duration */}
                          <div className="flex flex-col gap-1.5">
                            <label className="font-extrabold text-xs text-brand-primaryDark">duration <span className="text-[9px] text-brand-muted font-normal">(max 100)</span></label>
                            <input
                              type="text"
                              placeholder="e.g. 18 hrs or 6 weeks"
                              value={duration}
                              onChange={(e) => setDuration(e.target.value)}
                              className="px-4 py-3 rounded-xl text-xs font-semibold glass-input outline-none"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Descriptions Card */}
                      <div className="glass-panel p-6 md:p-8 rounded-3xl border border-white/60 shadow-glass flex flex-col gap-5 border-t-4 border-t-[#84117C] bg-white/70">
                        <h3 className="text-base font-black text-brand-primaryDark flex items-center gap-2 border-b border-[#E2E4F0]/60 pb-2">
                          <Edit2 className="w-4.5 h-4.5 text-[#84117C]" /> Descriptions
                        </h3>

                        {/* Short Description */}
                        <div className="flex flex-col gap-1.5">
                          <label className="font-extrabold text-xs text-brand-primaryDark">shortDescription</label>
                          <span className="text-[10px] text-brand-muted font-semibold mb-1">A brief summary shown in course cards and search results.</span>
                          <textarea
                            rows={3}
                            placeholder="A beefy summary shown in course cards and search results."
                            value={shortDescription}
                            onChange={(e) => setShortDescription(e.target.value)}
                            className="px-4 py-3 rounded-xl text-xs font-semibold glass-input outline-none resize-none"
                          />
                        </div>

                        {/* Full Description */}
                        <div className="flex flex-col gap-1.5">
                          <label className="font-extrabold text-xs text-brand-primaryDark">description <span className="text-[10px] text-brand-muted font-normal">(markdown)</span></label>
                          <span className="text-[10px] text-brand-muted font-semibold mb-1">Full course description - markdown supported.</span>
                          <textarea
                            rows={6}
                            placeholder="Full course description - markdown supported."
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className="px-4 py-3 rounded-xl text-xs font-semibold glass-input outline-none resize-none"
                          />
                        </div>
                      </div>

                      {/* Media Card */}
                      <div className="glass-panel p-6 md:p-8 rounded-3xl border border-white/60 shadow-glass flex flex-col gap-5 border-t-4 border-t-[#FF6200] bg-white/70">
                        <h3 className="text-base font-black text-brand-primaryDark flex items-center gap-2 border-b border-[#E2E4F0]/60 pb-2">
                          <Sparkles className="w-4.5 h-4.5 text-[#FF6200]" /> Media
                        </h3>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                          <div className="flex flex-col gap-1.5">
                            <label className="font-extrabold text-xs text-brand-primaryDark">icon <span className="text-[9px] text-brand-muted font-normal">(max 1000)</span></label>
                            <input
                              type="text"
                              placeholder="Emoji or image URL..."
                              value=""
                              readOnly
                              className="px-4 py-3 rounded-xl text-xs font-semibold glass-input outline-none bg-slate-100/50 cursor-not-allowed"
                            />
                          </div>

                          <div className="flex flex-col gap-1.5">
                            <label className="font-extrabold text-xs text-brand-primaryDark">thumbnail <span className="text-[9px] text-brand-muted font-normal">(max 1000)</span></label>
                            <input
                              type="text"
                              placeholder="https://cdn.example.com/thumb.jpg"
                              value={bannerImage}
                              onChange={(e) => setBannerImage(e.target.value)}
                              className="px-4 py-3 rounded-xl text-xs font-semibold glass-input outline-none font-mono"
                            />
                          </div>

                          <div className="flex flex-col gap-1.5 sm:col-span-2">
                            <label className="font-extrabold text-xs text-brand-primaryDark">bannerImage <span className="text-[9px] text-brand-muted font-normal">(max 1000)</span></label>
                            <input
                              type="text"
                              placeholder="https://example.com/images/banner.jpg"
                              value={bannerImage}
                              onChange={(e) => setBannerImage(e.target.value)}
                              className="px-4 py-3 rounded-xl text-xs font-semibold glass-input outline-none font-mono"
                            />
                          </div>

                          <div className="flex flex-col gap-1.5 sm:col-span-2">
                            <label className="font-extrabold text-xs text-brand-primaryDark">youtubeVideoUrl <span className="text-[9px] text-brand-muted font-normal">(max 1000)</span></label>
                            <input
                              type="text"
                              placeholder="https://youtube.com/watch?v=..."
                              value={youtubeVideoUrl}
                              onChange={(e) => setYoutubeVideoUrl(e.target.value)}
                              className="px-4 py-3 rounded-xl text-xs font-semibold glass-input outline-none font-mono"
                            />
                          </div>

                          <div className="flex flex-col gap-1.5 sm:col-span-2">
                            <label className="font-extrabold text-xs text-brand-primaryDark">previewVideoUrl <span className="text-[9px] text-brand-muted font-normal">(max 1000 - shown on course landing page)</span></label>
                            <input
                              type="text"
                              placeholder="https://example.com/videos/intro.mp4"
                              value={previewVideoUrl}
                              onChange={(e) => setPreviewVideoUrl(e.target.value)}
                              className="px-4 py-3 rounded-xl text-xs font-semibold glass-input outline-none font-mono"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Course Content Builders Card */}
                      <div className="glass-panel p-6 md:p-8 rounded-3xl border border-white/60 shadow-glass flex flex-col gap-5 border-t-4 border-t-[#01AC9F] bg-white/70">
                        <h3 className="text-base font-black text-brand-primaryDark flex items-center gap-2 border-b border-[#E2E4F0]/60 pb-2">
                          <Check className="w-4.5 h-4.5 text-[#01AC9F]" /> Course Content Builders
                        </h3>

                        {/* Outcomes */}
                        <div className="flex flex-col gap-3">
                          <div className="flex justify-between items-center">
                            <label className="font-extrabold text-xs text-brand-primaryDark">learningOutcomes</label>
                            <span className="text-[10px] text-brand-muted font-bold uppercase">{outcomes.filter(o => o.trim()).length} ITEMS</span>
                          </div>
                          {outcomes.map((item, idx) => (
                            <div key={idx} className="flex gap-2 items-center bg-white/40 border border-[#E2E4F0]/40 rounded-xl p-1.5 shadow-sm">
                              <span className="text-brand-muted font-bold px-2 cursor-grab">::</span>
                              <span className="w-1.5 h-1.5 rounded-full bg-[#01AC9F] flex-shrink-0"></span>
                              <input
                                type="text"
                                value={item}
                                placeholder="e.g. Build production-ready REST APIs"
                                onChange={(e) => handleListChange(idx, e.target.value, outcomes, setOutcomes)}
                                className="flex-1 bg-transparent text-xs font-semibold outline-none py-1 px-2"
                              />
                              <button
                                type="button"
                                onClick={() => handleRemoveInput(idx, outcomes, setOutcomes)}
                                className="text-xs font-bold text-red-500 hover:text-red-700 px-2"
                              >
                                ×
                              </button>
                            </div>
                          ))}
                          <button
                            type="button"
                            onClick={() => handleAddInput(outcomes, setOutcomes)}
                            className="w-full py-2.5 rounded-xl border border-dashed border-[#E2E4F0] text-xs font-black text-brand-primary hover:bg-[#E2E4F0]/20 flex items-center justify-center gap-1.5 transition-all"
                          >
                            <Plus className="w-4 h-4" /> Add Outcome
                          </button>
                        </div>

                        {/* Prerequisites */}
                        <div className="flex flex-col gap-3 mt-4">
                          <div className="flex justify-between items-center">
                            <label className="font-extrabold text-xs text-brand-primaryDark">prerequisites</label>
                            <span className="text-[10px] text-brand-muted font-bold uppercase">{prereqs.filter(p => p.trim()).length} ITEMS</span>
                          </div>
                          {prereqs.map((item, idx) => (
                            <div key={idx} className="flex gap-2 items-center bg-white/40 border border-[#E2E4F0]/40 rounded-xl p-1.5 shadow-sm">
                              <span className="text-brand-muted font-bold px-2 cursor-grab">::</span>
                              <span className="w-1.5 h-1.5 rounded-full bg-blue-500 flex-shrink-0"></span>
                              <input
                                type="text"
                                value={item}
                                placeholder="e.g. Basic Java syntax knowledge"
                                onChange={(e) => handleListChange(idx, e.target.value, prereqs, setPrereqs)}
                                className="flex-1 bg-transparent text-xs font-semibold outline-none py-1 px-2"
                              />
                              <button
                                type="button"
                                onClick={() => handleRemoveInput(idx, prereqs, setPrereqs)}
                                className="text-xs font-bold text-red-500 hover:text-red-700 px-2"
                              >
                                ×
                              </button>
                            </div>
                          ))}
                          <button
                            type="button"
                            onClick={() => handleAddInput(prereqs, setPrereqs)}
                            className="w-full py-2.5 rounded-xl border border-dashed border-[#E2E4F0] text-xs font-black text-brand-primary hover:bg-[#E2E4F0]/20 flex items-center justify-center gap-1.5 transition-all"
                          >
                            <Plus className="w-4 h-4" /> Add Prerequisite
                          </button>
                        </div>

                        {/* Target Audience */}
                        <div className="flex flex-col gap-3 mt-4">
                          <div className="flex justify-between items-center">
                            <label className="font-extrabold text-xs text-brand-primaryDark">targetAudience</label>
                            <span className="text-[10px] text-brand-muted font-bold uppercase">{audience.filter(a => a.trim()).length} ITEMS</span>
                          </div>
                          {audience.map((item, idx) => (
                            <div key={idx} className="flex gap-2 items-center bg-white/40 border border-[#E2E4F0]/40 rounded-xl p-1.5 shadow-sm">
                              <span className="text-brand-muted font-bold px-2 cursor-grab">::</span>
                              <span className="w-1.5 h-1.5 rounded-full bg-[#FF6200] flex-shrink-0"></span>
                              <input
                                type="text"
                                value={item}
                                placeholder="e.g. Java developers wanting to learn Spring Boot"
                                onChange={(e) => handleListChange(idx, e.target.value, audience, setAudience)}
                                className="flex-1 bg-transparent text-xs font-semibold outline-none py-1 px-2"
                              />
                              <button
                                type="button"
                                onClick={() => handleRemoveInput(idx, audience, setAudience)}
                                className="text-xs font-bold text-red-500 hover:text-red-700 px-2"
                              >
                                ×
                              </button>
                            </div>
                          ))}
                          <button
                            type="button"
                            onClick={() => handleAddInput(audience, setAudience)}
                            className="w-full py-2.5 rounded-xl border border-dashed border-[#E2E4F0] text-xs font-black text-brand-primary hover:bg-[#E2E4F0]/20 flex items-center justify-center gap-1.5 transition-all"
                          >
                            <Plus className="w-4 h-4" /> Add Audience
                          </button>
                        </div>

                        {/* Highlights */}
                        <div className="flex flex-col gap-3 mt-4">
                          <div className="flex justify-between items-center">
                            <label className="font-extrabold text-xs text-brand-primaryDark">courseHighlights</label>
                            <span className="text-[10px] text-brand-muted font-bold uppercase">{highlights.filter(h => h.trim()).length} ITEMS</span>
                          </div>
                          {highlights.map((item, idx) => (
                            <div key={idx} className="flex gap-2 items-center bg-white/40 border border-[#E2E4F0]/40 rounded-xl p-1.5 shadow-sm">
                              <span className="text-brand-muted font-bold px-2 cursor-grab">::</span>
                              <span className="w-1.5 h-1.5 rounded-full bg-[#7928CA] flex-shrink-0"></span>
                              <input
                                type="text"
                                value={item}
                                placeholder="Key highlights shown on the course landing page..."
                                onChange={(e) => handleListChange(idx, e.target.value, highlights, setHighlights)}
                                className="flex-1 bg-transparent text-xs font-semibold outline-none py-1 px-2"
                              />
                              <button
                                type="button"
                                onClick={() => handleRemoveInput(idx, highlights, setHighlights)}
                                className="text-xs font-bold text-red-500 hover:text-red-700 px-2"
                              >
                                ×
                              </button>
                            </div>
                          ))}
                          <button
                            type="button"
                            onClick={() => handleAddInput(highlights, setHighlights)}
                            className="w-full py-2.5 rounded-xl border border-dashed border-[#E2E4F0] text-xs font-black text-brand-primary hover:bg-[#E2E4F0]/20 flex items-center justify-center gap-1.5 transition-all"
                          >
                            <Plus className="w-4 h-4" /> Add Highlight
                          </button>
                        </div>

                        {/* Career Opportunities */}
                        <div className="flex flex-col gap-3 mt-4">
                          <div className="flex justify-between items-center">
                            <label className="font-extrabold text-xs text-brand-primaryDark">careerOpportunities</label>
                            <span className="text-[10px] text-brand-muted font-bold uppercase">{careers.filter(c => c.trim()).length} ITEMS</span>
                          </div>
                          {careers.map((item, idx) => (
                            <div key={idx} className="flex gap-2 items-center bg-white/40 border border-[#E2E4F0]/40 rounded-xl p-1.5 shadow-sm">
                              <span className="text-brand-muted font-bold px-2 cursor-grab">::</span>
                              <span className="w-1.5 h-1.5 rounded-full bg-slate-800 flex-shrink-0"></span>
                              <input
                                type="text"
                                value={item}
                                placeholder="Jobs and career paths this course prepares for..."
                                onChange={(e) => handleListChange(idx, e.target.value, careers, setCareers)}
                                className="flex-1 bg-transparent text-xs font-semibold outline-none py-1 px-2"
                              />
                              <button
                                type="button"
                                onClick={() => handleRemoveInput(idx, careers, setCareers)}
                                className="text-xs font-bold text-red-500 hover:text-red-700 px-2"
                              >
                                ×
                              </button>
                            </div>
                          ))}
                          <button
                            type="button"
                            onClick={() => handleAddInput(careers, setCareers)}
                            className="w-full py-2.5 rounded-xl border border-dashed border-[#E2E4F0] text-xs font-black text-brand-primary hover:bg-[#E2E4F0]/20 flex items-center justify-center gap-1.5 transition-all"
                          >
                            <Plus className="w-4 h-4" /> Add Career Path
                          </button>
                        </div>
                      </div>

                      {/* Course Flags Card */}
                      <div className="glass-panel p-6 md:p-8 rounded-3xl border border-white/60 shadow-glass flex flex-col gap-5 border-t-4 border-t-slate-800 bg-white/70">
                        <h3 className="text-base font-black text-brand-primaryDark flex items-center gap-2 border-b border-[#E2E4F0]/60 pb-2">
                          <HelpCircle className="w-4.5 h-4.5 text-slate-800" /> Course Flags
                        </h3>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div className="flex items-center justify-between p-3.5 bg-white/50 rounded-2xl border border-[#E2E4F0]/40 shadow-sm text-left">
                            <div>
                              <span className="text-xs font-extrabold text-brand-primaryDark block">isActive</span>
                              <span className="text-[10px] text-brand-muted font-semibold">Make this course visible to search</span>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer select-none flex-shrink-0">
                              <input type="checkbox" checked={isActive} onChange={(e) => setIsActive(e.target.checked)} className="sr-only switch-input" />
                              <div className="w-9 h-5 bg-[#E2E4F0] border border-[#E2E4F0] rounded-full switch-bg transition-colors duration-200"></div>
                              <div className="absolute left-0.5 top-0.5 w-4 h-4 bg-white rounded-full switch-dot transition-transform duration-200 shadow-sm"></div>
                            </label>
                          </div>

                          <div className="flex items-center justify-between p-3.5 bg-white/50 rounded-2xl border border-[#E2E4F0]/40 shadow-sm text-left">
                            <div>
                              <span className="text-xs font-extrabold text-brand-primaryDark block">isPublished</span>
                              <span className="text-[10px] text-brand-muted font-semibold">Make this course live for learners</span>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer select-none flex-shrink-0">
                              <input type="checkbox" checked={isPublished} onChange={(e) => setIsPublished(e.target.checked)} className="sr-only switch-input" />
                              <div className="w-9 h-5 bg-[#E2E4F0] border border-[#E2E4F0] rounded-full switch-bg transition-colors duration-200"></div>
                              <div className="absolute left-0.5 top-0.5 w-4 h-4 bg-white rounded-full switch-dot transition-transform duration-200 shadow-sm"></div>
                            </label>
                          </div>

                          <div className="flex items-center justify-between p-3.5 bg-white/50 rounded-2xl border border-[#E2E4F0]/40 shadow-sm text-left">
                            <div>
                              <span className="text-xs font-extrabold text-brand-primaryDark block">isFeatured</span>
                              <span className="text-[10px] text-brand-muted font-semibold">Highlight course on homepage</span>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer select-none flex-shrink-0">
                              <input type="checkbox" checked={isFeatured} onChange={(e) => setIsFeatured(e.target.checked)} className="sr-only switch-input" />
                              <div className="w-9 h-5 bg-[#E2E4F0] border border-[#E2E4F0] rounded-full switch-bg transition-colors duration-200"></div>
                              <div className="absolute left-0.5 top-0.5 w-4 h-4 bg-white rounded-full switch-dot transition-transform duration-200 shadow-sm"></div>
                            </label>
                          </div>

                          <div className="flex items-center justify-between p-3.5 bg-white/50 rounded-2xl border border-[#E2E4F0]/40 shadow-sm text-left">
                            <div>
                              <span className="text-xs font-extrabold text-brand-primaryDark block">allowIndexing</span>
                              <span className="text-[10px] text-brand-muted font-semibold">Allow search engines to index this page</span>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer select-none flex-shrink-0">
                              <input type="checkbox" checked={allowIndexing} onChange={(e) => setAllowIndexing(e.target.checked)} className="sr-only switch-input" />
                              <div className="w-9 h-5 bg-[#E2E4F0] border border-[#E2E4F0] rounded-full switch-bg transition-colors duration-200"></div>
                              <div className="absolute left-0.5 top-0.5 w-4 h-4 bg-white rounded-full switch-dot transition-transform duration-200 shadow-sm"></div>
                            </label>
                          </div>

                          <div className="flex items-center justify-between p-3.5 bg-white/50 rounded-2xl border border-[#E2E4F0]/40 shadow-sm text-left">
                            <div>
                              <span className="text-xs font-extrabold text-brand-primaryDark block">showInSearch</span>
                              <span className="text-[10px] text-brand-muted font-semibold">Show course in platform search results</span>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer select-none flex-shrink-0">
                              <input type="checkbox" checked={showInSearch} onChange={(e) => setShowInSearch(e.target.checked)} className="sr-only switch-input" />
                              <div className="w-9 h-5 bg-[#E2E4F0] border border-[#E2E4F0] rounded-full switch-bg transition-colors duration-200"></div>
                              <div className="absolute left-0.5 top-0.5 w-4 h-4 bg-white rounded-full switch-dot transition-transform duration-200 shadow-sm"></div>
                            </label>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col gap-6">
                      {/* SEO Core Card */}
                      <div className="glass-panel p-6 md:p-8 rounded-3xl border border-white/60 shadow-glass flex flex-col gap-5 border-t-4 border-t-[#84117C] bg-white/70">
                        <h3 className="text-base font-black text-brand-primaryDark flex items-center gap-2 border-b border-[#E2E4F0]/60 pb-2">
                          <Search className="w-4.5 h-4.5 text-[#84117C]" /> SEO Core
                        </h3>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                          {/* Meta Title */}
                          <div className="flex flex-col gap-1.5 sm:col-span-2">
                            <div className="flex justify-between items-center">
                              <label className="font-extrabold text-xs text-brand-primaryDark">metaTitle <span className="text-[9px] text-brand-muted font-normal">(max 70 • optimal 60)</span></label>
                              <span className="text-[10px] text-[#01AC9F] font-bold">45/70</span>
                            </div>
                            <input
                              type="text"
                              placeholder="Spring Boot Masterclass | Xebia Learning"
                              value={metaTitle}
                              onChange={(e) => setMetaTitle(e.target.value)}
                              className="px-4 py-3 rounded-xl text-xs font-semibold glass-input outline-none"
                            />
                          </div>

                          {/* Meta Description */}
                          <div className="flex flex-col gap-1.5 sm:col-span-2">
                            <div className="flex justify-between items-center">
                              <label className="font-extrabold text-xs text-brand-primaryDark">metaDescription <span className="text-[9px] text-brand-muted font-normal">(max 320 • optimal 160)</span></label>
                              <span className="text-[10px] text-[#01AC9F] font-bold">145/320</span>
                            </div>
                            <textarea
                              rows={3}
                              placeholder="Master Spring Boot and build production-ready REST APIs. Covers DI, Spring Security, microservices and cloud deployment."
                              value={metaDescription}
                              onChange={(e) => setMetaDescription(e.target.value)}
                              className="px-4 py-3 rounded-xl text-xs font-semibold glass-input outline-none resize-none"
                            />
                            <span className="text-[10px] text-brand-muted font-semibold mt-0.5">Renders in Google search snippets.</span>
                          </div>

                          {/* Canonical URL */}
                          <div className="flex flex-col gap-1.5">
                            <label className="font-extrabold text-xs text-brand-primaryDark">canonicalUrl <span className="text-[9px] text-brand-muted font-normal">(max 1000)</span></label>
                            <input
                              type="text"
                              placeholder="https://xebia.com/courses/spring-boot-masterclass"
                              value={canonicalUrl}
                              onChange={(e) => setCanonicalUrl(e.target.value)}
                              className="px-4 py-3 rounded-xl text-xs font-semibold glass-input outline-none font-mono"
                            />
                            <span className="text-[10px] text-brand-muted font-semibold mt-0.5">Prevents duplicate content issues.</span>
                          </div>

                          {/* Robots */}
                          <div className="flex flex-col gap-1.5">
                            <label className="font-extrabold text-xs text-brand-primaryDark">robots <span className="text-[9px] text-brand-muted font-normal">(default: index, follow)</span></label>
                            <select
                              value={robots}
                              onChange={(e) => setRobots(e.target.value)}
                              className="px-4 py-3 rounded-xl text-xs font-bold bg-white/65 border border-[#E2E4F0] outline-none text-brand-primaryDark"
                            >
                              <option value="index, follow">index, follow</option>
                              <option value="noindex, follow">noindex, follow</option>
                              <option value="index, nofollow">index, nofollow</option>
                              <option value="noindex, nofollow">noindex, nofollow</option>
                            </select>
                          </div>

                          {/* Author */}
                          <div className="flex flex-col gap-1.5">
                            <label className="font-extrabold text-xs text-brand-primaryDark">author <span className="text-[9px] text-brand-muted font-normal">(max 255)</span></label>
                            <input
                              type="text"
                              placeholder="e.g. Ankit Sharma"
                              value={author}
                              onChange={(e) => setAuthor(e.target.value)}
                              className="px-4 py-3 rounded-xl text-xs font-semibold glass-input outline-none"
                            />
                          </div>

                          {/* SEO Category */}
                          <div className="flex flex-col gap-1.5">
                            <label className="font-extrabold text-xs text-brand-primaryDark">seocategory <span className="text-[9px] text-brand-muted font-normal">(max 255)</span></label>
                            <input
                              type="text"
                              placeholder="Backend Development"
                              value={seocategory}
                              onChange={(e) => setSeocategory(e.target.value)}
                              className="px-4 py-3 rounded-xl text-xs font-semibold glass-input outline-none"
                            />
                          </div>

                          {/* Meta Keywords */}
                          <div className="flex flex-col gap-1.5">
                            <label className="font-extrabold text-xs text-brand-primaryDark">metaKeywords <span className="text-[9px] text-brand-muted font-normal">(LONGTEXT • comma separated)</span></label>
                            <input
                              type="text"
                              placeholder="spring boot, java, rest api, microservices..."
                              value={metaKeywords}
                              onChange={(e) => setMetaKeywords(e.target.value)}
                              className="px-4 py-3 rounded-xl text-xs font-semibold glass-input outline-none"
                            />
                          </div>

                          {/* SEO Tags */}
                          <div className="flex flex-col gap-1.5">
                            <label className="font-extrabold text-xs text-brand-primaryDark">seotags <span className="text-[9px] text-brand-muted font-normal">(LONGTEXT)</span></label>
                            <input
                              type="text"
                              placeholder="backend, java, spring, api, cloud..."
                              value={seotags}
                              onChange={(e) => setSeotags(e.target.value)}
                              className="px-4 py-3 rounded-xl text-xs font-semibold glass-input outline-none"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Advanced SEO Card */}
                      <div className="glass-panel p-6 md:p-8 rounded-3xl border border-white/60 shadow-glass flex flex-col gap-5 border-t-4 border-t-slate-800 bg-white/70">
                        <h3 className="text-base font-black text-brand-primaryDark flex items-center gap-2 border-b border-[#E2E4F0]/60 pb-2">
                          <Cpu className="w-4.5 h-4.5 text-slate-800" /> advanced SEO
                        </h3>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                          {/* Primary Keyword */}
                          <div className="flex flex-col gap-1.5 sm:col-span-2">
                            <label className="font-extrabold text-xs text-brand-primaryDark">primaryKeyword <span className="text-[9px] text-brand-muted font-normal">(max 255 • subject)</span></label>
                            <input
                              type="text"
                              placeholder="spring boot course"
                              value={primaryKeyword}
                              onChange={(e) => setPrimaryKeyword(e.target.value)}
                              className="px-4 py-3 rounded-xl text-xs font-semibold glass-input outline-none"
                            />
                          </div>

                          {/* Secondary Keywords */}
                          <div className="flex flex-col gap-1.5">
                            <label className="font-extrabold text-xs text-brand-primaryDark">secondaryKeywords <span className="text-[9px] text-brand-muted font-normal">(LONGTEXT)</span></label>
                            <input
                              type="text"
                              placeholder="learn spring boot, spring boot tutorial..."
                              value={secondaryKeywords}
                              onChange={(e) => setSecondaryKeywords(e.target.value)}
                              className="px-4 py-3 rounded-xl text-xs font-semibold glass-input outline-none"
                            />
                          </div>

                          {/* Focus Keywords */}
                          <div className="flex flex-col gap-1.5">
                            <label className="font-extrabold text-xs text-brand-primaryDark">focusKeywords <span className="text-[9px] text-brand-muted font-normal">(LONGTEXT)</span></label>
                            <input
                              type="text"
                              placeholder="spring boot masterclass, java backend..."
                              value={focusKeywords}
                              onChange={(e) => setFocusKeywords(e.target.value)}
                              className="px-4 py-3 rounded-xl text-xs font-semibold glass-input outline-none"
                            />
                          </div>

                          {/* Semantic Keywords */}
                          <div className="flex flex-col gap-1.5 sm:col-span-2">
                            <label className="font-extrabold text-xs text-brand-primaryDark">semanticKeywords <span className="text-[9px] text-brand-muted font-normal">(LONGTEXT)</span></label>
                            <input
                              type="text"
                              placeholder="dependency injection, IoC container, spring mvc..."
                              value={semanticKeywords}
                              onChange={(e) => setSemanticKeywords(e.target.value)}
                              className="px-4 py-3 rounded-xl text-xs font-semibold glass-input outline-none"
                            />
                          </div>

                          {/* Search Synonyms */}
                          <div className="flex flex-col gap-1.5">
                            <label className="font-extrabold text-xs text-brand-primaryDark">searchSynonyms <span className="text-[9px] text-brand-muted font-normal">(LONGTEXT)</span></label>
                            <input
                              type="text"
                              placeholder="spring framework java web framework..."
                              value={searchSynonyms}
                              onChange={(e) => setSearchSynonyms(e.target.value)}
                              className="px-4 py-3 rounded-xl text-xs font-semibold glass-input outline-none"
                            />
                          </div>

                          {/* Search Intent */}
                          <div className="flex flex-col gap-1.5">
                            <label className="font-extrabold text-xs text-brand-primaryDark">searchIntent <span className="text-[9px] text-brand-muted font-normal">(LONGTEXT)</span></label>
                            <input
                              type="text"
                              placeholder="informational, transactional - how to build APIs with spring..."
                              value={searchIntent}
                              onChange={(e) => setSearchIntent(e.target.value)}
                              className="px-4 py-3 rounded-xl text-xs font-semibold glass-input outline-none"
                            />
                          </div>

                          {/* Related Topics */}
                          <div className="flex flex-col gap-1.5 sm:col-span-2">
                            <label className="font-extrabold text-xs text-brand-primaryDark">relatedTopics <span className="text-[9px] text-brand-muted font-normal">(LONGTEXT)</span></label>
                            <input
                              type="text"
                              placeholder="Java EE, REST API design, Docker, Kubernetes..."
                              value={relatedTopics}
                              onChange={(e) => setRelatedTopics(e.target.value)}
                              className="px-4 py-3 rounded-xl text-xs font-semibold glass-input outline-none"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Open Graph Card */}
                      <div className="glass-panel p-6 md:p-8 rounded-3xl border border-white/60 shadow-glass flex flex-col gap-5 border-t-4 border-t-[#FF6200] bg-white/70">
                        <h3 className="text-base font-black text-brand-primaryDark flex items-center gap-2 border-b border-[#E2E4F0]/60 pb-2">
                          <Share2 className="w-4.5 h-4.5 text-[#FF6200]" /> Open Graph <span className="text-[10px] text-brand-muted font-normal ml-1">Facebook, LinkedIn previews</span>
                        </h3>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                          {/* OG Title */}
                          <div className="flex flex-col gap-1.5">
                            <label className="font-extrabold text-xs text-brand-primaryDark">ogTitle <span className="text-[9px] text-brand-muted font-normal">(max 120)</span></label>
                            <input
                              type="text"
                              placeholder="Spring Boot Masterclass"
                              value={ogTitle}
                              onChange={(e) => setOgTitle(e.target.value)}
                              className="px-4 py-3 rounded-xl text-xs font-semibold glass-input outline-none"
                            />
                          </div>

                          {/* OG Type */}
                          <div className="flex flex-col gap-1.5">
                            <label className="font-extrabold text-xs text-brand-primaryDark">ogType <span className="text-[9px] text-brand-muted font-normal">(default: website)</span></label>
                            <select
                              value={ogType}
                              onChange={(e) => setOgType(e.target.value)}
                              className="px-4 py-3 rounded-xl text-xs font-bold bg-white/65 border border-[#E2E4F0] outline-none text-brand-primaryDark"
                            >
                              <option value="website">website</option>
                              <option value="article">article</option>
                              <option value="book">book</option>
                              <option value="profile">profile</option>
                            </select>
                          </div>

                          {/* OG Description */}
                          <div className="flex flex-col gap-1.5 sm:col-span-2">
                            <label className="font-extrabold text-xs text-brand-primaryDark">ogDescription <span className="text-[9px] text-brand-muted font-normal">(max 1000)</span></label>
                            <textarea
                              rows={3}
                              placeholder="OG description for social shares..."
                              value={ogDescription}
                              onChange={(e) => setOgDescription(e.target.value)}
                              className="px-4 py-3 rounded-xl text-xs font-semibold glass-input outline-none resize-none"
                            />
                          </div>

                          {/* OG Image */}
                          <div className="flex flex-col gap-1.5 sm:col-span-2">
                            <label className="font-extrabold text-xs text-brand-primaryDark">ogImage <span className="text-[9px] text-brand-muted font-normal">(max 1000 • 1200x630px specs recommended)</span></label>
                            <input
                              type="text"
                              placeholder="https://xebia.com/courses/spring-boot-cover.jpg"
                              value={ogImage}
                              onChange={(e) => setOgImage(e.target.value)}
                              className="px-4 py-3 rounded-xl text-xs font-semibold glass-input outline-none font-mono"
                            />
                          </div>

                          {/* OG URL */}
                          <div className="flex flex-col gap-1.5 sm:col-span-2">
                            <label className="font-extrabold text-xs text-brand-primaryDark">ogUrl <span className="text-[9px] text-brand-muted font-normal">(max 1000)</span></label>
                            <input
                              type="text"
                              placeholder="https://xebia.com/courses/spring-boot-masterclass"
                              value={ogUrl}
                              onChange={(e) => setOgUrl(e.target.value)}
                              className="px-4 py-3 rounded-xl text-xs font-semibold glass-input outline-none font-mono"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Twitter Card */}
                      <div className="glass-panel p-6 md:p-8 rounded-3xl border border-white/60 shadow-glass flex flex-col gap-5 border-t-4 border-t-slate-800 bg-white/70">
                        <h3 className="text-base font-black text-brand-primaryDark flex items-center gap-2 border-b border-[#E2E4F0]/60 pb-2">
                          <Twitter className="w-4.5 h-4.5 text-slate-800" /> Twitter / X
                        </h3>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                          {/* Twitter Title */}
                          <div className="flex flex-col gap-1.5">
                            <label className="font-extrabold text-xs text-brand-primaryDark">twitterTitle <span className="text-[9px] text-brand-muted font-normal">(max 120)</span></label>
                            <input
                              type="text"
                              placeholder="Spring Boot Masterclass"
                              value={twitterTitle}
                              onChange={(e) => setTwitterTitle(e.target.value)}
                              className="px-4 py-3 rounded-xl text-xs font-semibold glass-input outline-none"
                            />
                          </div>

                          {/* Twitter Card Type */}
                          <div className="flex flex-col gap-1.5">
                            <label className="font-extrabold text-xs text-brand-primaryDark">twitterCard <span className="text-[9px] text-brand-muted font-normal">(default: summary_large_image)</span></label>
                            <select
                              value={twitterCard}
                              onChange={(e) => setTwitterCard(e.target.value)}
                              className="px-4 py-3 rounded-xl text-xs font-bold bg-white/65 border border-[#E2E4F0] outline-none text-brand-primaryDark"
                            >
                              <option value="summary_large_image">summary_large_image</option>
                              <option value="summary">summary</option>
                              <option value="app">app</option>
                              <option value="player">player</option>
                            </select>
                          </div>

                          {/* Twitter Description */}
                          <div className="flex flex-col gap-1.5 sm:col-span-2">
                            <label className="font-extrabold text-xs text-brand-primaryDark">twitterDescription <span className="text-[9px] text-brand-muted font-normal">(max 1000)</span></label>
                            <textarea
                              rows={3}
                              placeholder="Twitter card description..."
                              value={twitterDescription}
                              onChange={(e) => setTwitterDescription(e.target.value)}
                              className="px-4 py-3 rounded-xl text-xs font-semibold glass-input outline-none resize-none"
                            />
                          </div>

                          {/* Twitter Image */}
                          <div className="flex flex-col gap-1.5 sm:col-span-2">
                            <label className="font-extrabold text-xs text-brand-primaryDark">twitterImage <span className="text-[9px] text-brand-muted font-normal">(max 1000)</span></label>
                            <input
                              type="text"
                              placeholder="Twitter card image URL..."
                              value={twitterImage}
                              onChange={(e) => setTwitterImage(e.target.value)}
                              className="px-4 py-3 rounded-xl text-xs font-semibold glass-input outline-none font-mono"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Structured Data Card */}
                      <div className="glass-panel p-6 md:p-8 rounded-3xl border border-white/60 shadow-glass flex flex-col gap-5 border-t-4 border-t-slate-800 bg-white/70">
                        <h3 className="text-base font-black text-brand-primaryDark flex items-center gap-2 border-b border-[#E2E4F0]/60 pb-2">
                          <Code className="w-4.5 h-4.5 text-slate-800" /> Structured Data <span className="text-[10px] text-brand-muted font-normal ml-1">JSON-LD schemas</span>
                        </h3>

                        <div className="flex flex-col gap-4">
                          <div className="flex flex-col gap-1.5">
                            <label className="font-extrabold text-xs text-brand-primaryDark">schemaMarkup <span className="text-[9px] text-brand-muted font-normal">(Course JSON-LD)</span></label>
                            <textarea
                              rows={3}
                              placeholder='{"@context": "https://schema.org", "@type": "Course", ...}'
                              value={schemaMarkup}
                              onChange={(e) => setSchemaMarkup(e.target.value)}
                              className="px-4 py-3 rounded-xl text-xs font-semibold glass-input outline-none resize-none font-mono"
                            />
                          </div>

                          <div className="flex flex-col gap-1.5">
                            <label className="font-extrabold text-xs text-brand-primaryDark">faqschema <span className="text-[9px] text-brand-muted font-normal">(FAQPage JSON-LD)</span></label>
                            <textarea
                              rows={3}
                              placeholder='{"@context": "https://schema.org", "@type": "FAQPage", ...}'
                              value={faqSchema}
                              onChange={(e) => setFaqSchema(e.target.value)}
                              className="px-4 py-3 rounded-xl text-xs font-semibold glass-input outline-none resize-none font-mono"
                            />
                          </div>

                          <div className="flex flex-col gap-1.5">
                            <label className="font-extrabold text-xs text-brand-primaryDark">breadcrumbschema <span className="text-[9px] text-brand-muted font-normal">(BreadcrumbList JSON-LD)</span></label>
                            <textarea
                              rows={3}
                              placeholder='{"@context": "https://schema.org", "@type": "BreadcrumbList", ...}'
                              value={breadcrumbSchema}
                              onChange={(e) => setBreadcrumbSchema(e.target.value)}
                              className="px-4 py-3 rounded-xl text-xs font-semibold glass-input outline-none resize-none font-mono"
                            />
                          </div>
                        </div>
                      </div>

                      {/* FAQ Content Card */}
                      <div className="glass-panel p-6 md:p-8 rounded-3xl border border-white/60 shadow-glass flex flex-col gap-5 border-t-4 border-t-[#01AC9F] bg-white/70">
                        <h3 className="text-base font-black text-brand-primaryDark flex items-center gap-2 border-b border-[#E2E4F0]/60 pb-2">
                          <HelpCircle className="w-4.5 h-4.5 text-[#01AC9F]" /> faqContent <span className="text-[10px] text-brand-muted font-normal ml-1">support Q&A</span>
                        </h3>

                        <div className="flex flex-col gap-1.5">
                          <textarea
                            rows={3}
                            placeholder="Q: Who is this course for? A: Java developers wanting to modernize their backend skills. Q: Do I need prior Spring experience?..."
                            value={faqContent}
                            onChange={(e) => setFaqContent(e.target.value)}
                            className="px-4 py-3 rounded-xl text-xs font-semibold glass-input outline-none resize-none"
                          />
                        </div>
                      </div>

                      {/* Custom Scripts Card */}
                      <div className="glass-panel p-6 md:p-8 rounded-3xl border border-white/60 shadow-glass flex flex-col gap-5 border-t-4 border-t-slate-800 bg-white/70">
                        <h3 className="text-base font-black text-brand-primaryDark flex items-center gap-2 border-b border-[#E2E4F0]/60 pb-2">
                          <Cpu className="w-4.5 h-4.5 text-slate-800" /> Custom Scripts <span className="text-[10px] text-brand-muted font-normal ml-1">Header/Body script injections</span>
                        </h3>

                        <div className="flex flex-col gap-4">
                          <div className="flex flex-col gap-1.5">
                            <label className="font-extrabold text-xs text-brand-primaryDark">customHeadScript <span className="text-[9px] text-brand-muted font-normal">(executed inside head)</span></label>
                            <textarea
                              rows={3}
                              placeholder="<!-- e.g. Google Tag Manager script -->"
                              value={customHeadScript}
                              onChange={(e) => setCustomHeadScript(e.target.value)}
                              className="px-4 py-3 rounded-xl text-xs font-semibold glass-input outline-none resize-none font-mono"
                            />
                          </div>

                          <div className="flex flex-col gap-1.5">
                            <label className="font-extrabold text-xs text-brand-primaryDark">customBodyScript <span className="text-[9px] text-brand-muted font-normal">(executed before &lt;/body&gt;)</span></label>
                            <textarea
                              rows={3}
                              placeholder="<!-- e.g. chat widget script -->"
                              value={customBodyScript}
                              onChange={(e) => setCustomBodyScript(e.target.value)}
                              className="px-4 py-3 rounded-xl text-xs font-semibold glass-input outline-none resize-none font-mono"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </form>
              </div>

              {/* Right Side Panel: Live Preview, Completion Checklist, and Tips */}
              <div className="flex flex-col gap-6 lg:sticky lg:top-8">
                {wizardTab === 'basic' ? (
                  <>
                    {/* Live Preview Card */}
                    <div className="flex flex-col gap-2">
                      <span className="text-[10px] font-black uppercase text-brand-muted tracking-wider block text-left">Card Preview</span>
                      <div className="glass-panel rounded-3xl overflow-hidden shadow-glass border border-white/60 relative flex flex-col justify-between pointer-events-none text-left bg-white/80">
                        {/* Image cover */}
                        <div className="relative aspect-[1.8] bg-black">
                          <img src={bannerImage || 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=400&q=80'} alt="Cover Preview" className="w-full h-full object-cover" />
                          <div className="absolute left-3 top-3">
                            <span className="px-2.5 py-1 rounded-md text-[9px] font-black uppercase bg-black/60 text-white tracking-wider border border-white/10">
                              {level}
                            </span>
                          </div>
                        </div>

                        {/* Details body */}
                        <div className="p-5 flex flex-col gap-2">
                          <h4 className="text-sm font-black text-[#0f3443] leading-tight line-clamp-1">
                            {title || 'Course Title Here'}
                          </h4>
                          
                          {/* category & level badge */}
                          <div className="flex gap-2">
                            <span className="px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-wider bg-purple-100 text-purple-700">
                              {categories.find(c => String(c.id) === String(category))?.name || 'Category'}
                            </span>
                            <span className="px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-wider bg-[#FF6200]/10 text-[#FF6200]">
                              {level}
                            </span>
                          </div>

                          <p className="text-brand-muted text-[11px] font-semibold leading-relaxed line-clamp-2 mt-1">
                            {shortDescription || 'Your short overview will render here. Keep it concise to display correctly.'}
                          </p>

                          <div className="flex justify-between items-center text-[10px] text-brand-muted font-bold pt-3 border-t border-[#E2E4F0]/60 mt-1">
                            <span className="flex items-center gap-1"><BookOpen className="w-3 h-3" /> {language}</span>
                            <span>{duration || 'Self-Paced'}</span>
                          </div>
                          
                          {/* active / featured pills */}
                          <div className="flex gap-1.5 mt-1">
                            <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-wider ${isActive ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500'}`}>
                              {isActive ? 'Active' : 'Inactive'}
                            </span>
                            <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-wider ${isFeatured ? 'bg-yellow-100 text-yellow-700' : 'bg-slate-100 text-slate-500'}`}>
                              {isFeatured ? 'Featured' : 'Standard'}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Completion Checklist */}
                    <div className="glass-panel p-5 rounded-3xl border border-white/60 shadow-glass text-left bg-white/80">
                      <span className="text-[10px] font-black uppercase text-brand-muted tracking-wider block mb-3">Completion</span>
                      <div className="flex flex-col gap-2 text-xs font-semibold text-brand-primaryDark">
                        {[
                          { name: 'title', done: !!title.trim() },
                          { name: 'slug', done: !!slug.trim() },
                          { name: 'category', done: !!category },
                          { name: 'level', done: !!level },
                          { name: 'shortDescription', done: !!shortDescription.trim() },
                          { name: 'thumbnail', done: !!bannerImage.trim() },
                          { name: 'learningOutcomes', done: outcomes.some(o => o.trim()) },
                        ].map((chk, idx) => (
                          <div key={idx} className="flex justify-between items-center py-0.5">
                            <span className="text-brand-muted">{chk.name}</span>
                            <div className={`w-4 h-4 rounded-full flex items-center justify-center border ${chk.done ? 'bg-brand-success border-brand-success text-white' : 'border-[#E2E4F0] text-transparent'}`}>
                              <Check className="w-2.5 h-2.5 stroke-[3]" />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Tips Card */}
                    <div className="glass-panel p-5 rounded-3xl border border-white/60 shadow-glass text-left bg-white/80">
                      <div className="flex items-center gap-1.5 text-[#FF6200] mb-2">
                        <Sparkles className="w-4 h-4 fill-current" />
                        <span className="text-xs font-black uppercase tracking-wider">Tips</span>
                      </div>
                      <ul className="text-[11px] text-brand-muted font-semibold list-disc pl-4 flex flex-col gap-1.5">
                        <li>Title should be under 60 chars for best SEO.</li>
                        <li>Add a banner image (16:9, size 1200px).</li>
                        <li>SEO fields are on the next screen.</li>
                      </ul>
                    </div>
                  </>
                ) : (
                  <>
                    {/* SEO SCORE */}
                    <div className="glass-panel p-5 rounded-3xl border border-white/60 text-left shadow-glass flex flex-col gap-6 bg-white/80">
                      <span className="text-[10px] font-black uppercase text-brand-muted tracking-wider block">SEO SCORE</span>
                      
                      {/* Circular Progress score */}
                      <div className="flex flex-col items-center gap-3">
                        <div className="relative w-28 h-28">
                          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                            <path className="text-slate-100" strokeWidth="2.5" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                            <path 
                              className="circle-progress"
                              strokeWidth="2.5"
                              strokeDasharray={`${Math.min(100, Math.max(10, [metaTitle, metaDescription, primaryKeyword, canonicalUrl, ogImage, schemaMarkup, faqSchema].filter(Boolean).length * 13 + 9))}, 100`}
                              strokeLinecap="round"
                              fill="none"
                              stroke="#01AC9F"
                              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" 
                            />
                          </svg>
                          <div className="absolute inset-0 flex flex-col items-center justify-center">
                            <span className="text-2xl font-black text-brand-primaryDark">
                              {Math.min(100, Math.max(10, [metaTitle, metaDescription, primaryKeyword, canonicalUrl, ogImage, schemaMarkup, faqSchema].filter(Boolean).length * 13 + 9))}
                            </span>
                            <span className="text-[9px] text-brand-muted uppercase font-black tracking-wider">Score</span>
                          </div>
                        </div>

                        <span className="text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-full border bg-brand-success/10 text-brand-success border-brand-success/15">
                          {([metaTitle, metaDescription, primaryKeyword, canonicalUrl, ogImage, schemaMarkup, faqSchema].filter(Boolean).length * 13 + 9) >= 70 ? 'Good' : 'Needs Work'}
                        </span>
                      </div>

                      {/* Checklist */}
                      <div className="flex flex-col gap-2 text-xs font-semibold text-brand-primaryDark border-t border-[#E2E4F0]/65 pt-4">
                        {[
                          { label: 'metaTitle', done: !!metaTitle.trim() },
                          { label: 'metaDescription', done: !!metaDescription.trim() },
                          { label: 'primaryKeyword', done: !!primaryKeyword.trim() },
                          { label: 'canonicalUrl', done: !!canonicalUrl.trim() },
                          { label: 'ogImage', done: !!ogImage.trim() },
                          { label: 'schemaMarkup', done: !!schemaMarkup.trim() },
                          { label: 'faqSchema', done: !!faqSchema.trim() },
                        ].map((chk, idx) => (
                          <div key={idx} className="flex justify-between items-center py-0.5">
                            <span className="text-brand-muted">{chk.label}</span>
                            <div className={`w-4 h-4 rounded-full flex items-center justify-center border ${chk.done ? 'bg-brand-success border-brand-success text-white' : 'border-[#E2E4F0] text-transparent'}`}>
                              <Check className="w-2.5 h-2.5 stroke-[3]" />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* SERP Preview */}
                    <div className="glass-panel p-5 rounded-3xl border border-white/60 text-left shadow-glass flex flex-col gap-3 bg-white/80">
                      <span className="text-[10px] font-black uppercase text-brand-muted tracking-wider block">SERP Preview</span>
                      
                      <div className="bg-white/50 border border-[#E2E4F0]/40 rounded-2xl p-4 shadow-sm text-left">
                        <span className="text-[10px] text-emerald-600 font-semibold block mb-0.5">
                          xebia.com › courses › {slug || 'spring-boot-masterclass'}
                        </span>
                        <h4 className="text-sm font-bold text-[#1a0dab] hover:underline cursor-pointer leading-tight mb-1">
                          {metaTitle || 'Spring Boot Masterclass | Xebia Learning'}
                        </h4>
                        <p className="text-[11px] text-[#4d5156] leading-relaxed">
                          {metaDescription || 'Master Spring Boot and build production-ready REST APIs. Covers Dependency Injection, Spring Security, microservices and cloud deployment.'}
                        </p>
                      </div>
                    </div>



                    {/* OG Preview */}
                    <div className="glass-panel p-5 rounded-3xl border border-white/60 text-left shadow-glass flex flex-col gap-3 bg-white/80">
                      <span className="text-[10px] font-black uppercase text-brand-muted tracking-wider block">OG Preview</span>
                      
                      <div className="border border-[#E2E4F0]/50 rounded-2xl overflow-hidden shadow-sm bg-white">
                        <div className="aspect-[1.91] bg-slate-100 flex items-center justify-center border-b border-[#E2E4F0]/40">
                          {ogImage ? (
                            <img src={ogImage} alt="OG Card" className="w-full h-full object-cover" />
                          ) : (
                            <div className="text-brand-muted text-[10px] font-bold flex flex-col items-center gap-1.5 p-4 text-center">
                              <span className="w-10 h-10 rounded-full bg-slate-200/60 flex items-center justify-center">Image</span>
                              No OG Image set yet
                            </div>
                          )}
                        </div>
                        <div className="p-3.5 text-left">
                          <span className="text-[9px] text-brand-muted uppercase font-black tracking-wider block mb-0.5">xebia.com</span>
                          <h5 className="text-[11px] font-bold text-brand-primaryDark leading-snug line-clamp-1">
                            {ogTitle || 'Spring Boot Masterclass'}
                          </h5>
                          <p className="text-[10px] text-brand-muted leading-snug line-clamp-2 mt-0.5">
                            {ogDescription || 'OG description will render here...'}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* SEO Tips */}
                    <div className="glass-panel p-5 rounded-3xl border border-white/60 shadow-glass text-left bg-white/80">
                      <div className="flex items-center gap-1.5 text-[#FF6200] mb-2">
                        <Sparkles className="w-4.5 h-4.5 fill-current" />
                        <span className="text-xs font-black uppercase tracking-wider">SEO Tips</span>
                      </div>
                      <ul className="text-[11px] text-brand-muted font-semibold list-disc pl-4 flex flex-col gap-1.5">
                        <li>Keep metaTitle under 60 chars.</li>
                        <li>metaDescription 110-160 chars is ideal.</li>
                        <li>Add Course JSON-LD for rich snippets.</li>
                        <li>OG image must be 1200x630px minimum.</li>
                      </ul>
                    </div>
                  </>
                
                )}
              </div>
            </div>

            {/* Bottom Pinned Action Bar */}
            <div className="flex justify-between items-center bg-white/75 border border-[#E2E4F0]/60 p-4 rounded-2xl shadow-glass mt-6 text-xs font-bold">
              {wizardTab === 'seo' ? (
                <button
                  type="button"
                  onClick={() => setWizardTab('basic')}
                  className="flex items-center gap-1.5 text-brand-muted hover:text-[#0f3443] transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" /> Back: Basic Details
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="flex items-center gap-1.5 text-brand-muted hover:text-[#0f3443] transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" /> Back to Courses
                </button>
              )}

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2.5 rounded-xl border border-[#E2E4F0] text-brand-muted hover:bg-white/40 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={(e) => handleSave(e, true)}
                  className="px-4 py-2.5 rounded-xl border border-brand-primary/20 bg-brand-primary/5 text-brand-primary hover:bg-brand-primary/10 transition-colors"
                >
                  Save as Draft
                </button>
                {wizardTab === 'basic' ? (
                  <button
                    type="button"
                    onClick={() => setWizardTab('seo')}
                    className="px-5 py-2.5 rounded-xl text-white bg-[#01AC9F] hover:bg-[#01AC9F]/90 shadow-md hover:shadow-lg transition-all flex items-center gap-1.5"
                  >
                    Next: SEO & Meta <ArrowRight className="w-4 h-4" />
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={(e) => handleSave(e)}
                    className="px-5 py-2.5 rounded-xl text-white bg-[#01AC9F] hover:bg-[#01AC9F]/90 shadow-md hover:shadow-lg transition-all"
                  >
                    Save & Publish
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
