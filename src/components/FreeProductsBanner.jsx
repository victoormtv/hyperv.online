"use client";
import React from "react";
import Link from "next/link";
import { Gift, ShieldCheck, Zap } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

const FREE_PRODUCTS = ["Panel Free", "Bypass Free"];

const FreeProductsBanner = ({ products }) => {
  const { t } = useLanguage();

  const freeProducts = (products || []).filter(p => {
    const product = p?.product || p;
    return FREE_PRODUCTS.includes(product?.name);
  });

  if (freeProducts.length === 0) return null;

  return (
    <section className="py-12 px-4 md:px-12 lg:px-24">

      {/* Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 bg-yellow-400/10 border border-yellow-400/30 text-yellow-400 text-xs font-extrabold px-4 py-1.5 rounded-full uppercase tracking-widest mb-4">
          <Gift size={13} /> Productos Gratuitos
        </div>
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-2">
          Prueba{" "}
          <span className="text-yellow-400">Gratis</span>
        </h2>
        <p className="text-white/40 text-sm">
          Empieza sin pagar nada — 3 días de prueba completamente gratis.
        </p>
      </div>

      {/* Cards */}
      <div className="flex flex-col sm:flex-row gap-6 max-w-2xl mx-auto justify-center">
        {freeProducts.map((item, index) => {
          const product = item?.product || item;
          const features = (product?.features || []).slice(0, 3);

          return (
            <div key={product?.id || index}
              className="relative flex-1 rounded-2xl bg-[#0d0f0a] border border-yellow-400/40 shadow-[0_0_20px_rgba(251,191,36,0.12)] hover:shadow-[0_0_35px_rgba(251,191,36,0.30)] hover:border-yellow-300 hover:-translate-y-1 transition-all duration-300 overflow-hidden group"
            >
              {/* FREE badge */}
              <div className="absolute top-3 right-3 z-10 flex items-center gap-1 bg-yellow-400 text-black text-[10px] font-extrabold px-2.5 py-1 rounded-full">
                <Gift size={10} fill="black" /> FREE
              </div>

              {/* Image */}
              <div className="relative h-44 overflow-hidden">
                <img
                  src={product?.images?.[0]}
                  alt={product?.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0d0f0a] via-transparent to-transparent" />
                <div className="absolute top-3 left-3 flex gap-1.5 z-10">
                  <span className="flex items-center gap-1 bg-green-500/20 border border-green-500/40 text-green-400 text-[10px] font-semibold px-2 py-0.5 rounded-full">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                    {t.badges?.[0] ?? "UNDETECTED"}
                  </span>
                  <span className="flex items-center gap-1 bg-yellow-400/20 border border-yellow-400/40 text-yellow-400 text-[10px] font-semibold px-2 py-0.5 rounded-full">
                    <Gift size={9} /> FREE
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="p-5 flex flex-col gap-3">
                <div>
                  <h3 className="font-extrabold text-sm uppercase tracking-wide text-white group-hover:text-yellow-300 transition-colors">
                    {product?.name}
                  </h3>
                  <p className="text-white/40 text-[10px] uppercase tracking-wider mt-0.5 line-clamp-2">
                    {product?.description}
                  </p>
                </div>

                <ul className="flex flex-col gap-1.5">
                  {features.map((f, i) => (
                    <li key={i} className="flex items-center gap-2 text-white/70 text-xs">
                      <ShieldCheck size={12} className="text-yellow-400 shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>

                <div className="flex items-center justify-between pt-3 border-t border-yellow-400/15 mt-auto">
                  <div>
                    <p className="text-white/30 text-[10px] uppercase tracking-wider">Precio</p>
                    <p className="text-yellow-400 font-extrabold text-xl">FREE</p>
                  </div>
                  <Link href={`/products/${product?.id}`}>
                    <button className="flex items-center gap-1.5 px-5 py-2 rounded-lg text-xs font-extrabold bg-yellow-400 hover:bg-yellow-300 text-black transition-all duration-200 hover:scale-105 active:scale-95">
                      <Gift size={12} /> Obtener →
                    </button>
                  </Link>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Bottom CTA */}
      <div className="flex justify-center mt-8">
        <Link
          href="/products?cat=Free Products"
          className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full border border-yellow-400/30 text-yellow-400/80 text-sm font-semibold hover:border-yellow-400 hover:text-yellow-400 transition-all duration-200"
        >
          <Gift size={14} /> Ver todos los productos gratis
        </Link>
      </div>

    </section>
  );
};

export default FreeProductsBanner;
