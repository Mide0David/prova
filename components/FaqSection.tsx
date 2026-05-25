'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const faqs = [
  {
    q: "How do I know a professional is really verified?",
    a: "Every pro passes 5 steps: NIN identity confirmation, BVN bank match, two reference calls, portfolio photo verification, and a voice interview. All records are logged."
  },
  {
    q: "Is this free to use?",
    a: "Yes — finding and contacting professionals through Groundwork is free for clients. We charge professionals a small listing fee."
  },
  {
    q: "What if a professional doesn't deliver?",
    a: "Every pro signs our standards agreement before listing. If something goes wrong, contact us and we'll escalate. We keep all verification records to hold them accountable."
  },
  {
    q: "Can I send a proxy — someone in Lagos — to browse for me?",
    a: "Yes. Share the Groundwork link with someone you trust in Lagos. They can browse, shortlist, and share pros with you over WhatsApp. You decide."
  },
  {
    q: "What cities are covered?",
    a: "Currently Lagos (Lekki, VI, Ikoyi, Surulere, Magodo, Ikeja) and Abuja. More cities coming."
  }
];

const FaqItem = ({ q, a }: { q: string, a: string }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-b border-white/06 last:border-b-0">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full py-6 flex items-center justify-between text-left group"
      >
        <span className="text-[15px] font-medium text-white group-hover:text-white/80 transition-colors">
          {q}
        </span>
        <motion.span 
          animate={{ rotate: isOpen ? 180 : 0 }}
          className="text-[16px] text-white/40"
        >
          ↓
        </motion.span>
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden"
          >
            <div className="pb-6 text-[13px] text-white/50 leading-relaxed max-w-2xl">
              {a}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const FaqSection = () => {
  return (
    <section className="bg-black-card border-t border-white/06 px-6 md:px-20 py-20 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="text-[clamp(48px,6vw,80px)] font-black text-white leading-none tracking-[-0.03em] uppercase mb-12"
        >
          FAQ.
        </motion.h2>

        <div className="border border-white/08 rounded-[14px] overflow-hidden bg-black-pure/50 px-6">
          {faqs.map((faq, i) => (
            <FaqItem key={i} q={faq.q} a={faq.a} />
          ))}
        </div>

        <div className="mt-20">
          <h3 className="text-[18px] font-bold text-white mb-1">
            Got a question? We&apos;ll get back to you.
          </h3>
          <a href="mailto:hello@groundwork.ng" className="text-[18px] text-white/40 hover:text-white transition-colors">
            hello@groundwork.ng
          </a>
        </div>
      </div>
    </section>
  );
};

export default FaqSection;
