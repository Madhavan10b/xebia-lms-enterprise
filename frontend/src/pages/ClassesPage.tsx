import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Video, 
  Users, 
  Calendar, 
  ChevronDown, 
  Clock, 
  Search,
  Bell,
  Settings as SettingsIcon,
  Plus,
  X
} from 'lucide-react';
import { useToast } from '../context/ToastContext';

interface ClassBatch {
  id: number;
  batchCode: string;
  className: string;
  topic: string;
  room: string;
  registeredCount: number;
  timeSlot: string;
  timelineGroup: 'today' | 'week' | 'month';
}

export const ClassesPage: React.FC = () => {
  const { showToast } = useToast();
  
  const userRole = useMemo(() => {
    const saved = localStorage.getItem('currentUser');
    return saved ? JSON.parse(saved).role : 'admin';
  }, []);
  
  // Filters
  const [timeline, setTimeline] = useState<'all' | 'today' | 'week' | 'month'>('all');
  const [selectedBatchFilter, setSelectedBatchFilter] = useState<string>('all');
  const [batchDropdownOpen, setBatchDropdownOpen] = useState(false);

  // Modal open/close
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form fields
  const [newBatchCode, setNewBatchCode] = useState('BATCH E');
  const [newClassName, setNewClassName] = useState('');
  const [newTopic, setNewTopic] = useState('');
  const [newRoom, setNewRoom] = useState('Virtual Room A');
  const [newRegisteredCount, setNewRegisteredCount] = useState<number>(0);
  const [newTimeSlot, setNewTimeSlot] = useState('02:00 PM - 03:30 PM');
  const [newTimelineGroup, setNewTimelineGroup] = useState<'today' | 'week' | 'month'>('today');

  // Custom reference-adapted batches
  const initialBatches: ClassBatch[] = [
    {
      id: 1,
      batchCode: 'BATCH A',
      className: 'Interaction Systems Design',
      topic: 'Design Principles',
      room: 'Virtual Room A',
      registeredCount: 28,
      timeSlot: '09:30 AM - 11:00 AM',
      timelineGroup: 'today'
    },
    {
      id: 2,
      batchCode: 'BATCH B',
      className: 'Client-Side Engineering',
      topic: 'React & TypeScript',
      room: 'Virtual Room A',
      registeredCount: 32,
      timeSlot: '10:15 AM - 11:45 AM',
      timelineGroup: 'today'
    },
    {
      id: 3,
      batchCode: 'BATCH C',
      className: 'Server-Side Persistence',
      topic: 'Java & Hibernate',
      room: 'Virtual Room A',
      registeredCount: 24,
      timeSlot: '11:00 AM - 12:30 PM',
      timelineGroup: 'week'
    },
    {
      id: 4,
      batchCode: 'BATCH D',
      className: 'Software Methodologies',
      topic: 'Agile & DevOps',
      room: 'Virtual Room A',
      registeredCount: 30,
      timeSlot: '12:00 PM - 01:30 PM',
      timelineGroup: 'month'
    }
  ];

  // Persistent Batches State
  const [batches, setBatches] = useState<ClassBatch[]>(() => {
    const saved = localStorage.getItem('xebia_lms_batches');
    return saved ? JSON.parse(saved) : initialBatches;
  });

  // Filtered list
  const filteredBatches = useMemo(() => {
    return batches.filter(batch => {
      // 1. Filter by timeline
      if (timeline !== 'all' && batch.timelineGroup !== timeline) {
        return false;
      }
      // 2. Filter by batch dropdown selector
      if (selectedBatchFilter !== 'all' && batch.batchCode !== selectedBatchFilter) {
        return false;
      }
      return true;
    });
  }, [batches, timeline, selectedBatchFilter]);

  const handleManageStudents = (batchCode: string, className: string) => {
    showToast(`Opening student registry for ${batchCode} - ${className}`);
  };

  const handleCreateClassSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newClassName.trim() || !newTopic.trim() || !newTimeSlot.trim()) {
      showToast('Please fill in all required fields');
      return;
    }

    const newBatch: ClassBatch = {
      id: Date.now(),
      batchCode: newBatchCode.toUpperCase().trim(),
      className: newClassName.trim(),
      topic: newTopic.trim(),
      room: newRoom.trim() || 'Virtual Room A',
      registeredCount: Number(newRegisteredCount) || 0,
      timeSlot: newTimeSlot.trim(),
      timelineGroup: newTimelineGroup
    };

    const updated = [...batches, newBatch];
    setBatches(updated);
    localStorage.setItem('xebia_lms_batches', JSON.stringify(updated));

    // Reset Form
    setNewBatchCode(`BATCH ${String.fromCharCode(65 + updated.length)}`);
    setNewClassName('');
    setNewTopic('');
    setNewRoom('Virtual Room A');
    setNewRegisteredCount(0);
    setNewTimeSlot('02:00 PM - 03:30 PM');
    setNewTimelineGroup('today');

    setIsModalOpen(false);
    showToast(`Successfully created ${newBatch.batchCode} - ${newBatch.className}`);
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
      {/* Top Bar matching dashboard design */}
      <div className="flex flex-col md:flex-row justify-between items-stretch md:items-center gap-4 bg-white/45 backdrop-blur-md border border-neutral-200/40 p-4 rounded-2xl shadow-[0_2px_12px_rgba(0,0,0,0.01)]">
        <div className="relative flex-1 max-w-md">
          <input 
            type="text" 
            placeholder="Search classes, schedules, assignments..." 
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

      {/* Welcome Title, Create Class button & Filter Row */}
      <div className="flex flex-col xl:flex-row justify-between items-stretch xl:items-center gap-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 w-full xl:w-auto xl:flex-grow">
          <div>
            <h2 className="text-xl md:text-2xl font-black text-brand-primaryDark tracking-tight text-left">
              Class Directories
            </h2>
            <p className="text-brand-muted text-xs md:text-sm leading-relaxed mt-0.5 text-left">
              Manage batch assignments, course topics, and schedules.
            </p>
          </div>
          {userRole !== 'student' && (
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setIsModalOpen(true)}
              className="self-start sm:self-center bg-brand-primary hover:bg-brand-primaryDark text-white font-extrabold text-xs px-5 py-2.5 rounded-xl flex items-center gap-2 shadow-sm transition-all duration-150"
            >
              <Plus className="w-4 h-4" /> Create Class
            </motion.button>
          )}
        </div>

        {/* Dashboard Filters matching reference exactly */}
        <div className="flex flex-wrap items-center gap-3 bg-white border border-neutral-200/80 p-1.5 rounded-2xl shadow-sm self-stretch xl:self-auto">
          {/* Timeline tabs */}
          <div className="flex items-center gap-1 bg-neutral-100/80 p-1 rounded-xl">
            <span className="text-[9px] font-black text-brand-muted uppercase tracking-wider px-2 hidden sm:inline">Timeline:</span>
            {(['all', 'today', 'week', 'month'] as const).map((t) => (
              <button
                key={t}
                onClick={() => setTimeline(t)}
                className={`px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase transition-all ${
                  timeline === t
                    ? 'bg-brand-primary text-white shadow-sm'
                    : 'text-brand-muted hover:text-brand-primary'
                }`}
              >
                {t === 'all' ? 'All' : t}
              </button>
            ))}
          </div>

          <div className="h-6 border-l border-neutral-200 mx-1 hidden sm:block"></div>

          {/* Batch Dropdown Selector */}
          <div className="relative flex-grow sm:flex-grow-0">
            <button
              onClick={() => setBatchDropdownOpen(!batchDropdownOpen)}
              className="w-full sm:w-auto bg-white border border-neutral-200 hover:border-brand-primary/20 px-3.5 py-1.5 rounded-xl text-[10px] font-bold uppercase text-brand-primaryDark flex items-center justify-between gap-2.5 transition-all shadow-sm"
            >
              <span>Batch: <span className="text-brand-primary font-extrabold">{selectedBatchFilter === 'all' ? 'All Batches' : selectedBatchFilter}</span></span>
              <ChevronDown className="w-3.5 h-3.5 text-neutral-400" />
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
                  {Array.from(new Set(batches.map(b => b.batchCode))).map((b) => (
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

      {/* Grid of Class cards matching screenshot design */}
      <motion.div 
        variants={containerVariants}
        className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8"
      >
        {filteredBatches.map((batch) => (
          <motion.div
            key={batch.id}
            variants={cardVariants}
            whileHover={{ y: -3, transition: { duration: 0.15 } }}
            className="group glass-panel p-6 rounded-3xl border border-neutral-200/50 shadow-[0_2px_12px_rgba(0,0,0,0.01)] hover:shadow-md transition-all duration-250 flex flex-col justify-between relative overflow-hidden class-card-hover"
          >
            {/* Top Row: Batch badge and icon */}
            <div className="flex justify-between items-start mb-4">
              <span className="text-[10px] font-black tracking-wider px-3 py-1 rounded-full bg-brand-primary/5 text-brand-primary border border-brand-primary/10 transition-all duration-200">
                {batch.batchCode}
              </span>
              <div className="p-2.5 rounded-xl bg-brand-primary/5 text-brand-primary border border-brand-primary/10 flex items-center justify-center transition-all duration-200">
                <Calendar className="w-4 h-4" />
              </div>
            </div>

            {/* Middle Row: Class title and subtitle */}
            <div className="text-left mb-6">
              <h3 className="text-base font-extrabold text-brand-primaryDark tracking-tight mb-1.5 group-hover:!text-brand-primary transition-colors duration-200">
                {batch.className}
              </h3>
              <p className="text-xs text-brand-muted font-bold tracking-tight transition-colors duration-200">
                {batch.topic}
              </p>
            </div>

            {/* Separator line inside card */}
            <div className="border-b border-neutral-100/80 transition-colors duration-200 mb-5"></div>

            {/* Badges info row */}
            <div className="flex flex-wrap items-center justify-between gap-3 text-left mb-6">
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1.5 text-xs text-brand-success font-semibold transition-colors duration-200">
                  <Video className="w-4 h-4 text-brand-success/80" />
                  <span>{batch.room}</span>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-brand-muted font-semibold transition-colors duration-200">
                  <Users className="w-4 h-4 text-brand-muted/70" />
                  <span>{batch.registeredCount} Registered</span>
                </div>
              </div>
            </div>

            {/* Bottom Row: Time and Button */}
            <div className="flex items-center justify-between gap-4 mt-auto">
              <div className="flex items-center gap-1.5 text-xs font-extrabold text-brand-primaryDark bg-brand-primary/5 px-3 py-2 rounded-xl transition-all duration-200">
                <Clock className="w-3.5 h-3.5 text-brand-primary" />
                <span>{batch.timeSlot}</span>
              </div>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleManageStudents(batch.batchCode, batch.className)}
                className="bg-brand-primaryDark hover:bg-brand-primary text-white font-extrabold text-xs py-2 px-4 rounded-xl transition-all duration-200 shadow-sm"
              >
                Manage Students
              </motion.button>
            </div>

          </motion.div>
        ))}

        {filteredBatches.length === 0 && (
          <div className="col-span-full py-16 flex flex-col items-center justify-center text-center bg-white border border-neutral-200/50 rounded-3xl">
            <Calendar className="w-10 h-10 text-neutral-300 mb-3" />
            <p className="text-sm font-bold text-brand-primaryDark">No classes scheduled</p>
            <p className="text-xs text-brand-muted mt-1">Adjust your timeline or batch filters and try again.</p>
          </div>
        )}
      </motion.div>

      {/* Create Class Dialog Modal */}
      <AnimatePresence>
        {isModalOpen && (
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
                  <Calendar className="w-4.5 h-4.5 text-brand-primary" /> Create Class Batch
                </h3>
                <button 
                  onClick={() => setIsModalOpen(false)}
                  className="p-1 rounded-lg text-brand-muted hover:text-red-500 hover:bg-neutral-50 transition-all"
                >
                  <X className="w-4.5 h-4.5" />
                </button>
              </div>

              <form onSubmit={handleCreateClassSubmit} className="flex flex-col gap-4">
                {/* Batch Code & Room */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[9px] font-black text-brand-muted uppercase tracking-wider">Batch Code</label>
                    <input 
                      type="text" 
                      required
                      placeholder="e.g. BATCH E"
                      value={newBatchCode}
                      onChange={(e) => setNewBatchCode(e.target.value)}
                      className="w-full bg-neutral-50 border border-neutral-200 focus:border-brand-primary/40 focus:bg-white rounded-xl py-2 px-3 text-xs font-semibold text-neutral-800 outline-none transition-all focus:ring-2 focus:ring-brand-primary/5"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[9px] font-black text-brand-muted uppercase tracking-wider">Room Designation</label>
                    <input 
                      type="text" 
                      required
                      placeholder="e.g. Virtual Room A"
                      value={newRoom}
                      onChange={(e) => setNewRoom(e.target.value)}
                      className="w-full bg-neutral-50 border border-neutral-200 focus:border-brand-primary/40 focus:bg-white rounded-xl py-2 px-3 text-xs font-semibold text-neutral-800 outline-none transition-all focus:ring-2 focus:ring-brand-primary/5"
                    />
                  </div>
                </div>

                {/* Class / Course Name */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-[9px] font-black text-brand-muted uppercase tracking-wider">Class Name</label>
                  <input 
                    type="text" 
                    required
                    placeholder="e.g. Cloud Native Architectures"
                    value={newClassName}
                    onChange={(e) => setNewClassName(e.target.value)}
                    className="w-full bg-neutral-50 border border-neutral-200 focus:border-brand-primary/40 focus:bg-white rounded-xl py-2 px-3 text-xs font-semibold text-neutral-800 outline-none transition-all focus:ring-2 focus:ring-brand-primary/5"
                  />
                </div>

                {/* Course Topic */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-[9px] font-black text-brand-muted uppercase tracking-wider">Course Topic / Subject</label>
                  <input 
                    type="text" 
                    required
                    placeholder="e.g. AWS & Kubernetes Core"
                    value={newTopic}
                    onChange={(e) => setNewTopic(e.target.value)}
                    className="w-full bg-neutral-50 border border-neutral-200 focus:border-brand-primary/40 focus:bg-white rounded-xl py-2 px-3 text-xs font-semibold text-neutral-800 outline-none transition-all focus:ring-2 focus:ring-brand-primary/5"
                  />
                </div>

                {/* Time Slot & Timeline Group */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[9px] font-black text-brand-muted uppercase tracking-wider">Time Slot Schedule</label>
                    <input 
                      type="text" 
                      required
                      placeholder="e.g. 02:00 PM - 03:30 PM"
                      value={newTimeSlot}
                      onChange={(e) => setNewTimeSlot(e.target.value)}
                      className="w-full bg-neutral-50 border border-neutral-200 focus:border-brand-primary/40 focus:bg-white rounded-xl py-2 px-3 text-xs font-semibold text-neutral-800 outline-none transition-all focus:ring-2 focus:ring-brand-primary/5"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[9px] font-black text-brand-muted uppercase tracking-wider">Timeline Filter</label>
                    <select
                      value={newTimelineGroup}
                      onChange={(e) => setNewTimelineGroup(e.target.value as any)}
                      className="w-full bg-neutral-50 border border-neutral-200 focus:border-brand-primary/40 focus:bg-white rounded-xl py-2 px-2.5 text-xs font-semibold text-neutral-800 outline-none transition-all focus:ring-2 focus:ring-brand-primary/5"
                    >
                      <option value="today">Today</option>
                      <option value="week">This Week</option>
                      <option value="month">This Month</option>
                    </select>
                  </div>
                </div>

                {/* Enrolled students */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-[9px] font-black text-brand-muted uppercase tracking-wider">Enrolled Students Count</label>
                  <input 
                    type="number" 
                    min="0"
                    placeholder="0"
                    value={newRegisteredCount || ''}
                    onChange={(e) => setNewRegisteredCount(Number(e.target.value))}
                    className="w-full bg-neutral-50 border border-neutral-200 focus:border-brand-primary/40 focus:bg-white rounded-xl py-2 px-3 text-xs font-semibold text-neutral-800 outline-none transition-all focus:ring-2 focus:ring-brand-primary/5"
                  />
                </div>

                {/* Action Buttons */}
                <div className="flex items-center justify-end gap-3 mt-4 border-t border-neutral-100 pt-4">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
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
                    Save Class
                  </motion.button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};
export default ClassesPage;
