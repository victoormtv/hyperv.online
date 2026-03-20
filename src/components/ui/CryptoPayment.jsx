"use client";
import { useState, useEffect } from "react";
import { Check, Clock, Copy, ExternalLink, Loader2 } from "lucide-react";
import QRCode from "react-qr-code";

const CRYPTO_COLORS = {
  USDT: "#26A17B", BTC: "#F7931A", ETH: "#627EEA",
  BNB:  "#F0B90B", LTC: "#BFBBBB", TRX: "#EF0027",
  DOGE: "#C2A633", USDC: "#2775CA",
};

const CRYPTO_ICONS = {
  USDT: "₮", BTC: "₿", ETH: "Ξ",
  BNB: "B", LTC: "Ł", TRX: "T", DOGE: "D", USDC: "$",
};

// Countdown timer
const useCountdown = (expireAt) => {
  const [remaining, setRemaining] = useState("");

  useEffect(() => {
    if (!expireAt) return;
    const tick = () => {
      const diff = new Date(expireAt * 1000) - Date.now();
      if (diff <= 0) { setRemaining("Expirado"); return; }
      const m = Math.floor(diff / 60000);
      const s = Math.floor((diff % 60000) / 1000);
      setRemaining(`${m}:${String(s).padStart(2, "0")}`);
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [expireAt]);

  return remaining;
};

export default function CryptoPayment({ paymentData, onCancel }) {
  const { walletAddress, cryptoAmount, currency, orderId, expireAt, qrCode, checkoutUrl } = paymentData;
  const [copiedAddr,   setCopiedAddr]   = useState(false);
  const [copiedAmount, setCopiedAmount] = useState(false);
  const countdown = useCountdown(expireAt);
  const color = CRYPTO_COLORS[currency] || "#06b6d4";

  const copyAddr = () => {
    navigator.clipboard.writeText(walletAddress);
    setCopiedAddr(true);
    setTimeout(() => setCopiedAddr(false), 2000);
  };

  const copyAmount = () => {
    navigator.clipboard.writeText(cryptoAmount);
    setCopiedAmount(true);
    setTimeout(() => setCopiedAmount(false), 2000);
  };

  // Si Plisio no devolvió wallet (raro), fallback al link externo
  if (!walletAddress) {
    window.location.href = checkoutUrl;
    return null;
  }

  return (
    <div className="bg-white/[0.03] border border-white/10 rounded-2xl overflow-hidden">

      {/* Header */}
      <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-yellow-400 animate-pulse" />
          <span className="text-white/70 text-sm font-semibold">Awaiting Payment</span>
        </div>
        <div className="flex items-center gap-1.5 text-white/50 text-sm">
          <Clock size={13} />
          <span className="font-mono">{countdown}</span>
        </div>
      </div>

      <div className="p-6 flex flex-col items-center gap-5">

        {/* QR Code */}
        <div className="p-4 bg-white rounded-2xl">
          {qrCode
            ? <img src={`data:image/png;base64,${qrCode}`} alt="QR" className="w-44 h-44" />
            : <QRCode value={walletAddress} size={176} />
          }
        </div>

        <p className="text-white/40 text-xs">Escanea con tu wallet</p>

        {/* Amount */}
        <div className="w-full rounded-xl border flex items-center justify-between px-4 py-3"
          style={{ borderColor: `${color}40`, background: `${color}0f` }}>
          <div>
            <p className="text-white/40 text-[10px] uppercase tracking-widest mb-0.5">Monto exacto</p>
            <p className="text-white font-extrabold text-lg font-mono">
              {cryptoAmount} <span style={{ color }}>{currency}</span>
            </p>
          </div>
          <button onClick={copyAmount}
            className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg transition-all"
            style={{ background: `${color}20`, color }}>
            {copiedAmount ? <><Check size={12} /> Copiado</> : <><Copy size={12} /> Copiar</>}
          </button>
        </div>

        {/* Wallet address */}
        <div className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3">
          <p className="text-white/40 text-[10px] uppercase tracking-widest mb-1">Dirección</p>
          <div className="flex items-center gap-2">
            <p className="text-white/70 text-xs font-mono flex-1 truncate">{walletAddress}</p>
            <button onClick={copyAddr}
              className="shrink-0 text-white/40 hover:text-white transition-colors">
              {copiedAddr ? <Check size={14} className="text-green-400" /> : <Copy size={14} />}
            </button>
          </div>
        </div>

        {/* Info */}
        <div className="w-full rounded-xl border border-white/8 bg-white/[0.02] px-4 py-3 flex flex-col gap-2">
          <div className="flex items-start gap-2 text-white/40 text-xs">
            <span className="text-yellow-400 shrink-0 mt-0.5">⚠</span>
            Envía el monto exacto para que el pago sea procesado.
          </div>
          <div className="flex items-start gap-2 text-white/40 text-xs">
            <span className="text-green-400 shrink-0 mt-0.5">✓</span>
            El pago se confirma automáticamente en la blockchain.
          </div>
          <div className="flex items-start gap-2 text-white/40 text-xs">
            <span className="text-blue-400 shrink-0 mt-0.5">✉</span>
            Tu licencia llegará al email tras la confirmación.
          </div>
        </div>

        {/* Order ID + external link */}
        <div className="w-full flex items-center justify-between text-white/25 text-xs">
          <span>Order #{orderId?.slice(-8)}</span>
          <a href={checkoutUrl} target="_blank" rel="noopener noreferrer"
            className="flex items-center gap-1 hover:text-white/50 transition-colors">
            Ver en Plisio <ExternalLink size={11} />
          </a>
        </div>

        {/* Cancel */}
        <button onClick={onCancel}
          className="w-full py-2.5 rounded-xl border border-red-500/30 bg-red-500/8 text-red-400 text-sm font-semibold hover:bg-red-500/15 transition-colors">
          Cancelar Pago
        </button>
      </div>
    </div>
  );
}
