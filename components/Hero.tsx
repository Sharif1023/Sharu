import React, { useEffect, useMemo, useState } from "react";
import { motion, Variants } from "framer-motion";
import { ArrowRight } from "lucide-react";

interface HeroProps {
  theme?: "dark" | "light";
  data: {
    title1: string;
    title2: string;
    subtitle: string;
    backgroundImage: string;
  };
}

const FALLBACK_IMG =
  "https://i.pinimg.com/736x/ae/e3/4d/aee34ddfd65c21d2696329a3a686a94c.jpg";

const Hero: React.FC<HeroProps> = ({ theme = "dark", data }) => {
  const isDark = theme === "dark";
  const textColorSecondary = isDark ? "text-zinc-500" : "text-zinc-600";

  const [imgSrc, setImgSrc] = useState<string>(
    data.backgroundImage || FALLBACK_IMG
  );

  useEffect(() => {
    if (data.backgroundImage) {
      const img = new Image();
      img.src = data.backgroundImage;
      img.onload = () => setImgSrc(data.backgroundImage);
      img.onerror = () => setImgSrc(FALLBACK_IMG);
    } else {
      setImgSrc(FALLBACK_IMG);
    }
  }, [data.backgroundImage]);

  const patternId = useMemo(
    () => `heroPattern-${Math.random().toString(36).slice(2)}`,
    []
  );

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15, delayChildren: 0.2 },
    },
  };

  const itemVariants: Variants = {
    hidden: { y: 40, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 1.2, ease: [0.16, 1, 0.3, 1] as const },
    },
  };

  const handleScrollToProjects = () => {
    const element = document.getElementById("projects");
    if (element) element.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section
      id="hero"
      className="
        relative w-full flex flex-col justify-center items-center overflow-hidden
        min-h-screen px-4 md:px-12 py-20
        md:h-screen md:min-h-0 md:py-6
      "
    >
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-7xl mx-auto w-full flex flex-col items-center"
      >
        {/* ================= NAME WITH IMAGE INSIDE ================= */}
        <div className="relative w-full inline-flex flex-col items-center mb-10 md:mb-6 group">
          {/* Enhanced Adaptive Glows */}
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
            <div
              className={`${
                isDark ? "bg-indigo-500/40" : "bg-indigo-400/30"
              } w-[95%] md:w-[130%] h-40 md:h-52 blur-[100px] md:blur-[150px] rounded-full opacity-40`}
            />
            <div
              className={`${
                isDark ? "bg-fuchsia-400/30" : "bg-fuchsia-300/20"
              } w-[80%] md:w-[110%] h-48 md:h-64 blur-[80px] md:blur-[130px] rounded-full opacity-30 mt-[-60px] md:mt-[-90px]`}
            />
          </div>

          {/* SVG TEXT MASK - mobile unchanged, only laptop constrained */}
          <motion.div
            variants={itemVariants}
            className="
              relative z-10 w-full max-w-[1500px]
              md:max-h-[60vh]
            "
          >
            <svg
              viewBox="0 0 1600 750"
              className="
                w-full h-auto select-none overflow-visible scale-105 md:scale-100
                md:max-h-[60vh]
              "
              preserveAspectRatio="xMidYMid meet"
            >
              <defs>
                <pattern
                  id={patternId}
                  patternUnits="userSpaceOnUse"
                  width="1600"
                  height="750"
                >
                  <image
                    href={imgSrc}
                    x="0"
                    y="0"
                    width="1600"
                    height="900"
                    preserveAspectRatio="xMidYMid slice"
                    className="grayscale group-hover:grayscale-0 transition-all duration-1000"
                  />
                </pattern>
              </defs>

              {/* Title 1 */}
              <text
                x="800"
                y="300"
                textAnchor="middle"
                fill={`url(#${patternId})`}
                fontSize="320"
                fontWeight="900"
                letterSpacing="40"
                className="font-display"
              >
                {data.title1 || "SHARIF"}
              </text>

              {/* Title 2 */}
              <text
                x="800"
                y="620"
                textAnchor="middle"
                fill={`url(#${patternId})`}
                fontSize="320"
                fontWeight="900"
                fontStyle="italic"
                letterSpacing="40"
                className="font-display"
              >
                {data.title2 || "ISLAM"}
              </text>
            </svg>
          </motion.div>
        </div>

        {/* Subtitle & CTA - mobile same, only laptop tighter */}
        <div className="flex flex-col items-center gap-10 md:gap-6 max-w-2xl text-center px-4">
          <motion.p
            variants={itemVariants}
            className={`text-sm md:text-xl font-light leading-relaxed tracking-[0.15em] ${textColorSecondary}`}
          >
            {data.subtitle}
          </motion.p>

          <motion.div variants={itemVariants} className="w-full sm:w-auto">
            <button
              onClick={handleScrollToProjects}
              className={`w-full sm:w-auto group relative overflow-hidden px-10 md:px-16 py-5 md:py-5 text-[10px] md:text-[11px] uppercase tracking-[0.6em] font-bold border transition-all duration-500 flex items-center justify-center gap-6 rounded-full ${
                isDark
                  ? "border-white/10 text-white hover:border-white/40 bg-white/5"
                  : "border-black/10 text-zinc-900 hover:border-black/30 bg-black/5"
              }`}
            >
              <span className="relative z-10">Explore Work</span>
              <div className="relative z-10 flex items-center">
                <div
                  className={`w-8 md:w-12 h-[1px] transition-all duration-700 group-hover:w-20 ${
                    isDark ? "bg-white" : "bg-black"
                  }`}
                />
                <ArrowRight className="w-4 h-4 ml-[-8px] opacity-0 group-hover:opacity-100 group-hover:ml-2 transition-all duration-700" />
              </div>
              <div
                className={`absolute inset-0 translate-y-full group-hover:translate-y-0 transition-transform duration-700 ease-[0.16,1,0.3,1] ${
                  isDark ? "bg-white/10" : "bg-black/10"
                }`}
              />
            </button>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
};

export default Hero;
