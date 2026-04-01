"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import { setCart } from "@/redux/slice/cartSlice";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";
import { ArrowLeft, Tag, X, Check, Gift } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { siMercadopago, siPaypal } from "simple-icons";
import { initMercadoPago, Wallet } from "@mercadopago/sdk-react";
import PendingPaymentModal from "@/components/ui/PendingPaymentModal";
import { allCountries } from "country-telephone-data";

const SI = ({ icon, size = 24, color }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={color} xmlns="http://www.w3.org/2000/svg">
    <path d={icon.path} />
  </svg>
);

const loadPayPalScript = (clientId) =>
  new Promise((resolve, reject) => {
    if (typeof window === "undefined") return reject(new Error("Window no disponible"));
    if (window.paypal) return resolve(window.paypal);
    const existing = document.getElementById("paypal-sdk");
    if (existing) {
      existing.addEventListener("load", () => resolve(window.paypal));
      existing.addEventListener("error", () => reject(new Error("No se pudo cargar PayPal")));
      return;
    }
    const s = document.createElement("script");
    s.id = "paypal-sdk";
    s.src = `https://www.paypal.com/sdk/js?client-id=${clientId}&currency=USD`;
    s.async = true;
    s.onload = () => resolve(window.paypal);
    s.onerror = () => reject(new Error("No se pudo cargar PayPal"));
    document.body.appendChild(s);
  });

const COUPONS = {
  "CRYPTO20":  { discount: 0.20, label: "20% OFF", onlyMethod: "crypto" },
  "HYPERV10":  { discount: 0.10, label: "10% OFF", onlyMethod: null     },
  "HYPERV26":  { discount: 0.90, label: "90% OFF", onlyMethod: null     },
  "DISCORD15": { discount: 0.15, label: "15% OFF", onlyMethod: null     },
};

const CRYPTOS = [
  { id: "USDT", label: "USDT",     network: "TRC20/BEP20", color: "#26A17B", icon: "₮" },
  { id: "BTC",  label: "Bitcoin",  network: "BTC",         color: "#F7931A", icon: "₿" },
  { id: "ETH",  label: "Ethereum", network: "ERC20",       color: "#627EEA", icon: "Ξ" },
  { id: "BNB",  label: "BNB",      network: "BEP20",       color: "#F0B90B", icon: "B" },
  { id: "LTC",  label: "Litecoin", network: "LTC",         color: "#BFBBBB", icon: "Ł" },
  { id: "TRX",  label: "TRON",     network: "TRC20",       color: "#EF0027", icon: "T" },
  { id: "DOGE", label: "Dogecoin", network: "DOGE",        color: "#C2A633", icon: "D" },
  { id: "USDC", label: "USDC",     network: "ERC20",       color: "#2775CA", icon: "$" },
];

const PAYMENT_METHODS = [
  { id: "mercadopago", label: "Mercado Pago", sub: "Tarjeta / Transferencia", icon: siMercadopago, color: "#00b1ea" },
  { id: "paypal",      label: "PayPal",       sub: "PayPal Balance / Card",   icon: siPaypal,      color: "#003087" },
  { id: "crypto",      label: "Crypto",       sub: "USDT · BTC · ETH y más", icon: null,          color: "#F0B90B" },
];

const FREE_PRODUCTS = ["Panel Free", "Bypass Free"];

