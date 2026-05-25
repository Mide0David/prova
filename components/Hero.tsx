'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import ElasticGridPro from './ElasticGridPro';
import PhysicsCarousel from './PhysicsCarousel';
import BlobBackground from './BlobBackground';

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
    <div className="relative h-[1.2em] overflow-hidden block">
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
    </div>
  );
};

const Hero = () => {
  const router = useRouter();

  return (
    <section className="relative min-h-screen bg-black-pure flex flex-col justify-center px-6 md:px-20 pt-24 pb-0 overflow-hidden">

      {/* ── Layer 1: Blob background (Coal — darkest layer, fills entire section) ── */}
      <div className="absolute inset-0 z-0">
        <BlobBackground
          count={6}
          dotSpacing={6}
          dotSize={1.5}
          speed={1}
          darkRGB={[22, 18, 16]}
          lightRGB={[58, 48, 44]}
        />
      </div>

      {/* ── Layer 2: Elastic grid sits on top of blob, kept at reduced opacity ── */}
      <div className="absolute inset-0 z-[1] opacity-40">
        <ElasticGridPro
          cellSize={300}
          interactionRadius={300}
          interactionStrength={4}
          lineColor="rgba(0, 0, 0, 1)"
          glowColor="#595757ff"
          glowIntensity={1}
          baseOpacity={0.9}
        />
      </div>

      {/* ── Layer 3: All content ── */}
      <div className="relative z-10 max-w-7xl mx-auto w-full flex flex-col md:flex-row md:items-center md:gap-0 flex-1">

        {/* LEFT COLUMN — text content */}
        <div className="flex flex-col md:w-1/2 md:pr-12">
          <div className="flex flex-col gap-0">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
              className="font-heading text-[clamp(40px,6vw,80px)] font-black leading-[0.88] uppercase tracking-[-0.04em]"
            >
              MANAGING YOUR
            </motion.h1>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="font-heading text-[clamp(40px,6vw,80px)] font-black leading-[0.88] uppercase tracking-[-0.04em]"
            >
              LAGOS PROJECT
            </motion.h1>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.45, ease: [0.16, 1, 0.3, 1] }}
              className="font-heading text-[clamp(40px,6vw,80px)] font-black leading-[0.88] uppercase tracking-[-0.04em]"
            >
              <LetterCycling />
            </motion.div>
          </div>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.55, ease: [0.16, 1, 0.3, 1] }}
            className="text-[14px] text-white/65 max-w-[380px] leading-relaxed mt-5"
          >
            Stop flying back. Get the exact verified professionals used by Nigerians managing properties from London, Houston, and Dubai.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.65, ease: [0.16, 1, 0.3, 1] }}
            className="flex items-center gap-4 mt-10"
          >
            <motion.button
              onClick={() => router.push('/find')}
              whileHover={{ scale: 1.02, boxShadow: "0 8px 28px rgba(245,49,0,0.35)" }}
              whileTap={{ scale: 0.97, boxShadow: "0 2px 8px rgba(245,49,0,0.2)" }}
              transition={{ type: "spring", stiffness: 400, damping: 20 }}
              className="group relative overflow-hidden px-7 py-3 rounded-md text-[13px] font-bold bg-[#f53100] border border-[#f53100] text-white"
            >
              <span
                className="absolute inset-0 w-full h-full translate-y-full transition-transform duration-300 ease-out group-hover:translate-y-0 z-0"
                style={{ background: "linear-gradient(135deg, #fc8544ff 0%, #F4A261 60%, #E76F51 100%)" }}
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

        {/* RIGHT COLUMN — illustration */}
        <div className="hidden md:flex md:w-1/2 relative items-center justify-center self-stretch">
          <motion.div
            initial={{ opacity: 0, x: 60, y: 20 }}
            animate={{ opacity: 1, x: 0, y: 0 }}
            transition={{ duration: 1.1, delay: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="relative w-full pointer-events-none select-none"
            style={{ marginBottom: '-80px' }}
          >
            <div
              className="absolute inset-0 z-[-1] blur-3xl opacity-30"
              style={{ background: 'radial-gradient(ellipse at 55% 70%, #f53100 0%, transparent 65%)' }}
            />
            <Image
              src="/construction.svg"
              alt="Construction worker"
              width={760}
              height={975}
              className="w-full h-auto opacity-85"
              style={{
                maskImage: 'linear-gradient(to top, transparent 0%, black 18%)',
                WebkitMaskImage: 'linear-gradient(to top, transparent 0%, black 18%)',
              }}
              priority
            />
          </motion.div>
        </div>

      </div>

      {/* Verified Projects carousel */}
      <div className="relative z-20 w-full mt-[60px] md:mt-[48px]">
        <div className="max-w-7xl mx-auto w-full flex items-center gap-4 mb-5">
          <span className="text-[11px] font-semibold tracking-[0.18em] uppercase text-white/30">
            Verified Projects
          </span>
          <div className="flex-1 h-px bg-white/8" />
        </div>
        <PhysicsCarousel hideHeader={true} />
      </div>
    </section>
  );
};

export default Hero;