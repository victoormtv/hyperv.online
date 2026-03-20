"use client";
import { useEffect } from "react";
import { AlertTriangle, X } from "lucide-react";

export default function CancelPaymentModal({ onKeep, onConfirmCancel }) {
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 z-[99999] bg-black/70" style={{ backdropFilter: "blur(8px)" }} />

      {/* Modal */}
      <div className="fixed inset-0 z-[100000] flex items-center justify-center px-4">
        <div
          className="w-full max-w-sm bg-[#0d1117] border border-red-500/30 rounded-2xl overflow-hidden shadow-2xl"
          style={{ animation: "popupIn 0.25s cubic-bezier(0.16, 1, 0.3, 1)" }}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-5 py-4 border-b border-white/8">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-red-500/15 border border-red-500/30 flex items-center justify-center">
                <AlertTriangle size={18} className="text-red-400" />
              </div>
              <h2 className="text-white font-extrabold text-base">Cancel Payment?</h2>
            </div>
            <button
              onClick={onKeep}
              className="w-7 h-7 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-white/40 hover:text-white transition-colors"
            >
              <X size={14} />
            </button>
          </div>

          {/* Body */}
          <div className="px-5 py-5">
            <p className="text-white/60 text-sm leading-relaxed mb-4">
              Are you sure you want to cancel this payment? This action cannot be undone.
            </p>

            {/* Warning box */}
            <div className="flex items-start gap-2.5 bg-yellow-500/10 border border-yellow-500/25 rounded-xl px-4 py-3 mb-5">
              <AlertTriangle size={15} className="text-yellow-400 shrink-0 mt-0.5" />
              <p className="text-yellow-300/80 text-sm font-semibold">
                This action is permanent and cannot be undone.
              </p>
            </div>

            {/* Buttons */}
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={onKeep}
                className="py-3 rounded-xl font-bold text-sm text-white bg-white/8 border border-white/10 hover:bg-white/12 transition-all"
              >
                No, keep it
              </button>
              <button
                onClick={onConfirmCancel}
                className="py-3 rounded-xl font-bold text-sm text-white transition-all"
                style={{
                  background: "linear-gradient(135deg, #ef4444, #dc2626)",
                  boxShadow: "0 4px 15px rgba(239,68,68,0.35)"
                }}
              >
                Yes, cancel
              </button>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes popupIn {
          from { opacity: 0; transform: scale(0.95); }
          to   { opacity: 1; transform: scale(1); }
        }
      `}</style>
    </>
  );
}
