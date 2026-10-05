import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search,
  Bell,
  Settings as SettingsIcon,
  Plus,
  X,
  ClipboardList,
  Upload,
  Calendar,
  ChevronDown,
  Trash2,
  FileText,
  Clock,
  Award,
  BookOpen,
  Download,
  HelpCircle
} from 'lucide-react';
import { useToast } from '../context/ToastContext';

interface Question {
  id: number;
  text: string;
  options?: string[]; // for MCQ
  correctAnswer?: string;
}

interface Assessment {
  id: number;
  batchCode: string;
  type: 'MCQ QUIZ' | 'WRITTEN TEST';
  title: string;
  topic: string;
  questionsCount: string; // e.g. "10 Questions" or "File Attachment"
  maxMarks: number;
  deadline: string; // formatted date
  isOverdue: boolean;
  status: 'PUBLISHED' | 'DRAFT';
  timelineGroup: 'today' | 'week' | 'month';
  questions: Question[];
}

export const AssessmentsPage: React.FC = () => {
  const { showToast } = useToast();

  const userRole = useMemo(() => {
    const saved = localStorage.getItem('currentUser');
    return saved ? JSON.parse(saved).role : 'admin';
  }, []);

  // Filter States
  const [activeTab, setActiveTab] = useState<'all' | 'draft' | 'published'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [timelineFilter, setTimelineFilter] = useState<'all' | 'today' | 'week' | 'month'>('all');
  const [selectedBatchFilter, setSelectedBatchFilter] = useState<string>('all');
  const [batchDropdownOpen, setBatchDropdownOpen] = useState(false);

  // Modals States
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [viewingAssessment, setViewingAssessment] = useState<Assessment | null>(null);

  // Form Fields for Create
  const [newTitle, setNewTitle] = useState('');
  const [newTopic, setNewTopic] = useState('');
  const [newType, setNewType] = useState<'MCQ QUIZ' | 'WRITTEN TEST'>('MCQ QUIZ');
  const [newBatchCode, setNewBatchCode] = useState('BATCH A');
  const [newQuestionsCount, setNewQuestionsCount] = useState('3 Questions');
  const [newMaxMarks, setNewMaxMarks] = useState<number>(30);
  const [newDeadline, setNewDeadline] = useState('18/7/2026, 5:18:00 am');
  const [newTimelineGroup, setNewTimelineGroup] = useState<'today' | 'week' | 'month'>('today');
  const [newStatus, setNewStatus] = useState<'PUBLISHED' | 'DRAFT'>('PUBLISHED');

  // Question Creator Fields (Quick MCQ / Quick Written)
  const [quickQuestion1, setQuickQuestion1] = useState('');
  const [quickQuestion2, setQuickQuestion2] = useState('');
  const [quickQuestion3, setQuickQuestion3] = useState('');

  // Reference-Adapted Mock Data
  const initialAssessments: Assessment[] = [
    {
      id: 1,
      batchCode: 'BATCH A',
      type: 'MCQ QUIZ',
      title: 'Interaction Systems Design Quiz',
      topic: 'Design Principles',
      questionsCount: '3 Questions',
      maxMarks: 30,
      deadline: '12/7/2026, 5:18:00 am',
      isOverdue: true,
      status: 'PUBLISHED',
      timelineGroup: 'today',
      questions: [
        {
          id: 101,
          text: 'Which of the following describes the "F-shaped pattern" in visual layouts?',
          options: [
            'Users scan text starting with horizontal movements followed by short vertical scans',
            'Users read every word from bottom to top in a reverse scroll pattern',
            'A design layout where the main navigation is shaped like a block F',
            'A user testing framework for font size and readability ratio'
          ],
          correctAnswer: 'Users scan text starting with horizontal movements followed by short vertical scans'
        },
        {
          id: 102,
          text: 'What does the "Law of Proximity" in UX design state?',
          options: [
            'Objects close to each other tend to be perceived as a single group',
            'Larger design elements attract more user focus',
            'Buttons should be positioned close to the edges of the display screen',
            'Design elements should always be aligned along horizontal grids'
          ],
          correctAnswer: 'Objects close to each other tend to be perceived as a single group'
        },
        {
          id: 103,
          text: 'What is the primary role of a Breadcrumb navigation element?',
          options: [
            'To show the user\'s current location relative to the application\'s directory hierarchy',
            'To automatically summarize video transcripts using AI services',
            'To route API requests between backend controller layers',
            'To persist and store student user roles across pages'
          ],
          correctAnswer: 'To show the user\'s current location relative to the application\'s directory hierarchy'
        }
      ]
    },
    {
      id: 2,
      batchCode: 'BATCH B',
      type: 'WRITTEN TEST',
      title: 'React Components & State Written Assessment',
      topic: 'Front-end Development',
      questionsCount: '2 Questions',
      maxMarks: 20,
      deadline: '15/7/2026, 5:18:00 am',
      isOverdue: false,
      status: 'PUBLISHED',
      timelineGroup: 'today',
      questions: [
        {
          id: 201,
          text: 'Explain the difference between state and props in React components, and describe when you should choose one over the other.'
        },
        {
          id: 202,
          text: 'Describe the React hook lifecycle, specifically how useEffect handles cleanup functions to prevent memory leaks in active event listeners.'
        }
      ]
    },
    {
      id: 3,
      batchCode: 'BATCH C',
      type: 'WRITTEN TEST',
      title: 'SQL Queries and Normalization Quiz (Uploaded File)',
      topic: 'Back-end Development',
      questionsCount: 'File Attachment',
      maxMarks: 50,
      deadline: '22/7/2026, 5:18:00 am',
      isOverdue: false,
      status: 'DRAFT',
      timelineGroup: 'week',
      questions: [
        {
          id: 301,
          text: 'File Specs: SQL_Normal_Form_Specs.pdf (1.2 MB) - Instructions: Write SQL queries to construct a normalized 3NF database schema for the course registration system and solve the queries listed in Section 3 of the PDF.'
        }
      ]
    },
    {
      id: 4,
      batchCode: 'BATCH D',
      type: 'MCQ QUIZ',
      title: 'Scrum & Sprint Planning Framework Draft',
      topic: 'Project Management',
      questionsCount: '1 Questions',
      maxMarks: 10,
      deadline: '28/7/2026, 5:18:00 am',
      isOverdue: false,
      status: 'DRAFT',
      timelineGroup: 'month',
      questions: [
        {
          id: 401,
          text: 'Who is responsible for managing the Product Backlog in a Scrum team?',
          options: [
            'The Product Owner',
            'The Scrum Master',
            'The Development Team Leads',
            'The Quality Assurance Engineer'
          ],
          correctAnswer: 'The Product Owner'
        }
      ]
    }
  ];

  // Local Storage State
  const [assessments, setAssessments] = useState<Assessment[]>(() => {
    const saved = localStorage.getItem('xebia_lms_assessments');
    return saved ? JSON.parse(saved) : initialAssessments;
  });

  // Filter logic
  const filteredAssessments = useMemo(() => {
    return assessments.filter(item => {
      // 1. Tab filter
      if (activeTab === 'draft' && item.status !== 'DRAFT') return false;
      if (activeTab === 'published' && item.status !== 'PUBLISHED') return false;

      // 2. Search query filter
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesTitle = item.title.toLowerCase().includes(query);
        const matchesTopic = item.topic.toLowerCase().includes(query);
        const matchesBatch = item.batchCode.toLowerCase().includes(query);
        if (!matchesTitle && !matchesTopic && !matchesBatch) return false;
      }

      // 3. Timeline dropdown filter
      if (timelineFilter !== 'all' && item.timelineGroup !== timelineFilter) return false;

      // 4. Batch dropdown filter
      if (selectedBatchFilter !== 'all' && item.batchCode !== selectedBatchFilter) return false;

      return true;
    });
  }, [assessments, activeTab, searchQuery, timelineFilter, selectedBatchFilter]);

  const handleCreateQuizSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newTopic.trim()) {
      showToast('Please enter both Title and Topic');
      return;
    }

    // construct list of questions based on quick question text inputs
    const createdQuestions: Question[] = [];
    if (quickQuestion1.trim()) {
      createdQuestions.push({
        id: Date.now() + 1,
        text: quickQuestion1.trim(),
        options: newType === 'MCQ QUIZ' ? ['Option A', 'Option B', 'Option C', 'Option D'] : undefined
      });
    }
    if (quickQuestion2.trim()) {
      createdQuestions.push({
        id: Date.now() + 2,
        text: quickQuestion2.trim(),
        options: newType === 'MCQ QUIZ' ? ['Option A', 'Option B', 'Option C', 'Option D'] : undefined
      });
    }
    if (quickQuestion3.trim()) {
      createdQuestions.push({
        id: Date.now() + 3,
        text: quickQuestion3.trim(),
        options: newType === 'MCQ QUIZ' ? ['Option A', 'Option B', 'Option C', 'Option D'] : undefined
      });
    }

    // Fallback default if none entered
    if (createdQuestions.length === 0) {
      createdQuestions.push({
        id: Date.now() + 9,
        text: 'Standard evaluation question details placeholder.',
        options: newType === 'MCQ QUIZ' ? ['Option A', 'Option B', 'Option C', 'Option D'] : undefined
      });
    }

    const newAssessment: Assessment = {
      id: Date.now(),
      batchCode: newBatchCode,
      type: newType,
      title: newTitle.trim(),
      topic: newTopic.trim(),
      questionsCount: `${createdQuestions.length} Questions`,
      maxMarks: Number(newMaxMarks) || 50,
      deadline: newDeadline.trim() || '18/7/2026, 5:18:00 am',
      isOverdue: false,
      status: newStatus,
      timelineGroup: newTimelineGroup,
      questions: createdQuestions
    };

    const updated = [...assessments, newAssessment];
    setAssessments(updated);
    localStorage.setItem('xebia_lms_assessments', JSON.stringify(updated));

    // Reset Form
    setNewTitle('');
    setNewTopic('');
    setNewType('MCQ QUIZ');
    setNewBatchCode('BATCH A');
    setNewQuestionsCount('3 Questions');
    setNewMaxMarks(30);
    setNewDeadline('18/7/2026, 5:18:00 am');
    setNewTimelineGroup('today');
    setNewStatus('PUBLISHED');
    setQuickQuestion1('');
    setQuickQuestion2('');
    setQuickQuestion3('');

    setIsCreateModalOpen(false);
    showToast(`Successfully created assessment "${newAssessment.title}"`);
  };

  const handleUploadFileSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newTopic.trim()) {
      showToast('Please enter both Assessment Title and Topic');
      return;
    }

    const newAssessment: Assessment = {
      id: Date.now(),
      batchCode: newBatchCode,
      type: 'WRITTEN TEST',
      title: `${newTitle.trim()} (Uploaded File)`,
      topic: newTopic.trim(),
      questionsCount: 'File Attachment',
      maxMarks: Number(newMaxMarks) || 100,
      deadline: newDeadline.trim() || '20/7/2026, 5:18:00 am',
      isOverdue: false,
      status: 'PUBLISHED',
      timelineGroup: newTimelineGroup,
      questions: [
        {
          id: Date.now() + 10,
          text: `File Specs: uploaded_assessment_${Date.now()}.pdf (2.1 MB) - Solve the tasks outlined in the assessment document and push to server.`
        }
      ]
    };

    const updated = [...assessments, newAssessment];
    setAssessments(updated);
    localStorage.setItem('xebia_lms_assessments', JSON.stringify(updated));

    // Reset Form
    setNewTitle('');
    setNewTopic('');
    setNewBatchCode('BATCH A');
    setNewMaxMarks(100);
    setNewDeadline('20/7/2026, 5:18:00 am');
    setNewTimelineGroup('today');

    setIsUploadModalOpen(false);
    showToast(`Successfully uploaded files for "${newAssessment.title}"`);
  };

  const handleDeleteAssessment = (id: number, title: string) => {
    const updated = assessments.filter(item => item.id !== id);
    setAssessments(updated);
    localStorage.setItem('xebia_lms_assessments', JSON.stringify(updated));
    showToast(`Deleted assessment "${title}"`);
  };

  const handleViewSubmissions = (title: string) => {
    showToast(`Opening submissions log for "${title}"`);
  };

  // Motion variants
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.05, delayChildren: 0.02 }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 15 },
    show: { 
      opacity: 1, 
      y: 0,
      transition: { type: "spring", stiffness: 260, damping: 24 } 
    }
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="flex-grow flex flex-col gap-6 md:gap-8 pb-10 relative"
    >
      {/* Top Search & Navigation Bar */}
      <div className="flex flex-col md:flex-row justify-between items-stretch md:items-center gap-4 bg-white/45 backdrop-blur-md border border-neutral-200/40 p-4 rounded-2xl shadow-[0_2px_12px_rgba(0,0,0,0.01)]">
        <div className="relative flex-1 max-w-md">
          <input 
            type="text" 
            placeholder="Search classes, assessments, materials..." 
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

      {/* Title & Top Action Buttons */}
      <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 w-full xl:w-auto xl:flex-grow">
          <div className="text-left">
            <h2 className="text-xl md:text-2xl font-black text-brand-primaryDark tracking-tight">
              Curriculum Assessments
            </h2>
            <p className="text-brand-muted text-xs md:text-sm leading-relaxed mt-0.5">
              Create interactive MCQ tests or upload external files for review.
            </p>
          </div>
          {userRole !== 'student' && (
            <div className="flex flex-wrap items-center gap-3">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setIsCreateModalOpen(true)}
                className="bg-brand-primary hover:bg-brand-primaryDark text-white font-extrabold text-xs px-5 py-2.5 rounded-xl flex items-center gap-2 shadow-sm transition-all duration-150"
              >
                <Plus className="w-4 h-4" /> Create Custom Quiz
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setIsUploadModalOpen(true)}
                className="bg-brand-success hover:bg-[#019388] text-white font-extrabold text-xs px-5 py-2.5 rounded-xl flex items-center gap-2 shadow-sm transition-all duration-150"
              >
                <Upload className="w-4 h-4" /> Upload File Quiz
              </motion.button>
            </div>
          )}
        </div>
      </div>

      {/* Filter and Tab Section */}
      <div className="flex flex-col lg:flex-row justify-between items-stretch lg:items-center gap-4 bg-white/45 backdrop-blur-md p-4 rounded-2xl border border-neutral-200/40 shadow-sm">
        {/* Left Side: Tabs */}
        <div className="flex items-center gap-2 bg-neutral-100/80 p-1.5 rounded-xl self-start">
          <button
            onClick={() => setActiveTab('all')}
            className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'all'
                ? 'bg-white text-brand-primaryDark shadow-sm border border-neutral-200/20'
                : 'text-brand-muted hover:text-brand-primaryDark'
            }`}
          >
            All Assessments
          </button>
          <button
            onClick={() => setActiveTab('draft')}
            className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'draft'
                ? 'bg-white text-brand-primaryDark shadow-sm border border-neutral-200/20'
                : 'text-brand-muted hover:text-brand-primaryDark'
            }`}
          >
            Drafts Only
          </button>
          <button
            onClick={() => setActiveTab('published')}
            className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'published'
                ? 'bg-white text-brand-primaryDark shadow-sm border border-neutral-200/20'
                : 'text-brand-muted hover:text-brand-primaryDark'
            }`}
          >
            Published Only
          </button>
        </div>

        {/* Center/Right Side: Search assessments inside list, plus drop dropdowns */}
        <div className="flex flex-wrap items-center gap-3 flex-grow lg:flex-grow-0 lg:justify-end">
          {/* Inner Search bar */}
          <div className="relative flex-grow sm:flex-grow-0 sm:w-64">
            <input 
              type="text"
              placeholder="Search by title, topic..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white border border-neutral-200 rounded-xl py-1.5 px-3.5 pl-9 text-xs font-semibold text-neutral-800 placeholder-neutral-400 outline-none focus:border-brand-primary/40 transition-all shadow-sm"
            />
            <Search className="w-3.5 h-3.5 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
          </div>

          {/* Timeline Dropdown */}
          <div className="relative flex-grow sm:flex-grow-0">
            <select
              value={timelineFilter}
              onChange={(e) => setTimelineFilter(e.target.value as any)}
              className="w-full sm:w-auto bg-white border border-neutral-200 hover:border-brand-primary/20 px-3 py-1.5 rounded-xl text-[10px] font-bold uppercase text-brand-primaryDark outline-none transition-all shadow-sm"
            >
              <option value="all">Timeline: All</option>
              <option value="today">Today</option>
              <option value="week">This Week</option>
              <option value="month">This Month</option>
            </select>
          </div>

          {/* Batch Selector Dropdown */}
          <div className="relative flex-grow sm:flex-grow-0">
            <button
              onClick={() => setBatchDropdownOpen(!batchDropdownOpen)}
              className="w-full sm:w-auto bg-white border border-neutral-200 hover:border-brand-primary/20 px-3.5 py-1.5 rounded-xl text-[10px] font-bold uppercase text-brand-primaryDark flex items-center justify-between gap-2 z-10 transition-all shadow-sm"
            >
              <span>Batch: <span className="text-brand-primary font-extrabold">{selectedBatchFilter === 'all' ? 'All Batches' : selectedBatchFilter}</span></span>
              <ChevronDown className="w-3 h-3 text-neutral-400" />
            </button>

            {batchDropdownOpen && (
              <>
                <div className="fixed inset-0 z-20" onClick={() => setBatchDropdownOpen(false)} />
                <div className="absolute right-0 mt-2 w-40 bg-white border border-neutral-200/80 rounded-xl shadow-lg p-1.5 z-30 flex flex-col gap-0.5">
                  <button
                    onClick={() => {
                      setSelectedBatchFilter('all');
                      setBatchDropdownOpen(false);
                    }}
                    className={`w-full text-left px-3 py-2 rounded-lg text-xs font-semibold hover:bg-neutral-50 transition-all ${
                      selectedBatchFilter === 'all' ? 'bg-brand-primary/5 text-brand-primary font-bold' : 'text-neutral-700'
                    }`}
                  >
                    All Batches
                  </button>
                  {Array.from(new Set(assessments.map(a => a.batchCode))).map((b) => (
                    <button
                      key={b}
                      onClick={() => {
                        setSelectedBatchFilter(b);
                        setBatchDropdownOpen(false);
                      }}
                      className={`w-full text-left px-3 py-2 rounded-lg text-xs font-semibold hover:bg-neutral-50 transition-all ${
                        selectedBatchFilter === b ? 'bg-brand-primary/5 text-brand-primary font-bold' : 'text-neutral-700'
                      }`}
                    >
                      {b}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Assessments Grid */}
      <motion.div 
        variants={containerVariants}
        className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8"
      >
        {filteredAssessments.map((item) => (
          <motion.div
            key={item.id}
            variants={cardVariants}
            whileHover={{ y: -3, transition: { duration: 0.15 } }}
            className="group glass-panel p-6 rounded-3xl border border-neutral-200/50 shadow-[0_2px_12px_rgba(0,0,0,0.01)] hover:shadow-md transition-all duration-250 flex flex-col justify-between relative overflow-hidden class-card-hover"
          >
            {/* Top Row: Badges & circular doc icon */}
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[10px] font-black tracking-wider px-3 py-1 rounded-full bg-brand-primary/5 text-brand-primary border border-brand-primary/10">
                  {item.batchCode}
                </span>
                <span className={`text-[10px] font-black tracking-wider px-3 py-1 rounded-full border ${
                  item.type === 'MCQ QUIZ'
                    ? 'bg-brand-success/5 text-brand-success border-brand-success/15'
                    : 'bg-indigo-50 text-indigo-600 border-indigo-100'
                }`}>
                  {item.type}
                </span>
              </div>
              <div className="p-2.5 rounded-full bg-brand-primary/5 text-brand-primary border border-brand-primary/10 flex items-center justify-center">
                <FileText className="w-4 h-4" />
              </div>
            </div>

            {/* Middle Row: Assessment Title & Topic */}
            <div className="text-left mb-6">
              <h3 className="text-base font-extrabold text-brand-primaryDark tracking-tight mb-1.5 group-hover:!text-brand-primary transition-colors duration-200">
                {item.title}
              </h3>
              <p className="text-xs text-brand-muted font-bold tracking-tight">
                {item.topic}
              </p>
            </div>

            {/* Separator */}
            <div className="border-b border-neutral-100/80 mb-5"></div>

            {/* Details Section */}
            <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-left mb-6 text-xs text-brand-muted font-semibold">
              <div className="flex items-center gap-1.5">
                <BookOpen className="w-4 h-4 text-brand-muted/70" />
                <span>{item.questionsCount}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Award className="w-4 h-4 text-brand-muted/70" />
                <span>Max Marks: {item.maxMarks}</span>
              </div>
            </div>

            {/* Bottom Row: Status, Deadline, and Action buttons */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mt-auto border-t border-neutral-50/70 pt-4">
              {/* Left Side: Deadline & status badges */}
              <div className="flex flex-col gap-1 text-left">
                <span className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-md self-start ${
                  item.status === 'PUBLISHED'
                    ? 'bg-brand-success/10 text-brand-success'
                    : 'bg-neutral-100 text-brand-muted'
                }`}>
                  {item.status}
                </span>
                <div className="flex items-center gap-1.5 mt-1">
                  <Clock className="w-3.5 h-3.5 text-brand-muted/65" />
                  <span className="text-[10px] text-brand-muted font-bold">
                    Deadline: {item.deadline}
                  </span>
                  {item.isOverdue && (
                    <span className="text-[9px] font-black tracking-wider px-2 py-0.5 rounded bg-brand-cta/10 text-brand-cta uppercase">
                      Overdue
                    </span>
                  )}
                </div>
              </div>

              {/* Right Side: Button Actions */}
              <div className="flex items-center justify-end gap-2.5">
                <button 
                  onClick={() => setViewingAssessment(item)}
                  className="text-brand-muted hover:text-brand-primaryDark font-extrabold text-xs py-2 px-3 transition-colors border border-neutral-200 rounded-lg hover:bg-neutral-50"
                >
                  View
                </button>
                <button 
                  onClick={() => handleViewSubmissions(item.title)}
                  className="bg-brand-primaryDark hover:bg-brand-primary text-white font-extrabold text-xs py-2 px-3.5 rounded-xl transition-all duration-150 shadow-sm"
                >
                  Submissions
                </button>
                <button
                  onClick={() => handleDeleteAssessment(item.id, item.title)}
                  className="p-2 rounded-xl text-neutral-400 hover:text-brand-cta hover:bg-brand-cta/5 transition-all"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </motion.div>
        ))}

        {filteredAssessments.length === 0 && (
          <div className="col-span-full py-16 flex flex-col items-center justify-center text-center bg-white border border-neutral-200/50 rounded-3xl">
            <ClipboardList className="w-10 h-10 text-neutral-300 mb-3" />
            <p className="text-sm font-bold text-brand-primaryDark">No assessments match filters</p>
            <p className="text-xs text-brand-muted mt-1">Try resetting your filter tabs or updating the search term.</p>
          </div>
        )}
      </motion.div>

      {/* Modal 1: Create Custom Quiz */}
      <AnimatePresence>
        {isCreateModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-brand-primaryDark/40 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              transition={{ type: "spring", stiffness: 350, damping: 28 }}
              className="bg-white rounded-3xl border border-neutral-200/50 shadow-xl max-w-md w-full p-6 text-left relative overflow-hidden"
            >
              <div className="flex justify-between items-center mb-6 border-b border-neutral-100 pb-3">
                <h3 className="text-base font-black text-brand-primaryDark uppercase tracking-tight flex items-center gap-2">
                  <ClipboardList className="w-4.5 h-4.5 text-brand-primary" /> Create Custom Quiz
                </h3>
                <button 
                  onClick={() => setIsCreateModalOpen(false)}
                  className="p-1 rounded-lg text-brand-muted hover:text-red-500 hover:bg-neutral-50 transition-all"
                >
                  <X className="w-4.5 h-4.5" />
                </button>
              </div>

              <form onSubmit={handleCreateQuizSubmit} className="flex flex-col gap-4 max-h-[80vh] overflow-y-auto pr-1">
                {/* Batch & Type */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[9px] font-black text-brand-muted uppercase tracking-wider">Target Batch</label>
                    <select
                      value={newBatchCode}
                      onChange={(e) => setNewBatchCode(e.target.value)}
                      className="w-full bg-neutral-50 border border-neutral-200 focus:border-brand-primary/40 focus:bg-white rounded-xl py-2 px-2.5 text-xs font-semibold text-neutral-800 outline-none transition-all"
                    >
                      <option value="BATCH A">Batch A</option>
                      <option value="BATCH B">Batch B</option>
                      <option value="BATCH C">Batch C</option>
                      <option value="BATCH D">Batch D</option>
                    </select>
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[9px] font-black text-brand-muted uppercase tracking-wider">Assessment Type</label>
                    <select
                      value={newType}
                      onChange={(e) => setNewType(e.target.value as any)}
                      className="w-full bg-neutral-50 border border-neutral-200 focus:border-brand-primary/40 focus:bg-white rounded-xl py-2 px-2.5 text-xs font-semibold text-neutral-800 outline-none transition-all"
                    >
                      <option value="MCQ QUIZ">MCQ Quiz</option>
                      <option value="WRITTEN TEST">Written Test</option>
                    </select>
                  </div>
                </div>

                {/* Title */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-[9px] font-black text-brand-muted uppercase tracking-wider">Assessment Title</label>
                  <input 
                    type="text" 
                    required
                    placeholder="e.g. Design Systems & Guidelines Quiz"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    className="w-full bg-neutral-50 border border-neutral-200 focus:border-brand-primary/40 focus:bg-white rounded-xl py-2 px-3 text-xs font-semibold text-neutral-800 outline-none transition-all"
                  />
                </div>

                {/* Topic */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-[9px] font-black text-brand-muted uppercase tracking-wider">Topic Area</label>
                  <input 
                    type="text" 
                    required
                    placeholder="e.g. Interaction Systems Design"
                    value={newTopic}
                    onChange={(e) => setNewTopic(e.target.value)}
                    className="w-full bg-neutral-50 border border-neutral-200 focus:border-brand-primary/40 focus:bg-white rounded-xl py-2 px-3 text-xs font-semibold text-neutral-800 outline-none transition-all"
                  />
                </div>

                {/* Max Marks & Deadline */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[9px] font-black text-brand-muted uppercase tracking-wider">Max Marks</label>
                    <input 
                      type="number" 
                      required
                      min="1"
                      value={newMaxMarks || ''}
                      onChange={(e) => setNewMaxMarks(Number(e.target.value))}
                      className="w-full bg-neutral-50 border border-neutral-200 focus:border-brand-primary/40 focus:bg-white rounded-xl py-2 px-3 text-xs font-semibold text-neutral-800 outline-none transition-all"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[9px] font-black text-brand-muted uppercase tracking-wider">Timeline Group</label>
                    <select
                      value={newTimelineGroup}
                      onChange={(e) => setNewTimelineGroup(e.target.value as any)}
                      className="w-full bg-neutral-50 border border-neutral-200 focus:border-brand-primary/40 focus:bg-white rounded-xl py-2 px-2.5 text-xs font-semibold text-neutral-800 outline-none transition-all"
                    >
                      <option value="today">Today</option>
                      <option value="week">This Week</option>
                      <option value="month">This Month</option>
                    </select>
                  </div>
                </div>

                {/* Deadline schedule */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-[9px] font-black text-brand-muted uppercase tracking-wider">Deadline Date/Time</label>
                  <input 
                    type="text" 
                    required
                    placeholder="e.g. 18/7/2026, 5:18:00 am"
                    value={newDeadline}
                    onChange={(e) => setNewDeadline(e.target.value)}
                    className="w-full bg-neutral-50 border border-neutral-200 focus:border-brand-primary/40 focus:bg-white rounded-xl py-2 px-3 text-xs font-semibold text-neutral-800 outline-none transition-all"
                  />
                </div>

                {/* Quick Questions Builder */}
                <div className="border-t border-neutral-100 pt-3 flex flex-col gap-3">
                  <span className="text-[10px] font-black text-brand-primary uppercase tracking-tight flex items-center gap-1.5">
                    <HelpCircle className="w-3.5 h-3.5" /> Quick Questions Builder (Add up to 3)
                  </span>
                  
                  <div className="flex flex-col gap-1">
                    <label className="text-[8px] font-bold text-brand-muted uppercase">Question 1</label>
                    <input 
                      type="text"
                      placeholder="Enter question text..."
                      value={quickQuestion1}
                      onChange={(e) => setQuickQuestion1(e.target.value)}
                      className="w-full bg-neutral-50 border border-neutral-200 focus:bg-white rounded-lg py-1.5 px-2.5 text-xs font-medium text-neutral-800 outline-none"
                    />
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="text-[8px] font-bold text-brand-muted uppercase">Question 2 (Optional)</label>
                    <input 
                      type="text"
                      placeholder="Enter question text..."
                      value={quickQuestion2}
                      onChange={(e) => setQuickQuestion2(e.target.value)}
                      className="w-full bg-neutral-50 border border-neutral-200 focus:bg-white rounded-lg py-1.5 px-2.5 text-xs font-medium text-neutral-800 outline-none"
                    />
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="text-[8px] font-bold text-brand-muted uppercase">Question 3 (Optional)</label>
                    <input 
                      type="text"
                      placeholder="Enter question text..."
                      value={quickQuestion3}
                      onChange={(e) => setQuickQuestion3(e.target.value)}
                      className="w-full bg-neutral-50 border border-neutral-200 focus:bg-white rounded-lg py-1.5 px-2.5 text-xs font-medium text-neutral-800 outline-none"
                    />
                  </div>
                </div>

                {/* Status selector */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-[9px] font-black text-brand-muted uppercase tracking-wider">Initial Status</label>
                  <select
                    value={newStatus}
                    onChange={(e) => setNewStatus(e.target.value as any)}
                    className="w-full bg-neutral-50 border border-neutral-200 focus:border-brand-primary/40 focus:bg-white rounded-xl py-2 px-2.5 text-xs font-semibold text-neutral-800 outline-none transition-all"
                  >
                    <option value="PUBLISHED">Published</option>
                    <option value="DRAFT">Draft</option>
                  </select>
                </div>

                {/* Footer Buttons */}
                <div className="flex items-center justify-end gap-3 mt-4 border-t border-neutral-100 pt-4">
                  <button
                    type="button"
                    onClick={() => setIsCreateModalOpen(false)}
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
                    Create Quiz
                  </motion.button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Modal 2: Upload File Quiz */}
      <AnimatePresence>
        {isUploadModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-brand-primaryDark/40 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              transition={{ type: "spring", stiffness: 350, damping: 28 }}
              className="bg-white rounded-3xl border border-neutral-200/50 shadow-xl max-w-md w-full p-6 text-left relative overflow-hidden"
            >
              <div className="flex justify-between items-center mb-6 border-b border-neutral-100 pb-3">
                <h3 className="text-base font-black text-brand-primaryDark uppercase tracking-tight flex items-center gap-2">
                  <Upload className="w-4.5 h-4.5 text-brand-primary" /> Upload File Quiz
                </h3>
                <button 
                  onClick={() => setIsUploadModalOpen(false)}
                  className="p-1 rounded-lg text-brand-muted hover:text-red-500 hover:bg-neutral-50 transition-all"
                >
                  <X className="w-4.5 h-4.5" />
                </button>
              </div>

              <form onSubmit={handleUploadFileSubmit} className="flex flex-col gap-4">
                {/* Batch Code */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-[9px] font-black text-brand-muted uppercase tracking-wider">Target Batch</label>
                  <select
                    value={newBatchCode}
                    onChange={(e) => setNewBatchCode(e.target.value)}
                    className="w-full bg-neutral-50 border border-neutral-200 focus:border-brand-primary/40 focus:bg-white rounded-xl py-2 px-2.5 text-xs font-semibold text-neutral-800 outline-none transition-all"
                  >
                    <option value="BATCH A">Batch A</option>
                    <option value="BATCH B">Batch B</option>
                    <option value="BATCH C">Batch C</option>
                    <option value="BATCH D">Batch D</option>
                  </select>
                </div>

                {/* Title */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-[9px] font-black text-brand-muted uppercase tracking-wider">Assessment Title</label>
                  <input 
                    type="text" 
                    required
                    placeholder="e.g. Hibernate Queries Examination"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    className="w-full bg-neutral-50 border border-neutral-200 focus:border-brand-primary/40 focus:bg-white rounded-xl py-2 px-3 text-xs font-semibold text-neutral-800 outline-none transition-all"
                  />
                </div>

                {/* Topic */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-[9px] font-black text-brand-muted uppercase tracking-wider">Topic Area</label>
                  <input 
                    type="text" 
                    required
                    placeholder="e.g. Back-end Development"
                    value={newTopic}
                    onChange={(e) => setNewTopic(e.target.value)}
                    className="w-full bg-neutral-50 border border-neutral-200 focus:border-brand-primary/40 focus:bg-white rounded-xl py-2 px-3 text-xs font-semibold text-neutral-800 outline-none transition-all"
                  />
                </div>

                {/* Max Marks & Timeline Group */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[9px] font-black text-brand-muted uppercase tracking-wider">Max Marks</label>
                    <input 
                      type="number" 
                      required
                      min="1"
                      value={newMaxMarks || ''}
                      onChange={(e) => setNewMaxMarks(Number(e.target.value))}
                      className="w-full bg-neutral-50 border border-neutral-200 focus:border-brand-primary/40 focus:bg-white rounded-xl py-2 px-3 text-xs font-semibold text-neutral-800 outline-none transition-all"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[9px] font-black text-brand-muted uppercase tracking-wider">Timeline Group</label>
                    <select
                      value={newTimelineGroup}
                      onChange={(e) => setNewTimelineGroup(e.target.value as any)}
                      className="w-full bg-neutral-50 border border-neutral-200 focus:border-brand-primary/40 focus:bg-white rounded-xl py-2 px-2.5 text-xs font-semibold text-neutral-800 outline-none transition-all"
                    >
                      <option value="today">Today</option>
                      <option value="week">This Week</option>
                      <option value="month">This Month</option>
                    </select>
                  </div>
                </div>

                {/* Deadline */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-[9px] font-black text-brand-muted uppercase tracking-wider">Deadline Date/Time</label>
                  <input 
                    type="text" 
                    required
                    placeholder="e.g. 20/7/2026, 5:18:00 am"
                    value={newDeadline}
                    onChange={(e) => setNewDeadline(e.target.value)}
                    className="w-full bg-neutral-50 border border-neutral-200 focus:border-brand-primary/40 focus:bg-white rounded-xl py-2 px-3 text-xs font-semibold text-neutral-800 outline-none transition-all"
                  />
                </div>

                {/* File Upload Trigger */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-[9px] font-black text-brand-muted uppercase tracking-wider">Select Assessment Document (PDF/Docx/ZIP)</label>
                  <div className="w-full border-2 border-dashed border-neutral-200 hover:border-brand-success/40 bg-neutral-50 hover:bg-white rounded-xl p-6 flex flex-col items-center justify-center cursor-pointer transition-all gap-1.5">
                    <Upload className="w-6.5 h-6.5 text-neutral-400 group-hover:text-brand-success" />
                    <span className="text-xs font-bold text-neutral-700">Choose file or drag & drop</span>
                    <span className="text-[9px] font-medium text-neutral-400">PDF, DOCX, XLSX or ZIP up to 50MB</span>
                  </div>
                </div>

                {/* Footer Buttons */}
                <div className="flex items-center justify-end gap-3 mt-4 border-t border-neutral-100 pt-4">
                  <button
                    type="button"
                    onClick={() => setIsUploadModalOpen(false)}
                    className="py-2 px-4 rounded-xl text-xs font-extrabold text-brand-muted hover:bg-neutral-100 transition-all"
                  >
                    Cancel
                  </button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    className="bg-brand-success hover:bg-[#019388] text-white font-extrabold text-xs py-2 px-5 rounded-xl transition-all shadow-sm"
                  >
                    Upload Assessment
                  </motion.button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Modal 3: View Assessment Questions */}
      <AnimatePresence>
        {viewingAssessment && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-brand-primaryDark/40 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              transition={{ type: "spring", stiffness: 350, damping: 28 }}
              className="bg-white rounded-3xl border border-neutral-200/50 shadow-xl max-w-xl w-full p-6 text-left relative overflow-hidden"
            >
              {/* Modal Header */}
              <div className="flex justify-between items-start mb-5 border-b border-neutral-100 pb-3.5">
                <div className="text-left">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[9px] font-black tracking-wider px-2 py-0.5 rounded-md bg-brand-primary/5 text-brand-primary border border-brand-primary/10">
                      {viewingAssessment.batchCode}
                    </span>
                    <span className={`text-[9px] font-black tracking-wider px-2 py-0.5 rounded-md border ${
                      viewingAssessment.type === 'MCQ QUIZ'
                        ? 'bg-brand-success/5 text-brand-success border-brand-success/15'
                        : 'bg-indigo-50 text-indigo-600 border-indigo-100'
                    }`}>
                      {viewingAssessment.type}
                    </span>
                  </div>
                  <h3 className="text-base font-black text-brand-primaryDark tracking-tight">
                    {viewingAssessment.title}
                  </h3>
                  <p className="text-xs text-brand-muted font-bold mt-0.5">
                    Topic: {viewingAssessment.topic} • Max Marks: {viewingAssessment.maxMarks}
                  </p>
                </div>
                <button 
                  onClick={() => setViewingAssessment(null)}
                  className="p-1 rounded-lg text-brand-muted hover:text-red-500 hover:bg-neutral-50 transition-all ml-4"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Questions List */}
              <div className="flex flex-col gap-5 max-h-[55vh] overflow-y-auto pr-1.5 text-left mb-6">
                {viewingAssessment.type === 'MCQ QUIZ' ? (
                  viewingAssessment.questions.map((q, qIndex) => (
                    <div key={q.id} className="bg-neutral-50/70 border border-neutral-100 p-4 rounded-2xl flex flex-col gap-3">
                      <span className="text-xs font-black text-neutral-800 leading-relaxed flex items-start gap-2">
                        <span className="text-brand-primary font-black">Q{qIndex + 1}.</span>
                        <span>{q.text}</span>
                      </span>
                      
                      {q.options && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-1 pl-6">
                          {q.options.map((opt, optIdx) => {
                            const isCorrect = q.correctAnswer === opt;
                            return (
                              <div 
                                key={optIdx} 
                                className={`p-2.5 rounded-xl border text-[11px] font-bold transition-all flex items-start gap-2 ${
                                  isCorrect 
                                    ? 'bg-brand-success/5 border-brand-success/30 text-brand-success' 
                                    : 'bg-white border-neutral-200 text-neutral-700'
                                }`}
                              >
                                <span className="opacity-70">{String.fromCharCode(65 + optIdx)}.</span>
                                <span>{opt}</span>
                                {isCorrect && (
                                  <span className="text-[8px] uppercase tracking-wider font-black px-1.5 bg-brand-success text-white rounded ml-auto self-center">
                                    Correct
                                  </span>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  ))
                ) : (
                  // Written Test layout
                  viewingAssessment.questions.map((q, qIndex) => {
                    const isFileAttachment = q.text.startsWith('File Specs:');
                    if (isFileAttachment) {
                      const fileParts = q.text.split(' - Instructions: ');
                      const fileNamePart = fileParts[0].replace('File Specs: ', '');
                      const instructions = fileParts[1];
                      
                      return (
                        <div key={q.id} className="flex flex-col gap-4">
                          {/* Mock File Download Card */}
                          <div className="p-4 bg-brand-primary/5 border border-brand-primary/10 rounded-2xl flex items-center justify-between gap-4">
                            <div className="flex items-center gap-3 text-left">
                              <div className="p-3 bg-white rounded-xl border border-brand-primary/10 text-brand-primary">
                                <FileText className="w-6 h-6" />
                              </div>
                              <div>
                                <p className="text-xs font-black text-brand-primaryDark">{fileNamePart}</p>
                                <p className="text-[10px] text-brand-muted font-bold">Assessment Specifications Document • 1.2 MB</p>
                              </div>
                            </div>
                            <button 
                              onClick={() => showToast(`Downloading ${fileNamePart}`)}
                              className="p-2.5 rounded-xl bg-white border border-brand-primary/10 text-brand-primary hover:bg-brand-primary hover:text-white transition-all shadow-sm flex items-center justify-center"
                            >
                              <Download className="w-4 h-4" />
                            </button>
                          </div>

                          {/* Instructions */}
                          <div className="bg-neutral-50/70 border border-neutral-100 p-4 rounded-2xl text-left">
                            <span className="text-xs font-black text-neutral-800 leading-relaxed block mb-2">
                              Evaluation Instructions:
                            </span>
                            <p className="text-xs text-neutral-600 font-medium leading-relaxed">
                              {instructions}
                            </p>
                          </div>
                        </div>
                      );
                    } else {
                      // standard essay questions
                      return (
                        <div key={q.id} className="bg-neutral-50/70 border border-neutral-100 p-4 rounded-2xl flex flex-col gap-2">
                          <span className="text-xs font-black text-neutral-800 leading-relaxed flex items-start gap-2">
                            <span className="text-brand-primary font-black">Question {qIndex + 1}.</span>
                            <span>{q.text}</span>
                          </span>
                          <div className="mt-2 border-t border-neutral-200/50 pt-2.5 text-[10px] text-brand-muted font-bold flex items-center justify-between">
                            <span>Written Submission Required</span>
                            <span>Max Marks: {viewingAssessment.maxMarks / viewingAssessment.questions.length}</span>
                          </div>
                        </div>
                      );
                    }
                  })
                )}
              </div>

              {/* Modal Footer */}
              <div className="flex items-center justify-end border-t border-neutral-100 pt-4">
                <button
                  onClick={() => setViewingAssessment(null)}
                  className="bg-brand-primary hover:bg-brand-primaryDark text-white font-extrabold text-xs py-2.5 px-5 rounded-xl transition-all shadow-sm"
                >
                  Close View
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};
export default AssessmentsPage;
