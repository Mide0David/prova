'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface SectionHeaderProps {
  number: string;
  title: string;
  sublabel?: string;
}

const SectionHeader: React.FC<SectionHeaderProps> = ({ number, title, sublabel }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="bg-black-card rounded-[10px] p-6 border border-white/06 flex items-center gap-5 md:gap-8 overflow-hidden"
    >
      <span className="text-[80px] md:text-[100px] font-black text-white/07 leading-none tracking-[-0.05em] select-none">
        {number}
      </span>
      <div className="flex flex-col">
        <motion.h2 
          initial={{ clipPath: 'inset(0 100% 0 0)' }}
          whileInView={{ clipPath: 'inset(0 0% 0 0)' }}
          viewport={{ once: true }}
          transition={{ duration: 0.65, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="text-[28px] md:text-[36px] font-extrabold text-white leading-none tracking-[-0.02em] uppercase"
        >
          {title}
        </motion.h2>
        {sublabel && (
          <span className="text-[11px] font-semibold text-white/25 uppercase tracking-[0.08em] mt-1">
            {sublabel}
          </span>
        )}
      </div>
      <div className="ml-auto hidden md:flex items-center gap-2">
        <div className="w-1.5 h-1.5 rounded-full bg-white/12" />
        <span className="text-[11px] text-white/20 uppercase">scroll trigger</span>
      </div>
    </motion.div>
  );
};

export default SectionHeader;
