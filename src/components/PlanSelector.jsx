"use client";
import React, { useState } from "react";
import { Zap, Shield, Headphones, ShoppingCart, Gift } from "lucide-react";
import AddToCart from "@/components/AddToCart";

const FREE_PRODUCTS = ["Panel Free", "Bypass Free"];

const PlanSelector = ({ plans, product, isGoldBest }) => {
  const [selected, setSelected] = useState(plans?.[0]?.id ?? null);

  const selectedPlan = plans?.find(p => p.id === selected) || plans?.[0];

  const isFree = FREE_PRODUCTS.includes(product?.name) || selectedPlan?.price === 0;

  // Producto enriquecido con el plan seleccionado
  const productWithPlan = {
    ...product,
    price:     selectedPlan?.price ?? product?.price,
    planLabel: selectedPlan?.label ?? "Standard",
    planId:    selectedPlan?.id    ?? null,
  };

  // Si es free O gold best → dorado. Si no → cyan.
  const isGolden = isFree || isGoldBest;

  const accent         = isGolden ? "text-yellow-300"   : "text-cyan-400";
  const accentBg       = isGolden ? "bg-yellow-400 text-black" : "bg-cyan-500 text-black";
  const selectedBorder = isGolden
    ? "border-yellow-400/60 bg-yellow-400/10 shadow-[0_0_18px_rgba(251,191,36,0.30)]"
    : "border-cyan-500/60 bg-cyan-500/10 shadow-[0_0_18px_rgba(34,211,238,0.30)]";
  const cardShadow     = isGolden
    ? "shadow-[0_0_40px_rgba(251,191,36,0.12)]"
    : "shadow-[0_0_40px_rgba(34,211,238,0.10)]";
  const buyBtn         = isGolden
    ? "bg-gradient-to-r from-yellow-400 to-yellow-300 text-black shadow-[0_0_24px_rgba(251,191,36,0.45)]"
    : "bg-gradient-to-r from-cyan-500 to-cyan-400 text-black shadow-[0_0_24px_rgba(34,211,238,0.45)]";
  const badgeIconBg    = isGolden ? "bg-yellow-400/15" : "bg-cyan-500/15";
  const badgeIconColor = isGolden ? "text-yellow-400"  : "text-cyan-400";

  return (
    <div className="w-full lg:w-[360px] xl:w-[420px] shrink-0 flex flex-col gap-4 pb-16">

      {/* choose plan card */}
      <div className={["rounded-2xl border border-white/10 bg-[#0d0f14] p-7", cardShadow].join(" ")}>
        <p className="text-white font-extrabold text-2xl mb-6">Choose Your Plan</p>

        <div className="flex flex-col gap-3 mb-6">
          {plans?.length > 0 ? plans.map((plan) => {
            const isSelected = selected === plan.id;
            return (
              <button
                key={plan.id}
                onClick={() => setSelected(plan.id)}
                className={[
                  "w-full flex items-center justify-between px-5 py-4 rounded-xl border transition-all duration-200 text-left",
                  isSelected
                    ? selectedBorder
                    : `border-white/10 bg-white/5 ${isGolden ? "hover:border-yellow-400/30 hover:bg-yellow-400/5" : "hover:border-cyan-500/30 hover:bg-cyan-500/5"}`
                ].join(" ")}
              >
                <div className="flex items-center gap-3">
                  {isSelected && (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className={accent}>
                      <path d="M20 6L9 17l-5-5"/>
                    </svg>
                  )}
                  <span className="text-white/90 text-lg font-semibold">{plan.label}</span>
                  {(plan.label?.toLowerCase().includes("mensual") || plan.label?.toLowerCase().includes("monthly")) && (
                    <span className={["text-[11px] font-extrabold px-2 py-0.5 rounded-full", accentBg].join(" ")}>Popular</span>
                  )}
                </div>
                <span className={["font-extrabold text-lg", isSelected ? accent : "text-white/60"].join(" ")}>
                  {plan.price === 0 ? (
                    <span className="text-yellow-300 font-black">FREE</span>
                  ) : (
                    `$${plan.price}`
                  )}
                </span>
              </button>
            );
          }) : (
            <div className={["flex items-center justify-between px-5 py-4 rounded-xl border", selectedBorder].join(" ")}>
              <span className="text-white/90 text-lg font-semibold">Standard</span>
              <span className={["font-extrabold text-lg", accent].join(" ")}>${product?.price}</span>
            </div>
          )}
        </div>

        {/* crypto banner — solo si no es free */}
        {!isFree && (
          <div className="flex items-start gap-3 bg-[#1a1507] border border-yellow-400/20 rounded-xl px-5 py-4 mb-6">
            <Zap size={18} className="text-yellow-400 shrink-0 mt-0.5" />
            <div>
              <p className="text-yellow-400 text-base font-extrabold">5% OFF with Crypto!</p>
              <p className="text-white/40 text-sm mt-0.5">Use code CRYPTO20 for 20% OFF.</p>
            </div>
          </div>
        )}

        {/* free banner */}
        {isFree && (
          <div className="flex items-start gap-3 bg-yellow-400/8 border border-yellow-400/25 rounded-xl px-5 py-4 mb-6">
            <Gift size={18} className="text-yellow-400 shrink-0 mt-0.5" />
            <div>
              <p className="text-yellow-400 text-base font-extrabold">¡Producto Gratuito!</p>
              <p className="text-white/40 text-sm mt-0.5">Sin costo · 3 días de prueba incluidos.</p>
            </div>
          </div>
        )}

        {/* buy / get free button */}
        <AddToCart product={productWithPlan}>
          <div className={["w-full flex items-center justify-center gap-2 py-4 rounded-xl font-extrabold text-base cursor-pointer transition-all duration-200 hover:scale-105 active:scale-95", buyBtn].join(" ")}>
            {isFree
              ? <><Gift size={18} strokeWidth={2.5} /> 🎉 Obtener Gratis →</>
              : <><ShoppingCart size={18} strokeWidth={2.5} /> Buy Now →</>
            }
          </div>
        </AddToCart>
      </div>

      {/* trust badges */}
      <div className="rounded-2xl border border-white/10 bg-[#0d0f14] px-6 py-6 flex flex-col gap-5">
        <div className="flex items-center gap-4">
          <div className={["w-12 h-12 rounded-full flex items-center justify-center shrink-0", badgeIconBg].join(" ")}>
            <Shield size={22} className={badgeIconColor} />
          </div>
          <div>
            <p className="text-white/90 text-base font-bold">100% Undetected</p>
            <p className="text-white/40 text-sm">Safe to use</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className={["w-12 h-12 rounded-full flex items-center justify-center shrink-0", badgeIconBg].join(" ")}>
            <Zap size={22} className={badgeIconColor} />
          </div>
          <div>
            <p className="text-white/90 text-base font-bold">Instant Delivery</p>
            <p className="text-white/40 text-sm">With crypto</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className={["w-12 h-12 rounded-full flex items-center justify-center shrink-0", badgeIconBg].join(" ")}>
            <Headphones size={22} className={badgeIconColor} />
          </div>
          <div>
            <p className="text-white/90 text-base font-bold">24/7 Support</p>
            <p className="text-white/40 text-sm">Discord</p>
          </div>
        </div>
      </div>

    </div>
  );
};

export default PlanSelector;
