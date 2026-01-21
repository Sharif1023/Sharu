
import React, { useEffect, useState } from 'react';
import { HashRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import BackToTop from './components/BackToTop';
import WhatsAppButton from './components/WhatsAppButton';
import HomePage from './pages/HomePage';
import AllProjectsPage from './pages/AllProjectsPage';
import AboutPage from './pages/AboutPage';
import AdminPanel from './pages/AdminPanel';
import { fetchPortfolioData, PortfolioData } from './utils/storage';
import { Loader2 } from 'lucide-react';

const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

const HashScrollHandler = () => {
  const { pathname, hash } = useLocation();
  useEffect(() => {
    if (pathname === '/' && hash) {
      const id = hash.replace('#', '');
      const element = document.getElementById(id);
      if (element) {
        setTimeout(() => element.scrollIntoView({ behavior: 'smooth' }), 150);
      }
    }
  }, [pathname, hash]);
  return null;
};

function App() {
  const [theme, setTheme] = useState<'dark' | 'light'>('light');
  const [data, setData] = useState<PortfolioData | null>(null);
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  const isAdminPage = location.pathname.startsWith('/admin');

  const toggleTheme = () => setTheme(prev => prev === 'dark' ? 'light' : 'dark');

  const loadData = async () => {
    const result = await fetchPortfolioData();
    if (result) setData(result);
    setLoading(false);
  };

  useEffect(() => {
    document.body.className = theme;
  }, [theme]);

  useEffect(() => {
    loadData();
    const handleUpdate = (e: any) => {
      if (e.detail) setData(e.detail);
      else loadData();
    };
    window.addEventListener('portfolio-data-updated', handleUpdate);
    return () => window.removeEventListener('portfolio-data-updated', handleUpdate);
  }, []);

  if (loading) {
    return (
      <div className={`min-h-screen flex flex-col items-center justify-center ${theme === 'dark' ? 'bg-black text-white' : 'bg-[#E0FFFF] text-black'}`}>
        <Loader2 className="w-12 h-12 animate-spin mb-4 text-emerald-500" />
        <span className="text-[10px] uppercase tracking-[0.6em] font-bold opacity-40">Syncing Architecture</span>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black text-white">
        <p className="text-sm uppercase tracking-widest font-bold">Registry Connection Failure</p>
      </div>
    );
  }

  return (
    <div className={`relative selection:bg-zinc-400 selection:text-white min-h-screen transition-colors duration-500 ${theme === 'dark' ? 'text-white' : 'text-zinc-900'}`}>
      {!isAdminPage && <Navbar theme={theme} toggleTheme={toggleTheme} data={data.menuNames.public} contact={data.contact} />}
      <ScrollToTop />
      <HashScrollHandler />
      <main>
        <Routes>
          <Route path="/" element={<HomePage theme={theme} data={data} />} />
          <Route path="/projects" element={<AllProjectsPage theme={theme} data={data} />} />
          <Route path="/about" element={<AboutPage theme={theme} data={data} />} />
          <Route path="/admin" element={<AdminPanel theme={theme} toggleTheme={toggleTheme} />} />
        </Routes>
      </main>
      {!isAdminPage && (
        <>
          <WhatsAppButton theme={theme} phoneNumber={data.contact.whatsapp} />
          <BackToTop theme={theme} />
          <Footer theme={theme} data={data.contact} />
        </>
      )}
    </div>
  );
}

const AppWrapper = () => (
  <Router><App /></Router>
);

export default AppWrapper;
