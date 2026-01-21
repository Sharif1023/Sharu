
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Mail, MessageCircle, Linkedin, Github, Facebook, Instagram, Phone, ExternalLink, Check } from 'lucide-react';
import { ContactInfo } from '../types';

interface ContactProps {
  theme?: 'dark' | 'light';
  data: ContactInfo;
}

const Contact: React.FC<ContactProps> = ({ theme = 'dark', data }) => {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [isSubmitted, setIsSubmitted] = useState(false);
  
  const isDark = theme === 'dark';
  const textColorPrimary = isDark ? 'text-white' : 'text-black';
  const textColorMuted = isDark ? 'text-zinc-600' : 'text-zinc-400';
  const bgClass = isDark ? 'bg-black' : 'bg-[#E0FFFF]';
  const formBgClass = isDark ? 'bg-zinc-950/50' : 'bg-white/50';
  const borderClass = isDark ? 'border-zinc-900' : 'border-zinc-200';
  const inputBorderClass = isDark ? 'border-zinc-900 focus:border-white/30' : 'border-zinc-200 focus:border-black/30';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const targetEmail = 'sharifislam02001@gmail.com';
    const subject = encodeURIComponent(`New Inquiry: ${formData.name} via Portfolio`);
    const body = encodeURIComponent(`Name: ${formData.name}\nEmail: ${formData.email}\n\nMessage:\n${formData.message}`);
    
    setIsSubmitted(true);

    // Short delay to show the success state before redirecting
    setTimeout(() => {
      window.location.href = `mailto:${targetEmail}?subject=${subject}&body=${body}`;
      
      // Reset after a longer period
      setTimeout(() => {
        setIsSubmitted(false);
        setFormData({ name: '', email: '', message: '' });
      }, 3000);
    }, 800);
  };

  const socialLinks = [
    { icon: <MessageCircle className="w-5 h-5" />, url: `https://wa.me/${data.whatsapp}`, label: "WhatsApp" },
    { icon: <Linkedin className="w-5 h-5" />, url: data.linkedin, label: "LinkedIn" },
    { icon: <Github className="w-5 h-5" />, url: data.github, label: "GitHub" },
    { icon: <Facebook className="w-5 h-5" />, url: data.facebook, label: "Facebook" },
    { icon: <Instagram className="w-5 h-5" />, url: data.instagram, label: "Instagram" },
    ...(data.customLinks || []).map(link => ({
      icon: <ExternalLink className="w-5 h-5" />,
      url: link.url,
      label: link.name
    }))
  ];

  return (
    <section id="contact" className={`py-16 md:py-24 px-6 md:px-12 relative overflow-hidden transition-colors duration-1000 ${bgClass}`}>
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid lg:grid-cols-2 gap-20 md:gap-32 items-center">
          {/* Info Section - Hidden on Mobile */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }} 
            whileInView={{ opacity: 1, x: 0 }} 
            viewport={{ once: true }}
            className="hidden lg:block"
          >
            <span className={`text-[10px] uppercase tracking-[0.5em] font-bold mb-4 block ${textColorMuted}`}>Connect</span>
            <h3 className={`text-4xl md:text-7xl font-display uppercase tracking-tighter leading-none mb-10 ${textColorPrimary}`}>Let's build <br /> <span className="italic opacity-40">something</span> <br /> legendary.</h3>
            <div className="space-y-10 mt-4">
              <div className="flex items-start gap-6">
                <div className={`p-3 rounded-2xl border ${borderClass} ${formBgClass}`}><Mail className={`w-5 h-5 ${textColorPrimary}`} /></div>
                <div><p className={`text-[9px] uppercase tracking-widest font-bold mb-1 ${textColorMuted}`}>Email Directly</p><p className={`text-lg font-light ${textColorPrimary}`}>{data.email}</p></div>
              </div>
              <div className="flex items-start gap-6">
                <div className={`p-3 rounded-2xl border ${borderClass} ${formBgClass}`}><Phone className={`w-5 h-5 ${textColorPrimary}`} /></div>
                <div><p className={`text-[9px] uppercase tracking-widest font-bold mb-1 ${textColorMuted}`}>Call Anytime</p><p className={`text-lg font-light ${textColorPrimary}`}>{data.phone}</p></div>
              </div>
              <div className="pt-8">
                <p className={`text-[9px] uppercase tracking-widest font-bold mb-6 ${textColorMuted}`}>Social Synchronicity</p>
                <div className="flex flex-wrap gap-4">
                  {socialLinks.map((link, idx) => (
                    <a key={`${link.label}-${idx}`} href={link.url} target="_blank" rel="noopener noreferrer" title={link.label} className={`p-4 rounded-2xl border transition-all duration-500 ${borderClass} ${formBgClass} hover:bg-current hover:invert`}>{link.icon}</a>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>

          {/* Form Section - Full Width on Mobile */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }} 
            whileInView={{ opacity: 1, y: 0 }} 
            viewport={{ once: true }} 
            className={`p-8 md:p-12 border transition-colors duration-1000 ${formBgClass} ${borderClass} shadow-2xl rounded-3xl backdrop-blur-sm w-full`}
          >
            <div className="lg:hidden mb-8">
              <span className={`text-[9px] uppercase tracking-[0.4em] font-bold mb-2 block ${textColorMuted}`}>Connect with Sharif</span>
              <h4 className={`text-3xl font-display uppercase tracking-widest ${textColorPrimary}`}>Dispatch Inquiry</h4>
            </div>
            <h4 className={`hidden lg:block text-xl md:text-2xl font-display uppercase tracking-widest mb-10 ${textColorPrimary}`}>Dispatch a Request</h4>
            
            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className={`text-[9px] uppercase tracking-[0.4em] font-bold ${textColorMuted}`}>Full Name</label>
                  <input 
                    type="text" 
                    required 
                    value={formData.name} 
                    onChange={(e) => setFormData({...formData, name: e.target.value})} 
                    placeholder="Your Name" 
                    disabled={isSubmitted}
                    className={`w-full bg-transparent border-b py-3 focus:outline-none transition-all text-base font-light ${inputBorderClass} disabled:opacity-50`} 
                  />
                </div>
                <div className="space-y-2">
                  <label className={`text-[9px] uppercase tracking-[0.4em] font-bold ${textColorMuted}`}>Email Address</label>
                  <input 
                    type="email" 
                    required 
                    value={formData.email} 
                    onChange={(e) => setFormData({...formData, email: e.target.value})} 
                    placeholder="name@domain.com" 
                    disabled={isSubmitted}
                    className={`w-full bg-transparent border-b py-3 focus:outline-none transition-all text-base font-light ${inputBorderClass} disabled:opacity-50`} 
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className={`text-[9px] uppercase tracking-[0.4em] font-bold ${textColorMuted}`}>The Vision</label>
                <textarea 
                  rows={4} 
                  required 
                  value={formData.message} 
                  onChange={(e) => setFormData({...formData, message: e.target.value})} 
                  placeholder="Outline your scope..." 
                  disabled={isSubmitted}
                  className={`w-full bg-transparent border-b py-3 focus:outline-none transition-all text-base font-light resize-none ${inputBorderClass} disabled:opacity-50`} 
                />
              </div>

              <button 
                type="submit" 
                disabled={isSubmitted}
                className={`group w-full py-6 md:py-8 text-[10px] uppercase tracking-[0.6em] font-bold flex items-center justify-center gap-6 rounded-2xl transition-all duration-500 ${
                  isSubmitted 
                    ? 'bg-emerald-500 text-white' 
                    : isDark ? 'bg-white text-black hover:scale-[1.02]' : 'bg-black text-white hover:scale-[1.02]'
                }`}
              >
                <AnimatePresence mode="wait">
                  {isSubmitted ? (
                    <motion.span 
                      key="success"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex items-center gap-3"
                    >
                      Dispatched <Check className="w-4 h-4" />
                    </motion.span>
                  ) : (
                    <motion.span 
                      key="idle"
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex items-center gap-6"
                    >
                      Dispatch Inquiry <Send className="w-4 h-4 group-hover:translate-x-2 group-hover:-translate-y-2 transition-transform duration-700" />
                    </motion.span>
                  )}
                </AnimatePresence>
              </button>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
