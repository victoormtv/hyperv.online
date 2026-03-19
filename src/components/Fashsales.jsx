"use client";
import React from "react";
import Link from "next/link";
import { Star, Zap, ShieldCheck, ChevronLeft, ChevronRight } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

import {
  Carousel, CarouselContent, CarouselItem,
  CarouselNext, CarouselPrevious,
} from "@/components/ui/carousel";

const Fashsales = ({ products }) => {
  const { t } = useLanguage();
  const GOLD_BEST = ["Panel Secure", "Bypass UID", "Aimbot Color"];

  const sortedProducts = [...(products || [])].sort((a, b) => {
    const productA = a?.product || a;
    const productB = b?.product || b;
    const aIsGold = GOLD_BEST.includes(productA?.name);
    const bIsGold = GOLD_BEST.includes(productB?.name);
    if (aIsGold && !bIsGold) return -1;
    if (!aIsGold && bIsGold) return 1;
    return 0;
  });

  const displayProducts = sortedProducts.slice(0, 6);

  return (
    <section className="py-16 mt-10 px-4 md:px-12 lg:px-24">
      <div className="text-center mb-10">
        <p className="text-sm text-white/50 uppercase tracking-widest mb-1">{t.fashsalesTitle}</p>
        <h2 className="text-3xl md:text-4xl font-bold text-white">{t.fashsalesHeading}</h2>
        <p className="text-white/40 text-sm mt-2">{t.fashsalesSubtitle}</p>
      </div>

      <div className="carousel-overflow-fix relative" style={{ overflow: "visible" }}>
        <Carousel
          opts={{ align: "start", loop: false }}
          className="w-full max-w-6xl mx-auto"
          style={{ overflow: "visible" }}
        >
          <CarouselContent className="-ml-4" style={{ overflow: "visible" }}>
            {displayProducts.map((item, index) => {
              const product = item?.product || item;
              const features = product?.features || [];
              const visibleFeatures = features.slice(0, 3);
              const extraCount = features.length - 3;
              const isGoldBest = GOLD_BEST.includes(product?.name);

              return (
                <CarouselItem
                  key={product?.id || index}
                  className="pl-4 basis-4/5 sm:basis-1/2 lg:basis-1/3"
                >
                  <div className={[
                    "relative rounded-xl flex flex-col transition-all duration-300 group bg-[#07080b] hover:-translate-y-1",
                    isGoldBest
                      ? "border border-[#fbbf24]/50 shadow-[0_0_8px_rgba(251,191,36,0.08)] hover:shadow-[0_0_20px_rgba(251,191,36,0.35)] hover:border-yellow-300"
                      : "border border-cyan-500/20 shadow-[0_0_8px_rgba(34,211,238,0.06)] hover:shadow-[0_0_20px_rgba(34,211,238,0.30)] hover:border-cyan-400/70"
                  ].join(" ")}>

                    {isGoldBest && (
                      <div className="absolute top-3 right-3 z-10 bg-yellow-400 text-black text-[10px] font-extrabold px-2 py-0.5 rounded-full flex items-center gap-1">
                        <Star size={10} fill="black" /> BEST
                      </div>
                    )}

                    {/* Imagen con altura fija y object-cover */}
                    <div className="relative h-44 overflow-hidden rounded-t-xl">
                      <img
                        src={product?.images?.[0]}
                        alt={product?.name}
                        className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#07080b] via-transparent to-transparent" />
                      <div className="absolute top-3 left-3 flex gap-1.5 z-10 flex-wrap">
                        <span className="flex items-center gap-1 bg-green-500/20 border border-green-500/40 text-green-400 text-[10px] font-semibold px-2 py-0.5 rounded-full">
                          <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                          {t.badges?.[0] ?? "UNDETECTED"}
                        </span>
                        <span className="flex items-center gap-1 bg-cyan-500/20 border border-cyan-500/40 text-cyan-400 text-[10px] font-semibold px-2 py-0.5 rounded-full">
                          <Zap size={9} /> {t.badges?.[1] ?? "Instant"}
                        </span>
                      </div>
                    </div>

                    <div className="flex flex-col flex-1 p-4 gap-3">
                      <div>
                        <h3 className={[
                          "font-extrabold text-sm uppercase tracking-wide transition-colors duration-300",
                          isGoldBest
                            ? "text-white group-hover:text-yellow-300"
                            : "text-white group-hover:text-cyan-400"
                        ].join(" ")}>
                          {product?.name}
                        </h3>
                        <p className="text-white/40 text-[10px] uppercase tracking-wider mt-0.5 line-clamp-1">
                          {product?.description}
                        </p>
                      </div>

                      {features.length > 0 && (
                        <ul className="flex flex-col gap-1">
                          {visibleFeatures.map((f, i) => (
                            <li key={i} className="flex items-center gap-2 text-white/70 text-xs">
                              <ShieldCheck
                                size={12}
                                className={isGoldBest ? "text-yellow-400 shrink-0" : "text-cyan-400 shrink-0"}
                              />
                              <span className="line-clamp-1">{f}</span>
                            </li>
                          ))}
                          {extraCount > 0 && (
                            <li className="text-cyan-400/60 text-xs mt-0.5 cursor-pointer hover:text-cyan-400 transition-colors">
                              {t.fashsalesMoreFeatures(extraCount)}
                            </li>
                          )}
                        </ul>
                      )}

                      <div className="flex items-center justify-between mt-auto pt-3 border-t border-white/5">
                        <div>
                          <p className="text-white/30 text-[10px] uppercase tracking-wider">{t.fashsalesFrom}</p>
                          <p className="text-white font-bold text-lg">${product?.price}</p>
                        </div>
                        <Link href={`/products/${product?.id}`}>
                          <button className={[
                            "flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold transition-all duration-200 hover:scale-105 active:scale-95",
                            isGoldBest ? "bg-yellow-400 hover:bg-yellow-300 text-black" : "bg-cyan-500 hover:bg-cyan-400 text-black"
                          ].join(" ")}>
                            {t.fashsalesView}
                          </button>
                        </Link>
                      </div>
                    </div>
                  </div>
                </CarouselItem>
              );
            })}
          </CarouselContent>

          {/* Flechas visibles en mobile — dentro del contenedor, no fuera */}
          <CarouselPrevious className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 w-9 h-9 bg-black/70 border border-white/20 text-white hover:bg-black hover:text-white transition-all duration-200 rounded-full flex items-center justify-center z-20 shadow-lg">
            <ChevronLeft className="w-5 h-5" />
          </CarouselPrevious>

          <CarouselNext className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 w-9 h-9 bg-black/70 border border-white/20 text-white hover:bg-black hover:text-white transition-all duration-200 rounded-full flex items-center justify-center z-20 shadow-lg">
            <ChevronRight className="w-5 h-5" />
          </CarouselNext>
        </Carousel>
      </div>

      <div className="flex justify-center mt-10">
        <Link href="/products" className="px-8 py-3 rounded-lg border border-white/15 text-white/70 text-sm font-semibold hover:border-cyan-500/40 hover:text-white transition-all duration-200">
          {t.fashsalesViewAll}
        </Link>
      </div>
    </section>
  );
};

export default Fashsales;
