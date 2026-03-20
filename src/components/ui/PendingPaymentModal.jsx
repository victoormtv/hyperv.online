"use client";
import { useEffect, useState } from "react";
import { AlertCircle } from "lucide-react";
import CancelPaymentModal from "@/components/ui/CancelPaymentModal";

export default function PendingPaymentModal({ paymentData, onContinue, onCancel }) {
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 z-[99998] bg-black/70" style={{ backdropFilter: "blur(8px)" }} />

      {/* Modal */}
      <div className="fixed inset-0 z-[99999] flex items-center justify-center px-4">
        <div className="w-full max-w-sm bg-[#0d1117] border border-white/10 rounded-3xl overflow-hidden shadow-2xl"
          style={{ animation: "popupIn 0.3s cubic-bezier(0.16, 1, 0.3, 1)" }}>

          <div className="p-7 flex flex-col items-center text-center">
            <div className="w-16 h-16 rounded-full flex items-center justify-center mb-5"
              style={{ background: "rgba(6,182,212,0.1)", border: "1px solid rgba(6,182,212,0.3)", boxShadow: "0 0 30px rgba(6,182,212,0.15)" }}>
              <AlertCircle size={28} className="text-cyan-400" />
            </div>

            <h2 className="text-white font-extrabold text-xl mb-2">Payment Pending</h2>
            <p className="text-white/40 text-sm mb-6">You have a pending payment that needs attention</p>

            <div className="w-full bg-white/[0.04] border border-white/8 rounded-2xl px-5 py-4 mb-5 text-left flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <span className="text-white/40 text-sm">Order ID:</span>
                <span className="text-white font-bold text-sm font-mono">
                  ORD-{paymentData?.orderId?.slice(-12)?.toUpperCase() || "PENDING"}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-white/40 text-sm">Amount:</span>
                <span className="text-white font-bold text-sm">${paymentData?.total?.toFixed(2)}</span>
              </div>
              {paymentData?.products && (
                <div className="flex items-center justify-between">
                  <span className="text-white/40 text-sm">Products:</span>
                  <span className="text-white font-bold text-sm uppercase tracking-wide truncate max-w-[160px]">
                    {paymentData.products}
                  </span>
                </div>
              )}
            </div>

            <button onClick={onContinue}
              className="w-full py-3.5 rounded-xl font-bold text-white text-sm mb-3 transition-all"
              style={{ background: "linear-gradient(135deg, #3b82f6, #06b6d4)", boxShadow: "0 4px 20px rgba(59,130,246,0.4)" }}>
              Continue Payment
            </button>

            <button
              onClick={() => setShowCancelConfirm(true)}
              className="w-full py-3.5 rounded-xl font-bold text-white/50 text-sm bg-white/5 border border-white/10 hover:bg-white/10 hover:text-white transition-all"
            >
              Cancel Payment
            </button>

            <p className="text-white/20 text-xs mt-4">You must choose an option above to continue using the site</p>
          </div>
        </div>
      </div>

      {/* Confirm cancel modal */}
      {showCancelConfirm && (
        <CancelPaymentModal
          onKeep={() => setShowCancelConfirm(false)}
          onConfirmCancel={onCancel}
        />
      )}

      <style>{`
        @keyframes popupIn {
          from { opacity: 0; transform: scale(0.93); }
          to   { opacity: 1; transform: scale(1); }
        }
      `}</style>
    </>
  );
}
