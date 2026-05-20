'use client';

import React from 'react';
import { motion } from 'framer-motion';

const Nav = () => {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-black/85 backdrop-blur-xl border-b border-white/15">
      <div className="max-w-7xl mx-auto px-6 md:px-12 py-[14px] flex items-center justify-between">
        {/* Left: Logo */}
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="font-heading text-[13px] font-bold text-white tracking-[0.02em] cursor-pointer"
        >
          Prova
        </motion.div>

        {/* Center: Links (Hidden on mobile) */}
        <div className="hidden md:flex items-center gap-8">
          {['How it works', 'Verification', 'Projects', 'For Pros'].map((link, i) => (
            <motion.a
              key={link}
              href="#"
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 + i * 0.05, ease: [0.16, 1, 0.3, 1] }}
              className="text-[12px] text-white/50 hover:text-white transition-opacity duration-150"
            >
              {link}
            </motion.a>
          ))}
        </div>

        {/* Right: CTA */}
        <motion.button
          initial={{ opacity: 0, x: 10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.97 }}
          className="group relative overflow-hidden border border-white/20 text-white px-4 py-[6px] rounded-full text-[12px] font-bold"
        >
          <span className="absolute inset-0 w-full h-full bg-white translate-y-full transition-transform duration-300 ease-out group-hover:translate-y-0 z-0" />
          <span className="relative z-10 transition-colors duration-300 group-hover:text-black">Find a Professional</span>
        </motion.button>
      </div>
    </nav>
  );
};

export default Nav;
