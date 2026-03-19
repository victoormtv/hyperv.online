"use client";
import React from "react";
import Link from "next/link";
import {
  siPaypal,
  siBinance,
  siTether,
  siWesternunion,
  siVisa,
  siMastercard,
} from "simple-icons";
import { footerData } from "@/utils/data";
import { useLanguage } from "@/context/LanguageContext";

const SI = ({ icon, size = 22 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="white"
    xmlns="http://www.w3.org/2000/svg"
    aria-label={icon.title}
  >
    <path d={icon.path} />
  </svg>
);

const iconMap = {
  PayPal:          <SI icon={siPaypal} />,
  "Western Union": <SI icon={siWesternunion} />,
  Binance:         <SI icon={siBinance} />,
  Tether:          <SI icon={siTether} />,
  Visa:            <SI icon={siVisa} />,
  Mastercard:      <SI icon={siMastercard} />,
};

const Footer = () => {
  const { t } = useLanguage();
  const { brand, year, paymentMethods } = footerData;

  return (
    <footer className="mt-20 border-t border-white/5 bg-[#030405]">
      <div className="max-w-3xl mx-auto px-6 py-14 text-center">
        <p className="text-white/80 font-semibold text-sm mb-4">
          © {year} {brand}. {t.footerRights}
        </p>
        <p className="text-white/30 text-xs leading-relaxed max-w-xl mx-auto">
          {t.footerLegal}
        </p>
        <Link
          href="/terms"
          className="inline-block mt-6 text-white/40 text-xs underline underline-offset-4 hover:text-white/70 transition-colors"
        >
          {t.footerTerms}
        </Link>
      </div>

      <div className="h-px bg-[#013173]/60 mx-6" />

      <div className="py-8 px-6">
        <div className="flex flex-wrap items-center justify-center gap-8">
          {paymentMethods.map((p) => (
            <div
              key={p.name}
              className="flex items-center gap-2 opacity-35 hover:opacity-65 transition-opacity cursor-default"
            >
              {iconMap[p.name]}
              <span className="text-white/60 text-xs font-semibold tracking-wide">{p.name}</span>
            </div>
          ))}
        </div>
      </div>
    </footer>
  );
};

export default Footer;
