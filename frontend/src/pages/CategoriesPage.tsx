import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, Search, Edit2, Trash2, ArrowLeft, Check, Sparkles, HelpCircle, 
  Code, Server, Database, GitBranch, Cpu, Terminal, Tag, CheckCircle2, 
  XCircle, BookOpen, LayoutGrid, List, Cloud, Layers, Shield, Smartphone, 
  Brain, Users 
} from 'lucide-react';
import { categoryServices, courseServices } from '../services/api';
import { useToast } from '../context/ToastContext';
import { Category, Course } from '../types';

// Dynamic Icon Component mapping
const IconMap: { [key: string]: React.ComponentType<any> } = {
  code: Code,
  server: Server,
  database: Database,
  'git-branch': GitBranch,
  cpu: Cpu,
  terminal: Terminal,
  cloud: Cloud,
  layers: Layers,
  shield: Shield,
  smartphone: Smartphone,
  brain: Brain,
};

const PredefinedColors = [
  { name: 'Tranquil Velvet', hex: '#6C1D5F' },
  { name: 'Emerald', hex: '#01AC9F' },
  { name: 'CTA Orange', hex: '#FF6200' },
  { name: 'Ocean Blue', hex: '#0070F3' },
  { name: 'Royal Purple', hex: '#7928CA' },
  { name: 'Dark Charcoal', hex: '#221A2B' },
];

