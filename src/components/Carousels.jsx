"use client";
import React from "react";
import { useLanguage } from "@/context/LanguageContext";

const icons = [
  <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
  </svg>,
  <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
  </svg>,
  <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
  </svg>,
  <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
  </svg>,
];

const Carousels = () => {
  const { t } = useLanguage();
  const hero = t.profile?.[0];

  return (
      <div 
        className="relative w-full h-screen overflow-hidden"
        style={{
          backgroundColor: "#050608",
          backgroundImage: `
            linear-gradient(rgba(34,211,238,0.06) 1px, transparent 1px),
            linear-gradient(90deg, rgba(34,211,238,0.06) 1px, transparent 1px)
          `,
          backgroundSize: "60px 60px",
        }}
      >

      <video
        className="absolute inset-0 w-full h-full object-cover"
        src="/videos/hero-preview.mp4"
        autoPlay loop muted playsInline
      />

      <div className="absolute inset-0" />
      <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/20 to-black/30" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/40" />
      <div className="absolute bottom-0 left-0 w-full h-48 bg-gradient-to-t from-black via-black/80 to-transparent pointer-events-none z-10" />

      <div className="relative z-20 h-full w-full flex flex-col justify-center items-center text-center px-8 md:px-16">

        <div className="flex items-center gap-2 mb-6">
          <span className="inline-flex items-center gap-1.5 bg-white/10 backdrop-blur-sm border border-white/20 text-white text-xs font-semibold tracking-widest px-4 py-2 rounded-full uppercase">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
            {hero?.badge}
          </span>
        </div>

        <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold text-white leading-tight mb-2 drop-shadow-lg">
          {hero?.heading}
        </h1>

        <h2
          className="text-5xl md:text-6xl lg:text-7xl font-extrabold leading-tight mb-6 drop-shadow-lg"
          style={{ color: "#06b6d4" }}
        >
          {hero?.subheading}
        </h2>

        <div className="mb-10 mx-auto text-base md:text-lg text-white/75 leading-relaxed max-w-2xl text-center">
          <p>{hero?.text}</p>
        </div>

        <div className="flex flex-wrap gap-4 justify-center mb-10">
          <a
            href="/products"
            className="inline-flex items-center gap-2 px-10 py-4 rounded-xl font-bold text-lg text-white transition-all duration-300 hover:scale-110 active:scale-95"
            style={{
              background: "linear-gradient(135deg, #06b6d4, #0891b2)",
              boxShadow: "0 0 25px rgba(6, 182, 212, 0.5), 0 0 50px rgba(6, 182, 212, 0.2)",
            }}
          >
            {hero?.cta}
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </a>

          <a
            href="https://discord.com/invite/hypervgg"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-5 py-3 rounded-lg font-medium text-sm text-white/70 border border-white/20 bg-white/5 backdrop-blur-sm hover:border-white/40 hover:text-white transition-all duration-200"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
              <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 13.94 13.94 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
            </svg>
            {hero?.ctaSecondary}
          </a>
        </div>

        <div className="flex flex-wrap gap-2 justify-center items-center">
          {t.badges?.map((label, i, arr) => (
            <React.Fragment key={label}>
              <div className="flex items-center gap-1.5 text-white/70 text-xs">
                <span className="text-white/30">{icons[i]}</span>
                {label}
              </div>
              {i < arr.length - 1 && (
                <span className="text-white/20 mx-1">·</span>
              )}
            </React.Fragment>
          ))}
        </div>

      </div>
    </div>
  );
};

export default Carousels;