'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import ElasticGridPro from './ElasticGridPro';
import PhysicsCarousel from './PhysicsCarousel';

const words = ["SAFELY.", "REMOTELY.", "CONFIDENTLY."];

const LetterCycling = () => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % words.length);
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative h-[1.1em] overflow-hidden inline-block align-top">
      <AnimatePresence mode="wait">
        <motion.div
          key={words[index]}
          initial={{ y: "100%" }}
          animate={{ y: "0%" }}
          exit={{ y: "-100%" }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="flex"
          style={{ color: "#f53100ff" }}
        >
          {words[index].split("").map((char, i) => (
            <motion.span
              key={`${words[index]}-${i}`}
              initial={{ opacity: 0.15 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4, delay: i * 0.04 }}
            >
              {char}
            </motion.span>
          ))}
        </motion.div>
      </AnimatePresence>
      <div
        className="absolute inset-0 opacity-15 pointer-events-none select-none"
        style={{ color: "#FF6B1A" }}
      >
        {words[index]}
      </div>
    </div>
  );
};

const Hero = () => {
  return (
    <section className="relative min-h-screen bg-black-pure flex flex-col justify-center px-6 md:px-20 pt-20 overflow-hidden">
      {/* Background Grid */}
      <div className="absolute inset-0 z-0 opacity-40">
        <ElasticGridPro
          cellSize={120}
          interactionRadius={300}
          interactionStrength={4}
          lineColor="rgba(255, 255, 255, 0.1)"
          glowColor="#ffffff"
          glowIntensity={1}
          baseOpacity={0.2}
        />
      </div>

      {/* Construction Figure */}
      <motion.div
        initial={{ opacity: 0, x: 60, y: 20 }}
        animate={{ opacity: 1, x: 0, y: 0 }}
        transition={{
          duration: 1.1,
          delay: 0.8,
          ease: [0.16, 1, 0.3, 1],
        }}
        className="
          absolute z-10 pointer-events-none select-none
          bottom-[120px] md:bottom-[160px]  
          right-[-40px] md:right-0
          w-[200px] sm:w-[260px] md:w-[clamp(280px,32vw,480px)]
          opacity-40 md:opacity-70
        "
        style={{
          bottom: '400px',
          maskImage: 'linear-gradient(to top, transparent 0%, black 22%)',
          WebkitMaskImage: 'linear-gradient(to top, transparent 0%, black 22%)',
        }}
      >
        {/* Subtle orange glow behind figure — matches brand */}
        <div
          className="absolute inset-0 z-[-1] blur-3xl opacity-20"
          style={{
            background: 'radial-gradient(ellipse at 60% 80%, #f53100 0%, transparent 70%)',
          }}
        />
        <Image
          src="/construction.svg"
          alt="Construction worker"
          width={760}
          height={975}
          className="w-full h-auto"
          priority
        />
      </motion.div>

      <div className="relative z-10 max-w-7xl mx-auto w-full">
        {/* Headline Block */}
        <div className="flex flex-col gap-0">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
            className="font-heading text-[clamp(44px,8vw,96px)] font-black leading-[0.92] uppercase tracking-[-0.04em]"
          >
            MANAGING YOUR
          </motion.h1>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="font-heading text-[clamp(44px,8vw,96px)] font-black leading-[0.92] uppercase tracking-[-0.04em]"
          >
            LAGOS PROJECT
          </motion.h1>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.45, ease: [0.16, 1, 0.3, 1] }}
            className="font-heading text-[clamp(44px,8vw,96px)] font-black leading-[0.92] uppercase tracking-[-0.04em]"
          >
            <LetterCycling />
          </motion.div>
        </div>

        {/* Subtext */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.55, ease: [0.16, 1, 0.3, 1] }}
          className="text-[13px] text-white/40 max-w-[380px] leading-relaxed mt-8"
        >
          Stop flying back. Get the exact verified professionals used by Nigerians managing properties from London, Houston, and Dubai.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.65, ease: [0.16, 1, 0.3, 1] }}
          className="flex items-center gap-4 mt-12"
        >
          <motion.button
            whileHover={{ scale: 1.02, boxShadow: "0 8px 28px rgba(255,6,6,0.25)" }}
            whileTap={{ scale: 0.97, boxShadow: "0 2px 8px rgba(255,6,6,0.15)" }}
            transition={{ type: "spring", stiffness: 400, damping: 20 }}
            className="group relative overflow-hidden px-7 py-3 rounded-md text-[13px] font-bold border border-[#ff0606]/30 text-white"
          >
            <span 
              className="absolute inset-0 w-full h-full translate-y-full transition-transform duration-300 ease-out group-hover:translate-y-0 z-0" 
              style={{ background: "linear-gradient(135deg, #fc8544ff 0%, #ff0606ff 60%, #fe1807ff 100%)" }}
            />
            <span className="relative z-10 transition-colors duration-300">Find My Professional</span>
          </motion.button>
          <motion.button
            whileTap={{ scale: 0.97 }}
            className="group relative overflow-hidden border border-white/15 text-white/50 px-5 py-3 rounded-md text-[13px] font-medium transition-all duration-300 hover:border-orange-500 hover:shadow-[0_0_15px_rgba(249,115,22,0.2)]"
          >
            <span className="absolute inset-0 w-full h-full bg-orange-500 translate-y-full transition-transform duration-300 ease-out group-hover:translate-y-0 z-0" />
            <span className="relative z-10 transition-colors duration-300 group-hover:text-white">For Professionals →</span>
          </motion.button>
        </motion.div>
      </div>

      {/* Hero Carousel */}
      <div className="relative z-20 w-full mt-[120px] md:mt-[80px] mb-[-100px]">
        <PhysicsCarousel hideHeader={true} />
      </div>
    </section>
  );
};

export default Hero;