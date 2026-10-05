import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, Search, Plus, Edit2, Trash2, ChevronRight, Folder, 
  Layers, Save, Code2, MoveUp, MoveDown, Globe, Clock, X, Check, 
  Sparkles, HelpCircle, ChevronDown, ChevronUp, Star, Code, Server, 
  Database, GitBranch, Cpu, Terminal, Cloud, Shield, Smartphone, Brain 
} from 'lucide-react';
import { courseServices, categoryServices } from '../services/api';
import { useToast } from '../context/ToastContext';
import { Course, Category, Module, Submodule, Content } from '../types';

const CategoryIconMap: { [key: string]: React.ComponentType<any> } = {
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

const renderCategoryIcon = (iconName?: string) => {
  if (!iconName) return <Code className="w-4.5 h-4.5 text-brand-primary" />;
  const IconComp = CategoryIconMap[iconName.toLowerCase()];
  if (IconComp) return <IconComp className="w-4.5 h-4.5 text-brand-primary" />;
  if (iconName.length <= 2) return <span className="text-xs font-bold">{iconName}</span>;
  return <Code className="w-4.5 h-4.5 text-brand-primary" />;
};

export const CurriculumPage: React.FC = () => {
  const { showToast } = useToast();
  const [courses, setCourses] = useState<Course[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  // Search & Navigation States
  const [searchQuery, setSearchQuery] = useState('');
  const [levelFilter, setLevelFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [selectedModule, setSelectedModule] = useState<Module | null>(null);
  const [selectedSubmodule, setSelectedSubmodule] = useState<Submodule | null>(null);

  // Forms: Module Mode
  const [isAddingModule, setIsAddingModule] = useState(false);
  const [editingModuleId, setEditingModuleId] = useState<number | null>(null);
  const [modTitle, setModTitle] = useState('');
  const [modDesc, setModDesc] = useState('');
  const [modOrder, setModOrder] = useState(1);
  const [modActive, setModActive] = useState(true);

  // Forms: Submodule Mode
  const [isAddingSubmodule, setIsAddingSubmodule] = useState(false);
  const [editingSubmoduleId, setEditingSubmoduleId] = useState<number | null>(null);
  const [subTitle, setSubTitle] = useState('');
  const [subDesc, setSubDesc] = useState('');
  const [subSlug, setSubSlug] = useState('');
  const [subOrder, setSubOrder] = useState(1);
  const [subActive, setSubActive] = useState(true);
  const [subMetaTitle, setSubMetaTitle] = useState('');
  const [subMetaDesc, setSubMetaDesc] = useState('');
  const [subCanonical, setSubCanonical] = useState('');
  const [subOgTitle, setSubOgTitle] = useState('');
  const [subOgImage, setSubOgImage] = useState('');
  const [showSubSeo, setShowSubSeo] = useState(false);

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

  // States for Adding/Editing Content Blocks
  const [newBlockType, setNewBlockType] = useState<'text' | 'code' | 'video' | 'image' | 'heading' | 'callout' | 'table'>('heading');
  const [newBlockTitle, setNewBlockTitle] = useState('');
  const [newBlockText, setNewBlockText] = useState('');
  const [newBlockCode, setNewBlockCode] = useState('');
  const [newBlockLanguage, setNewBlockLanguage] = useState('java');
  const [newBlockVideoUrl, setNewBlockVideoUrl] = useState('');
  const [newBlockImageUrl, setNewBlockImageUrl] = useState('');
  const [newBlockAlt, setNewBlockAlt] = useState('');
  const [newBlockCaption, setNewBlockCaption] = useState('');
  const [newBlockHeadingLevel, setNewBlockHeadingLevel] = useState(2);
  const [newBlockOrder, setNewBlockOrder] = useState(1);
  const [newBlockActive, setNewBlockActive] = useState(true);

  // Forms: Content Blocks Mode
  const [blocks, setBlocks] = useState<Content[]>([]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [cats, list] = await Promise.all([
        categoryServices.getAll(),
        courseServices.getAll()
      ]);
      setCategories(cats);
      setCourses(list);
      
      // Keep selectedCourse updated if editing
      if (selectedCourse) {
        const updated = list.find(c => String(c.id) === String(selectedCourse.id));
        if (updated) {
          setSelectedCourse(updated);
          if (selectedModule) {
            const updatedMod = updated.modules?.find(m => String(m.id) === String(selectedModule.id));
            if (updatedMod) {
              setSelectedModule(updatedMod);
              if (selectedSubmodule) {
                const updatedSub = updatedMod.submodules?.find(s => String(s.id) === String(selectedSubmodule.id));
                if (updatedSub) {
                  setSelectedSubmodule(updatedSub);
                  setBlocks(updatedSub.contents || []);
                }
              }
            }
          }
        }
      }
    } catch (err) {
      console.error(err);
      showToast('Error loading curriculum data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Slug generator helper
  const getSlug = (val: string) => {
    return val
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  };

  const handleSubTitleChange = (val: string) => {
    setSubTitle(val);
    setSubSlug(getSlug(val));
  };

  // Course Selector Mode
  const handleOpenCourse = (crs: Course) => {
    setSelectedCourse(crs);
    setSelectedModule(null);
    setSelectedSubmodule(null);
    setIsAddingModule(false);
    setIsAddingSubmodule(false);
  };

  // Select Module
  const handleSelectModule = (mod: Module) => {
    setSelectedModule(mod);
    setSelectedSubmodule(null);
    setIsAddingSubmodule(false);
    setEditingSubmoduleId(null);
  };

  // Add / Edit Module Actions
  const handleOpenAddModule = () => {
    setModTitle('');
    setModDesc('');
    setModOrder((selectedCourse?.modules?.length || 0) + 1);
    setModActive(true);
    setEditingModuleId(null);
    setIsAddingModule(true);
  };

  const handleOpenEditModule = (mod: Module, e: React.MouseEvent) => {
    e.stopPropagation();
    setModTitle(mod.title);
    setModDesc(mod.description || '');
    setModOrder(mod.moduleOrder || 1);
    setModActive(mod.isActive ?? true);
    setEditingModuleId(mod.id);
    setIsAddingModule(true);
  };

  const handleSaveModule = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCourse) return;

    let updatedModules = [...(selectedCourse.modules || [])];

    if (editingModuleId) {
      updatedModules = updatedModules.map(m => 
        String(m.id) === String(editingModuleId)
          ? { ...m, title: modTitle, description: modDesc, moduleOrder: modOrder, isActive: modActive }
          : m
      );
    } else {
      const newModule: Module = {
        id: Date.now(),
        title: modTitle,
        description: modDesc,
        moduleOrder: modOrder,
        isActive: modActive,
        submodules: []
      };
      updatedModules.push(newModule);
    }

    // sort
    updatedModules.sort((a, b) => (a.moduleOrder || 0) - (b.moduleOrder || 0));

    try {
      const updatedCourse = { ...selectedCourse, modules: updatedModules };
      await courseServices.update(selectedCourse.id, updatedCourse);
      showToast(editingModuleId ? 'Module updated successfully.' : 'New Module added.');
      setIsAddingModule(false);
      loadData();
    } catch (err) {
      console.error(err);
      showToast('Error saving module.');
    }
  };

  const handleDeleteModule = async (modId: number, name: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!selectedCourse) return;
    if (window.confirm(`Delete module "${name}" and all its submodules?`)) {
      const updatedModules = (selectedCourse.modules || []).filter(m => String(m.id) !== String(modId));
      try {
        await courseServices.update(selectedCourse.id, { ...selectedCourse, modules: updatedModules });
        showToast('Module deleted.');
        if (selectedModule?.id === modId) setSelectedModule(null);
        loadData();
      } catch (err) {
        console.error(err);
      }
    }
  };

  // Add / Edit Submodule Actions
  const handleOpenAddSubmodule = () => {
    setSubTitle('');
    setSubDesc('');
    setSubSlug('');
    setSubOrder((selectedModule?.submodules?.length || 0) + 1);
    setSubActive(true);
    setSubMetaTitle('');
    setSubMetaDesc('');
    setSubCanonical('');
    setSubOgTitle('');
    setSubOgImage('');
    setEditingSubmoduleId(null);
    setShowSubSeo(false);
    setIsAddingSubmodule(true);
  };

  const handleOpenEditSubmodule = (sub: Submodule, e: React.MouseEvent) => {
    e.stopPropagation();
    setSubTitle(sub.title);
    setSubDesc(sub.description || '');
    setSubSlug(sub.slug);
    setSubOrder(sub.submoduleOrder || 1);
    setSubActive(sub.isActive ?? true);
    setSubMetaTitle(sub.metaTitle || '');
    setSubMetaDesc(sub.metaDescription || '');
    setSubCanonical(sub.canonicalUrl || '');
    setSubOgTitle(sub.ogTitle || '');
    setSubOgImage(sub.ogImage || '');
    setEditingSubmoduleId(sub.id);
    setShowSubSeo(false);
    setIsAddingSubmodule(true);
  };

  const handleSaveSubmodule = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCourse || !selectedModule) return;

    let updatedSubmodules = [...(selectedModule.submodules || [])];

    if (editingSubmoduleId) {
      updatedSubmodules = updatedSubmodules.map(s => 
        String(s.id) === String(editingSubmoduleId)
          ? { 
              ...s, 
              title: subTitle, 
              description: subDesc, 
              slug: subSlug, 
              submoduleOrder: subOrder, 
              isActive: subActive,
              metaTitle: subMetaTitle,
              metaDescription: subMetaDesc,
              canonicalUrl: subCanonical,
              ogTitle: subOgTitle,
              ogImage: subOgImage
            }
          : s
      );
    } else {
      const newSubmodule: Submodule = {
        id: Date.now(),
        title: subTitle,
        description: subDesc,
        slug: subSlug || getSlug(subTitle),
        submoduleOrder: subOrder,
        isActive: subActive,
        metaTitle: subMetaTitle,
        metaDescription: subMetaDesc,
        canonicalUrl: subCanonical,
        ogTitle: subOgTitle,
        ogImage: subOgImage,
        contents: []
      };
      updatedSubmodules.push(newSubmodule);
    }

    updatedSubmodules.sort((a, b) => (a.submoduleOrder || 0) - (b.submoduleOrder || 0));

    const updatedModules = (selectedCourse.modules || []).map(m => 
      String(m.id) === String(selectedModule.id)
        ? { ...m, submodules: updatedSubmodules }
        : m
    );

    try {
      await courseServices.update(selectedCourse.id, { ...selectedCourse, modules: updatedModules });
      showToast(editingSubmoduleId ? 'Submodule updated.' : 'Submodule added.');
      setIsAddingSubmodule(false);
      loadData();
    } catch (err) {
      console.error(err);
      showToast('Error saving submodule.');
    }
  };

  const handleDeleteSubmodule = async (subId: number, name: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!selectedCourse || !selectedModule) return;
    if (window.confirm(`Delete submodule "${name}"?`)) {
      const updatedSubmodules = (selectedModule.submodules || []).filter(s => String(s.id) !== String(subId));
      const updatedModules = (selectedCourse.modules || []).map(m => 
        String(m.id) === String(selectedModule.id)
          ? { ...m, submodules: updatedSubmodules }
          : m
      );
      try {
        await courseServices.update(selectedCourse.id, { ...selectedCourse, modules: updatedModules });
        showToast('Submodule deleted.');
        loadData();
      } catch (err) {
        console.error(err);
      }
    }
  };

  // Manage Content Blocks Mode
  const handleOpenBlockEditor = (sub: Submodule) => {
    setSelectedSubmodule(sub);
    setBlocks(sub.contents || []);
  };

  const handleAddBlock = (type: Content['type']) => {
    const newBlock: Content = {
      id: Date.now(),
      type,
      isActive: true,
      contentOrder: blocks.length + 1,
      title: type === 'heading' ? 'Heading Title' : type === 'callout' ? 'Callout Title' : '',
      text: type === 'text' || type === 'callout' ? 'Enter text content here...' : '',
      code: type === 'code' ? 'public class Main {}' : '',
      language: type === 'code' ? 'java' : '',
      videoUrl: type === 'video' ? 'https://www.youtube.com/embed/...' : '',
      imageUrl: type === 'image' ? 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=400&q=80' : '',
    };
    setBlocks([...blocks, newBlock]);
  };

  const handleDeleteBlock = (blockId: number) => {
    setBlocks(blocks.filter(b => String(b.id) !== String(blockId)));
  };

  const handleBlockChange = (index: number, updatedFields: Partial<Content>) => {
    const next = [...blocks];
    next[index] = { ...next[index], ...updatedFields };
    setBlocks(next);
  };

  const handleMoveBlock = (index: number, direction: 'up' | 'down') => {
    if (direction === 'up' && index === 0) return;
    if (direction === 'down' && index === blocks.length - 1) return;

    const next = [...blocks];
    const targetIdx = direction === 'up' ? index - 1 : index + 1;
    const temp = next[index];
    next[index] = next[targetIdx];
    next[targetIdx] = temp;

    // update orders
    const final = next.map((b, idx) => ({ ...b, contentOrder: idx + 1 }));
    setBlocks(final);
  };

  const handleSaveBlocks = async () => {
    if (!selectedCourse || !selectedModule || !selectedSubmodule) return;

    const updatedSubmodules = (selectedModule.submodules || []).map(s => 
      String(s.id) === String(selectedSubmodule.id)
        ? { ...s, contents: blocks }
        : s
    );

    const updatedModules = (selectedCourse.modules || []).map(m => 
      String(m.id) === String(selectedModule.id)
        ? { ...m, submodules: updatedSubmodules }
        : m
    );

    try {
      await courseServices.update(selectedCourse.id, { ...selectedCourse, modules: updatedModules });
      showToast('Submodule content blocks saved successfully!');
      loadData();
    } catch (err) {
      console.error(err);
      showToast('Error saving content blocks.');
    }
  };

  // General counts calculation
  let totalModulesCount = 0;
  let totalSubmodulesCount = 0;
  let totalBlocksCount = 0;

  (courses || []).forEach(c => {
    c.modules?.forEach(m => {
      totalModulesCount++;
      m.submodules?.forEach(s => {
        totalSubmodulesCount++;
        totalBlocksCount += s.contents?.length || 0;
      });
    });
  });

  const filteredCourses = (courses || []).filter(c => {
    const query = searchQuery.toLowerCase();
    const matchesSearch = 
      (c.title || '').toLowerCase().includes(query) ||
      (c.slug || '').toLowerCase().includes(query);

    const courseCatId = c.category && typeof c.category === 'object' ? c.category.id : c.category;
    const matchesCategory = categoryFilter === 'all' || String(courseCatId) === String(categoryFilter);
    const matchesLevel = levelFilter === 'all' || c.level === levelFilter;
    const matchesStatus = 
      statusFilter === 'all' || 
      (statusFilter === 'active' && c.isActive) ||
      (statusFilter === 'inactive' && !c.isActive);

    return matchesSearch && matchesCategory && matchesLevel && matchesStatus;
  });

  return (
    <div className="flex-grow flex flex-col gap-6">
      <AnimatePresence mode="wait">
        
        {/* MODE 1: Catalog course grid selector */}
        {!selectedCourse && (
          <motion.div
            key="catalog-select"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="flex flex-col gap-6"
          >
            {/* Title & Stats Row */}
            <div className="flex justify-between items-end mb-2">
              <div className="flex flex-col gap-1 text-left">
                <h1 className="text-2xl font-black text-brand-primaryDark tracking-tight">Curriculum</h1>
                <p className="text-xs text-brand-muted font-bold">Select a course below to manage its modules, submodules, and content.</p>
              </div>
              <div className="flex items-center gap-2.5">
                <span className="px-3.5 py-1.5 rounded-full text-[10px] font-black bg-[#84117C]/10 text-[#84117C] border border-[#84117C]/20 tracking-wider uppercase shadow-sm">
                  {courses.length} Courses
                </span>
                <span className="px-3.5 py-1.5 rounded-full text-[10px] font-black bg-[#01AC9F]/10 text-[#01AC9F] border border-[#01AC9F]/20 tracking-wider uppercase shadow-sm">
                  {totalModulesCount} Modules
                </span>
                <span className="px-3.5 py-1.5 rounded-full text-[10px] font-black bg-[#FF6200]/10 text-[#FF6200] border border-[#FF6200]/20 tracking-wider uppercase shadow-sm">
                  {totalBlocksCount} Blocks
                </span>
              </div>
            </div>

            {/* Filter and catalog stats layout */}
            <div className="glass-panel p-4 rounded-2xl flex flex-wrap items-center gap-4 border border-white/60 shadow-glass">
              <div className="relative w-full sm:w-64">
                <input
                  type="text"
                  placeholder="Search courses by title..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 rounded-xl text-xs font-semibold glass-input outline-none tracking-wide"
                />
                <Search className="w-4 h-4 text-brand-muted absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>

              <select
                value={levelFilter}
                onChange={(e) => setLevelFilter(e.target.value)}
                className="px-3.5 py-2 rounded-xl text-xs font-bold bg-white/65 border border-[#E2E4F0] outline-none text-brand-primaryDark tracking-wide"
              >
                <option value="all">All Levels</option>
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
              </select>

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3.5 py-2 rounded-xl text-xs font-bold bg-white/65 border border-[#E2E4F0] outline-none text-brand-primaryDark tracking-wide"
              >
                <option value="all">All Status</option>
                <option value="active">Active Only</option>
                <option value="inactive">Inactive Only</option>
              </select>

              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="px-3.5 py-2 rounded-xl text-xs font-bold bg-white/65 border border-[#E2E4F0] outline-none text-brand-primaryDark tracking-wide"
              >
                <option value="all">All Categories</option>
                {categories.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>

              <div className="ml-auto text-[10px] text-brand-muted font-bold uppercase tracking-wider">
                {filteredCourses.length} courses
              </div>
            </div>

            {/* Course grids catalog list */}
            {filteredCourses.length === 0 ? (
              <div className="glass-panel rounded-2xl py-20 text-center text-brand-muted font-bold">
                No courses match query filters.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredCourses.map(crs => {
                  const modsCount = crs.modules?.length || 0;
                  const levelColors = crs.level === 'Advanced' 
                    ? 'bg-purple-50 text-purple-700 border-purple-200/60' 
                    : crs.level === 'Intermediate' 
                    ? 'bg-emerald-50 text-emerald-700 border-emerald-200/60' 
                    : 'bg-amber-50 text-amber-700 border-amber-200/60';

                  return (
                    <motion.div 
                      key={crs.id}
                      whileHover={{ y: -4 }}
                      transition={{ duration: 0.2 }}
                      onClick={() => handleOpenCourse(crs)}
                      className="glass-panel rounded-2xl overflow-hidden shadow-sm hover:shadow-xl border border-slate-200/80 hover:border-brand-primary/40 flex flex-col justify-between cursor-pointer group transition-all duration-300 relative bg-white"
                    >
                      {/* Image cover */}
                      <div className="relative aspect-[1.85] bg-slate-900 overflow-hidden">
                        <img 
                          src={crs.bannerImage || 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=400&q=80'} 
                          alt={crs.title} 
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" 
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-slate-950/20 to-transparent"></div>
                        
                        {/* Circular category icon overlay at bottom-left */}
                        <div className="absolute left-3.5 bottom-3.5 w-9 h-9 rounded-xl bg-white/95 backdrop-blur-md flex items-center justify-center shadow-lg border border-white/80 z-10 transition-transform group-hover:scale-110">
                          {renderCategoryIcon(crs.category?.icon)}
                        </div>

                        {/* Featured star badge overlay on top-right */}
                        {crs.isFeatured && (
                          <div className="absolute right-3.5 top-3.5 px-2.5 py-1 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 text-white text-[10px] font-black tracking-wider uppercase flex items-center gap-1 shadow-md border border-white/20 z-10">
                            <Star className="w-3 h-3 fill-current text-white" />
                            <span>Featured</span>
                          </div>
                        )}
                      </div>

                      {/* Details section */}
                      <div className="p-5 flex-grow flex flex-col justify-between text-left">
                        <div>
                          {/* Badges under image */}
                          <div className="flex items-center gap-2 mb-3">
                            <span 
                              className="px-2.5 py-0.5 rounded-full text-[9px] font-extrabold uppercase tracking-wider shadow-2xs"
                              style={{ 
                                backgroundColor: `${crs.category?.color || '#84117C'}12`, 
                                color: crs.category?.color || '#84117C',
                                border: `1px solid ${crs.category?.color || '#84117C'}30`
                              }}
                            >
                              {crs.category?.name || 'Development'}
                            </span>
                            <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-extrabold uppercase tracking-wider border shadow-2xs ${levelColors}`}>
                              {crs.level || 'Beginner'}
                            </span>
                          </div>

                          <h3 className="text-base font-extrabold text-slate-900 leading-snug mb-1 line-clamp-1 group-hover:text-brand-primary transition-colors tracking-tight">
                            {crs.title}
                          </h3>
                          
                          <span className="text-[11px] text-slate-400 font-medium font-mono block mb-4 tracking-tight">/{crs.slug}</span>

                          {/* Details listing inside clean grid */}
                          <div className="grid grid-cols-3 gap-2 py-2.5 px-3 rounded-xl bg-slate-50 border border-slate-100 mb-4 text-[11px] font-semibold text-slate-600">
                            <div className="flex flex-col items-start min-w-0">
                              <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1 mb-0.5">
                                <Globe className="w-3 h-3 text-slate-400" /> Lang
                              </span>
                              <span className="truncate w-full text-slate-800 font-bold text-[11px]">{crs.language || 'English'}</span>
                            </div>
                            <div className="flex flex-col items-start min-w-0">
                              <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1 mb-0.5">
                                <Clock className="w-3 h-3 text-slate-400" /> Time
                              </span>
                              <span className="truncate w-full text-slate-800 font-bold text-[11px]">{crs.duration || 'Self-Paced'}</span>
                            </div>
                            <div className="flex flex-col items-start min-w-0">
                              <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1 mb-0.5">
                                <Layers className="w-3 h-3 text-slate-400" /> Units
                              </span>
                              <span className="truncate w-full text-slate-800 font-bold text-[11px]">{modsCount} Modules</span>
                            </div>
                          </div>
                        </div>

                        {/* Footer status row */}
                        <div className="flex justify-between items-center border-t border-slate-100 pt-3.5 mt-1">
                          <div className="flex items-center gap-1.5">
                            <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-extrabold uppercase tracking-wider ${crs.isActive ? 'bg-emerald-50 text-emerald-700 border border-emerald-200/60' : 'bg-slate-100 text-slate-500 border border-slate-200'}`}>
                              {crs.isActive ? 'Active' : 'Inactive'}
                            </span>
                            <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-extrabold uppercase tracking-wider ${crs.isPublished ? 'bg-purple-50 text-purple-700 border border-purple-200/60' : 'bg-slate-100 text-slate-500 border border-slate-200'}`}>
                              {crs.isPublished ? 'Published' : 'Draft'}
                            </span>
                          </div>
                          
                          <div className="flex items-center gap-1 text-xs font-extrabold text-[#01AC9F] group-hover:text-brand-primary transition-colors bg-[#01AC9F]/8 group-hover:bg-brand-primary/10 px-3 py-1.5 rounded-lg border border-[#01AC9F]/20 group-hover:border-brand-primary/20">
                            <span>Open</span>
                            <ChevronRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </motion.div>
        )}

        {/* MODE 2: splitscreen Module & Submodule Editor */}
        {selectedCourse && !selectedSubmodule && (
          <motion.div
            key="splitscreen-manager"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col gap-5"
          >
            {/* Breadcrumb Navigation header */}
            <div className="flex justify-between items-center bg-white/40 border border-[#E2E4F0]/60 p-3 px-5 rounded-2xl shadow-sm">
              <div className="flex items-center gap-1 text-xs text-brand-muted font-bold font-sans">
                <span className="cursor-pointer hover:text-brand-primary" onClick={() => setSelectedCourse(null)}>Curriculum</span>
                <ChevronRight className="w-3.5 h-3.5" />
                <span 
                  className="px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-wider"
                  style={{ 
                    backgroundColor: `${selectedCourse.category?.color || '#84117C'}15`, 
                    color: selectedCourse.category?.color || '#84117C',
                    border: `1px solid ${selectedCourse.category?.color || '#84117C'}25`
                  }}
                >
                  {selectedCourse.category?.name || 'Dev'}
                </span>
                <ChevronRight className="w-3.5 h-3.5" />
                <span className="cursor-pointer hover:text-brand-primary" onClick={() => handleSelectModule(selectedCourse.modules?.[0] || null as any)}>{selectedCourse.title}</span>
                {selectedModule && (
                  <>
                    <ChevronRight className="w-3.5 h-3.5" />
                    <span className="text-[#84117C] font-extrabold">{selectedModule.title}</span>
                  </>
                )}
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] text-brand-muted font-bold flex items-center gap-1"><Check className="w-3.5 h-3.5 text-emerald-500" /> All changes saved</span>
                <div className="w-6 h-6 rounded-full bg-[#84117C] text-white flex items-center justify-center text-[10px] font-black uppercase">A</div>
              </div>
            </div>

            {/* Splitscreen layout */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
              
              {/* LEFT Column: Modules list */}
              <div className="flex flex-col gap-6">
                <div className="glass-panel p-5 rounded-3xl border border-white/60 shadow-glass flex flex-col gap-4 bg-white/75">
                  <div className="flex justify-between items-center border-b border-[#E2E4F0]/60 pb-3">
                    <div className="flex flex-col text-left">
                      <h3 className="font-black text-sm text-brand-primaryDark">Modules</h3>
                      <span className="text-[10px] text-brand-muted font-bold flex items-center gap-1 mt-0.5">
                        Course: 
                        <span 
                          className="px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-wider ml-1"
                          style={{ 
                            backgroundColor: `${selectedCourse.category?.color || '#84117C'}15`, 
                            color: selectedCourse.category?.color || '#84117C',
                            border: `1px solid ${selectedCourse.category?.color || '#84117C'}25`
                          }}
                        >
                          {selectedCourse.category?.name || 'Dev'}
                        </span>
                        <b className="text-brand-primaryDark ml-1">{selectedCourse.title}</b>
                      </span>
                    </div>
                    {userRole !== 'student' && (
                      <button
                        onClick={handleOpenAddModule}
                        className="px-3 py-1.5 rounded-xl text-white bg-[#01AC9F] hover:bg-[#01AC9F]/90 shadow-sm text-[10px] font-black uppercase flex items-center gap-1"
                      >
                        <Plus className="w-3.5 h-3.5" /> Add Module
                      </button>
                    )}
                  </div>

                  {/* Modules loop */}
                  <div className="flex flex-col gap-2.5 max-h-[500px] overflow-y-auto pr-1">
                    {!selectedCourse.modules || selectedCourse.modules.length === 0 ? (
                      <span className="text-xs text-brand-muted italic py-10">No modules created yet. Add one above!</span>
                    ) : (
                      selectedCourse.modules.map(mod => {
                        const isSelected = selectedModule?.id === mod.id;
                        const displayOrder = mod.moduleOrder < 10 ? `0${mod.moduleOrder}` : mod.moduleOrder;

                        return (
                          <div
                            key={mod.id}
                            onClick={() => handleSelectModule(mod)}
                            className={`p-4 rounded-xl border cursor-pointer flex justify-between items-center transition-all duration-200 gap-3 text-left ${
                              isSelected
                                ? 'bg-brand-primary/10 border-brand-primary/30 shadow-sm'
                                : 'bg-white/40 border-[#E2E4F0]/60 hover:bg-white/70'
                            }`}
                          >
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-full bg-brand-primary/10 border border-brand-primary/20 text-brand-primary font-bold flex items-center justify-center text-xs flex-shrink-0 font-mono">
                                {displayOrder}
                              </div>
                              <div className="flex flex-col text-left">
                                <span className="text-xs font-black text-brand-primaryDark leading-tight tracking-wide">
                                  {mod.title}
                                </span>
                                <span className="text-[10px] text-brand-muted leading-tight mt-1 font-semibold line-clamp-1">
                                  {mod.description || 'No description provided.'}
                                </span>
                                <div className="flex items-center gap-2 mt-1">
                                  <label className={`relative inline-flex items-center select-none ${userRole === 'student' ? 'cursor-default' : 'cursor-pointer'}`} onClick={(e) => e.stopPropagation()}>
                                    <input 
                                      type="checkbox" 
                                      disabled={userRole === 'student'}
                                      checked={mod.isActive ?? true} 
                                      onChange={async (e) => {
                                        if (userRole === 'student') return;
                                        const updated = (selectedCourse.modules || []).map(m => m.id === mod.id ? { ...m, isActive: e.target.checked } : m);
                                        await courseServices.update(selectedCourse.id, { ...selectedCourse, modules: updated });
                                        loadData();
                                      }} 
                                      className="sr-only switch-input" 
                                    />
                                    <div className="w-9 h-5 bg-[#E2E4F0] border border-[#E2E4F0] rounded-full switch-bg transition-colors duration-200"></div>
                                    <div className="absolute left-0.5 top-0.5 w-4 h-4 bg-white rounded-full switch-dot transition-transform duration-200 shadow-sm"></div>
                                  </label>
                                  <span className="text-[9px] text-brand-muted/70 font-bold uppercase tracking-wider">
                                    {mod.submodules?.length || 0} Submodules • {mod.isActive ? 'Active' : 'Inactive'}
                                  </span>
                                </div>
                              </div>
                            </div>
                            
                            <div className="flex items-center gap-1.5 flex-shrink-0" onClick={(e) => e.stopPropagation()}>
                              {userRole !== 'student' && (
                                <>
                                  <button onClick={(e) => handleOpenEditModule(mod, e)} className="p-1.5 rounded-md hover:bg-brand-primary hover:text-white border border-[#E2E4F0]/40 text-brand-muted"><Edit2 className="w-3 h-3" /></button>
                                  <button onClick={(e) => handleDeleteModule(mod.id, mod.title, e)} className="p-1.5 rounded-md hover:bg-red-500 hover:text-white border border-[#E2E4F0]/40 text-brand-muted"><Trash2 className="w-3 h-3" /></button>
                                </>
                              )}
                              <ChevronRight className="w-4 h-4 text-brand-muted/70" />
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>

                {/* Left side card module editor */}
                {isAddingModule && (
                  <form onSubmit={handleSaveModule} className="glass-panel p-6 rounded-3xl border border-white/60 shadow-glass flex flex-col gap-4 text-left border-t-4 border-t-[#01AC9F] bg-white/75 relative">
                    <button type="button" onClick={() => setIsAddingModule(false)} className="absolute right-4 top-4 text-brand-muted hover:text-brand-primary"><X className="w-4.5 h-4.5" /></button>
                    
                    <div className="flex flex-col text-left">
                      <h4 className="text-sm font-black text-brand-primaryDark">
                        {editingModuleId ? 'Edit Module' : 'Add Module'}
                      </h4>
                      <span className="text-[10px] text-brand-muted font-bold mt-0.5">
                        Course: 
                        <span 
                          className="px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-wider ml-1"
                          style={{ 
                            backgroundColor: `${selectedCourse.category?.color || '#84117C'}15`, 
                            color: selectedCourse.category?.color || '#84117C',
                            border: `1px solid ${selectedCourse.category?.color || '#84117C'}25`
                          }}
                        >
                          {selectedCourse.category?.name || 'Dev'}
                        </span>
                        <b className="text-brand-primaryDark ml-1">{selectedCourse.title}</b>
                      </span>
                    </div>

                    <div className="flex flex-col gap-1.5 mt-2">
                      <div className="flex justify-between items-center">
                        <label className="text-xs font-extrabold text-brand-primaryDark">Title *</label>
                        <span className="text-[10px] text-brand-muted font-bold">{modTitle.length}/200</span>
                      </div>
                      <input 
                        type="text" required value={modTitle} 
                        placeholder="e.g. Introduction to Spring Boot"
                        onChange={(e) => setModTitle(e.target.value)} 
                        className="px-4 py-3 rounded-xl text-xs font-semibold glass-input outline-none"
                      />
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-extrabold text-brand-primaryDark">Description</label>
                      <textarea 
                        rows={3} value={modDesc} 
                        placeholder="Describe the module contents..."
                        onChange={(e) => setModDesc(e.target.value)} 
                        className="px-4 py-3 rounded-xl text-xs font-semibold glass-input outline-none resize-none"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-extrabold text-brand-primaryDark">Module Order</label>
                        <input 
                          type="number" value={modOrder} 
                          onChange={(e) => setModOrder(parseInt(e.target.value) || 1)} 
                          className="px-4 py-3 rounded-xl text-xs font-semibold glass-input outline-none"
                        />
                      </div>
                      <div className="flex items-center justify-between mt-6">
                        <span className="text-xs font-extrabold text-brand-primaryDark">Active</span>
                        <label className="relative inline-flex items-center cursor-pointer select-none">
                          <input type="checkbox" checked={modActive} onChange={(e) => setModActive(e.target.checked)} className="sr-only switch-input" />
                          <div className="w-9 h-5 bg-[#E2E4F0] border border-[#E2E4F0] rounded-full switch-bg transition-colors duration-200"></div>
                          <div className="absolute left-0.5 top-0.5 w-4 h-4 bg-white rounded-full switch-dot transition-transform duration-200 shadow-sm"></div>
                        </label>
                      </div>
                    </div>

                    {editingModuleId && (
                      <div className="text-[10px] text-brand-muted font-semibold mt-1">
                        Created: Jan 12, 2025 • 09:41 &nbsp;•&nbsp; Updated: Jan 18, 2025 • 14:22
                      </div>
                    )}

                    <div className="flex justify-end gap-3 border-t border-[#E2E4F0]/60 pt-4 mt-2">
                      <button type="button" onClick={() => setIsAddingModule(false)} className="px-4 py-2.5 rounded-xl border border-[#E2E4F0] text-brand-muted text-xs font-bold hover:bg-white/40">Cancel</button>
                      <button type="submit" className="px-4 py-2.5 rounded-xl bg-[#01AC9F] hover:bg-[#01AC9F]/90 text-white text-xs font-black shadow-md">Save Module</button>
                    </div>
                  </form>
                )}
              </div>

              {/* RIGHT Column: Submodules list */}
              <div className="flex flex-col gap-6">
                <div className="glass-panel p-5 rounded-3xl border border-white/60 shadow-glass flex flex-col gap-4 bg-white/75">
                  <div className="flex justify-between items-center border-b border-[#E2E4F0]/60 pb-3">
                    <div className="flex flex-col text-left">
                      <h3 className="font-black text-sm text-brand-primaryDark">Submodules</h3>
                      <span className="text-[10px] text-brand-muted font-bold flex items-center gap-1 mt-0.5">
                        Module: 
                        <span className="text-xs ml-1">📙</span>
                        <b className="text-brand-primaryDark ml-1">{selectedModule ? selectedModule.title : 'Select a Module'}</b>
                      </span>
                    </div>
                    {selectedModule && (
                      <button
                        onClick={handleOpenAddSubmodule}
                        className="px-3 py-1.5 rounded-xl text-white bg-[#01AC9F] hover:bg-[#01AC9F]/90 shadow-sm text-[10px] font-black uppercase flex items-center gap-1"
                      >
                        <Plus className="w-3.5 h-3.5" /> Add Submodule
                      </button>
                    )}
                  </div>

                  {/* Submodule list loop */}
                  <div className="flex flex-col gap-2.5 max-h-[500px] overflow-y-auto pr-1">
                    {!selectedModule ? (
                      <span className="text-xs text-brand-muted italic py-10">Select a module on the left to see its submodules.</span>
                    ) : !selectedModule.submodules || selectedModule.submodules.length === 0 ? (
                      <span className="text-xs text-brand-muted italic py-10">No submodules created yet. Add one above!</span>
                    ) : (
                      selectedModule.submodules.map(sub => {
                        const displayOrder = sub.submoduleOrder < 10 ? `0${sub.submoduleOrder}` : sub.submoduleOrder;
                        return (
                          <div
                            key={sub.id}
                            className="p-4 rounded-xl border bg-white/45 border-[#E2E4F0]/65 flex justify-between items-center hover:bg-white/75 transition-all duration-200 gap-3 text-left"
                          >
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-full bg-brand-success/10 border border-brand-success/20 text-brand-success font-bold flex items-center justify-center text-xs flex-shrink-0 font-mono">
                                {displayOrder}
                              </div>
                              <div className="flex flex-col text-left">
                                <span className="text-xs font-black text-brand-primaryDark leading-tight tracking-wide">
                                  {sub.title}
                                </span>
                                <span className="text-[10px] text-brand-muted leading-tight mt-1 font-semibold line-clamp-1">
                                  {sub.description || 'No description provided.'}
                                </span>
                                <div className="flex items-center gap-2 mt-1">
                                  <label className={`relative inline-flex items-center select-none ${userRole === 'student' ? 'cursor-default' : 'cursor-pointer'}`} onClick={(e) => e.stopPropagation()}>
                                    <input 
                                      type="checkbox" 
                                      disabled={userRole === 'student'}
                                      checked={sub.isActive ?? true} 
                                      onChange={async (e) => {
                                        if (userRole === 'student') return;
                                        const updatedSubs = (selectedModule.submodules || []).map(s => s.id === sub.id ? { ...s, isActive: e.target.checked } : s);
                                        const updatedMods = (selectedCourse.modules || []).map(m => m.id === selectedModule.id ? { ...m, submodules: updatedSubs } : m);
                                        await courseServices.update(selectedCourse.id, { ...selectedCourse, modules: updatedMods });
                                        loadData();
                                      }} 
                                      className="sr-only switch-input" 
                                    />
                                    <div className="w-9 h-5 bg-[#E2E4F0] border border-[#E2E4F0] rounded-full switch-bg transition-colors duration-200"></div>
                                    <div className="absolute left-0.5 top-0.5 w-4 h-4 bg-white rounded-full switch-dot transition-transform duration-200 shadow-sm"></div>
                                  </label>
                                  <span className="text-[9px] text-brand-muted/70 font-bold uppercase tracking-wider">
                                    /{sub.slug} • {sub.contents?.length || 0} blocks • {sub.isActive ? 'Active' : 'Inactive'}
                                  </span>
                                </div>
                              </div>
                            </div>

                            <div className="flex items-center gap-1.5 flex-shrink-0">
                              <button
                                onClick={() => handleOpenBlockEditor(sub)}
                                className="bg-brand-primary/5 border border-brand-primary/15 text-brand-primary hover:bg-brand-primary hover:text-white px-2.5 py-1.5 rounded-lg text-[10px] font-black flex items-center gap-1 transition-all duration-200"
                              >
                                <Code2 className="w-3 h-3" /> Blocks
                              </button>
                              {userRole !== 'student' && (
                                <>
                                  <button onClick={(e) => handleOpenEditSubmodule(sub, e)} className="p-1.5 rounded-md hover:bg-brand-primary hover:text-white border border-[#E2E4F0]/40 text-brand-muted"><Edit2 className="w-3 h-3" /></button>
                                  <button onClick={(e) => handleDeleteSubmodule(sub.id, sub.title, e)} className="p-1.5 rounded-md hover:bg-red-500 hover:text-white border border-[#E2E4F0]/40 text-brand-muted"><Trash2 className="w-3 h-3" /></button>
                                </>
                              )}
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>

                {/* Right side card submodule editor */}
                {isAddingSubmodule && selectedModule && (
                  <form onSubmit={handleSaveSubmodule} className="glass-panel p-6 rounded-3xl border border-white/60 shadow-glass flex flex-col gap-4 text-left border-t-4 border-t-[#01AC9F] bg-white/75 relative">
                    <button type="button" onClick={() => setIsAddingSubmodule(false)} className="absolute right-4 top-4 text-brand-muted hover:text-brand-primary"><X className="w-4.5 h-4.5" /></button>
                    
                    <div className="flex flex-col text-left">
                      <h4 className="text-sm font-black text-brand-primaryDark">
                        {editingSubmoduleId ? 'Edit Submodule' : 'Add Submodule'}
                      </h4>
                      <span className="text-[10px] text-brand-muted font-bold mt-0.5">
                        Module: 
                        <span className="text-xs ml-1">📙</span>
                        <b className="text-brand-primaryDark ml-1">{selectedModule.title}</b>
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
                      <div className="flex flex-col gap-1.5 sm:col-span-2">
                        <div className="flex justify-between items-center">
                          <label className="text-xs font-extrabold text-brand-primaryDark">Title *</label>
                          <span className="text-[10px] text-brand-muted font-bold">{subTitle.length}/200</span>
                        </div>
                        <input 
                          type="text" required value={subTitle} 
                          placeholder="e.g. Variables and Types"
                          onChange={(e) => handleSubTitleChange(e.target.value)} 
                          className="px-4 py-3 rounded-xl text-xs font-semibold glass-input outline-none"
                        />
                      </div>

                      <div className="flex flex-col gap-1.5">
                        <div className="flex justify-between items-center">
                          <label className="text-xs font-extrabold text-brand-primaryDark">Slug *</label>
                          <span className="text-[10px] bg-emerald-500/10 text-emerald-600 px-2 py-0.5 rounded font-black border border-emerald-500/20 flex items-center gap-1">OK</span>
                        </div>
                        <input 
                          type="text" required value={subSlug} 
                          placeholder="variables-and-types"
                          onChange={(e) => setSubSlug(e.target.value)} 
                          className="px-4 py-3 rounded-xl text-xs font-semibold glass-input outline-none font-mono"
                        />
                      </div>

                      <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-extrabold text-brand-primaryDark">Submodule Order</label>
                        <input 
                          type="number" value={subOrder} 
                          onChange={(e) => setSubOrder(parseInt(e.target.value) || 1)} 
                          className="px-4 py-3 rounded-xl text-xs font-semibold glass-input outline-none"
                        />
                      </div>
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-extrabold text-brand-primaryDark">Description</label>
                      <textarea 
                        rows={3} value={subDesc} 
                        placeholder="Describe this submodule..."
                        onChange={(e) => setSubDesc(e.target.value)} 
                        className="px-4 py-3 rounded-xl text-xs font-semibold glass-input outline-none resize-none"
                      />
                    </div>

                    {/* Active Switch */}
                    <div className="flex items-center justify-between p-3 bg-white/40 rounded-xl border border-[#E2E4F0]/40">
                      <span className="text-xs font-extrabold text-brand-primaryDark">Active</span>
                      <label className="relative inline-flex items-center cursor-pointer select-none">
                        <input type="checkbox" checked={subActive} onChange={(e) => setSubActive(e.target.checked)} className="sr-only switch-input" />
                        <div className="w-9 h-5 bg-[#E2E4F0] border border-[#E2E4F0] rounded-full switch-bg transition-colors duration-200"></div>
                        <div className="absolute left-0.5 top-0.5 w-4 h-4 bg-white rounded-full switch-dot transition-transform duration-200 shadow-sm"></div>
                      </label>
                    </div>

                    {/* SEO & Metadata optional dropdown accordion */}
                    <div className="border border-[#E2E4F0]/50 rounded-2xl overflow-hidden bg-white/40">
                      <button
                        type="button"
                        onClick={() => setShowSubSeo(!showSubSeo)}
                        className="w-full px-4 py-3 flex justify-between items-center text-xs font-extrabold text-brand-primaryDark bg-white/60 hover:bg-white/80 transition-colors"
                      >
                        <span className="flex items-center gap-1.5"><Search className="w-4 h-4 text-brand-primary" /> SEO & Metadata <span className="text-[10px] text-brand-muted font-normal ml-1">Optional</span></span>
                        {showSubSeo ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                      </button>

                      {showSubSeo && (
                        <div className="p-4 flex flex-col gap-4 border-t border-[#E2E4F0]/40 bg-white/20">
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="flex flex-col gap-1.5">
                              <div className="flex justify-between items-center">
                                <label className="text-[10px] font-extrabold text-brand-primaryDark">Meta Title</label>
                                <span className="text-[8px] text-brand-muted font-bold">{subMetaTitle.length}/70</span>
                              </div>
                              <input type="text" placeholder="Meta title..." value={subMetaTitle} onChange={e => setSubMetaTitle(e.target.value)} className="px-3 py-2 rounded-lg text-xs font-semibold glass-input outline-none" />
                            </div>

                            <div className="flex flex-col gap-1.5">
                              <label className="text-[10px] font-extrabold text-brand-primaryDark">Canonical URL</label>
                              <input type="text" placeholder="https://..." value={subCanonical} onChange={e => setSubCanonical(e.target.value)} className="px-3 py-2 rounded-lg text-xs font-semibold glass-input outline-none font-mono" />
                            </div>

                            <div className="flex flex-col gap-1.5 sm:col-span-2">
                              <div className="flex justify-between items-center">
                                <label className="text-[10px] font-extrabold text-brand-primaryDark">Meta Description</label>
                                <span className="text-[8px] text-brand-muted font-bold">{subMetaDesc.length}/320</span>
                              </div>
                              <textarea rows={2.5} placeholder="Meta description..." value={subMetaDesc} onChange={e => setSubMetaDesc(e.target.value)} className="px-3 py-2 rounded-lg text-xs font-semibold glass-input outline-none resize-none" />
                            </div>

                            <div className="flex flex-col gap-1.5">
                              <label className="text-[10px] font-extrabold text-brand-primaryDark">OG Title</label>
                              <input type="text" placeholder="OG title..." value={subOgTitle} onChange={e => setSubOgTitle(e.target.value)} className="px-3 py-2 rounded-lg text-xs font-semibold glass-input outline-none" />
                            </div>

                            <div className="flex flex-col gap-1.5">
                              <label className="text-[10px] font-extrabold text-brand-primaryDark">OG Image URL</label>
                              <input type="text" placeholder="Image URL..." value={subOgImage} onChange={e => setSubOgImage(e.target.value)} className="px-3 py-2 rounded-lg text-xs font-semibold glass-input outline-none font-mono" />
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="flex justify-end gap-3 border-t border-[#E2E4F0]/60 pt-4 mt-2">
                      <button type="button" onClick={() => setIsAddingSubmodule(false)} className="px-4 py-2.5 rounded-xl border border-[#E2E4F0] text-brand-muted text-xs font-bold hover:bg-white/40">Cancel</button>
                      <button type="submit" className="px-4 py-2.5 rounded-xl bg-[#01AC9F] hover:bg-[#01AC9F]/90 text-white text-xs font-black shadow-md flex items-center gap-1"><Plus className="w-3.5 h-3.5" /> Save Submodule</button>
                    </div>
                  </form>
                )}
              </div>
            </div>
          </motion.div>
        )}

        {/* MODE 3: Submodule Content Blocks manager */}
        {selectedCourse && selectedSubmodule && (
          <motion.div
            key="block-editor"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col gap-6"
          >
            {/* Breadcrumb Navigation header */}
            <div className="flex justify-between items-center bg-white/40 border border-[#E2E4F0]/60 p-3 px-5 rounded-2xl shadow-sm">
              <div className="flex items-center gap-1 text-xs text-brand-muted font-bold font-sans">
                <span className="cursor-pointer hover:text-brand-primary" onClick={() => setSelectedCourse(null)}>Curriculum</span>
                <ChevronRight className="w-3.5 h-3.5" />
                <span 
                  className="px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-wider"
                  style={{ 
                    backgroundColor: `${selectedCourse.category?.color || '#84117C'}15`, 
                    color: selectedCourse.category?.color || '#84117C',
                    border: `1px solid ${selectedCourse.category?.color || '#84117C'}25`
                  }}
                >
                  {selectedCourse.category?.name || 'Dev'}
                </span>
                <ChevronRight className="w-3.5 h-3.5" />
                <span className="cursor-pointer hover:text-brand-primary" onClick={() => setSelectedSubmodule(null)}>{selectedCourse.title}</span>
                {selectedModule && (
                  <>
                    <ChevronRight className="w-3.5 h-3.5" />
                    <span className="cursor-pointer hover:text-brand-primary" onClick={() => setSelectedSubmodule(null)}>{selectedModule.title}</span>
                  </>
                )}
                <ChevronRight className="w-3.5 h-3.5" />
                <span className="text-[#84117C] font-extrabold">{selectedSubmodule.title}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] text-brand-muted font-bold flex items-center gap-1"><Check className="w-3.5 h-3.5 text-emerald-500" /> All changes saved</span>
                <div className="w-6 h-6 rounded-full bg-[#84117C] text-white flex items-center justify-center text-[10px] font-black uppercase">A</div>
              </div>
            </div>

            {/* Title Header area */}
            <div className="flex justify-between items-center bg-white/60 border border-white/60 p-4 rounded-2xl shadow-sm">
              <div className="flex flex-col text-left">
                <h2 className="text-lg font-black text-brand-primaryDark flex items-center gap-2">
                  <span className="text-base">📝</span> {selectedSubmodule.title}
                </h2>
                <span className="text-[10px] text-brand-muted font-bold mt-0.5">
                  slug: <b className="text-brand-primaryDark font-mono">/{selectedSubmodule.slug}</b> &nbsp;•&nbsp; Status: <span className={selectedSubmodule.isActive ? 'text-emerald-600' : 'text-slate-500'}>{selectedSubmodule.isActive ? 'Active' : 'Inactive'}</span>
                </span>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setSelectedSubmodule(null)}
                  className="px-4 py-2.5 rounded-xl border border-[#E2E4F0] text-brand-muted text-xs font-bold hover:bg-white/40 transition-colors"
                >
                  Back
                </button>
                <button
                  onClick={handleSaveBlocks}
                  className="px-5 py-2.5 rounded-xl text-white bg-[#01AC9F] hover:bg-[#01AC9F]/90 shadow-md hover:shadow-lg transition-all flex items-center gap-1.5"
                >
                  <Save className="w-3.5 h-3.5" /> Save ({blocks.length})
                </button>
              </div>
            </div>

            {/* Current Blocks list (collapsed accordion rows) */}
            <div className="glass-panel p-5 rounded-3xl border border-white/60 shadow-glass flex flex-col gap-3 bg-white/75">
              <span className="text-[10px] font-black uppercase text-brand-muted tracking-wider block text-left">Lesson Content Blocks ({blocks.length})</span>
              
              <div className="flex flex-col gap-2">
                {blocks.length === 0 ? (
                  <span className="text-xs text-brand-muted italic py-6 text-center">No blocks created yet. Add one below!</span>
                ) : (
                  blocks.map((block, idx) => {
                    const blockPillColors = 
                      block.type === 'heading' ? 'bg-purple-100 text-purple-700' :
                      block.type === 'text' ? 'bg-teal-100 text-teal-700' :
                      block.type === 'callout' ? 'bg-[#FF6200]/10 text-[#FF6200]' :
                      block.type === 'code' ? 'bg-indigo-100 text-indigo-700' :
                      block.type === 'image' ? 'bg-cyan-100 text-cyan-700' :
                      block.type === 'video' ? 'bg-orange-100 text-orange-700' :
                      'bg-slate-100 text-slate-700';

                    let summary = '';
                    if (block.type === 'heading') summary = block.title || '';
                    else if (block.type === 'text') summary = block.text || '';
                    else if (block.type === 'callout') summary = block.title ? `${block.title}: ${block.text}` : (block.text || '');
                    else if (block.type === 'code') summary = block.code || '';
                    else if (block.type === 'image') summary = block.imageUrl || '';
                    else if (block.type === 'video') summary = block.videoUrl || '';
                    else if (block.type === 'table') summary = block.text || '';

                    return (
                      <div 
                        key={block.id}
                        className="flex justify-between items-center p-3 rounded-xl border border-[#E2E4F0]/60 bg-white/50 shadow-sm"
                      >
                        <div className="flex items-center gap-3 overflow-hidden">
                          {userRole !== 'student' && <span className="text-brand-muted font-bold cursor-grab">::</span>}
                          <span className={`px-2.5 py-0.5 rounded text-[9px] font-black uppercase tracking-wider ${blockPillColors}`}>
                            {block.type}
                          </span>
                          <span className="text-xs font-semibold text-brand-primaryDark truncate max-w-[400px]">
                            {summary || <span className="text-brand-muted italic">No content</span>}
                          </span>
                        </div>
                        
                        <div className="flex items-center gap-3">
                          <label className={`relative inline-flex items-center select-none ${userRole === 'student' ? 'cursor-default' : 'cursor-pointer'}`}>
                            <input 
                              type="checkbox" 
                              disabled={userRole === 'student'}
                              checked={block.isActive ?? true} 
                              onChange={(e) => handleBlockChange(idx, { isActive: e.target.checked })} 
                              className="sr-only switch-input" 
                            />
                            <div className="w-9 h-5 bg-[#E2E4F0] border border-[#E2E4F0] rounded-full switch-bg transition-colors duration-200"></div>
                            <div className="absolute left-0.5 top-0.5 w-4 h-4 bg-white rounded-full switch-dot transition-transform duration-200 shadow-sm"></div>
                          </label>
                          <button 
                            type="button"
                            onClick={() => {
                              const el = document.getElementById(`block-${block.id}`);
                              if (el) el.scrollIntoView({ behavior: 'smooth' });
                            }}
                            className="p-1 text-brand-muted hover:text-brand-primary"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          {userRole !== 'student' && (
                            <button 
                              type="button" 
                              onClick={() => handleDeleteBlock(block.id)}
                              className="p-1 text-red-500 hover:text-red-700"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>

            {/* Special Add Content Block form card */}
            {userRole !== 'student' && (
              <div className="glass-panel p-6 md:p-8 rounded-3xl border border-white/60 shadow-glass flex flex-col gap-6 border-t-4 border-t-[#84117C] bg-white/70 text-left">
              <h3 className="text-base font-black text-brand-primaryDark border-b border-[#E2E4F0]/60 pb-2 flex items-center gap-2">
                <Plus className="w-4.5 h-4.5 text-[#84117C]" /> Add Content Block
              </h3>

              {/* Block type selector buttons row */}
              <div className="flex flex-col gap-2">
                <span className="text-[10px] font-black uppercase text-brand-muted tracking-wider block">BLOCK TYPE</span>
                <div className="flex flex-wrap items-center gap-2">
                  {(['text', 'code', 'video', 'image', 'heading', 'callout', 'table'] as const).map((type) => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => setNewBlockType(type)}
                      className={`px-4 py-2 rounded-xl text-xs font-bold tracking-wide transition-all shadow-sm border ${
                        newBlockType === type
                          ? 'bg-[#84117C] text-white border-[#84117C]'
                          : 'bg-white hover:bg-[#E2E4F0]/20 text-brand-primaryDark border-[#E2E4F0]'
                      }`}
                    >
                      {type === 'heading' ? 'Heading' : type === 'text' ? 'Text' : type === 'callout' ? 'Callout' : type === 'code' ? 'Code' : type === 'image' ? 'Image' : type === 'video' ? 'Video' : 'Table'}
                    </button>
                  ))}
                </div>
              </div>

              {/* Input fields based on selected type */}
              <div className="border-t border-[#E2E4F0]/40 pt-4 flex flex-col gap-4">
                {newBlockType === 'heading' && (
                  <div className="flex flex-col gap-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="flex flex-col gap-1.5 sm:col-span-2">
                        <label className="text-xs font-extrabold text-brand-primaryDark">Heading Text</label>
                        <input
                          type="text"
                          placeholder="Enter heading..."
                          value={newBlockTitle}
                          onChange={(e) => setNewBlockTitle(e.target.value)}
                          className="px-4 py-3 rounded-xl text-xs font-semibold glass-input outline-none"
                        />
                      </div>
                      
                      <div className="flex flex-col gap-2 sm:col-span-2">
                        <label className="text-xs font-extrabold text-brand-primaryDark">headingLevel</label>
                        <div className="flex items-center gap-2">
                          {[1, 2, 3, 4, 5, 6].map((l) => (
                            <button
                              key={l}
                              type="button"
                              onClick={() => setNewBlockHeadingLevel(l)}
                              className={`w-8 h-8 rounded-full text-xs font-black flex items-center justify-center border transition-all ${
                                newBlockHeadingLevel === l
                                  ? 'bg-[#84117C] text-white border-[#84117C] shadow-sm'
                                  : 'bg-white hover:bg-slate-50 text-brand-primaryDark border-[#E2E4F0]'
                              }`}
                            >
                              H{l}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Heading preview box */}
                    <div className="flex flex-col gap-1.5 mt-2">
                      <span className="text-[9px] font-black uppercase text-brand-muted tracking-wider block">PREVIEW</span>
                      <div className="bg-white/40 border border-[#E2E4F0]/40 p-4 rounded-xl shadow-sm text-left">
                        <span className={`font-black text-brand-primaryDark block ${
                          newBlockHeadingLevel === 1 ? 'text-lg' :
                          newBlockHeadingLevel === 2 ? 'text-base' :
                          newBlockHeadingLevel === 3 ? 'text-sm' :
                          'text-xs'
                        }`}>
                          {newBlockTitle || 'Your Heading Here'}
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                {newBlockType === 'text' && (
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-extrabold text-brand-primaryDark">Text Paragraph</label>
                    <textarea
                      rows={4}
                      placeholder="Enter text content..."
                      value={newBlockText}
                      onChange={(e) => setNewBlockText(e.target.value)}
                      className="px-4 py-3 rounded-xl text-xs font-semibold glass-input outline-none resize-none"
                    />
                  </div>
                )}

                {newBlockType === 'code' && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1.5 sm:col-span-2">
                      <div className="flex justify-between items-center">
                        <label className="text-xs font-extrabold text-brand-primaryDark">Code Editor</label>
                        <div className="flex items-center gap-2">
                          <label className="text-[10px] font-extrabold text-brand-primaryDark">language</label>
                          <select
                            value={newBlockLanguage}
                            onChange={(e) => setNewBlockLanguage(e.target.value)}
                            className="px-3 py-1.5 rounded-lg text-[10px] font-bold bg-white border border-[#E2E4F0] outline-none"
                          >
                            <option value="java">java</option>
                            <option value="javascript">javascript</option>
                            <option value="python">python</option>
                            <option value="html">html</option>
                            <option value="css">css</option>
                            <option value="typescript">typescript</option>
                          </select>
                        </div>
                      </div>
                      <textarea
                        rows={5}
                        placeholder="// Paste your code here..."
                        value={newBlockCode}
                        onChange={(e) => setNewBlockCode(e.target.value)}
                        className="px-4 py-3 rounded-xl text-xs font-semibold glass-input outline-none font-mono resize-none bg-zinc-900 text-zinc-200"
                      />
                    </div>
                  </div>
                )}

                {newBlockType === 'video' && (
                  <div className="flex flex-col gap-4">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-extrabold text-brand-primaryDark">videoUrl *</label>
                      <input
                        type="text"
                        placeholder="https://youtube.com/embed/..."
                        value={newBlockVideoUrl}
                        onChange={(e) => setNewBlockVideoUrl(e.target.value)}
                        className="px-4 py-3 rounded-xl text-xs font-semibold glass-input outline-none font-mono"
                      />
                    </div>
                    {/* Simulated video placeholder */}
                    <div className="aspect-[16/9] max-w-sm rounded-2xl bg-slate-100 border border-[#E2E4F0]/60 flex flex-col items-center justify-center gap-1.5 text-brand-muted text-[10px] font-bold p-4">
                      <span className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-xs">📹</span>
                      Video preview will appear here
                    </div>
                  </div>
                )}

                {newBlockType === 'image' && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1.5 sm:col-span-2">
                      <label className="text-xs font-extrabold text-brand-primaryDark">imageUrl *</label>
                      <input
                        type="text"
                        placeholder="https://example.com/image.png"
                        value={newBlockImageUrl}
                        onChange={(e) => setNewBlockImageUrl(e.target.value)}
                        className="px-4 py-3 rounded-xl text-xs font-semibold glass-input outline-none font-mono"
                      />
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-extrabold text-brand-primaryDark">alt</label>
                      <input
                        type="text"
                        placeholder="Alt text describing image..."
                        value={newBlockAlt}
                        onChange={(e) => setNewBlockAlt(e.target.value)}
                        className="px-4 py-3 rounded-xl text-xs font-semibold glass-input outline-none"
                      />
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-extrabold text-brand-primaryDark">caption</label>
                      <input
                        type="text"
                        placeholder="Caption description..."
                        value={newBlockCaption}
                        onChange={(e) => setNewBlockCaption(e.target.value)}
                        className="px-4 py-3 rounded-xl text-xs font-semibold glass-input outline-none"
                      />
                    </div>
                  </div>
                )}

                {newBlockType === 'callout' && (
                  <div className="flex flex-col gap-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-extrabold text-brand-primaryDark">title</label>
                        <input
                          type="text"
                          placeholder="e.g. Pro Tip"
                          value={newBlockTitle}
                          onChange={(e) => setNewBlockTitle(e.target.value)}
                          className="px-4 py-3 rounded-xl text-xs font-semibold glass-input outline-none"
                        />
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-extrabold text-brand-primaryDark">text</label>
                        <input
                          type="text"
                          placeholder="Callout body text..."
                          value={newBlockText}
                          onChange={(e) => setNewBlockText(e.target.value)}
                          className="px-4 py-3 rounded-xl text-xs font-semibold glass-input outline-none"
                        />
                      </div>
                    </div>

                    {/* Callout preview */}
                    <div className="bg-amber-50/50 border border-amber-200/50 p-4 rounded-xl flex items-start gap-2.5 shadow-sm text-left">
                      <span className="text-lg">💡</span>
                      <div className="flex flex-col">
                        <span className="text-xs font-black text-amber-800">{newBlockTitle || 'Pro Tip'}</span>
                        <span className="text-[11px] text-amber-700/90 font-medium leading-relaxed mt-0.5">
                          {newBlockText || 'Your callout body text will appear here.'}
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                {newBlockType === 'table' && (
                  <div className="flex flex-col gap-3">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-extrabold text-brand-primaryDark">text</label>
                      <textarea
                        rows={4}
                        placeholder="| Column A | Column B | Column C |&#10;| Value 1  | Value 2  | Value 3  |"
                        value={newBlockText}
                        onChange={(e) => setNewBlockText(e.target.value)}
                        className="px-4 py-3 rounded-xl text-xs font-semibold glass-input outline-none font-mono resize-none bg-slate-50 text-brand-primaryDark"
                      />
                      <span className="text-[10px] text-brand-muted font-semibold mt-0.5">Format as Markdown or CSV table.</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Add Block Footer row */}
              <div className="grid grid-cols-2 gap-4 border-t border-[#E2E4F0]/40 pt-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-extrabold text-brand-primaryDark">contentOrder</label>
                  <input
                    type="number"
                    value={newBlockOrder}
                    onChange={(e) => setNewBlockOrder(parseInt(e.target.value) || 1)}
                    className="px-4 py-3 rounded-xl text-xs font-semibold glass-input outline-none max-w-[120px]"
                  />
                </div>
                <div className="flex items-center justify-between mt-6">
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-extrabold text-brand-primaryDark">isActive</span>
                    <label className="relative inline-flex items-center cursor-pointer select-none">
                      <input type="checkbox" checked={newBlockActive} onChange={(e) => setNewBlockActive(e.target.checked)} className="sr-only switch-input" />
                      <div className="w-9 h-5 bg-[#E2E4F0] border border-[#E2E4F0] rounded-full switch-bg transition-colors duration-200"></div>
                      <div className="absolute left-0.5 top-0.5 w-4 h-4 bg-white rounded-full switch-dot transition-transform duration-200 shadow-sm"></div>
                    </label>
                  </div>
                  
                  <button
                    type="button"
                    onClick={() => {
                      const newBlock: Content = {
                        id: Date.now(),
                        type: newBlockType,
                        isActive: newBlockActive,
                        contentOrder: newBlockOrder,
                        title: newBlockTitle,
                        text: newBlockText,
                        code: newBlockCode,
                        language: newBlockLanguage,
                        videoUrl: newBlockVideoUrl,
                        imageUrl: newBlockImageUrl,
                        alt: newBlockAlt,
                        caption: newBlockCaption,
                        headingLevel: newBlockHeadingLevel
                      };
                      setBlocks([...blocks, newBlock]);
                      // Clear
                      setNewBlockTitle('');
                      setNewBlockText('');
                      setNewBlockCode('');
                      setNewBlockVideoUrl('');
                      setNewBlockImageUrl('');
                      setNewBlockAlt('');
                      setNewBlockCaption('');
                      setNewBlockOrder(blocks.length + 2);
                      showToast('New block added to stack.');
                    }}
                    className="px-5 py-2.5 rounded-xl text-white bg-[#01AC9F] hover:bg-[#01AC9F]/90 shadow-md hover:shadow-lg transition-all font-black text-xs"
                  >
                    + Add Block
                  </button>
                </div>
              </div>
            </div>
            )}

            {/* STACK OF CURRENT BLOCKS card editors */}
            <div className="flex flex-col gap-6 mt-2">
              {blocks.map((block, idx) => {
                const borderColors = 
                  block.type === 'heading' ? 'border-t-[#84117C]' :
                  block.type === 'text' ? 'border-t-[#01AC9F]' :
                  block.type === 'callout' ? 'border-t-[#FF6200]' :
                  block.type === 'code' ? 'border-t-indigo-600' :
                  block.type === 'image' ? 'border-t-cyan-500' :
                  block.type === 'video' ? 'border-t-orange-500' :
                  'border-t-slate-500';

                return (
                  <div 
                    id={`block-${block.id}`}
                    key={block.id}
                    className={`glass-panel p-6 md:p-8 rounded-3xl border border-white/60 shadow-glass flex flex-col gap-5 border-t-4 ${borderColors} bg-white/70 text-left`}
                  >
                    <div className="flex justify-between items-center border-b border-[#E2E4F0]/60 pb-2">
                      <h4 className="text-sm font-black text-brand-primaryDark capitalize">
                        {block.type} Block {userRole === 'student' && <span className="text-[10px] text-brand-muted font-bold italic ml-2">Read Only</span>}
                      </h4>
                      {userRole !== 'student' && (
                        <button 
                          type="button" 
                          onClick={() => handleDeleteBlock(block.id)}
                          className="text-red-500 hover:text-red-700 text-xs font-bold"
                        >
                          Delete
                        </button>
                      )}
                    </div>

                    <div className={`flex flex-col gap-4 ${userRole === 'student' ? 'pointer-events-none select-none opacity-90' : ''}`}>
                      {block.type === 'heading' && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div className="flex flex-col gap-1.5 sm:col-span-2">
                            <label className="text-xs font-extrabold text-brand-primaryDark">Heading Text</label>
                            <input
                              type="text"
                              value={block.title || ''}
                              onChange={(e) => handleBlockChange(idx, { title: e.target.value })}
                              className="px-4 py-3 rounded-xl text-xs font-semibold glass-input outline-none"
                            />
                          </div>
                          
                          <div className="flex flex-col gap-2 sm:col-span-2">
                            <label className="text-xs font-extrabold text-brand-primaryDark">headingLevel</label>
                            <div className="flex items-center gap-2">
                              {[1, 2, 3, 4, 5, 6].map((l) => (
                                <button
                                  key={l}
                                  type="button"
                                  onClick={() => handleBlockChange(idx, { headingLevel: l })}
                                  className={`w-8 h-8 rounded-full text-xs font-black flex items-center justify-center border transition-all ${
                                    block.headingLevel === l
                                      ? 'bg-[#84117C] text-white border-[#84117C] shadow-sm'
                                      : 'bg-white hover:bg-slate-50 text-brand-primaryDark border-[#E2E4F0]'
                                  }`}
                                >
                                  H{l}
                                </button>
                              ))}
                            </div>
                          </div>
                        </div>
                      )}

                      {block.type === 'text' && (
                        <div className="flex flex-col gap-1.5">
                          <label className="text-xs font-extrabold text-brand-primaryDark">Text Paragraph</label>
                          <textarea
                            rows={4}
                            value={block.text || ''}
                            onChange={(e) => handleBlockChange(idx, { text: e.target.value })}
                            className="px-4 py-3 rounded-xl text-xs font-semibold glass-input outline-none resize-none"
                          />
                        </div>
                      )}

                      {block.type === 'code' && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div className="flex flex-col gap-1.5 sm:col-span-2">
                            <div className="flex justify-between items-center">
                              <label className="text-xs font-extrabold text-brand-primaryDark">Code Editor</label>
                              <div className="flex items-center gap-2">
                                <label className="text-[10px] font-extrabold text-brand-primaryDark">language</label>
                                <select
                                  value={block.language || 'java'}
                                  onChange={(e) => handleBlockChange(idx, { language: e.target.value })}
                                  className="px-3 py-1.5 rounded-lg text-[10px] font-bold bg-white border border-[#E2E4F0] outline-none"
                                >
                                  <option value="java">java</option>
                                  <option value="javascript">javascript</option>
                                  <option value="python">python</option>
                                  <option value="html">html</option>
                                  <option value="css">css</option>
                                  <option value="typescript">typescript</option>
                                </select>
                              </div>
                            </div>
                            <textarea
                              rows={5}
                              value={block.code || ''}
                              onChange={(e) => handleBlockChange(idx, { code: e.target.value })}
                              className="px-4 py-3 rounded-xl text-xs font-semibold glass-input outline-none font-mono resize-none bg-zinc-900 text-zinc-200"
                            />
                          </div>
                        </div>
                      )}

                      {block.type === 'video' && (
                        <div className="flex flex-col gap-4">
                          <div className="flex flex-col gap-1.5">
                            <label className="text-xs font-extrabold text-brand-primaryDark">videoUrl *</label>
                            <input
                              type="text"
                              value={block.videoUrl || ''}
                              onChange={(e) => handleBlockChange(idx, { videoUrl: e.target.value })}
                              className="px-4 py-3 rounded-xl text-xs font-semibold glass-input outline-none font-mono"
                            />
                          </div>
                        </div>
                      )}

                      {block.type === 'image' && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div className="flex flex-col gap-1.5 sm:col-span-2">
                            <label className="text-xs font-extrabold text-brand-primaryDark">imageUrl *</label>
                            <input
                              type="text"
                              value={block.imageUrl || ''}
                              onChange={(e) => handleBlockChange(idx, { imageUrl: e.target.value })}
                              className="px-4 py-3 rounded-xl text-xs font-semibold glass-input outline-none font-mono"
                            />
                          </div>

                          <div className="flex flex-col gap-1.5">
                            <label className="text-xs font-extrabold text-brand-primaryDark">alt</label>
                            <input
                              type="text"
                              value={block.alt || ''}
                              onChange={(e) => handleBlockChange(idx, { alt: e.target.value })}
                              className="px-4 py-3 rounded-xl text-xs font-semibold glass-input outline-none"
                            />
                          </div>

                          <div className="flex flex-col gap-1.5">
                            <label className="text-xs font-extrabold text-brand-primaryDark">caption</label>
                            <input
                              type="text"
                              value={block.caption || ''}
                              onChange={(e) => handleBlockChange(idx, { caption: e.target.value })}
                              className="px-4 py-3 rounded-xl text-xs font-semibold glass-input outline-none"
                            />
                          </div>
                        </div>
                      )}

                      {block.type === 'callout' && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div className="flex flex-col gap-1.5">
                            <label className="text-xs font-extrabold text-brand-primaryDark">title</label>
                            <input
                              type="text"
                              value={block.title || ''}
                              onChange={(e) => handleBlockChange(idx, { title: e.target.value })}
                              className="px-4 py-3 rounded-xl text-xs font-semibold glass-input outline-none"
                            />
                          </div>
                          <div className="flex flex-col gap-1.5">
                            <label className="text-xs font-extrabold text-brand-primaryDark">text</label>
                            <input
                              type="text"
                              value={block.text || ''}
                              onChange={(e) => handleBlockChange(idx, { text: e.target.value })}
                              className="px-4 py-3 rounded-xl text-xs font-semibold glass-input outline-none"
                            />
                          </div>
                        </div>
                      )}

                      {block.type === 'table' && (
                        <div className="flex flex-col gap-1.5">
                          <label className="text-xs font-extrabold text-brand-primaryDark">text</label>
                          <textarea
                            rows={4}
                            value={block.text || ''}
                            onChange={(e) => handleBlockChange(idx, { text: e.target.value })}
                            className="px-4 py-3 rounded-xl text-xs font-semibold glass-input outline-none font-mono resize-none bg-slate-50 text-brand-primaryDark"
                          />
                        </div>
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-4 border-t border-[#E2E4F0]/40 pt-4">
                      <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-extrabold text-brand-primaryDark">contentOrder</label>
                        <input
                          type="number"
                          value={block.contentOrder || 1}
                          onChange={(e) => handleBlockChange(idx, { contentOrder: parseInt(e.target.value) || 1 })}
                          className="px-4 py-3 rounded-xl text-xs font-semibold glass-input outline-none max-w-[120px]"
                        />
                      </div>
                      <div className="flex items-center justify-between mt-6">
                        <div className="flex items-center gap-3 ml-auto">
                          <span className="text-xs font-extrabold text-brand-primaryDark">isActive</span>
                          <label className="relative inline-flex items-center cursor-pointer select-none">
                            <input 
                              type="checkbox" 
                              checked={block.isActive ?? true} 
                              onChange={(e) => handleBlockChange(idx, { isActive: e.target.checked })} 
                              className="sr-only switch-input" 
                            />
                            <div className="w-9 h-5 bg-[#E2E4F0] border border-[#E2E4F0] rounded-full switch-bg transition-colors duration-200"></div>
                            <div className="absolute left-0.5 top-0.5 w-4 h-4 bg-white rounded-full switch-dot transition-transform duration-200 shadow-sm"></div>
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
