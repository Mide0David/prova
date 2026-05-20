"use client";

import { motion } from "framer-motion";

export default function TrustBar() {
  return (
    <motion.section
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
      className="w-full bg-surface-secondary border-y-[0.5px] border-border mt-8"
    >
      <div className="max-w-[640px] mx-auto grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-border">
        {/* Item 1 */}
        <div className="trust-item group p-4 sm:p-5 flex flex-col items-center sm:items-start text-center sm:text-left gap-2 cursor-pointer">
          <div className="w-[28px] h-[28px] rounded-full bg-trust-greenLight flex items-center justify-center text-trust-green">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              <path d="M9 12l2 2 4-4" />
            </svg>
          </div>
          <div>
            <h3 className="text-[12px] font-medium text-text-primary group-hover:text-brand transition-colors duration-150">NIN & BVN verified</h3>
            <p className="text-[11px] text-text-secondary mt-1 mb-1.5">Real identity, confirmed</p>
            <span className="text-[10px] text-brand font-medium">See how &rarr;</span>
          </div>
        </div>

        {/* Item 2 */}
        <div className="trust-item group p-4 sm:p-5 flex flex-col items-center sm:items-start text-center sm:text-left gap-2 cursor-pointer">
          <div className="w-[28px] h-[28px] rounded-full bg-brand-light flex items-center justify-center text-brand">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <polyline points="16 11 18 13 22 9" />
            </svg>
          </div>
          <div>
            <h3 className="text-[12px] font-medium text-text-primary group-hover:text-brand transition-colors duration-150">References called</h3>
            <p className="text-[11px] text-text-secondary mt-1 mb-1.5">We speak to past clients</p>
            <span className="text-[10px] text-brand font-medium">See how &rarr;</span>
          </div>
        </div>

        {/* Item 3 */}
        <div className="trust-item group p-4 sm:p-5 flex flex-col items-center sm:items-start text-center sm:text-left gap-2 cursor-pointer">
          <div className="w-[28px] h-[28px] rounded-full bg-amber-light flex items-center justify-center text-amber-deep">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
            </svg>
          </div>
          <div>
            <h3 className="text-[12px] font-medium text-text-primary group-hover:text-brand transition-colors duration-150">Post-job reviews only</h3>
            <p className="text-[11px] text-text-secondary mt-1 mb-1.5">No fake ratings allowed</p>
            <span className="text-[10px] text-brand font-medium">See how &rarr;</span>
          </div>
        </div>
      </div>
    </motion.section>
  );
}
