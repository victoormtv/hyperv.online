"use client";
import React from "react";
import Link from "next/link";
import { Home, BookOpen, AlertTriangle, ChevronDown, Check, Package, ChevronsUpDown } from "lucide-react";
import { ACCENT, SECTIONS, PRODUCT_ICONS } from "./constants";

const LANGUAGES = [
  { code: "es", label: "Español", flag: "🇪🇸" },
  { code: "en", label: "English", flag: "🇺🇸" },
];

export default function SidebarContent({
  tx, locale, productId, productName, CurrentIcon,
  products, loadingProducts, productOpen, setProductOpen,
  setupOpen, setSetupOpen, troubleOpen, setTroubleOpen,
  langOpen, setLangOpen, activeSection, handleSectionChange,
  handleChangeLang, onNavClick,
}) {
  return (
    <>
      <div className="px-4 pt-4 pb-3">
        <Link href="/" className="flex items-center gap-2 text-white/60 hover:text-white text-sm transition-colors font-medium">
          <Home size={14} /> {tx.backToSite}
        </Link>
      </div>

      <div className="px-3 pb-2 relative">
        <button onClick={() => setProductOpen(!productOpen)}
          className="w-full flex items-center gap-3 px-3 py-3 rounded-xl text-white font-semibold text-sm transition-all"
          style={{ background: `${ACCENT}35`, border: `1px solid ${ACCENT}60` }}>
          <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0" style={{ background: ACCENT }}>
            <CurrentIcon size={14} />
          </div>
          <div className="flex-1 text-left overflow-hidden">
            <p className="text-white font-bold text-sm truncate">{productName}</p>
            <p className="text-white/50 text-xs">{tx.tutorial}</p>
          </div>
          <ChevronsUpDown size={14} className="text-white/60 shrink-0" />
        </button>
        {productOpen && (
          <div className="absolute left-3 right-3 top-full mt-1 rounded-xl shadow-2xl border border-white/15 z-50 overflow-y-auto hide-scrollbar"
            style={{ background: "#1a1d24", maxHeight: "260px" }}>
            {loadingProducts
              ? <div className="px-4 py-3 text-white/40 text-xs">{tx.loading}</div>
              : products.map(p => {
                  const slug = p.name?.toLowerCase().replace(/\s+/g, "-");
                  const PIcon = PRODUCT_ICONS[slug] || Package;
                  const isActive = slug === productId;
                  return (
                    <Link key={p.id} href={`/tutorial/${slug}`}
                      onClick={() => { setProductOpen(false); onNavClick?.(); }}
                      className={`flex items-center gap-2.5 px-4 py-2.5 text-xs transition-colors hover:bg-white/8 ${isActive ? "text-white font-semibold" : "text-white/65"}`}>
                      <div className="w-5 h-5 rounded-md flex items-center justify-center shrink-0"
                        style={{ background: isActive ? `${ACCENT}40` : "rgba(255,255,255,0.07)" }}>
                        <PIcon size={11} style={{ color: isActive ? ACCENT : "rgba(255,255,255,0.5)" }} />
                      </div>
                      <span className="flex-1 truncate">{p.name}</span>
                      {isActive && <Check size={11} className="text-green-400 shrink-0" />}
                    </Link>
                  );
                })
            }
          </div>
        )}
      </div>

      <div className="h-px bg-white/10 mx-3 mb-3" />

      <nav className="px-3">
        <button onClick={() => setSetupOpen(!setupOpen)}
          className="w-full flex items-center justify-between px-1 py-2 mb-1 hover:text-white/80 transition-colors"
          style={{ color: "rgba(255,255,255,0.8)" }}>
          <div className="flex items-center gap-1.5">
            <BookOpen size={11} style={{ color: ACCENT }} />
            <span className="text-[10px] font-extrabold tracking-widest uppercase whitespace-nowrap">{tx.setupGuide}</span>
          </div>
          <ChevronDown size={10} className={`transition-transform shrink-0 ${setupOpen ? "rotate-180" : ""}`} />
        </button>
        {setupOpen && (
          <div className="relative ml-2 pl-3 mb-3" style={{ borderLeft: `1.5px solid ${ACCENT}50` }}>
            {SECTIONS.filter(s => s.group === "SETUP").map(s => {
              const isActive = activeSection === s.id;
              return (
                <button key={s.id} onClick={() => { handleSectionChange(s.id); onNavClick?.(); }}
                  className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-all mb-0.5 text-left ${isActive ? "font-semibold" : "text-white/60 hover:text-white hover:bg-white/5"}`}
                  style={isActive ? { background: `${ACCENT}22`, color: ACCENT } : {}}>
                  {tx.sections[s.id]}
                </button>
              );
            })}
          </div>
        )}

        <button onClick={() => setTroubleOpen(!troubleOpen)}
          className="w-full flex items-center justify-between px-1 py-2 mb-1 hover:text-white/80 transition-colors"
          style={{ color: "rgba(255,255,255,0.8)" }}>
          <div className="flex items-center gap-1.5">
            <AlertTriangle size={11} style={{ color: "#f59e0b" }} />
            <span className="text-[10px] font-extrabold tracking-widest uppercase whitespace-nowrap">{tx.troubleshooting}</span>
          </div>
          <ChevronDown size={10} className={`transition-transform shrink-0 ${troubleOpen ? "rotate-180" : ""}`} />
        </button>
        {troubleOpen && (
          <div className="relative ml-2 pl-3 mb-3" style={{ borderLeft: "1.5px solid rgba(245,158,11,0.4)" }}>
            {SECTIONS.filter(s => s.group === "TROUBLE").map(s => {
              const isActive = activeSection === s.id;
              return (
                <button key={s.id} onClick={() => { handleSectionChange(s.id); onNavClick?.(); }}
                  className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-all mb-0.5 text-left ${isActive ? "font-semibold" : "text-white/60 hover:text-white hover:bg-white/5"}`}
                  style={isActive ? { background: "rgba(245,158,11,0.15)", color: "#f59e0b" } : {}}>
                  {tx.sections[s.id]}
                </button>
              );
            })}
          </div>
        )}
      </nav>

      <div className="h-px bg-white/10 mx-3 mb-3" />

      <div className="px-3 pb-5 flex flex-col gap-3">
        <a href="https://discord.com/invite/hypervgg" target="_blank" rel="noopener noreferrer"
          className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-semibold transition-all hover:brightness-110"
          style={{ background: "rgba(88,101,242,0.15)", border: "1px solid rgba(88,101,242,0.3)", color: "#8b96f8" }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
            <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/>
          </svg>
          {tx.discordSupport}
        </a>
        <div>
          <p className="text-white/30 text-[10px] font-bold tracking-widest uppercase mb-2 px-1">{tx.language}</p>
          <div className="relative">
            <button onClick={() => setLangOpen(!langOpen)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-white/70 text-sm hover:text-white transition-colors">
              <span className="text-base">{LANGUAGES.find(l => l.code === locale)?.flag}</span>
              <span>{LANGUAGES.find(l => l.code === locale)?.label}</span>
              <ChevronDown size={11} className={`ml-1 transition-transform ${langOpen ? "rotate-180" : ""}`} />
            </button>
            {langOpen && (
              <div className="absolute top-full mt-1 left-0 rounded-lg border border-white/10 overflow-hidden shadow-xl z-50"
                style={{ background: "#1a1d24", minWidth: "140px" }}>
                {LANGUAGES.map(l => (
                  <button key={l.code} onClick={() => handleChangeLang(l.code)}
                    className={`w-full flex items-center gap-2 px-3 py-2 text-sm hover:bg-white/5 transition-colors ${locale === l.code ? "text-white font-semibold" : "text-white/60"}`}>
                    <span className="text-base">{l.flag}</span><span>{l.label}</span>
                    {locale === l.code && <Check size={12} className="ml-auto text-green-400" />}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
