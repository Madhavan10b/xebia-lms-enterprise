import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search,
  Bell,
  Settings as SettingsIcon,
  Download,
  Plus,
  Trash2,
  Eye,
  X,
  FileText,
  FolderOpen,
  Upload,
  BookOpen,
  Filter,
  CheckCircle,
  FileCode,
  FileArchive
} from 'lucide-react';
import { useToast } from '../context/ToastContext';

interface ReferenceMaterial {
  id: number;
  title: string;
  filename: string;
  fileSize: string;
  fileType: 'pdf' | 'code' | 'zip';
  category: 'slides' | 'cheatsheets' | 'guides' | 'source';
  batchCode: string;
  subject: string;
  uploadDate: string;
  description: string;
  mockContent: string;
}

export const MaterialsPage: React.FC = () => {
  const { showToast } = useToast();

  const userRole = useMemo(() => {
    const saved = localStorage.getItem('currentUser');
    return saved ? JSON.parse(saved).role : 'admin';
  }, []);

  // Selected folder category in left sidebar
  const [activeFolder, setActiveFolder] = useState<string>('all');
  
  // Search state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBatchFilter, setSelectedBatchFilter] = useState('all');

  // Modals state
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [previewMaterial, setPreviewMaterial] = useState<ReferenceMaterial | null>(null);

  // Form states for Upload
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState<'slides' | 'cheatsheets' | 'guides' | 'source'>('slides');
  const [newBatch, setNewBatch] = useState('BATCH A');
  const [newSubject, setNewSubject] = useState('UI/UX Design');
  const [newDescription, setNewDescription] = useState('');
  const [newFilename, setNewFilename] = useState('');

  // Initial Reference Materials Database
  const initialMaterials: ReferenceMaterial[] = [
    {
      id: 1,
      title: 'Typography and Color Theory Guide',
      filename: 'typography_and_color_theory_v1.pdf',
      fileSize: '4.5 MB',
      fileType: 'pdf',
      category: 'slides',
      batchCode: 'BATCH A',
      subject: 'UI/UX Design',
      uploadDate: '10/7/2026',
      description: 'Comprehensive guidelines on typographical scales, font combinations, and color harmony systems.',
      mockContent: `=== TYPOGRAPHY & COLOR THEORY GUIDE ===
1. Typographical Scale rules:
   - Heading 1: 32px (Bold)
   - Heading 2: 24px (Semi-Bold)
   - Body Text: 16px (Regular)
2. Font Combinations:
   - Primary: Outfit (Modern Sans)
   - Secondary: Inter (Neutral Body)
3. Color Harmony systems:
   - Primary Color: Deep Purple (#6C1D5F)
   - Accent CTA: Pinkish Rose (#C83E78)
   - Success Green: Teal (#02A194)`
    },
    {
      id: 2,
      title: 'Next.js 15 App Router Reference Cheatsheet',
      filename: 'nextjs15_cheatsheet.pdf',
      fileSize: '850 KB',
      fileType: 'pdf',
      category: 'cheatsheets',
      batchCode: 'BATCH B',
      subject: 'Front-end Development',
      uploadDate: '12/7/2026',
      description: 'Quick reference sheet mapping Next.js 15 routing parameters, server vs client hooks, and metadata options.',
      mockContent: `=== NEXT.JS 15 APP ROUTER REFERENCE ===
- File Routing hierarchy:
  - app/page.tsx -> Home Page
  - app/layout.tsx -> Layout Wrapper
  - app/loading.tsx -> Loading fallback
- Hooks mapping:
  - 'use client' required for: useState, useEffect, usePathname
  - Default is Server Component (Direct DB calls, async fetch)`
    },
    {
      id: 3,
      title: 'Database Schema Normalization Exercise',
      filename: 'schema_normalization_exercise.pdf',
      fileSize: '1.2 MB',
      fileType: 'pdf',
      category: 'guides',
      batchCode: 'BATCH B',
      subject: 'Back-end Development',
      uploadDate: '11/7/2026',
      description: 'Step-by-step tutorial on translating raw transaction files into 1NF, 2NF, and 3NF relational schemas.',
      mockContent: `=== SCHEMA NORMALIZATION EXERCISE ===
Problem: Normalize [StudentID, Name, Email, CourseID, CourseTitle, Grade]
1. First Normal Form (1NF): Ensure atomic values.
2. Second Normal Form (2NF): Remove partial dependencies (map to CourseID -> CourseTitle table).
3. Third Normal Form (3NF): Remove transitive dependencies.`
    },
    {
      id: 4,
      title: 'Redux State Management Boilerplate',
      filename: 'redux_toolkit_boilerplate.zip',
      fileSize: '3.1 MB',
      fileType: 'zip',
      category: 'source',
      batchCode: 'BATCH C',
      subject: 'Front-end Development',
      uploadDate: '13/7/2026',
      description: 'Boilerplate configuration folder containing Redux Toolkit slice templates, store exports, and hooks hooks.',
      mockContent: `=== REDUX RTK BOILERPLATE CONFIG ===
Files:
- store/index.ts (configureStore setup)
- store/slices/authSlice.ts (Authentication slice)
- store/hooks.ts (useAppDispatch, useAppSelector wrappers)`
    }
  ];

  // Persistent state
  const [materials, setMaterials] = useState<ReferenceMaterial[]>(() => {
    const saved = localStorage.getItem('xebia_lms_materials');
    return saved ? JSON.parse(saved) : initialMaterials;
  });

  // Folder Category configurations
  const foldersList = [
    { label: 'All Documents', value: 'all', count: materials.length },
    { label: 'Slide Decks', value: 'slides', count: materials.filter(m => m.category === 'slides').length },
    { label: 'Cheat Sheets', value: 'cheatsheets', count: materials.filter(m => m.category === 'cheatsheets').length },
    { label: 'Exercise Guides', value: 'guides', count: materials.filter(m => m.category === 'guides').length },
    { label: 'Source Templates', value: 'source', count: materials.filter(m => m.category === 'source').length }
  ];

  // Filtered materials grid
  const filteredMaterials = useMemo(() => {
    return materials.filter(item => {
      // 1. Sidebar Folder Filter
      if (activeFolder !== 'all' && item.category !== activeFolder) return false;
      // 2. Batch Filter
      if (selectedBatchFilter !== 'all' && item.batchCode !== selectedBatchFilter) return false;
      // 3. Search Query
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesTitle = item.title.toLowerCase().includes(query);
        const matchesFilename = item.filename.toLowerCase().includes(query);
        const matchesDesc = item.description.toLowerCase().includes(query);
        if (!matchesTitle && !matchesFilename && !matchesDesc) return false;
      }
      return true;
    });
  }, [materials, activeFolder, selectedBatchFilter, searchQuery]);

  // Handle mock file upload
  const handleUploadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newFilename.trim()) {
      showToast('Please enter a document title and upload a file.');
      return;
    }

    const mockExt = newFilename.split('.').pop()?.toLowerCase();
    const type: 'pdf' | 'code' | 'zip' = 
      mockExt === 'zip' || mockExt === 'rar' ? 'zip' :
      mockExt === 'js' || mockExt === 'ts' || mockExt === 'java' || mockExt === 'sql' ? 'code' : 'pdf';

    const newItem: ReferenceMaterial = {
      id: Date.now(),
      title: newTitle.trim(),
      filename: newFilename.trim(),
      fileSize: '1.2 MB', // Mocked size
      fileType: type,
      category: newCategory,
      batchCode: newBatch,
      subject: newSubject,
      uploadDate: new Date().toLocaleDateString('en-GB'),
      description: newDescription.trim() || 'No description provided.',
      mockContent: `=== ${newTitle.toUpperCase()} ===\nUploaded reference materials. File: ${newFilename}`
    };

    const updated = [newItem, ...materials];
    setMaterials(updated);
    localStorage.setItem('xebia_lms_materials', JSON.stringify(updated));

    // Clear form
    setNewTitle('');
    setNewFilename('');
    setNewDescription('');
    setIsUploadOpen(false);
    showToast(`Successfully uploaded ${newItem.title}!`);
  };

  // Handle Delete
  const handleDeleteClick = (id: number, title: string) => {
    const updated = materials.filter(m => m.id !== id);
    setMaterials(updated);
    localStorage.setItem('xebia_lms_materials', JSON.stringify(updated));
    showToast(`Removed reference material: ${title}`);
  };

  const handleDownload = (filename: string) => {
    showToast(`Downloading file: ${filename}...`);
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
            placeholder="Search classes, materials, files..." 
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
            <SettingsIcon className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Directory Split Layout (DIFFERENT POSITIONS AND DIRECTORY STRUCTURE FROM REFERENCE GRID) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        
        {/* Left Directory Categories Panel (1/3 width) */}
        <div className="lg:col-span-1 flex flex-col gap-4 bg-white border border-neutral-200/50 p-5 rounded-3xl shadow-sm text-left">
          <h4 className="text-xs font-black text-brand-primaryDark uppercase tracking-wider flex items-center gap-1.5 border-b border-neutral-100 pb-3">
            <FolderOpen className="w-4 h-4" /> Material Categories
          </h4>
          <div className="flex flex-col gap-1.5">
            {foldersList.map((folder, i) => {
              const isFolderActive = activeFolder === folder.value;
              return (
                <button
                  key={i}
                  onClick={() => setActiveFolder(folder.value)}
                  className={`w-full p-2.5 rounded-xl text-xs font-extrabold flex items-center justify-between transition-all ${
                    isFolderActive
                      ? 'bg-brand-primary/10 text-brand-primary shadow-xs'
                      : 'text-neutral-500 hover:bg-neutral-50'
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <BookOpen className="w-4 h-4 opacity-80" />
                    {folder.label}
                  </span>
                  <span className={`text-[10px] px-2 py-0.5 rounded-md font-black ${
                    isFolderActive ? 'bg-brand-primary/20 text-brand-primary' : 'bg-neutral-100 text-neutral-400'
                  }`}>
                    {folder.count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Catalog Grid Area (2/3 width) */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          
          {/* Welcome and Action Controls */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-left">
            <div>
              <h2 className="text-xl md:text-2xl font-black text-brand-primaryDark tracking-tight">
                Course Reference Materials
              </h2>
              <p className="text-brand-muted text-xs md:text-sm leading-relaxed mt-0.5">
                Share PDF slide decks, cheat sheets, or exercise guides with enrolled batches.
              </p>
            </div>
            {userRole !== 'student' && (
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setIsUploadOpen(true)}
                className="bg-brand-primary hover:bg-brand-primaryDark text-white font-extrabold text-xs px-4.5 py-3 rounded-xl flex items-center gap-2 shadow-sm transition-all shrink-0"
              >
                <Plus className="w-4 h-4" /> Upload Study Material
              </motion.button>
            )}
          </div>

          {/* Search and Filters panel */}
          <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center bg-white border border-neutral-200/60 p-3 rounded-2xl shadow-xs">
            <div className="relative flex-grow">
              <input
                type="text"
                placeholder="Search documents by topic, title, or filename..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-neutral-50 border border-neutral-200 rounded-xl py-2 pl-9 pr-3 text-xs font-semibold text-neutral-800 placeholder-neutral-400 outline-none focus:bg-white focus:border-brand-primary/30 transition-all"
              />
              <Search className="w-3.5 h-3.5 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
            </div>
            
            <select
              value={selectedBatchFilter}
              onChange={(e) => setSelectedBatchFilter(e.target.value)}
              className="bg-neutral-50 border border-neutral-200 rounded-xl py-2 px-3 text-xs font-bold text-neutral-700 outline-none cursor-pointer"
            >
              <option value="all">All Batches</option>
              <option value="BATCH A">Batch A</option>
              <option value="BATCH B">Batch B</option>
              <option value="BATCH C">Batch C</option>
            </select>
          </div>

          {/* Reference Materials Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {filteredMaterials.map((mat) => (
              <motion.div
                layout
                key={mat.id}
                className="bg-white border border-neutral-200/65 rounded-3xl p-5 shadow-xs relative flex flex-col justify-between text-left hover:shadow-md hover:border-brand-primary/15 transition-all duration-200"
              >
                {/* Trash delete button in top right */}
                {userRole !== 'student' && (
                  <button
                    onClick={() => handleDeleteClick(mat.id, mat.title)}
                    className="absolute top-4 right-4 p-1.5 rounded-lg text-neutral-400 hover:text-red-500 hover:bg-red-50 transition-all"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}

                {/* Card Top: File Thumbnail Symbol and Badges */}
                <div className="flex items-start gap-4">
                  {/* Extension Logo Block */}
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 font-black text-xs ${
                    mat.fileType === 'pdf' ? 'bg-red-50 text-red-500 border border-red-100' :
                    mat.fileType === 'code' ? 'bg-blue-50 text-blue-500 border border-blue-100' :
                    'bg-amber-50 text-amber-500 border border-amber-100'
                  }`}>
                    {mat.fileType.toUpperCase()}
                  </div>

                  <div className="flex-1 pr-6 text-left">
                    <div className="flex flex-wrap items-center gap-1.5">
                      <span className="text-[8px] font-black uppercase tracking-wider px-2 py-0.5 rounded border border-brand-primary/10 bg-brand-primary/5 text-brand-primary">
                        {mat.batchCode}
                      </span>
                      <span className="text-[8px] font-black uppercase tracking-wider px-2 py-0.5 rounded border border-neutral-200 text-neutral-500">
                        {mat.subject}
                      </span>
                    </div>
                    
                    <h5 className="font-extrabold text-xs text-neutral-900 mt-2 leading-snug">
                      {mat.title}
                    </h5>
                    <p className="text-[9px] text-brand-muted font-bold truncate max-w-[200px] mt-0.5">
                      File: {mat.filename}
                    </p>
                  </div>
                </div>

                {/* Description */}
                <p className="text-[10px] text-neutral-500 font-semibold leading-relaxed mt-3.5 mb-4">
                  {mat.description}
                </p>

                {/* Card Actions Bottom */}
                <div className="flex items-center justify-between border-t border-neutral-50 pt-3">
                  <span className="text-[9px] text-neutral-400 font-extrabold">
                    {mat.fileSize} • {mat.uploadDate}
                  </span>
                  
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => handleDownload(mat.filename)}
                      className="p-1.5 border border-neutral-200 hover:border-brand-primary/20 text-neutral-600 hover:text-brand-primary rounded-xl transition-all"
                    >
                      <Download className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => setPreviewMaterial(mat)}
                      className="bg-brand-primaryDark hover:bg-brand-primary text-white font-extrabold text-[10px] py-1.5 px-3 rounded-lg flex items-center gap-1 transition-all"
                    >
                      <Eye className="w-3 h-3" /> View
                    </button>
                  </div>
                </div>

              </motion.div>
            ))}

            {filteredMaterials.length === 0 && (
              <div className="sm:col-span-2 py-16 flex flex-col items-center justify-center text-center text-brand-muted bg-white border border-neutral-200/50 rounded-3xl">
                <FolderOpen className="w-10 h-10 text-neutral-300 mb-2" />
                <p className="text-xs font-bold text-brand-primaryDark">No materials found in folder</p>
                <p className="text-[10px] mt-0.5">Try searching or uploading a new file study guide.</p>
              </div>
            )}
          </div>
        </div>

      </div>

      {/* Upload study material dialog form */}
      <AnimatePresence>
        {isUploadOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-brand-primaryDark/45 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl border border-neutral-200/40 shadow-xl max-w-md w-full p-6 text-left relative overflow-hidden"
            >
              {/* Modal header */}
              <div className="flex justify-between items-start mb-5 border-b border-neutral-100 pb-3">
                <div className="text-left">
                  <h3 className="text-base font-black text-brand-primaryDark tracking-tight">
                    Upload Study Material
                  </h3>
                  <p className="text-xs text-brand-muted font-bold mt-0.5">
                    Share folders, code slices, and cheatsheets with class batches.
                  </p>
                </div>
                <button 
                  onClick={() => setIsUploadOpen(false)}
                  className="p-1 rounded-lg text-brand-muted hover:text-red-500 hover:bg-neutral-50 transition-all"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleUploadSubmit} className="flex flex-col gap-4">
                {/* Title */}
                <div className="flex flex-col gap-1 text-left">
                  <label className="text-[9px] font-black text-brand-muted uppercase tracking-wider">Document Title</label>
                  <input 
                    type="text"
                    required
                    placeholder="e.g., Typographical hierarchy guide"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    className="w-full bg-neutral-50 border border-neutral-200 focus:bg-white focus:border-brand-primary/40 rounded-xl py-2 px-3 text-xs font-semibold text-neutral-800 outline-none transition-all"
                  />
                </div>

                {/* Group Grid (Category and Batch) */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1 text-left">
                    <label className="text-[9px] font-black text-brand-muted uppercase tracking-wider">Folder Category</label>
                    <select
                      value={newCategory}
                      onChange={(e) => setNewCategory(e.target.value as any)}
                      className="w-full bg-neutral-50 border border-neutral-200 rounded-xl py-2 px-3 text-xs font-bold text-neutral-700 outline-none cursor-pointer"
                    >
                      <option value="slides">Slide Deck</option>
                      <option value="cheatsheets">Cheat Sheet</option>
                      <option value="guides">Exercise Guide</option>
                      <option value="source">Source Template</option>
                    </select>
                  </div>
                  <div className="flex flex-col gap-1 text-left">
                    <label className="text-[9px] font-black text-brand-muted uppercase tracking-wider">Target Batch</label>
                    <select
                      value={newBatch}
                      onChange={(e) => setNewBatch(e.target.value)}
                      className="w-full bg-neutral-50 border border-neutral-200 rounded-xl py-2 px-3 text-xs font-bold text-neutral-700 outline-none cursor-pointer"
                    >
                      <option value="BATCH A">Batch A</option>
                      <option value="BATCH B">Batch B</option>
                      <option value="BATCH C">Batch C</option>
                    </select>
                  </div>
                </div>

                {/* Subject Topic */}
                <div className="flex flex-col gap-1 text-left">
                  <label className="text-[9px] font-black text-brand-muted uppercase tracking-wider">Subject Topic</label>
                  <input 
                    type="text"
                    required
                    placeholder="e.g., UI/UX Design, Front-end Development"
                    value={newSubject}
                    onChange={(e) => setNewSubject(e.target.value)}
                    className="w-full bg-neutral-50 border border-neutral-200 focus:bg-white focus:border-brand-primary/40 rounded-xl py-2 px-3 text-xs font-semibold text-neutral-800 outline-none transition-all"
                  />
                </div>

                {/* Simulated file upload drag box */}
                <div className="flex flex-col gap-1.5 text-left">
                  <label className="text-[9px] font-black text-brand-muted uppercase tracking-wider">File Attachment</label>
                  {newFilename ? (
                    <div className="flex items-center justify-between border border-neutral-200 bg-neutral-50 p-2.5 rounded-xl text-xs font-semibold">
                      <span className="text-neutral-800 font-bold truncate max-w-[200px]">{newFilename}</span>
                      <button 
                        type="button" 
                        onClick={() => setNewFilename('')}
                        className="text-red-500 hover:text-red-700 font-black text-[10px] uppercase"
                      >
                        Remove
                      </button>
                    </div>
                  ) : (
                    <div className="border-2 border-dashed border-neutral-200 rounded-2xl py-6 flex flex-col items-center justify-center text-center bg-neutral-50/50 hover:bg-neutral-50 transition-all cursor-pointer relative">
                      <input 
                        type="file" 
                        className="absolute inset-0 opacity-0 cursor-pointer" 
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) setNewFilename(file.name);
                        }}
                      />
                      <Upload className="w-6 h-6 text-neutral-400 mb-1" />
                      <p className="text-[10px] font-bold text-neutral-600">Drag & drop or click to select file</p>
                      <p className="text-[8px] text-neutral-400 mt-0.5">PDF, ZIP, SQL, JS (Max size 10MB)</p>
                    </div>
                  )}
                </div>

                {/* Description */}
                <div className="flex flex-col gap-1 text-left">
                  <label className="text-[9px] font-black text-brand-muted uppercase tracking-wider">Description</label>
                  <textarea 
                    placeholder="Enter document outline or study guidelines..."
                    value={newDescription}
                    onChange={(e) => setNewDescription(e.target.value)}
                    rows={3}
                    className="w-full bg-neutral-50 border border-neutral-200 focus:bg-white focus:border-brand-primary/40 rounded-xl py-2 px-3 text-xs font-semibold text-neutral-800 outline-none resize-none transition-all"
                  />
                </div>

                {/* Action Buttons */}
                <div className="flex items-center justify-end gap-3 mt-4 border-t border-neutral-100 pt-4">
                  <button
                    type="button"
                    onClick={() => setIsUploadOpen(false)}
                    className="py-2 px-4 rounded-xl text-xs font-extrabold text-brand-muted hover:bg-neutral-100 transition-all"
                  >
                    Cancel
                  </button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    className="bg-brand-primary hover:bg-brand-primaryDark text-white font-extrabold text-xs py-2 px-5 rounded-xl transition-all shadow-sm"
                  >
                    Upload Document
                  </motion.button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Document Content Preview Modal overlay */}
      <AnimatePresence>
        {previewMaterial && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-brand-primaryDark/45 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="bg-white rounded-3xl border border-neutral-200/40 shadow-xl max-w-lg w-full p-6 text-left relative overflow-hidden"
            >
              <div className="flex justify-between items-start mb-4 border-b border-neutral-100 pb-3">
                <div className="text-left">
                  <span className="text-[8px] font-black uppercase tracking-wider px-2 py-0.5 rounded border border-brand-primary/10 bg-brand-primary/5 text-brand-primary">
                    {previewMaterial.batchCode}
                  </span>
                  <h3 className="text-base font-black text-brand-primaryDark tracking-tight mt-1.5">
                    {previewMaterial.title}
                  </h3>
                  <p className="text-xs text-brand-muted font-bold mt-0.5">
                    Topic: {previewMaterial.subject} • Size: {previewMaterial.fileSize}
                  </p>
                </div>
                <button 
                  onClick={() => setPreviewMaterial(null)}
                  className="p-1 rounded-lg text-brand-muted hover:text-red-500 hover:bg-neutral-50 transition-all"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Simulated Sheet view */}
              <div className="flex flex-col gap-4 text-left">
                <p className="text-[10px] font-black text-brand-muted uppercase tracking-wider">Document Outline & Contents</p>
                <div className="w-full bg-neutral-50 border border-neutral-200/50 rounded-2xl p-4 text-xs text-neutral-700 font-mono leading-relaxed whitespace-pre-wrap max-h-64 overflow-y-auto">
                  {previewMaterial.mockContent}
                </div>
                
                <p className="text-[10px] text-neutral-500 font-semibold leading-relaxed">
                  Description: {previewMaterial.description}
                </p>
              </div>

              <div className="flex items-center justify-end gap-3 mt-5 border-t border-neutral-100 pt-4">
                <button
                  onClick={() => setPreviewMaterial(null)}
                  className="py-2 px-4 rounded-xl text-xs font-extrabold text-brand-muted hover:bg-neutral-100 transition-all"
                >
                  Close Preview
                </button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    handleDownload(previewMaterial.filename);
                    setPreviewMaterial(null);
                  }}
                  className="bg-brand-primary hover:bg-brand-primaryDark text-white font-extrabold text-xs py-2 px-5 rounded-xl transition-all shadow-sm flex items-center gap-1.5"
                >
                  <Download className="w-4 h-4" /> Download File
                </motion.button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};
export default MaterialsPage;