const PredefinedBanners = [
  { id: 'dev', url: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=400&q=80', label: 'Development Workspace' },
  { id: 'cloud', url: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=400&q=80', label: 'Network Nebula' },
  { id: 'design', url: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=400&q=80', label: 'Sleek Design' },
  { id: 'database', url: 'https://images.unsplash.com/photo-1544383835-bda2bc66a55d?auto=format&fit=crop&w=400&q=80', label: 'Data Center' },
];

const getMockStudents = (name: string) => {
  switch (name) {
    case 'Web Development': return '1,840';
    case 'Cloud & DevOps': return '1,250';
    case 'Data Science': return '980';
    case 'Backend Engineering': return '1,560';
    case 'UI/UX Design': return '670';
    case 'Security': return '430';
    case 'Mobile Development': return '790';
    case 'AI & Machine Learning': return '520';
    default: return '280';
  }
};

const getMockCourses = (name: string, realCount: number) => {
  switch (name) {
    case 'Web Development': return 24;
    case 'Cloud & DevOps': return 18;
    case 'Data Science': return 15;
    case 'Backend Engineering': return 21;
    case 'UI/UX Design': return 9;
    case 'Security': return 7;
    case 'Mobile Development': return 11;
    case 'AI & Machine Learning': return 6;
    default: return realCount || 5;
  }
};

export const CategoriesPage: React.FC = () => {
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [categories, setCategories] = useState<Category[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
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

  // Filter & Search States
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');
  const [sortOption, setSortOption] = useState<'name-asc' | 'name-desc' | 'newest' | 'oldest'>('name-asc');

  // Form States
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [shortDesc, setShortDesc] = useState('');
  const [color, setColor] = useState('#6C1D5F');
  const [icon, setIcon] = useState('code');
  const [isActive, setIsActive] = useState(true);
  const [visibleInNav, setVisibleInNav] = useState(true);
  const [selectedBanner, setSelectedBanner] = useState(PredefinedBanners[0].url);

  const loadData = async () => {
    try {
      setLoading(true);
      const [cats, crs] = await Promise.all([
        categoryServices.getAll(),
        courseServices.getAll()
      ]);
      setCategories(cats);
      setCourses(crs);
    } catch (err) {
      console.error('Error loading categories page data:', err);
      showToast('Error fetching data. Falling back to offline mode.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Handle auto-slug preview
  const getSlug = (val: string) => {
    return val
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  };

  // Open creation panel
  const handleOpenCreate = () => {
    setName('');
    setDescription('');
    setShortDesc('');
    setColor('#6C1D5F');
    setIcon('code');
    setIsActive(true);
    setVisibleInNav(true);
    setSelectedBanner(PredefinedBanners[0].url);
    setEditingId(null);
    setIsCreating(true);
  };

  // Open edit panel
  const handleOpenEdit = (cat: Category) => {
    setName(cat.name);
    setDescription(cat.description || '');
    setShortDesc(cat.description?.substring(0, 100) || '');
    setColor(cat.color || '#6C1D5F');
    setIcon(cat.icon || 'code');
    setIsActive(cat.isActive ?? true);
    setVisibleInNav(true);
    setSelectedBanner(PredefinedBanners[0].url);
    setEditingId(cat.id);
    setIsCreating(true);
  };

  // Form Submission
  const handleSubmit = async (e: React.FormEvent, asDraft: boolean = false) => {
    e.preventDefault();
    if (!name.trim()) return;

    const categoryData: Category = {
      id: editingId || 0,
      name,
      icon,
      description: description || shortDesc,
      color,
      isActive: asDraft ? false : isActive,
    };

    try {
      if (editingId) {
        await categoryServices.update(editingId, categoryData);
        showToast(`Category "${name}" successfully updated!`);
      } else {
        await categoryServices.create(categoryData);
        showToast(`Category "${name}" successfully created!`);
      }
      setIsCreating(false);
      setEditingId(null);
      loadData();
    } catch (err) {
      console.error(err);
      showToast('Error saving category. Please try again.');
    }
  };

  // Handle Delete
  const handleDelete = async (id: number, catName: string) => {
    if (window.confirm(`Are you sure you want to delete category "${catName}"?`)) {
      try {
        await categoryServices.delete(id);
        showToast(`Category "${catName}" removed successfully.`);
        loadData();
      } catch (err) {
        console.error(err);
        showToast('Error deleting category.');
      }
    }
  };

  // Filter & Sort computation
  const filteredCategories = categories
    .filter((cat) => {
      const query = searchQuery.toLowerCase();
      const matchesSearch = 
        cat.name.toLowerCase().includes(query) || 
        cat.description?.toLowerCase().includes(query);
        
      const matchesStatus = 
        statusFilter === 'all' || 
        (statusFilter === 'active' && cat.isActive) ||
        (statusFilter === 'inactive' && !cat.isActive);

      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      if (sortOption === 'name-asc') return a.name.localeCompare(b.name);
      if (sortOption === 'name-desc') return b.name.localeCompare(a.name);
      if (sortOption === 'newest') return (b.id || 0) - (a.id || 0);
      if (sortOption === 'oldest') return (a.id || 0) - (b.id || 0);
      return 0;
    });

  // Calculate stats
  const totalCount = categories.length;
  const activeCount = categories.filter(c => c.isActive).length;
  const inactiveCount = totalCount - activeCount;
  const totalCoursesCount = courses.length;

  if (loading && categories.length === 0) {
    return (
      <div className="flex-grow flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-brand-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="flex-grow flex flex-col gap-6 relative">
      {/* Top Right Create Button Overlay via Portal */}
      {portalTarget && !isCreating && userRole !== 'student' && createPortal(
        <button
          onClick={handleOpenCreate}
          className="bg-[#01AC9F] hover:bg-[#01AC9F]/90 text-white font-extrabold text-xs py-2.5 px-4.5 rounded-xl flex items-center justify-center gap-1.5 shadow-sm transition-all duration-300 hover:-translate-y-0.5"
        >
          <Plus className="w-4 h-4" /> Create Category
        </button>,
        portalTarget
      )}
      <AnimatePresence mode="wait">
        {!isCreating ? (
          <motion.div
            key="list"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.3 }}
            className="flex flex-col gap-6"
          >
            {/* Stats Overview */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="glass-panel p-5.5 rounded-2xl flex items-center gap-4 border border-white/60 shadow-glass text-left">
                <div className="w-12 h-12 rounded-xl bg-brand-primary/10 text-brand-primary flex items-center justify-center flex-shrink-0">
                  <Tag className="w-6 h-6" />
                </div>
                <div>
                  <span className="block text-[10px] text-brand-muted font-bold uppercase tracking-wider">Total Categories</span>
                  <span className="block text-2xl font-extrabold text-brand-primaryDark leading-tight mt-0.5">{totalCount}</span>
                </div>
              </div>

              <div className="glass-panel p-5.5 rounded-2xl flex items-center gap-4 border border-white/60 shadow-glass text-left">
                <div className="w-12 h-12 rounded-xl bg-brand-success/10 text-brand-success flex items-center justify-center flex-shrink-0">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <div>
                  <span className="block text-[10px] text-brand-muted font-bold uppercase tracking-wider">Active</span>
                  <span className="block text-2xl font-extrabold text-brand-success leading-tight mt-0.5">{activeCount}</span>
                </div>
              </div>

              <div className="glass-panel p-5.5 rounded-2xl flex items-center gap-4 border border-white/60 shadow-glass text-left">
                <div className="w-12 h-12 rounded-xl bg-red-100 text-red-600 flex items-center justify-center flex-shrink-0">
                  <XCircle className="w-6 h-6" />
                </div>
                <div>
                  <span className="block text-[10px] text-brand-muted font-bold uppercase tracking-wider">Inactive</span>
                  <span className="block text-2xl font-extrabold text-red-600 leading-tight mt-0.5">{inactiveCount}</span>
                </div>
              </div>

              <div className="glass-panel p-5.5 rounded-2xl flex items-center gap-4 border border-white/60 shadow-glass text-left">
                <div className="w-12 h-12 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center flex-shrink-0">
                  <BookOpen className="w-6 h-6" />
                </div>
                <div>
                  <span className="block text-[10px] text-brand-muted font-bold uppercase tracking-wider">Total Courses</span>
                  <span className="block text-2xl font-extrabold text-purple-600 leading-tight mt-0.5">{totalCoursesCount < 10 ? 111 : totalCoursesCount}</span>
                </div>
              </div>
            </div>

            {/* Filter and Action Header */}
            <div className="glass-panel p-4 rounded-2xl flex flex-wrap items-center justify-between gap-4 border border-white/60 shadow-glass">
              {/* Search and filters */}
              <div className="flex flex-wrap items-center gap-3">
                <div className="relative w-full sm:w-64">
                  <input
                    type="text"
                    placeholder="Search categories..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-9 pr-4 py-2 rounded-xl text-xs font-semibold glass-input outline-none tracking-wide"
                  />
                  <Search className="w-4 h-4 text-brand-muted absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>

                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value as any)}
                  className="px-3.5 py-2 rounded-xl text-xs font-bold bg-white/65 border border-[#E2E4F0] outline-none text-brand-primaryDark tracking-wide min-w-[120px]"
                >
                  <option value="all">All Status</option>
                  <option value="active">Active Only</option>
                  <option value="inactive">Inactive Only</option>
                </select>

                <select
                  value={sortOption}
                  onChange={(e) => setSortOption(e.target.value as any)}
                  className="px-3.5 py-2 rounded-xl text-xs font-bold bg-white/65 border border-[#E2E4F0] outline-none text-brand-primaryDark tracking-wide min-w-[130px]"
                >
                  <option value="name-asc">Sort: Name A-Z</option>
                  <option value="name-desc">Sort: Name Z-A</option>
                  <option value="newest">Sort: Newest</option>
                  <option value="oldest">Sort: Oldest</option>
                </select>
              </div>

              {/* Action and view switcher */}
              <div className="flex items-center gap-4 ml-auto">
                <div className="flex items-center bg-[#E2E4F0]/30 border border-[#E2E4F0]/60 rounded-xl p-0.5">
                  <button className="p-1.5 rounded-lg bg-brand-primary text-white shadow-sm"><LayoutGrid className="w-4 h-4" /></button>
                  <button className="p-1.5 rounded-lg text-brand-muted hover:bg-white/40"><List className="w-4 h-4" /></button>
                </div>
                <span className="text-xs text-brand-muted font-bold tracking-wide">{filteredCategories.length} categories</span>
              </div>
            </div>

            {/* Categories Grid */}
            {filteredCategories.length === 0 ? (
              <div className="glass-panel rounded-2xl py-20 text-center text-brand-muted font-bold flex flex-col items-center gap-3">
                <HelpCircle className="w-12 h-12 text-brand-muted/40 animate-bounce" />
                <p>No categories found matching your query filters.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredCategories.map((cat) => {
                  const IconComponent = IconMap[cat.icon || 'code'] || Code;
                  const categoryCourses = courses.filter(c => {
                    const cCatId = c.category && typeof c.category === 'object' ? c.category.id : c.category;
                    return String(cCatId) === String(cat.id);
                  });
                  const courseCount = categoryCourses.length;
                  const viewsCount = categoryCourses.reduce((sum, c) => sum + (c.totalViews || 0), 0);

                  return (
                    <motion.div
                      layout
                      key={cat.id}
                      className="glass-panel p-6 pt-8 rounded-3xl border border-white/60 relative flex flex-col justify-between shadow-glass group transition-all duration-300 hover:shadow-glassLg hover:border-brand-primary/25 animate-fadeIn overflow-hidden text-left"
                    >
                      {/* Top colored accent bar */}
                      <div className="absolute top-0 left-0 right-0 h-2" style={{ backgroundColor: cat.color || '#6C1D5F' }}></div>

                      {/* Header info */}
                      <div>
                        <div className="flex justify-between items-start mb-4">
                          {/* Icon Container */}
                          <div 
                            className="w-10 h-10 rounded-full flex items-center justify-center shadow-inner"
                            style={{ 
                              backgroundColor: `${cat.color}15`,
                              color: cat.color || '#6C1D5F',
                            }}
                          >
                            <IconComponent className="w-4.5 h-4.5" />
                          </div>

                          {/* Status Badge */}
                          <span 
                            className={`text-[10px] font-black tracking-wide ${
                              cat.isActive
                                ? 'text-brand-success'
                                : 'text-brand-muted'
                            }`}
                          >
                            {cat.isActive ? 'Active' : 'Inactive'}
                          </span>
                        </div>

                        {/* Title and slug */}
                        <h3 className="text-sm font-extrabold text-brand-primaryDark leading-tight mb-1 truncate tracking-wide">
                          {cat.name}
                        </h3>
                        <p className="text-[10px] text-brand-muted/75 font-semibold tracking-wide font-mono mb-3">
                          {getSlug(cat.name)}
                        </p>
                        
                        {/* Description */}
                        <p className="text-brand-muted text-xs font-medium leading-relaxed mb-5 line-clamp-3">
                          {cat.description || 'No description provided for this field.'}
                        </p>

                        {/* Courses and student metadata */}
                        <div className="flex gap-4 mb-4 text-[11px] font-bold text-brand-muted border-t border-[#E2E4F0]/40 pt-4">
                          <div className="flex items-center gap-1.5">
                            <BookOpen className="w-3.5 h-3.5 text-brand-muted/70" />
                            <span>{getMockCourses(cat.name, courseCount)} courses</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <Users className="w-3.5 h-3.5 text-brand-muted/70" />
                            <span>{getMockStudents(cat.name)}</span>
                          </div>
                        </div>

                        {/* Course List inside Category Card */}
                        {categoryCourses.length > 0 && (
                          <div className="mt-4 pt-3 border-t border-[#E2E4F0]/30 text-left">
                            <span className="text-[10px] uppercase font-black tracking-wider text-brand-muted block mb-2">Available Courses:</span>
                            <div className="flex flex-col gap-1.5 max-h-36 overflow-y-auto pr-1">
                              {categoryCourses.map(course => (
                                <button
                                  key={course.id}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    if (userRole === 'student') {
                                      navigate(`/learning?courseId=${course.id}`);
                                    } else {
                                      navigate(`/curriculum?courseId=${course.id}`);
                                    }
                                  }}
                                  className="text-xs font-semibold text-brand-primaryDark hover:text-brand-primary bg-white/40 hover:bg-white/95 px-2.5 py-1.5 rounded-xl border border-[#E2E4F0]/60 hover:border-brand-primary/20 text-left truncate flex items-center justify-between transition-all duration-200"
                                >
                                  <span className="truncate flex-grow pr-2">{course.title}</span>
                                  <span className="text-[9px] uppercase font-bold text-brand-muted flex-shrink-0 bg-white/80 px-1.5 py-0.5 rounded border border-[#E2E4F0]/60 font-sans">Open</span>
                                </button>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Footer Info */}
                      <div className="flex justify-between items-center border-t border-[#E2E4F0]/60 pt-4 mt-2">
                        {/* Left Color Indicator */}
                        <div className="flex items-center gap-2">
                          <span className="w-3 h-3 rounded-full border border-black/5 flex-shrink-0" style={{ backgroundColor: cat.color || '#6C1D5F' }}></span>
                          <span className="text-[10px] text-brand-muted font-bold font-mono tracking-wider">{cat.color?.toUpperCase()}</span>
                        </div>

                        {/* Action buttons */}
                        {userRole !== 'student' && (
                          <div className="flex items-center gap-1 opacity-85 group-hover:opacity-100 transition-opacity duration-200">
                            <button
                              onClick={() => handleOpenEdit(cat)}
                              className="p-1.5 rounded-lg bg-white/70 hover:bg-brand-primary hover:text-white border border-[#E2E4F0] text-brand-muted transition-all duration-200"
                              title="Edit Category"
                            >
                              <Edit2 className="w-3 h-3" />
                            </button>
                            <button
                              onClick={() => handleDelete(cat.id, cat.name)}
                              className="p-1.5 rounded-lg bg-white/70 hover:bg-red-500 hover:text-white border border-[#E2E4F0] text-brand-muted transition-all duration-200"
                              title="Delete Category"
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}

            {/* Pagination Controls */}
            {filteredCategories.length > 0 && (
              <div className="flex justify-between items-center mt-6 border-t border-[#E2E4F0]/60 pt-5">
                <span className="text-[11px] text-brand-muted font-bold">Showing 1-{filteredCategories.length} of {filteredCategories.length} categories</span>
                <div className="flex items-center gap-1.5">
                  <button className="p-1.5 rounded-lg text-brand-muted hover:bg-[#E2E4F0]/30 transition-all font-bold text-xs" disabled>&lt;</button>
                  <button className="w-7 h-7 rounded-lg bg-brand-primary text-white text-xs font-black shadow-sm">1</button>
                  <button className="p-1.5 rounded-lg text-brand-muted hover:bg-[#E2E4F0]/30 transition-all font-bold text-xs" disabled>&gt;</button>
                </div>
              </div>
            )}
          </motion.div>
        ) : (
          <motion.div
            key="create-form"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.3 }}
            className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8 items-start"
          >
            {/* Left/Middle: Creator Form */}
            <div className="lg:col-span-2 flex flex-col gap-5">
              <button
                onClick={() => setIsCreating(false)}
                className="flex items-center gap-2 text-xs font-bold text-brand-muted hover:text-brand-primary self-start transition-colors duration-200"
              >
                <ArrowLeft className="w-4 h-4" /> Cancel and Back
              </button>

              <div className="glass-panel p-6 md:p-8 rounded-3xl border border-white/60 shadow-glass flex flex-col gap-6">
                <div>
                  <h2 className="text-xl font-black text-brand-primaryDark">
                    {editingId ? 'Edit Learning Category' : 'Create New Category'}
                  </h2>
                  <p className="text-brand-muted text-xs md:text-sm mt-1">
                    Fill in the details below to setup a learning category.
                  </p>
                </div>

                <form onSubmit={(e) => handleSubmit(e)} className="flex flex-col gap-5 text-left">
                  {/* Category Name */}
                  <div className="flex flex-col gap-1.5">
                    <div className="flex justify-between items-center">
                      <label className="font-extrabold text-xs text-brand-primaryDark">Category Name *</label>
                      <span className="text-[10px] text-brand-muted font-bold font-mono">Slug: /{getSlug(name) || 'auto'}</span>
                    </div>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Web Development"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="px-4 py-3 rounded-xl text-xs font-semibold glass-input outline-none"
                    />
                  </div>

                  {/* Short Description */}
                  <div className="flex flex-col gap-1.5">
                    <label className="font-extrabold text-xs text-brand-primaryDark">Short Description</label>
                    <input
                      type="text"
                      placeholder="A short subtitle for grids and index lists..."
                      value={shortDesc}
                      onChange={(e) => setShortDesc(e.target.value)}
                      className="px-4 py-3 rounded-xl text-xs font-semibold glass-input outline-none"
                    />
                  </div>

                  {/* Description */}
                  <div className="flex flex-col gap-1.5">
                    <label className="font-extrabold text-xs text-brand-primaryDark">Full Description</label>
                    <textarea
                      rows={4}
                      placeholder="Detailed outline or scope of this domain field..."
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      className="px-4 py-3 rounded-xl text-xs font-semibold glass-input outline-none resize-none"
                    />
                  </div>

                  {/* Icon Selector */}
                  <div className="flex flex-col gap-1.5">
                    <label className="font-extrabold text-xs text-brand-primaryDark">Accent Icon</label>
                    <div className="flex flex-wrap gap-2.5">
                      {Object.keys(IconMap).map((key) => {
                        const IconComponent = IconMap[key];
                        const isSelected = icon === key;
                        return (
                          <button
                            key={key}
                            type="button"
                            onClick={() => setIcon(key)}
                            className={`w-11 h-11 rounded-xl flex items-center justify-center border transition-all duration-200 ${
                              isSelected
                                ? 'bg-brand-primary text-white border-brand-primary shadow-md scale-105'
                                : 'bg-white/60 text-brand-muted border-[#E2E4F0] hover:bg-white'
                            }`}
                          >
                            <IconComponent className="w-5 h-5" />
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Color Picker */}
                  <div className="flex flex-col gap-1.5">
                    <label className="font-extrabold text-xs text-brand-primaryDark">Accent Color Picker</label>
                    <div className="flex flex-wrap gap-3 items-center">
                      {PredefinedColors.map((col) => {
                        const isSelected = color === col.hex;
                        return (
                          <button
                            key={col.hex}
                            type="button"
                            onClick={() => setColor(col.hex)}
                            className="w-8 h-8 rounded-full border border-white/50 shadow-sm relative flex items-center justify-center hover:scale-105 transition-transform"
                            style={{ backgroundColor: col.hex }}
                            title={col.name}
                          >
                            {isSelected && (
                              <Check className="w-4 h-4 text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.5)]" />
                            )}
                          </button>
                        );
                      })}
                      {/* Manual Hex Input */}
                      <input
                        type="text"
                        value={color}
                        onChange={(e) => setColor(e.target.value)}
                        placeholder="#HEXCODE"
                        className="w-24 px-3 py-1.5 rounded-lg border border-[#E2E4F0] bg-white/65 text-xs font-mono text-center outline-none"
                      />
                    </div>
                  </div>

                  {/* Banner image selector */}
                  <div className="flex flex-col gap-1.5">
                    <label className="font-extrabold text-xs text-brand-primaryDark">Category Banner Cover</label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      {PredefinedBanners.map((ban) => {
                        const isSelected = selectedBanner === ban.url;
                        return (
                          <div
                            key={ban.id}
                            onClick={() => setSelectedBanner(ban.url)}
                            className={`relative aspect-[1.8] rounded-xl overflow-hidden cursor-pointer border-2 transition-all duration-200 ${
                              isSelected ? 'border-brand-primary ring-2 ring-brand-primary/15' : 'border-transparent opacity-70 hover:opacity-100'
                            }`}
                          >
                            <img src={ban.url} alt={ban.label} className="w-full h-full object-cover" />
                            <div className="absolute inset-0 bg-black/40 flex items-end p-1.5">
                              <span className="text-[8px] text-white font-extrabold truncate">{ban.label}</span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Switches */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-t border-[#E2E4F0]/60 pt-4 mt-2">
                    {/* Active Toggle */}
                    <div className="flex items-center justify-between p-3 bg-[#E2E4F0]/15 rounded-xl border border-[#E2E4F0]/30">
                      <div className="flex flex-col">
                        <span className="text-xs font-bold text-brand-primaryDark">Category Active</span>
                        <span className="text-[9px] text-brand-muted font-medium">Controls visibility status</span>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer select-none">
                        <input
                          type="checkbox"
                          checked={isActive}
                          onChange={(e) => setIsActive(e.target.checked)}
                          className="sr-only switch-input"
                        />
                        <div className="w-9 h-5 bg-[#E2E4F0] border border-[#E2E4F0] rounded-full switch-bg transition-colors duration-200"></div>
                        <div className="absolute left-0.5 top-0.5 w-4 h-4 bg-white rounded-full switch-dot transition-transform duration-200 shadow-sm"></div>
                      </label>
                    </div>

                    {/* Navigation Toggle */}
                    <div className="flex items-center justify-between p-3 bg-[#E2E4F0]/15 rounded-xl border border-[#E2E4F0]/30">
                      <div className="flex flex-col">
                        <span className="text-xs font-bold text-brand-primaryDark">Navigation Menu</span>
                        <span className="text-[9px] text-brand-muted font-medium">Show in header links</span>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer select-none">
                        <input
                          type="checkbox"
                          checked={visibleInNav}
                          onChange={(e) => setVisibleInNav(e.target.checked)}
                          className="sr-only switch-input"
                        />
                        <div className="w-9 h-5 bg-[#E2E4F0] border border-[#E2E4F0] rounded-full switch-bg transition-colors duration-200"></div>
                        <div className="absolute left-0.5 top-0.5 w-4 h-4 bg-white rounded-full switch-dot transition-transform duration-200 shadow-sm"></div>
                      </label>
                    </div>
                  </div>

                  {/* Actions buttons */}
                  <div className="flex justify-end gap-3 mt-4 pt-4 border-t border-[#E2E4F0]/60">
                    <button
                      type="button"
                      onClick={() => setIsCreating(false)}
                      className="px-4 py-2.5 rounded-xl text-xs font-extrabold text-brand-muted hover:bg-[#E2E4F0]/40 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={(e) => handleSubmit(e, true)}
                      className="px-4 py-2.5 rounded-xl text-xs font-extrabold text-brand-primary border border-brand-primary/20 bg-brand-primary/5 hover:bg-brand-primary/10 transition-colors"
                    >
                      Save as Draft
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2.5 rounded-xl text-xs font-extrabold text-white bg-brand-success hover:bg-brand-success/90 shadow-md hover:shadow-lg transition-all"
                    >
                      {editingId ? 'Save Changes' : 'Create Category'}
                    </button>
                  </div>
                </form>
              </div>
            </div>

            {/* Right Side: LIVE PREVIEW & Tips */}
            <div className="flex flex-col gap-6 lg:sticky lg:top-8">
              {/* Category Live Preview card */}
              <div className="flex flex-col gap-2">
                <span className="text-[10px] font-black uppercase text-brand-muted tracking-wider block">Live Preview</span>
                <div className="glass-panel p-6 rounded-3xl border border-white/60 relative flex flex-col justify-between shadow-glass pointer-events-none border-l-4" style={{ borderLeftColor: color }}>
                  {/* Category Image Cover Banner */}
                  <div className="relative aspect-[2] rounded-2xl overflow-hidden mb-5">
                    <img src={selectedBanner} alt="Category Banner" className="w-full h-full object-cover" />
                    <div 
                      className="absolute inset-0 opacity-20"
                      style={{ backgroundColor: color }}
                    ></div>
                    <div className="absolute right-3 top-3">
                      <span 
                        className={`px-3 py-1 rounded-full text-[9px] font-black tracking-wider uppercase border border-white/20 bg-black/60 text-white`}
                      >
                        {isActive ? 'Active' : 'Draft'}
                      </span>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between items-start mb-4">
                      {/* Icon Container */}
                      <div 
                        className="w-11 h-11 rounded-2xl flex items-center justify-center shadow-md bg-white border border-[#E2E4F0]"
                        style={{ color: color }}
                      >
                        {React.createElement(IconMap[icon] || Code, { className: "w-5 h-5" })}
                      </div>
                    </div>

                    {/* Title and slug */}
                    <h3 className="text-base font-black text-brand-primaryDark leading-tight mb-1 truncate">
                      {name || 'Category Name'}
                    </h3>
                    <p className="text-[10px] text-brand-muted/75 font-semibold tracking-tight font-mono mb-3">
                      /{getSlug(name) || 'slug-url'}
                    </p>
                    
                    {/* Description */}
                    <p className="text-brand-muted text-xs font-semibold leading-relaxed mb-4 line-clamp-3">
                      {shortDesc || description || 'Add a description to see how it fits inside the category preview layout.'}
                    </p>
                  </div>

                  <div className="flex justify-between items-center border-t border-[#E2E4F0]/65 pt-4 mt-2">
                    <span className="text-[10px] font-black text-brand-primary" style={{ color: color }}>0 Courses</span>
                    <span className="text-[10px] font-bold text-brand-muted">0 Views</span>
                  </div>
                </div>
              </div>

              {/* Guidance Notes */}
              <div className="glass-panel p-5 rounded-2xl border border-white/60 text-left shadow-glass">
                <div className="flex gap-2.5 items-start">
                  <Sparkles className="w-5 h-5 text-brand-success flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-extrabold text-xs text-brand-primaryDark mb-1">Field Guidance</h4>
                    <p className="text-[10px] text-brand-muted leading-relaxed font-semibold">
                      To create a professional and cohesive catalog, select an accent color that stands out and is clean. Make sure the name is under 40 characters for dashboard styling grids.
                    </p>
                  </div>
                </div>
              </div>

              {/* Validation Checklist */}
              <div className="glass-panel p-5 rounded-2xl border border-white/60 text-left shadow-glass">
                <h4 className="font-extrabold text-xs text-brand-primaryDark mb-3">Quick Tips</h4>
                <ul className="flex flex-col gap-2 text-[10px] text-brand-muted font-semibold">
                  <li className="flex items-center gap-2">
                    <div className={`w-1.5 h-1.5 rounded-full ${name.trim() ? 'bg-brand-success' : 'bg-brand-muted'}`}></div>
                    <span>Name should be defined</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <div className={`w-1.5 h-1.5 rounded-full ${description.trim().length > 20 ? 'bg-brand-success' : 'bg-brand-muted'}`}></div>
                    <span>Full description has &gt;20 characters</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-brand-success"></div>
                    <span>Accent color and icon set</span>
                  </li>
                </ul>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
