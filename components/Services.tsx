
import React from 'react';
import { motion } from 'framer-motion';
import { Layout, Code, Zap, Smartphone } from 'lucide-react';
import { Service } from '../types';

interface ServicesProps {
  theme?: 'dark' | 'light';
  data: Service[];
}

const IconMap = {
  layout: <Layout className="w-8 h-8" />,
  code: <Code className="w-8 h-8" />,
  zap: <Zap className="w-8 h-8" />,
  smartphone: <Smartphone className="w-8 h-8" />,
};

const Services: React.FC<ServicesProps> = ({ theme = 'dark', data }) => {
  const isDark = theme === 'dark';
  const textColorPrimary = isDark ? 'text-white' : 'text-zinc-900';
  const textColorMuted = isDark ? 'text-zinc-500' : 'text-zinc-400';
  const textColorDim = isDark ? 'text-zinc-700' : 'text-zinc-300';
  const borderClass = isDark ? 'border-white/5' : 'border-black/5';

  return (
    <section id="services" className={`py-10 md:py-16 px-6 md:px-12 transition-colors duration-1000 ${isDark ? 'bg-zinc-950/20' : 'bg-cyan-50/10'}`}>
      <div className="max-w-7xl mx-auto">
        <div className="mb-10 md:mb-16">
          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} className="flex items-center gap-4 mb-4">
            <div className={`w-12 h-[1px] ${isDark ? 'bg-white/20' : 'bg-black/20'}`} />
            <span className={`text-[9px] uppercase tracking-[0.6em] font-bold ${textColorMuted}`}>Technical Discipline</span>
          </motion.div>
          <motion.h3 initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} className={`text-4xl md:text-7xl font-display tracking-tighter leading-none uppercase ${textColorPrimary}`}>Expertise <span className="italic opacity-30">&</span> Capabilities</motion.h3>
        </div>
        <div className="relative">
          <div className={`absolute left-0 top-0 w-full border-t ${borderClass}`} />
          {data.map((service, idx) => (
            <motion.div key={service.id} initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: idx * 0.05 }} className={`group grid md:grid-cols-12 gap-4 py-6 md:py-8 border-b ${borderClass} hover:bg-white/[0.02] transition-all relative overflow-hidden`}>
              <div className={`md:col-span-1 text-[10px] font-bold ${textColorDim} mt-1.5 transition-colors group-hover:text-current`}>S—0{idx + 1}</div>
              <div className="md:col-span-4 lg:col-span-3">
                <div className="flex items-center gap-4 mb-2">
                  <div className="opacity-40 group-hover:opacity-100 group-hover:scale-110 transition-all duration-500">{IconMap[service.iconType || 'layout']}</div>
                  <h4 className={`text-xl md:text-3xl font-display uppercase tracking-tight group-hover:translate-x-2 transition-transform duration-700 ${textColorPrimary}`}>{service.title}</h4>
                </div>
              </div>
              <div className="md:col-span-6 lg:col-span-7 md:col-start-7">
                <p className={`text-sm md:text-base font-light leading-relaxed ${isDark ? 'text-zinc-500' : 'text-zinc-500'} group-hover:text-zinc-300 transition-colors duration-500`}>{service.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;
