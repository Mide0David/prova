"use client";

import { motion } from "framer-motion";

export default function ShareCallout() {
  return (
    <motion.section
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
      className="max-w-[580px] mx-auto w-full px-6 my-6"
    >
      <div className="border-[0.5px] border-brand-border rounded-[14px] p-5 bg-brand-light flex flex-col sm:flex-row gap-4 items-start sm:items-center">
        <div className="w-[36px] h-[36px] rounded-full bg-brand flex items-center justify-center shrink-0">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 2L11 13" />
            <path d="M22 2l-7 20-4-9-9-4 20-7z" />
          </svg>
        </div>
        <div className="flex-1">
          <h3 className="text-[13px] font-medium text-brand-darkest mb-1">
            Have someone in Lagos you trust?
          </h3>
          <p className="text-[12px] text-brand leading-[1.5] mb-3">
            Send them a link to find and compare professionals on your behalf. They browse, you decide — together over WhatsApp.
          </p>
          <motion.button
            whileHover={{ scale: 1.03, backgroundColor: '#4540A0' }}
            whileTap={{ scale: 0.97 }}
            transition={{ duration: 0.14 }}
            className="bg-brand text-white rounded-[8px] px-4 py-2 text-[13px] font-medium"
          >
            Share Prova with them
          </motion.button>
        </div>
      </div>
    </motion.section>
  );
}
