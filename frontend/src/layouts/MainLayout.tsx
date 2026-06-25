import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, BookOpen, GraduationCap, BarChart3 } from 'lucide-react';
import { getIsLiveApi } from '../services/api';

interface MainLayoutProps {
  children: React.ReactNode;
  pageTitle: string;
}

export const MainLayout: React.FC<MainLayoutProps> = ({ children, pageTitle }) => {
  const isLive = getIsLiveApi();

  const menuItems = [
    { name: 'Dashboard', path: '/', icon: Home },
    { name: 'Course Catalog', path: '/catalog', icon: BookOpen },
    { name: 'Learning Room', path: '/learning', icon: GraduationCap },
    { name: 'Authoring Studio', path: '/studio', icon: BarChart3 },
  ];

  return (
    <div className="relative min-h-screen flex text-brand-text">
      {/* Background Decorative Glow Orbs */}
      <div className="fixed -top-[15%] -right-[10%] w-[60vw] h-[60vw] rounded-full bg-radial-gradient from-brand-primary/5 to-transparent blur-[95px] pointer-events-none animate-orb1 z-[-2]"></div>
      <div className="fixed -bottom-[15%] -left-[5%] w-[55vw] h-[55vw] rounded-full bg-radial-gradient from-brand-success/5 to-transparent blur-[95px] pointer-events-none animate-orb2 z-[-2]"></div>
      <div className="fixed top-[35%] right-[25%] w-[45vw] h-[45vw] rounded-full bg-radial-gradient from-brand-cta/5 to-transparent blur-[95px] pointer-events-none z-[-2]"></div>

      {/* Sidebar navigation */}
      <aside className="fixed left-0 top-0 h-screen w-20 md:w-[280px] bg-gradient-to-br from-brand-primaryDark/90 to-brand-primary/85 backdrop-blur-[30px] border-r border-white/10 text-white flex flex-col p-4 md:p-6 transition-all duration-300 z-50 shadow-lg">
        {/* Brand */}
        <div className="flex items-center gap-3 mb-10 md:mb-12 mt-2 self-center md:self-start">
          <div className="w-10 h-10 md:w-11 md:h-11 bg-gradient-to-br from-brand-success to-brand-accent rounded-xl flex items-center justify-center font-extrabold text-xl md:text-2xl text-white shadow-[0_4px_18px_rgba(1,172,159,0.35)]">
            G
          </div>
          <span className="hidden md:inline font-sans text-xl md:text-2xl font-extrabold tracking-tight bg-gradient-to-br from-white to-[#E2E4F0] bg-clip-text text-transparent">
            Geeknito
          </span>
        </div>

        {/* Navigation list */}
        <nav className="flex-1">
          <ul className="flex flex-col gap-2">
            {menuItems.map((item) => {
              const Icon = item.icon;
              return (
                <li key={item.path}>
                  <NavLink
                    to={item.path}
                    className={({ isActive }) =>
                      `flex items-center gap-4 px-4 py-3.5 rounded-xl font-semibold cursor-pointer transition-all duration-300 hover:text-white hover:bg-white/8 ${
                        isActive
                          ? 'text-white bg-white/10 border-l-4 border-brand-success shadow-[inset_4px_0_12px_rgba(0,186,174,0.15)] translate-x-1'
                          : 'text-white/60'
                      }`
                    }
                  >
                    <Icon className="w-5 h-5 flex-shrink-0" />
                    <span className="hidden md:inline text-sm">{item.name}</span>
                  </NavLink>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Sidebar Footer */}
        <div className="mt-auto hidden md:block text-center text-[10px] text-white/30 tracking-wider uppercase font-bold">
          <p>© 2026 Geeknito Studio</p>
          <p className="mt-1 text-brand-success/75">v1.0.0 (JPA Schema)</p>
        </div>
      </aside>

      {/* Main content wrapper */}
      <div className="flex-1 ml-20 md:ml-[280px] p-6 md:p-10 min-h-screen flex flex-col transition-all duration-300">
        <header className="flex justify-between items-center mb-8">
          <h1 className="text-2xl md:text-4xl font-extrabold text-brand-primaryDark tracking-tight">
            {pageTitle}
          </h1>

          <div className="flex items-center gap-2">
            <span className="text-xs md:text-sm font-bold text-brand-success flex items-center gap-2 bg-brand-success/10 px-3 py-1.5 rounded-full border border-brand-success/20">
              <span className="w-2.5 h-2.5 bg-brand-success rounded-full animate-pulse"></span>
              Live Sync
            </span>
            {isLive ? (
              <span className="text-[10px] bg-brand-success/20 text-brand-success font-bold px-2 py-0.5 rounded border border-brand-success/20 hidden sm:inline">
                API Connected
              </span>
            ) : (
              <span className="text-[10px] bg-brand-cta/15 text-brand-cta font-bold px-2 py-0.5 rounded border border-brand-cta/20 hidden sm:inline">
                Mock Database
              </span>
            )}
          </div>
        </header>

        {/* Main Content Pane */}
        <main className="flex-1 flex flex-col">
          {children}
        </main>
      </div>
    </div>
  );
};
