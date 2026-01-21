
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Sun, Moon, MessageCircle, Linkedin, Github, Facebook, Instagram, ExternalLink } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { ContactInfo } from '../types';

interface NavbarProps {
  theme: 'dark' | 'light';
  toggleTheme: () => void;
  data: { home: string; projects: string; about: string; services: string; contact: string; };
  contact: ContactInfo;
}

const Navbar: React.FC<NavbarProps> = ({ theme, toggleTheme, data, contact }) => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const isHome = location.pathname === '/';

  const navItems = [
    { name: data.home || 'Home', path: isHome ? '#hero' : '/', isHash: isHome },
    { name: data.projects || 'Projects', path: '/projects', isHash: false },
    { name: data.about || 'About', path: '/about', isHash: false },
    { name: data.services || 'Services', path: isHome ? '#services' : '/#services', isHash: true },
    { name: data.contact || 'Contact', path: isHome ? '#contact' : '/#contact', isHash: true },
  ];

  const socialLinks = [
    { icon: <MessageCircle size={18} />, url: `https://wa.me/${contact.whatsapp}`, label: 'WhatsApp' },
    { icon: <Linkedin size={18} />, url: contact.linkedin, label: 'LinkedIn' },
    { icon: <Github size={18} />, url: contact.github, label: 'GitHub' },
    { icon: <Facebook size={18} />, url: contact.facebook, label: 'Facebook' },
    { icon: <Instagram size={18} />, url: contact.instagram, label: 'Instagram' },
    ...(contact.customLinks || []).map(link => ({
      icon: <ExternalLink size={18} />,
      url: link.url,
      label: link.name
    }))
  ];

  const handleNavClick = (e: React.MouseEvent, item: any) => {
    if (item.isHash && isHome) {
      e.preventDefault();
      const id = item.path.split('#')[1];
      const element = document.getElementById(id);
      if (element) { 
        element.scrollIntoView({ behavior: 'smooth' }); 
        setIsOpen(false); 
      }
    } else { 
      setIsOpen(false); 
    }
  };

  const isDark = theme === 'dark';
  const linkColor = isDark ? 'text-white' : 'text-zinc-900';
  const bgColor = isDark ? 'bg-black' : 'bg-[#E0FFFF]';

  return (
    <>
      <motion.nav 
        initial={{ y: -40, opacity: 0 }} 
        animate={{ y: 0, opacity: 1 }} 
        transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }} 
        className="fixed top-0 left-0 w-full z-[60] px-6 py-6 md:px-12 md:py-10 flex justify-between items-center mix-blend-difference pointer-events-none"
      >
        {/* EXCLUSIVE ARCHITECTURAL LOGO */}
        <Link to="/" className="flex items-center cursor-pointer pointer-events-auto group relative">
          {/* Architectural Brackets */}
          <motion.div 
            className="absolute -top-2 -left-2 w-3 h-3 border-t-2 border-l-2 border-emerald-500 opacity-0 -translate-x-2 -translate-y-2 group-hover:opacity-100 group-hover:translate-x-0 group-hover:translate-y-0 transition-all duration-700" 
          />
          <motion.div 
            className="absolute -bottom-2 -right-2 w-3 h-3 border-b-2 border-r-2 border-emerald-500 opacity-0 translate-x-2 translate-y-2 group-hover:opacity-100 group-hover:translate-x-0 group-hover:translate-y-0 transition-all duration-700" 
          />

          <div className="flex flex-col items-start px-2 py-1">
            <div className="flex items-center">
              <span className="font-display text-2xl md:text-3xl tracking-[0.4em] font-extrabold text-white leading-none">SHARIF</span>
              
              {/* Kinetic Separator */}
              <div className="w-[1.5px] h-4 bg-white/20 mx-3 md:mx-4 group-hover:h-8 group-hover:bg-emerald-500 transition-all duration-500 ease-out" />
              
              <span className="font-display text-2xl md:text-3xl tracking-[0.2em] font-light text-white/40 group-hover:text-emerald-400 group-hover:opacity-100 italic transition-all duration-700 leading-none">FOLIO</span>
            </div>
          </div>
        </Link>

        <div className="flex items-center gap-6 md:gap-16 pointer-events-auto">
          <div className="hidden md:flex gap-12 text-[10px] uppercase tracking-[0.4em] font-bold items-center">
            {navItems.map((item) => (
              <Link 
                key={item.name} 
                to={item.path} 
                onClick={(e) => handleNavClick(e, item)} 
                className="relative group text-white/40 hover:text-white transition-all duration-500"
              >
                <span className="relative z-10">{item.name}</span>
                <motion.div 
                  className="absolute -bottom-2 left-0 w-full h-[1px] bg-white origin-left" 
                  initial={{ scaleX: 0 }} 
                  whileHover={{ scaleX: 1 }} 
                  transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }} 
                />
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-4 md:gap-8">
            <button 
              onClick={toggleTheme} 
              className="p-2 text-white/40 hover:text-white transition-colors duration-500"
              aria-label="Toggle Theme"
            >
              {isDark ? <Sun size={18} /> : <Moon size={18} />}
            </button>
            <button 
              onClick={() => setIsOpen(!isOpen)} 
              className="md:hidden text-white p-2 relative z-50"
              aria-label="Open Menu"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </motion.nav>

      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, x: '100%' }} 
            animate={{ opacity: 1, x: 0 }} 
            exit={{ opacity: 0, x: '100%' }} 
            transition={{ type: 'spring', damping: 30, stiffness: 200 }}
            className={`fixed inset-0 ${bgColor} z-[55] flex flex-col md:hidden overflow-hidden`}
          >
            <div className="flex-1 flex flex-col justify-center items-center gap-8 mt-16 px-12 overflow-y-auto no-scrollbar">
              {navItems.map((item, i) => (
                <Link 
                  key={item.name} 
                  to={item.path} 
                  onClick={(e) => handleNavClick(e, item)} 
                  className={`font-display text-6xl tracking-tighter uppercase ${linkColor} group w-full text-center`}
                >
                  <motion.span 
                    initial={{ opacity: 0, y: 30 }} 
                    animate={{ opacity: 1, y: 0 }} 
                    transition={{ delay: 0.1 * i + 0.3, duration: 0.8 }} 
                    className="block"
                  >
                    {item.name}
                  </motion.span>
                </Link>
              ))}
            </div>
            <div className="pb-16 px-8 flex flex-col items-center gap-8">
              <div className="flex flex-wrap justify-center gap-4">
                {socialLinks.map((link, idx) => (
                  <a 
                    key={`${link.label}-${idx}`} 
                    href={link.url} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className={`w-14 h-14 rounded-2xl border flex items-center justify-center transition-all duration-500 ${isDark ? 'border-white/5 bg-white/5 text-white hover:bg-white hover:text-black' : 'border-black/5 bg-black/5 text-black hover:bg-black hover:text-white'}`}
                  >
                    {link.icon}
                  </a>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
