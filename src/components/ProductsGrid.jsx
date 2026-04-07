"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Star, Zap, ShieldCheck, Gift, Headphones } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

const GOLD_BEST        = ["Panel Secure", "Bypass UID", "Aimbot Color", "Panel Full"];
const FREE_PRODUCTS    = ["Panel Free", "Bypass Free"];
const CONSULT_PRODUCTS = ["Boost Rank"];
const OUT_OF_STOCK     = ["Aimbot Body Android", "Aimbot Body iOS"];

const ProductCard = ({ product }) => {
  const { t } = useLanguage();
  const features        = product?.features || [];
  const visibleFeatures = features.slice(0, 3);
  const extraCount      = features.length - 3;
  const isGoldBest      = GOLD_BEST.includes(product?.name);
  const isFree          = FREE_PRODUCTS.includes(product?.name);
  const isConsult       = CONSULT_PRODUCTS.includes(product?.name);
  const isOutOfStock    = OUT_OF_STOCK.includes(product?.name);

  return (
    <div className={[
      "relative rounded-xl flex flex-col h-full transition-all duration-300 group bg-[#07080b] hover:-translate-y-1",
      isFree
        ? "border border-yellow-400/60 shadow-[0_0_12px_rgba(251,191,36,0.15)] hover:shadow-[0_0_28px_rgba(251,191,36,0.45)] hover:border-yellow-300"
        : isGoldBest
          ? "border border-[#fbbf24]/50 shadow-[0_0_8px_rgba(251,191,36,0.08)] hover:shadow-[0_0_20px_rgba(251,191,36,0.35)] hover:border-yellow-300"
          : "border border-cyan-500/20 shadow-[0_0_8px_rgba(34,211,238,0.06)] hover:shadow-[0_0_20px_rgba(34,211,238,0.30)] hover:border-cyan-400/70"
    ].join(" ")}>

      {isFree && (
        <div className="absolute top-3 right-3 z-10 flex items-center gap-1 bg-yellow-400 text-black text-[10px] font-extrabold px-2.5 py-1 rounded-full">
          <Gift size={10} fill="black" /> {t.freeProducts?.free ?? "FREE"}
        </div>
      )}

      {isGoldBest && !isFree && (
        <div className="absolute top-3 right-3 z-10 bg-yellow-400 text-black text-[10px] font-extrabold px-2 py-0.5 rounded-full flex items-center gap-1">
          <Star size={10} fill="black" /> BEST
        </div>
      )}

      <div className="relative h-48 overflow-hidden rounded-t-xl">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-transform duration-500 ease-out group-hover:scale-110"
          style={{ backgroundImage: `url(${product?.images?.[0]})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#07080b] via-transparent to-transparent" />
        <div className="absolute top-3 left-3 flex gap-2 z-10">
          <span className="flex items-center gap-1 bg-green-500/20 border border-green-500/40 text-green-400 text-[10px] font-semibold px-2 py-0.5 rounded-full">
            <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
            {t.badges?.[0] ?? "UNDETECTED"}
          </span>
          {isFree ? (
            <span className="flex items-center gap-1 bg-yellow-400/20 border border-yellow-400/40 text-yellow-400 text-[10px] font-semibold px-2 py-0.5 rounded-full">
              <Gift size={9} /> {t.freeProducts?.free ?? "FREE"}
            </span>
          ) : (
            <span className="flex items-center gap-1 bg-cyan-500/20 border border-cyan-500/40 text-cyan-400 text-[10px] font-semibold px-2 py-0.5 rounded-full">
              <Zap size={9} /> {t.badges?.[1] ?? "Instant"}
            </span>
          )}
        </div>
      </div>

      <div className="flex flex-col flex-1 p-5 gap-3">
        <div>
          <h3 className={[
            "font-extrabold text-sm uppercase tracking-wide transition-colors duration-300",
            isFree
              ? "text-white group-hover:text-yellow-300"
              : isGoldBest
                ? "text-white group-hover:text-yellow-300"
                : "text-white group-hover:text-cyan-400"
          ].join(" ")}>
            {product?.name}
          </h3>
          <p className="text-white/40 text-[10px] uppercase tracking-wider mt-0.5 line-clamp-2">
            {product?.description}
          </p>
        </div>

        {features.length > 0 && (
          <ul className="flex flex-col gap-1.5">
            {visibleFeatures.map((f, i) => (
              <li key={i} className="flex items-center gap-2 text-white/70 text-xs">
                <ShieldCheck size={12} className={isFree || isGoldBest ? "text-yellow-400 shrink-0" : "text-cyan-400 shrink-0"} />
                {f}
              </li>
            ))}
            {extraCount > 0 && (
              <li className="text-yellow-400/60 text-xs mt-0.5">
                {typeof t.fashsalesMoreFeatures === "function"
                  ? t.fashsalesMoreFeatures(extraCount)
                  : `+${extraCount} more features`}
              </li>
            )}
          </ul>
        )}

        <div className="flex items-center justify-between mt-auto pt-3 border-t border-white/5">
          <div>
            <p className="text-white/30 text-[10px] uppercase tracking-wider">
              {isFree ? t.freeProducts?.price ?? "Price" : isConsult || isOutOfStock ? "" : t.fashsalesFrom ?? "From"}
            </p>
            {isFree ? (
              <p className="font-bold text-lg text-yellow-400">{t.freeProducts?.free ?? "FREE"}</p>
            ) : isOutOfStock ? (
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-red-400" />
                <p className="font-bold text-sm text-red-400">{t.fashsalesOutOfStock ?? "Out of stock"}</p>
              </div>
            ) : isConsult ? (
              <div className="flex items-center gap-1.5">
                <Headphones size={13} className="text-cyan-400" />
                <p className="font-bold text-sm text-cyan-400">{t.fashsalesConsult ?? "Consult us"}</p>
              </div>
            ) : (
              <p className="font-bold text-lg text-white">${product?.price}</p>
            )}
          </div>
          <Link href={`/products/${product?.id}`}>
            <button className={[
              "flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold transition-all duration-200 hover:scale-105 active:scale-95",
              isFree || isGoldBest ? "bg-yellow-400 hover:bg-yellow-300 text-black" : "bg-cyan-500 hover:bg-cyan-400 text-black"
            ].join(" ")}>
              {t.fashsalesView ?? "View →"}
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

const ProductsGrid = ({ products }) => {
  const { t } = useLanguage();
  const [search,           setSearch]           = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  const rawCategories = Array.from(new Set(products.map(p => p.category?.name).filter(Boolean)));
  const sortedCategories = [
    "Free Products",
    ...rawCategories.filter(c => c !== "Free Products"),
  ].filter(c => rawCategories.includes(c));
  const categories = ["all", ...sortedCategories];

  const filtered = products
    .filter(p => {
      const matchSearch = p.name.toLowerCase().includes(search.toLowerCase());
      const matchCat    = selectedCategory === "all" || p.category?.name === selectedCategory;
      return matchSearch && matchCat;
    })
    .sort((a, b) => {
      const aFree = FREE_PRODUCTS.includes(a.name) ? 0 : 1;
      const bFree = FREE_PRODUCTS.includes(b.name) ? 0 : 1;
      return aFree - bFree;
    });

  return (
    <div className="min-h-screen px-6 md:px-24 lg:px-32 py-48 max-w-screen-2xl mx-auto">
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-extrabold text-white uppercase tracking-tight mb-3">
          {t.fashsalesTitle ?? "Our Products"}
        </h1>
        <p className="text-white/40 text-sm">
          {t.fashsalesSubtitle ?? "Premium software with instant delivery and 24/7 support"}
        </p>
      </div>

      <div className="flex flex-col md:flex-row gap-4 items-center justify-between mb-10">
        <input
          type="text"
          placeholder={t.fashsalesSearch ?? "Search products..."}
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="bg-white/5 border border-white/10 text-white/80 placeholder-white/25 text-sm rounded-lg px-4 py-2.5 w-full md:w-72 focus:outline-none focus:border-cyan-500/50 transition-colors"
        />
        <div className="flex flex-wrap gap-2">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={[
                "px-4 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 capitalize",
                selectedCategory === cat
                  ? cat === "Free Products"
                    ? "bg-yellow-400 text-black"
                    : "bg-cyan-500 text-black"
                  : cat === "Free Products"
                    ? "bg-yellow-400/10 border border-yellow-400/30 text-yellow-400 hover:border-yellow-400/60"
                    : "bg-white/5 border border-white/10 text-white/50 hover:border-cyan-500/40 hover:text-white"
              ].join(" ")}
            >
              {cat === "all" ? t.fashsalesAll ?? "All" : cat}
            </button>
          ))}
        </div>
      </div>

      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filtered.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-24 text-white/30">
          <p className="text-lg font-semibold">{t.fashsalesNotFound ?? "No products found"}</p>
          <p className="text-sm mt-1">{t.fashsalesNotFoundSub ?? "Try a different search or category"}</p>
        </div>
      )}
    </div>
  );
};

export default ProductsGrid;