
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle } from 'lucide-react';

interface WhatsAppButtonProps {
  theme?: 'dark' | 'light';
  phoneNumber?: string;
}

const WhatsAppButton: React.FC<WhatsAppButtonProps> = ({ 
  theme = 'dark', 
  phoneNumber = '8801316785389' 
}) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        // Show button if any part of the contact section is visible
        setIsVisible(entry.isIntersecting);
      },
      {
        threshold: 0.1, // Trigger when at least 10% of the section is visible
      }
    );

    const contactSection = document.getElementById('contact');
    if (contactSection) {
      observer.observe(contactSection);
    }

    return () => {
      if (contactSection) {
        observer.unobserve(contactSection);
      }
    };
  }, []);

  const openWhatsApp = () => {
    window.open(`https://wa.me/${phoneNumber}`, '_blank');
  };

  const isDark = theme === 'dark';

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.button
          initial={{ opacity: 0, x: -20, scale: 0.8 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          exit={{ opacity: 0, x: -20, scale: 0.8 }}
          onClick={openWhatsApp}
          className={`fixed bottom-8 left-6 md:bottom-10 md:left-10 z-[100] p-4 md:p-4 rounded-full border transition-all duration-500 group shadow-2xl backdrop-blur-xl ${
            isDark 
              ? 'bg-emerald-500 text-white border-emerald-400/20 hover:scale-110 shadow-emerald-500/20' 
              : 'bg-emerald-600 text-white border-emerald-500/10 hover:scale-110 shadow-emerald-600/20'
          }`}
          aria-label="Contact on WhatsApp"
        >
          <div className="relative overflow-hidden">
            <MessageCircle className="w-5 h-5 transition-transform duration-500 group-hover:-translate-y-12" />
            <MessageCircle className="w-5 h-5 absolute top-12 left-0 transition-transform duration-500 group-hover:-translate-y-12" />
          </div>
          
          {/* Pulsing Effect */}
          <div className={`absolute inset-0 rounded-full border border-white animate-ping opacity-20`} />
          
          {/* Label for Desktop */}
          <span className="absolute left-full ml-4 top-1/2 -translate-y-1/2 px-3 py-1 bg-black text-white text-[9px] uppercase tracking-widest font-bold rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap hidden md:block pointer-events-none">
            WhatsApp Sharif
          </span>
        </motion.button>
      )}
    </AnimatePresence>
  );
};

export default WhatsAppButton;
