'use client';

import React from 'react';

const signals = [
  "NIN Verified ✓", "Amaka Tunde · Lagos", "BVN Cross-Checked ✓", "Olu Badmus · Abuja",
  "Reference Calls Made ✓", "Portfolio Verified ✓", "Funmi Ade · Surulere", "Post-Job Reviews Only ✓",
  "Ngozi Kalu · Magodo", "5-Star Rated ✓", "Chidi Uzo · Ikoyi", "Identity Confirmed ✓"
];

const MarqueeStrip = () => {
  return (
    <div className="bg-black-card border-t border-b border-white/06 py-4 overflow-hidden relative z-20">
      <div className="flex whitespace-nowrap animate-marquee">
        <div className="flex gap-5 px-5">
          {signals.map((signal, i) => (
            <div 
              key={`signal-1-${i}`}
              className="bg-white/04 border border-white/08 rounded-lg px-4 py-2 text-[12px] text-white/50 flex-shrink-0"
            >
              {signal}
            </div>
          ))}
        </div>
        <div className="flex gap-5 px-5" aria-hidden="true">
          {signals.map((signal, i) => (
            <div 
              key={`signal-2-${i}`}
              className="bg-white/04 border border-white/08 rounded-lg px-4 py-2 text-[12px] text-white/50 flex-shrink-0"
            >
              {signal}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MarqueeStrip;
