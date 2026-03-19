"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import { setCart } from "@/redux/slice/cartSlice";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { siMercadopago, siPaypal, siBinance } from "simple-icons";
import { initMercadoPago, Wallet } from "@mercadopago/sdk-react";

const SI = ({ icon, size = 24, color }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill={color}
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d={icon.path} />
  </svg>
);

const loadPayPalScript = (clientId) =>
  new Promise((resolve, reject) => {
    if (typeof window === "undefined") {
      return reject(new Error("Window no disponible"));
    }

    if (window.paypal) return resolve(window.paypal);

    const existing = document.getElementById("paypal-sdk");
    if (existing) {
      existing.addEventListener("load", () => resolve(window.paypal));
      existing.addEventListener("error", () =>
        reject(new Error("No se pudo cargar el SDK de PayPal"))
      );
      return;
    }

    const s = document.createElement("script");
    s.id = "paypal-sdk";
    s.src = `https://www.paypal.com/sdk/js?client-id=${clientId}&currency=USD`;
    s.async = true;
    s.onload = () => resolve(window.paypal);
    s.onerror = () => reject(new Error("No se pudo cargar el SDK de PayPal"));
    document.body.appendChild(s);
  });

const PAYMENT_METHODS = [
  {
    id: "mercadopago",
    label: "Mercado Pago",
    sub: "Tarjeta / Transferencia",
    icon: siMercadopago,
    color: "#00b1ea",
  },
  {
    id: "paypal",
    label: "PayPal",
    sub: "PayPal Balance / Card",
    icon: siPaypal,
    color: "#003087",
  },
  {
    id: "binance",
    label: "Binance Pay",
    sub: "Crypto",
    icon: siBinance,
    color: "#F0B90B",
  },
];

