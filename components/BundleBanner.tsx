'use client';

import React from 'react';
import { motion } from 'framer-motion';

const BundleBanner = () => {
  return (
    <section className="bg-black-pure px-6 md:px-20 py-12 max-w-7xl mx-auto w-full">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="bg-black-card border-t border-b border-white/06 py-10 px-6 md:px-12 flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden"
      >
        <div className="absolute top-4 right-6 text-[10px] text-white/20 uppercase tracking-wider">
          5-step process
        </div>
        
        <div className="flex flex-col gap-1 text-center md:text-left">
          <span className="text-[10px] font-semibold text-white/25 uppercase tracking-[0.08em]">
            Our verification standard
          </span>
          <p className="text-[16px] md:text-[20px] text-white/40 font-medium max-w-xl">
            Every professional is NIN verified, reference-checked, and portfolio-confirmed.
          </p>
        </div>

        <motion.button
          whileHover={{ scale: 1.02, borderColor: 'rgba(255,255,255,0.4)', color: '#ffffff' }}
          whileTap={{ scale: 0.97 }}
          className="border border-white/20 text-white px-6 py-2.5 rounded-full text-[14px] font-bold transition-all whitespace-nowrap"
        >
          Free to verify →
        </motion.button>
      </motion.div>
    </section>
  );
};

export default BundleBanner;
