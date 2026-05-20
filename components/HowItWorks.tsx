'use client';

import React from 'react';
import { motion } from 'framer-motion';
import SectionHeader from './SectionHeader';

const steps = [
  {
    title: "Describe Your Project",
    body: "Answer 4 quick questions. No open forms — Ava guides you through it in under 2 minutes."
  },
  {
    title: "We Match You",
    body: "We search our verified database and surface the 3 best-fit professionals for your exact job type and location."
  },
  {
    title: "Manage Remotely",
    body: "Connect directly, agree terms, and get progress updates — all without flying back to Lagos."
  }
];

const HowItWorks = () => {
  return (
    <section className="bg-black-pure px-6 md:px-20 py-20 max-w-7xl mx-auto w-full">
      <SectionHeader 
        number="04" 
        title="HOW IT WORKS" 
        sublabel="Three steps to a verified professional" 
      />
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
        {steps.map((step, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
            whileHover={{ scale: 1.02, borderColor: 'rgba(255,255,255,0.14)' }}
            className="bg-black-card border border-white/06 rounded-[14px] p-8 transition-colors"
          >
            <div className="text-[64px] font-black text-white/06 leading-none tracking-[-0.04em] mb-4">
              0{i + 1}
            </div>
            <h3 className="text-[18px] font-bold text-white mb-2">
              {step.title}
            </h3>
            <p className="text-[13px] text-white/40 leading-relaxed">
              {step.body}
            </p>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default HowItWorks;
