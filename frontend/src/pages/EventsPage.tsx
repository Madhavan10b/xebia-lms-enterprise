import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Calendar, 
  MapPin, 
  Clock, 
  UserCheck, 
  Plus, 
  Trash, 
  PlusCircle, 
  CheckCircle2, 
  Users, 
  Info, 
  Tag,
  AlertCircle
} from 'lucide-react';
import { useToast } from '../context/ToastContext';

interface EventRegistration {
  name: string;
  email: string;
  timestamp: string;
}

interface EventItem {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  timeline: string;
  deadline: string;
  location: string;
  category: string;
}

const DEFAULT_EVENTS: EventItem[] = [
  {
    id: 'evt-1',
    title: 'Xebia Kubernetes Masterclass 2026',
    description: 'An intensive hands-on bootcamp exploring advanced cloud-native architecture, Kubernetes deployments, service meshes, and GitOps workflows using ArgoCD.',
    imageUrl: 'https://images.unsplash.com/photo-1667372393119-3d4c48d07fc9?auto=format&fit=crop&w=800&q=80',
    timeline: 'July 24, 2026 | 10:00 AM - 4:00 PM IST',
    deadline: '2026-07-22',
    location: 'Xebia Headquarters, Gurugram (Offline)',
    category: 'Cloud Engineering'
  },
  {
    id: 'evt-2',
    title: 'React & Vite Micro-Frontends Architecture',
    description: 'Deep dive webinar on micro-frontend engineering, module federation, code-splitting strategies, and optimizing build pipelines with Vite.',
    imageUrl: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?auto=format&fit=crop&w=800&q=80',
    timeline: 'August 02, 2026 | 2:00 PM - 5:00 PM IST',
    deadline: '2026-07-31',
    location: 'Microsoft Teams (Online)',
    category: 'Frontend Development'
  }
];

const AI_TEMPLATES = [
  {
    title: 'AWS Serverless Architecture Deep Dive',
    description: 'Learn to build scalable serverless applications using AWS Lambda, API Gateway, DynamoDB, and EventBridge with infrastructure as code.',
    imageUrl: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=800&q=80',
    timeline: 'August 18, 2026 | 11:00 AM - 3:00 PM IST',
    deadline: '2026-08-15',
    location: 'Microsoft Teams (Online)',
    category: 'Cloud Engineering'
  },
  {
    title: 'Docker & Podman Essentials for Developers',
    description: 'Master containerization concepts: writing efficient Dockerfiles, managing container volumes, networks, and compose-based local development environments.',
    imageUrl: 'https://images.unsplash.com/photo-1607799279861-4dd421887fb3?auto=format&fit=crop&w=800&q=80',
    timeline: 'September 05, 2026 | 10:00 AM - 1:00 PM IST',
    deadline: '2026-09-02',
    location: 'Xebia Headquarters, Noida (Offline)',
    category: 'DevOps & SRE'
  },
  {
    title: 'AI Engineering: Building LLM Apps with LangChain',
    description: 'Practical guide to retrieval-augmented generation (RAG), vector databases, prompt engineering, and building production-grade LLM applications.',
    imageUrl: 'https://images.unsplash.com/photo-1677442136019-21780efad99a?auto=format&fit=crop&w=800&q=80',
    timeline: 'October 12, 2026 | 2:00 PM - 5:00 PM IST',
    deadline: '2026-10-09',
    location: 'Zoom Webinar (Online)',
    category: 'AI & Machine Learning'
  }
];

