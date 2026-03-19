"use client";
import { setCart, setShowCartDrawer } from "@/redux/slice/cartSlice";
import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { useDispatch, useSelector } from "react-redux";
import { ShoppingCart, X, Check } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

const AddToCart = ({ children, product }) => {
  const dispatch = useDispatch();
  const { cart, showCartDrawer } = useSelector((state) => state.auth);
  const { t } = useLanguage();
  const c = t.cart;
  const [showModal, setShowModal] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [headerHeight, setHeaderHeight] = useState(false);

  useEffect(() => {
    setMounted(true);
    const el = document.querySelector("header");
    if (el) setHeaderHeight(el.getBoundingClientRect().bottom);
  }, []);

  // Close modal when drawer opens
  useEffect(() => {
    if (showCartDrawer) setShowModal(false);
  }, [showCartDrawer]);

  const submit = () => {
    const existingIndex = cart.findIndex((item) => item.product.id === product.id);
    if (existingIndex !== -1) {
      dispatch(setCart(cart.map((item, i) => i === existingIndex ? { ...item, quantity: item.quantity + 1 } : item)));
    } else {
      dispatch(setCart([...cart, { product, quantity: 1 }]));
    }
    setShowModal(true);
  };

  return (
    <>
      <div className="w-full" onClick={submit}>{children}</div>

      {/* ── Added to Cart modal ── */}
      {mounted && showModal && createPortal(
        <div
          className="fixed inset-0 flex items-center justify-center px-4"
          style={{ background: "rgba(0,0,0,0.55)", backdropFilter: "blur(6px)", zIndex: 100000, top: `${headerHeight}px` }}
        >
          <div className="relative bg-[#0d0f14] border border-white/10 rounded-3xl p-8 w-full max-w-xs text-center shadow-2xl">
            <button onClick={() => setShowModal(false)} className="absolute top-4 right-4 text-white/30 hover:text-white transition-colors">
              <X size={18} />
            </button>

            <div
              className="mx-auto mb-5 w-16 h-16 rounded-full border-2 border-green-400/60 flex items-center justify-center"
              style={{ background: "radial-gradient(circle, rgba(74,222,128,0.35) 0%, rgba(74,222,128,0.08) 100%)", boxShadow: "0 0 30px rgba(74,222,128,0.45), 0 0 60px rgba(74,222,128,0.15)" }}
            >
              <Check size={28} className="text-green-300" strokeWidth={3} />
            </div>

            <h2 className="text-white font-extrabold text-xl mb-1">{c.added}</h2>
            <p className="text-white/40 text-sm mb-6">{c.question}</p>

            <button
              onClick={() => { setShowModal(false); dispatch(setShowCartDrawer(true)); }}
              className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl font-bold text-sm text-white mb-3"
              style={{ background: "linear-gradient(135deg, #3b82f6, #06b6d4)", boxShadow: "0 4px 20px rgba(59,130,246,0.45)", position: "relative", overflow: "hidden", transition: "transform 0.2s ease, box-shadow 0.2s ease" }}
              onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-3px)"; e.currentTarget.style.boxShadow = "0 8px 30px rgba(59,130,246,0.6)"; const s = e.currentTarget.querySelector(".shimmer"); if (s) { s.style.transform = "translateX(200%) skewX(-20deg)"; s.style.opacity = "1"; } }}
              onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 4px 20px rgba(59,130,246,0.45)"; const s = e.currentTarget.querySelector(".shimmer"); if (s) { s.style.transform = "translateX(-100%) skewX(-20deg)"; s.style.opacity = "0"; } }}
            >
              <span className="shimmer" style={{ position:"absolute", top:0, left:"-60%", width:"50%", height:"100%", background:"linear-gradient(90deg,transparent,rgba(255,255,255,0.35),transparent)", transform:"translateX(-100%) skewX(-20deg)", opacity:0, transition:"transform 0.9s ease, opacity 0.1s ease", pointerEvents:"none" }} />
              <ShoppingCart size={16} strokeWidth={2.5} />
              {c.proceedToCart} →
            </button>

            <button onClick={() => setShowModal(false)} className="w-full py-3.5 rounded-xl font-bold text-sm text-white bg-white/5 border border-white/10 hover:bg-white/10 transition-all duration-200">
              {c.continueShopping}
            </button>
          </div>
        </div>
      , document.body)}
    </>
  );
};

export default AddToCart;