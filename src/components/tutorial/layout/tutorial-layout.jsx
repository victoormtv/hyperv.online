"use client";
import React from "react";
import { Menu, X, ChevronRight, Package } from "lucide-react";
import { ACCENT, SECTIONS, PRODUCT_ICONS } from "../shared/constants";
import SidebarContent from "../shared/sidebar";

export default function TutorialLayout({
  tx, locale, productId, productName,
  products, loadingProducts,
  activeSection, handleSectionChange, handleChangeLang,
  productOpen, setProductOpen,
  setupOpen, setSetupOpen,
  troubleOpen, setTroubleOpen,
  langOpen, setLangOpen,
  drawerOpen, setDrawerOpen,
  children,
}) {
  const CurrentIcon = PRODUCT_ICONS[productId] || Package;
  const sectionIdx  = SECTIONS.findIndex(s => s.id === activeSection);
  const prevSection = SECTIONS[sectionIdx - 1];
  const nextSection = SECTIONS[sectionIdx + 1];

  const sidebarProps = {
    tx, locale, productId, productName, CurrentIcon,
    products, loadingProducts,
    productOpen, setProductOpen,
    setupOpen,   setSetupOpen,
    troubleOpen, setTroubleOpen,
    langOpen,    setLangOpen,
    activeSection, handleSectionChange, handleChangeLang,
  };

  const NavBtns = ({ px = "px-10" }) => (
    <div className={`${px} py-6 border-t border-white/10 flex items-center justify-between max-w-3xl mx-auto w-full`}>
      {prevSection
        ? <button onClick={() => handleSectionChange(prevSection.id)}
            className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-white/5 border border-white/10 text-white/60 hover:text-white text-sm transition-colors">
            <ChevronRight size={15} className="rotate-180" /> {tx.sections[prevSection.id]}
          </button>
        : <div />}
      {nextSection
        ? <button onClick={() => handleSectionChange(nextSection.id)}
            className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-white/5 border border-white/10 text-white/60 hover:text-white text-sm transition-colors">
            {tx.sections[nextSection.id]} <ChevronRight size={15} />
          </button>
        : <div />}
    </div>
  );

  return (
    <div className="text-white" style={{ background: "#0d0f12", fontFamily: "var(--font-outfit), sans-serif", minHeight: "100vh" }}>

      {/* Mobile top bar */}
      <div className="md:hidden flex items-center gap-3 px-4 py-3 border-b border-white/10 sticky top-0 z-40" style={{ background: "#13161c" }}>
        <button onClick={() => setDrawerOpen(true)} className="text-white/60 hover:text-white p-1 shrink-0"><Menu size={22} /></button>
        <div className="flex items-center gap-2 min-w-0">
          <div className="w-7 h-7 rounded-full flex items-center justify-center shrink-0" style={{ background: ACCENT }}>
            <CurrentIcon size={13} />
          </div>
          <span className="text-white font-bold text-sm truncate">{productName}</span>
        </div>
      </div>

      {/* Mobile drawer */}
      <div className={`md:hidden fixed inset-0 z-50 flex transition-all duration-300 ${drawerOpen ? "visible" : "invisible"}`}>
        <div className={`absolute inset-0 bg-black/60 transition-opacity duration-300 ${drawerOpen ? "opacity-100" : "opacity-0"}`}
          onClick={() => setDrawerOpen(false)} />
        <div className={`relative w-[280px] h-full flex flex-col overflow-y-auto hide-scrollbar transition-transform duration-300 ease-out ${drawerOpen ? "translate-x-0" : "-translate-x-full"}`}
          style={{ background: "#13161c" }}>
          <div className="flex items-center justify-between px-4 pt-4 pb-2">
            <span className="text-white/40 text-xs font-bold uppercase tracking-widest">Menu</span>
            <button onClick={() => setDrawerOpen(false)} className="text-white/60 hover:text-white"><X size={18} /></button>
          </div>
          <SidebarContent {...sidebarProps} onNavClick={() => setDrawerOpen(false)} />
        </div>
      </div>

      {/* Desktop layout */}
      <div className="hidden md:flex" style={{ height: "100vh", overflow: "hidden" }}>
        <aside className="w-[260px] shrink-0 border-r border-white/10 flex flex-col h-full overflow-y-auto hide-scrollbar"
          style={{ background: "#13161c" }}>
          <SidebarContent {...sidebarProps} />
        </aside>
        <main className="flex-1 flex flex-col h-full overflow-y-auto hide-scrollbar">
          <div className="flex-1 px-10 py-8 max-w-3xl mx-auto w-full">{children}</div>
          <NavBtns px="px-10" />
          <div className="text-center py-4 text-white/20 text-sm border-t border-white/5">© 2026 HyperV Community</div>
        </main>
      </div>

      {/* Mobile content */}
      <div className="md:hidden flex flex-col min-h-[calc(100vh-53px)]">
        <div className="flex-1 px-4 py-6 w-full max-w-2xl mx-auto">{children}</div>
        <NavBtns px="px-4" />
        <div className="text-center py-4 text-white/20 text-sm border-t border-white/5">© 2026 HyperV Community</div>
      </div>
    </div>
  );
}
