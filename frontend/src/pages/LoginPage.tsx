import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Lock, Mail, ChevronRight, GraduationCap, ShieldAlert, Sparkles, Cpu, Eye, EyeOff, BookOpen } from 'lucide-react';
import { useToast } from '../context/ToastContext';

interface LoginPageProps {
  onLoginSuccess: (user: { email: string; name: string; role: 'admin' | 'student' | 'superadmin' }) => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onLoginSuccess }) => {
  const { showToast } = useToast();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedRole, setSelectedRole] = useState<'admin' | 'student' | 'superadmin'>('admin');

  // Trigger error shake animation
  const [isShaking, setIsShaking] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    setTimeout(() => {
      // Teacher verification
      if (selectedRole === 'admin') {
        if (email === 'teacher@xebia.com' && password === 'password') {
          showToast('Welcome back, Instructor!');
          onLoginSuccess({ email, name: 'Instructor Account', role: 'admin' });
        } else {
          setIsShaking(true);
          showToast('Incorrect Teacher credentials. Tip: use teacher@xebia.com / password');
          setTimeout(() => setIsShaking(false), 500);
        }
      } 
      // Admin verification
      else if (selectedRole === 'superadmin') {
        if (email === 'admin@xebia.com' && password === 'password') {
          showToast('Welcome back, System Administrator!');
          onLoginSuccess({ email, name: 'System Administrator', role: 'superadmin' });
        } else {
          setIsShaking(true);
          showToast('Incorrect Admin credentials. Tip: use admin@xebia.com / password');
          setTimeout(() => setIsShaking(false), 500);
        }
      }
      // Student verification
      else {
        if (email === 'student@xebia.com' && password === 'password') {
          showToast('Logging in to Student Catalog...');
          onLoginSuccess({ email, name: 'Student User', role: 'student' });
        } else {
          setIsShaking(true);
          showToast('Incorrect Student credentials. Tip: use student@xebia.com / password');
          setTimeout(() => setIsShaking(false), 500);
        }
      }
      setIsLoading(false);
    }, 800);
  };

  // Quick login helper
  const handleQuickLogin = (role: 'admin' | 'student' | 'superadmin') => {
    setEmail(role === 'superadmin' ? 'admin@xebia.com' : role === 'admin' ? 'teacher@xebia.com' : 'student@xebia.com');
    setPassword('password');
    setSelectedRole(role);
    showToast(`Autofilled credentials for ${role === 'superadmin' ? 'Admin' : role === 'admin' ? 'Teacher' : 'Student'}`);
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-[#2D0B30] via-[#150218] to-[#0A000C] font-sans selection:bg-[#84117C]/30 selection:text-white relative overflow-hidden">
      
      {/* Decorative Radial Grid Dot/Line Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-[0.9] pointer-events-none"></div>

      {/* Floating Xebia X Watermarks */}
      {/* Left Bottom purple watermark */}
      <div className="absolute left-[-6%] bottom-[12%] pointer-events-none opacity-[0.03] text-[#C639B5] transform -rotate-12 select-none hidden lg:block">
        <svg className="w-[360px] h-[360px]" viewBox="0 0 100 100" fill="currentColor">
          <path d="M22.5 5.5H35.5L47.5 24.5L59.5 5.5H72.5L54.5 28.5L72.5 51.5H59.5L47.5 32.5L35.5 51.5H22.5L40.5 28.5L22.5 5.5Z" />
        </svg>
      </div>

      {/* Right Top teal watermark */}
      <div className="absolute right-[-4%] top-[10%] pointer-events-none opacity-[0.02] text-[#00FAD2] transform rotate-12 select-none hidden lg:block">
        <svg className="w-[340px] h-[340px]" viewBox="0 0 100 100" fill="currentColor">
          <path d="M22.5 5.5H35.5L47.5 24.5L59.5 5.5H72.5L54.5 28.5L72.5 51.5H59.5L47.5 32.5L35.5 51.5H22.5L40.5 28.5L22.5 5.5Z" />
        </svg>
      </div>

      {/* Dynamic Ambient Blur Blobs */}
      <motion.div
        animate={{
          x: [0, 60, -30, 0],
          y: [0, -40, 50, 0],
          scale: [1, 1.2, 0.85, 1],
        }}
        transition={{
          duration: 22,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="absolute top-[-20%] left-[10%] w-[500px] h-[500px] rounded-full bg-[#C639B5]/12 blur-[125px] pointer-events-none"
      />
      <motion.div
        animate={{
          x: [0, -50, 40, 0],
          y: [0, 50, -40, 0],
          scale: [1, 0.85, 1.15, 1],
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="absolute bottom-[-20%] right-[10%] w-[550px] h-[550px] rounded-full bg-[#00FAD2]/8 blur-[135px] pointer-events-none"
      />

      <div className="w-full max-w-[400px] p-6 flex flex-col gap-6 relative z-10">
        
        {/* Brand Header */}
        <div className="flex flex-col items-center gap-2 text-center">
          <motion.div 
            whileHover={{ scale: 1.02 }}
            className="flex items-center select-none"
          >
            <svg className="h-11 w-auto text-white" viewBox="20 0 140 56" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M22.5 5.5H35.5L47.5 24.5L59.5 5.5H72.5L54.5 28.5L72.5 51.5H59.5L47.5 32.5L35.5 51.5H22.5L40.5 28.5L22.5 5.5Z" fill="currentColor" />
              <text x="74" y="38" fontFamily="Outfit, sans-serif" fontWeight="900" fontSize="34" fill="currentColor" letterSpacing="-1.5">ebia</text>
            </svg>
            <span className="ml-2 px-2 py-0.5 rounded-md bg-white/10 text-[9px] font-black uppercase text-white tracking-widest border border-white/10">
              LMS
            </span>
          </motion.div>
          <p className="text-[9px] text-[#00FAD2] font-black uppercase tracking-[0.2em] mt-1 pl-2">Enterprise Learning Platform</p>
        </div>

        {/* Premium Dark Glass Card container */}
        <motion.div
          animate={isShaking ? { x: [-8, 8, -8, 8, 0] } : {}}
          transition={{ duration: 0.4 }}
          className="bg-[#1A0A21]/70 backdrop-blur-xl border border-white/10 rounded-2xl shadow-[0_24px_50px_rgba(0,0,0,0.3)] p-6 md:p-8 flex flex-col gap-5 text-left relative overflow-hidden animate-float-slow"
        >
          {/* Card top accent light indicator */}
          <div className={`absolute top-0 left-0 right-0 h-1 transition-colors duration-300 ${
            selectedRole === 'admin' 
              ? 'bg-[#84117C]' 
              : selectedRole === 'superadmin' 
                ? 'bg-[#4F46E5]' 
                : 'bg-[#01AC9F]'
          }`} />

          <div className="flex flex-col items-center text-center w-full mb-1">
            <h2 className="text-lg font-black tracking-tight text-white uppercase">
              Sign In
            </h2>
            <span className="text-[11px] text-neutral-400 font-semibold mt-1">Enter your credentials below to access the portal.</span>
          </div>

          {/* Role selector tab row */}
          <div className="grid grid-cols-3 gap-1.5 p-1 bg-white/5 rounded-xl border border-white/10">
            <motion.button
              whileTap={{ scale: 0.97 }}
              type="button"
              onClick={() => {
                setSelectedRole('admin');
                setEmail('');
                setPassword('');
              }}
              className={`py-2 px-1.5 rounded-lg text-[10px] font-bold transition-all flex items-center justify-center gap-1 ${
                selectedRole === 'admin'
                  ? 'bg-[#84117C] text-white shadow-sm'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" /> Teacher
            </motion.button>
            <motion.button
              whileTap={{ scale: 0.97 }}
              type="button"
              onClick={() => {
                setSelectedRole('student');
                setEmail('');
                setPassword('');
              }}
              className={`py-2 px-1.5 rounded-lg text-[10px] font-bold transition-all flex items-center justify-center gap-1 ${
                selectedRole === 'student'
                  ? 'bg-[#01AC9F] text-white shadow-sm'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              <GraduationCap className="w-3.5 h-3.5" /> Student
            </motion.button>
            <motion.button
              whileTap={{ scale: 0.97 }}
              type="button"
              onClick={() => {
                setSelectedRole('superadmin');
                setEmail('');
                setPassword('');
              }}
              className={`py-2 px-1.5 rounded-lg text-[10px] font-bold transition-all flex items-center justify-center gap-1 ${
                selectedRole === 'superadmin'
                  ? 'bg-[#4F46E5] text-white shadow-sm'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              <Cpu className="w-3.5 h-3.5" /> Admin
            </motion.button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-[9px] font-black text-neutral-300 uppercase tracking-wider">Email Address</label>
              <div className="relative">
                <input
                  type="email"
                  required
                  placeholder={selectedRole === 'admin' ? 'teacher@xebia.com' : 'student@xebia.com'}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 focus:border-brand-primary/60 focus:bg-white/10 rounded-lg py-2.5 pl-9 pr-4 text-xs font-semibold text-white placeholder-neutral-500 outline-none transition-all focus:ring-2 focus:ring-brand-primary/5"
                />
                <Mail className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <div className="flex justify-between items-center">
                <label className="text-[9px] font-black text-neutral-500 uppercase tracking-wider">Password</label>
                <span className={`text-[9px] font-bold hover:underline cursor-pointer ${
                  selectedRole === 'admin' 
                    ? 'text-[#84117C]' 
                    : selectedRole === 'superadmin' 
                      ? 'text-[#4F46E5]' 
                      : 'text-[#01AC9F]'
                }`}>Forgot Password?</span>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-neutral-50 border border-neutral-200 focus:border-brand-primary/40 focus:bg-white rounded-lg py-2.5 pl-9 pr-10 text-xs font-semibold text-neutral-800 placeholder-neutral-400 outline-none transition-all focus:ring-2 focus:ring-brand-primary/5"
                />
                <Lock className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600 p-1"
                >
                  {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.015 }}
              whileTap={{ scale: 0.985 }}
              type="submit"
              disabled={isLoading}
              className={`w-full py-2.5 mt-2 rounded-full text-white font-bold text-xs flex items-center justify-center gap-1 transition-all ${
                selectedRole === 'admin'
                  ? 'bg-[#84117C] hover:bg-[#84117C]/95 shadow-sm'
                  : selectedRole === 'superadmin'
                    ? 'bg-[#4F46E5] hover:bg-[#4F46E5]/95 shadow-sm'
                    : 'bg-[#01AC9F] hover:bg-[#01AC9F]/95 shadow-sm'
              }`}
            >
              {isLoading ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <>
                  Verify Credentials <ChevronRight className="w-3.5 h-3.5" />
                </>
              )}
            </motion.button>
          </form>

          {/* Quick Login Helpers */}
          <div className="border-t border-neutral-100 pt-4 flex flex-col gap-2">
            <span className="text-[9px] font-black text-neutral-400 uppercase tracking-wider block text-center">Demo Quick Login</span>
            <div className="grid grid-cols-3 gap-1.5">
              <motion.button
                whileHover={{ y: -1 }}
                whileTap={{ scale: 0.97 }}
                type="button"
                onClick={() => handleQuickLogin('admin')}
                className="py-2 px-1.5 rounded-lg bg-neutral-50 border border-neutral-200 hover:bg-neutral-100/50 transition-all text-xs font-semibold text-neutral-800 text-center flex flex-col items-center gap-0.5"
              >
                <span className="text-[#84117C] font-extrabold uppercase text-[8.5px] tracking-wide">Teacher</span>
                <span className="text-[8px] text-neutral-500 font-medium">teacher@xebia.com</span>
              </motion.button>
              <motion.button
                whileHover={{ y: -1 }}
                whileTap={{ scale: 0.97 }}
                type="button"
                onClick={() => handleQuickLogin('student')}
                className="py-2 px-1.5 rounded-lg bg-neutral-50 border border-neutral-200 hover:bg-neutral-100/50 transition-all text-xs font-semibold text-neutral-800 text-center flex flex-col items-center gap-0.5"
              >
                <span className="text-[#01AC9F] font-extrabold uppercase text-[8.5px] tracking-wide">Student</span>
                <span className="text-[8px] text-neutral-500 font-medium">student@xebia.com</span>
              </motion.button>
              <motion.button
                whileHover={{ y: -1 }}
                whileTap={{ scale: 0.97 }}
                type="button"
                onClick={() => handleQuickLogin('superadmin')}
                className="py-2 px-1.5 rounded-lg bg-neutral-50 border border-neutral-200 hover:bg-neutral-100/50 transition-all text-xs font-semibold text-neutral-800 text-center flex flex-col items-center gap-0.5"
              >
                <span className="text-[#4F46E5] font-extrabold uppercase text-[8.5px] tracking-wide">Admin</span>
                <span className="text-[8px] text-neutral-500 font-medium">admin@xebia.com</span>
              </motion.button>
            </div>
          </div>
        </motion.div>

        {/* System Alert banner */}
        <div className="flex items-center gap-2 px-3 py-2.5 rounded-xl border border-yellow-500/10 bg-yellow-500/5 text-yellow-800 text-[10px] font-medium text-left shadow-sm">
          <ShieldAlert className="w-4 h-4 flex-shrink-0 text-yellow-600" />
          <span>Note: User session state is preserved inside your local session storage.</span>
        </div>
      </div>
    </div>
  );
};
export default LoginPage;
