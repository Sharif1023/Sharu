
import React from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Project } from '../types';

interface ProjectsProps {
  limit?: number;
  title?: string;
  theme?: 'dark' | 'light';
  data: Project[];
}

const Projects: React.FC<ProjectsProps> = ({ limit, title = "Projects", theme = 'dark', data }) => {
  const displayedProjects = limit ? data.slice(0, limit) : data;
  const isDark = theme === 'dark';
  const isHomePage = limit !== undefined;
  
  const textColorPrimary = isDark ? 'text-white' : 'text-zinc-900';
  const textColorMuted = isDark ? 'text-zinc-500' : 'text-zinc-400';
  const bgClass = isDark ? 'bg-black' : 'bg-[#E0FFFF]';

  return (
    <section id="projects" className={`py-12 md:py-24 px-6 md:px-12 transition-colors duration-1000 ${bgClass}`}>
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-end mb-12 border-b border-current/10 pb-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <span className={`text-[10px] uppercase tracking-[0.5em] font-bold mb-2 block ${textColorMuted}`}>Portfolio</span>
            <h3 className={`text-4xl md:text-6xl font-display uppercase tracking-tight ${textColorPrimary}`}>
              {title}
            </h3>
          </motion.div>
          
          {limit && (
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <Link 
                to="/projects" 
                className="group flex items-center gap-4 text-[10px] uppercase tracking-[0.3em] font-bold"
              >
                <span className="group-hover:opacity-60 transition-opacity">View All</span>
                <div className={`w-12 h-[1px] ${isDark ? 'bg-white' : 'bg-black'} group-hover:w-20 transition-all duration-500`} />
              </Link>
            </motion.div>
          )}
        </div>

        <div className="space-y-16 md:space-y-24">
          {displayedProjects.map((project, idx) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-10%" }}
              transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
              className={`flex flex-col ${idx % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'} gap-8 md:gap-16 items-center`}
            >
              {/* Project Image */}
              <div 
                className="w-full md:w-3/5 aspect-video relative overflow-hidden group cursor-pointer shadow-xl"
                onClick={() => window.open(project.liveUrl, '_blank')}
              >
                <motion.img
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.8 }}
                  src={project.imageUrl}
                  alt={project.title}
                  className={`w-full h-full object-cover transition-all duration-700 brightness-95 group-hover:brightness-100 ${!isHomePage ? 'grayscale group-hover:grayscale-0' : ''}`}
                />
                <div className="absolute inset-0 bg-black/5 group-hover:bg-transparent transition-colors duration-500" />
              </div>

              {/* Project Info */}
              <div className="w-full md:w-2/5 space-y-6">
                <div>
                  <span className={`text-[10px] uppercase tracking-widest font-bold opacity-40 ${textColorPrimary}`}>
                    0{idx + 1} &mdash; {project.category}
                  </span>
                  <h4 className={`text-3xl md:text-5xl font-display uppercase tracking-tight mt-2 ${textColorPrimary}`}>
                    {project.title}
                  </h4>
                </div>
                
                <p className={`text-sm md:text-base font-light leading-relaxed opacity-70 ${textColorPrimary}`}>
                  {project.description}
                </p>

                <div className="flex flex-wrap gap-2">
                  {project.tech.map(t => (
                    <span key={t} className={`text-[8px] tracking-widest uppercase font-bold px-2 py-1 border ${isDark ? 'border-white/10 text-white/40' : 'border-black/10 text-black/40'}`}>
                      {t}
                    </span>
                  ))}
                </div>

                <motion.button
                  whileHover={{ x: 10 }}
                  className={`flex items-center gap-4 text-[10px] uppercase tracking-widest font-bold pt-2 ${textColorPrimary}`}
                  onClick={() => window.open(project.liveUrl, '_blank')}
                >
                  Explore Project
                  <ArrowUpRight className="w-4 h-4 opacity-50" />
                </motion.button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Projects;
