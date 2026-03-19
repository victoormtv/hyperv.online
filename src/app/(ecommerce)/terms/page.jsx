"use client";
import Footer from "@/components/Footer";
import { useLanguage } from "@/context/LanguageContext";
import React from "react";

export default function TermsPage() {
  const { t } = useLanguage();
  const d = t.termsPage;

  return (
    <div className="min-h-screen text-white flex flex-col">
      <div className="flex-1">

        {/* Header */}
        <div className="pt-40 pb-12 text-center px-6">
          <h1 className="text-5xl md:text-6xl font-extrabold text-cyan-400 mb-4">{d.title}</h1>
          <p className="text-white/40 text-sm">{d.lastUpdated}</p>
        </div>

        {/* Content card */}
        <div className="max-w-5xl mx-auto px-6 pb-20">
          <div className="bg-white/[0.03] border border-white/10 rounded-3xl px-8 md:px-14 py-12 flex flex-col gap-10">

            {d.sections.map((s) => (
              <div key={s.n}>
                <h2 className="text-white font-extrabold text-xl mb-3">
                  {s.n}. {s.title}
                </h2>
                <div className="h-px bg-white/10 mb-5" />

                {/* Section 4 special layout */}
                {s.highlight && (
                  <>
                    <div className="bg-red-500/10 border border-red-500/30 rounded-xl px-5 py-4 mb-5">
                      <p className="text-white/80 text-sm leading-relaxed">{s.highlight}</p>
                    </div>
                    <p className="text-white/80 text-sm font-semibold mb-3">{s.validTitle}</p>
                    <ul className="flex flex-col gap-2 mb-5">
                      {s.validItems.map(i => (
                        <li key={i} className="flex items-start gap-2 text-white/60 text-sm">
                          <span className="text-cyan-400 mt-1 shrink-0">·</span>{i}
                        </li>
                      ))}
                    </ul>
                    <div className="bg-red-500/10 border border-red-500/30 rounded-xl px-5 py-4 mb-5">
                      <p className="text-white/80 text-sm leading-relaxed">{s.process}</p>
                    </div>
                    <p className="text-white/80 text-sm font-semibold mb-3">{s.noRefundTitle}</p>
                    <ul className="flex flex-col gap-2 mb-5">
                      {s.noRefundItems.map(i => (
                        <li key={i} className="flex items-start gap-2 text-white/60 text-sm">
                          <span className="text-red-400 mt-1 shrink-0">·</span>{i}
                        </li>
                      ))}
                    </ul>
                    <div className="bg-red-500/10 border border-red-500/30 rounded-xl px-5 py-4">
                      <p className="text-white font-bold text-sm mb-2">{s.chargebackTitle}</p>
                      <p className="text-white/60 text-sm leading-relaxed">{s.chargebackText}</p>
                    </div>
                  </>
                )}

                {/* Regular sections */}
                {!s.highlight && (
                  <div className="text-white/60 text-sm leading-relaxed">
                    {s.intro && <p className="mb-4">{s.intro}</p>}
                    {s.items?.length > 0 && (
                      <ul className="flex flex-col gap-2 mb-4">
                        {s.items.map(i => (
                          <li key={i} className="flex items-start gap-2">
                            <span className={`mt-1 shrink-0 ${s.danger ? "text-red-400" : "text-cyan-400"}`}>·</span>
                            {i}
                          </li>
                        ))}
                      </ul>
                    )}
                    {s.note && <p className="text-white/40 text-sm mt-2">{s.note}</p>}
                    {s.contact && (
                      <ul className="flex flex-col gap-2">
                        <li className="flex items-start gap-2">
                          <span className="text-cyan-400 mt-1 shrink-0">·</span>
                          {s.contact.label}{" "}
                          <a href={s.contact.href} target="_blank" rel="noopener noreferrer" className="text-cyan-400 hover:text-cyan-300 transition-colors ml-1">
                            {s.contact.link}
                          </a>
                        </li>
                      </ul>
                    )}
                  </div>
                )}
              </div>
            ))}

            {/* Final disclaimer */}
            <div className="bg-red-500/10 border border-red-500/30 rounded-xl px-5 py-5 mt-4">
              <p className="text-white font-extrabold text-sm text-center tracking-wide uppercase">
                {d.finalDisclaimer}
              </p>
            </div>

          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
