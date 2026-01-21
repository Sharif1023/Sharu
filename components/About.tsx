
import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

interface AboutProps {
  theme?: 'dark' | 'light';
  data: {
    homepageTitle1: string;
    homepageTitleAccent: string;
    homepageDescription: string;
    homepageImage: string;
  };
}

const About: React.FC<AboutProps> = ({ theme = 'dark', data }) => {
  const isDark = theme === 'dark';
  
  const textColorPrimary = isDark ? 'text-zinc-100' : 'text-zinc-900';
  const textColorAccent = isDark ? 'text-white' : 'text-black';
  const textColorSecondary = isDark ? 'text-zinc-500' : 'text-zinc-600';
  const textColorMuted = isDark ? 'text-zinc-600' : 'text-zinc-400';

  return (
    <section id="about" className={`py-12 md:py-20 px-6 md:px-12 relative overflow-hidden transition-colors duration-500 ${isDark ? 'bg-zinc-950/20' : 'bg-cyan-50/20'}`}>
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <motion.h2 
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className={`text-[10px] uppercase tracking-[0.5em] font-bold mb-6 ${textColorMuted}`}
            >
              The Persona
            </motion.h2>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="space-y-6"
            >
              <h3 className={`text-4xl md:text-6xl font-light leading-tight ${textColorPrimary}`}>
                {data.homepageTitle1} <br />
                <span className={`${textColorAccent} font-medium`}>{data.homepageTitleAccent}</span>
              </h3>
              
              <p className={`text-base md:text-lg leading-relaxed max-w-lg ${textColorSecondary}`}>
                {data.homepageDescription}
              </p>

              <Link 
                to="/about"
                className={`group inline-flex items-center gap-4 py-4 text-[10px] uppercase tracking-[0.4em] font-bold ${textColorAccent}`}
              >
                <span>More Details</span>
                <div className="flex items-center">
                   <div className={`w-8 h-[1px] ${isDark ? 'bg-white' : 'bg-black'} group-hover:w-16 transition-all duration-500`} />
                   <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </Link>
            </motion.div>
          </div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="group relative aspect-square md:aspect-[4/5] overflow-hidden transition-all duration-1000 shadow-2xl"
          >
            <img 
              src={data.homepageImage} 
              alt="Shariful Islam" 
              className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700"
              onError={(e) => {
                e.currentTarget.src = "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1000&auto=format&fit=crop";
              }}
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default About;