export default function CheckoutPage() {
  const authState = useSelector((s) => s.auth);
  const cart      = authState?.cart || [];
  const dispatch  = useDispatch();
  const { t }     = useLanguage();
  const c         = t.checkout;

  const searchParams = useSearchParams();
  const router       = useRouter();
  const [contactMethod,     setContactMethod]     = useState("");
  const [discordUser,       setDiscordUser]       = useState("");
  const [telegramUser,      setTelegramUser]      = useState("");
  const [whatsappCode,      setWhatsappCode]      = useState("+51");
  const [whatsappNumber,    setWhatsappNumber]    = useState("");
  const [mounted,           setMounted]           = useState(false);
  const [email,             setEmail]             = useState("");
  const [method,            setMethod]            = useState("mercadopago");
  const [cryptoCurrency,    setCryptoCurrency]    = useState("USDT");
  const [loading,           setLoading]           = useState(false);
  const [error,             setError]             = useState("");
  const [mpPreferenceId,    setMpPreferenceId]    = useState(null);
  const [cryptoPaymentData, setCryptoPaymentData] = useState(null);
  const [showPendingModal,  setShowPendingModal]  = useState(false);
  const [couponInput,       setCouponInput]       = useState("");
  const [appliedCoupon,     setAppliedCoupon]     = useState(null);
  const [couponError,       setCouponError]       = useState("");
  const [couponSuccess,     setCouponSuccess]     = useState("");

  const paymentActive    = !!(cryptoPaymentData || mpPreferenceId);
  const isRedirectingRef = React.useRef(false);

  useEffect(() => {
    if (!paymentActive) return;
    const handleBeforeUnload = (e) => {
      if (isRedirectingRef.current) return;
      e.preventDefault();
      e.returnValue = "";
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [paymentActive]);

  useEffect(() => {
    setMounted(true);
    if (process.env.NEXT_PUBLIC_MP_PUBLIC_KEY) initMercadoPago(process.env.NEXT_PUBLIC_MP_PUBLIC_KEY);
    const urlCoupon = searchParams?.get("coupon")?.toUpperCase();
    if (urlCoupon && COUPONS[urlCoupon]) {
      const found = COUPONS[urlCoupon];
      setAppliedCoupon({ code: urlCoupon, ...found });
      setCouponSuccess(`Cupón ${found.label} aplicado.`);
    }
  }, []);

  const safeCart = useMemo(() => {
    return (cart || []).map((item) => ({
      ...item,
      quantity: Number(item?.quantity) || 1,
      product: {
        ...item?.product,
        name:  item?.product?.name  || "Producto",
        price: Number(item?.product?.price) || 0,
        plans: item?.product?.plans || [],
      },
    }));
  }, [cart]);

  const subtotal = useMemo(() =>
    safeCart.reduce((sum, i) => sum + i.product.price * i.quantity, 0),
  [safeCart]);

  const isFreeCart = subtotal === 0 || safeCart.every(i => FREE_PRODUCTS.includes(i.product.name));

  const autoCryptoDiscount  = method === "crypto" ? 0.05 : 0;
  const couponDiscount      = appliedCoupon
    ? (appliedCoupon.onlyMethod && appliedCoupon.onlyMethod !== method ? 0 : appliedCoupon.discount)
    : 0;
  const finalDiscount       = Math.max(autoCryptoDiscount, couponDiscount);
  const discountAmount      = subtotal * finalDiscount;
  const total               = subtotal - discountAmount;
  const couponMethodMismatch = appliedCoupon?.onlyMethod && appliedCoupon.onlyMethod !== method;

  if (!mounted) return null;

  const applyCoupon = () => {
    setCouponError(""); setCouponSuccess("");
    const code  = couponInput.trim().toUpperCase();
    const found = COUPONS[code];
    if (!found) { setCouponError("Cupón inválido."); return; }
    setAppliedCoupon({ code, ...found });
    setCouponSuccess(`Cupón ${found.label} aplicado.`);
    setCouponInput("");
  };

  const removeCoupon = () => { setAppliedCoupon(null); setCouponError(""); setCouponSuccess(""); };

  const validateCheckout = () => {
    if (!email || !email.includes("@")) { setError("Ingresa un email válido."); return false; }
    if (safeCart.length === 0)           { setError("Tu carrito está vacío.");   return false; }
    return true;
  };

  const discountedCart = safeCart.map(i => ({
    ...i,
    product: {
      ...i.product,
      price:     +(i.product.price * (1 - finalDiscount)).toFixed(2),
      planLabel: i.product.planLabel || i.product.plans?.[0]?.label || "Mensual",
    },
  }));

  const processOrderAndRedirect = async () => {
    try {
      const res  = await fetch("/api/orders/process", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cart: discountedCart, email }),
      });
      const data = await res.json();
      isRedirectingRef.current = true;
      if (data?.success) {
        dispatch(setCart([]));
        const encoded = encodeURIComponent(JSON.stringify(data));
        window.location.href = `/success?data=${encoded}`;
      } else {
        dispatch(setCart([]));
        window.location.href = "/success";
      }
    } catch {
      isRedirectingRef.current = true;
      dispatch(setCart([]));
      window.location.href = "/success";
    }
  };

  const contactInfo = {
    method: contactMethod,
    ...(contactMethod === "discord"  && { discord:  discordUser }),
    ...(contactMethod === "telegram" && { telegram: telegramUser }),
    ...(contactMethod === "whatsapp" && { whatsapp: `${whatsappCode}${whatsappNumber}` }),
  };

  const handleMercadoPago = async () => {
    if (!validateCheckout()) return;
    setLoading(true); setError(""); setMpPreferenceId(null);
    try {
      const res  = await fetch("/api/checkout/mercadopago", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cart: discountedCart, email, contactInfo }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Error al crear preferencia.");
      if (data?.init_point) {
        isRedirectingRef.current = true;
        window.location.href = data.init_point;
      } else if (data?.preferenceId) {
        setMpPreferenceId(data.preferenceId);
        setLoading(false);
      } else throw new Error("Mercado Pago no devolvió URL de pago.");
    } catch (err) { setError(err?.message || "Error con Mercado Pago."); setLoading(false); }
  };

  const handlePayPal = async () => {
    if (!validateCheckout()) return;
    setLoading(true); setError("");
    try {
      if (!process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID) throw new Error("Falta NEXT_PUBLIC_PAYPAL_CLIENT_ID");
      await loadPayPalScript(process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID);
      const container = document.getElementById("paypal-button-container");
      if (!container) throw new Error("No se encontró contenedor PayPal.");
      container.innerHTML = "";
      await window.paypal.Buttons({
        style: { layout: "vertical", color: "blue", shape: "rect", label: "pay" },
        createOrder: async () => {
          const res  = await fetch("/api/checkout/paypal/create", {
            method: "POST", headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ cart: discountedCart, email, contactInfo }),
          });
          if (!res.ok) throw new Error(await res.text());
          const data = await res.json();
          if (!data?.orderID) throw new Error("Backend no devolvió orderID.");
          return data.orderID;
        },
        onApprove: async (data) => {
          const res     = await fetch("/api/checkout/paypal/capture", {
            method: "POST", headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ orderID: data.orderID }),
          });
          const capture = await res.json();
          if (capture?.status !== "COMPLETED") throw new Error("No se pudo capturar el pago.");
          await processOrderAndRedirect();
        },
        onCancel: () => setError("Pago con PayPal cancelado."),
        onError:  () => setError("Error en el pago con PayPal."),
      }).render("#paypal-button-container");
    } catch (err) { setError(err?.message || "Error al cargar PayPal."); }
    finally { setLoading(false); }
  };

  const handleCrypto = async () => {
    if (!validateCheckout()) return;
    setLoading(true); setError("");
    try {
      const res  = await fetch("/api/checkout/plisio", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cart: discountedCart, email, currency: cryptoCurrency, contactInfo }),
      });
      const data = await res.json();
      if (!res.ok || !data?.checkoutUrl) throw new Error(data?.error || "Error creando pago crypto.");
      setCryptoPaymentData({ checkoutUrl: data.checkoutUrl });
    } catch (err) { setError(err?.message || "Error de conexión con Plisio."); }
    finally { setLoading(false); }
  };

  const handleSubmit = () => {
    if (total === 0) {
      if (!validateCheckout()) return;
      setLoading(true);
      processOrderAndRedirect();
      return;
    }
    if (method === "mercadopago") handleMercadoPago();
    else if (method === "paypal") handlePayPal();
    else if (method === "crypto") handleCrypto();
  };

  // Button style: golden for free, blue for paid
  const submitBtnStyle = loading
    ? { background: "rgba(34,211,238,0.3)", boxShadow: "none" }
    : isFreeCart
      ? { background: "linear-gradient(135deg, #f59e0b, #fbbf24)", boxShadow: "0 4px 25px rgba(251,191,36,0.5), 0 0 40px rgba(251,191,36,0.2)" }
      : { background: "linear-gradient(135deg, #3b82f6, #06b6d4)", boxShadow: "0 4px 25px rgba(59,130,246,0.5), 0 0 40px rgba(59,130,246,0.2)" };

  const submitBtnLabel = loading
    ? c.processing
    : total === 0
      ? c.getFree
      : `${c.pay} $${total.toFixed(2)}`;

  return (
    <div className="min-h-screen text-white flex flex-col items-center justify-start pt-44 md:pt-48 px-4 pb-20">
      <div className="w-full max-w-2xl pt-6">

        {showPendingModal && (
          <PendingPaymentModal
            paymentData={{
              orderId:  cryptoPaymentData?.checkoutUrl?.split("/").pop(),
              total,
              products: safeCart.map(i => i.product.name).join(", "),
            }}
            onContinue={() => setShowPendingModal(false)}
            onCancel={() => {
              setCryptoPaymentData(null);
              setMpPreferenceId(null);
              setShowPendingModal(false);
              router.push("/products");
            }}
          />
        )}

        <button
          onClick={() => { if (paymentActive) { setShowPendingModal(true); return; } router.push("/products"); }}
          className="inline-flex items-center gap-2 text-white/50 hover:text-white text-sm mb-8 transition-colors"
        >
          <ArrowLeft size={16} /> {c.backToStore}
        </button>

        <h1 className="text-4xl font-extrabold text-white mb-8">{c.title}</h1>

        {/* Order summary */}
        <div className="bg-white/[0.04] border border-white/10 rounded-2xl px-6 py-5 mb-6">
          <p className="text-white/40 text-xs font-bold uppercase tracking-widest mb-3">{c.orderSummary}</p>
          {safeCart.map((item, i) => (
            <div key={i}>
              <div className="flex items-center justify-between py-3">
                <div>
                  <p className="text-white font-bold text-sm uppercase tracking-wide">{item.product.name}</p>
                  <p className="text-white/40 text-xs mt-0.5">{item.product.plans?.[0]?.label ?? "Standard"} × {item.quantity}</p>
                </div>
                <span className={item.product.price === 0 ? "text-yellow-400 font-extrabold" : "text-white/80 font-bold"}>
                  {item.product.price === 0 ? "FREE" : `$${(item.product.price * item.quantity).toFixed(2)}`}
                </span>
              </div>
              {i < safeCart.length - 1 && <div className="h-px bg-white/5" />}
            </div>
          ))}
          <div className="h-px bg-white/10 my-3" />
          <div className="flex items-center justify-between mb-2">
            <span className="text-white/50 text-sm">{c.subtotal}</span>
            <span className="text-white/70 text-sm">${subtotal.toFixed(2)}</span>
          </div>
          {method === "crypto" && !appliedCoupon && (
            <div className="flex items-center justify-between mb-2">
              <span className="text-green-400 text-sm flex items-center gap-1.5"><Tag size={13} /> {c.cryptoDiscount}</span>
              <span className="text-green-400 text-sm font-bold">-${(subtotal * 0.05).toFixed(2)}</span>
            </div>
          )}
          {appliedCoupon && !couponMethodMismatch && couponDiscount > 0 && (
            <div className="flex items-center justify-between mb-2">
              <span className="text-green-400 text-sm flex items-center gap-1.5"><Tag size={13} /> Cupón {appliedCoupon.code} ({appliedCoupon.label})</span>
              <span className="text-green-400 text-sm font-bold">-${discountAmount.toFixed(2)}</span>
            </div>
          )}
          {couponMethodMismatch && (
            <div className="flex items-center gap-2 mb-2 text-yellow-400/80 text-xs">
              <Tag size={12} /> {c.couponOnly} {appliedCoupon.onlyMethod}
            </div>
          )}
          <div className="h-px bg-white/10 my-3" />
          <div className="flex items-center justify-between">
            <span className="text-white font-extrabold text-lg">{c.total}</span>
            <div className="text-right">
              {finalDiscount > 0 && <p className="text-white/30 text-xs line-through">${subtotal.toFixed(2)}</p>}
              <span className={total === 0 ? "text-yellow-400 font-extrabold text-2xl" : "text-white font-extrabold text-2xl"}>
                {total === 0 ? "FREE" : `$${total.toFixed(2)}`}
              </span>
            </div>
          </div>
        </div>

        {/* Form */}
        <div className="bg-white/[0.04] border border-white/10 rounded-2xl px-6 py-6 flex flex-col gap-6">

          {/* Email */}
          <div>
            <label className="text-white font-semibold text-sm mb-2 block">{c.emailLabel}</label>
            <input
              type="email" value={email} onChange={(e) => setEmail(e.target.value)}
              placeholder={c.emailPlaceholder}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm placeholder-white/25 outline-none focus:border-cyan-500/50 transition-colors"
            />
            <p className="text-white/30 text-xs mt-2">{c.emailSub}</p>
          </div>

          {/* ── Medio de contacto ── */}
          <div>
            <label className="text-white font-semibold text-sm mb-2 block">
              ¿Por qué medio quieres que te contactemos?
            </label>
            <select
              value={contactMethod}
              onChange={(e) => setContactMethod(e.target.value)}
              className="w-full border border-white/10 rounded-xl px-4 py-3 text-sm outline-none focus:border-cyan-500/50 transition-colors appearance-none"
              style={{
                background: "rgba(255,255,255,0.05)",
                color: contactMethod === "" ? "rgba(255,255,255,0.25)" : "white", // 👈 esto
              }}
            >
              <option value="" style={{ background: "#0d0f14", color: "rgba(255,255,255,0.25)" }}>
                Selecciona un metodo de contacto...
              </option>
              <option value="discord"  style={{ background: "#0d0f14", color: "white" }}>Discord</option>
              <option value="telegram" style={{ background: "#0d0f14", color: "white" }}>Telegram</option>
              <option value="whatsapp" style={{ background: "#0d0f14", color: "white" }}>WhatsApp</option>
            </select>

            {/* Discord */}
            {contactMethod === "discord" && (
              <div className="mt-3">
                <label className="text-white/60 text-xs mb-1.5 block">Tu usuario de Discord</label>
                <input
                  type="text"
                  value={discordUser}
                  onChange={(e) => setDiscordUser(e.target.value)}
                  placeholder="ej: usuario#1234 o @usuario"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm placeholder-white/25 outline-none focus:border-cyan-500/50 transition-colors"
                />
              </div>
            )}

            {/* Telegram */}
            {contactMethod === "telegram" && (
              <div className="mt-3">
                <label className="text-white/60 text-xs mb-1.5 block">Tu @ de Telegram</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40 text-sm select-none">@</span>
                  <input
                    type="text"
                    value={telegramUser}
                    onChange={(e) => setTelegramUser(e.target.value.replace("@", ""))}
                    placeholder="tuusuario"
                    className="w-full bg-white/5 border border-white/10 rounded-xl pl-8 pr-4 py-3 text-white text-sm placeholder-white/25 outline-none focus:border-cyan-500/50 transition-colors"
                  />
                </div>
              </div>
            )}

            {/* WhatsApp */}
            {contactMethod === "whatsapp" && (
              <div className="mt-3 flex flex-col gap-2">
                <div>
                  <label className="text-white/60 text-xs mb-1.5 block">Código de país</label>
                  <select
                    value={whatsappCode}
                    onChange={(e) => setWhatsappCode(e.target.value)}
                    className="w-full border border-white/10 rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-cyan-500/50 transition-colors"
                    style={{ background: "rgba(255,255,255,0.05)" }}
                  >
                    {allCountries.map((country) => (
                      <option key={country.iso2} value={`+${country.dialCode}`} style={{ background: "#0d0f14" }}>
                        {country.name} (+{country.dialCode})
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-white/60 text-xs mb-1.5 block">Número de WhatsApp</label>
                  <div className="flex gap-2">
                    <span className="flex items-center px-3 bg-white/5 border border-white/10 rounded-xl text-white/60 text-sm select-none whitespace-nowrap">
                      {whatsappCode}
                    </span>
                    <input
                      type="tel"
                      value={whatsappNumber}
                      onChange={(e) => setWhatsappNumber(e.target.value.replace(/\D/g, ""))}
                      placeholder="987654321"
                      className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm placeholder-white/25 outline-none focus:border-cyan-500/50 transition-colors"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
          {/* ── Fin medio de contacto ── */}

          {/* Cupón */}
          <div>
            <label className="text-white font-semibold text-sm mb-2 block">{c.couponLabel}</label>
            {appliedCoupon ? (
              <div className="flex items-center gap-3 bg-green-500/10 border border-green-500/30 rounded-xl px-4 py-3">
                <Check size={16} className="text-green-400 shrink-0" />
                <span className="text-green-400 text-sm font-bold flex-1">{appliedCoupon.code} — {appliedCoupon.label}</span>
                <button onClick={removeCoupon} className="text-white/30 hover:text-white transition-colors"><X size={16} /></button>
              </div>
            ) : (
              <div className="flex gap-2">
                <input
                  type="text" value={couponInput}
                  onChange={(e) => { setCouponInput(e.target.value.toUpperCase()); setCouponError(""); }}
                  onKeyDown={(e) => e.key === "Enter" && applyCoupon()}
                  placeholder={c.couponPlaceholder}
                  className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm placeholder-white/25 outline-none focus:border-cyan-500/50 transition-colors uppercase"
                />
                <button
                  onClick={applyCoupon}
                  className="px-5 py-3 rounded-xl text-sm font-bold transition-all"
                  style={{ background: isFreeCart ? "linear-gradient(135deg, #f59e0b, #fbbf24)" : "linear-gradient(135deg, #3b82f6, #06b6d4)", color: isFreeCart ? "#000" : "#fff", position: "relative", overflow: "hidden", transition: "all 0.3s ease" }}
                  onMouseEnter={e => {
                    e.currentTarget.style.transform = "translateY(-2px)";
                    e.currentTarget.style.boxShadow = isFreeCart
                      ? "0 6px 25px rgba(251,191,36,0.65), 0 0 40px rgba(251,191,36,0.25)"
                      : "0 6px 25px rgba(59,130,246,0.65), 0 0 40px rgba(59,130,246,0.25)";
                    const s = e.currentTarget.querySelector(".shimmer-apply");
                    if (s) { s.style.transform = "translateX(200%) skewX(-20deg)"; s.style.opacity = "1"; }
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow = "none";
                    const s = e.currentTarget.querySelector(".shimmer-apply");
                    if (s) { s.style.transform = "translateX(-100%) skewX(-20deg)"; s.style.opacity = "0"; }
                  }}
                >
                  <span className="shimmer-apply" style={{ position:"absolute", top:0, left:"-60%", width:"50%", height:"100%", background:"linear-gradient(90deg,transparent,rgba(255,255,255,0.35),transparent)", transform:"translateX(-100%) skewX(-20deg)", opacity:0, transition:"transform 0.9s ease, opacity 0.1s ease", pointerEvents:"none" }} />
                  {c.couponApply}
                </button>
              </div>
            )}
            {couponError   && <p className="text-red-400 text-xs mt-2">{couponError}</p>}
            {couponSuccess && <p className="text-green-400 text-xs mt-2">{couponSuccess}</p>}
          </div>

          {/* Payment method — solo si total > 0 */}
          {total > 0 && (
            <div>
              <label className="text-white font-semibold text-sm mb-3 block">{c.paymentMethod}</label>
              <div className="grid grid-cols-3 gap-3">
                {PAYMENT_METHODS.map((m) => (
                  <button key={m.id} type="button"
                    onClick={() => {
                      setMethod(m.id); setError(""); setMpPreferenceId(null);
                      if (m.id !== "paypal") { const ct = document.getElementById("paypal-button-container"); if (ct) ct.innerHTML = ""; }
                    }}
                    className={`flex flex-col items-center gap-3 p-4 rounded-xl border transition-all duration-200 ${
                      method === m.id
                        ? "border-cyan-500/60 bg-cyan-500/10 shadow-[0_0_16px_rgba(34,211,238,0.15)]"
                        : "border-white/10 bg-white/5 hover:border-white/20"
                    }`}>
                    <div className="w-11 h-11 rounded-full flex items-center justify-center" style={{ background: `${m.color}22`, border: `1px solid ${m.color}44` }}>
                      {m.icon ? <SI icon={m.icon} size={22} color={m.color} /> : <span className="text-lg font-extrabold" style={{ color: m.color }}>₿</span>}
                    </div>
                    <div className="text-center">
                      <p className={`text-xs font-bold ${method === m.id ? "text-white" : "text-white/70"}`}>{m.label}</p>
                      <p className="text-white/30 text-[10px]">{m.sub}</p>
                    </div>
                  </button>
                ))}
              </div>

              {method === "paypal" && <div id="paypal-button-container" className="mt-4" />}

              {method === "mercadopago" && mpPreferenceId && (
                <div className="mt-4">
                  <Wallet initialization={{ preferenceId: mpPreferenceId, redirectMode: "self" }} />
                  <button onClick={() => setShowPendingModal(true)} className="mt-2 w-full py-2.5 rounded-xl border border-red-500/30 bg-red-500/8 text-red-400/60 hover:text-red-400 text-xs font-semibold transition-colors">
                    {c.cancelPayment}
                  </button>
                </div>
              )}

              {method === "crypto" && (
                <div className="mt-4">
                  <p className="text-white/50 text-xs font-semibold uppercase tracking-widest mb-3">{c.selectCrypto}</p>
                  <div className="grid grid-cols-4 gap-2">
                    {CRYPTOS.map((cr) => (
                      <button key={cr.id} type="button" onClick={() => setCryptoCurrency(cr.id)}
                        className={`flex flex-col items-center gap-1.5 p-2.5 rounded-xl border transition-all duration-200 ${cryptoCurrency === cr.id ? "border-white/30 bg-white/10" : "border-white/8 bg-white/5 hover:border-white/15"}`}>
                        <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-extrabold" style={{ background: `${cr.color}25`, border: `1px solid ${cr.color}50`, color: cr.color }}>{cr.icon}</div>
                        <p className={`text-[10px] font-bold ${cryptoCurrency === cr.id ? "text-white" : "text-white/60"}`}>{cr.label}</p>
                        <p className="text-white/30 text-[9px] leading-tight text-center">{cr.network}</p>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {method === "crypto" && cryptoPaymentData?.checkoutUrl && (
                <div className="mt-4 rounded-2xl overflow-hidden border border-white/10">
                  <iframe src={cryptoPaymentData.checkoutUrl} className="w-full" style={{ height: "580px", border: "none" }} allow="clipboard-write" />
                  <div className="flex items-center justify-between px-4 py-3 border-t border-white/10 bg-white/[0.02]">
                    <a href={cryptoPaymentData.checkoutUrl} target="_blank" rel="noopener noreferrer" className="text-white/40 hover:text-white text-xs flex items-center gap-1.5 transition-colors">{c.openNewTab}</a>
                    <button onClick={() => setShowPendingModal(true)} className="text-red-400/60 hover:text-red-400 text-xs transition-colors">{c.cancel}</button>
                  </div>
                </div>
              )}

              <p className="text-white/30 text-xs mt-3">{c.securePayment}</p>
              <p className="text-white/30 text-xs mt-1">
                {c.cantFind}{" "}
                <a href="https://discord.com/invite/hypervgg" target="_blank" rel="noopener noreferrer" className="text-cyan-400 hover:text-cyan-300 transition-colors">{c.discordTicket}</a>
              </p>
            </div>
          )}

          {/* Terms */}
          <p className="text-white/25 text-xs border border-white/5 rounded-lg px-4 py-3 bg-white/[0.02]">
            {c.terms}{" "}
            <Link href="/terms" className="text-cyan-400 hover:text-cyan-300 transition-colors">{c.termsLink}</Link>{" "}
            and{" "}
            <Link href="/terms" className="text-cyan-400 hover:text-cyan-300 transition-colors">{c.privacyLink}</Link>.
          </p>

          {error && <div className="bg-red-500/10 border border-red-500/30 rounded-xl px-4 py-3 text-red-400 text-sm">{error}</div>}

          <button
            onClick={handleSubmit}
            disabled={loading}
            style={{
              width: "100%", padding: "1.125rem",
              ...submitBtnStyle,
              color: isFreeCart ? "#000" : "#fff",
              border: "none", borderRadius: "14px",
              fontSize: "1rem", fontWeight: 800, letterSpacing: "0.08em", textTransform: "uppercase",
              cursor: loading ? "not-allowed" : "pointer", transition: "all 0.3s ease",
              position: "relative", overflow: "hidden",
            }}
            onMouseEnter={e => {
              if (loading) return;
              e.currentTarget.style.transform = "translateY(-3px)";
              e.currentTarget.style.boxShadow = isFreeCart
                ? "0 8px 35px rgba(251,191,36,0.75), 0 0 60px rgba(251,191,36,0.35)"
                : "0 8px 35px rgba(59,130,246,0.75), 0 0 60px rgba(59,130,246,0.35)";
              const s = e.currentTarget.querySelector(".shimmer-btn");
              if (s) { s.style.transform = "translateX(200%) skewX(-20deg)"; s.style.opacity = "1"; }
            }}
            onMouseLeave={e => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = isFreeCart
                ? "0 4px 25px rgba(251,191,36,0.5), 0 0 40px rgba(251,191,36,0.2)"
                : "0 4px 25px rgba(59,130,246,0.5), 0 0 40px rgba(59,130,246,0.2)";
              const s = e.currentTarget.querySelector(".shimmer-btn");
              if (s) { s.style.transform = "translateX(-100%) skewX(-20deg)"; s.style.opacity = "0"; }
            }}
          >
            <span className="shimmer-btn" style={{ position:"absolute", top:0, left:"-60%", width:"50%", height:"100%", background:"linear-gradient(90deg,transparent,rgba(255,255,255,0.35),transparent)", transform:"translateX(-100%) skewX(-20deg)", opacity:0, transition:"transform 0.9s ease, opacity 0.1s ease", pointerEvents:"none" }} />
            {total === 0 && !loading && <Gift size={16} style={{ display: "inline", marginRight: "8px", verticalAlign: "middle" }} />}
            {submitBtnLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
