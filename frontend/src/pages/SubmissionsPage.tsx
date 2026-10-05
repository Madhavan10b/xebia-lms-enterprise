import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { 
  Search,
  Bell,
  Settings as SettingsIcon,
  Download,
  Clock,
  Award,
  Check,
  FileSpreadsheet,
  FileCode,
  User,
  CheckCircle2,
  AlertCircle,
  ChevronRight,
  Inbox,
  Filter,
  FileText,
  RotateCcw
} from 'lucide-react';
import { useToast } from '../context/ToastContext';

interface StudentSubmission {
  id: number;
  studentName: string;
  rollNumber: string;
  batchCode: string;
  assessmentTitle: string;
  category: string;
  status: 'PENDING' | 'SUBMITTED' | 'GRADED' | 'MISSING';
  submissionTime: string;
  deadline: string;
  maxMarks: number;
  obtainedMarks?: number;
  responseType: 'code' | 'text' | 'file';
  studentResponse: string;
  feedbackComment?: string;
}

export const SubmissionsPage: React.FC = () => {
  const { showToast } = useToast();

  const userRole = useMemo(() => {
    const saved = localStorage.getItem('currentUser');
    return saved ? JSON.parse(saved).role : 'admin';
  }, []);

  // Search & Batch Filters (for Left sidebar list)
  const [searchQuery, setSearchQuery] = useState('');
  const [batchFilter, setBatchFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  // Selected Student for Split Pane
  const [selectedSubId, setSelectedSubId] = useState<number>(2); // Default to Bhavya Patel (Submitted SQL)

  // Grading form states
  const [gradeInput, setGradeInput] = useState<string>('');
  const [feedbackInput, setFeedbackInput] = useState<string>('');

  // Initial Reference-Adapted Submissions
  const initialSubmissions: StudentSubmission[] = [
    {
      id: 1,
      studentName: 'Aarav Sharma',
      rollNumber: 'XE101',
      batchCode: 'BATCH A',
      assessmentTitle: 'Interaction Systems Design Quiz',
      category: 'Design Principles',
      status: 'GRADED',
      submissionTime: '10/7/2026, 10:58:40 am',
      deadline: '11/7/2026, 10:58:00 am',
      maxMarks: 30,
      obtainedMarks: 30,
      responseType: 'text',
      studentResponse: `[QUIZ ANSWERS SUBMITTED]
Q1: Option A (Provide instant feedback to user interaction) - CORRECT
Q2: Option A (Objects close to each other tend to be grouped together) - CORRECT
Q3: Option A (To show user location relative to hierarchy) - CORRECT`,
      feedbackComment: 'Excellent work! All questions answered correctly.'
    },
    {
      id: 2,
      studentName: 'Bhavya Patel',
      rollNumber: 'XE102',
      batchCode: 'BATCH B',
      assessmentTitle: 'SQL Queries and Normalization Quiz',
      category: 'Back-end Development',
      status: 'SUBMITTED',
      submissionTime: '12/7/2026, 10:10:12 am',
      deadline: '14/7/2026, 5:18:00 am',
      maxMarks: 50,
      responseType: 'code',
      studentResponse: `-- Normalizing registration database schema to 3NF
CREATE TABLE Students (
  student_id INT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL
);

CREATE TABLE Courses (
  course_id VARCHAR(10) PRIMARY KEY,
  title VARCHAR(200) NOT NULL,
  credits INT DEFAULT 3
);

CREATE TABLE Enrollments (
  enrollment_id INT PRIMARY KEY AUTO_INCREMENT,
  student_id INT NOT NULL,
  course_id VARCHAR(10) NOT NULL,
  enrollment_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (student_id) REFERENCES Students(student_id),
  FOREIGN KEY (course_id) REFERENCES Courses(course_id)
);`
    },
    {
      id: 3,
      studentName: 'Chaitanya Reddy',
      rollNumber: 'XE103',
      batchCode: 'BATCH C',
      assessmentTitle: 'React Components & State Written Assessment',
      category: 'Front-end Development',
      status: 'SUBMITTED',
      submissionTime: '13/7/2026, 10:10:12 am',
      deadline: '15/7/2026, 5:18:00 am',
      maxMarks: 20,
      responseType: 'code',
      studentResponse: `// Explanation of State vs Props in React Hooks
// State represents local mutable component data managed internally.
// Props are read-only configuration arguments passed down from a parent.

import React, { useState } from 'react';

export const ToggleButton = ({ label }) => {
  const [isOn, setIsOn] = useState(false);
  return (
    <button onClick={() => setIsOn(!isOn)} className="px-3 py-1 bg-purple-50">
      {label}: {isOn ? 'ACTIVE' : 'INACTIVE'}
    </button>
  );
};`
    },
    {
      id: 4,
      studentName: 'Divya Iyer',
      rollNumber: 'XE104',
      batchCode: 'BATCH A',
      assessmentTitle: 'Interaction Systems Design Quiz',
      category: 'Design Principles',
      status: 'GRADED',
      submissionTime: '11/7/2026, 10:10:12 am',
      deadline: '11/7/2026, 10:58:00 am',
      maxMarks: 30,
      obtainedMarks: 20,
      responseType: 'text',
      studentResponse: `[QUIZ ANSWERS SUBMITTED]
Q1: Option A (Provide instant feedback to user interaction) - CORRECT
Q2: Option B (Larger design elements attract more user focus) - INCORRECT
Q3: Option A (To show user location relative to hierarchy) - CORRECT`,
      feedbackComment: 'Good effort, but check the Law of Proximity spacing rules.'
    },
    {
      id: 5,
      studentName: 'Eshwar Rao',
      rollNumber: 'XE105',
      batchCode: 'BATCH B',
      assessmentTitle: 'React Components & State Written Assessment',
      category: 'Front-end Development',
      status: 'PENDING',
      submissionTime: '--',
      deadline: '15/7/2026, 5:18:00 am',
      maxMarks: 20,
      responseType: 'text',
      studentResponse: 'No response submitted yet. Student is currently working on the assignment.'
    },
    {
      id: 6,
      studentName: 'Farhan Ali',
      rollNumber: 'XE106',
      batchCode: 'BATCH A',
      assessmentTitle: 'Sprint Planning Framework Assessment',
      category: 'Project Management',
      status: 'MISSING',
      submissionTime: '--',
      deadline: '11/7/2026, 10:58:00 am',
      maxMarks: 22,
      responseType: 'text',
      studentResponse: 'Student missed the deadline. No attempt recorded.'
    }
  ];

  // Persistent Submissions state
  const [submissions, setSubmissions] = useState<StudentSubmission[]>(() => {
    const saved = localStorage.getItem('xebia_lms_submissions');
    return saved ? JSON.parse(saved) : initialSubmissions;
  });

  // Filtered list for the left panel
  const filteredSubmissions = useMemo(() => {
    return submissions.filter(item => {
      // 1. Search Query
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesName = item.studentName.toLowerCase().includes(query);
        const matchesTitle = item.assessmentTitle.toLowerCase().includes(query);
        if (!matchesName && !matchesTitle) return false;
      }
      // 2. Batch Filter
      if (batchFilter !== 'all' && item.batchCode !== batchFilter) return false;
      // 3. Status Filter
      if (statusFilter !== 'all' && item.status !== statusFilter) return false;

      return true;
    });
  }, [submissions, searchQuery, batchFilter, statusFilter]);

  // Calculate stats based on filtered list and active input
  const stats = useMemo(() => {
    let graded = 0;
    let submitted = 0;
    let pending = 0;
    let missing = 0;

    filteredSubmissions.forEach(s => {
      const isCurrentlyReviewing = s.id === selectedSubId;
      const hasInputGrade = isCurrentlyReviewing && gradeInput.trim() !== '' && !isNaN(Number(gradeInput));

      if (s.status === 'GRADED' || hasInputGrade) {
        graded++;
      } else if (s.status === 'SUBMITTED') {
        // If they type in the grade, it transfers from SUBMITTED to GRADED. Otherwise stays SUBMITTED.
        submitted++;
      } else if (s.status === 'PENDING') {
        pending++;
      } else if (s.status === 'MISSING') {
        missing++;
      }
    });

    const evaluable = graded + submitted;
    // Calculate progress as % of turned-in (evaluable) submissions that are graded
    const progress = evaluable > 0 ? Math.round((graded / evaluable) * 100) : 0;

    return { graded, submitted, pending, missing, progress };
  }, [filteredSubmissions, selectedSubId, gradeInput]);

  // Selected Submission object
  const activeSubmission = useMemo(() => {
    return submissions.find(s => s.id === selectedSubId) || null;
  }, [submissions, selectedSubId]);

  // Calculate active student's score percentage dynamically
  const activeScorePercentage = useMemo(() => {
    if (!activeSubmission) return 0;
    
    // If user is currently typing a grade
    if (gradeInput.trim() !== '' && !isNaN(Number(gradeInput))) {
      return Math.min(100, Math.max(0, Math.round((Number(gradeInput) / activeSubmission.maxMarks) * 100)));
    }
    
    // If student is already graded
    if (activeSubmission.obtainedMarks !== undefined) {
      return Math.round((activeSubmission.obtainedMarks / activeSubmission.maxMarks) * 100);
    }
    
    return 0;
  }, [activeSubmission, gradeInput]);

  // Calculate dynamic progress color configuration based on selected student score
  const progressColorClass = useMemo(() => {
    const p = activeScorePercentage;
    if (p >= 1 && p <= 35) {
      return {
        text: 'text-red-600',
        bg: 'bg-red-50',
        border: 'border-red-200/85'
      };
    } else if (p >= 36 && p <= 70) {
      return {
        text: 'text-amber-500', // Yellow
        bg: 'bg-amber-50',
        border: 'border-amber-200/85'
      };
    } else if (p >= 71 && p <= 85) {
      return {
        text: 'text-emerald-500', // Light green
        bg: 'bg-emerald-50',
        border: 'border-emerald-200/85'
      };
    } else if (p >= 86 && p <= 100) {
      return {
        text: 'text-green-700', // Dark green
        bg: 'bg-green-100/40',
        border: 'border-green-300/85'
      };
    } else {
      return {
        text: 'text-neutral-500',
        bg: 'bg-neutral-50',
        border: 'border-neutral-200/60'
      };
    }
  }, [activeScorePercentage]);

  // Reset helper
  const handleResetData = () => {
    localStorage.removeItem('xebia_lms_submissions');
    setSubmissions(initialSubmissions);
    setSelectedSubId(2);
    showToast('Reset submissions evaluation log to default states.');
  };

  // Handle grade submission
  const handleGradeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeSubmission) return;

    const grade = Number(gradeInput);
    if (isNaN(grade) || grade < 0 || grade > activeSubmission.maxMarks) {
      showToast(`Please enter a score between 0 and ${activeSubmission.maxMarks}`);
      return;
    }

    const updated = submissions.map(item => {
      if (item.id === activeSubmission.id) {
        return {
          ...item,
          status: 'GRADED' as const,
          obtainedMarks: grade,
          feedbackComment: feedbackInput.trim()
        };
      }
      return item;
    });

    setSubmissions(updated);
    localStorage.setItem('xebia_lms_submissions', JSON.stringify(updated));
    showToast(`Successfully graded ${activeSubmission.studentName}'s assessment!`);

    // Move to next student in submitted state automatically if available
    const nextSubmitted = updated.find(item => item.status === 'SUBMITTED' && item.id !== activeSubmission.id);
    if (nextSubmitted) {
      setSelectedSubId(nextSubmitted.id);
      setGradeInput('');
      setFeedbackInput('');
    }
  };

  // Pre-fill fields when selecting a student
  React.useEffect(() => {
    if (activeSubmission) {
      setGradeInput(activeSubmission.obtainedMarks !== undefined ? String(activeSubmission.obtainedMarks) : '');
      setFeedbackInput(activeSubmission.feedbackComment || '');
    }
  }, [selectedSubId, activeSubmission]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex-grow flex flex-col gap-6 md:gap-8 pb-10 relative"
    >
      {/* Top Search & Profile Navigation */}
      <div className="flex flex-col md:flex-row justify-between items-stretch md:items-center gap-4 bg-white/45 backdrop-blur-md border border-neutral-200/40 p-4 rounded-2xl shadow-[0_2px_12px_rgba(0,0,0,0.01)]">
        <div className="relative flex-1 max-w-md">
          <input 
            type="text" 
            placeholder="Search student profiles, evaluations, logs..." 
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

      {/* Header Panel */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 w-full border-b border-neutral-200/60 pb-5 text-left">
        <div>
          <h2 className="text-xl md:text-2xl font-black text-brand-primaryDark tracking-tight">
            Submissions Hub
          </h2>
          <p className="text-brand-muted text-xs md:text-sm leading-relaxed mt-0.5">
            Grade responses, view virtual submissions, and track batch timelines.
          </p>
        </div>
        <div className="flex items-center gap-2">
          {userRole !== 'student' && (
            <button
              onClick={handleResetData}
              className="bg-white border border-red-200 text-red-600 hover:bg-red-50 font-extrabold text-xs px-4.5 py-2.5 rounded-xl flex items-center gap-2 shadow-sm transition-all"
            >
              <RotateCcw className="w-4 h-4" /> Reset Mock Data
            </button>
          )}
          <button 
            onClick={() => showToast('Exporting CSV evaluations...')}
            className="bg-white border border-neutral-200 text-brand-primaryDark hover:border-brand-primary/20 font-extrabold text-xs px-4.5 py-2.5 rounded-xl flex items-center gap-2 shadow-sm transition-all"
          >
            <Download className="w-4 h-4" /> Export CSV
          </button>
        </div>
      </div>

      {/* Modern Split Layout Workspace (DIFFERENT FROM TABLE VIEW REFERENCE) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
        
        {/* Left Panel: Stats progress ring, Search, and Submission List (1/3 width) */}
        <div className="lg:col-span-1 flex flex-col gap-5 bg-white border border-neutral-200/50 p-5 rounded-3xl shadow-sm">
          
          {/* Progress Circular Widget (Student Performance Score) */}
          <div className="flex items-center gap-4 bg-neutral-50/70 p-4 border border-neutral-100 rounded-2xl">
            <div className={`relative w-16 h-16 flex items-center justify-center rounded-full font-black border-2 shrink-0 transition-all duration-300 ${progressColorClass.bg} ${progressColorClass.border} ${progressColorClass.text}`}>
              <span className="text-base font-black">
                {activeSubmission && (activeSubmission.status === 'GRADED' || (gradeInput.trim() !== '' && !isNaN(Number(gradeInput)))) ? `${activeScorePercentage}%` : '--'}
              </span>
            </div>
            <div className="text-left flex-grow">
              <p className="text-[10px] font-black text-brand-primary uppercase tracking-wider">Student Score</p>
              <p className="text-xs text-brand-muted font-bold mt-0.5 truncate max-w-[170px]">
                {activeSubmission ? `${activeSubmission.studentName} (${activeSubmission.rollNumber})` : 'Select student'}
              </p>
            </div>
          </div>

          {/* Filters Accordion */}
          <div className="flex flex-col gap-3">
            <div className="relative">
              <input 
                type="text" 
                placeholder="Search student or assessment..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-neutral-50 border border-neutral-200 rounded-xl py-2 pl-9 pr-3 text-xs font-semibold text-neutral-800 placeholder-neutral-400 outline-none"
              />
              <Search className="w-3.5 h-3.5 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <select
                value={batchFilter}
                onChange={(e) => setBatchFilter(e.target.value)}
                className="bg-neutral-50 border border-neutral-200 rounded-xl py-1.5 px-2.5 text-[10px] font-extrabold uppercase text-neutral-700 outline-none"
              >
                <option value="all">All Batches</option>
                <option value="BATCH A">Batch A</option>
                <option value="BATCH B">Batch B</option>
                <option value="BATCH C">Batch C</option>
                <option value="BATCH D">Batch D</option>
              </select>

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="bg-neutral-50 border border-neutral-200 rounded-xl py-1.5 px-2.5 text-[10px] font-extrabold uppercase text-neutral-700 outline-none"
              >
                <option value="all">All Statuses</option>
                <option value="PENDING">Pending</option>
                <option value="SUBMITTED">Submitted</option>
                <option value="GRADED">Graded</option>
                <option value="MISSING">Missing</option>
              </select>
            </div>
          </div>

          {/* Submission List card deck */}
          <div className="flex flex-col gap-2 max-h-[480px] overflow-y-auto pr-1">
            {filteredSubmissions.map((sub) => {
              const isSelected = sub.id === selectedSubId;
              const initials = sub.studentName.split(' ').map(n => n[0]).join('');

              return (
                <button
                  key={sub.id}
                  onClick={() => setSelectedSubId(sub.id)}
                  className={`w-full p-3 rounded-2xl border text-left flex items-start justify-between gap-3 transition-all ${
                    isSelected 
                      ? 'bg-brand-primary/10 border-brand-primary/30 shadow-xs' 
                      : 'bg-white border-neutral-100 hover:border-brand-primary/20'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs ${
                      isSelected ? 'bg-brand-primary text-white' : 'bg-brand-primary/5 text-brand-primary'
                    }`}>
                      {initials}
                    </div>
                    <div>
                      <p className="font-extrabold text-xs text-neutral-800">{sub.studentName}</p>
                      <p className="text-[10px] text-brand-muted font-bold truncate max-w-[140px]">{sub.assessmentTitle}</p>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-1.5">
                    <span className="text-[9px] font-black text-brand-muted uppercase tracking-wider">{sub.batchCode}</span>
                    <span className={`text-[8px] font-black tracking-wider px-1.5 py-0.5 rounded ${
                      sub.status === 'GRADED'
                        ? 'bg-brand-success/10 text-brand-success'
                        : sub.status === 'SUBMITTED'
                        ? 'bg-indigo-50 text-indigo-600'
                        : sub.status === 'PENDING'
                        ? 'bg-neutral-100 text-neutral-500'
                        : 'bg-red-50 text-red-600'
                    }`}>
                      {sub.status}
                    </span>
                  </div>
                </button>
              );
            })}

            {filteredSubmissions.length === 0 && (
              <div className="py-12 flex flex-col items-center justify-center text-center">
                <Inbox className="w-8 h-8 text-neutral-300 mb-2" />
                <p className="text-xs font-bold text-brand-primaryDark">No submissions found</p>
              </div>
            )}
          </div>
        </div>

        {/* Right Panel: Grading details pane (2/3 width) */}
        <div className="lg:col-span-2 flex flex-col submissions-grading-pane p-6 rounded-3xl shadow-sm text-left justify-between min-h-[500px]">
          {activeSubmission ? (
            <div className="flex flex-col gap-5 h-full justify-between">
              
              {/* Submission Header */}
              <div className="flex justify-between items-start border-b border-neutral-100 pb-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[9px] font-black tracking-wider px-2 py-0.5 rounded bg-brand-primary/5 text-brand-primary border border-brand-primary/10">
                      {activeSubmission.batchCode}
                    </span>
                    <span className="text-[9px] font-black tracking-wider px-2 py-0.5 rounded bg-neutral-100 text-brand-muted border border-neutral-200/40">
                      {activeSubmission.rollNumber}
                    </span>
                  </div>
                  <h3 className="text-base font-black text-brand-primaryDark">
                    {activeSubmission.studentName}
                  </h3>
                  <p className="text-xs text-brand-muted font-bold mt-0.5">
                    Evaluation Target: <span className="text-neutral-800">{activeSubmission.assessmentTitle}</span>
                  </p>
                </div>

                <div className="flex flex-col items-end gap-1">
                  <span className={`text-[9px] font-black tracking-wider px-3 py-1 rounded-full border ${
                    activeSubmission.status === 'GRADED'
                      ? 'bg-brand-success/5 text-brand-success border-brand-success/15'
                      : activeSubmission.status === 'SUBMITTED'
                      ? 'bg-indigo-50 text-indigo-600 border-indigo-100'
                      : activeSubmission.status === 'PENDING'
                      ? 'bg-neutral-100 text-neutral-500 border-neutral-200'
                      : 'bg-red-50 text-red-600 border-red-100'
                  }`}>
                    {activeSubmission.status}
                  </span>
                  {activeSubmission.status !== 'PENDING' && activeSubmission.status !== 'MISSING' && (
                    <span className="text-xs font-bold text-neutral-500 mt-1">
                      Score: <span className="text-brand-success font-black text-sm">{gradeInput || activeSubmission.obtainedMarks || '--'}</span> / {activeSubmission.maxMarks}
                    </span>
                  )}
                </div>
              </div>

              {/* Code / Text viewer pane */}
              <div className="flex flex-col gap-2">
                <span className="text-[9px] font-black text-brand-muted uppercase tracking-wider flex items-center gap-1.5">
                  {activeSubmission.responseType === 'code' ? <FileCode className="w-3.5 h-3.5" /> : <FileText className="w-3.5 h-3.5" />}
                  Student Submitted Content
                </span>
                
                {activeSubmission.status === 'PENDING' || activeSubmission.status === 'MISSING' ? (
                  <div className="w-full bg-neutral-50 border border-neutral-200 border-dashed rounded-2xl p-8 flex flex-col items-center justify-center text-center text-brand-muted">
                    <AlertCircle className="w-8 h-8 text-neutral-300 mb-2" />
                    <p className="text-xs font-bold">{activeSubmission.studentResponse}</p>
                    <p className="text-[10px] mt-0.5">No evaluation input required.</p>
                  </div>
                ) : (
                  <div className={`w-full rounded-2xl overflow-hidden border ${
                    activeSubmission.responseType === 'code' ? 'border-[#1e1e2f]' : 'border-neutral-200/60'
                  }`}>
                    {/* Header mockup */}
                    <div className={`px-4 py-2 text-[10px] font-mono flex items-center justify-between border-b ${
                      activeSubmission.responseType === 'code' ? 'bg-[#181824] text-neutral-400 border-neutral-900' : 'bg-neutral-50 text-neutral-500 border-neutral-200/50'
                    }`}>
                      <span>{activeSubmission.responseType === 'code' ? 'main.sql' : 'text_response.txt'}</span>
                      <span>UTF-8</span>
                    </div>
                    {/* Source contents */}
                    <pre className={`p-4 font-mono text-[11px] leading-relaxed overflow-x-auto text-left max-h-56 ${
                      activeSubmission.responseType === 'code' ? 'bg-[#1E1E2F] text-emerald-400' : 'bg-neutral-50/40 text-neutral-700'
                    }`}>
                      <code>{activeSubmission.studentResponse}</code>
                    </pre>
                  </div>
                )}
              </div>

              {/* Grading input panel (Directly on screen!) */}
              {activeSubmission.status !== 'PENDING' && activeSubmission.status !== 'MISSING' && (
                <form onSubmit={handleGradeSubmit} className="flex flex-col gap-4 border-t border-neutral-100 pt-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Assign Score */}
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[9px] font-black text-brand-muted uppercase tracking-wider">Assign Score Marks</label>
                      <div className="relative">
                        <input 
                          type="number"
                          required
                          min="0"
                          max={activeSubmission.maxMarks}
                          placeholder="Enter score"
                          value={gradeInput}
                          onChange={(e) => setGradeInput(e.target.value)}
                          className="w-full bg-neutral-50 border border-neutral-200 focus:bg-white focus:border-brand-primary/40 rounded-xl py-2 px-3 text-xs font-semibold text-neutral-800 outline-none transition-all"
                        />
                        <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs text-neutral-400 font-bold">
                          / {activeSubmission.maxMarks}
                        </span>
                      </div>
                    </div>

                    {/* Deadline info */}
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[9px] font-black text-brand-muted uppercase tracking-wider">Timeline Details</label>
                      <div className="w-full bg-neutral-50 border border-neutral-200 rounded-xl py-2 px-3 text-xs text-neutral-600 font-medium leading-tight">
                        Deadline: {activeSubmission.deadline}
                      </div>
                    </div>
                  </div>

                  {/* Feedback comments */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[9px] font-black text-brand-muted uppercase tracking-wider">Evaluation Comments</label>
                    <textarea 
                      placeholder="Add comments on code quality, schema constraints, or optimization notes..."
                      value={feedbackInput}
                      onChange={(e) => setFeedbackInput(e.target.value)}
                      rows={3}
                      className="w-full bg-neutral-50 border border-neutral-200 focus:bg-white focus:border-brand-primary/40 rounded-xl py-2 px-3 text-xs font-semibold text-neutral-800 outline-none resize-none"
                    />
                  </div>

                  {/* Submit button */}
                  <motion.button
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    type="submit"
                    className="bg-brand-primary hover:bg-brand-primaryDark text-white font-extrabold text-xs py-2.5 px-5 rounded-xl transition-all shadow-sm flex items-center justify-center gap-1.5 self-end"
                  >
                    <Check className="w-4 h-4" /> Save & Grade Submission
                  </motion.button>
                </form>
              )}

            </div>
          ) : (
            <div className="py-24 flex flex-col items-center justify-center text-center text-brand-muted h-full">
              <Inbox className="w-12 h-12 text-neutral-300 mb-2" />
              <p className="text-sm font-bold text-brand-primaryDark">No student selected</p>
              <p className="text-xs">Select a submission card on the left panel to review and grade.</p>
            </div>
          )}
        </div>

      </div>
    </motion.div>
  );
};
export default SubmissionsPage;
