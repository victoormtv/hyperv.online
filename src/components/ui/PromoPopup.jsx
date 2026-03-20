"use client";
import { useState, useEffect } from "react";
import { X, Tag } from "lucide-react";

const PromoPopup = () => {
  const [visible, setVisible] = useState(false);
  const [copied,  setCopied]  = useState(false);

  useEffect(() => {
    // No mostrar si ya fue cerrado en esta sesión
    if (sessionStorage.getItem("promoPopupClosed")) return;
    const timer = setTimeout(() => setVisible(true), 3000);
    return () => clearTimeout(timer);
  }, []);

  // Bloquear scroll del body mientras el popup está abierto
  useEffect(() => {
    if (visible) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [visible]);

  const close = () => {
    setVisible(false);
    sessionStorage.setItem("promoPopupClosed", "1");
  };

  const copy = () => {
    navigator.clipboard.writeText("HYPERV10");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!visible) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-[99998] bg-black/60"
        style={{ backdropFilter: "blur(6px)" }}
        onClick={close}
      />

      {/* Popup */}
      <div
        className="fixed z-[99999] left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-sm mx-4"
        style={{ animation: "popupIn 0.35s cubic-bezier(0.16, 1, 0.3, 1)" }}
      >
        <div className="relative bg-[#0d1117] border border-white/10 rounded-3xl p-8 text-center shadow-2xl overflow-hidden">

          {/* Glow background */}
          <div className="absolute inset-0 pointer-events-none" style={{
            background: "radial-gradient(ellipse at 50% 0%, rgba(6,182,212,0.12) 0%, transparent 70%)"
          }} />

          {/* Close */}
          <button
            onClick={close}
            className="absolute top-4 right-4 w-7 h-7 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-white/40 hover:text-white transition-colors"
          >
            <X size={14} />
          </button>

          {/* Icon */}
          <div className="mx-auto mb-5 w-16 h-16 rounded-2xl flex items-center justify-center"
            style={{
              background: "linear-gradient(135deg, rgba(6,182,212,0.2), rgba(59,130,246,0.2))",
              border: "1px solid rgba(6,182,212,0.3)",
              boxShadow: "0 0 30px rgba(6,182,212,0.2)"
            }}>
            <Tag size={28} className="text-cyan-400" />
          </div>

          {/* Title */}
          <h2 className="text-white font-extrabold text-2xl mb-2">
            10% OFF
          </h2>
          <p className="text-white/50 text-sm mb-6 leading-relaxed">
            Obtén un 10% de descuento en todos nuestros productos
          </p>

          {/* Coupon box */}
          <button
            onClick={copy}
            className="w-full rounded-2xl border-2 border-dashed px-6 py-4 transition-all duration-200 group"
            style={{
              borderColor: copied ? "rgba(74,222,128,0.6)" : "rgba(6,182,212,0.4)",
              background:  copied ? "rgba(74,222,128,0.08)" : "rgba(6,182,212,0.06)",
            }}
          >
            <p className="text-white/40 text-[10px] font-bold uppercase tracking-widest mb-1">
              {copied ? "¡Copiado!" : "Usa el código:"}
            </p>
            <p className="text-white font-extrabold text-2xl tracking-[0.15em]">
              HYPERV10
            </p>
            <p className="text-cyan-400/60 text-xs mt-1.5 group-hover:text-cyan-400 transition-colors">
              {copied ? "✓ Pegalo en el checkout" : "Click para copiar"}
            </p>
          </button>

          {/* CTA */}
          <a
            href="/products"
            onClick={close}
            className="mt-4 w-full flex items-center justify-center py-3.5 rounded-xl font-bold text-sm text-white transition-all"
            style={{
              background: "linear-gradient(135deg, #3b82f6, #06b6d4)",
              boxShadow: "0 4px 20px rgba(59,130,246,0.4)"
            }}
          >
            Ver Productos →
          </a>
        </div>
      </div>

      <style>{`
        @keyframes popupIn {
          from { opacity: 0; transform: translate(-50%, -48%) scale(0.93); }
          to   { opacity: 1; transform: translate(-50%, -50%) scale(1); }
        }
      `}</style>
    </>
  );
};

export default PromoPopup;