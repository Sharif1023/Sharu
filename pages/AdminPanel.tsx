
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus, Trash2, Save, LogOut, X, FolderOpen, Camera, Menu, Sun, Moon,
  Upload, Eye, EyeOff, Loader2, Phone, Mail, Link as LinkIcon, Smartphone,
  Zap, Code, LayoutDashboard, Database, ShieldCheck, Activity, Copy, Check,
  ShieldAlert, RotateCcw, FileText, ArrowLeft, GraduationCap, Briefcase, User,
  Globe, MessageCircle, Instagram, Github, Linkedin, Facebook
} from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import { fetchPortfolioData, updatePortfolioData, PortfolioData } from '../utils/storage';

interface AdminPanelProps {
  theme: 'dark' | 'light';
  toggleTheme: () => void;
}

const AdminPanel: React.FC<AdminPanelProps> = ({ theme, toggleTheme }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [usernameInput, setUsernameInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState<'hero' | 'about' | 'projects' | 'services' | 'media' | 'gallery' | 'contact' | 'security'>('hero');
  const [data, setData] = useState<PortfolioData | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [copyStatus, setCopyStatus] = useState<string | null>(null);
  const [revealPass, setRevealPass] = useState(false);

  const [showPicker, setShowPicker] = useState(false);
  const [pickerCallback, setPickerCallback] = useState<((url: string) => void) | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const isDark = theme === 'dark';

  useEffect(() => {
    if (sessionStorage.getItem('admin_session') === 'active') setIsLoggedIn(true);
    loadData();
  }, []);

  const loadData = async () => {
    const result = await fetchPortfolioData();
    if (result) setData(result);
  };

  // Autosave: debounce updates and perform optimistic local save + background sync
  useEffect(() => {
    if (!isLoggedIn || !data) return;
    const id = setTimeout(() => {
      setIsSaving(true);
      updatePortfolioData(data).then(() => setIsSaving(false));
    }, 1000);
    return () => clearTimeout(id);
  }, [data, isLoggedIn]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const targetUser = data?.auth?.username || 'admin';
    const targetPass = data?.auth?.password || 'admin';

    if (usernameInput === targetUser && passwordInput === targetPass) {
      setIsLoggedIn(true);
      sessionStorage.setItem('admin_session', 'active');
      setError('');
    } else {
      setError('Access Denied: Invalid Security Pointer.');
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    sessionStorage.removeItem('admin_session');
    navigate('/');
  };

  const handleSave = async () => {
    if (!data) return;
    setIsSaving(true);
    const success = await updatePortfolioData(data);
    setIsSaving(false);
    if (success) {
      // Optimistic local save complete; background sync started
      console.info('Portfolio saved locally; server sync initiated.');
    } else {
      console.error('Registry Sync Failure.');
    }
  };

  const openPicker = (callback: (url: string) => void) => {
    setPickerCallback(() => callback);
    setShowPicker(true);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!data) return;
    const file = e.target.files?.[0];
    if (file) {
      setIsProcessing(true);
      const reader = new FileReader();
      reader.onload = () => {
        const newData = { ...data, mediaLibrary: [reader.result as string, ...data.mediaLibrary] };
        setData(newData);
        // rely on autosave / optimistic update to persist in background
        setIsProcessing(false);
      };
      reader.readAsDataURL(file);
    }
  };

  const bgClass = isDark ? 'bg-[#050505]' : 'bg-[#E0FFFF]';
  const sidebarBg = isDark ? 'bg-zinc-950/90' : 'bg-white/90';
  const borderClass = isDark ? 'border-zinc-900' : 'border-zinc-200';

  // Component for the exclusive SHARIFFOLIO logo used in Admin
  const AdminLogo = () => (
    <Link to="/" className="flex items-center cursor-pointer pointer-events-auto group relative transition-all duration-300">
      {/* Architectural Brackets */}
      <motion.div className="absolute -top-1.5 -left-1.5 w-2 h-2 border-t-2 border-l-2 border-emerald-500 opacity-0 -translate-x-2 -translate-y-2 group-hover:opacity-100 group-hover:translate-x-0 group-hover:translate-y-0 transition-all duration-700" />
      <motion.div className="absolute -bottom-1.5 -right-1.5 w-2 h-2 border-b-2 border-r-2 border-emerald-500 opacity-0 translate-x-2 translate-y-2 group-hover:opacity-100 group-hover:translate-x-0 group-hover:translate-y-0 transition-all duration-700" />

      <div className="flex flex-col items-start px-2 py-1">
        <div className="flex items-center">
          <span className={`font-display text-xl md:text-2xl tracking-[0.4em] font-extrabold leading-none transition-colors duration-500 ${isDark ? 'text-white' : 'text-zinc-900'}`}>SHARIF</span>

          {/* Kinetic Separator */}
          <div className={`w-[1.5px] h-3 mx-2 md:mx-3 transition-all duration-500 ease-out group-hover:h-6 group-hover:bg-emerald-500 ${isDark ? 'bg-white/20' : 'bg-black/20'}`} />

          <span className={`font-display text-xl md:text-2xl tracking-[0.2em] font-light group-hover:text-emerald-400 group-hover:opacity-100 italic transition-all duration-700 leading-none ${isDark ? 'text-white/40' : 'text-black/40'}`}>FOLIO</span>
        </div>
      </div>
    </Link>
  );

  if (!isLoggedIn) return (
    <div className={`min-h-screen flex flex-col items-center justify-center ${bgClass} px-6 transition-colors duration-1000`}>
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
        <Link to="/" className={`group flex items-center gap-3 px-6 py-3 rounded-full transition-all ${isDark ? 'text-white/30 hover:text-white' : 'text-black/30 hover:text-black'}`}>
          <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
          <span className="text-[10px] uppercase tracking-[0.4em] font-black">Portfolio View</span>
        </Link>
      </motion.div>

      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className={`w-full max-w-md p-8 md:p-12 ${sidebarBg} backdrop-blur-3xl border ${borderClass} rounded-[2.5rem] shadow-2xl`}>
        <div className="flex flex-col items-center mb-10">
          <div className="w-16 h-16 bg-emerald-500/10 rounded-2xl flex items-center justify-center mb-4 border border-emerald-500/20">
            <ShieldCheck size={32} className="text-emerald-500" />
          </div>
          <h1 className="font-display text-4xl uppercase tracking-tighter">Auth Protocol</h1>
          <p className="text-[9px] uppercase tracking-[0.5em] font-black opacity-30 mt-1">Shariffolio Admin</p>
        </div>
        <form onSubmit={handleLogin} className="space-y-6">
          <InputField isDark={isDark} label="Identifier" value={usernameInput} onChange={setUsernameInput} />
          <div className="relative">
            <InputField isDark={isDark} label="Passphrase" type={revealPass ? "text" : "password"} value={passwordInput} onChange={setPasswordInput} />
            <button type="button" onClick={() => setRevealPass(!revealPass)} className="absolute right-5 bottom-5 p-2 opacity-30">{revealPass ? <EyeOff size={16} /> : <Eye size={16} />}</button>
          </div>
          {error && <p className="text-[9px] text-red-500 uppercase font-bold tracking-widest text-center">{error}</p>}
          <button type="submit" className={`w-full py-5 ${isDark ? 'bg-white text-black' : 'bg-black text-white'} font-black uppercase tracking-[0.5em] text-[10px] rounded-2xl transition-all`}>Authorize</button>
        </form>
      </motion.div>
    </div>
  );

  if (!data) return <div className="min-h-screen flex items-center justify-center"><Loader2 className="animate-spin" /></div>;

  const tabs = [
    { id: 'hero', label: 'Hero', icon: <LayoutDashboard size={18} /> },
    { id: 'about', label: 'Persona', icon: <User size={18} /> },
    { id: 'projects', label: 'Work', icon: <Briefcase size={18} /> },
    { id: 'services', label: 'Tech Stack', icon: <Zap size={18} /> },
    { id: 'gallery', label: 'Archive', icon: <Camera size={18} /> },
    { id: 'contact', label: 'Dispatch', icon: <Phone size={18} /> },
    { id: 'media', label: 'Vault', icon: <Database size={18} /> },
  ];

  return (
    <div className={`min-h-screen flex flex-col md:flex-row ${bgClass} transition-colors duration-1000`}>
      {/* MOBILE HEADER */}
      <div className={`md:hidden sticky top-0 z-[60] p-6 flex justify-between items-center ${sidebarBg} border-b ${borderClass} backdrop-blur-xl`}>
        <AdminLogo />
        <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="p-3 bg-white/5 rounded-xl"><Menu size={20} /></button>
      </div>

      {/* MOBILE QUICK NAV */}
      <div className="md:hidden sticky top-[77px] z-[50] overflow-x-auto no-scrollbar bg-black/5 dark:bg-white/5 border-b border-white/5 backdrop-blur-xl flex px-4 py-3 gap-2">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`whitespace-nowrap px-6 py-2 rounded-full text-[9px] uppercase font-black tracking-widest transition-all ${activeTab === tab.id ? 'bg-emerald-500 text-white shadow-lg' : 'bg-white/10 opacity-40'}`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* MOBILE FAB SYNC */}
      <div className="md:hidden fixed bottom-6 right-6 z-[100]">
        <button onClick={handleSave} className={`w-14 h-14 rounded-full flex items-center justify-center shadow-2xl ${isDark ? 'bg-white text-black' : 'bg-black text-white'}`}>
          {isSaving ? <Loader2 className="animate-spin" /> : <Save size={20} />}
        </button>
      </div>

      {/* SIDEBAR NAVIGATION (Desktop) */}
      <aside className={`fixed md:sticky inset-y-0 left-0 w-72 border-r ${borderClass} ${sidebarBg} backdrop-blur-xl flex flex-col z-[70] md:h-screen transition-transform duration-500 ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}>
        <div className="p-10 mb-4">
          <AdminLogo />
          <p className="text-[8px] uppercase tracking-[0.5em] font-black opacity-20 mt-4">Registry Control</p>
        </div>
        <nav className="flex-1 px-6 space-y-1 overflow-y-auto no-scrollbar">
          {tabs.map(tab => (
            <button key={tab.id} onClick={() => { setActiveTab(tab.id as any); setIsMobileMenuOpen(false); }} className={`flex items-center gap-4 px-6 py-4 rounded-xl text-[9px] uppercase font-black tracking-widest w-full text-left transition-all ${activeTab === tab.id ? 'bg-emerald-500 text-white shadow-xl' : 'opacity-30 hover:opacity-100 hover:bg-white/5'}`}>
              {tab.icon} {tab.label}
            </button>
          ))}
          <div className="h-[1px] bg-white/5 my-4" />
          <button onClick={() => { setActiveTab('security'); setIsMobileMenuOpen(false); }} className={`flex items-center gap-4 px-6 py-4 rounded-xl text-[9px] uppercase font-black tracking-widest w-full text-left transition-all ${activeTab === 'security' ? 'bg-red-500 text-white' : 'opacity-30 hover:opacity-100'}`}>
            <ShieldCheck size={18} /> Security
          </button>
        </nav>
        <div className="p-8 border-t border-white/5">
          <button onClick={handleLogout} className="w-full flex items-center justify-center gap-3 text-[9px] uppercase font-black tracking-widest opacity-30 hover:opacity-100 transition-all">
            <LogOut size={14} /> Terminate Session
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 p-6 md:p-16 overflow-y-auto no-scrollbar">
        <div className="max-w-4xl mx-auto space-y-12">
          <header className="flex justify-between items-center mb-12">
            <div>
              <span className="text-[9px] uppercase tracking-[0.5em] font-black opacity-30 mb-1 block">Module Pointer</span>
              <h2 className="text-5xl md:text-7xl font-display uppercase tracking-tighter">{activeTab}</h2>
            </div>
            <button onClick={handleSave} className={`hidden md:flex items-center gap-3 px-10 py-5 rounded-2xl ${isDark ? 'bg-white text-black' : 'bg-black text-white'} text-[10px] uppercase font-black tracking-[0.4em] transition-all hover:scale-105 active:scale-95`}>
              <Save size={16} /> Sync registry
            </button>
          </header>

          <AnimatePresence mode="wait">
            {/* HERO SECTION */}
            {activeTab === 'hero' && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} key="hero" className="space-y-8">
                <AdminCard title="Identity Visuals">
                  <div className="grid md:grid-cols-2 gap-6">
                    <InputField label="Title Line 1" value={data.hero.title1} onChange={(v: any) => setData({ ...data, hero: { ...data.hero, title1: v } })} isDark={isDark} />
                    <InputField label="Title Line 2" value={data.hero.title2} onChange={(v: any) => setData({ ...data, hero: { ...data.hero, title2: v } })} isDark={isDark} />
                  </div>
                  <TextArea label="Vision Monologue" value={data.hero.subtitle} onChange={(v: any) => setData({ ...data, hero: { ...data.hero, subtitle: v } })} isDark={isDark} />
                  <InputField label="Hero Background" value={data.hero.backgroundImage} onOpenLibrary={() => openPicker(url => setData({ ...data, hero: { ...data.hero, backgroundImage: url } }))} isDark={isDark} />
                </AdminCard>
              </motion.div>
            )}

            {/* PERSONA SECTION */}
            {activeTab === 'about' && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} key="about" className="space-y-12">
                <AdminCard title="Homepage Narrative">
                  <div className="grid md:grid-cols-2 gap-6">
                    <InputField label="Persona Headline" value={data.about.homepageTitle1} onChange={(v: any) => setData({ ...data, about: { ...data.about, homepageTitle1: v } })} isDark={isDark} />
                    <InputField label="Accent Word" value={data.about.homepageTitleAccent} onChange={(v: any) => setData({ ...data, about: { ...data.about, homepageTitleAccent: v } })} isDark={isDark} />
                  </div>
                  <TextArea label="Short Bio" value={data.about.homepageDescription} onChange={(v: any) => setData({ ...data, about: { ...data.about, homepageDescription: v } })} isDark={isDark} />
                  <InputField label="Profile Image" value={data.about.homepageImage} onOpenLibrary={() => openPicker(url => setData({ ...data, about: { ...data.about, homepageImage: url } }))} isDark={isDark} />
                </AdminCard>

                <AdminCard title="Detailed Biography (About Page)">
                  <TextArea label="Comprehensive Life Story" value={data.about.detailedBio} onChange={(v: any) => setData({ ...data, about: { ...data.about, detailedBio: v } })} isDark={isDark} />
                  <InputField label="Detailed View Image" value={data.about.detailedImage} onOpenLibrary={() => openPicker(url => setData({ ...data, about: { ...data.about, detailedImage: url } }))} isDark={isDark} />
                  <InputField label="CV / Resume Pointer" value={data.about.cvUrl || ''} onChange={(v: any) => setData({ ...data, about: { ...data.about, cvUrl: v } })} onOpenLibrary={() => openPicker(url => setData({ ...data, about: { ...data.about, cvUrl: url } }))} isDark={isDark} />
                </AdminCard>

                <AdminCard title="Technical Capabilities (Skills Matrix)">
                  {data.about.skills.map((skill, i) => (
                    <div key={i} className="flex gap-4 items-end border-b border-white/5 pb-6 mb-6 last:border-0 last:mb-0">
                      <div className="flex-1"><InputField label="Skill Name" value={skill.name} onChange={(v: any) => { const ns = [...data.about.skills]; ns[i].name = v; setData({ ...data, about: { ...data.about, skills: ns } }) }} isDark={isDark} /></div>
                      <div className="w-24"><InputField label="Level %" type="number" value={skill.level.toString()} onChange={(v: any) => { const ns = [...data.about.skills]; ns[i].level = parseInt(v) || 0; setData({ ...data, about: { ...data.about, skills: ns } }) }} isDark={isDark} /></div>
                      <button onClick={() => { const ns = data.about.skills.filter((_, idx) => idx !== i); setData({ ...data, about: { ...data.about, skills: ns } }) }} className="p-5 text-red-500 hover:bg-red-500/10 rounded-xl transition-all"><Trash2 size={18} /></button>
                    </div>
                  ))}
                  <button onClick={() => setData({ ...data, about: { ...data.about, skills: [...data.about.skills, { name: 'New Tool', level: 85 }] } })} className="w-full py-4 border-2 border-dashed border-white/5 rounded-xl text-[9px] uppercase font-black opacity-30 hover:opacity-100">+ Add Capability</button>
                </AdminCard>

                <AdminCard title="Academic History & Professional Timeline">
                  <div className="space-y-10">
                    <div>
                      <h4 className="text-[10px] uppercase font-black tracking-widest opacity-20 mb-4 flex items-center gap-2"><GraduationCap size={14} /> Academic Records</h4>
                      {data.about.education.map((edu, i) => (
                        <div key={i} className="flex gap-4 items-end border-b border-white/5 pb-4 mb-4">
                          <div className="flex-1 space-y-2">
                            <InputField label="Qualification" value={edu.degree} onChange={(v: any) => { const ne = [...data.about.education]; ne[i].degree = v; setData({ ...data, about: { ...data.about, education: ne } }) }} isDark={isDark} />
                            <InputField label="Institution" value={edu.school} onChange={(v: any) => { const ne = [...data.about.education]; ne[i].school = v; setData({ ...data, about: { ...data.about, education: ne } }) }} isDark={isDark} />
                          </div>
                          <button onClick={() => { const ne = data.about.education.filter((_, idx) => idx !== i); setData({ ...data, about: { ...data.about, education: ne } }) }} className="p-5 text-red-500"><Trash2 size={18} /></button>
                        </div>
                      ))}
                      <button onClick={() => setData({ ...data, about: { ...data.about, education: [...data.about.education, { degree: 'Degree', school: 'Uni' }] } })} className="w-full py-3 border border-dashed border-white/5 text-[9px] uppercase font-black opacity-30 hover:opacity-100 transition-all">+ Add Degree</button>
                    </div>

                    <div>
                      <h4 className="text-[10px] uppercase font-black tracking-widest opacity-20 mb-4 flex items-center gap-2"><Briefcase size={14} /> Professional Path</h4>
                      {data.about.timeline.map((item, i) => (
                        <div key={i} className="flex gap-4 items-end border-b border-white/5 pb-4 mb-4">
                          <div className="w-24"><InputField label="Year" value={item.year} onChange={(v: any) => { const nt = [...data.about.timeline]; nt[i].year = v; setData({ ...data, about: { ...data.about, timeline: nt } }) }} isDark={isDark} /></div>
                          <div className="flex-1"><InputField label="Event" value={item.description} onChange={(v: any) => { const nt = [...data.about.timeline]; nt[i].description = v; setData({ ...data, about: { ...data.about, timeline: nt } }) }} isDark={isDark} /></div>
                          <button onClick={() => { const nt = data.about.timeline.filter((_, idx) => idx !== i); setData({ ...data, about: { ...data.about, timeline: nt } }) }} className="p-5 text-red-500"><Trash2 size={18} /></button>
                        </div>
                      ))}
                      <button onClick={() => setData({ ...data, about: { ...data.about, timeline: [...data.about.timeline, { year: '2025', description: 'Event' }] } })} className="w-full py-3 border border-dashed border-white/5 text-[9px] uppercase font-black opacity-30 hover:opacity-100 transition-all">+ Add Entry</button>
                    </div>
                  </div>
                </AdminCard>
              </motion.div>
            )}

            {/* PROJECTS SECTION */}
            {activeTab === 'projects' && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} key="projects" className="space-y-10">
                <button onClick={() => setData({ ...data, projects: [{ id: Date.now().toString(), title: 'New Venture', category: 'Dev', tech: [], description: '', imageUrl: '', liveUrl: '' }, ...data.projects] })} className="w-full py-12 border-2 border-dashed border-white/5 rounded-3xl opacity-20 hover:opacity-100 transition-all font-black uppercase text-[10px] tracking-widest">+ Initialize Work Case</button>
                {data.projects.map((p, i) => (
                  <AdminCard key={p.id} title={`Work Archive #${i + 1}`}>
                    <div className="grid md:grid-cols-2 gap-6">
                      <InputField label="Nomenclature" value={p.title} onChange={(v: any) => { const np = [...data.projects]; np[i].title = v; setData({ ...data, projects: np }); }} isDark={isDark} />
                      <InputField label="Discipline" value={p.category} onChange={(v: any) => { const np = [...data.projects]; np[i].category = v; setData({ ...data, projects: np }); }} isDark={isDark} />
                      <InputField label="Primary Visual" value={p.imageUrl} onOpenLibrary={() => openPicker(url => { const np = [...data.projects]; np[i].imageUrl = url; setData({ ...data, projects: np }); })} isDark={isDark} />
                      <InputField label="Live Node URL" value={p.liveUrl} onChange={(v: any) => { const np = [...data.projects]; np[i].liveUrl = v; setData({ ...data, projects: np }); }} isDark={isDark} />
                    </div>
                    <InputField label="Technological Foundation (Comma Separated Tags)" value={p.tech.join(', ')} onChange={(v: any) => { const np = [...data.projects]; np[i].tech = v.split(',').map((s: any) => s.trim()).filter((s: any) => s !== ''); setData({ ...data, projects: np }); }} isDark={isDark} />
                    <TextArea label="Contextual Monologue" value={p.description} onChange={(v: any) => { const np = [...data.projects]; np[i].description = v; setData({ ...data, projects: np }); }} isDark={isDark} />
                    <button onClick={() => { if (confirm("Confirm registry dissolution?")) setData({ ...data, projects: data.projects.filter(pr => pr.id !== p.id) }) }} className="text-red-500/30 hover:text-red-500 text-[8px] uppercase font-black tracking-widest flex items-center gap-2"><Trash2 size={12} /> Dissolve Registry</button>
                  </AdminCard>
                ))}
              </motion.div>
            )}

            {/* SERVICES SECTION */}
            {activeTab === 'services' && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} key="services" className="space-y-10">
                <button onClick={() => setData({ ...data, services: [{ id: Date.now().toString(), title: 'Technical Pillar', description: '', iconType: 'code' }, ...data.services] })} className="w-full py-12 border-2 border-dashed border-white/5 rounded-3xl opacity-20 hover:opacity-100 transition-all font-black uppercase text-[10px] tracking-widest">+ Add Tech Pillar</button>
                {data.services.map((s, i) => (
                  <AdminCard key={s.id} title={`Service Registry #${i + 1}`}>
                    <div className="grid md:grid-cols-2 gap-6">
                      <InputField label="Technical Label" value={s.title} onChange={(v: any) => { const ns = [...data.services]; ns[i].title = v; setData({ ...data, services: ns }); }} isDark={isDark} />
                      <div className="space-y-2">
                        <label className="text-[9px] uppercase font-black tracking-widest opacity-20">Icon Representation</label>
                        <select value={s.iconType} onChange={(e) => { const ns = [...data.services]; ns[i].iconType = e.target.value as any; setData({ ...data, services: ns }); }} className={`w-full p-6 rounded-2xl border ${isDark ? 'bg-black border-white/5 text-white' : 'bg-white border-black/5 text-black'} outline-none text-sm`}>
                          <option value="code">Code Node</option>
                          <option value="layout">Architectural</option>
                          <option value="zap">Performance</option>
                          <option value="smartphone">Mobile Native</option>
                        </select>
                      </div>
                    </div>
                    <TextArea label="Capability Monologue" value={s.description} onChange={(v: any) => { const ns = [...data.services]; ns[i].description = v; setData({ ...data, services: ns }); }} isDark={isDark} />
                    <button onClick={() => { if (confirm("Confirm dissolution?")) setData({ ...data, services: data.services.filter(serv => serv.id !== s.id) }) }} className="text-red-500/30 hover:text-red-500 text-[8px] uppercase font-black tracking-widest flex items-center gap-2"><Trash2 size={12} /> Remove Pillar</button>
                  </AdminCard>
                ))}
              </motion.div>
            )}

            {/* GALLERY SECTION */}
            {activeTab === 'gallery' && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} key="gallery" className="space-y-10">
                <button onClick={() => setData({ ...data, gallery: [{ id: Date.now().toString(), title: 'Untreated Vision', description: '', imageUrl: '', metadata: '2025' }, ...data.gallery] })} className="w-full py-12 border-2 border-dashed border-white/5 rounded-3xl opacity-20 hover:opacity-100 transition-all font-black uppercase text-[10px] tracking-widest">+ New Archive Frame</button>
                {data.gallery.map((g, i) => (
                  <AdminCard key={g.id} title={`Visual Registry #${i + 1}`}>
                    <div className="grid md:grid-cols-2 gap-6">
                      <InputField label="Artistic Label" value={g.title} onChange={(v: any) => { const ng = [...data.gallery]; ng[i].title = v; setData({ ...data, gallery: ng }); }} isDark={isDark} />
                      <InputField label="Temporal Metadata (Year/Date)" value={g.metadata} onChange={(v: any) => { const ng = [...data.gallery]; ng[i].metadata = v; setData({ ...data, gallery: ng }); }} isDark={isDark} />
                    </div>
                    <InputField label="Visual Source Pointer" value={g.imageUrl} onOpenLibrary={() => openPicker(url => { const ng = [...data.gallery]; ng[i].imageUrl = url; setData({ ...data, gallery: ng }); })} isDark={isDark} />
                    <TextArea label="Conceptual Narrative" value={g.description} onChange={(v: any) => { const ng = [...data.gallery]; ng[i].description = v; setData({ ...data, gallery: ng }); }} isDark={isDark} />
                    <button onClick={() => { if (confirm("Archive dissolution?")) setData({ ...data, gallery: data.gallery.filter(item => item.id !== g.id) }) }} className="text-red-500/30 hover:text-red-500 text-[8px] uppercase font-black tracking-widest flex items-center gap-2"><Trash2 size={12} /> Evict Frame</button>
                  </AdminCard>
                ))}
              </motion.div>
            )}

            {/* CONTACT SECTION */}
            {activeTab === 'contact' && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} key="contact" className="space-y-10">
                <AdminCard title="Dispatch Nodes (Direct Contact)">
                  <div className="grid md:grid-cols-2 gap-6">
                    <InputField label="Email Architecture" value={data.contact.email} onChange={(v: any) => setData({ ...data, contact: { ...data.contact, email: v } })} isDark={isDark} />
                    <InputField label="Voice Pointer (Phone)" value={data.contact.phone} onChange={(v: any) => setData({ ...data, contact: { ...data.contact, phone: v } })} isDark={isDark} />
                    <InputField label="WhatsApp ID" value={data.contact.whatsapp} onChange={(v: any) => setData({ ...data, contact: { ...data.contact, whatsapp: v } })} isDark={isDark} />
                    <InputField label="GitHub Repository" value={data.contact.github} onChange={(v: any) => setData({ ...data, contact: { ...data.contact, github: v } })} isDark={isDark} />
                    <InputField label="LinkedIn Registry" value={data.contact.linkedin} onChange={(v: any) => setData({ ...data, contact: { ...data.contact, linkedin: v } })} isDark={isDark} />
                    <InputField label="Instagram Monograph" value={data.contact.instagram} onChange={(v: any) => setData({ ...data, contact: { ...data.contact, instagram: v } })} isDark={isDark} />
                  </div>
                </AdminCard>

                <AdminCard title="External Pointers (Custom Links)">
                  {(data.contact.customLinks || []).map((link, i) => (
                    <div key={i} className="flex gap-4 items-end border-b border-white/5 pb-4 mb-4">
                      <div className="flex-1 space-y-2">
                        <InputField label="Label" value={link.name} onChange={(v: any) => { const nl = [...(data.contact.customLinks || [])]; nl[i].name = v; setData({ ...data, contact: { ...data.contact, customLinks: nl } }) }} isDark={isDark} />
                        <InputField label="URL Node" value={link.url} onChange={(v: any) => { const nl = [...(data.contact.customLinks || [])]; nl[i].url = v; setData({ ...data, contact: { ...data.contact, customLinks: nl } }) }} isDark={isDark} />
                      </div>
                      <button onClick={() => { const nl = (data.contact.customLinks || []).filter((_, idx) => idx !== i); setData({ ...data, contact: { ...data.contact, customLinks: nl } }) }} className="p-5 text-red-500"><Trash2 size={18} /></button>
                    </div>
                  ))}
                  <button onClick={() => setData({ ...data, contact: { ...data.contact, customLinks: [...(data.contact.customLinks || []), { name: 'Label', url: '' }] } })} className="w-full py-3 border border-dashed border-white/5 text-[9px] uppercase font-black opacity-30 hover:opacity-100">+ Add custom link</button>
                </AdminCard>
              </motion.div>
            )}

            {/* MEDIA VAULT SECTION */}
            {activeTab === 'media' && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} key="media" className="space-y-8">
                <AdminCard title="The Asset Vault">
                  <div className="flex flex-col md:flex-row gap-4 mb-10">
                    <button onClick={() => fileInputRef.current?.click()} className={`${isDark ? 'bg-white text-black' : 'bg-black text-white'} px-10 py-5 rounded-2xl text-[10px] uppercase font-black tracking-widest flex items-center justify-center gap-3 transition-all active:scale-95`}>
                      <Upload size={16} /> Local Ingestion
                    </button>
                  </div>
                  <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileUpload} />
                  <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
                    {data.mediaLibrary.map((url, i) => (
                      <div key={i} className="group relative aspect-[3/4] rounded-2xl overflow-hidden bg-zinc-900 border border-white/5 shadow-xl">
                        <img src={url} className="w-full h-full object-cover grayscale transition-all duration-700" />
                        <div className="absolute inset-0 bg-black/95 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center gap-3 transition-all duration-300 p-4">
                          <button onClick={() => { navigator.clipboard.writeText(url); setCopyStatus(url); setTimeout(() => setCopyStatus(null), 2000); }} className="w-full py-3 bg-white text-black rounded-lg text-[8px] uppercase font-black tracking-widest">{copyStatus === url ? 'Linked' : 'Pointer'}</button>
                          <button onClick={() => { if (confirm("Evict asset?")) { const nl = data.mediaLibrary.filter(u => u !== url); setData({ ...data, mediaLibrary: nl }); } }} className="w-full py-3 bg-red-500/10 text-red-500 rounded-lg text-[8px] uppercase font-black tracking-widest">Dissolve</button>
                        </div>
                      </div>
                    ))}
                  </div>
                </AdminCard>
              </motion.div>
            )}

            {/* SECURITY SECTION */}
            {activeTab === 'security' && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} key="security" className="space-y-8">
                <AdminCard title="Access Architecture">
                  <div className="p-8 bg-red-500/5 border border-red-500/10 rounded-2xl flex items-start gap-4 mb-10">
                    <ShieldAlert className="text-red-500 shrink-0 mt-1" size={24} />
                    <p className="text-[11px] leading-relaxed opacity-60">Modification of these identifiers will immediately lock the registry. Ensure new pointers are archived.</p>
                  </div>
                  <div className="grid md:grid-cols-2 gap-8">
                    <InputField label="Registry Identifier (User)" value={data.auth?.username ?? ''} onChange={(v: any) => setData({ ...data, auth: { ...(data.auth || { password: 'admin' }), username: v } })} isDark={isDark} />
                    <InputField label="Security Passphrase (Pass)" value={data.auth?.password ?? ''} onChange={(v: any) => setData({ ...data, auth: { ...(data.auth || { username: 'admin' }), password: v } })} isDark={isDark} />
                  </div>
                </AdminCard>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>

      {/* VAULT PICKER OVERLAY */}
      <AnimatePresence>
        {showPicker && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[1200] bg-black/98 flex items-center justify-center p-4 md:p-10 backdrop-blur-3xl">
            <div className={`w-full max-w-5xl ${sidebarBg} border ${borderClass} rounded-[2.5rem] flex flex-col max-h-[90vh] shadow-2xl overflow-hidden`}>
              <div className="p-8 border-b border-white/5 flex justify-between items-center">
                <h3 className="text-2xl font-display uppercase tracking-widest">Select Asset</h3>
                <button onClick={() => setShowPicker(false)} className="p-4 bg-white/5 rounded-full hover:bg-red-500 transition-all"><X size={20} /></button>
              </div>
              <div className="flex-1 overflow-y-auto p-8 no-scrollbar">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  {data.mediaLibrary.map((url, i) => (
                    <div key={i} className="group relative aspect-[3/4] rounded-2xl overflow-hidden cursor-pointer" onClick={() => { pickerCallback?.(url); setShowPicker(false); }}>
                      <img src={url} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all" />
                      <div className="absolute inset-0 bg-emerald-500/80 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all"><span className="text-[9px] font-black uppercase text-white tracking-widest">Inject</span></div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const AdminCard = ({ title, children }: any) => (
  <div className="p-8 md:p-10 rounded-[2.5rem] border border-white/5 bg-white/5 backdrop-blur-3xl space-y-10">
    <h3 className="text-[10px] uppercase font-black tracking-[0.6em] opacity-20 border-b border-white/5 pb-6 flex items-center gap-3">
      <div className="w-2.5 h-2.5 bg-emerald-500/10 rounded-full border border-emerald-500/30" />
      {title}
    </h3>
    {children}
  </div>
);

const InputField = ({ label, value, onChange, type = "text", onOpenLibrary, isDark }: any) => (
  <div className="space-y-4 w-full">
    <div className="flex justify-between items-center px-2">
      <label className="text-[9px] uppercase font-black tracking-[0.4em] opacity-20">{label}</label>
      {onOpenLibrary && (
        <button onClick={onOpenLibrary} className="text-[8px] uppercase font-black tracking-widest flex items-center gap-2 text-emerald-500 opacity-60">
          <FolderOpen size={10} /> Vault
        </button>
      )}
    </div>
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={`w-full p-6 rounded-2xl border ${isDark ? 'bg-black/40 border-white/5 text-white' : 'bg-white border-black/5 text-black'} outline-none text-sm font-semibold focus:border-emerald-500/40 transition-all`}
    />
  </div>
);

const TextArea = ({ label, value, onChange, isDark }: any) => (
  <div className="space-y-4 w-full">
    <label className="text-[9px] uppercase font-black tracking-[0.4em] px-2 opacity-20">{label}</label>
    <textarea
      rows={5}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={`w-full p-6 rounded-2xl border ${isDark ? 'bg-black/40 border-white/5 text-white' : 'bg-white border-black/5 text-black'} outline-none resize-none text-sm font-medium focus:border-emerald-500/40 transition-all`}
    />
  </div>
);

export default AdminPanel;
