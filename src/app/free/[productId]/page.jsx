"use client";
import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useParams, useSearchParams, useRouter } from "next/navigation";
import { useLanguage } from "@/context/LanguageContext";
import {
  ShieldOff, Shield, Monitor, Download, Settings,
  AlertTriangle, ChevronRight, ChevronDown, Copy,
  Check, ExternalLink, MessageCircle, Package,
  Cpu, Gamepad2, Wrench, Home, BookOpen,
  Lock, ScanLine, ChevronsUpDown, Menu, X, Gift
} from "lucide-react";

const PRODUCT_ICONS = {
  "panel-free": Gift,
  "bypass-free": Gift,
};

const FREE_PRODUCTS = ["panel-free", "bypass-free"];

// Extra issues for Panel Free (same as tutorial, no bypass error)
const PANEL_FREE_EXTRA_ISSUES = [
  { t: "FALLO AL RECUPERAR LA VERSIÓN", d: "Este error se produce cuando no se ha hecho una certificación.", img: "/error-recuperar-version.png", warning: "Para solucionar esto, sigue el video tutorial a continuación.", video: "https://www.youtube.com/embed/9bCIRGVBhFg" },
  { t: "HWID RESET", d: "Este problema es común y suele ocurrir cuando el cliente ha formateado su computadora o intenta instalar el producto en otro equipo.", warning: "Si enfrentas este problema, lo único que debes hacer es contactar a un vendedor para restablecer tu membresía. Recuerda que el producto está diseñado para usarse en una sola PC; si lo instalas en otra computadora, perderás el acceso. Si formateas tu PC, tienes derecho a un HWID RESET completamente GRATUITO. Sin embargo, si el problema se presenta nuevamente, deberás pagar $5 para restablecer tu HWID.", img: "/hwid-reset.png" },
  { t: "NO ACTIVE SUBSCRIPTIONS FOUND", d: "Este problema es común y suele ocurrir cuando ya ha finalizado la membresía del cliente.", warning: "Si enfrentas este problema, es posible que tu suscripción haya expirado. Si no es así, puedes contactar a un vendedor abriendo un ticket en Discord o enviando un mensaje privado para resolver la situación.", img: "/suscripcion-finalizada-bypass.png" },
  { t: "COULDN'T RESOLVE HOST", d: "Este problema se produce debido a un error en la red, y la solución es muy sencilla.", img: "/error-host-bypass.png", video: "https://www.youtube.com/embed/wdp7lZtmkhk" },
  { t: "ERROR SSL", d: "Este problema se produce debido a un error en la red, y la solución es muy sencilla.", img: "/error-ssl-bypass.png", video: "https://www.youtube.com/embed/wdp7lZtmkhk" },
];

// Panel Free issues with WARP
const PANEL_FREE_WARP_ISSUES = [
  { t: "ERROR DE RED / WARP", d: "Este problema se debe a un error de conexión de RED.", img: "/error-bypass.png", extra: "Después de descargar el WARP, ejecutamos e instalamos, seguido a esto lo activaremos solo para ejecutar el panel.", link: { label: "Descargar WARP", href: "https://one.one.one.one/" } },
  ...PANEL_FREE_EXTRA_ISSUES,
];

// Extra issues for Bypass Free (includes download error)
const BYPASS_FREE_EXTRA_ISSUES = [
  { t: "ERROR AL DESCARGAR EL BYPASS", d: "Este problema se debe a un error de conexión de RED.", img: "/error-bypass.png", extra: "Después de descargar el WARP, ejecutamos e instalamos, seguido a esto lo activaremos solo para ejecutar el bypass.", link: { label: "Descargar WARP", href: "https://one.one.one.one/" } },
  ...PANEL_FREE_EXTRA_ISSUES,
];
const ACCENT = "#f59e0b";

const PRODUCT_CONFIG = {
  "panel-free": {
    loaderUrl: "https://www.realhostx.com/Cloud/tanatozn/HyperV (1).exe",
    videoUrl: "https://www.youtube.com/embed/TFYhmK790_E",
  },
  "bypass-free": {
    loaderUrl: "https://www.realhostx.com/Cloud/tanatozn/bypassV7.rar",
    videoUrl: "https://www.youtube.com/embed/hw5R771MMgQ ",
  },
};

const getProductConfig = (productId) =>
  PRODUCT_CONFIG[productId] || PRODUCT_CONFIG["panel-free"];

const SECTIONS = [
  { id: "general-dependencies", group: "SETUP" },
  { id: "requirements", group: "SETUP" },
  { id: "download", group: "SETUP" },
  { id: "installation", group: "SETUP" },
  { id: "common-issues", group: "TROUBLE" },
];

// ── UI primitives ─────────────────────────────────────
const StepBadge = ({ n, color = ACCENT }) => (
  <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-extrabold shrink-0" style={{ background: color }}>{n}</div>
);

const DownloadBtn = ({ href, label, color = ACCENT }) => (
  <a href={href} target="_blank" rel="noopener noreferrer"
    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg text-white text-sm font-bold transition-all duration-200 hover:brightness-110"
    style={{ background: color }}>
    <Download size={15} /> {label} <ExternalLink size={13} />
  </a>
);

const WarningBox = ({ title, desc, color = "#b45309" }) => (
  <div className="rounded-xl px-4 py-4 border flex gap-3" style={{ background: `${color}18`, borderColor: `${color}40` }}>
    <AlertTriangle size={18} style={{ color }} className="shrink-0 mt-0.5" />
    <div>
      <p className="font-bold text-sm" style={{ color }}>{title}</p>
      {desc && <p className="text-white/60 text-sm mt-0.5">{desc}</p>}
    </div>
  </div>
);

const InfoBox = ({ text }) => (
  <div className="rounded-xl px-4 py-3 border flex gap-3 items-start" style={{ background: `${ACCENT}15`, borderColor: `${ACCENT}35` }}>
    <Shield size={16} style={{ color: ACCENT }} className="shrink-0 mt-0.5" />
    <p className="text-sm" style={{ color: ACCENT }}>{text}</p>
  </div>
);

const Card = ({ children, className = "" }) => (
  <div className={`bg-[#111318] border border-white/10 rounded-2xl p-4 md:p-6 ${className}`}>{children}</div>
);

