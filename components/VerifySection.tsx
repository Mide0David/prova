'use client';

import React from 'react';
import { motion } from 'framer-motion';
import SectionHeader from './SectionHeader';

const steps = [
  {
    title: "Identity Confirmation",
    body: "We collect their NIN slip and a selfie holding it — face, name, and document must match. We verify through NIMC directly.",
    chip: "NIMC Verified"
  },
  {
    title: "Bank Account Name Match",
    body: "Their account name must match their NIN exactly. If it doesn't, they're not approved. This makes them financially traceable.",
    chip: "BVN Cross-Checked"
  },
  {
    title: "Reference Calls — Not Emails",
    body: "We call two past clients and ask specific questions: address, cost, timeline, what went wrong. Generic praise doesn't pass.",
    chip: "Calls Logged on File"
  },
  {
    title: "Portfolio Verification",
    body: "Every photo is reverse image searched. We require a Prova-specific job-site photo proving the work is theirs.",
    chip: "Stolen Photos Rejected"
  },
  {
    title: "Interview & Standards Agreement",
    body: "A voice call with our team. No full upfront payment, regular client updates, public reviews after every job — or they're not listed.",
    chip: "Signed Standards Agreement"
  }
];

const VerifySection = () => {
  return (
    <section className="bg-black-pure px-6 md:px-20 py-20 max-w-7xl mx-auto w-full">
      <SectionHeader 
        number="02" 
        title="VERIFICATION PROCESS" 
        sublabel="How we vet every professional before you see their name" 
      />

      <div className="mt-12 border border-white/06 rounded-[14px] overflow-hidden bg-black-card">
        {steps.map((step, i) => (
          <motion.div
            key={i}
            initial={{ clipPath: 'inset(0 100% 0 0)', opacity: 0 }}
            whileInView={{ clipPath: 'inset(0 0% 0 0)', opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
            className={`p-6 md:p-8 flex gap-6 md:gap-8 border-b border-white/06 last:border-b-0`}
          >
            <div className="w-8 h-8 rounded-full border border-white/12 flex items-center justify-center flex-shrink-0 text-[12px] font-semibold text-white/40">
              {i + 1}
            </div>
            <div className="flex flex-col">
              <h3 className="text-[15px] md:text-[18px] font-bold text-white mb-2">
                {step.title}
              </h3>
              <p className="text-[13px] text-white/40 leading-relaxed max-w-2xl">
                {step.body}
              </p>
              <div className="mt-4">
                <span className="inline-flex bg-white/06 border border-white/12 rounded-full px-3 py-1 text-[10px] font-medium text-white/60">
                  {step.chip}
                </span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default VerifySection;
