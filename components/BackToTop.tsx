
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowUp } from 'lucide-react';

interface BackToTopProps {
  theme?: 'dark' | 'light';
}

const BackToTop: React.FC<BackToTopProps> = ({ theme = 'dark' }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.pageYOffset > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  const isDark = theme === 'dark';

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.button
          initial={{ opacity: 0, y: 20, scale: 0.8 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.8 }}
          onClick={scrollToTop}
          className={`fixed bottom-8 right-6 md:bottom-10 md:right-10 z-[100] p-4 md:p-4 rounded-full border transition-all duration-500 group shadow-2xl backdrop-blur-xl ${
            isDark 
              ? 'bg-white text-black border-white/20 hover:scale-110' 
              : 'bg-black text-white border-black/10 hover:scale-110'
          }`}
          aria-label="Back to top"
        >
          <div className="relative overflow-hidden">
            <ArrowUp className="w-5 h-5 transition-transform duration-500 group-hover:-translate-y-12" />
            <ArrowUp className="w-5 h-5 absolute top-12 left-0 transition-transform duration-500 group-hover:-translate-y-12" />
          </div>
          
          {/* Animated Ring */}
          <div className={`absolute inset-0 rounded-full border border-current opacity-0 group-hover:opacity-40 group-hover:scale-150 transition-all duration-700`} />
        </motion.button>
      )}
    </AnimatePresence>
  );
};

export default BackToTop;
