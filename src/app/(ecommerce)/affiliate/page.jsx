"use client";
import React, { useState } from "react";
import Footer from "@/components/Footer";
import {
  DollarSign, Users, TrendingUp, UserPlus, Gift,
  BarChart2, CreditCard, Shield, Zap, ChevronDown
} from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

const stepIcons = [
  <UserPlus key="0" size={22} className="text-cyan-400" />,
  <Gift key="1" size={22} className="text-cyan-400" />,
  <TrendingUp key="2" size={22} className="text-cyan-400" />,
  <BarChart2 key="3" size={22} className="text-cyan-400" />,
  <CreditCard key="4" size={22} className="text-cyan-400" />,
];

const benefitIcons = [
  <DollarSign key="0" size={22} className="text-cyan-400" />,
  <Zap key="1" size={22} className="text-cyan-400" />,
  <Shield key="2" size={22} className="text-cyan-400" />,
];

const statIcons = [
  <DollarSign key="0" size={14} className="text-cyan-400" />,
  <Users key="1" size={14} className="text-cyan-400" />,
  <TrendingUp key="2" size={14} className="text-cyan-400" />,
];

const FAQ = ({ q, a }) => {
  const [open, setOpen] = useState(false);
  return (
    <div
      className="border border-white/10 rounded-2xl px-6 py-5 cursor-pointer hover:border-cyan-500/30 transition-all duration-200 bg-white/[0.03]"
      onClick={() => setOpen(!open)}
    >
      <div className="flex items-center justify-between gap-4">
        <span className="text-white font-semibold text-lg">{q}</span>
        <ChevronDown
          size={18}
          className={`text-cyan-400 shrink-0 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
        />
      </div>
      {open && (
        <p className="text-white/50 text-base mt-3 leading-relaxed">{a}</p>
      )}
    </div>
  );
};

export default function AffiliatePage() {
  const { t } = useLanguage();
  const d = t.affiliatePage;
  const discordUrl = "https://discord.com/invite/hypervgg";

  return (
    <div className="min-h-screen text-white flex flex-col">
      <div className="flex-1">

        {/* ── HERO ── */}
        <section className="pt-40 pb-20 px-6 md:px-16 text-center max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-semibold px-4 py-1.5 rounded-full mb-8">
            <DollarSign size={13} /> {d.badge}
          </div>
          <h1 className="text-5xl md:text-6xl font-extrabold leading-tight mb-8">
            {d.heading}<br />
            <span className="text-cyan-400">{d.commission}</span>
          </h1>
          <p className="text-white/50 text-xl max-w-2xl mx-auto mb-12 leading-relaxed">
            {d.subtext}
          </p>
          <a
            href={discordUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-xl font-bold text-base text-white transition-all duration-200 hover:scale-105 active:scale-95"
            style={{
              background: "linear-gradient(135deg, #06b6d4, #0891b2)",
              boxShadow: "0 0 25px rgba(6,182,212,0.4)",
            }}
          >
            {d.cta} →
          </a>

          {/* stats */}
          <div className="mt-16 grid grid-cols-1 sm:grid-cols-3 gap-4 border border-white/10 rounded-2xl p-6 bg-white/[0.03]">
            {d.stats.map((s, i) => (
              <div key={s.label} className="flex flex-col items-start p-4 bg-white/5 rounded-xl border border-white/10">
                <div className="flex items-center gap-2 text-white/50 text-xs mb-3">
                  <div className="w-7 h-7 rounded-lg bg-cyan-500/15 flex items-center justify-center">
                    {statIcons[i]}
                  </div>
                  {s.label}
                </div>
                <p className="text-white font-extrabold text-3xl">{s.value}</p>
                <p className={`text-xs mt-1 ${s.subColor}`}>{s.sub}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── HOW IT WORKS ── */}
        <section className="py-20 px-6 md:px-10 max-w-screen-xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-4">{d.howItWorksTitle}</h2>
            <p className="text-white/40 text-base">{d.howItWorksSub}</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
            {d.steps.map((s, i) => (
              <div key={s.n} className="relative bg-white/[0.03] border border-white/10 rounded-2xl p-8 flex flex-col gap-4 hover:border-cyan-500/30 transition-colors">
                {/* línea conectora a la derecha */}
                {i < d.steps.length - 1 && (
                  <div className="hidden lg:block absolute top-1/2 -right-2.5 w-5 h-px bg-cyan-500/30 z-10" />
                )}
                <span className="text-white/10 font-extrabold text-6xl leading-none">{s.n}</span>
                <div className="w-12 h-12 rounded-xl bg-cyan-500/10 flex items-center justify-center border border-cyan-500/20">
                  {stepIcons[i]}
                </div>
                <div>
                  <p className="text-white font-bold text-xl mb-2">{s.title}</p>
                  <p className="text-white/40 text-base leading-relaxed">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── WHY PROMOTE ── */}
        <section className="py-20 px-6 md:px-16 max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-4">{d.whyTitle}</h2>
            <p className="text-white/40 text-base">{d.whySub}</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {d.benefits.map((b, i) => (
              <div key={b.title} className="bg-white/[0.03] border border-white/10 rounded-2xl p-7 hover:border-cyan-500/30 hover:shadow-[0_0_20px_rgba(34,211,238,0.10)] transition-all duration-200">
                <div className="w-11 h-11 rounded-xl bg-cyan-500/10 flex items-center justify-center border border-cyan-500/20 mb-5">
                  {benefitIcons[i]}
                </div>
                <p className="text-white font-bold text-xl mb-3">{b.title}</p>
                <p className="text-white/40 text-base leading-relaxed">{b.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── FAQ ── */}
        <section className="py-20 px-6 md:px-16 max-w-3xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-3">{d.faqTitle}</h2>
          </div>
          <div className="flex flex-col gap-3">
            {d.faqs.map((f) => <FAQ key={f.q} q={f.q} a={f.a} />)}
          </div>
        </section>

        {/* ── CTA ── */}
        <section className="py-20 px-6 text-center max-w-2xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-5">{d.ctaTitle}</h2>
          <p className="text-white/40 text-lg mb-12">{d.ctaSub}</p>
          <a
            href={discordUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-10 py-4 rounded-xl font-bold text-base text-white transition-all duration-200 hover:scale-105 active:scale-95"
            style={{
              background: "linear-gradient(135deg, #06b6d4, #0891b2)",
              boxShadow: "0 0 25px rgba(6,182,212,0.4)",
            }}
          >
            {d.ctaFinal} →
          </a>
        </section>

      </div>
      <Footer />
    </div>
  );
}
