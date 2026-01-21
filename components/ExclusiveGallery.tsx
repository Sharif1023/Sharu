
import React from 'react';
import { motion } from 'framer-motion';
import { GalleryItem } from '../types';

interface ExclusiveGalleryProps {
  theme?: 'dark' | 'light';
  data: GalleryItem[];
}

const ExclusiveGallery: React.FC<ExclusiveGalleryProps> = ({ theme = 'dark', data }) => {
  const isDark = theme === 'dark';
  const textColorPrimary = isDark ? 'text-white' : 'text-black';
  const textColorSecondary = isDark ? 'text-zinc-500' : 'text-zinc-400';
  const borderClass = isDark ? 'border-zinc-900' : 'border-zinc-200';
  const bgCard = isDark ? 'bg-zinc-950' : 'bg-white';

  return (
    <section className="py-16 md:py-24 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 md:px-12 mb-12 md:mb-16 flex justify-between items-end">
        <div>
          <span className={`text-[10px] uppercase tracking-[0.5em] font-bold mb-4 block ${textColorSecondary}`}>Visual Curation</span>
          <h2 className={`text-4xl md:text-7xl font-display uppercase tracking-tight ${textColorPrimary}`}>
            Exclusive <span className="italic opacity-30">Moments</span>
          </h2>
        </div>
        <div className={`hidden md:block text-right ${textColorSecondary}`}>
           <p className="text-[9px] uppercase tracking-[0.3em] font-bold">Curated for excellence</p>
           <p className="text-[9px] uppercase tracking-[0.3em] font-bold mt-1">Scroll Horizontal</p>
        </div>
      </div>

      <div className="flex gap-8 md:gap-12 overflow-x-auto pb-12 px-6 md:px-12 no-scrollbar cursor-grab active:cursor-grabbing">
        {data.map((item, idx) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ delay: idx * 0.1, duration: 0.8 }}
            className="flex-shrink-0 w-[85vw] md:w-[450px] group"
          >
            <div className={`p-4 md:p-6 border ${borderClass} ${bgCard} shadow-2xl rounded-sm transition-all duration-700 group-hover:translate-y-[-10px]`}>
              <div className="aspect-[4/5] overflow-hidden bg-zinc-900 mb-6">
                <img 
                  src={item.imageUrl} 
                  alt={item.title} 
                  className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-1000"
                />
              </div>
              
              <div className="flex justify-between items-start mb-4">
                <h3 className={`text-lg md:text-xl font-display uppercase tracking-wider ${textColorPrimary}`}>
                  {item.title}
                </h3>
                <span className={`text-[8px] font-mono tracking-widest ${textColorSecondary}`}>
                  {item.metadata}
                </span>
              </div>
              
              <p className={`text-xs font-light leading-relaxed opacity-60 ${textColorPrimary}`}>
                {item.description}
              </p>
              
              <div className={`mt-6 pt-6 border-t ${borderClass} flex justify-between items-center`}>
                <span className={`text-[8px] uppercase tracking-[0.4em] font-bold ${textColorSecondary}`}>
                  SHARIF COLLECTION — 0{idx + 1}
                </span>
                <div className={`w-2 h-2 rounded-full ${isDark ? 'bg-white/20' : 'bg-black/20'}`} />
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default ExclusiveGallery;
