
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Github, Linkedin, FileText, Calendar, GraduationCap, ArrowLeft, Download, Loader2, Check, AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { PortfolioData } from '../utils/storage';
import { jsPDF } from 'jspdf';

interface AboutPageProps {
  theme?: 'dark' | 'light';
  data: PortfolioData;
}

const AboutPage: React.FC<AboutPageProps> = ({ theme = 'dark', data }) => {
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const isDark = theme === 'dark';
  
  const textColorPrimary = isDark ? 'text-zinc-100' : 'text-zinc-900';
  const textColorAccent = isDark ? 'text-white' : 'text-black';
  const textColorSecondary = isDark ? 'text-zinc-500' : 'text-zinc-600';
  const textColorMuted = isDark ? 'text-zinc-600' : 'text-zinc-400';
  const bgClass = isDark ? 'bg-black' : 'bg-[#E0FFFF]';
  const barBg = isDark ? 'bg-zinc-900' : 'bg-zinc-200';
  const barFill = isDark ? 'bg-white' : 'bg-black';

  const handleDownloadCV = async () => {
    if (!data.about.cvUrl) return;
    
    setIsDownloading(true);
    setError(null);
    
    try {
      const response = await fetch(data.about.cvUrl);
      if (!response.ok) throw new Error('Resource unreachable');
      
      const blob = await response.blob();
      const mimeType = blob.type;
      
      // Filename construction
      const baseFilename = 'Sharif_Islam_CV';
      
      // CASE 1: Resource is already a PDF
      if (mimeType === 'application/pdf' || data.about.cvUrl.toLowerCase().includes('.pdf')) {
        const blobUrl = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = blobUrl;
        link.download = `${baseFilename}.pdf`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(blobUrl);
      } 
      // CASE 2: Resource is an Image (Need to convert to PDF properly)
      else if (mimeType.startsWith('image/')) {
        const reader = new FileReader();
        reader.readAsDataURL(blob);
        reader.onloadend = () => {
          const base64data = reader.result as string;
          const pdf = new jsPDF('p', 'mm', 'a4');
          const pageWidth = pdf.internal.pageSize.getWidth();
          const pageHeight = pdf.internal.pageSize.getHeight();
          
          // Image dimensions handling
          const img = new Image();
          img.src = base64data;
          img.onload = () => {
            const imgWidth = img.width;
            const imgHeight = img.height;
            const ratio = imgWidth / imgHeight;
            
            let finalWidth = pageWidth - 20; // 10mm margins
            let finalHeight = finalWidth / ratio;
            
            if (finalHeight > pageHeight - 20) {
              finalHeight = pageHeight - 20;
              finalWidth = finalHeight * ratio;
            }

            pdf.addImage(base64data, 'JPEG', (pageWidth - finalWidth) / 2, 10, finalWidth, finalHeight);
            pdf.save(`${baseFilename}.pdf`);
            setDownloadSuccess(true);
            setTimeout(() => setDownloadSuccess(false), 3000);
          };
        };
      } 
      // CASE 3: Unknown format
      else {
        const blobUrl = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = blobUrl;
        link.download = baseFilename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(blobUrl);
      }

      if (!mimeType.startsWith('image/')) {
        setDownloadSuccess(true);
        setTimeout(() => setDownloadSuccess(false), 3000);
      }
    } catch (error) {
      console.error('CV Download failed:', error);
      setError('Connection failure: Could not fetch CV resource.');
      // Fallback
      window.open(data.about.cvUrl, '_blank');
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className={`min-h-screen pt-20 pb-16 px-6 md:px-12 transition-colors duration-500 ${bgClass}`}>
      <div className="max-w-7xl mx-auto">
        <Link to="/" className={`inline-flex items-center gap-3 mb-12 text-[10px] uppercase tracking-widest font-bold opacity-50 hover:opacity-100 transition-opacity ${textColorAccent}`}>
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </Link>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12 relative group aspect-video md:aspect-[21/9] overflow-hidden transition-all duration-1000 shadow-2xl"
        >
          <img 
            src={data.about.detailedImage} 
            alt="Shariful Islam" 
            className="w-full h-full object-cover object-top grayscale group-hover:grayscale-0 transition-all duration-700"
            onError={(e) => {
              e.currentTarget.src = "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1000&auto=format&fit=crop";
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
          <div className="absolute bottom-8 left-8">
            <p className="text-[12px] uppercase tracking-[0.6em] font-bold text-white/50 mb-2">Architect & Engineer</p>
            <h1 className="text-4xl md:text-6xl font-display text-white uppercase tracking-wider">{data.hero.title1} {data.hero.title2}</h1>
          </div>
        </motion.div>

        <div className="grid lg:grid-cols-12 gap-12 md:gap-20">
          <div className="lg:col-span-7 space-y-12">
            <div>
              <motion.h2 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className={`text-[10px] uppercase tracking-[0.5em] font-bold mb-6 ${textColorMuted}`}
              >
                In-Depth Profile
              </motion.h2>
              
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                <p className={`text-base md:text-lg leading-relaxed max-w-2xl ${textColorSecondary}`}>
                  {data.about.detailedBio}
                </p>

                {data.about.cvUrl && (
                  <div className="py-4 space-y-4">
                    <button
                      onClick={handleDownloadCV}
                      disabled={isDownloading}
                      className={`group relative flex items-center gap-4 px-8 py-4 overflow-hidden border transition-all duration-500 rounded-full ${
                        downloadSuccess 
                          ? 'border-emerald-500 text-emerald-500 bg-emerald-500/5'
                          : isDark 
                            ? 'border-white/10 text-white hover:border-white/40 bg-white/5' 
                            : 'border-black/10 text-black hover:border-black/40 bg-black/5'
                      }`}
                    >
                      {isDownloading ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : downloadSuccess ? (
                        <Check className="w-4 h-4" />
                      ) : (
                        <Download className="w-4 h-4 group-hover:translate-y-1 transition-transform" />
                      )}
                      <span className="text-[10px] uppercase tracking-[0.3em] font-bold">
                        {isDownloading ? 'Processing PDF...' : downloadSuccess ? 'Document Saved' : 'Download CV as PDF'}
                      </span>
                    </button>
                    
                    {error && (
                      <div className="flex items-center gap-2 text-red-500 text-[9px] uppercase tracking-widest font-bold">
                        <AlertCircle size={14} />
                        {error}
                      </div>
                    )}
                    
                    {data.about.cvUrl.startsWith('data:image') && !downloadSuccess && !isDownloading && (
                       <p className={`text-[8px] uppercase tracking-widest opacity-30 ${textColorMuted}`}>System will automatically wrap image into PDF format</p>
                    )}
                  </div>
                )}

                <div className="grid md:grid-cols-2 gap-8 py-8 border-y border-zinc-900/10 dark:border-white/5">
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <GraduationCap className={`w-5 h-5 ${textColorMuted}`} />
                      <h4 className={`text-xs uppercase tracking-widest font-bold ${textColorAccent}`}>Education</h4>
                    </div>
                    {data.about.education.map((edu, idx) => (
                      <div key={idx}>
                        <p className={`text-sm font-medium ${textColorPrimary}`}>{edu.degree}</p>
                        <p className={`text-xs ${textColorSecondary}`}>{edu.school}</p>
                      </div>
                    ))}
                  </div>
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <Calendar className={`w-5 h-5 ${textColorMuted}`} />
                      <h4 className={`text-xs uppercase tracking-widest font-bold ${textColorAccent}`}>Professional Path</h4>
                    </div>
                    <div className="space-y-2">
                      {data.about.timeline.map((item, idx) => (
                        <div key={idx} className="flex gap-4">
                          <span className={`text-[10px] font-bold opacity-30 mt-1 shrink-0`}>{item.year}</span>
                          <p className={`text-[11px] leading-relaxed ${textColorSecondary}`}>{item.description}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className={`text-xs uppercase tracking-widest font-bold ${textColorAccent}`}>Vision & Goals</h4>
                  <p className={`text-sm md:text-base italic leading-relaxed ${textColorSecondary}`}>
                    "My mission is to evolve into a top-level technical leader, contributing to open-source 
                    ecosystems and eventually architecting my own technology venture."
                  </p>
                </div>
              </motion.div>
            </div>
          </div>

          <div className="lg:col-span-5 space-y-12">
            <div>
              <motion.h2 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className={`text-[10px] uppercase tracking-[0.5em] font-bold mb-10 text-right ${textColorMuted}`}
              >
                Technical Stack
              </motion.h2>
              
              <div className="space-y-8">
                {data.about.skills.map((skill, idx) => (
                  <div key={skill.name} className="space-y-3">
                    <div className="flex justify-between items-end">
                      <span className={`text-[10px] uppercase tracking-widest font-bold ${textColorPrimary}`}>{skill.name}</span>
                      <span className={`text-[10px] font-bold ${textColorMuted}`}>{skill.level}%</span>
                    </div>
                    <div className={`h-[1px] w-full ${barBg} overflow-hidden`}>
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${skill.level}%` }}
                        transition={{ duration: 1.5, delay: idx * 0.05, ease: [0.16, 1, 0.3, 1] }}
                        className={`h-full ${barFill}`}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;
