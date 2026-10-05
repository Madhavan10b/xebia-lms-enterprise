import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { 
  User,
  Mail,
  Shield,
  Key,
  Database,
  CheckCircle,
  FileText,
  Activity,
  Lock,
  Eye,
  Settings as SettingsIcon,
  Bell,
  Search
} from 'lucide-react';
import { useToast } from '../context/ToastContext';

export const ProfilePage: React.FC = () => {
  const { showToast } = useToast();

  const [activeTab, setActiveTab] = useState<'courses' | 'security' | 'stats'>('courses');

  // Security form states
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Dynamically calculate stats from local storage for Tab 3
  const userStats = useMemo(() => {
    const savedSubmissions = localStorage.getItem('xebia_lms_submissions');
    const savedMaterials = localStorage.getItem('xebia_lms_materials');
    
    let gradedCount = 2; // Default mock Aarav + Divya
    if (savedSubmissions) {
      try {
        const parsed = JSON.parse(savedSubmissions);
        gradedCount = parsed.filter((s: any) => s.status === 'GRADED').length;
      } catch (e) {}
    }

    let materialsCount = 4; // Default mock folders count
    if (savedMaterials) {
      try {
        const parsed = JSON.parse(savedMaterials);
        materialsCount = parsed.length;
      } catch (e) {}
    }

    return {
      gradedSubmissions: gradedCount,
      uploadedMaterials: materialsCount,
      securityClearance: 'L3 Principal Access',
      lastLogin: new Date().toLocaleDateString('en-GB')
    };
  }, []);

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPassword || !newPassword || !confirmPassword) {
      showToast('Please fill all password fields.');
      return;
    }
    if (newPassword !== confirmPassword) {
      showToast('New passwords do not match.');
      return;
    }
    showToast('Successfully updated security credentials.');
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
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
            placeholder="Search classes, profile settings, credentials..." 
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
      <div className="text-left border-b border-neutral-200/60 pb-5">
        <h2 className="text-xl md:text-2xl font-black text-brand-primaryDark tracking-tight">
          User Profile Settings
        </h2>
        <p className="text-brand-muted text-xs md:text-sm leading-relaxed mt-0.5">
          Manage registration parameters, profiles, and active security keys.
        </p>
      </div>

      {/* Split Profile Layout (DIFFERENT FROM STANDARD TWO FLOATING CARDS REFERENCE) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
        
        {/* Left Column: Glassmorphic Profile Card (1/3 width) */}
        <div className="lg:col-span-1 flex flex-col items-center bg-gradient-to-br from-white via-brand-primary/[0.01] to-brand-primary/[0.04] border border-brand-primary/15 p-6 rounded-3xl shadow-sm text-center justify-between">
          <div className="flex flex-col items-center w-full">
            {/* Styled Avatar Circle */}
            <div className="relative w-24 h-24 rounded-full border-4 border-brand-primary/10 overflow-hidden shadow-inner flex items-center justify-center bg-brand-primary/5">
              <User className="w-12 h-12 text-brand-primary" />
            </div>
            
            <h3 className="text-base font-black text-brand-primaryDark mt-4">
              Shan Ali
            </h3>
            <span className="text-[9px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded bg-brand-primary/5 text-brand-primary border border-brand-primary/10 mt-1">
              Principal Instructor
            </span>

            {/* Profile Info Details List */}
            <div className="w-full flex flex-col gap-3.5 mt-8 border-t border-neutral-100 pt-6 text-left">
              <div className="flex items-center gap-3 text-xs font-semibold text-neutral-600">
                <Mail className="w-4 h-4 text-brand-muted shrink-0" />
                <span className="truncate">teacher@lms.com</span>
              </div>
              <div className="flex items-center gap-3 text-xs font-semibold text-neutral-600">
                <Shield className="w-4 h-4 text-brand-muted shrink-0" />
                <span>Teacher Role Permissions</span>
              </div>
              <div className="flex items-center gap-3 text-xs font-semibold text-neutral-600">
                <Database className="w-4 h-4 text-brand-muted shrink-0" />
                <span>Faculty ID: XE-T808</span>
              </div>
            </div>
          </div>

          <span className="text-[9px] text-neutral-400 font-extrabold mt-8 border-t border-neutral-100 pt-4 w-full text-center">
            Registered joining date: 01/03/2026
          </span>
        </div>

        {/* Right Column: Administrative Settings Tabbed Sheet (2/3 width) */}
        <div className="lg:col-span-2 flex flex-col bg-white border border-neutral-200/50 p-6 rounded-3xl shadow-sm text-left justify-between min-h-[420px]">
          
          {/* Tab Options Header */}
          <div className="flex flex-col gap-5">
            <div className="flex items-center gap-1.5 border-b border-neutral-100 pb-3">
              {[
                { id: 'courses', label: 'Academic Enrolled Tracks' },
                { id: 'security', label: 'Security & Mode Config' },
                { id: 'stats', label: 'Instructor Statistics' }
              ].map((tab, i) => (
                <button
                  key={i}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`text-[10px] font-black uppercase tracking-wider px-3.5 py-2 rounded-xl transition-all ${
                    activeTab === tab.id
                      ? 'bg-brand-primary text-white shadow-xs'
                      : 'text-neutral-500 hover:bg-neutral-50'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Tab Contents */}
            <div className="flex-grow text-left">
              {activeTab === 'courses' && (
                <div className="flex flex-col gap-4">
                  {/* Course list */}
                  <div className="bg-neutral-50 border border-neutral-100 rounded-2xl p-4">
                    <h5 className="text-[10px] font-black text-brand-muted uppercase tracking-wider mb-2">Active Course Enrolled</h5>
                    <p className="text-xs font-black text-neutral-800 leading-relaxed">
                      UI/UX Design, React Frontend & Node Backend Development tracks
                    </p>
                  </div>

                  {/* Batches cards list */}
                  <div>
                    <h5 className="text-[10px] font-black text-brand-muted uppercase tracking-wider mb-2">Enrolled Student Batches</h5>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      {[
                        { title: 'Batch A', desc: 'UI/UX Design' },
                        { title: 'Batch B', desc: 'Full Stack Dev' },
                        { title: 'Batch C', desc: 'Mobile Dev' }
                      ].map((batch, idx) => (
                        <div key={idx} className="border border-neutral-200/60 rounded-xl p-3.5">
                          <span className="text-[9px] font-black px-2 py-0.5 rounded bg-brand-primary/5 text-brand-primary">
                            {batch.title}
                          </span>
                          <p className="text-xs font-bold text-neutral-800 mt-2">{batch.desc}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'security' && (
                <div className="flex flex-col gap-5">
                  {/* Security tags row */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-brand-success/5 border border-brand-success/15 rounded-2xl p-4">
                      <p className="text-[9px] font-black text-brand-success uppercase tracking-wider mb-1">Security Status</p>
                      <p className="text-xs font-bold text-neutral-800 leading-none mt-1.5 flex items-center gap-1.5">
                        <Lock className="w-3.5 h-3.5 text-brand-success" />
                        Session Authenticated (JWT)
                      </p>
                    </div>
                    <div className="bg-brand-primary/5 border border-brand-primary/10 rounded-2xl p-4">
                      <p className="text-[9px] font-black text-brand-primary uppercase tracking-wider mb-1">System Mode</p>
                      <p className="text-xs font-bold text-neutral-800 leading-none mt-1.5 flex items-center gap-1.5">
                        <Key className="w-3.5 h-3.5 text-brand-primary" />
                        Local Cache Simulation Active
                      </p>
                    </div>
                  </div>

                  {/* Password update form */}
                  <form onSubmit={handlePasswordSubmit} className="flex flex-col gap-3.5 border-t border-neutral-100 pt-4 mt-1">
                    <h5 className="text-[10px] font-black text-brand-muted uppercase tracking-wider">Update Account Security</h5>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <input 
                        type="password"
                        required
                        placeholder="Current password"
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        className="bg-neutral-50 border border-neutral-200 focus:bg-white focus:border-brand-primary/30 rounded-xl py-2 px-3 text-xs font-semibold outline-none"
                      />
                      <input 
                        type="password"
                        required
                        placeholder="New password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className="bg-neutral-50 border border-neutral-200 focus:bg-white focus:border-brand-primary/30 rounded-xl py-2 px-3 text-xs font-semibold outline-none"
                      />
                      <input 
                        type="password"
                        required
                        placeholder="Confirm password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="bg-neutral-50 border border-neutral-200 focus:bg-white focus:border-brand-primary/30 rounded-xl py-2 px-3 text-xs font-semibold outline-none"
                      />
                    </div>

                    <button 
                      type="submit"
                      className="bg-brand-primary hover:bg-brand-primaryDark text-white font-extrabold text-[10px] py-2 px-4 rounded-xl transition-all self-end"
                    >
                      Update Security Configuration
                    </button>
                  </form>
                </div>
              )}

              {activeTab === 'stats' && (
                <div className="flex flex-col gap-4">
                  <h5 className="text-[10px] font-black text-brand-muted uppercase tracking-wider">Faculty Portal Metrics</h5>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="border border-neutral-200/60 rounded-2xl p-4 text-left">
                      <CheckCircle className="w-5 h-5 text-brand-success mb-2" />
                      <p className="text-[10px] font-black text-neutral-400 uppercase leading-none">Evaluations Completed</p>
                      <p className="text-xl font-black text-neutral-800 mt-2">{userStats.gradedSubmissions}</p>
                    </div>

                    <div className="border border-neutral-200/60 rounded-2xl p-4 text-left">
                      <FileText className="w-5 h-5 text-brand-primary mb-2" />
                      <p className="text-[10px] font-black text-neutral-400 uppercase leading-none">Uploaded Slide Decks</p>
                      <p className="text-xl font-black text-neutral-800 mt-2">{userStats.uploadedMaterials}</p>
                    </div>

                    <div className="border border-neutral-200/60 rounded-2xl p-4 text-left">
                      <Activity className="w-5 h-5 text-amber-500 mb-2" />
                      <p className="text-[10px] font-black text-neutral-400 uppercase leading-none">Access Clearance</p>
                      <p className="text-xs font-black text-neutral-800 mt-3 truncate">{userStats.securityClearance}</p>
                    </div>
                  </div>

                  <div className="mt-4 bg-neutral-50 border border-neutral-100 rounded-2xl p-3 text-xs font-semibold text-neutral-500 text-center">
                    Session activity logs synchronize with local database. Last authentication check: {userStats.lastLogin}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

      </div>
    </motion.div>
  );
};
export default ProfilePage;
