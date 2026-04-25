"use client";
import React, { useState, useEffect } from "react";
import {
  Download, ExternalLink, AlertTriangle, Shield,
  Check, Copy, ChevronRight, MessageCircle, Package
} from "lucide-react";
import { ACCENT } from "./constants";

export const StepBadge = ({ n, color = ACCENT }) => (
  <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-extrabold shrink-0"
    style={{ background: color }}>{n}</div>
);

export const DownloadBtn = ({ href, label, color = ACCENT }) => (
  <a href={href} target="_blank" rel="noopener noreferrer"
    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg text-white text-sm font-bold transition-all duration-200 hover:brightness-110"
    style={{ background: color }}>
    <Download size={15} /> {label} <ExternalLink size={13} />
  </a>
);

export const WarningBox = ({ title, desc, color = "#b45309" }) => (
  <div className="rounded-xl px-4 py-4 border flex gap-3"
    style={{ background: `${color}18`, borderColor: `${color}40` }}>
    <AlertTriangle size={18} style={{ color }} className="shrink-0 mt-0.5" />
    <div>
      <p className="font-bold text-sm" style={{ color }}>{title}</p>
      {desc && <p className="text-white/60 text-sm mt-0.5">{desc}</p>}
    </div>
  </div>
);

export const InfoBox = ({ text }) => (
  <div className="rounded-xl px-4 py-3 border flex gap-3 items-start"
    style={{ background: `${ACCENT}15`, borderColor: `${ACCENT}35` }}>
    <Shield size={16} style={{ color: ACCENT }} className="shrink-0 mt-0.5" />
    <p className="text-sm" style={{ color: ACCENT }}>{text}</p>
  </div>
);

export const Card = ({ children, className = "" }) => (
  <div className={`bg-[#111318] border border-white/10 rounded-2xl p-4 md:p-6 ${className}`}>
    {children}
  </div>
);

export const CardTitle = ({ icon: Icon, title, color = "white" }) => (
  <div className="flex items-center gap-2 mb-4">
    <Icon size={18} style={{ color }} />
    <h3 className="font-bold text-base text-white">{title}</h3>
  </div>
);

export const Accordion = ({ title, children, img, warning, video, extra, link, extraImg }) => {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-white/10 rounded-xl overflow-hidden">
      <button onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-4 py-3.5 text-white/80 hover:text-white hover:bg-white/5 transition-all text-sm font-semibold text-left">
        <div className="flex items-center gap-2">
          <ChevronRight size={14} className={`transition-transform shrink-0 ${open ? "rotate-90" : ""}`} />
          <span>{title}</span>
        </div>
      </button>
      {open && (
        <div className="px-4 pb-4 flex flex-col gap-3">
          {children && <p className="text-white/50 text-sm leading-relaxed">{children}</p>}
          {img && <div className="rounded-xl overflow-hidden border border-white/10"><img src={img} alt={title} className="w-full h-auto object-contain" /></div>}
          {extra && <p className="text-white/50 text-sm leading-relaxed">{extra}</p>}
          {extraImg && <div className="rounded-xl overflow-hidden border border-white/10"><img src={extraImg} alt={`${title} solution`} className="w-full h-auto object-contain" /></div>}
          {warning && (
            <div className="rounded-xl px-4 py-3 border flex gap-3" style={{ background: "rgba(245,158,11,0.1)", borderColor: "rgba(245,158,11,0.3)" }}>
              <AlertTriangle size={16} className="text-yellow-400 shrink-0 mt-0.5" />
              <p className="text-yellow-400/80 text-sm leading-relaxed">{warning}</p>
            </div>
          )}
          {link && (
            <a href={link.href} target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg text-white text-sm font-bold transition-all duration-200 hover:brightness-110 self-start"
              style={{ background: ACCENT }}>
              <Download size={15} /> {link.label} <ExternalLink size={13} />
            </a>
          )}
          {video && (
            <div className="rounded-xl overflow-hidden border border-white/10 aspect-video w-full">
              <iframe src={video} className="w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen />
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export const CopyUrl = ({ section }) => {
  const [url, setUrl] = useState(`?section=${section}`);
  const [copied, setCopied] = useState(false);
  useEffect(() => { setUrl(`${window.location.origin}${window.location.pathname}?section=${section}`); }, [section]);
  return (
    <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-lg px-3 py-2.5 mb-6">
      <span suppressHydrationWarning className="text-white/30 text-xs flex-1 truncate">{url}</span>
      <button onClick={() => { navigator.clipboard.writeText(url); setCopied(true); setTimeout(() => setCopied(false), 1500); }}
        className="text-white/40 hover:text-white transition-colors shrink-0">
        {copied ? <Check size={14} className="text-green-400" /> : <Copy size={14} />}
      </button>
    </div>
  );
};

export const ComingSoon = ({ productName, tx }) => (
  <div className="flex flex-col items-center justify-center py-24 text-center">
    <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-6"
      style={{ background: `${ACCENT}20`, border: `1px solid ${ACCENT}40` }}>
      <Package size={28} style={{ color: ACCENT }} />
    </div>
    <h2 className="text-2xl font-extrabold text-white mb-3">{productName}</h2>
    <p className="text-white/40 text-sm max-w-sm">
      {tx.tutorial === "Tutorial"
        ? "Tutorial coming soon. Contact support on Discord."
        : "Tutorial próximamente disponible. Contacta soporte en Discord."}
    </p>
    <a href="https://discord.com/invite/hypervgg" target="_blank" rel="noopener noreferrer"
      className="mt-6 inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-white text-sm font-bold bg-[#5865F2] hover:bg-[#4752c4] transition-colors">
      <MessageCircle size={15} /> Discord <ExternalLink size={13} />
    </a>
  </div>
);
