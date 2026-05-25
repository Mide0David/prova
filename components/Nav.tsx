'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Menu, X } from 'lucide-react';

const Nav = () => {
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);

  const navLinks = [
    { label: 'How it works', href: '#how-it-works' },
    { label: 'Verification', href: '#verification' },
    { label: 'Projects', href: '#projects' },
    { label: 'For Pros', href: '/join' },
  ];

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 bg-black/85 backdrop-blur-xl border-b border-white/15">
        <div className="max-w-7xl mx-auto px-6 md:px-20 py-[14px] flex items-center justify-between">

          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="cursor-pointer"
            onClick={() => router.push('/')}
          >
            <Image
              src="/logo.svg"
              alt="Groundwork Logo"
              width={220}
              height={27}
              priority
              className="w-auto h-6 md:h-7"
            />
          </motion.div>

          {/* Desktop links */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link, i) => (
              <motion.div
                key={link.label}
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 + i * 0.05, ease: [0.16, 1, 0.3, 1] }}
              >
                <Link
                  href={link.href}
                  className="text-[12px] text-white/50 hover:text-white transition-colors duration-150"
                >
                  {link.label}
                </Link>
              </motion.div>
            ))}
          </div>

          {/* Desktop CTA */}
          <motion.button
            onClick={() => router.push('/find')}
            whileHover={{ scale: 1.02, boxShadow: '0 8px 28px rgba(245,49,0,0.35)' }}
            whileTap={{ scale: 0.97 }}
            transition={{ type: 'spring', stiffness: 400, damping: 20 }}
            className="hidden md:block group relative overflow-hidden px-7 py-3 rounded-md text-[13px] font-bold bg-[#f53100] border border-[#f53100] text-white"
          >
            <span
              className="absolute inset-0 w-full h-full translate-y-full transition-transform duration-300 ease-out group-hover:translate-y-0 z-0"
              style={{ background: 'linear-gradient(135deg, #fc8544ff 0%, #ff0606ff 60%, #fe1807ff 100%)' }}
            />
            <span className="relative z-10">Find My Professional</span>
          </motion.button>

          {/* Hamburger — mobile only */}
          <button
            onClick={() => setMobileOpen((v) => !v)}
            className="md:hidden p-2 text-white/60 hover:text-white transition-colors"
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </nav>

      {/* Mobile drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setMobileOpen(false)}
              className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
            />

            {/* Drawer panel */}
            <motion.div
              key="drawer"
              initial={{ opacity: 0, y: -12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
              className="fixed top-[57px] left-0 right-0 z-50 bg-[#0d0d0d] border-b border-white/10 px-6 pb-6 pt-4 flex flex-col gap-1"
            >
              {navLinks.map((link, i) => (
                <motion.div
                  key={link.label}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05, duration: 0.2 }}
                >
                  <Link
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    className="block py-3 text-[14px] text-white/60 hover:text-white border-b border-white/5 transition-colors duration-150"
                  >
                    {link.label}
                  </Link>
                </motion.div>
              ))}

              {/* Mobile CTA */}
              <motion.button
                onClick={() => { setMobileOpen(false); router.push('/find'); }}
                whileTap={{ scale: 0.97 }}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: navLinks.length * 0.05 + 0.05, duration: 0.2 }}
                className="mt-4 w-full py-3 rounded-md text-[13px] font-bold bg-[#f53100] text-white"
              >
                Find My Professional
              </motion.button>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default Nav;