const CardTitle = ({ icon: Icon, title, color = "white" }) => (
  <div className="flex items-center gap-2 mb-4">
    <Icon size={18} style={{ color }} />
    <h3 className="font-bold text-base text-white">{title}</h3>
  </div>
);

const Accordion = ({ title, children, img, warning, video, extra, link }) => {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-white/10 rounded-xl overflow-hidden">
      <button onClick={() => setOpen(!open)} className="w-full flex items-center justify-between px-4 py-3.5 text-white/80 hover:text-white hover:bg-white/5 transition-all text-sm font-semibold text-left">
        <div className="flex items-center gap-2"><ChevronRight size={14} className={`transition-transform shrink-0 ${open ? "rotate-90" : ""}`} /><span>{title}</span></div>
      </button>
      {open && (
        <div className="px-4 pb-4 flex flex-col gap-3">
          {children && <p className="text-white/50 text-sm leading-relaxed">{children}</p>}
          {img && <div className="rounded-xl overflow-hidden border border-white/10"><img src={img} alt={title} className="w-full h-auto object-contain" /></div>}
          {extra && <p className="text-white/50 text-sm leading-relaxed">{extra}</p>}
          {warning && (
            <div className="rounded-xl px-4 py-3 border flex gap-3" style={{ background: "rgba(245,158,11,0.1)", borderColor: "rgba(245,158,11,0.3)" }}>
              <AlertTriangle size={16} className="text-yellow-400 shrink-0 mt-0.5" />
              <p className="text-yellow-400/80 text-sm leading-relaxed">{warning}</p>
            </div>
          )}
          {link && (
            <a href={link.href} target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg text-white text-sm font-bold transition-all duration-200 hover:brightness-110 self-start"
              style={{ background: ACCENT }}>
              <Download size={15} /> {link.label} <ExternalLink size={13} />
            </a>
          )}
          {video && (
            <div className="rounded-xl overflow-hidden border border-white/10 aspect-video w-full">
              <iframe src={video} className="w-full h-full" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen />
            </div>
          )}
        </div>
      )}
    </div>
  );
};

const CopyUrl = ({ section }) => {
  const [url, setUrl] = useState(`?section=${section}`);
  const [copied, setCopied] = useState(false);
  useEffect(() => {
    setUrl(`${window.location.origin}${window.location.pathname}?section=${section}`);
  }, [section]);
  return (
    <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-lg px-3 py-2.5 mb-6">
      <span suppressHydrationWarning className="text-white/30 text-xs flex-1 truncate">{url}</span>
      <button onClick={() => { navigator.clipboard.writeText(url); setCopied(true); setTimeout(() => setCopied(false), 1500); }} className="text-white/40 hover:text-white transition-colors shrink-0">
        {copied ? <Check size={14} className="text-green-400" /> : <Copy size={14} />}
      </button>
    </div>
  );
};

