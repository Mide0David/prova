'use client';

import React from 'react';
import { motion } from 'framer-motion';

const ApeModeBanner = () => {
  return (
    <section className="bg-black-card border-t border-white/06 py-20 px-6 md:px-20 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <motion.span 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          className="text-[11px] font-semibold text-white/30 uppercase tracking-[0.08em]"
        >
          The professional standard
        </motion.span>
        
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-[clamp(36px,5vw,64px)] font-black text-white leading-tight tracking-[-0.03em] uppercase max-w-[700px] mt-4"
        >
          OWN THE COMPLETE VERIFIED NETWORK.
        </motion.h2>

        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-[14px] text-white/40 max-w-[480px] leading-relaxed mt-4"
        >
          The only platform where professionals are NIN-verified, reference-called, and portfolio-checked before you ever see their name.
        </motion.p>

        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex flex-wrap gap-3 mt-8"
        >
          {["NIN + BVN Verified", "Reference Calls on File", "Portfolio Confirmed", "Free to Use"].map((item, i) => (
            <div key={i} className="border border-white/12 text-white/50 px-3 py-1 rounded-full text-[12px]">
              {item}
            </div>
          ))}
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="flex flex-col md:flex-row items-center gap-4 mt-12"
        >
          <motion.button
            whileHover={{ scale: 1.02, backgroundColor: '#ffffff' }}
            whileTap={{ scale: 0.97 }}
            className="w-full md:w-auto bg-white/off text-black px-8 py-4 rounded-full text-[14px] font-bold"
          >
            Find My Professional →
          </motion.button>
          <motion.button
            whileHover={{ borderColor: 'rgba(255,255,255,0.4)', color: '#ffffff' }}
            whileTap={{ scale: 0.97 }}
            className="w-full md:w-auto border border-white/15 text-white/50 px-8 py-4 rounded-full text-[14px] font-medium transition-colors"
          >
            List your services →
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
};

export default ApeModeBanner;