export default function CheckoutPage() {
  const authState = useSelector((s) => s.auth);
  const cart = authState?.cart || [];
  const dispatch = useDispatch();
  const { t } = useLanguage();

  const [mounted, setMounted] = useState(false);
  const [email, setEmail] = useState("");
  const [method, setMethod] = useState("mercadopago");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [mpPreferenceId, setMpPreferenceId] = useState(null);

  useEffect(() => {
    setMounted(true);

    if (process.env.NEXT_PUBLIC_MP_PUBLIC_KEY) {
      initMercadoPago(process.env.NEXT_PUBLIC_MP_PUBLIC_KEY);
    }
  }, []);

  const safeCart = useMemo(() => {
    return (cart || []).map((item) => ({
      ...item,
      quantity: Number(item?.quantity) || 1,
      product: {
        ...item?.product,
        name: item?.product?.name || "Producto",
        price: Number(item?.product?.price) || 0,
        plans: item?.product?.plans || [],
      },
    }));
  }, [cart]);

  const total = useMemo(() => {
    return safeCart.reduce((sum, i) => sum + i.product.price * i.quantity, 0);
  }, [safeCart]);

  if (!mounted) return null;

  const validateCheckout = () => {
    if (!email || !email.includes("@")) {
      setError("Ingresa un email válido.");
      return false;
    }

    if (safeCart.length === 0) {
      setError("Tu carrito está vacío.");
      return false;
    }

    return true;
  };

  const handleMercadoPago = async () => {
    if (!validateCheckout()) return;
    setLoading(true);
    setError("");
    setMpPreferenceId(null);

    const newWindow = window.open("", "_blank");

    try {
      const res = await fetch("/api/checkout/mercadopago", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cart: safeCart, email }),
      });

      const data = await res.json();

      if (!res.ok) {
        newWindow?.close();
        throw new Error(data?.error || "Error al crear preferencia de pago.");
      }

      if (data?.init_point) {
        if (newWindow) newWindow.location.href = data.init_point; // ← CAMBIA
        else window.location.href = data.init_point;
      } else if (data?.preferenceId) {
        newWindow?.close();
        setMpPreferenceId(data.preferenceId);
      } else {
        newWindow?.close();
        throw new Error("Mercado Pago no devolvió URL de pago.");
      }
    } catch (err) {
      newWindow?.close();
      setError(err?.message || "Error de conexión con Mercado Pago.");
    } finally {
      setLoading(false);
    }
  };

  const handlePayPal = async () => {
    if (!validateCheckout()) return;

    setLoading(true);
    setError("");

    try {
      if (!process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID) {
        throw new Error("Falta NEXT_PUBLIC_PAYPAL_CLIENT_ID");
      }

      await loadPayPalScript(process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID);

      const container = document.getElementById("paypal-button-container");
      if (!container) {
        throw new Error("No se encontró el contenedor de PayPal.");
      }

      container.innerHTML = "";

      await window.paypal
        .Buttons({
          style: {
            layout: "vertical",
            color: "blue",
            shape: "rect",
            label: "pay",
          },

          createOrder: async () => {
            const res = await fetch("/api/checkout/paypal/create", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ cart: safeCart, email }),
            });

            if (!res.ok) {
              const text = await res.text();
              throw new Error(text || "Error al crear la orden PayPal.");
            }

            const data = await res.json();

            if (!data?.orderID) {
              throw new Error("El backend no devolvió orderID.");
            }

            return data.orderID;
          },

          onApprove: async (data) => {
            const res = await fetch("/api/checkout/paypal/capture", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ orderID: data.orderID }),
            });

            if (!res.ok) {
              const text = await res.text();
              throw new Error(text || "Error al capturar el pago.");
            }

            const capture = await res.json();

            if (capture?.status !== "COMPLETED") {
              throw new Error("No se pudo capturar el pago.");
            }

            dispatch(setCart([]));
            window.location.href = "/success";
          },

          onCancel: () => {
            setError("El pago con PayPal fue cancelado.");
          },

          onError: (err) => {
            console.error("PayPal SDK error:", err);
            setError("Error en el pago con PayPal.");
          },
        })
        .render("#paypal-button-container");
    } catch (err) {
      console.error("handlePayPal error:", err);
      setError(err?.message || "Error al cargar PayPal.");
    } finally {
      setLoading(false);
    }
  };

  const handleBinance = async () => {
    if (!validateCheckout()) return;
    setLoading(true);
    setError("");

    const newWindow = window.open("", "_blank");

    try {
      const res = await fetch("/api/checkout/binance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cart: safeCart, email }),
      });
      const data = await res.json();

      if (!res.ok) {
        newWindow?.close();
        throw new Error(data?.error || "Error al crear orden en Binance Pay.");
      }

      if (!data?.checkoutUrl) {
        newWindow?.close();
        throw new Error("Binance no devolvió checkoutUrl.");
      }

      if (newWindow) newWindow.location.href = data.checkoutUrl;
      else window.location.href = data.checkoutUrl;
    } catch (err) {
      newWindow?.close();
      setError(err?.message || "Error de conexión con Binance Pay.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = () => {
    if (method === "mercadopago") handleMercadoPago();
    else if (method === "paypal") handlePayPal();
    else if (method === "binance") handleBinance();
  };

  return (
    <div className="min-h-screen text-white flex flex-col items-center justify-start pt-44 md:pt-48 px-4 pb-20">
      <div className="w-full max-w-2xl pt-6">
        <Link
          href="/products"
          className="inline-flex items-center gap-2 text-white/50 hover:text-white text-sm mb-8 transition-colors"
        >
          <ArrowLeft size={16} /> Back to Store
        </Link>

        <h1 className="text-4xl font-extrabold text-white mb-8">Checkout</h1>

        <div className="bg-white/[0.04] border border-white/10 rounded-2xl px-6 py-5 mb-6">
          {safeCart.map((item, i) => (
            <div key={i}>
              <div className="flex items-center justify-between py-3">
                <div>
                  <p className="text-white font-bold text-sm uppercase tracking-wide">
                    {item.product.name}
                  </p>
                  <p className="text-white/40 text-xs mt-0.5">
                    {item.product.plans?.[0]?.label ?? "Standard"} × {item.quantity}
                  </p>
                </div>

                <span className="text-cyan-400 font-bold">
                  ${(item.product.price * item.quantity).toFixed(2)}
                </span>
              </div>

              {i < safeCart.length - 1 && <div className="h-px bg-white/5" />}
            </div>
          ))}

          <div className="h-px bg-white/10 my-3" />

          <div className="flex items-center justify-between">
            <span className="text-white font-extrabold text-lg">Total</span>
            <span className="text-white font-extrabold text-2xl">
              ${total.toFixed(2)}
            </span>
          </div>
        </div>

        <div className="bg-white/[0.04] border border-white/10 rounded-2xl px-6 py-6 flex flex-col gap-6">
          <div>
            <label className="text-white font-semibold text-sm mb-2 block">
              Email Address
            </label>

            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your.email@example.com"
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm placeholder-white/25 outline-none focus:border-cyan-500/50 transition-colors"
            />

            <p className="text-white/30 text-xs mt-2">
              You'll receive your purchase details and license keys at this email.
            </p>
          </div>

          <div>
            <label className="text-white font-semibold text-sm mb-3 block">
              Payment Method
            </label>

            <div className="grid grid-cols-3 gap-3">
              {PAYMENT_METHODS.map((m) => (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => {
                    setMethod(m.id);
                    setError("");
                    if (m.id !== "paypal") {
                      const container = document.getElementById("paypal-button-container");
                      if (container) container.innerHTML = "";
                    }
                  }}
                  className={`flex flex-col items-center gap-3 p-4 rounded-xl border transition-all duration-200 ${
                    method === m.id
                      ? "border-cyan-500/60 bg-cyan-500/10 shadow-[0_0_16px_rgba(34,211,238,0.15)]"
                      : "border-white/10 bg-white/5 hover:border-white/20"
                  }`}
                >
                  <div
                    className="w-11 h-11 rounded-full flex items-center justify-center"
                    style={{ background: `${m.color}22`, border: `1px solid ${m.color}44` }}
                  >
                    <SI icon={m.icon} size={22} color={m.color} />
                  </div>

                  <div className="text-center">
                    <p
                      className={`text-xs font-bold ${
                        method === m.id ? "text-white" : "text-white/70"
                      }`}
                    >
                      {m.label}
                    </p>
                    <p className="text-white/30 text-[10px]">{m.sub}</p>
                  </div>
                </button>
              ))}
            </div>

            {method === "paypal" && (
              <div id="paypal-button-container" className="mt-4" />
            )}

            {method === "mercadopago" && mpPreferenceId && (
              <div className="mt-4">
                <Wallet
                  initialization={{
                    preferenceId: mpPreferenceId,
                    redirectMode: "blank",
                  }}
                />
              </div>
            )}

            <p className="text-white/30 text-xs mt-3">
              Secure payment. Prices in USD.
            </p>

            <p className="text-white/30 text-xs mt-1">
              Can't find your payment method? Open a ticket on our{" "}
              <a
                href="https://discord.com/invite/hypervgg"
                target="_blank"
                rel="noopener noreferrer"
                className="text-cyan-400 hover:text-cyan-300 transition-colors"
              >
                Discord
              </a>
            </p>
          </div>

          <p className="text-white/25 text-xs border border-white/5 rounded-lg px-4 py-3 bg-white/[0.02]">
            By proceeding, you agree to our{" "}
            <Link
              href="/terms"
              className="text-cyan-400 hover:text-cyan-300 transition-colors"
            >
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link
              href="/terms"
              className="text-cyan-400 hover:text-cyan-300 transition-colors"
            >
              Privacy Policy
            </Link>.
          </p>

          {error && (
            <div className="bg-red-500/10 border border-red-500/30 rounded-xl px-4 py-3 text-red-400 text-sm">
              {error}
            </div>
          )}

          <button
            onClick={handleSubmit}
            disabled={loading}
            style={{
              width: "100%",
              padding: "1.125rem",
              background: loading
                ? "rgba(34,211,238,0.3)"
                : "linear-gradient(135deg, #3b82f6, #06b6d4)",
              color: "#fff",
              border: "none",
              borderRadius: "14px",
              fontSize: "1rem",
              fontWeight: 700,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              cursor: loading ? "not-allowed" : "pointer",
              transition: "all 0.3s ease",
              boxShadow: loading
                ? "none"
                : "0 4px 25px rgba(59,130,246,0.5), 0 0 40px rgba(59,130,246,0.2)",
              position: "relative",
              overflow: "hidden",
            }}
          >
            {loading ? "Procesando..." : "Continuar al Pago"}
          </button>
        </div>
      </div>
    </div>
  );
}