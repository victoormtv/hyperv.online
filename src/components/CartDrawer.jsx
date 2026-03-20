"use client";
import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { useDispatch, useSelector } from "react-redux";
import { setCart, setShowCartDrawer } from "@/redux/slice/cartSlice";
import { ShoppingCart, X, Tag, Check } from "lucide-react";
import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";

// Mismos cupones que en checkout.tsx
const COUPONS = {
  "CRYPTO20":  { discount: 0.05, label: "5% OFF",  onlyMethod: "crypto" },
  "HYPERV10":  { discount: 0.10, label: "10% OFF", onlyMethod: null     },
  "DISCORD15": { discount: 0.15, label: "15% OFF", onlyMethod: null     },
};

const CartDrawer = () => {
  const dispatch = useDispatch();
  const { cart, showCartDrawer } = useSelector((state) => state.auth);
  const { t } = useLanguage();
  const c = t.cart;

  const [mounted,        setMounted]        = useState(false);
  const [drawerVisible,  setDrawerVisible]  = useState(false);
  const [drawerClosing,  setDrawerClosing]  = useState(false);

  // ── Cupón ─────────────────────────────────────────
  const [couponInput,   setCouponInput]   = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [couponError,   setCouponError]   = useState("");

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    if (showCartDrawer) {
      setDrawerVisible(true);
      setDrawerClosing(false);
    }
  }, [showCartDrawer]);

  const closeDrawer = () => {
    setDrawerClosing(true);
    dispatch(setShowCartDrawer(false));
    setTimeout(() => {
      setDrawerVisible(false);
      setDrawerClosing(false);
    }, 280);
  };

  const subtotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  // Descuento por cupón (solo si no es exclusivo de crypto — en el drawer no sabemos el método)
  const couponDiscount = appliedCoupon && !appliedCoupon.onlyMethod
    ? appliedCoupon.discount
    : 0;
  const discountAmount = subtotal * couponDiscount;
  const total = subtotal - discountAmount;

  const applyCoupon = () => {
    setCouponError("");
    const code = couponInput.trim().toUpperCase();
    const found = COUPONS[code];
    if (!found) { setCouponError("Cupón inválido."); return; }
    if (found.onlyMethod === "crypto") {
      setCouponError("Este cupón solo aplica al pagar con Crypto en el checkout.");
      return;
    }
    setAppliedCoupon({ code, ...found });
    setCouponInput("");
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    setCouponError("");
  };

  if (!mounted || !drawerVisible) return null;

  return createPortal(
    <>
      {/* overlay */}
      <div
        className="fixed inset-0 bg-black/60"
        style={{ backdropFilter: "blur(12px)", zIndex: 99999 }}
        onClick={closeDrawer}
      />

      {/* drawer */}
      <div
        className="fixed top-0 right-0 h-full w-full bg-[#0d0f14] border-l border-white/10 flex flex-col shadow-2xl"
        style={{
          maxWidth: "460px",
          zIndex: 100000,
          animation: drawerClosing
            ? "slideOutRight 0.28s cubic-bezier(0.4, 0, 1, 1) forwards"
            : "slideInRight 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
        }}
      >
        {/* header */}
        <div className="flex items-center justify-between px-6 pt-6 pb-5 border-b border-white/5">
          <div>
            <h2 className="text-white font-extrabold" style={{ fontSize: "1.5rem" }}>{c.yourCart}</h2>
            <div className="h-0.5 w-8 bg-cyan-500 mt-1.5 rounded-full" />
          </div>
          <button onClick={closeDrawer} className="w-8 h-8 flex items-center justify-center rounded-lg bg-white/5 border border-white/10 text-white/50 hover:text-white transition-colors">
            <X size={16} />
          </button>
        </div>

        {/* items */}
        <div className="flex-1 overflow-y-auto hide-scrollbar px-6 py-4 flex flex-col gap-3">
          {cart.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-white/30">
              <ShoppingCart size={40} className="mb-3" />
              <p className="text-sm">{c.empty}</p>
            </div>
          ) : (
            cart.map((item, i) => (
              <div key={i} className="bg-white/5 border border-white/10 rounded-2xl px-4 py-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <p className="text-white font-extrabold text-sm uppercase tracking-wide">{item.product.name}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-cyan-400 font-bold text-base">${item.product.price}</span>
                      <span className="text-white/70 text-xs bg-white/10 border border-white/20 px-3 py-1 rounded-full font-semibold">
                        {item.product.plans?.[0]?.label ?? "Standard"}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <div className="flex items-center bg-white/5 border border-white/15 rounded-xl overflow-hidden">
                      <button
                        onClick={() => {
                          const updated = cart
                            .map((c, idx) => idx === i && c.quantity > 1 ? { ...c, quantity: c.quantity - 1 } : c)
                            .filter((c, idx) => idx !== i || c.quantity > 0);
                          dispatch(setCart(updated));
                        }}
                        className="w-8 h-8 text-white/60 hover:text-white hover:bg-white/10 transition-colors flex items-center justify-center font-bold"
                      >−</button>
                      <span className="text-white text-sm font-semibold px-3 border-x border-white/10">{item.quantity}</span>
                      <button
                        onClick={() => dispatch(setCart(cart.map((c, idx) => idx === i ? { ...c, quantity: c.quantity + 1 } : c)))}
                        className="w-8 h-8 text-white/60 hover:text-white hover:bg-white/10 transition-colors flex items-center justify-center font-bold"
                      >+</button>
                    </div>
                    <button
                      onClick={() => dispatch(setCart(cart.filter((_, idx) => idx !== i)))}
                      className="w-8 h-8 rounded-xl bg-red-500/15 border border-red-500/30 text-red-400 hover:bg-red-500/25 flex items-center justify-center transition-colors"
                    ><X size={12} /></button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* footer */}
        <div className="px-6 py-6 border-t border-white/5 flex flex-col gap-4">

          {/* ── Cupón ── */}
          {appliedCoupon ? (
            <div className="flex items-center gap-3 bg-green-500/10 border border-green-500/30 rounded-xl px-4 py-3">
              <Check size={15} className="text-green-400 shrink-0" />
              <span className="text-green-400 text-sm font-bold flex-1">
                {appliedCoupon.code} — {appliedCoupon.label}
              </span>
              <button onClick={removeCoupon} className="text-white/30 hover:text-white transition-colors">
                <X size={15} />
              </button>
            </div>
          ) : (
            <div className="flex flex-col gap-1.5">
              <div className="flex gap-2">
                <div className="flex-1 flex items-center gap-2 bg-white/5 border border-white/10 rounded-xl px-3 py-2.5">
                  <Tag size={13} className="text-white/30 shrink-0" />
                  <input
                    type="text"
                    value={couponInput}
                    onChange={(e) => { setCouponInput(e.target.value.toUpperCase()); setCouponError(""); }}
                    onKeyDown={(e) => e.key === "Enter" && applyCoupon()}
                    placeholder={c.couponPlaceholder}
                    className="bg-transparent text-white/80 text-sm placeholder-white/25 outline-none w-full uppercase"
                  />
                </div>
                <button
                  onClick={applyCoupon}
                  className="px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white/70 text-sm font-semibold hover:bg-white/10 hover:text-white transition-all"
                >
                  {c.apply}
                </button>
              </div>
              {couponError && (
                <p className="text-red-400 text-xs px-1">{couponError}</p>
              )}
            </div>
          )}

          {/* Subtotal / descuento / total */}
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between">
              <span className="text-white/50 text-sm">{c.subtotal}</span>
              <span className="text-white/70 text-sm">${subtotal.toFixed(2)}</span>
            </div>

            {couponDiscount > 0 && (
              <div className="flex items-center justify-between">
                <span className="text-green-400 text-sm flex items-center gap-1.5">
                  <Tag size={12} /> {appliedCoupon.code} ({appliedCoupon.label})
                </span>
                <span className="text-green-400 text-sm font-bold">-${discountAmount.toFixed(2)}</span>
              </div>
            )}

            <div className="flex items-center justify-between pt-1 border-t border-white/5">
              <span className="text-white font-extrabold text-sm uppercase tracking-widest">{c.subtotal === "Subtotal" ? "Total" : "Total"}</span>
              <div className="text-right">
                {couponDiscount > 0 && (
                  <p className="text-white/30 text-xs line-through">${subtotal.toFixed(2)}</p>
                )}
                <span className="text-white font-extrabold text-xl">${total.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Checkout button */}
          <Link
            href={`/addtocart${appliedCoupon ? `?coupon=${appliedCoupon.code}` : ""}`}
            onClick={closeDrawer}
          >
            <button
              style={{
                width: "100%", padding: "1.125rem",
                background: "linear-gradient(135deg, #3b82f6, #06b6d4)",
                color: "#fff", border: "none", borderRadius: "14px",
                fontSize: "1rem", fontWeight: 700, letterSpacing: "0.05em",
                textTransform: "uppercase", cursor: "pointer",
                transition: "all 0.3s ease",
                boxShadow: "0 4px 25px rgba(59,130,246,0.5), 0 0 40px rgba(59,130,246,0.2)",
                position: "relative", overflow: "hidden",
              }}
              onMouseEnter={e => {
                e.currentTarget.style.transform = "translateY(-2px)";
                e.currentTarget.style.boxShadow = "0 8px 30px rgba(59,130,246,0.6), 0 0 50px rgba(59,130,246,0.3)";
                const s = e.currentTarget.querySelector(".shimmer");
                if (s) { s.style.transform = "translateX(200%) skewX(-20deg)"; s.style.opacity = "1"; }
              }}
              onMouseLeave={e => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "0 4px 25px rgba(59,130,246,0.5), 0 0 40px rgba(59,130,246,0.2)";
                const s = e.currentTarget.querySelector(".shimmer");
                if (s) { s.style.transform = "translateX(-100%) skewX(-20deg)"; s.style.opacity = "0"; }
              }}
            >
              <span className="shimmer" style={{ position:"absolute", top:0, left:"-60%", width:"50%", height:"100%", background:"linear-gradient(90deg,transparent,rgba(255,255,255,0.35),transparent)", transform:"translateX(-100%) skewX(-20deg)", opacity:0, transition:"transform 0.9s ease, opacity 0.1s ease", pointerEvents:"none" }} />
              {c.proceedToCheckout}
            </button>
          </Link>
        </div>
      </div>
    </>,
    document.body
  );
};

export default CartDrawer;
