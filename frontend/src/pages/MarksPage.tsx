import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { 
  Search,
  Bell,
  Settings as SettingsIcon,
  Download,
  Calendar,
  ChevronDown,
  Award,
  BookOpen,
  CheckCircle,
  Clock,
  Filter,
  User,
  ExternalLink,
  ChevronRight
} from 'lucide-react';
import { useToast } from '../context/ToastContext';

interface StudentQuizRecord {
  quizTitle: string;
  category: string;
  batchCode: string;
  maxMarks: number;
  obtainedMarks?: number;
  feedbackText?: string;
  evaluationDate: string;
}

interface StudentAcademicRecord {
  id: number;
  studentName: string;
  rollNumber: string;
  batchCode: string;
  grades: StudentQuizRecord[];
}

export const MarksPage: React.FC = () => {
  const { showToast } = useToast();

  // Filters state
  const [selectedTimeframe, setSelectedTimeframe] = useState<'all' | 'today' | 'week' | 'month'>('all');
  const [selectedBatch, setSelectedBatch] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Selected student for right feedback timeline pane
  const [selectedStudentId, setSelectedStudentId] = useState<number>(1); // Default to Aarav Sharma

  // Default Academic Database
  const initialRecords: StudentAcademicRecord[] = [
    {
      id: 1,
      studentName: 'Aarav Sharma',
      rollNumber: 'XE101',
      batchCode: 'BATCH A',
      grades: [
        {
          quizTitle: 'Interaction Systems Design Quiz',
          category: 'UI/UX Design',
          batchCode: 'BATCH A',
          maxMarks: 30,
          obtainedMarks: 30,
          feedbackText: 'Excellent work! Perfect answers for all questions.',
          evaluationDate: '10/7/2026'
        },
        {
          quizTitle: 'Assessment-03',
          category: 'DSA',
          batchCode: 'BATCH A',
          maxMarks: 10,
          obtainedMarks: 10,
          feedbackText: '9.5/10 - Extremely well optimized algorithm solutions.',
          evaluationDate: '07/7/2026'
        }
      ]
    },
    {
      id: 2,
      studentName: 'Bhavya Patel',
      rollNumber: 'XE102',
      batchCode: 'BATCH B',
      grades: [
        {
          quizTitle: 'SQL Queries and Normalization Quiz',
          category: 'Back-end Development',
          batchCode: 'BATCH B',
          maxMarks: 50,
          obtainedMarks: 45,
          feedbackText: 'Well structured schema normalizations. Pay attention to composite key indices.',
          evaluationDate: '12/7/2026'
        }
      ]
    },
    {
      id: 3,
      studentName: 'Chaitanya Reddy',
      rollNumber: 'XE103',
      batchCode: 'BATCH C',
      grades: [
        {
          quizTitle: 'React Components & State Written Assessment',
          category: 'Front-end Development',
          batchCode: 'BATCH C',
          maxMarks: 20,
          obtainedMarks: 18,
          feedbackText: 'Great explanation of hooks and properties. Code snippets compile correctly.',
          evaluationDate: '13/7/2026'
        }
      ]
    },
    {
      id: 4,
      studentName: 'Divya Iyer',
      rollNumber: 'XE104',
      batchCode: 'BATCH A',
      grades: [
        {
          quizTitle: 'Interaction Systems Design Quiz',
          category: 'UI/UX Design',
          batchCode: 'BATCH A',
          maxMarks: 30,
          obtainedMarks: 20,
          feedbackText: 'Good effort, but check spacing proximity rules for question 2.',
          evaluationDate: '11/7/2026'
        }
      ]
    },
    {
      id: 5,
      studentName: 'Eshwar Rao',
      rollNumber: 'XE105',
      batchCode: 'BATCH B',
      grades: []
    },
    {
      id: 6,
      studentName: 'Farhan Ali',
      rollNumber: 'XE106',
      batchCode: 'BATCH A',
      grades: []
    }
  ];

  // Load from local storage submissions if they have been graded in previous steps
  const studentRecords = useMemo(() => {
    const savedSubmissions = localStorage.getItem('xebia_lms_submissions');
    if (!savedSubmissions) return initialRecords;

    try {
      const parsedSubmissions = JSON.parse(savedSubmissions);
      
      // Map submissions back to our academic record structures
      const recordsCopy = initialRecords.map(record => {
        // Find all submissions from this student that are GRADED
        const studentSubmissions = parsedSubmissions.filter(
          (sub: any) => sub.studentName === record.studentName && sub.status === 'GRADED'
        );

        // Map to grades
        const dynamicGrades: StudentQuizRecord[] = studentSubmissions.map((sub: any) => ({
          quizTitle: sub.assessmentTitle,
          category: sub.category,
          batchCode: sub.batchCode,
          maxMarks: sub.maxMarks,
          obtainedMarks: sub.obtainedMarks,
          feedbackText: sub.feedbackComment || 'Evaluation complete.',
          evaluationDate: sub.submissionTime.split(',')[0] || '14/7/2026'
        }));

        // Combine default items and dynamic graded items, removing duplicates by title
        const combinedGrades = [...dynamicGrades];
        record.grades.forEach(g => {
          if (!combinedGrades.some(cg => cg.quizTitle === g.quizTitle)) {
            combinedGrades.push(g);
          }
        });

        return {
          ...record,
          grades: combinedGrades
        };
      });

      return recordsCopy;
    } catch (e) {
      return initialRecords;
    }
  }, [selectedStudentId]);

  // Overall statistics
  const summaryStats = useMemo(() => {
    let totalObtained = 0;
    let totalMax = 0;
    let gradedQuizzesCount = 0;

    studentRecords.forEach(student => {
      student.grades.forEach(g => {
        if (g.obtainedMarks !== undefined) {
          totalObtained += g.obtainedMarks;
          totalMax += g.maxMarks;
          gradedQuizzesCount++;
        }
      });
    });

    const average = totalMax > 0 ? Math.round((totalObtained / totalMax) * 1000) / 10 : 86.4;
    return {
      classAverage: average,
      totalQuizzes: gradedQuizzesCount
    };
  }, [studentRecords]);

  // Active student record
  const activeRecord = useMemo(() => {
    return studentRecords.find(s => s.id === selectedStudentId) || studentRecords[0];
  }, [studentRecords, selectedStudentId]);

  // Filtered student list for Gradebook Table
  const filteredStudents = useMemo(() => {
    return studentRecords.filter(item => {
      // 1. Search Query
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesName = item.studentName.toLowerCase().includes(query);
        const matchesRoll = item.rollNumber.toLowerCase().includes(query);
        if (!matchesName && !matchesRoll) return false;
      }
      // 2. Batch Filter
      if (selectedBatch !== 'all' && item.batchCode !== selectedBatch) return false;

      return true;
    });
  }, [studentRecords, searchQuery, selectedBatch]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex-grow flex flex-col gap-6 md:gap-8 pb-10 relative"
    >
      {/* Top Navigation Search Strip */}
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

      {/* Header and Filter Controls */}
      <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-4 text-left">
        <div>
          <h2 className="text-xl md:text-2xl font-black text-brand-primaryDark tracking-tight">
            Academic Grades Board
          </h2>
          <p className="text-brand-muted text-xs md:text-sm leading-relaxed mt-0.5">
            Review overall candidate performance metrics and feedback sheets.
          </p>
        </div>

        {/* Filter Strip */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Timeframe selector tabs */}
          <div className="flex items-center gap-1 bg-white border border-neutral-200 p-1 rounded-xl shadow-xs">
            {[
              { label: 'All', value: 'all' },
              { label: 'Today', value: 'today' },
              { label: 'This Week', value: 'week' },
              { label: 'This Month', value: 'month' }
            ].map((tab, i) => (
              <button
                key={i}
                onClick={() => setSelectedTimeframe(tab.value as any)}
                className={`text-[10px] font-black tracking-wider uppercase px-3 py-1.5 rounded-lg transition-all ${
                  selectedTimeframe === tab.value
                    ? 'bg-brand-primary text-white'
                    : 'text-neutral-500 hover:bg-neutral-50'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Batch Selector */}
          <select
            value={selectedBatch}
            onChange={(e) => setSelectedBatch(e.target.value)}
            className="bg-white border border-neutral-200 rounded-xl py-2 px-3 text-[10px] font-black uppercase text-neutral-700 outline-none shadow-xs cursor-pointer"
          >
            <option value="all">All Batches</option>
            <option value="BATCH A">Batch A</option>
            <option value="BATCH B">Batch B</option>
            <option value="BATCH C">Batch C</option>
          </select>
        </div>
      </div>

      {/* Class Statistics Banner Card */}
      <div className="bg-brand-primaryDark text-white p-5 rounded-3xl shadow-sm text-left flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <span className="text-[9px] font-black uppercase tracking-widest text-brand-primary/20 opacity-80">Summary Stats</span>
          <h3 className="text-xl font-black mt-1 leading-tight">
            Class Average score: <span className="text-[#FFDF7D]">{summaryStats.classAverage}%</span>
          </h3>
        </div>
        <div className="flex items-center gap-3 bg-white/10 px-4 py-2.5 rounded-2xl border border-white/10 shrink-0">
          <Award className="w-5 h-5 text-[#FFDF7D]" />
          <div className="text-left leading-tight">
            <p className="text-[10px] font-black text-white/60 uppercase">Total Evaluated</p>
            <p className="text-xs font-bold mt-0.5">{summaryStats.totalQuizzes} Quizzes</p>
          </div>
        </div>
      </div>

      {/* Workspace Split Panels (DIFFERENT POSITIONS & STYLINGS FROM SINGLE CARDS GRID) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
        
        {/* Left Side: Gradebook Grid (2/3 width) */}
        <div className="lg:col-span-2 flex flex-col gap-4 bg-white border border-neutral-200/50 p-5 rounded-3xl shadow-sm">
          <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
            <h4 className="text-xs font-black text-brand-primaryDark uppercase tracking-wider flex items-center gap-1.5">
              <BookOpen className="w-4 h-4" /> Student Gradebook Grid
            </h4>
            <div className="relative w-48">
              <input
                type="text"
                placeholder="Search candidate..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-neutral-50 border border-neutral-200 rounded-xl py-1 px-3 pl-8 text-[11px] font-semibold text-neutral-800 placeholder-neutral-400 outline-none"
              />
              <Search className="w-3.5 h-3.5 text-neutral-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          {/* Gradebook Grid Content */}
          <div className="overflow-x-auto">
            <table className="w-full min-w-[500px] border-collapse text-left">
              <thead>
                <tr className="bg-neutral-50 border-b border-neutral-200/60 text-[9px] font-black text-brand-muted uppercase tracking-wider">
                  <th className="py-3.5 px-4">Student</th>
                  <th className="py-3.5 px-4 w-20">Batch</th>
                  <th className="py-3.5 px-4 w-24">Evaluations</th>
                  <th className="py-3.5 px-4 w-20">Avg Score</th>
                  <th className="py-3.5 px-4 w-12 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100 text-xs font-semibold text-neutral-800">
                {filteredStudents.map((student) => {
                  const isSelected = student.id === selectedStudentId;
                  
                  // Compute student average
                  let subObtained = 0;
                  let subMax = 0;
                  student.grades.forEach(g => {
                    if (g.obtainedMarks !== undefined) {
                      subObtained += g.obtainedMarks;
                      subMax += g.maxMarks;
                    }
                  });
                  const avg = subMax > 0 ? Math.round((subObtained / subMax) * 100) : null;

                  return (
                    <tr 
                      key={student.id} 
                      onClick={() => setSelectedStudentId(student.id)}
                      className={`cursor-pointer transition-colors ${
                        isSelected ? 'bg-brand-primary/10' : 'hover:bg-neutral-50/50'
                      }`}
                    >
                      {/* Name */}
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <div className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-[10px] ${
                            isSelected ? 'bg-brand-primary text-white' : 'bg-brand-primary/5 text-brand-primary'
                          }`}>
                            {student.studentName.split(' ').map(n => n[0]).join('')}
                          </div>
                          <span className="font-extrabold text-neutral-900">{student.studentName}</span>
                        </div>
                      </td>

                      {/* Batch */}
                      <td className="py-3 px-4">
                        <span className="text-[9px] font-black px-2 py-0.5 rounded bg-brand-primary/5 text-brand-primary border border-brand-primary/10">
                          {student.batchCode}
                        </span>
                      </td>

                      {/* Evaluated Count */}
                      <td className="py-3 px-4 text-neutral-500 font-bold">
                        {student.grades.length} Graded
                      </td>

                      {/* Avg Score */}
                      <td className="py-3 px-4">
                        {avg !== null ? (
                          <span className={`font-black ${avg >= 75 ? 'text-brand-success' : 'text-amber-500'}`}>
                            {avg}%
                          </span>
                        ) : (
                          <span className="text-neutral-400 font-bold">--</span>
                        )}
                      </td>

                      {/* Chevron indicator */}
                      <td className="py-3 px-4 text-center">
                        <ChevronRight className={`w-4 h-4 text-neutral-400 transition-transform ${isSelected ? 'translate-x-1 text-brand-primary' : ''}`} />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Side: Detailed Feedback Timeline Sheets (1/3 width) */}
        <div className="lg:col-span-1 flex flex-col gap-4 bg-gradient-to-br from-white via-brand-primary/[0.01] to-brand-primary/[0.04] border border-brand-primary/15 p-5 rounded-3xl shadow-sm text-left max-h-[560px] overflow-y-auto">
          <div className="border-b border-neutral-100 pb-3">
            <h4 className="text-xs font-black text-brand-primaryDark uppercase tracking-wider">
              Feedback Timeline: {activeRecord.studentName}
            </h4>
            <p className="text-[10px] text-brand-muted font-bold mt-0.5">
              Roll: {activeRecord.rollNumber} • {activeRecord.batchCode}
            </p>
          </div>

          {/* Feedback Timeline Sheets (Styled like reference card objects but with alternative UI) */}
          <div className="flex flex-col gap-4">
            {activeRecord.grades.map((grade, index) => (
              <div 
                key={index}
                className="bg-white border border-neutral-200/60 rounded-2xl p-4 shadow-xs relative flex flex-col justify-between"
              >
                {/* Top Badges and Score Tag */}
                <div className="flex justify-between items-start gap-4">
                  <div className="flex flex-wrap items-center gap-1.5">
                    {/* Red border badge (adapted from reference) */}
                    <span className="text-[8px] font-black uppercase tracking-wider px-2 py-0.5 rounded border border-red-200 bg-red-50/50 text-red-600">
                      {grade.batchCode}
                    </span>
                    <span className="text-[8px] font-black uppercase tracking-wider px-2 py-0.5 rounded border border-neutral-200 text-neutral-500">
                      {grade.category}
                    </span>
                  </div>

                  {/* Marks block box (green background tag) */}
                  <div className="bg-brand-success/10 text-brand-success border border-brand-success/15 px-2.5 py-0.5 rounded-lg text-center shrink-0">
                    <span className="text-xs font-black">{grade.obtainedMarks}</span>
                    <span className="text-[9px] text-neutral-400 font-bold"> / {grade.maxMarks}</span>
                  </div>
                </div>

                {/* Title */}
                <h5 className="font-extrabold text-xs text-neutral-900 mt-3 leading-snug">
                  {grade.quizTitle}
                </h5>
                <p className="text-[9px] text-brand-muted font-bold mt-0.5">
                  Student: <span className="text-neutral-700">{activeRecord.studentName}</span>
                </p>

                {/* Evaluation remarks text area panel */}
                <div className="mt-3 bg-neutral-50 border border-neutral-100 rounded-xl p-3 text-[11px] text-neutral-600 font-semibold leading-relaxed">
                  <p className="text-[8px] font-bold text-brand-muted uppercase tracking-wider mb-1">Instructor Evaluation Remarks</p>
                  {grade.feedbackText || 'No comments provided.'}
                </div>

                {/* Footer success label and Date */}
                <div className="flex items-center justify-between mt-3.5 border-t border-neutral-50 pt-2 text-[10px] text-neutral-500 font-bold">
                  <div className="flex items-center gap-1 text-brand-success">
                    <CheckCircle className="w-3.5 h-3.5" />
                    <span>Evaluated successfully</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-neutral-400" />
                    <span>{grade.evaluationDate}</span>
                  </div>
                </div>
              </div>
            ))}

            {activeRecord.grades.length === 0 && (
              <div className="py-16 flex flex-col items-center justify-center text-center text-brand-muted">
                <Award className="w-8 h-8 text-neutral-300 mb-2" />
                <p className="text-xs font-bold text-brand-primaryDark">No evaluations recorded</p>
                <p className="text-[10px] mt-0.5">This student has no graded quiz marks currently.</p>
              </div>
            )}
          </div>
        </div>

      </div>
    </motion.div>
  );
};
export default MarksPage;