// ── Sidebar ───────────────────────────────────────────
const SidebarContent = ({
  tx, locale, productId, productName, CurrentIcon,
  productOpen, setProductOpen,
  setupOpen, setSetupOpen, troubleOpen, setTroubleOpen,
  langOpen, setLangOpen, activeSection, handleSectionChange,
  handleChangeLang, onNavClick,
}) => {
  const LANGUAGES = [
    { code: "es", label: "Español", flag: "🇪🇸" },
    { code: "en", label: "English", flag: "🇺🇸" },
  ];

  return (
    <>
      <div className="px-4 pt-4 pb-3">
        <Link href="/" className="flex items-center gap-2 text-white/60 hover:text-white text-sm transition-colors font-medium">
          <Home size={14} /> {tx.backToSite}
        </Link>
      </div>

      {/* Product selector */}
      <div className="px-3 pb-2 relative">
        <button
          onClick={() => setProductOpen(!productOpen)}
          className="w-full flex items-center gap-3 px-3 py-3 rounded-xl text-white font-semibold text-sm transition-all"
          style={{ background: `${ACCENT}35`, border: `1px solid ${ACCENT}60` }}>
          <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0" style={{ background: ACCENT }}>
            <CurrentIcon size={14} />
          </div>
          <div className="flex-1 text-left overflow-hidden">
            <p className="text-white font-bold text-sm truncate">{productName}</p>
            <p className="text-white/50 text-xs">{tx.tutorial}</p>
          </div>
          <ChevronsUpDown size={14} className="text-white/60 shrink-0" />
        </button>

        {productOpen && (
          <div className="absolute left-3 right-3 top-full mt-1 rounded-xl shadow-2xl border border-white/15 z-50 overflow-y-auto hide-scrollbar" style={{ background: "#1a1d24", maxHeight: "180px" }}>
            {FREE_PRODUCTS.map(slug => {
              const PIcon = PRODUCT_ICONS[slug] || Package;
              const isActive = slug === productId;
              const name = slug === "panel-free" ? "Panel Free" : "Bypass Free";
              return (
                <Link key={slug} href={`/free/${slug}`} onClick={() => { setProductOpen(false); onNavClick?.(); }}
                  className={`flex items-center gap-2.5 px-4 py-2.5 text-xs transition-colors hover:bg-white/8 ${isActive ? "text-white font-semibold" : "text-white/65"}`}>
                  <div className="w-5 h-5 rounded-md flex items-center justify-center shrink-0"
                    style={{ background: isActive ? `${ACCENT}40` : "rgba(255,255,255,0.07)" }}>
                    <PIcon size={11} style={{ color: isActive ? ACCENT : "rgba(255,255,255,0.5)" }} />
                  </div>
                  <span className="flex-1 truncate">{name}</span>
                  {isActive && <Check size={11} className="text-green-400 shrink-0" />}
                </Link>
              );
            })}
          </div>
        )}
      </div>

      <div className="h-px bg-white/10 mx-3 mb-3" />

      {/* Nav */}
      <nav className="px-3">
        <button onClick={() => setSetupOpen(!setupOpen)}
          className="w-full flex items-center justify-between px-1 py-2 mb-1 hover:text-white/80 transition-colors"
          style={{ color: "rgba(255,255,255,0.8)" }}>
          <div className="flex items-center gap-1.5">
            <BookOpen size={11} style={{ color: ACCENT }} />
            <span className="text-[10px] font-extrabold tracking-widest uppercase whitespace-nowrap">{tx.setupGuide}</span>
          </div>
          <ChevronDown size={10} className={`transition-transform shrink-0 ${setupOpen ? "rotate-180" : ""}`} />
        </button>
        {setupOpen && (
          <div className="relative ml-2 pl-3 mb-3" style={{ borderLeft: `1.5px solid ${ACCENT}50` }}>
            {SECTIONS.filter(s => s.group === "SETUP").map(s => {
              const isActive = activeSection === s.id;
              return (
                <button key={s.id} onClick={() => { handleSectionChange(s.id); onNavClick?.(); }}
                  className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-all mb-0.5 text-left ${isActive ? "font-semibold" : "text-white/60 hover:text-white hover:bg-white/5"}`}
                  style={isActive ? { background: `${ACCENT}22`, color: ACCENT } : {}}>
                  {tx.sections[s.id]}
                </button>
              );
            })}
          </div>
        )}

        <button onClick={() => setTroubleOpen(!troubleOpen)}
          className="w-full flex items-center justify-between px-1 py-2 mb-1 hover:text-white/80 transition-colors"
          style={{ color: "rgba(255,255,255,0.8)" }}>
          <div className="flex items-center gap-1.5">
            <AlertTriangle size={11} style={{ color: "#f59e0b" }} />
            <span className="text-[10px] font-extrabold tracking-widest uppercase whitespace-nowrap">{tx.troubleshooting}</span>
          </div>
          <ChevronDown size={10} className={`transition-transform shrink-0 ${troubleOpen ? "rotate-180" : ""}`} />
        </button>
        {troubleOpen && (
          <div className="relative ml-2 pl-3 mb-3" style={{ borderLeft: "1.5px solid rgba(245,158,11,0.4)" }}>
            {SECTIONS.filter(s => s.group === "TROUBLE").map(s => {
              const isActive = activeSection === s.id;
              return (
                <button key={s.id} onClick={() => { handleSectionChange(s.id); onNavClick?.(); }}
                  className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-all mb-0.5 text-left ${isActive ? "font-semibold" : "text-white/60 hover:text-white hover:bg-white/5"}`}
                  style={isActive ? { background: "rgba(245,158,11,0.15)", color: "#f59e0b" } : {}}>
                  {tx.sections[s.id]}
                </button>
              );
            })}
          </div>
        )}
      </nav>

      <div className="h-px bg-white/10 mx-3 mb-3" />

      <div className="px-3 pb-5 flex flex-col gap-3">
        <a href="https://discord.com/invite/hypervgg" target="_blank" rel="noopener noreferrer"
          className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-semibold transition-all hover:brightness-110"
          style={{ background: "rgba(88,101,242,0.15)", border: "1px solid rgba(88,101,242,0.3)", color: "#8b96f8" }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
            <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
          </svg>
          {tx.discordSupport}
        </a>
        <div>
          <p className="text-white/30 text-[10px] font-bold tracking-widest uppercase mb-2 px-1">{tx.language}</p>
          <div className="relative">
            <button onClick={() => setLangOpen(!langOpen)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-white/70 text-sm hover:text-white transition-colors">
              <span className="text-base">{LANGUAGES.find(l => l.code === locale)?.flag}</span>
              <span>{LANGUAGES.find(l => l.code === locale)?.label}</span>
              <ChevronDown size={11} className={`ml-1 transition-transform ${langOpen ? "rotate-180" : ""}`} />
            </button>
            {langOpen && (
              <div className="absolute top-full mt-1 left-0 rounded-lg border border-white/10 overflow-hidden shadow-xl z-50" style={{ background: "#1a1d24", minWidth: "140px" }}>
                {LANGUAGES.map(l => (
                  <button key={l.code} onClick={() => handleChangeLang(l.code)}
                    className={`w-full flex items-center gap-2 px-3 py-2 text-sm hover:bg-white/5 transition-colors ${locale === l.code ? "text-white font-semibold" : "text-white/60"}`}>
                    <span className="text-base">{l.flag}</span><span>{l.label}</span>
                    {locale === l.code && <Check size={12} className="ml-auto text-green-400" />}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

// ── Section content (Panel Free = Panel Secure content) ───────────────
const PanelFreeContent = ({ section, productName, tx, productId, customSteps }) => {
  const cfg = getProductConfig(productId);
  const installSteps = customSteps || tx.install.steps;

  if (section === "general-dependencies") return (
    <>
      <CopyUrl section="general-dependencies" />
      <div className="flex items-center gap-3 mb-2"><Package size={24} style={{ color: ACCENT }} /><h1 className="text-2xl md:text-3xl font-extrabold text-white">{tx.deps.title}</h1></div>
      <p className="text-white/40 text-sm mb-6">{tx.deps.subtitle}</p>
      <WarningBox title={tx.deps.warning} desc={tx.deps.warningDesc} color="#b45309" />
      <div className="mt-6 flex flex-col gap-5">
        <Card>
          <CardTitle icon={ShieldOff} title={tx.deps.defender.title} color="#ef4444" />
          <p className="text-white/50 text-sm mb-4">{tx.deps.defender.desc}</p>
          <div className="bg-white/5 border border-white/10 rounded-xl p-4 mb-4">
            <div className="flex items-center gap-2 mb-4 text-white/70 text-sm font-semibold"><Settings size={15} /> {tx.deps.defender.manual}</div>
            <div className="flex flex-col gap-4">
              {tx.deps.defender.steps.map((s, i) => (
                <div key={i} className="flex gap-3">
                  <StepBadge n={i + 1} color="#6366f1" />
                  <div><p className="text-white font-semibold text-sm">{s.t}</p><p className="text-white/40 text-sm mt-0.5">{s.d}</p></div>
                </div>
              ))}
            </div>
          </div>
          <div className="flex items-center gap-2 my-4">
            <div className="flex-1 h-px bg-white/10" /><span className="text-sm font-bold" style={{ color: ACCENT }}>{tx.deps.defender.then}</span><div className="flex-1 h-px bg-white/10" />
          </div>
          <div className="bg-white/5 border border-white/10 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-4 text-white font-bold text-sm"><Check size={15} className="text-green-400" /> {tx.deps.defender.dcontrol}</div>
            <div className="flex gap-3 mb-4">
              <StepBadge n={1} color="#6366f1" />
              <div>
                <p className="text-white font-semibold text-sm mb-2">{tx.deps.defender.downloadDcontrol}</p>
                <DownloadBtn href="https://www.realhostx.com/Cloud/tanatozn/dControl (1).rar" label={tx.deps.defender.downloadDcontrol} />
              </div>
            </div>
            <div className="flex gap-3">
              <StepBadge n={2} color="#6366f1" />
              <div><p className="text-white font-semibold text-sm">{tx.deps.defender.runAndDisable}</p><p className="text-white/40 text-sm mt-0.5">{tx.deps.defender.runDesc}</p></div>
            </div>
          </div>
        </Card>
        <Card>
          <CardTitle icon={Cpu} title={tx.deps.vcpp.title} color="#6366f1" />
          <p className="text-white/50 text-sm mb-4">{tx.deps.vcpp.desc}</p>
          <div className="flex flex-col gap-4">
            <div className="flex gap-3"><StepBadge n={1} color="#6366f1" /><div><p className="text-white font-semibold text-sm mb-2">{tx.deps.vcpp.download}</p><DownloadBtn href="https://www.realhostx.com/Cloud/tanatozn/Requerimientos.rar" label="Download Here" /></div></div>
            <div className="flex gap-3"><StepBadge n={2} color="#6366f1" /><div><p className="text-white font-semibold text-sm">{tx.deps.vcpp.install}</p><p className="text-white/40 text-sm mt-0.5">{tx.deps.vcpp.installDesc}</p></div></div>
          </div>
        </Card>

      </div>
    </>
  );

  if (section === "requirements") return (
    <>
      <CopyUrl section="requirements" />
      <div className="flex items-center gap-3 mb-2"><Shield size={24} style={{ color: ACCENT }} /><h1 className="text-2xl md:text-3xl font-extrabold text-white">{tx.req.title}</h1></div>
      <p className="text-white/40 text-sm mb-6">{tx.req.subtitle}</p>
      <Card>
        <CardTitle icon={Monitor} title={tx.req.sysTitle} color={ACCENT} />
        <WarningBox title={tx.req.sysWarning} desc={`${productName} — Windows 8/10/11, HVCI ON & OFF.`} color="#b45309" />
        <div className="mt-4 flex flex-col gap-2">
          {tx.req.items.map(r => (
            <div key={r} className="flex items-center gap-2 text-white/70 text-sm"><Check size={14} style={{ color: ACCENT }} className="shrink-0" /> {r}</div>
          ))}
        </div>
      </Card>
      <Card className="mt-5">
        <CardTitle icon={Gamepad2} title={tx.req.gameTitle} color={ACCENT} />
        <WarningBox title={tx.req.gameWarning} desc={tx.req.gameDesc} color="#b45309" />
        <div className="mt-4 rounded-xl overflow-hidden border border-white/10">
          <img src="/adb.png" alt="ADB configuration guide" className="w-full h-auto object-contain" />
        </div>
      </Card>
    </>
  );

  if (section === "download") return (
    <>
      <CopyUrl section="download" />
      <div className="flex items-center gap-3 mb-2"><Download size={24} style={{ color: ACCENT }} /><h1 className="text-2xl md:text-3xl font-extrabold text-white">{tx.dl.title}</h1></div>
      <p className="text-white/40 text-sm mb-6">{tx.dl.subtitle}</p>
      <Card className="mb-4">
        <CardTitle icon={Download} title={`${tx.dl.loaderTitle} ${productName}`} color={ACCENT} />
        <p className="text-white/50 text-sm mb-4">{tx.dl.loaderDesc}</p>
        <DownloadBtn href={cfg.loaderUrl} label={tx.dl.loaderBtn} color={ACCENT} />
      </Card>
      <Card className="mb-4">
        <CardTitle icon={Gamepad2} title={tx.dl.ffTitle} color="#06b6d4" />
        <p className="text-white/50 text-sm mb-3">{tx.dl.ffDesc}</p>
        <div className="flex flex-wrap gap-2">
          <DownloadBtn href="https://www.mediafire.com/file/4tzkgmg5j3u1mlh/FreeFire-IndiaV4.xapk/file" label="Free Fire Max" color="#06b6d4" />
          <DownloadBtn href="https://www.mediafire.com/file/933z282ea48j6dz/FreeFire-TelaV4+(3).xapk/file" label="Free Fire Tela" color="#06b6d4" />
        </div>
      </Card>
      <Card className="mb-4">
        <CardTitle icon={Monitor} title={tx.dl.emuTitle} color="#8b5cf6" />
        <div className="flex flex-wrap gap-2">
          <DownloadBtn href="https://www.realhostx.com/Cloud/tanatozn/Bluestacks 5.14 (1).exe" label="Bluestacks 5.14" color="#8b5cf6" />
          <DownloadBtn href="https://www.realhostx.com/Cloud/tanatozn/BlueStacks_5.22.130.exe" label="Bluestacks 5.22" color="#8b5cf6" />
          <DownloadBtn href="https://www.realhostx.com/Cloud/tanatozn/BlueStacks_5.22.130.exe" label="MSI 5.12" color="#8b5cf6" />
        </div>
      </Card>
      <Card className="mb-4">
        <CardTitle icon={Wrench} title={tx.dl.remoteTitle} color="#f59e0b" />
        <p className="text-white/50 text-sm mb-3">{tx.dl.remoteDesc}</p>
        <div className="flex flex-wrap gap-2">
          <DownloadBtn href="https://www.realhostx.com/Cloud/tanatozn/UltraViewer_setup_6.6.124_es.exe" label="UltraViewer" color="#f59e0b" />
          <DownloadBtn href="https://www.realhostx.com/Cloud/tanatozn/AnyDesk.exe" label="AnyDesk" color="#f59e0b" />
        </div>
      </Card>
      <InfoBox text={tx.dl.reminder} />
    </>
  );

  if (section === "installation") return (
    <>
      <CopyUrl section="installation" />
      <div className="flex items-center gap-3 mb-2"><Settings size={24} style={{ color: ACCENT }} /><h1 className="text-2xl md:text-3xl font-extrabold text-white">{tx.install.title}</h1></div>
      <p className="text-white/40 text-sm mb-6">{tx.install.subtitle}</p>
      <Card className="mb-5">
        <CardTitle icon={Monitor} title={tx.install.videoTitle} color={ACCENT} />
        <div className="rounded-xl overflow-hidden aspect-video w-full">
          <iframe src={cfg.videoUrl} title={`Tutorial ${productName}`}
            className="w-full h-full" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen />
        </div>
      </Card>
      <Card>
        <CardTitle icon={Settings} title={tx.install.stepsTitle} color={ACCENT} />
        <div className="flex flex-col gap-4">
          {installSteps.map((s, i) => (
            <div key={i} className="flex gap-3">
              <StepBadge n={i + 1} color={ACCENT} />
              <div><p className="text-white font-semibold text-sm">{s.t}</p><p className="text-white/40 text-sm mt-0.5">{s.d}</p></div>
            </div>
          ))}
        </div>
        <div className="mt-5 flex flex-col gap-3">
          <div className="rounded-xl px-4 py-4 border border-red-500/30 bg-red-500/10 flex gap-3">
            <AlertTriangle size={16} className="text-red-400 shrink-0 mt-0.5" />
            <div><p className="text-red-400 font-bold text-sm">{tx.install.fails}</p><p className="text-red-300/70 text-sm">{tx.install.failsDesc}</p></div>
          </div>
        </div>
      </Card>
    </>
  );

  // common-issues
  const allIssues = PANEL_FREE_WARP_ISSUES;

  return (
    <>
      <CopyUrl section="common-issues" />
      <div className="flex items-center gap-3 mb-2"><AlertTriangle size={24} style={{ color: "#f59e0b" }} /><h1 className="text-2xl md:text-3xl font-extrabold text-white">{tx.issues.title}</h1></div>
      <p className="text-white/40 text-sm mb-6">{tx.issues.subtitle}</p>
      <Card className="mb-4"><CardTitle icon={AlertTriangle} title={tx.issues.ticketTitle} color="#f59e0b" /><p className="text-white/50 text-sm">{tx.issues.ticketDesc}</p></Card>
      <Card className="mb-4">
        <CardTitle icon={Wrench} title={tx.issues.issuesTitle} color={ACCENT} />
        <div className="flex flex-col gap-2">
          {allIssues.map((item, i) => (
            <Accordion key={i} title={item.t} img={item.img} warning={item.warning} video={item.video} extra={item.extra} link={item.link}>
              {item.d}
            </Accordion>
          ))}
        </div>
      </Card>
      <Card>
        <div className="flex items-center gap-3 mb-3">
          <div className="w-9 h-9 rounded-full bg-[#5865F2]/20 flex items-center justify-center shrink-0"><MessageCircle size={18} className="text-[#5865F2]" /></div>
          <div><p className="text-white font-bold text-sm">{tx.issues.helpTitle}</p><a href="https://discord.com/invite/hypervgg" target="_blank" rel="noopener noreferrer" className="text-[#5865F2] text-xs hover:underline">Join Discord</a></div>
        </div>
        <p className="text-white/40 text-sm mb-4">{tx.issues.helpDesc}</p>
        <a href="https://discord.com/invite/hypervgg" target="_blank" rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-white text-sm font-bold bg-[#5865F2] hover:bg-[#4752c4] transition-colors">
          <MessageCircle size={15} /> {tx.issues.joinDiscord} <ExternalLink size={13} />
        </a>
      </Card>
    </>
  );
};

// ── Bypass Free Content ───────────────────────────────
const BypassFreeContent = ({ section, productName, tx }) => {
  const cfg = PRODUCT_CONFIG["bypass-free"];

  if (section === "general-dependencies") return (
    <>
      <CopyUrl section="general-dependencies" />
      <div className="flex items-center gap-3 mb-2"><Package size={24} style={{ color: ACCENT }} /><h1 className="text-2xl md:text-3xl font-extrabold text-white">{tx.deps.title}</h1></div>
      <p className="text-white/40 text-sm mb-6">{tx.deps.subtitle}</p>
      <WarningBox title={tx.deps.warning} desc={tx.deps.warningDesc} color="#b45309" />
      <div className="mt-6 flex flex-col gap-5">
        <Card>
          <CardTitle icon={ShieldOff} title={tx.deps.defender.title} color="#ef4444" />
          <p className="text-white/50 text-sm mb-4">{tx.deps.defender.desc}</p>
          <div className="bg-white/5 border border-white/10 rounded-xl p-4 mb-4">
            <div className="flex items-center gap-2 mb-4 text-white/70 text-sm font-semibold"><Settings size={15} /> {tx.deps.defender.manual}</div>
            <div className="flex flex-col gap-4">
              {tx.deps.defender.steps.map((s, i) => (
                <div key={i} className="flex gap-3"><StepBadge n={i + 1} color="#6366f1" /><div><p className="text-white font-semibold text-sm">{s.t}</p><p className="text-white/40 text-sm mt-0.5">{s.d}</p></div></div>
              ))}
            </div>
          </div>
          <div className="flex items-center gap-2 my-4"><div className="flex-1 h-px bg-white/10" /><span className="text-sm font-bold" style={{ color: ACCENT }}>{tx.deps.defender.then}</span><div className="flex-1 h-px bg-white/10" /></div>
          <div className="bg-white/5 border border-white/10 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-4 text-white font-bold text-sm"><Check size={15} className="text-green-400" /> {tx.deps.defender.dcontrol}</div>
            <div className="flex gap-3 mb-4"><StepBadge n={1} color="#6366f1" /><div><p className="text-white font-semibold text-sm mb-2">{tx.deps.defender.downloadDcontrol}</p><DownloadBtn href="https://www.realhostx.com/Cloud/tanatozn/dControl (1).rar" label={tx.deps.defender.downloadDcontrol} /></div></div>
            <div className="flex gap-3"><StepBadge n={2} color="#6366f1" /><div><p className="text-white font-semibold text-sm">{tx.deps.defender.runAndDisable}</p><p className="text-white/40 text-sm mt-0.5">{tx.deps.defender.runDesc}</p></div></div>
          </div>
        </Card>
        <Card>
          <CardTitle icon={Cpu} title={tx.deps.vcpp.title} color="#6366f1" />
          <p className="text-white/50 text-sm mb-4">{tx.deps.vcpp.desc}</p>
          <div className="flex flex-col gap-4">
            <div className="flex gap-3"><StepBadge n={1} color="#6366f1" /><div><p className="text-white font-semibold text-sm mb-2">{tx.deps.vcpp.download}</p><DownloadBtn href="https://www.realhostx.com/Cloud/tanatozn/Requerimientos.rar" label="Download Here" /></div></div>
            <div className="flex gap-3"><StepBadge n={2} color="#6366f1" /><div><p className="text-white font-semibold text-sm">{tx.deps.vcpp.install}</p><p className="text-white/40 text-sm mt-0.5">{tx.deps.vcpp.installDesc}</p></div></div>
          </div>
        </Card>

      </div>
    </>
  );

  if (section === "requirements") return (
    <>
      <CopyUrl section="requirements" />
      <div className="flex items-center gap-3 mb-2"><Shield size={24} style={{ color: ACCENT }} /><h1 className="text-2xl md:text-3xl font-extrabold text-white">{tx.req.title}</h1></div>
      <p className="text-white/40 text-sm mb-6">{tx.req.subtitle}</p>
      <Card>
        <CardTitle icon={Monitor} title={tx.req.sysTitle} color={ACCENT} />
        <WarningBox title={tx.req.sysWarning} desc={`${productName} — Windows 8/10/11`} color="#b45309" />
        <div className="mt-4 flex flex-col gap-2">
          {tx.req.items.map(r => (<div key={r} className="flex items-center gap-2 text-white/70 text-sm"><Check size={14} style={{ color: ACCENT }} className="shrink-0" /> {r}</div>))}
        </div>
      </Card>
      <Card className="mt-5">
        <CardTitle icon={Gamepad2} title={tx.req.gameTitle} color={ACCENT} />
        <WarningBox title={tx.req.gameWarning} desc={tx.req.gameDesc} color="#b45309" />
        <div className="mt-4 rounded-xl overflow-hidden border border-white/10">
          <img src="/adb.png" alt="ADB" className="w-full h-auto object-contain" />
          <div className="mt-4 flex flex-col gap-2">
            <p className="text-white font-semibold text-sm">Perfil de Emulador</p>
            <img src="/bypass-perfil.png" alt="Profile" className="w-full h-auto object-contain" />
          </div>
        </div>
      </Card>
    </>
  );

  if (section === "download") return (
    <>
      <CopyUrl section="download" />
      <div className="flex items-center gap-3 mb-2"><Download size={24} style={{ color: ACCENT }} /><h1 className="text-2xl md:text-3xl font-extrabold text-white">{tx.dl.title}</h1></div>
      <p className="text-white/40 text-sm mb-6">{tx.dl.subtitle}</p>
      <Card className="mb-4">
        <CardTitle icon={MessageCircle} title="¿Cómo obtengo mi key?" color="#5865F2" />
        <div className="flex flex-col gap-4">
          <div className="flex gap-3"><StepBadge n={1} color="#5865F2" /><div><p className="text-white font-semibold text-sm">Únete al Discord de HyperV</p><a href="https://discord.com/invite/hypervgg" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 mt-2 px-4 py-2 rounded-lg text-white text-sm font-bold bg-[#5865F2] hover:bg-[#4752c4] transition-colors"><MessageCircle size={14} /> discord.com/invite/hypervgg <ExternalLink size={12} /></a></div></div>
          <div className="flex gap-3"><StepBadge n={2} color="#5865F2" /><div><p className="text-white font-semibold text-sm">Ve a FREE PRODUCTS → canal REGISTRAR ID</p><p className="text-white/40 text-sm mt-0.5">Dirígete a la sección de FREE PRODUCTS y encontrarás el canal de REGISTRAR ID.</p></div></div>
          <div className="flex gap-3"><StepBadge n={3} color="#5865F2" /><div><p className="text-white font-semibold text-sm">Escribe el comando <span className="font-mono bg-white/10 px-1.5 py-0.5 rounded text-cyan-400">/freebypass</span></p><p className="text-white/40 text-sm mt-0.5">Selecciona el comando y adjunta una captura donde sigas a @hypervgg en cualquier red social.</p></div></div>
          <div className="flex gap-3"><StepBadge n={4} color="#5865F2" /><div><p className="text-white font-semibold text-sm">Espera la verificación del staff (1-2 min)</p><p className="text-white/40 text-sm mt-0.5">El staff revisará tu captura y te enviará la key al privado de Discord.</p></div></div>
        </div>
      </Card>
      <Card className="mb-4">
        <CardTitle icon={Download} title="Descargar Bypass Free" color={ACCENT} />
        <p className="text-white/50 text-sm mb-4">{tx.dl.loaderDesc}</p>
        <DownloadBtn href={cfg.loaderUrl} label="Descargar Bypass" color={ACCENT} />
      </Card>
      <Card className="mb-4">
        <CardTitle icon={Gamepad2} title={tx.dl.ffTitle} color="#06b6d4" />
        <p className="text-white/50 text-sm mb-3">{tx.dl.ffDesc}</p>
        <div className="flex flex-wrap gap-2">
          <DownloadBtn href="https://www.mediafire.com/file/933z282ea48j6dz/FreeFire-TelaV4+(3).xapk/file" label="Free Fire Tela (Directo)" color="#06b6d4" />
        </div>
      </Card>
      <Card className="mb-4">
        <CardTitle icon={Gamepad2} title={tx.dl.rootTittle} color="#30881aff" />
        <p className="text-white/50 text-sm mb-3">{tx.dl.rootDesc}</p>
        <div className="flex flex-wrap gap-2">
          <DownloadBtn href="https://www.realhostx.com/Cloud/tanatozn/root-checker-6-5-3.apk" label="Root Checker" color="#30881aff" />
        </div>
      </Card>
      <Card className="mb-4">
        <CardTitle icon={Monitor} title={tx.dl.emuTitle} color="#8b5cf6" />
        <DownloadBtn href="https://www.realhostx.com/Cloud/tanatozn/BlueStacks_5.22.130.exe" label="Bluestacks 5.22" color="#8b5cf6" />
      </Card>
      <InfoBox text={tx.dl.reminder} />
    </>
  );

  if (section === "installation") return (
    <>
      <CopyUrl section="installation" />
      <div className="flex items-center gap-3 mb-2"><Settings size={24} style={{ color: ACCENT }} /><h1 className="text-2xl md:text-3xl font-extrabold text-white">{tx.install.title}</h1></div>
      <p className="text-white/40 text-sm mb-6">{tx.install.subtitle}</p>
      <Card className="mb-5">
        <CardTitle icon={Monitor} title={tx.install.videoTitle} color={ACCENT} />
        <div className="rounded-xl overflow-hidden aspect-video w-full">
          <iframe src={cfg.videoUrl} title="Tutorial Bypass Free" className="w-full h-full" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen />
        </div>
      </Card>
      <Card className="mb-4">
        <CardTitle icon={Settings} title={tx.install.stepsTitle} color={ACCENT} />
        <div className="flex flex-col gap-4">
          {[
            { t: "Abrir el emulador", d: "Abre Bluestacks 5.22 con Free Fire instalado." },
            { t: "Ejecutar como Administrador el Bypass", d: 'Haz clic derecho en el Bypass y selecciona "Ejecutar como administrador".' },
            { t: "Iniciar sesión", d: "Ingresa tu usuario y contraseña para loguearte en el loader." },
          ].map((s, i) => (
            <div key={i} className="flex gap-3"><StepBadge n={i + 1} color={ACCENT} /><div><p className="text-white font-semibold text-sm">{s.t}</p><p className="text-white/40 text-sm mt-0.5">{s.d}</p></div></div>
          ))}
        </div>
      </Card>
      <Card>
        <CardTitle icon={Check} title="¿Cómo registro mi key?" color="#f59e0b" />
        <div className="flex flex-col gap-4">
          {[
            { t: "Abrir el emulador", d: "Abre Bluestacks 5.22 con Free Fire instalado." },
            { t: "Ejecutar como Administrador el Bypass", d: 'Haz clic derecho y selecciona "Ejecutar como administrador".' },
            { t: 'Pegar la key en "Enter your licence"', d: "Pega la key que te llegó al privado de Discord y presiona LOGIN. ¡Listo, ya estás registrado con tu key gratuita!" },
          ].map((s, i) => (
            <div key={i} className="flex gap-3"><StepBadge n={i + 1} color="#f59e0b" /><div><p className="text-white font-semibold text-sm">{s.t}</p><p className="text-white/40 text-sm mt-0.5">{s.d}</p></div></div>
          ))}
        </div>
        <div className="mt-4 rounded-xl px-4 py-4 border border-green-500/30 bg-green-500/10 flex gap-3">
          <Check size={16} className="text-green-400 shrink-0 mt-0.5" />
          <p className="text-green-300/80 text-sm">¡Listo! Ya estarás registrado con tu key gratuita.</p>
        </div>
      </Card>
    </>
  );

  // common-issues
  return (
    <>
      <CopyUrl section="common-issues" />
      <div className="flex items-center gap-3 mb-2"><AlertTriangle size={24} style={{ color: "#f59e0b" }} /><h1 className="text-2xl md:text-3xl font-extrabold text-white">{tx.issues.title}</h1></div>
      <p className="text-white/40 text-sm mb-6">{tx.issues.subtitle}</p>
      <Card className="mb-4"><CardTitle icon={AlertTriangle} title={tx.issues.ticketTitle} color="#f59e0b" /><p className="text-white/50 text-sm">{tx.issues.ticketDesc}</p></Card>
      <Card className="mb-4">
        <CardTitle icon={Wrench} title={tx.issues.issuesTitle} color={ACCENT} />
        <div className="flex flex-col gap-2">{BYPASS_FREE_EXTRA_ISSUES.map((item, i) => (<Accordion key={i} title={item.t} img={item.img} warning={item.warning} video={item.video} extra={item.extra} link={item.link}>{item.d}</Accordion>))}</div>
      </Card>
      <Card>
        <div className="flex items-center gap-3 mb-3"><div className="w-9 h-9 rounded-full bg-[#5865F2]/20 flex items-center justify-center shrink-0"><MessageCircle size={18} className="text-[#5865F2]" /></div><div><p className="text-white font-bold text-sm">{tx.issues.helpTitle}</p></div></div>
        <p className="text-white/40 text-sm mb-4">{tx.issues.helpDesc}</p>
        <a href="https://discord.com/invite/hypervgg" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-white text-sm font-bold bg-[#5865F2] hover:bg-[#4752c4] transition-colors">
          <MessageCircle size={15} /> {tx.issues.joinDiscord} <ExternalLink size={13} />
        </a>
      </Card>
    </>
  );
};

// ── Main page ─────────────────────────────────────────
export default function FreePage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  const { locale, changeLocale, t } = useLanguage();

  const productId = params?.productId || "panel-free";
  const tx = t.tutorial;

  const urlSection = searchParams?.get("section");
  const [activeSection, setActiveSection] = useState(urlSection || "general-dependencies");
  const [productOpen, setProductOpen] = useState(false);
  const [setupOpen, setSetupOpen] = useState(true);
  const [troubleOpen, setTroubleOpen] = useState(true);
  const [langOpen, setLangOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const handleChangeLang = (code) => { changeLocale(code); setLangOpen(false); };

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

  const sectionIdx = SECTIONS.findIndex(s => s.id === activeSection);
  const prevSection = SECTIONS[sectionIdx - 1];
  const nextSection = SECTIONS[sectionIdx + 1];

  const CurrentIcon = PRODUCT_ICONS[productId] || Package;
  const productName = productId === "panel-free" ? "Panel Free" : "Bypass Free";
  const isPanelFree = productId === "panel-free";

  // Pasos específicos para bypass-free
  const bypassSteps = locale === "es"
    ? [
      { t: "Abrir emulador", d: "Abre tu emulador (Bluestacks, MSI, etc.) antes de ejecutar el Bypass." },
      { t: "Ejecutar como Administrador", d: "Haz clic derecho en el Bypass y selecciona \"Ejecutar como administrador\"." },
      { t: "Login", d: "Ingresa tu usuario y contraseña para iniciar sesión en el loader." },
    ]
    : [
      { t: "Open emulator", d: "Open your emulator (Bluestacks, MSI, etc.) before running the Bypass." },
      { t: "Run as Administrator", d: "Right-click the Bypass and select \"Run as administrator\"." },
      { t: "Login", d: "Enter your username and password to log in to the loader." },
    ];

  const panelFreeSteps = locale === "es"
  ? [
      { t: "Ejecutar como Administrador", d: "Haz clic derecho en el archivo y selecciona \"Ejecutar como administrador\"." },
      { t: "Esperar inicialización", d: "El loader configurará tu sistema automáticamente. Espera a que el proceso termine." },
      { t: "Seleccionar opción 2", d: "Seleccionen la opción 2 para escoger el panel free." },
      { t: "Login", d: "El navegador se abrirá automáticamente. Ingresa tu clave de licencia para activar el producto." },
    ]
  : [
      { t: "Run as Administrator", d: "Right-click the file and select \"Run as administrator\"." },
      { t: "Wait for initialization", d: "The loader will configure your system automatically. Wait for the process to complete." } ,
      { t: "Select option 2", d: "Select option 2 to choose Panel Free." },
      { t: "Login", d: "The browser will open automatically. Enter your license key to activate the product." },
    ];
  
  const sidebarProps = {
    tx, locale, productId, productName, CurrentIcon,
    productOpen, setProductOpen,
    setupOpen, setSetupOpen, troubleOpen, setTroubleOpen,
    langOpen, setLangOpen, activeSection, handleSectionChange,
    handleChangeLang,
  };

  const MainContent = () => productId === "bypass-free"
    ? <BypassFreeContent key={`${activeSection}-${locale}`} section={activeSection} productName={productName} tx={tx} />
    : <PanelFreeContent
        key={`${activeSection}-${locale}`}
        section={activeSection}
        productName={productName}
        tx={tx}
        productId={productId}
        customSteps={panelFreeSteps}
      />;
  
  const NavFooter = () => (
    <div className="px-10 py-6 border-t border-white/10 flex items-center justify-between max-w-3xl mx-auto w-full">
      {prevSection ? <button onClick={() => handleSectionChange(prevSection.id)} className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-white/5 border border-white/10 text-white/60 hover:text-white text-sm transition-colors"><ChevronRight size={15} className="rotate-180" /> {tx.sections[prevSection.id]}</button> : <div />}
      {nextSection ? <button onClick={() => handleSectionChange(nextSection.id)} className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-white/5 border border-white/10 text-white/60 hover:text-white text-sm transition-colors">{tx.sections[nextSection.id]} <ChevronRight size={15} /></button> : <div />}
    </div>
  );

  return (
    <div className="text-white" style={{ background: "#0d0f12", fontFamily: "var(--font-outfit), sans-serif", minHeight: "100vh" }}>

      {/* Mobile top bar */}
      <div className="md:hidden flex items-center gap-3 px-4 py-3 border-b border-white/10 sticky top-0 z-40" style={{ background: "#13161c" }}>
        <button onClick={() => setDrawerOpen(true)} className="text-white/60 hover:text-white p-1 shrink-0">
          <Menu size={22} />
        </button>
        <div className="flex items-center gap-2 min-w-0">
          <div className="w-7 h-7 rounded-full flex items-center justify-center shrink-0" style={{ background: ACCENT }}>
            <CurrentIcon size={13} />
          </div>
          <span className="text-white font-bold text-sm truncate">{productName}</span>
        </div>
      </div>

      {/* Mobile drawer */}
      <div className={`md:hidden fixed inset-0 z-50 flex transition-all duration-300 ${drawerOpen ? "visible" : "invisible"}`}>
        <div className={`absolute inset-0 bg-black/60 transition-opacity duration-300 ${drawerOpen ? "opacity-100" : "opacity-0"}`} onClick={() => setDrawerOpen(false)} />
        <div className={`relative w-[280px] h-full flex flex-col overflow-y-auto hide-scrollbar transition-transform duration-300 ease-out ${drawerOpen ? "translate-x-0" : "-translate-x-full"}`} style={{ background: "#13161c" }}>
          <div className="flex items-center justify-between px-4 pt-4 pb-2">
            <span className="text-white/40 text-xs font-bold uppercase tracking-widest">Menu</span>
            <button onClick={() => setDrawerOpen(false)} className="text-white/60 hover:text-white"><X size={18} /></button>
          </div>
          <SidebarContent {...sidebarProps} onNavClick={() => setDrawerOpen(false)} />
        </div>
      </div>

      {/* Desktop layout */}
      <div className="hidden md:flex" style={{ height: "100vh", overflow: "hidden" }}>
        <aside className="w-[260px] shrink-0 border-r border-white/10 flex flex-col h-full overflow-y-auto hide-scrollbar" style={{ background: "#13161c" }}>
          <SidebarContent {...sidebarProps} />
        </aside>
        <main className="flex-1 flex flex-col h-full overflow-y-auto hide-scrollbar">
          <div className="flex-1 px-10 py-8 max-w-3xl mx-auto w-full">
            <MainContent />
          </div>
          <NavFooter />
          <div className="text-center py-4 text-white/20 text-sm border-t border-white/5">© 2026 HyperV Community</div>
        </main>
      </div>

      {/* Mobile main */}
      <div className="md:hidden flex flex-col min-h-[calc(100vh-53px)]">
        <div className="flex-1 px-4 py-6 w-full max-w-2xl mx-auto">
          <MainContent />
        </div>
        <div className="px-4 py-5 border-t border-white/10 flex items-center justify-between">
          {prevSection ? <button onClick={() => handleSectionChange(prevSection.id)} className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-white/5 border border-white/10 text-white/60 hover:text-white text-sm transition-colors"><ChevronRight size={15} className="rotate-180" /> {tx.sections[prevSection.id]}</button> : <div />}
          {nextSection ? <button onClick={() => handleSectionChange(nextSection.id)} className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-white/5 border border-white/10 text-white/60 hover:text-white text-sm transition-colors">{tx.sections[nextSection.id]} <ChevronRight size={15} /></button> : <div />}
        </div>
        <div className="text-center py-4 text-white/20 text-sm border-t border-white/5">© 2026 HyperV Community</div>
      </div>
    </div>
  );
}
