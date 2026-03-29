"use client";
import React, { useState } from "react";
import { Zap, Shield, Headphones, ShoppingCart, Gift } from "lucide-react";
import AddToCart from "@/components/AddToCart";

const FREE_PRODUCTS = ["Panel Free", "Bypass Free"];
const OUT_OF_STOCK = ["Aimbot Body Android", "Aimbot Body iOS"];

const PlanSelector = ({ plans, product, isGoldBest }) => {
  const [selected, setSelected] = useState(plans?.[0]?.id ?? null);

  const selectedPlan = plans?.find(p => p.id === selected) || plans?.[0];
  const isFree = FREE_PRODUCTS.includes(product?.name) || selectedPlan?.price === 0;
  const isOutOfStock = OUT_OF_STOCK.includes(product?.name);

  const productWithPlan = {
    ...product,
    price: selectedPlan?.price ?? product?.price,
    planLabel: selectedPlan?.label ?? "Standard",
    planId: selectedPlan?.id ?? null,
  };

  const isGolden = isFree || isGoldBest;

  const accent = isGolden ? "text-yellow-300" : "text-cyan-400";
  const accentBg = isGolden ? "bg-yellow-400 text-black" : "bg-cyan-500 text-black";
  const selectedBorder = isGolden
    ? "border-yellow-400/60 bg-yellow-400/10 shadow-[0_0_18px_rgba(251,191,36,0.30)]"
    : "border-cyan-500/60 bg-cyan-500/10 shadow-[0_0_18px_rgba(34,211,238,0.30)]";
  const cardShadow = isGolden
    ? "shadow-[0_0_40px_rgba(251,191,36,0.12)]"
    : "shadow-[0_0_40px_rgba(34,211,238,0.10)]";
  const buyBtn = isGolden
    ? "bg-gradient-to-r from-yellow-400 to-yellow-300 text-black shadow-[0_0_24px_rgba(251,191,36,0.45)]"
    : "bg-gradient-to-r from-cyan-500 to-cyan-400 text-black shadow-[0_0_24px_rgba(34,211,238,0.45)]";
  const badgeIconBg = isGolden ? "bg-yellow-400/15" : "bg-cyan-500/15";
  const badgeIconColor = isGolden ? "text-yellow-400" : "text-cyan-400";

  return (
    <div className="w-full lg:w-[360px] xl:w-[420px] shrink-0 flex flex-col gap-4 pb-16">
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
                </div>
                <span className={["font-extrabold text-lg", isSelected ? accent : "text-white/60"].join(" ")}>
                  {plan.price === 0 ? <span className="text-yellow-300 font-black">FREE</span> : `$${plan.price}`}
                </span>
              </button>
            );
          }) : (
            <div className={["flex items-center justify-between px-5 py-4 rounded-xl border", selectedBorder].join(" ")}>
              <span className="text-white/90 text-lg font-semibold">Standard</span>
              <span className={["font-extrabold text-lg", accent].join(" ")}>
                {isOutOfStock ? "Sin stock" : `$${product?.price}`}
              </span>
            </div>
          )}
        </div>

        {isOutOfStock ? (
          <div className="w-full flex items-center justify-center gap-2 py-4 rounded-xl font-extrabold text-base bg-red-500/15 text-red-400 border border-red-500/30 cursor-not-allowed">
            Sin stock
          </div>
        ) : (
          <AddToCart product={productWithPlan}>
            <div className={["w-full flex items-center justify-center gap-2 py-4 rounded-xl font-extrabold text-base cursor-pointer transition-all duration-200 hover:scale-105 active:scale-95", buyBtn].join(" ")}>
              {isFree
                ? <><Gift size={18} strokeWidth={2.5} /> 🎉 Obtener Gratis →</>
                : <><ShoppingCart size={18} strokeWidth={2.5} /> Buy Now →</>
              }
            </div>
          </AddToCart>
        )}
      </div>
    </div>
  );
};

export default PlanSelector;