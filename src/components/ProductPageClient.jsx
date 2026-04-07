"use client";

import React from "react";
import {
  ShieldCheck,
  Star,
  Package,
  Monitor,
  Shield,
  Headphones,
} from "lucide-react";
import Link from "next/link";
import PlanSelector from "@/components/PlanSelector";
import Footer from "@/components/Footer";
import { useLanguage } from "@/context/LanguageContext";

// Mismo diccionario que ProductsGrid — puedes extraerlo a un archivo
// separado como lib/productTranslations.js si quieres evitar duplicarlo
const FEATURE_TRANSLATIONS = {
  es: {
    "Instant Delivery": "Entrega inmediata",
    "24/7 Support": "Soporte 24/7",
    "Undetected": "Indetectable",
    "Secure Access": "Acceso seguro",
  },
  en: {
    "Instant Delivery": "Instant Delivery",
    "24/7 Support": "24/7 Support",
    "Undetected": "Undetected",
    "Secure Access": "Secure Access",
  },
};

const ProductPageClient = ({ product, isGoldBest, features }) => {
  const { t, locale } = useLanguage();

  const featureDict = FEATURE_TRANSLATIONS[locale] || FEATURE_TRANSLATIONS.en;
  const getFeatureLabel = (f) => featureDict[f] ?? f;

  return (
    <div className="min-h-screen text-white flex flex-col">
      <div className="flex-1">

        {/* Breadcrumb */}
        <div className="px-4 md:px-12 max-w-screen-xl mx-auto pt-40 pb-5 flex items-center gap-2 text-white/50 text-sm">
          <Link href="/" className="hover:text-white transition-colors">
            {t.home ?? "Home"}
          </Link>
          <span className="text-white/30">/</span>
          <Link href="/products" className="hover:text-white transition-colors">
            {t.products ?? "Products"}
          </Link>
          <span className="text-white/30">/</span>
          <span className="text-white font-semibold uppercase">{product.name}</span>
        </div>

        <div className="px-4 md:px-12 max-w-screen-xl mx-auto pb-6">

          {/* Badges */}
          <div className="flex gap-3 flex-wrap mb-4">
            {isGoldBest && (
              <span className="flex items-center gap-1.5 bg-yellow-400/20 border border-yellow-400/40 text-yellow-400 text-xs font-extrabold px-4 py-1.5 rounded-full uppercase">
                <Star size={11} fill="currentColor" />
                {t.productPage?.bestSeller ?? "Best Seller"}
              </span>
            )}

            <span className="flex items-center gap-1.5 bg-green-500/20 border border-green-500/40 text-green-400 text-xs font-semibold px-4 py-1.5 rounded-full">
              <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              {t.productPage?.undetected ?? t.badges?.[0] ?? "Undetected"}
            </span>
          </div>

          <h1 className="font-extrabold text-6xl md:text-7xl uppercase tracking-tight text-white mb-2">
            {product.name}
          </h1>

          <p className="text-white/40 text-sm uppercase tracking-widest mb-3">
            {product.description}
          </p>

          <div className="flex items-center gap-1.5 mb-10">
            {[...Array(5)].map((_, i) => (
              <Star key={i} size={18} className="text-cyan-400 fill-cyan-400" />
            ))}
            <span className="text-white/40 text-sm ml-2">
              {t.productPage?.sales ?? "(1000+ sales)"}
            </span>
          </div>
        </div>

        {/* Layout 2 columnas */}
        <div className="px-4 md:px-12 max-w-screen-xl mx-auto flex flex-col lg:flex-row gap-10 items-start pb-20">
          <div className="flex-1 min-w-0">

            {/* Imagen */}
            <div className="rounded-2xl overflow-hidden border border-white/10 w-full bg-[#0d0f14]">
              {product?.images?.[0] ? (
                <img
                  src={product.images[0]}
                  alt={product.name}
                  className="w-full h-auto object-contain rounded-2xl"
                />
              ) : (
                <div className="w-full h-64 flex items-center justify-center bg-white/5">
                  <Package size={64} className="text-white/20" />
                </div>
              )}
            </div>

            {/* PlanSelector mobile */}
            <div className="lg:hidden mt-6">
              <PlanSelector
                plans={product?.plans ?? []}
                product={product}
                isGoldBest={isGoldBest}
              />
            </div>

            {/* Features */}
            {features.length > 0 && (
              <div className="mt-10">
                <h2 className="text-white font-extrabold text-3xl mb-6">
                  {t.productPage?.features ?? "Features"}
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {features.map((f, i) => (
                    <div
                      key={i}
                      className={[
                        "flex items-center gap-4 bg-white/5 border border-white/10 rounded-xl px-5 py-4 hover:-translate-y-1 transition-all duration-200 cursor-default",
                        isGoldBest
                          ? "hover:border-yellow-400/40 hover:shadow-[0_0_16px_rgba(251,191,36,0.20)]"
                          : "hover:border-cyan-500/40 hover:shadow-[0_0_16px_rgba(34,211,238,0.20)]",
                      ].join(" ")}
                    >
                      <div
                        className={[
                          "w-9 h-9 rounded-full flex items-center justify-center shrink-0",
                          isGoldBest ? "bg-yellow-400/15" : "bg-cyan-500/15",
                        ].join(" ")}
                      >
                        <ShieldCheck
                          size={17}
                          className={isGoldBest ? "text-yellow-400" : "text-cyan-400"}
                        />
                      </div>
                      {/* getFeatureLabel traduce si existe, si no muestra el valor original de BD */}
                      <span className="text-white/80 text-base">{getFeatureLabel(f)}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Specifications */}
            <div className="mt-10 mb-16">
              <h2 className="text-white font-extrabold text-3xl mb-6">
                {t.productPage?.specifications ?? "Specifications"}
              </h2>

              <div className="rounded-2xl border border-white/10 overflow-hidden bg-white/[0.03]">
                <div className="flex items-center justify-between px-6 py-5 border-b border-white/5">
                  <div className="flex items-center gap-3 text-white/50 text-lg">
                    <Monitor size={18} />
                    {t.productPage?.compatibility ?? "Compatibility"}
                  </div>
                  <span className="text-white/80 text-lg font-semibold">
                    {t.productPage?.windowsCompat ?? "Windows 10 & 11"}
                  </span>
                </div>

                <div className="flex items-center justify-between px-6 py-5 border-b border-white/5">
                  <div className="flex items-center gap-3 text-white/50 text-lg">
                    <Shield size={18} />
                    {t.productPage?.status ?? "Status"}
                  </div>
                  <span className="text-green-400 text-lg font-semibold">
                    {t.productPage?.undetectedStatus ?? "Undetected"}
                  </span>
                </div>

                <div className="flex items-center justify-between px-6 py-5">
                  <div className="flex items-center gap-3 text-white/50 text-lg">
                    <Headphones size={18} />
                    {t.productPage?.support ?? "Support"}
                  </div>
                  <span className="text-white/80 text-lg font-semibold">
                    {t.productPage?.supportValue ?? "24/7 Discord"}
                  </span>
                </div>
              </div>
            </div>

          </div>

          {/* PlanSelector desktop */}
          <div className="hidden lg:block lg:self-start lg:sticky lg:top-28">
            <PlanSelector
              plans={product?.plans ?? []}
              product={product}
              isGoldBest={isGoldBest}
            />
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default ProductPageClient;