'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';

const JoinPage = () => {
    const router = useRouter();
    const [step, setStep] = useState(1);
    const [form, setForm] = useState({
        name: '', trade: '', location: '', nin: '', phone: '', email: '',
    });

    const trades = [
        'Architect', 'Civil Engineer', 'Electrician', 'Plumber',
        'Carpenter', 'Mason / Bricklayer', 'Painter', 'Tiler',
        'Welder / Fabricator', 'HVAC Technician', 'Interior Designer', 'Other',
    ];

    const update = (field: string, value: string) =>
        setForm(prev => ({ ...prev, [field]: value }));

    return (
        <main className="min-h-screen bg-black text-white flex flex-col">
            {/* Top bar */}
            <div className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-xl border-b border-white/10 px-6 md:px-12 py-4 flex items-center justify-between">
                <button
                    onClick={() => router.push('/')}
                    className="text-[12px] text-white/40 hover:text-white transition-colors"
                >
                    ← Back to Prova
                </button>
                <span className="text-[11px] text-white/20 uppercase tracking-widest">
                    Professional Application — Step {step} of 3
                </span>
                <div className="flex gap-1.5">
                    {[1, 2, 3].map(s => (
                        <div
                            key={s}
                            className={`h-1 w-8 rounded-full transition-all duration-300 ${s <= step ? 'bg-[#f53100]' : 'bg-white/10'
                                }`}
                        />
                    ))}
                </div>
            </div>

            {/* Content */}
            <div className="flex-1 flex items-center justify-center px-6 pt-24 pb-12">
                <div className="w-full max-w-lg">

                    {step === 1 && (
                        <motion.div
                            key="step1"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                            className="flex flex-col gap-8"
                        >
                            <div>
                                <p className="text-[10px] text-white/25 uppercase tracking-[0.12em] mb-2">Step 1 — Identity</p>
                                <h1 className="text-[32px] md:text-[40px] font-bold leading-tight">
                                    Tell us who<br />you are.
                                </h1>
                            </div>

                            <div className="flex flex-col gap-4">
                                {[
                                    { label: 'Full Name', field: 'name', placeholder: 'e.g. Emeka Okafor', type: 'text' },
                                    { label: 'Email Address', field: 'email', placeholder: 'you@example.com', type: 'email' },
                                    { label: 'Phone Number', field: 'phone', placeholder: '+234 800 000 0000', type: 'tel' },
                                ].map(({ label, field, placeholder, type }) => (
                                    <div key={field} className="flex flex-col gap-1.5">
                                        <label className="text-[11px] text-white/40 uppercase tracking-wider">{label}</label>
                                        <input
                                            type={type}
                                            placeholder={placeholder}
                                            value={form[field as keyof typeof form]}
                                            onChange={e => update(field, e.target.value)}
                                            className="bg-white/5 border border-white/10 rounded-md px-4 py-3 text-[14px] text-white placeholder-white/20 focus:outline-none focus:border-[#f53100]/60 transition-colors"
                                        />
                                    </div>
                                ))}
                            </div>

                            <button
                                onClick={() => form.name && form.email && setStep(2)}
                                className={`w-full py-3.5 rounded-md text-[13px] font-bold transition-all duration-200 ${form.name && form.email
                                    ? 'bg-[#f53100] hover:bg-[#d42a00] text-white'
                                    : 'bg-white/5 text-white/20 cursor-not-allowed'
                                    }`}
                            >
                                Continue →
                            </button>
                        </motion.div>
                    )}

                    {step === 2 && (
                        <motion.div
                            key="step2"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                            className="flex flex-col gap-8"
                        >
                            <div>
                                <p className="text-[10px] text-white/25 uppercase tracking-[0.12em] mb-2">Step 2 — Trade</p>
                                <h1 className="text-[32px] md:text-[40px] font-bold leading-tight">
                                    What do<br />you do?
                                </h1>
                            </div>

                            <div className="flex flex-col gap-4">
                                <div className="flex flex-col gap-1.5">
                                    <label className="text-[11px] text-white/40 uppercase tracking-wider">Your Trade</label>
                                    <div className="grid grid-cols-2 gap-2">
                                        {trades.map(trade => (
                                            <button
                                                key={trade}
                                                onClick={() => update('trade', trade)}
                                                className={`py-2.5 px-3 rounded-md text-[12px] font-medium border transition-all duration-150 text-left ${form.trade === trade
                                                    ? 'bg-[#f53100]/15 border-[#f53100]/60 text-white'
                                                    : 'bg-white/5 border-white/10 text-white/50 hover:text-white hover:border-white/20'
                                                    }`}
                                            >
                                                {trade}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div className="flex flex-col gap-1.5">
                                    <label className="text-[11px] text-white/40 uppercase tracking-wider">City / State</label>
                                    <input
                                        type="text"
                                        placeholder="e.g. Lagos, Abuja, Port Harcourt"
                                        value={form.location}
                                        onChange={e => update('location', e.target.value)}
                                        className="bg-white/5 border border-white/10 rounded-md px-4 py-3 text-[14px] text-white placeholder-white/20 focus:outline-none focus:border-[#f53100]/60 transition-colors"
                                    />
                                </div>
                            </div>

                            <div className="flex gap-3">
                                <button
                                    onClick={() => setStep(1)}
                                    className="flex-1 py-3.5 rounded-md text-[13px] font-bold bg-white/5 text-white/40 hover:text-white transition-colors"
                                >
                                    ← Back
                                </button>
                                <button
                                    onClick={() => form.trade && form.location && setStep(3)}
                                    className={`flex-[2] py-3.5 rounded-md text-[13px] font-bold transition-all duration-200 ${form.trade && form.location
                                        ? 'bg-[#f53100] hover:bg-[#d42a00] text-white'
                                        : 'bg-white/5 text-white/20 cursor-not-allowed'
                                        }`}
                                >
                                    Continue →
                                </button>
                            </div>
                        </motion.div>
                    )}

                    {step === 3 && (
                        <motion.div
                            key="step3"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                            className="flex flex-col gap-8"
                        >
                            <div>
                                <p className="text-[10px] text-white/25 uppercase tracking-[0.12em] mb-2">Step 3 — Verification</p>
                                <h1 className="text-[32px] md:text-[40px] font-bold leading-tight">
                                    Prove your<br />identity.
                                </h1>
                                <p className="text-[13px] text-white/35 mt-2">
                                    Your NIN is encrypted and used only for identity verification. We never share it.
                                </p>
                            </div>

                            <div className="flex flex-col gap-4">
                                <div className="flex flex-col gap-1.5">
                                    <label className="text-[11px] text-white/40 uppercase tracking-wider">NIN (National ID Number)</label>
                                    <input
                                        type="text"
                                        placeholder="Enter your 11-digit NIN"
                                        maxLength={11}
                                        value={form.nin}
                                        onChange={e => update('nin', e.target.value.replace(/\D/g, ''))}
                                        className="bg-white/5 border border-white/10 rounded-md px-4 py-3 text-[14px] text-white placeholder-white/20 focus:outline-none focus:border-[#f53100]/60 transition-colors font-mono tracking-widest"
                                    />
                                </div>

                                <div className="border border-white/08 rounded-md p-4 flex flex-col gap-2">
                                    <p className="text-[11px] text-white/30 uppercase tracking-wider">What happens next</p>
                                    {[
                                        'NIN verified against NIMC records',
                                        'Reference check via phone',
                                        'Portfolio review by our team',
                                        'Profile goes live within 48 hours',
                                    ].map((step, i) => (
                                        <div key={i} className="flex items-center gap-3 text-[12px] text-white/50">
                                            <span className="text-[#f53100] text-[10px]">{i + 1}</span>
                                            {step}
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="flex gap-3">
                                <button
                                    onClick={() => setStep(2)}
                                    className="flex-1 py-3.5 rounded-md text-[13px] font-bold bg-white/5 text-white/40 hover:text-white transition-colors"
                                >
                                    ← Back
                                </button>
                                <button
                                    onClick={() => {
                                        // TODO: submit form to your API
                                        alert('Application submitted! We\'ll be in touch within 48 hours.');
                                        router.push('/');
                                    }}
                                    className={`flex-[2] py-3.5 rounded-md text-[13px] font-bold transition-all duration-200 ${form.nin.length === 11
                                        ? 'bg-[#f53100] hover:bg-[#d42a00] text-white'
                                        : 'bg-white/5 text-white/20 cursor-not-allowed'
                                        }`}
                                >
                                    Submit Application
                                </button>
                            </div>
                        </motion.div>
                    )}

                </div>
            </div>
        </main>
    );
};

export default JoinPage;