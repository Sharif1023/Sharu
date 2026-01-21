
import React from 'react';
import { Mail, Phone, MessageCircle, Linkedin, Github, Facebook, Instagram, Lock, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';
import { ContactInfo } from '../types';

interface FooterProps {
  theme?: 'dark' | 'light';
  data: ContactInfo;
}

const Footer: React.FC<FooterProps> = ({ theme = 'dark', data }) => {
  const isDark = theme === 'dark';
  const textColorPrimary = isDark ? 'text-white' : 'text-black';
  const textColorSecondary = isDark ? 'text-zinc-600' : 'text-zinc-500';
  const textColorMuted = isDark ? 'text-zinc-700' : 'text-zinc-400';
  const bgClass = isDark ? 'bg-black' : 'bg-[#E0FFFF]';
  const borderClass = isDark ? 'border-zinc-900' : 'border-zinc-200';

  const socialLinks = [
    { icon: <MessageCircle size={16} />, url: `https://wa.me/${data.whatsapp}`, label: 'WhatsApp' },
    { icon: <Linkedin size={16} />, url: data.linkedin, label: 'LinkedIn' },
    { icon: <Github size={16} />, url: data.github, label: 'GitHub' },
    { icon: <Facebook size={16} />, url: data.facebook, label: 'Facebook' },
    { icon: <Instagram size={16} />, url: data.instagram, label: 'Instagram' },
    ...(data.customLinks || []).map(link => ({
      icon: <ExternalLink size={16} />,
      url: link.url,
      label: link.name
    }))
  ];

  return (
    <footer className={`py-12 md:py-20 px-6 md:px-12 border-t transition-colors duration-500 ${bgClass} ${borderClass}`}>
      <div className="max-w-7xl mx-auto">
        {/* Main Footer Grid: 2 columns on mobile, 3 on desktop */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-8 md:gap-10 items-start mb-14">
          {/* Brand Section - Hidden on Mobile */}
          <div className="hidden md:flex flex-col gap-4">
            <h4 className={`text-[10px] uppercase tracking-[0.4em] font-bold ${textColorMuted}`}>Shariffolio</h4>
            <p className={`text-[10px] uppercase tracking-[0.3em] font-bold max-w-sm ${textColorSecondary}`}>
              Full Stack Web Developer crafting next-gen digital products.
            </p>
          </div>

          {/* Contact Section */}
          <div className="flex flex-col gap-4">
            <h4 className={`text-[10px] uppercase tracking-[0.4em] font-bold ${textColorMuted}`}>Contact</h4>
            <div className="flex flex-col gap-3">
              <a href={`mailto:${data.email}`} className={`inline-flex items-center gap-3 text-[11px] font-semibold opacity-80 hover:opacity-100 transition truncate ${textColorPrimary}`}>
                <Mail className="w-4 h-4 shrink-0" />
                <span className="truncate">{data.email}</span>
              </a>
              <a href={`tel:${data.phone}`} className={`inline-flex items-center gap-3 text-[11px] font-semibold opacity-80 hover:opacity-100 transition ${textColorPrimary}`}>
                <Phone className="w-4 h-4 shrink-0" />
                <span>{data.phone}</span>
              </a>
            </div>
          </div>

          {/* Social Section */}
          <div className="flex flex-col gap-4 items-start">
            <h4 className={`text-[10px] uppercase tracking-[0.4em] font-bold ${textColorMuted}`}>Social</h4>
            <div className="flex flex-row flex-wrap gap-4 items-center">
              {socialLinks.map((link, i) => (
                <a key={`${link.label}-${i}`} href={link.url} target="_blank" rel="noopener noreferrer" title={link.label} className={`opacity-60 hover:opacity-100 transition ${textColorPrimary}`}>
                  {link.icon}
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Global availability text for mobile - aligned below the grid */}
        <div className="md:hidden mb-10">
          <p className={`text-[9px] uppercase tracking-[0.2em] font-bold text-center ${textColorSecondary}`}>Online & Available Worldwide</p>
        </div>

        <div className={`pt-8 border-t flex flex-col md:flex-row justify-between items-center gap-6 ${isDark ? 'border-zinc-900/50' : 'border-zinc-200/50'}`}>
          <div className={`text-[10px] uppercase tracking-widest font-bold ${isDark ? 'text-zinc-700' : 'text-zinc-400'}`}>&copy; 2025 Sharif Islam.</div>
          <div className="flex flex-col md:flex-row items-center gap-4 md:gap-8">
            <p className={`text-[9px] uppercase tracking-[0.5em] font-bold ${isDark ? 'text-zinc-800' : 'text-zinc-300'}`}>Built for the Modern Web</p>
            <Link to="/admin" className={`flex items-center gap-2 text-[8px] uppercase tracking-[0.3em] font-bold opacity-20 hover:opacity-100 transition ${textColorPrimary}`}>
              <Lock size={10} />
              <span>Admin Control</span>
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
