"use client";

import { motion } from "framer-motion";

export default function CtaStrip() {
  return (
    <motion.section
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
      className="py-[32px] px-6 text-center border-t-[0.5px] border-border w-full"
    >
      <h2 className="text-[20px] font-medium text-text-primary mb-2">
        Ready to get your Lagos project moving?
      </h2>
      <p className="text-[13px] text-text-secondary mb-6">
        Find a verified professional in under 2 minutes — no signup needed.
      </p>

      <div className="flex flex-col sm:flex-row items-center justify-center gap-3 w-full sm:w-auto">
        <motion.button
          whileHover={{ scale: 1.03, backgroundColor: '#4540A0' }}
          whileTap={{ scale: 0.97 }}
          transition={{ duration: 0.14 }}
          className="w-full sm:w-auto bg-brand text-white rounded-[12px] px-[26px] py-[13px] text-[14px] font-medium flex items-center justify-center gap-2"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
            <circle cx="12" cy="7" r="4"></circle>
          </svg>
          Find my professional
        </motion.button>
        
        <motion.button
          whileHover={{ borderColor: '#534AB7', color: '#534AB7' }}
          whileTap={{ scale: 0.97 }}
          transition={{ duration: 0.14 }}
          className="w-full sm:w-auto bg-transparent border-[0.5px] border-brand-border text-brand rounded-[12px] px-[20px] py-[13px] text-[14px] font-medium flex items-center justify-center"
        >
          List your services
        </motion.button>
      </div>
    </motion.section>
  );
}
