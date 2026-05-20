'use client';

import React from 'react';
import { motion } from 'framer-motion';
import SectionHeader from './SectionHeader';

const projects = [
  {
    label: "Interior Design",
    tags: ["Lekki Phase 1", "Client in 🇬🇧 London", "Verified"],
    title: "5-Bed Duplex Redesign: Full Interior Overhaul",
    pro: "AT — Amaka Tunde",
    initials: "AT",
    type: "design"
  },
  {
    label: "Architecture",
    tags: ["Victoria Island", "Client in 🇺🇸 Houston", "Verified"],
    title: "New Build Supervision: VI Development Site",
    pro: "OB — Olu Badmus",
    initials: "OB",
    type: "arch"
  },
  {
    label: "Smart Home",
    tags: ["Ikoyi", "Client in 🇦🇪 Dubai", "Verified"],
    title: "Smart Home Setup: Automated Control Install",
    pro: "CU — Chidi Uzo",
    initials: "CU",
    type: "smart"
  },
  {
    label: "Landscaping",
    tags: ["Magodo", "Client in 🇨🇦 Toronto", "Verified"],
    title: "Compound Garden Overhaul: Full Replant",
    pro: "NK — Ngozi Kalu",
    initials: "NK",
    type: "land"
  },
  {
    label: "Renovation",
    tags: ["Surulere", "Client in 🇩🇪 Berlin", "Verified"],
    title: "Kitchen Renovation: Full Strip and Refit",
    pro: "FM — Funmi Ade",
    initials: "FM",
    type: "reno"
  },
  {
    label: "Security",
    tags: ["Ikeja GRA", "Client in 🇫🇷 Paris", "Verified"],
    title: "CCTV & Gate Automation: 24/7 Remote View",
    pro: "TK — Tunde Kola",
    initials: "TK",
    type: "sec"
  }
];

const ProjectVisual = ({ type }: { type: string }) => {
  return (
    <div className="h-[180px] bg-black-hover rounded-lg border border-white/06 relative overflow-hidden group">
      {type === 'design' && (
        <svg className="w-full h-full p-8" viewBox="0 0 100 100">
          <motion.rect 
            x="20" y="20" width="60" height="60" fill="none" stroke="white" strokeWidth="0.5" strokeOpacity="0.2"
            initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
          />
          <motion.path 
            d="M20 50 L80 50 M50 20 L50 80" stroke="white" strokeWidth="0.5" strokeOpacity="0.1"
            initial={{ opacity: 0 }} animate={{ opacity: [0, 1, 0] }} transition={{ duration: 2, repeat: Infinity }}
          />
        </svg>
      )}
      {type === 'arch' && (
        <svg className="w-full h-full p-8" viewBox="0 0 100 100">
          <motion.path 
            d="M20 80 L50 20 L80 80 Z" fill="none" stroke="white" strokeWidth="0.5" strokeOpacity="0.3"
            initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.line 
            x1="20" y1="80" x2="80" y2="80" stroke="white" strokeWidth="1" strokeOpacity="0.4"
            animate={{ scaleX: [1, 1.1, 1] }} transition={{ duration: 2, repeat: Infinity }}
          />
        </svg>
      )}
      {type === 'smart' && (
        <svg className="w-full h-full p-8" viewBox="0 0 100 100">
          <motion.circle 
            cx="50" cy="50" r="10" fill="white" fillOpacity="0.2"
            animate={{ r: [10, 30, 10], opacity: [0.2, 0, 0.2] }} transition={{ duration: 3, repeat: Infinity }}
          />
          <motion.circle 
            cx="50" cy="50" r="5" fill="white" fillOpacity="0.5"
          />
        </svg>
      )}
      {/* Default/Other types handle similarly with minimalist motion */}
      {['land', 'reno', 'sec'].includes(type) && (
        <svg className="w-full h-full p-8" viewBox="0 0 100 100">
          <motion.path 
            d="M30 70 L50 30 L70 70" fill="none" stroke="white" strokeWidth="0.5" strokeOpacity="0.2"
            animate={{ y: [0, -5, 0] }} transition={{ duration: 4, repeat: Infinity }}
          />
        </svg>
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-black-card to-transparent opacity-50" />
    </div>
  );
};

const ProjectsGrid = () => {
  return (
    <section className="bg-black-pure px-6 md:px-20 py-20 max-w-7xl mx-auto w-full">
      <SectionHeader 
        number="03" 
        title="COMPLETED PROJECTS" 
        sublabel="Every job below was managed remotely" 
      />

      <motion.div 
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: '-60px' }}
        variants={{
          hidden: {},
          show: { transition: { staggerChildren: 0.08 } }
        }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mt-12"
      >
        {projects.map((p, i) => (
          <motion.div
            key={i}
            variants={{
              hidden: { opacity: 0, y: 20 },
              show: { opacity: 1, y: 0 }
            }}
            whileHover={{ scale: 1.02, borderColor: 'rgba(255,255,255,0.14)' }}
            className="bg-black-card border border-white/06 rounded-[14px] overflow-hidden group cursor-pointer transition-all flex flex-col"
          >
            <span className="text-[10px] font-semibold text-white/25 uppercase tracking-[0.08em] px-4 pt-4 block">
              {p.label}
            </span>
            
            <div className="p-3.5 pt-2.5">
              <ProjectVisual type={p.type} />
            </div>

            <div className="px-4 flex flex-wrap gap-1.5 mb-3">
              {p.tags.map((tag, j) => (
                <span key={j} className="bg-white/06 border border-white/12 rounded-full px-2.5 py-0.5 text-[10px] font-medium text-white/60">
                  {tag}
                </span>
              ))}
            </div>

            <h3 className="text-[16px] font-bold text-white px-4 mb-4 leading-snug">
              {p.title}
            </h3>

            <div className="px-4 pb-4 mt-auto flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 rounded-full bg-white/10 flex items-center justify-center text-[8px] font-bold text-white/50">
                  {p.initials}
                </div>
                <span className="text-[11px] text-white/40">{p.pro}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <button className="bg-white text-black px-3 py-1 rounded-full text-[10px] font-bold opacity-0 group-hover:opacity-100 transition-opacity">
                  View Project
                </button>
                <span className="text-[10px] text-white/40 tracking-widest">★★★★★</span>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
};

export default ProjectsGrid;
