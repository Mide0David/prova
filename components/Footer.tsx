'use client';

import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-black-pure border-t border-white/06 px-6 md:px-20 py-5 flex flex-wrap items-center justify-between gap-3 text-[11px]">
      <div className="font-bold text-white tracking-[0.02em]">
        Prova
      </div>

      <div className="flex flex-wrap gap-x-8 gap-y-2 text-white/30">
        <a href="#" className="hover:text-white/70 transition-colors">Verification</a>
        <a href="#" className="hover:text-white/70 transition-colors">How It Works</a>
        <a href="#" className="hover:text-white/70 transition-colors">For Pros</a>
        <a href="#" className="hover:text-white/70 transition-colors">Find a Pro</a>
        <a href="#" className="hover:text-white/70 transition-colors">Contact</a>
      </div>

      <div className="text-white/20">
        Lagos & Abuja · Free to use · ©2026
      </div>
    </footer>
  );
};

export default Footer;
