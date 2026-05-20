'use client';

import React from 'react';
import { motion } from 'framer-motion';
import SectionHeader from './SectionHeader';

const pains = [
  {
    label: "TIME ZONES",
    title: "Endless phone calls",
    body: "Chasing contractors across time zones who stop picking up after the deposit"
  },
  {
    label: "TRUST",
    title: "'Ask my guy' referrals",
    body: "Relatives who can't vouch for quality or actual reliability once money changes hands"
  },
  {
    label: "MONEY",
    title: "Money sent, no work done",
    body: "Contractors disappear after the first payment with nothing to show for it"
  },
  {
    label: "LOGISTICS",
    title: "Flying back to supervise",
    body: "Spending annual leave babysitting a job that should run without you"
  }
];

const PainSection = () => {
  return (
    <section className="bg-black-pure px-6 md:px-20 py-20 max-w-7xl mx-auto w-full">
      <SectionHeader 
        number="01" 
        title="THE PROBLEM" 
        sublabel="Why remote property management breaks down" 
      />
      
      <motion.div 
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: '-60px' }}
        variants={{
          hidden: {},
          show: {
            transition: {
              staggerChildren: 0.1
            }
          }
        }}
        className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-12"
      >
        {pains.map((pain, i) => (
          <motion.div
            key={i}
            variants={{
              hidden: { opacity: 0, y: 20 },
              show: { opacity: 1, y: 0 }
            }}
            whileHover={{ scale: 1.02, borderColor: 'rgba(255,255,255,0.14)' }}
            className="bg-black-card border border-white/06 rounded-[14px] p-6 min-h-[160px] flex flex-col justify-between transition-colors"
          >
            <div>
              <span className="text-[10px] font-semibold text-white/25 uppercase tracking-[0.08em] block mb-3">
                {pain.label}
              </span>
              <h3 className="text-[18px] font-bold text-white mb-2">
                {pain.title}
              </h3>
              <p className="text-[13px] text-white/40 leading-relaxed">
                {pain.body}
              </p>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
};

export default PainSection;
