"use client";
// ⚠️ Esta carpeta debe llamarse [productId] en tu proyecto Next.js
import React, { useState, useEffect, useCallback } from "react";
import { useParams, useSearchParams, useRouter } from "next/navigation";
import { useLanguage } from "@/context/LanguageContext";

import TutorialLayout from "@/components/tutorial/layout/tutorial-layout";
import { ComingSoon }  from "@/components/tutorial/shared/components";

import PanelFull       from "@/components/tutorial/products/panel-full";
import PanelSecure     from "@/components/tutorial/products/panel-secure";
import PanelOnlyAimbot from "@/components/tutorial/products/panel-only-aimbot";
import MenuChamsEsp    from "@/components/tutorial/products/menu-chams-esp";
import BypassApk       from "@/components/tutorial/products/bypass-apk";
import BypassUidBS     from "@/components/tutorial/products/bypass-uid-bluestacks";
import BypassUidMemu   from "@/components/tutorial/products/bypass-uid-memuplay";

const PRODUCT_MAP = {
  "panel-full":            PanelFull,
  "panel-secure":          PanelSecure,
  "panel-only-aimbot":     PanelOnlyAimbot,
  "menu-chams-esp":        MenuChamsEsp,
  "bypass-apk":            BypassApk,
  "bypass-uid-bluestacks": BypassUidBS,
  "bypass-uid-memuplay":   BypassUidMemu,
};

export default function TutorialPage() {
  const params       = useParams();
  const searchParams = useSearchParams();
  const router       = useRouter();
  const { locale, changeLocale, t } = useLanguage();

  const productId = params?.productId;
  const tx        = t.tutorial;

  const [products,        setProducts]        = useState([]);
  const [currentProduct,  setCurrentProduct]  = useState(null);
  const [loadingProducts, setLoadingProducts] = useState(true);

  const urlSection = searchParams?.get("section");
  const [activeSection, setActiveSection] = useState(urlSection || "general-dependencies");
  const [productOpen,   setProductOpen]   = useState(false);
  const [setupOpen,     setSetupOpen]     = useState(true);
  const [troubleOpen,   setTroubleOpen]   = useState(true);
  const [langOpen,      setLangOpen]      = useState(false);
  const [drawerOpen,    setDrawerOpen]    = useState(false);

  const handleChangeLang = (code) => { changeLocale(code); setLangOpen(false); };

  useEffect(() => {
    fetch("/api/products")
      .then(r => r.json())
      .then(data => {
        const list = Array.isArray(data) ? data : data.products || [];
        setProducts(list);
        const found = list.find(p => p.name?.toLowerCase().replace(/\s+/g, "-") === productId);
        setCurrentProduct(found || null);
        setLoadingProducts(false);
      })
      .catch(() => setLoadingProducts(false));
  }, [productId]);

  useEffect(() => { if (urlSection) setActiveSection(urlSection); }, [urlSection]);

  useEffect(() => {
    const onResize = () => { if (window.innerWidth >= 768) setDrawerOpen(false); };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const handleSectionChange = useCallback((sectionId) => {
    setActiveSection(sectionId);
    const url = new URL(window.location.href);
    url.searchParams.set("section", sectionId);
    router.replace(url.pathname + url.search, { scroll: false });
  }, [router]);

  const productName = currentProduct?.name
    || productId?.replace(/-/g, " ").replace(/\b\w/g, c => c.toUpperCase())
    || "Producto";

  const ProductContent = PRODUCT_MAP[productId];

  return (
    <TutorialLayout
      tx={tx} locale={locale}
      productId={productId} productName={productName}
      products={products} loadingProducts={loadingProducts}
      activeSection={activeSection} handleSectionChange={handleSectionChange}
      handleChangeLang={handleChangeLang}
      productOpen={productOpen} setProductOpen={setProductOpen}
      setupOpen={setupOpen}     setSetupOpen={setSetupOpen}
      troubleOpen={troubleOpen} setTroubleOpen={setTroubleOpen}
      langOpen={langOpen}       setLangOpen={setLangOpen}
      drawerOpen={drawerOpen}   setDrawerOpen={setDrawerOpen}
    >
      {ProductContent
        ? <ProductContent
            key={`${activeSection}-${locale}`}
            section={activeSection}
            productName={productName}
            tx={tx}
          />
        : <ComingSoon productName={productName} tx={tx} />
      }
    </TutorialLayout>
  );
}
