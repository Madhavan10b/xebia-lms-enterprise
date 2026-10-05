import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { 
  Search,
  Bell,
  Settings as SettingsIcon,
  Calendar,
  AlertTriangle,
  Clock,
  CheckCircle2,
  ChevronRight,
  Inbox,
  Filter
} from 'lucide-react';
import { useToast } from '../context/ToastContext';

interface DeadlineRecord {
  id: number;
  title: string;
  batchCode: string;
  category: string;
  deadlineDate: string;
  deadlineTime: string;
  dayOfMonth: number; // For Calendar binding
  status: 'OVERDUE' | 'DUE_SOON' | 'COMPLETED';
}

export const DeadlinesPage: React.FC = () => {
  const { showToast } = useToast();

  const [selectedBatch, setSelectedBatch] = useState('all');
  const [selectedTimeframe, setSelectedTimeframe] = useState<'all' | 'today' | 'week' | 'month'>('all');
  const [selectedDayFilter, setSelectedDayFilter] = useState<number | null>(null);

  // Chronological Deadlines Database (adapted from reference)
  const initialDeadlines: DeadlineRecord[] = [
    {
      id: 1,
      title: 'SQL Queries and Normalization Quiz (Uploaded File)',
      batchCode: 'BATCH C',
      category: 'BACK-END DEVELOPMENT',
      deadlineDate: '09/07/2026',
      deadlineTime: '5:18:00 am',
      dayOfMonth: 9,
      status: 'OVERDUE'
    },
    {
      id: 2,
      title: 'Assessment-03',
      batchCode: 'BATCH A',
      category: 'DSA',
      deadlineDate: '11/07/2026',
      deadlineTime: '10:54:00 am',
      dayOfMonth: 11,
      status: 'OVERDUE'
    },
    {
      id: 3,
      title: 'Assessment-02',
      batchCode: 'BATCH A',
      category: 'FRONT-END DEVELOPMENT',
      deadlineDate: '11/07/2026',
      deadlineTime: '10:56:00 am',
      dayOfMonth: 11,
      status: 'OVERDUE'
    },
    {
      id: 4,
      title: 'UI/UX Design Principles Quiz',
      batchCode: 'BATCH A',
      category: 'UI/UX DESIGN',
      deadlineDate: '12/07/2026',
      deadlineTime: '5:18:00 am',
      dayOfMonth: 12,
      status: 'OVERDUE'
    }
  ];

  // Dynamic submissions data to update completed status
  const deadlines = useMemo(() => {
    const savedSubmissions = localStorage.getItem('xebia_lms_submissions');
    if (!savedSubmissions) return initialDeadlines;

    try {
      const parsed = JSON.parse(savedSubmissions);
      return initialDeadlines.map(d => {
        // Find if all submissions for this quiz are GRADED
        const relatedSubmissions = parsed.filter((s: any) => s.assessmentTitle === d.title);
        const hasSubmissions = relatedSubmissions.length > 0;
        const allGraded = hasSubmissions && relatedSubmissions.every((s: any) => s.status === 'GRADED');
        
        if (allGraded) {
          return { ...d, status: 'COMPLETED' as const };
        }
        return d;
      });
    } catch (e) {
      return initialDeadlines;
    }
  }, []);

  // Filter deadlines list
  const filteredDeadlines = useMemo(() => {
    return deadlines.filter(d => {
      // 1. Batch Filter
      if (selectedBatch !== 'all' && d.batchCode !== selectedBatch) return false;
      // 2. Calendar Date Filter
      if (selectedDayFilter !== null && d.dayOfMonth !== selectedDayFilter) return false;
      
      return true;
    });
  }, [deadlines, selectedBatch, selectedDayFilter]);

  // Mini-Calendar Generator for July 2026
  // July 2026 starts on a Wednesday (3) and has 31 days.
  const calendarDays = useMemo(() => {
    const days = [];
    // Pad initial empty cells for Wednesday start
    for (let i = 0; i < 3; i++) {
      days.push(null);
    }
    // Days 1-31
    for (let d = 1; d <= 31; d++) {
      days.push(d);
    }
    return days;
  }, []);

  // Check if a calendar day has deadlines
  const dayHasDeadlines = (day: number) => {
    return deadlines.some(d => d.dayOfMonth === day);
  };

  const handleActionClick = (title: string) => {
    showToast(`Navigating to evaluations for: ${title}`);
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
            placeholder="Search classes, schedules, deadlnes..." 
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

      {/* Welcome Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-left border-b border-neutral-200/60 pb-5">
        <div>
          <h2 className="text-xl md:text-2xl font-black text-brand-primaryDark tracking-tight">
            Schedules & Deadlines
          </h2>
          <p className="text-brand-muted text-xs md:text-sm leading-relaxed mt-0.5">
            Keep track of upcoming quiz deadlines, cutoffs, and scheduled submissions.
          </p>
        </div>

        {/* Action Options */}
        <div className="flex items-center gap-3">
          {/* Timeframe Select Tabs */}
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

      {/* Split Calendar Layout (DIFFERENT FROM FLAT TIMELINE LIST REFERENCE) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        
        {/* Left Column: Interactive Mini Calendar widget (1/3 width) */}
        <div className="lg:col-span-1 flex flex-col gap-4 bg-white border border-neutral-200/50 p-5 rounded-3xl shadow-sm text-left">
          <div className="flex justify-between items-center border-b border-neutral-100 pb-3">
            <h4 className="text-xs font-black text-brand-primaryDark uppercase tracking-wider flex items-center gap-1.5">
              <Calendar className="w-4 h-4" /> July 2026
            </h4>
            {selectedDayFilter !== null && (
              <button 
                onClick={() => setSelectedDayFilter(null)}
                className="text-[9px] font-black text-brand-primary hover:text-brand-primaryDark uppercase"
              >
                Clear Filter
              </button>
            )}
          </div>

          {/* Calendar Grid */}
          <div className="grid grid-cols-7 gap-1 text-center text-xs font-bold text-neutral-400 mb-2">
            {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map((d, i) => (
              <div key={i} className="text-[10px] uppercase font-black">{d}</div>
            ))}
            {calendarDays.map((day, i) => {
              if (day === null) return <div key={i} className="p-2"></div>;
              
              const hasDeadline = dayHasDeadlines(day);
              const isSelected = selectedDayFilter === day;

              return (
                <button
                  key={i}
                  onClick={() => hasDeadline && setSelectedDayFilter(isSelected ? null : day)}
                  className={`p-2 rounded-xl text-xs font-extrabold transition-all ${
                    isSelected 
                      ? 'bg-brand-primary text-white font-black shadow-xs' 
                      : hasDeadline
                      ? 'bg-red-50 text-red-600 border border-red-100 font-black hover:bg-red-100'
                      : 'text-neutral-700 hover:bg-neutral-50'
                  }`}
                  disabled={!hasDeadline}
                >
                  {day}
                </button>
              );
            })}
          </div>

          {/* Deadline stats */}
          <div className="border-t border-neutral-100 pt-4 flex flex-col gap-2.5">
            <div className="flex items-center justify-between text-xs font-bold text-neutral-600">
              <span className="flex items-center gap-1.5 text-red-600">
                <AlertTriangle className="w-3.5 h-3.5" /> Overdue Tasks
              </span>
              <span className="bg-red-50 text-red-600 px-2 py-0.5 rounded-md font-black">
                {deadlines.filter(d => d.status === 'OVERDUE').length}
              </span>
            </div>
            <div className="flex items-center justify-between text-xs font-bold text-neutral-600">
              <span className="flex items-center gap-1.5 text-brand-success">
                <CheckCircle2 className="w-3.5 h-3.5" /> Evaluated Tasks
              </span>
              <span className="bg-brand-success/5 text-brand-success px-2 py-0.5 rounded-md font-black">
                {deadlines.filter(d => d.status === 'COMPLETED').length}
              </span>
            </div>
          </div>
        </div>

        {/* Right Column: Timeline Feed (2/3 width) */}
        <div className="lg:col-span-2 flex flex-col gap-4 bg-white border border-neutral-200/50 p-5 rounded-3xl shadow-sm text-left">
          <h4 className="text-xs font-black text-brand-primaryDark uppercase tracking-wider pb-3 border-b border-neutral-100">
            Chronological Cutoff Schedule
          </h4>

          {/* Chronological Vertical Timeline List */}
          <div className="flex flex-col gap-4 relative pl-4 border-l border-neutral-200/60 mt-2">
            {filteredDeadlines.map((d) => (
              <div key={d.id} className="relative flex flex-col gap-3">
                {/* Colored Node Dot */}
                <span className={`absolute -left-[22.5px] top-1.5 w-3 h-3 rounded-full border-2 bg-white ${
                  d.status === 'OVERDUE' ? 'border-red-500' : 'border-brand-success'
                }`}></span>

                {/* Timeline Card */}
                <div className={`p-4 bg-white border rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 transition-all hover:shadow-xs ${
                  d.status === 'OVERDUE' ? 'border-red-100 hover:border-red-200' : 'border-brand-success/15 hover:border-brand-success/30'
                }`}>
                  <div className="text-left flex-1">
                    <div className="flex flex-wrap items-center gap-1.5">
                      <span className="text-[8px] font-black uppercase tracking-wider px-2 py-0.5 rounded border border-brand-primary/10 bg-brand-primary/5 text-brand-primary">
                        {d.batchCode}
                      </span>
                      <span className="text-[8px] font-black uppercase tracking-wider px-2 py-0.5 rounded border border-neutral-200 text-neutral-500">
                        {d.category}
                      </span>
                      <span className={`text-[8px] font-black uppercase tracking-wider px-2 py-0.5 rounded border ${
                        d.status === 'OVERDUE'
                          ? 'border-red-200 bg-red-50 text-red-600'
                          : 'border-brand-success/20 bg-brand-success/5 text-brand-success'
                      }`}>
                        {d.status}
                      </span>
                    </div>

                    <h5 className="font-extrabold text-xs text-neutral-900 mt-2 leading-snug">
                      {d.title}
                    </h5>
                    
                    <div className="flex items-center gap-1 mt-2 text-[10px] text-neutral-400 font-extrabold">
                      <Clock className="w-3.5 h-3.5" />
                      <span>Deadline: {d.deadlineDate}, {d.deadlineTime}</span>
                    </div>
                  </div>

                  {/* Context Aware Action Button */}
                  <button
                    onClick={() => handleActionClick(d.title)}
                    className={`font-extrabold text-[10px] py-1.5 px-3.5 rounded-lg transition-all shrink-0 ${
                      d.status === 'OVERDUE'
                        ? 'bg-red-50 hover:bg-red-100 text-red-600 border border-red-200'
                        : 'bg-brand-success/5 hover:bg-brand-success/10 text-brand-success border border-brand-success/15'
                    }`}
                  >
                    {d.status === 'OVERDUE' ? 'Review Submissions' : 'View Graded Logs'}
                  </button>
                </div>
              </div>
            ))}

            {filteredDeadlines.length === 0 && (
              <div className="py-12 flex flex-col items-center justify-center text-center text-brand-muted pl-2">
                <Inbox className="w-8 h-8 text-neutral-300 mb-2" />
                <p className="text-xs font-bold text-brand-primaryDark">No cutoff schedules for this day</p>
                <p className="text-[10px] mt-0.5">Click "Clear Filter" to view all cutoff lists.</p>
              </div>
            )}
          </div>
        </div>

      </div>
    </motion.div>
  );
};
export default DeadlinesPage;
