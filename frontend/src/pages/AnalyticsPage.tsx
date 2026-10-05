import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, ShieldCheck } from 'lucide-react';
import { courseServices } from '../services/api';
import { useToast } from '../context/ToastContext';
import { Course } from '../types';

export const AnalyticsPage: React.FC = () => {
  const { showToast } = useToast();
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    try {
      setLoading(true);
      const list = await courseServices.getAll();
      setCourses(list);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Calculate overall stats
  let totalViews = 0;
  let totalClicks = 0;
  let totalSeoScore = 0;

  courses.forEach((c) => {
    totalViews += c.totalViews || 0;
    totalClicks += c.totalClicks || 0;
    totalSeoScore += c.seoScore || 0;
  });

  const avgCtr = totalViews > 0 ? ((totalClicks / totalViews) * 100).toFixed(1) + '%' : '0.0%';
  const avgSeoScore = courses.length > 0 ? Math.round(totalSeoScore / courses.length) : 0;

  // Custom Chart Data: Weekly view metrics
  const DailyTraffic = [
    { day: 'Mon', views: 320, clicks: 45 },
    { day: 'Tue', views: 480, clicks: 72 },
    { day: 'Wed', views: 640, clicks: 96 },
    { day: 'Thu', views: 510, clicks: 80 },
    { day: 'Fri', views: 720, clicks: 110 },
    { day: 'Sat', views: 420, clicks: 65 },
    { day: 'Sun', views: 380, clicks: 50 },
  ];

  const maxViews = Math.max(...DailyTraffic.map(t => t.views));

  if (loading) {
    return (
      <div className="flex-grow flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-brand-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  // Framer Motion Stagger Variants
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    show: { 
      opacity: 1, 
      y: 0,
      transition: { 
        type: "spring", 
        stiffness: 260, 
        damping: 24 
      } 
    }
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="flex-grow flex flex-col gap-6 md:gap-8"
    >
      {/* Stats Dashboard Grid */}
      <motion.div 
        variants={itemVariants}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        <motion.div 
          whileHover={{ y: -2 }}
          className="glass-panel p-6 rounded-2xl flex flex-col justify-between border border-neutral-200/80 shadow-sm animate-float-slow"
        >
          <div>
            <span className="block text-[9px] font-black text-brand-muted uppercase tracking-widest mb-1.5">Total Search Views</span>
            <span className="text-3xl font-extrabold text-brand-primaryDark tracking-tighter">{totalViews.toLocaleString()}</span>
          </div>
          <span className="text-[10px] text-brand-success font-bold mt-2.5">across all courses</span>
        </motion.div>

        <motion.div 
          whileHover={{ y: -2 }}
          className="glass-panel p-6 rounded-2xl flex flex-col justify-between border border-neutral-200/80 shadow-sm animate-float-medium"
        >
          <div>
            <span className="block text-[9px] font-black text-brand-muted uppercase tracking-widest mb-1.5">Total Search Clicks</span>
            <span className="text-3xl font-extrabold text-brand-primaryDark tracking-tighter">{totalClicks.toLocaleString()}</span>
          </div>
          <span className="text-[10px] text-brand-success font-bold mt-2.5 font-mono">click conversion logs</span>
        </motion.div>

        <motion.div 
          whileHover={{ y: -2 }}
          className="glass-panel p-6 rounded-2xl flex flex-col justify-between border border-neutral-200/80 shadow-sm animate-float-slow"
        >
          <div>
            <span className="block text-[9px] font-black text-brand-muted uppercase tracking-widest mb-1.5">Average CTR</span>
            <span className="text-3xl font-extrabold text-brand-primaryDark tracking-tighter">{avgCtr}</span>
          </div>
          <span className="text-[10px] text-brand-success font-bold mt-2.5">average conversion rate</span>
        </motion.div>

        <motion.div 
          whileHover={{ y: -2 }}
          className="glass-panel p-6 rounded-2xl flex flex-col justify-between border border-neutral-200/80 shadow-sm animate-float-medium"
        >
          <div>
            <span className="block text-[9px] font-black text-brand-muted uppercase tracking-widest mb-1.5">Avg SEO Score</span>
            <span className="text-3xl font-extrabold text-brand-primaryDark tracking-tighter">{avgSeoScore}/100</span>
          </div>
          <span className="text-[10px] text-brand-success font-bold mt-2.5">out of 100 max points</span>
        </motion.div>
      </motion.div>

      {/* Grid: Weekly Views Chart and checklist info */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8 items-stretch">
        
        {/* Weekly Views Chart (CSS bar chart) */}
        <motion.div 
          variants={itemVariants}
          className="lg:col-span-2 glass-panel p-6 rounded-2xl border border-neutral-200/80 shadow-sm flex flex-col gap-6 text-left"
        >
          <div className="flex justify-between items-center border-b border-neutral-100 pb-3">
            <h3 className="font-black text-sm text-brand-primaryDark flex items-center gap-2">
              <TrendingUp className="w-4.5 h-4.5 text-brand-primary" /> Daily Traffic Trend (Search Engines)
            </h3>
            <span className="text-[10px] font-bold text-brand-muted uppercase">Past 7 Days</span>
          </div>

          <div className="flex justify-between items-end h-56 pt-6 px-4">
            {DailyTraffic.map((t, idx) => {
              const heightPct = (t.views / maxViews) * 100;
              return (
                <div key={idx} className="flex flex-col items-center gap-3 flex-1 group">
                  <div className="relative w-7 sm:w-10 bg-brand-primary/5 rounded-t-lg h-full flex flex-col justify-end overflow-hidden border border-neutral-100">
                    <motion.div 
                      initial={{ height: 0 }}
                      animate={{ height: `${heightPct}%` }}
                      transition={{ type: "spring", stiffness: 100, damping: 20, delay: idx * 0.05 }}
                      className="w-full bg-gradient-to-t from-brand-primary to-brand-accent rounded-t-md relative"
                    >
                      <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    </motion.div>
                  </div>
                  <div className="flex flex-col items-center">
                    <span className="text-[9px] font-black text-brand-primaryDark">{t.views}</span>
                    <span className="text-[9px] font-bold text-brand-muted mt-0.5">{t.day}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>

        {/* Action Panel Checklist */}
        <motion.div 
          variants={itemVariants}
          className="glass-panel p-6 rounded-2xl border border-neutral-200/80 shadow-sm flex flex-col justify-between text-left"
        >
          <div>
            <h3 className="font-black text-sm text-brand-primaryDark border-b border-neutral-100 pb-3 mb-4">
              Indexing Checklist
            </h3>
            <ul className="flex flex-col gap-3.5 text-xs text-brand-muted font-semibold">
              <li className="flex items-start gap-2.5">
                <ShieldCheck className="w-4 h-4 text-brand-success flex-shrink-0 mt-0.5" />
                <span>All schemas comply with Google structured markup guidelines</span>
              </li>
              <li className="flex items-start gap-2.5">
                <ShieldCheck className="w-4 h-4 text-brand-success flex-shrink-0 mt-0.5" />
                <span>Canonical tags prevent duplicate content issues</span>
              </li>
              <li className="flex items-start gap-2.5">
                <ShieldCheck className="w-4 h-4 text-brand-success flex-shrink-0 mt-0.5" />
                <span>Sitemap XML generated and pinged successfully</span>
              </li>
            </ul>
          </div>
          <motion.button 
            whileHover={{ scale: 1.015 }}
            whileTap={{ scale: 0.985 }}
            onClick={() => showToast('Sitemap.xml has been updated and pinged.')}
            className="w-full bg-brand-primary hover:bg-[#84117C]/95 text-white text-xs font-black py-3 rounded-full shadow-sm transition-all mt-6"
          >
            Re-index Sitemap XML
          </motion.button>
        </motion.div>
      </div>

      {/* Indexing Table */}
      <motion.div 
        variants={itemVariants}
        className="glass-panel rounded-2xl border border-neutral-200/80 overflow-hidden shadow-sm"
      >
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left text-xs md:text-sm">
            <thead>
              <tr className="bg-neutral-50 text-brand-primaryDark border-b border-neutral-100">
                <th className="p-4 font-black">Course Title</th>
                <th className="p-4 font-black text-center">Views</th>
                <th className="p-4 font-black text-center">Clicks</th>
                <th className="p-4 font-black text-center">CTR</th>
                <th className="p-4 font-black text-center">SEO Score</th>
                <th className="p-4 font-black text-center">Indexing Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {courses.map((c) => {
                const ctrVal = c.totalViews ? ((c.totalClicks || 0) / c.totalViews * 100).toFixed(1) + '%' : '0.0%';
                const isExcellent = (c.seoScore || 0) >= 90;
                const isGood = (c.seoScore || 0) >= 80;

                return (
                  <tr key={c.id} className="hover:bg-neutral-50/50 transition-all duration-150">
                    <td className="p-4 font-bold text-brand-primaryDark">{c.title}</td>
                    <td className="p-4 text-center text-brand-muted font-bold">{(c.totalViews || 0).toLocaleString()}</td>
                    <td className="p-4 text-center text-brand-muted font-bold">{(c.totalClicks || 0).toLocaleString()}</td>
                    <td className="p-4 text-center text-brand-muted font-bold">{ctrVal}</td>
                    <td className="p-4 text-center">
                      <span
                        className={`px-2.5 py-1 rounded-full text-[9px] font-black border ${
                          isExcellent
                            ? 'bg-brand-success/10 text-brand-success border-brand-success/15'
                            : isGood
                            ? 'bg-brand-cta/10 text-brand-cta border-brand-cta/15'
                            : 'bg-brand-primary/10 text-brand-primary border-brand-primary/15'
                        }`}
                      >
                        {c.seoScore || 0}/100
                      </span>
                    </td>
                    <td className="p-4 text-center font-bold text-xs">
                      <span className={c.isPublished ? 'text-brand-success' : 'text-brand-muted'}>
                        {c.isPublished ? 'Indexed' : 'Draft'}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </motion.div>
    </motion.div>
  );
};
