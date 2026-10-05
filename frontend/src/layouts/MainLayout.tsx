import React, { useMemo } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Home, BookOpen, Tag, Layers, Users, BarChart3, Settings, GraduationCap, Video, LogOut, ClipboardList, Inbox, Award, Folder, Calendar, User } from 'lucide-react';
import { getIsLiveApi } from '../services/api';

interface MainLayoutProps {
  children: React.ReactNode;
  pageTitle: string;
  onLogout?: () => void;
}

export const MainLayout: React.FC<MainLayoutProps> = ({ children, pageTitle, onLogout }) => {
  const isLive = getIsLiveApi();
  const location = useLocation();
  const navigate = useNavigate();

  const currentUser = useMemo(() => {
    const saved = localStorage.getItem('currentUser');
    return saved ? JSON.parse(saved) : { name: 'Teacher User', email: 'teacher@xebia.com', role: 'admin' };
  }, []);

  const menuItems = useMemo(() => {
    const base = [
      { name: 'Dashboard', path: '/', icon: Home },
      { name: 'Classes', path: '/classes', icon: BookOpen },
      { name: 'Assessments', path: '/assessments', icon: ClipboardList },
      { name: 'Submissions', path: '/submissions', icon: Inbox },
      { name: 'Marks', path: '/marks', icon: Award },
      { name: 'Materials', path: '/materials', icon: Folder },
      { name: 'Deadlines', path: '/deadlines', icon: Calendar },
      { name: 'Events', path: '/events', icon: Calendar },
      { name: 'Courses', path: '/courses', icon: GraduationCap },
      { name: 'Categories', path: '/categories', icon: Tag },
      { name: 'Curriculum', path: '/curriculum', icon: Layers },
      { name: 'Users', path: '/users', icon: Users },
      { name: 'Settings', path: '/settings', icon: Settings },
    ];

    if (currentUser.role === 'student') {
      return [
        { name: 'Student Catalog', path: '/catalog', icon: GraduationCap },
        { name: 'Learning Room', path: '/learning', icon: BookOpen },
        { name: 'Video Summarizer', path: '/summarizer', icon: Video },
        { name: 'My Certificate', path: '/certificate', icon: Award },
        { name: 'Events', path: '/events', icon: Calendar },
        ...base.filter(item => item.name !== 'Users' && item.name !== 'Dashboard' && item.name !== 'Marks' && item.name !== 'Events'),
      ];
    }
    if (currentUser.role === 'superadmin') {
      return base.filter(item => 
        item.name !== 'Classes' &&
        item.name !== 'Assessments' &&
        item.name !== 'Submissions' &&
        item.name !== 'Materials' &&
        item.name !== 'Deadlines' &&
        item.name !== 'Curriculum' &&
        item.name !== 'Categories'
      );
    }
    return base;
  }, [currentUser.role]);

  // Helper to generate breadcrumbs
  const getBreadcrumbs = () => {
    const paths = location.pathname.split('/').filter(Boolean);
    if (paths.length === 0) return ['Dashboard'];
    
    return ['Dashboard', ...paths.map(p => {
      // capitalize first letter and replace hyphens
      return p.charAt(0).toUpperCase() + p.slice(1).replace(/-/g, ' ');
    })];
  };

  const breadcrumbs = getBreadcrumbs();

  return (
    <div className="relative min-h-screen flex text-brand-text bg-[#FAFBFD] font-sans selection:bg-brand-primary/10 selection:text-brand-primary overflow-x-hidden">
      {/* Decorative Radial Grid Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#e2e8f0_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f0_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_70%_60%_at_50%_50%,#000_75%,transparent_100%)] opacity-[0.4] pointer-events-none z-0"></div>

      {/* Ambient Colored Light Spheres */}
      <div className="absolute top-[-10%] right-[10%] w-[450px] h-[450px] rounded-full bg-[#84117C]/3 blur-[100px] pointer-events-none z-0"></div>
      <div className="absolute bottom-[-15%] left-[25%] w-[500px] h-[500px] rounded-full bg-[#01AC9F]/3.5 blur-[110px] pointer-events-none z-0"></div>

      {/* Sidebar navigation */}
      <aside className="fixed left-0 md:left-4 top-0 md:top-4 h-screen md:h-[calc(100vh-2rem)] w-20 md:w-[260px] bg-brand-primaryDark border-r md:border border-white/5 text-white flex flex-col p-4 md:p-5 transition-all duration-200 z-50 shadow-xl md:rounded-2xl">
        {/* Brand */}
        <div className="flex flex-col mb-8 mt-2 px-3 self-start w-full">
          <motion.div 
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="flex items-center select-none cursor-pointer"
            onClick={() => navigate('/')}
          >
            <svg className="h-8 w-auto text-white" viewBox="20 0 140 56" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M22.5 5.5H35.5L47.5 24.5L59.5 5.5H72.5L54.5 28.5L72.5 51.5H59.5L47.5 32.5L35.5 51.5H22.5L40.5 28.5L22.5 5.5Z" fill="currentColor" />
              <text x="74" y="38" fontFamily="Outfit, sans-serif" fontWeight="900" fontSize="34" fill="currentColor" letterSpacing="-1.5">ebia</text>
            </svg>
            <span className="ml-1.5 px-1.5 py-0.5 rounded bg-white/10 text-[8px] font-black uppercase text-white/95 tracking-wider border border-white/5">
              LMS
            </span>
          </motion.div>
          <span className="text-[9px] text-white/50 font-bold uppercase tracking-wider pl-0.5 mt-1.5">
            {currentUser.role === 'superadmin' 
              ? 'Admin Portal' 
              : currentUser.role === 'admin' 
                ? 'Teacher Portal' 
                : 'Student Portal'}
          </span>
        </div>

        {/* Separator */}
        <div className="border-b border-white/10 mb-6 mx-2 hidden md:block"></div>

        {/* Section Title */}
        <div className="hidden md:block text-[9px] font-black text-white/40 tracking-widest uppercase mb-4 px-3">
          {currentUser.role === 'admin' ? 'Instructor Space' : 'Student Space'}
        </div>

        {/* Navigation list */}
        <nav className="flex-1 px-1 overflow-y-auto scrollbar-none pr-1">
          <ul className="flex flex-col gap-1.5">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <li key={item.path} className="relative">
                  <NavLink
                    to={item.path}
                    className={`relative z-10 flex items-center gap-3.5 px-4 py-2.5 rounded-lg text-xs font-semibold cursor-pointer transition-all duration-200 ${
                      isActive
                        ? 'text-white font-extrabold'
                        : 'text-white/70 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    <Icon className="w-4.5 h-4.5 flex-shrink-0" />
                    <span className="hidden md:inline tracking-tight">{item.name}</span>
                    {isActive && (
                      <motion.div
                        layoutId="activeNavIndicator"
                        className="absolute inset-0 bg-brand-primary rounded-lg -z-10 shadow-sm shadow-brand-primary/20"
                        transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                      />
                    )}
                  </NavLink>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Sidebar Footer - User Profile */}
        <div className="mt-auto border-t border-white/10 pt-4 flex flex-col gap-3">
          <div className="flex items-center justify-between gap-2 px-2 w-full">
            <div className="flex items-center gap-3 overflow-hidden">
              <div className="w-9 h-9 rounded-full bg-white/15 flex items-center justify-center font-extrabold text-xs text-white border border-white/10 flex-shrink-0 shadow-sm uppercase">
                {currentUser.name.charAt(0)}
              </div>
              <div className="hidden md:flex flex-col overflow-hidden text-left">
                <span className="text-xs font-bold text-white truncate leading-tight tracking-wide">{currentUser.name}</span>
                <span className="text-[9px] text-white/60 truncate leading-none mt-1 tracking-wider">{currentUser.email}</span>
              </div>
            </div>
            {onLogout && (
              <button 
                type="button" 
                onClick={onLogout} 
                title="Log Out"
                className="p-2 rounded-lg text-white/60 hover:text-red-400 hover:bg-white/5 transition-all flex-shrink-0"
              >
                <LogOut className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </aside>

      {/* Main content wrapper */}
      <div className="flex-1 ml-20 md:ml-[290px] p-6 md:p-8 md:pt-4 min-h-screen flex flex-col transition-all duration-300 relative z-10">
        
        {/* Top Header Bar */}
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 pb-4 border-b border-neutral-100">
          <div className="flex flex-col gap-1">
            {/* Breadcrumbs */}
            <div className="flex items-center gap-1.5 text-[9px] font-bold text-brand-muted uppercase tracking-widest">
              {breadcrumbs.map((bc, idx) => (
                <React.Fragment key={idx}>
                  {idx > 0 && <span className="text-brand-muted/30">/</span>}
                  <span className={idx === breadcrumbs.length - 1 ? 'text-brand-primary font-extrabold' : 'hover:text-brand-primary cursor-pointer'} onClick={() => idx === 0 && navigate('/')}>
                    {bc}
                  </span>
                </React.Fragment>
              ))}
            </div>
            
            {/* Page title */}
            <h1 className="text-xl md:text-2xl font-black text-brand-primaryDark tracking-tight mt-0.5">
              {pageTitle}
            </h1>
          </div>

          <div className="flex items-center gap-2">
            {/* Student View Button */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate('/catalog')}
              className="text-[11px] font-bold text-brand-primary flex items-center gap-1.5 bg-brand-primary/5 hover:bg-brand-primary/10 px-4 py-2 rounded-full border border-brand-primary/10 transition-all duration-150"
            >
              <GraduationCap className="w-3.5 h-3.5" />
              <span>Student Mode</span>
            </motion.button>

            {/* Live Sync Badge */}
            <span className="text-[11px] font-bold text-brand-success flex items-center gap-1.5 bg-brand-success/10 px-4 py-2 rounded-full border border-brand-success/15">
              <span className="w-1.5 h-1.5 bg-brand-success rounded-full animate-pulse"></span>
              Live Sync
            </span>
            {isLive ? (
              <span className="text-[9px] bg-brand-success/15 text-brand-success font-black px-2 py-0.5 rounded border border-brand-success/15 uppercase tracking-wider hidden sm:inline">
                API Connected
              </span>
            ) : (
              <span className="text-[9px] bg-brand-cta/15 text-[#FF6200] font-black px-2 py-0.5 rounded border border-brand-cta/15 uppercase tracking-wider hidden sm:inline">
                Mock DB
              </span>
            )}
            <div id="header-actions-portal" className="flex items-center gap-2"></div>
          </div>
        </header>

        {/* Main Content Pane */}
        <main className="flex-1 flex flex-col">
          <div className="flex-grow flex flex-col w-full h-full">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};