export const EventsPage: React.FC = () => {
  const { showToast } = useToast();
  
  // Current user role
  const currentUser = useMemo(() => {
    const saved = localStorage.getItem('currentUser');
    return saved ? JSON.parse(saved) : { name: 'Teacher User', email: 'teacher@xebia.com', role: 'admin' };
  }, []);

  // Events list state
  const [events, setEvents] = useState<EventItem[]>(() => {
    const saved = localStorage.getItem('xebia_lms_events');
    return saved ? JSON.parse(saved) : DEFAULT_EVENTS;
  });

  // Registrations registry state: { [eventId]: EventRegistration[] }
  const [registrations, setRegistrations] = useState<{ [key: string]: EventRegistration[] }>(() => {
    const saved = localStorage.getItem('xebia_lms_event_registrations');
    return saved ? JSON.parse(saved) : {};
  });

  // Form states for Admin to create events
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [timeline, setTimeline] = useState('');
  const [deadline, setDeadline] = useState('');
  const [location, setLocation] = useState('');
  const [category, setCategory] = useState('Cloud Engineering');

  // Currently inspected event registrations (Admin only)
  const [inspectedEventId, setInspectedEventId] = useState<string | null>(null);

  // Helper to persist events
  const saveEvents = (updatedEvents: EventItem[]) => {
    setEvents(updatedEvents);
    localStorage.setItem('xebia_lms_events', JSON.stringify(updatedEvents));
  };

  // Helper to persist registrations
  const saveRegistrations = (updatedRegs: { [key: string]: EventRegistration[] }) => {
    setRegistrations(updatedRegs);
    localStorage.setItem('xebia_lms_event_registrations', JSON.stringify(updatedRegs));
  };

  // Autofill form inputs with a random AI template copy suggestions
  const handleAISuggestion = () => {
    const randomIndex = Math.floor(Math.random() * AI_TEMPLATES.length);
    const template = AI_TEMPLATES[randomIndex];

    setTitle(template.title);
    setDescription(template.description);
    setImageUrl(template.imageUrl);
    setTimeline(template.timeline);
    setDeadline(template.deadline);
    setLocation(template.location);
    setCategory(template.category);

    showToast(`✨ Generated AI template copy for "${template.title}"!`);
  };

  // Admin: Create new event
  const handleCreateEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !description || !timeline || !deadline || !location) {
      showToast('Please fill out all required fields');
      return;
    }

    const newEvent: EventItem = {
      id: `evt-${Date.now()}`,
      title,
      description,
      imageUrl: imageUrl || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=800&q=80',
      timeline,
      deadline,
      location,
      category
    };

    const updated = [newEvent, ...events];
    saveEvents(updated);
    showToast('Event created successfully!');

    // Reset fields
    setTitle('');
    setDescription('');
    setImageUrl('');
    setTimeline('');
    setDeadline('');
    setLocation('');
  };

  // Admin: Delete event
  const handleDeleteEvent = (id: string) => {
    if (window.confirm('Are you sure you want to delete this event?')) {
      const updated = events.filter(evt => evt.id !== id);
      saveEvents(updated);
      
      // Clean registrations
      const updatedRegs = { ...registrations };
      delete updatedRegs[id];
      saveRegistrations(updatedRegs);

      showToast('Event deleted successfully.');
      if (inspectedEventId === id) {
        setInspectedEventId(null);
      }
    }
  };

  // Student: Register for event
  const handleRegisterForEvent = (eventId: string) => {
    const currentRegs = registrations[eventId] || [];
    
    // Check if already registered
    const isAlreadyRegistered = currentRegs.some(reg => reg.email === currentUser.email);
    if (isAlreadyRegistered) {
      showToast('You are already registered for this event!');
      return;
    }

    if (!window.confirm('Are you sure you want to confirm your registration for this event?')) {
      return;
    }

    const newReg: EventRegistration = {
      name: currentUser.name,
      email: currentUser.email,
      timestamp: new Date().toLocaleString()
    };

    const updatedRegs = {
      ...registrations,
      [eventId]: [...currentRegs, newReg]
    };

    saveRegistrations(updatedRegs);
    showToast('Registered successfully! Confirmation code sent.');
  };

  return (
    <div className="flex flex-col gap-6 p-1">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-brand-primaryDark to-brand-primary rounded-2xl p-6 md:p-8 text-white shadow-md relative overflow-hidden">
        <div className="absolute right-0 bottom-0 top-0 w-1/3 opacity-10 pointer-events-none">
          <svg className="w-full h-full" viewBox="0 0 100 100" fill="currentColor">
            <path d="M22.5 5.5H35.5L47.5 24.5L59.5 5.5H72.5L54.5 28.5L72.5 51.5H59.5L47.5 32.5L35.5 51.5H22.5L40.5 28.5L22.5 5.5Z" />
          </svg>
        </div>
        <span className="px-2.5 py-0.5 rounded-full bg-white/10 text-[9px] font-black uppercase text-white/95 tracking-wider border border-white/5 inline-block mb-3">
          Events Hub
        </span>
        <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight">Corporate Technical Events</h2>
        <p className="text-xs text-white/70 max-w-xl mt-1.5 font-medium">
          Participate in intensive technical workshops, seminars, and networking sessions hosted by Xebia leaders and expert guests.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* LEFT COLUMN: Admin Creation Form */}
        {currentUser.role === 'superadmin' && (
          <div className="lg:col-span-1 flex flex-col gap-6">
            <div className="bg-white border border-neutral-200/80 rounded-2xl p-6 shadow-sm flex flex-col gap-4 text-left">
              <div className="flex items-center justify-between border-b border-neutral-100 pb-3 gap-2">
                <div className="flex items-center gap-1.5">
                  <PlusCircle className="w-5 h-5 text-[#4F46E5]" />
                  <h3 className="font-extrabold text-[11px] text-neutral-800 uppercase tracking-wider">New Event</h3>
                </div>
                <button
                  type="button"
                  onClick={handleAISuggestion}
                  className="px-2.5 py-1 rounded-md bg-[#4F46E5]/10 text-[#4F46E5] hover:bg-[#4F46E5]/15 transition-all text-[9px] font-black uppercase tracking-wider border border-[#4F46E5]/5"
                  title="Generate template with AI"
                >
                  ✨ AI Suggest
                </button>
              </div>

              <form onSubmit={handleCreateEvent} className="flex flex-col gap-3.5">
                <div className="flex flex-col gap-1">
                  <label className="text-[9px] font-black text-neutral-400 uppercase tracking-wider">Event Title *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Docker Fundamentals"
                    value={title}
                    onChange={e => setTitle(e.target.value)}
                    className="w-full bg-neutral-50 border border-neutral-200 focus:border-brand-primary/40 focus:bg-white rounded-lg py-2 px-3 text-xs font-semibold text-neutral-800 outline-none transition-all"
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-[9px] font-black text-neutral-400 uppercase tracking-wider">Category</label>
                  <select
                    value={category}
                    onChange={e => setCategory(e.target.value)}
                    className="w-full bg-neutral-50 border border-neutral-200 focus:border-brand-primary/40 focus:bg-white rounded-lg py-2 px-2.5 text-xs font-semibold text-neutral-800 outline-none transition-all"
                  >
                    <option value="Cloud Engineering">Cloud Engineering</option>
                    <option value="Frontend Development">Frontend Development</option>
                    <option value="DevOps & SRE">DevOps & SRE</option>
                    <option value="AI & Machine Learning">AI & Machine Learning</option>
                  </select>
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-[9px] font-black text-neutral-400 uppercase tracking-wider">Description *</label>
                  <textarea
                    rows={3}
                    required
                    placeholder="Provide overview details..."
                    value={description}
                    onChange={e => setDescription(e.target.value)}
                    className="w-full bg-neutral-50 border border-neutral-200 focus:border-brand-primary/40 focus:bg-white rounded-lg py-2 px-3 text-xs font-semibold text-neutral-800 outline-none transition-all resize-none"
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-[9px] font-black text-neutral-400 uppercase tracking-wider">Image URL (Optional)</label>
                  <input
                    type="url"
                    placeholder="https://example.com/cover.jpg"
                    value={imageUrl}
                    onChange={e => setImageUrl(e.target.value)}
                    className="w-full bg-neutral-50 border border-neutral-200 focus:border-brand-primary/40 focus:bg-white rounded-lg py-2 px-3 text-xs font-semibold text-neutral-800 outline-none transition-all"
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-[9px] font-black text-neutral-400 uppercase tracking-wider">Timeline Date/Time *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. July 24, 2026 | 10:00 AM"
                    value={timeline}
                    onChange={e => setTimeline(e.target.value)}
                    className="w-full bg-neutral-50 border border-neutral-200 focus:border-brand-primary/40 focus:bg-white rounded-lg py-2 px-3 text-xs font-semibold text-neutral-800 outline-none transition-all"
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-[9px] font-black text-neutral-400 uppercase tracking-wider">Registration Deadline *</label>
                  <input
                    type="date"
                    required
                    value={deadline}
                    onChange={e => setDeadline(e.target.value)}
                    className="w-full bg-neutral-50 border border-neutral-200 focus:border-brand-primary/40 focus:bg-white rounded-lg py-2 px-3 text-xs font-semibold text-neutral-800 outline-none transition-all"
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-[9px] font-black text-neutral-400 uppercase tracking-wider">Location *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Microsoft Teams"
                    value={location}
                    onChange={e => setLocation(e.target.value)}
                    className="w-full bg-neutral-50 border border-neutral-200 focus:border-brand-primary/40 focus:bg-white rounded-lg py-2 px-3 text-xs font-semibold text-neutral-800 outline-none transition-all"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 rounded-lg bg-[#4F46E5] hover:bg-[#4F46E5]/95 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow-sm mt-1"
                >
                  <Plus className="w-4 h-4" /> Create Event
                </button>
              </form>
            </div>
          </div>
        )}

        {/* RIGHT/CENTER COLUMN: Events List Board */}
        <div className={`lg:col-span-${currentUser.role === 'superadmin' ? '2' : '3'} flex flex-col gap-6`}>
          <div className="flex flex-col gap-4 text-left">
            <div className="flex items-center justify-between border-b border-neutral-200/60 pb-3">
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-brand-primary" />
                <h3 className="font-extrabold text-xs text-neutral-800 uppercase tracking-wider">Scheduled Events ({events.length})</h3>
              </div>
            </div>

            {events.length === 0 ? (
              <div className="bg-white border border-neutral-200/80 rounded-2xl p-12 text-center flex flex-col items-center justify-center gap-3">
                <AlertCircle className="w-8 h-8 text-neutral-300" />
                <h4 className="text-sm font-bold text-neutral-700">No scheduled events found</h4>
                <p className="text-xs text-neutral-400 max-w-sm">Please wait for administrators to release upcoming course activities and technical bootcamps.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {events.map(evt => {
                  const regsCount = registrations[evt.id]?.length || 0;
                  const isRegistered = registrations[evt.id]?.some(reg => reg.email === currentUser.email);

                  return (
                    <motion.div
                      layout
                      key={evt.id}
                      className="bg-white border border-neutral-200/80 rounded-2xl shadow-sm overflow-hidden flex flex-col hover:shadow-md transition-all group"
                    >
                      <div className="h-40 relative bg-neutral-100 overflow-hidden">
                        <img 
                          src={evt.imageUrl} 
                          alt={evt.title} 
                          className="w-full h-full object-cover group-hover:scale-105 transition-all duration-300"
                        />
                        <div className="absolute top-3 left-3">
                          <span className="px-2 py-0.5 rounded-full bg-white/90 text-[8.5px] font-black text-[#6C1D5F] uppercase tracking-wider border border-[#6C1D5F]/10 shadow-sm">
                            {evt.category}
                          </span>
                        </div>
                        {currentUser.role === 'superadmin' && (
                          <div className="absolute top-3 right-3 flex items-center gap-1.5">
                            <button
                              onClick={() => handleDeleteEvent(evt.id)}
                              className="p-1.5 rounded-full bg-white/90 text-neutral-500 hover:text-red-500 transition-colors shadow-sm hover:scale-105"
                              title="Delete Event"
                            >
                              <Trash className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        )}
                      </div>

                      <div className="p-5 flex-1 flex flex-col gap-3.5">
                        <div className="flex flex-col gap-1.5">
                          <h4 className="font-extrabold text-sm text-neutral-800 tracking-tight leading-tight group-hover:text-brand-primary transition-colors">
                            {evt.title}
                          </h4>
                          <p className="text-[11px] text-neutral-500 font-medium leading-relaxed">
                            {evt.description}
                          </p>
                        </div>

                        <div className="flex flex-col gap-2 border-t border-neutral-100 pt-3 text-[11px] text-neutral-500 font-semibold">
                          <div className="flex items-center gap-2">
                            <Clock className="w-3.5 h-3.5 text-neutral-400" />
                            <span>{evt.timeline}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <MapPin className="w-3.5 h-3.5 text-neutral-400" />
                            <span>{evt.location}</span>
                          </div>
                          <div className="flex items-center gap-2 text-neutral-400">
                            <Info className="w-3.5 h-3.5" />
                            <span>Registration deadline: <strong className="text-neutral-600">{evt.deadline}</strong></span>
                          </div>
                        </div>

                        {/* Action buttons based on Role */}
                        <div className="mt-auto border-t border-neutral-100 pt-4 flex items-center justify-between gap-2.5">
                          {currentUser.role === 'superadmin' ? (
                            <>
                              <div className="flex items-center gap-1 text-[11px] font-bold text-neutral-500">
                                <Users className="w-4 h-4 text-neutral-400" />
                                <span>{regsCount} Registered</span>
                              </div>
                              <button
                                onClick={() => setInspectedEventId(evt.id)}
                                className="px-3 py-1.5 rounded-lg border border-neutral-200 hover:border-brand-primary/30 hover:bg-neutral-50 transition-colors text-xs font-bold text-brand-primary"
                              >
                                View Registrations
                              </button>
                            </>
                          ) : currentUser.role === 'student' ? (
                            <>
                              <div className="flex items-center gap-1 text-[11px] font-bold text-neutral-500">
                                <Users className="w-4 h-4 text-neutral-400" />
                                <span>{regsCount} Registered</span>
                              </div>
                              {isRegistered ? (
                                <span className="px-3.5 py-1.5 rounded-lg bg-green-50 text-green-600 border border-green-200/50 text-xs font-bold flex items-center gap-1.5">
                                  <CheckCircle2 className="w-3.5 h-3.5" /> Registered
                                </span>
                              ) : (
                                <button
                                  onClick={() => handleRegisterForEvent(evt.id)}
                                  className="px-4 py-1.5 rounded-lg bg-brand-primary hover:bg-brand-primary/95 text-white font-bold text-xs transition-colors shadow-sm"
                                >
                                  Register for Event
                                </button>
                              )}
                            </>
                          ) : (
                            // Teacher View
                            <>
                              <div className="flex items-center gap-1 text-[11px] font-bold text-neutral-500">
                                <Users className="w-4 h-4 text-neutral-400" />
                                <span>{regsCount} Registered Students</span>
                              </div>
                              <span className="text-[10px] text-neutral-400 font-extrabold uppercase tracking-wider">
                                View-Only Mode
                              </span>
                            </>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* MODAL: Registered Students Roster (Admin only) */}
      <AnimatePresence>
        {inspectedEventId && currentUser.role === 'superadmin' && (
          <div className="fixed inset-0 bg-neutral-900/60 flex items-center justify-center p-4 z-[999] backdrop-blur-xs">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl text-left border border-neutral-200"
            >
              <div className="flex justify-between items-center border-b border-neutral-100 pb-3">
                <div className="flex items-center gap-2">
                  <UserCheck className="w-5 h-5 text-green-500" />
                  <h3 className="font-extrabold text-sm text-neutral-800 tracking-tight leading-none uppercase">
                    Registered Students
                  </h3>
                </div>
                <button 
                  onClick={() => setInspectedEventId(null)}
                  className="text-neutral-400 hover:text-neutral-700 font-bold text-sm px-2 py-1 rounded hover:bg-neutral-100 transition-colors"
                >
                  Close
                </button>
              </div>

              <div className="mt-4 max-h-[300px] overflow-y-auto pr-1 flex flex-col gap-2">
                {(!registrations[inspectedEventId] || registrations[inspectedEventId].length === 0) ? (
                  <div className="py-8 text-center flex flex-col items-center justify-center gap-2">
                    <Users className="w-6 h-6 text-neutral-300" />
                    <span className="text-xs text-neutral-400 font-semibold">No students registered yet.</span>
                  </div>
                ) : (
                  registrations[inspectedEventId].map((reg, idx) => (
                    <div 
                      key={idx}
                      className="p-3 bg-neutral-50 border border-neutral-200/60 rounded-xl flex items-center justify-between text-xs"
                    >
                      <div className="flex flex-col gap-0.5">
                        <strong className="text-neutral-800 font-bold">{reg.name}</strong>
                        <span className="text-neutral-400 font-medium">{reg.email}</span>
                      </div>
                      <span className="text-[10px] text-neutral-400 font-semibold">{reg.timestamp}</span>
                    </div>
                  ))
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
