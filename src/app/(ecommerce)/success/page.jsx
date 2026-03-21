// app/(ecommerce)/success/page.jsx
"use client";
import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { setCart } from "@/redux/slice/cartSlice";
import Link from "next/link";
import {
  CheckCircle, Copy, Check, ExternalLink,
  Package, MessageCircle, BookOpen, Loader2
} from "lucide-react";

const ACCENT = "#06b6d4";

export default function SuccessPage() {
  const searchParams = useSearchParams();
  const router       = useRouter();
  const dispatch     = useDispatch();

  const [loading,   setLoading]   = useState(true);
  const [orderData, setOrderData] = useState(null);
  const [error,     setError]     = useState(null);
  const [copied,    setCopied]    = useState({});

  useEffect(() => {
    dispatch(setCart([]));

    const raw = searchParams.get("data");
    if (raw) {
      try {
        const parsed = JSON.parse(decodeURIComponent(raw));
        setOrderData(parsed);
        setLoading(false);
        return;
      } catch {}
    }

    setOrderData({ generic: true });
    setLoading(false);
  }, []);

  const copyKey = (key, id) => {
    navigator.clipboard.writeText(key);
    setCopied(prev => ({ ...prev, [id]: true }));
    setTimeout(() => setCopied(prev => ({ ...prev, [id]: false })), 2000);
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <Loader2 size={32} className="text-cyan-400 animate-spin" />
    </div>
  );

  if (orderData?.generic) return <GenericSuccess />;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-20 pt-32">
      <div className="w-full max-w-lg">

        {/* Success header */}
        <div className="text-center mb-8">
          <div className="mx-auto mb-5 w-20 h-20 rounded-full flex items-center justify-center"
            style={{
              background: "radial-gradient(circle, rgba(74,222,128,0.3) 0%, rgba(74,222,128,0.05) 100%)",
              border: "2px solid rgba(74,222,128,0.5)",
              boxShadow: "0 0 40px rgba(74,222,128,0.3)"
            }}>
            <CheckCircle size={36} className="text-green-400" />
          </div>
          <h1 className="text-white font-extrabold text-3xl mb-2">¡Pago Exitoso!</h1>
          <p className="text-white/50 text-sm">
            Tu compra ha sido procesada. Revisa tu email para más detalles.
          </p>
          {orderData?.orderId && (
            <p className="text-white/25 text-xs mt-2 font-mono">
              Order #{orderData.orderId.slice(-8).toUpperCase()}
            </p>
          )}
        </div>

        {/* Products */}
        {orderData?.products?.map((product, i) => (
          <div key={i} className="mb-4 bg-white/[0.04] border border-white/10 rounded-2xl overflow-hidden">

            {/* Product header */}
            <div className="px-5 py-4 border-b border-white/8 flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center"
                style={{ background: `${ACCENT}20`, border: `1px solid ${ACCENT}30` }}>
                <Package size={16} style={{ color: ACCENT }} />
              </div>
              <div>
                <p className="text-white font-bold text-sm">{product.productName}</p>
                <p className="text-white/40 text-xs">{product.planLabel}</p>
              </div>
            </div>

            {/* License key */}
            {product.licenseKey ? (
              <div className="p-5">
                <p className="text-white/40 text-xs font-bold uppercase tracking-widest mb-3">
                  🔑 Tu Licencia
                </p>
                <div className="bg-white/5 border border-white/10 rounded-xl p-4 flex items-center gap-3">
                  <p className="text-white font-mono text-sm flex-1 break-all leading-relaxed">
                    {product.licenseKey}
                  </p>
                  <button
                    onClick={() => copyKey(product.licenseKey, i)}
                    className="shrink-0 w-9 h-9 rounded-lg flex items-center justify-center transition-all"
                    style={{
                      background: copied[i] ? "rgba(74,222,128,0.15)" : `${ACCENT}20`,
                      border: `1px solid ${copied[i] ? "rgba(74,222,128,0.4)" : `${ACCENT}30`}`
                    }}
                  >
                    {copied[i]
                      ? <Check size={15} className="text-green-400" />
                      : <Copy size={15} style={{ color: ACCENT }} />
                    }
                  </button>
                </div>
                <p className="text-white/30 text-xs mt-2">
                  Esta clave también fue enviada a tu email.
                </p>
              </div>
            ) : (
              <div className="p-5">
                <div className="bg-blue-500/8 border border-blue-500/20 rounded-xl px-4 py-3 flex gap-3">
                  <MessageCircle size={15} className="text-blue-400 shrink-0 mt-0.5" />
                  <p className="text-blue-300/80 text-sm">
                    Un miembro del equipo te contactará por Discord para entregarte este producto.
                  </p>
                </div>
              </div>
            )}
          </div>
        ))}

        {/* Email notice */}
        {orderData?.email && (
          <div className="mb-4 bg-white/[0.02] border border-white/8 rounded-xl px-4 py-3 flex gap-2.5 items-center">
            <span className="text-white/40 text-sm">📧</span>
            <p className="text-white/40 text-sm">
              Resumen enviado a <span className="text-white/70 font-medium">{orderData.email}</span>
            </p>
          </div>
        )}

        {/* Actions */}
        {(() => {
          const TUTORIAL_MAP = {
            "Panel Full":        "panel-full",
            "Panel Secure":      "panel-secure",
            "Panel Only Aimbot": "panel-only-aimbot",
            "Menu Chams ESP":    "menu-chams-esp",
          };
          const firstProduct  = orderData?.products?.[0]?.productName;
          const tutorialSlug  = TUTORIAL_MAP[firstProduct];
          const tutorialUrl   = tutorialSlug ? `/tutorial/${tutorialSlug}` : "/tutorial";

          return (
            <div className="flex flex-col gap-3">
              <Link
                href={tutorialUrl}
                className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl font-bold text-sm text-white transition-all"
                style={{
                  background: "linear-gradient(135deg, #3b82f6, #06b6d4)",
                  boxShadow: "0 4px 20px rgba(59,130,246,0.35)"
                }}
              >
                <BookOpen size={16} /> Ver Tutorial de Instalación
              </Link>

              <a
                href="https://discord.com/invite/hypervgg"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl font-bold text-sm transition-all"
                style={{
                  background: "rgba(88,101,242,0.15)",
                  border: "1px solid rgba(88,101,242,0.35)",
                  color: "#8b96f8"
                }}
              >
                <MessageCircle size={16} /> Unirse al Discord
              </a>

              <Link
                href="/products"
                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl font-semibold text-sm text-white/50 hover:text-white bg-white/5 border border-white/10 transition-all"
              >
                Seguir comprando →
              </Link>
            </div>
          );
        })()}

        <p className="text-center text-white/20 text-xs mt-6">
          © 2026 HyperV Community
        </p>
      </div>
    </div>
  );
}

// Pantalla genérica si no hay datos
function GenericSuccess() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-20">
      <div className="w-full max-w-sm text-center">
        <div className="mx-auto mb-5 w-20 h-20 rounded-full flex items-center justify-center"
          style={{ background: "rgba(74,222,128,0.15)", border: "2px solid rgba(74,222,128,0.4)" }}>
          <CheckCircle size={36} className="text-green-400" />
        </div>
        <h1 className="text-white font-extrabold text-3xl mb-3">¡Pago Exitoso!</h1>
        <p className="text-white/50 text-sm mb-8 leading-relaxed">
          Tu pago fue procesado correctamente. Revisa tu email para encontrar tu licencia.
        </p>
        <a href="https://discord.com/invite/hypervgg" target="_blank" rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm text-white bg-[#5865F2] hover:bg-[#4752c4] transition-colors">
          <MessageCircle size={15} /> Ir al Discord
        </a>
      </div>
    </div>
  );
}
