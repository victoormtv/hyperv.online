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
  Crosshair, Smartphone, Zap, Code2, Swords,
  Eye, Lock, Wifi, ScanLine, Target, Layers, ChevronsUpDown
} from "lucide-react";

const PRODUCT_ICONS = {
  "panel-full":             Layers,
  "panel-secure":           Lock,
  "panel-only-aimbot":      Target,
  "menu-chams-esp":         Eye,
  "bypass-apk":             Code2,
  "bypass-uid":             ScanLine,
  "panel-android":          Smartphone,
  "aimbot-body-android":    Crosshair,
  "panel-ios":              Smartphone,
  "aimbot-body-ios":        Crosshair,
  "aimlock":                Zap,
  "regedit":                Settings,
  "aimbot-color":           Swords,
  "panel-csgo":             Shield,
  "panel-warzone":          Wifi,
  "menu-chams-bloodstrike": Eye,
  "discord-tools":          MessageCircle,
};

const GROUP1 = ["panel-full", "panel-secure", "panel-only-aimbot", "menu-chams-esp"];
const ACCENT  = "#369876";

const PRODUCT_CONFIG = {
  "panel-full":        { loaderUrl: "https://www.asuswebstorage.com/navigate/a/#/s/0BAB1D4426C74D55A0C9EA249CE188B14",                    videoUrl: "https://www.youtube.com/embed/jFsVHEAIYco" },
  "panel-secure":      { loaderUrl: "https://www.asuswebstorage.com/navigate/a/#/s/0BAB1D4426C74D55A0C9EA249CE188B14www.asuswebstorage.com", videoUrl: "https://www.youtube.com/embed/TFYhmK790_E" },
  "panel-only-aimbot": { loaderUrl: "https://www.asuswebstorage.com/navigate/a/#/s/0BAB1D4426C74D55A0C9EA249CE188B14www.asuswebstorage.com", videoUrl: "https://www.youtube.com/embed/v5xQizRQsbA" },
  "menu-chams-esp":    { loaderUrl: "https://www.asuswebstorage.com/navigate/a/#/s/0BAB1D4426C74D55A0C9EA249CE188B14www.asuswebstorage.com", videoUrl: "https://www.youtube.com/embed/-Qx6tal1_EY" },
};

const getProductConfig = (productId) =>
  PRODUCT_CONFIG[productId] || PRODUCT_CONFIG["panel-full"];

const SECTIONS = [
  { id: "general-dependencies", group: "SETUP" },
  { id: "requirements",         group: "SETUP" },
  { id: "download",             group: "SETUP" },
  { id: "installation",         group: "SETUP" },
  { id: "common-issues",        group: "TROUBLE" },
];

// ── UI primitives ─────────────────────────────────────
const StepBadge = ({ n, color = ACCENT }) => (
  <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-extrabold shrink-0" style={{ background: color }}>{n}</div>
);

const DownloadBtn = ({ href, label, color = ACCENT }) => (
  <a href={href} target="_blank" rel="noopener noreferrer"
    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-white text-sm font-bold transition-all duration-200 hover:scale-105 hover:brightness-110"
    style={{ background: color }}>
    <Download size={15} /> {label} <ExternalLink size={13} />
  </a>
);

const WarningBox = ({ title, desc, color = "#b45309" }) => (
  <div className="rounded-xl px-5 py-4 border flex gap-3" style={{ background: `${color}18`, borderColor: `${color}40` }}>
    <AlertTriangle size={18} style={{ color }} className="shrink-0 mt-0.5" />
    <div>
      <p className="font-bold text-sm" style={{ color }}>{title}</p>
      {desc && <p className="text-white/60 text-sm mt-0.5">{desc}</p>}
    </div>
  </div>
);

const InfoBox = ({ text }) => (
  <div className="rounded-xl px-5 py-3 border flex gap-3 items-start" style={{ background: `${ACCENT}15`, borderColor: `${ACCENT}35` }}>
    <Shield size={16} style={{ color: ACCENT }} className="shrink-0 mt-0.5" />
    <p className="text-sm" style={{ color: ACCENT }}>{text}</p>
  </div>
);

const Card = ({ children, className = "" }) => (
  <div className={`bg-[#111318] border border-white/10 rounded-2xl p-6 ${className}`}>{children}</div>
);

const CardTitle = ({ icon: Icon, title, color = "white" }) => (
  <div className="flex items-center gap-2 mb-4">
    <Icon size={18} style={{ color }} />
    <h3 className="font-bold text-base text-white">{title}</h3>
  </div>
);

const Accordion = ({ title, children }) => {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-white/10 rounded-xl overflow-hidden">
      <button onClick={() => setOpen(!open)} className="w-full flex items-center justify-between px-5 py-3.5 text-white/80 hover:text-white hover:bg-white/5 transition-all text-sm font-semibold">
        <div className="flex items-center gap-2"><ChevronRight size={14} className={`transition-transform ${open ? "rotate-90" : ""}`} />{title}</div>
      </button>
      {open && <div className="px-5 pb-4 text-white/50 text-sm leading-relaxed">{children}</div>}
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
    <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 mb-6">
      <span suppressHydrationWarning className="text-white/30 text-xs flex-1 truncate">{url}</span>
      <button onClick={() => { navigator.clipboard.writeText(url); setCopied(true); setTimeout(() => setCopied(false), 1500); }} className="text-white/40 hover:text-white transition-colors">
        {copied ? <Check size={14} className="text-green-400" /> : <Copy size={14} />}
      </button>
    </div>
  );
};

// ── Section content ───────────────────────────────────
const Group1Content = ({ section, productName, tx, productId }) => {
  const cfg = getProductConfig(productId);

  if (section === "general-dependencies") return (
    <>
      <CopyUrl section="general-dependencies" />
      <div className="flex items-center gap-3 mb-2"><Package size={28} style={{ color: ACCENT }} /><h1 className="text-3xl font-extrabold text-white">{tx.deps.title}</h1></div>
      <p className="text-white/40 text-sm mb-6">{tx.deps.subtitle}</p>
      <WarningBox title={tx.deps.warning} desc={tx.deps.warningDesc} color="#b45309" />
      <div className="mt-6 flex flex-col gap-5">
        <Card>
          <CardTitle icon={ShieldOff} title={tx.deps.defender.title} color="#ef4444" />
          <p className="text-white/50 text-sm mb-4">{tx.deps.defender.desc}</p>
          <div className="bg-white/5 border border-white/10 rounded-xl p-5 mb-4">
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
          <div className="bg-white/5 border border-white/10 rounded-xl p-5">
            <div className="flex items-center gap-2 mb-4 text-white font-bold text-sm"><Check size={15} className="text-green-400" /> {tx.deps.defender.dcontrol}</div>
            <div className="flex gap-3 mb-4">
              <StepBadge n={1} color="#6366f1" />
              <div>
                <p className="text-white font-semibold text-sm mb-2">{tx.deps.defender.downloadDcontrol}</p>
                <DownloadBtn href="https://mega.nz/file/t4pGwaRQ#uDFuTSEL0mw5zSpnYMtj1_0FGbQB8SpcLsOdRrk4vpg" label={tx.deps.defender.downloadDcontrol} />
                <p className="text-white/30 text-sm mt-2">{tx.deps.defender.password}: <span className="text-white/60 font-mono">sordum</span></p>
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
            <div className="flex gap-3"><StepBadge n={1} color="#6366f1" /><div><p className="text-white font-semibold text-sm mb-2">{tx.deps.vcpp.download}</p><DownloadBtn href="https://mega.nz/file/N1xTTARA#WxtglCiFrvoyQVmDc2Ib-oWtIOu7kbhloiK825_cPQg" label="Download Here" /></div></div>
            <div className="flex gap-3"><StepBadge n={2} color="#6366f1" /><div><p className="text-white font-semibold text-sm">{tx.deps.vcpp.install}</p><p className="text-white/40 text-sm mt-0.5">{tx.deps.vcpp.installDesc}</p></div></div>
          </div>
        </Card>
        <Card>
          <CardTitle icon={Monitor} title={tx.deps.directx.title} color="#f59e0b" />
          <p className="text-white/50 text-sm mb-4">{tx.deps.directx.desc}</p>
          <div className="flex flex-col gap-4">
            <div className="flex gap-3"><StepBadge n={1} color="#f59e0b" /><div><p className="text-white font-semibold text-sm mb-2">{tx.deps.directx.download}</p><DownloadBtn href="https://mega.nz/file/N1xTTARA#WxtglCiFrvoyQVmDc2Ib-oWtIOu7kbhloiK825_cPQg" label="Download Here" color="#f59e0b" /></div></div>
            <div className="flex gap-3"><StepBadge n={2} color="#f59e0b" /><div><p className="text-white font-semibold text-sm">{tx.deps.directx.install}</p><p className="text-white/40 text-sm mt-0.5">{tx.deps.directx.installDesc}</p></div></div>
          </div>
        </Card>
      </div>
    </>
  );

  if (section === "requirements") return (
    <>
      <CopyUrl section="requirements" />
      <div className="flex items-center gap-3 mb-2"><Shield size={28} style={{ color: ACCENT }} /><h1 className="text-3xl font-extrabold text-white">{tx.req.title}</h1></div>
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
      <div className="flex items-center gap-3 mb-2"><Download size={28} style={{ color: ACCENT }} /><h1 className="text-3xl font-extrabold text-white">{tx.dl.title}</h1></div>
      <p className="text-white/40 text-sm mb-6">{tx.dl.subtitle}</p>
      <Card className="mb-4">
        <CardTitle icon={Download} title={`${tx.dl.loaderTitle} ${productName}`} color={ACCENT} />
        <p className="text-white/50 text-sm mb-4">{tx.dl.loaderDesc}</p>
        <DownloadBtn href={cfg.loaderUrl} label={tx.dl.loaderBtn} color={ACCENT} />
      </Card>
      <Card className="mb-4">
        <CardTitle icon={Gamepad2} title={tx.dl.ffTitle} color="#06b6d4" />
        <p className="text-white/50 text-sm mb-3">{tx.dl.ffDesc}</p>
        <div className="flex flex-wrap gap-3">
          <DownloadBtn href="https://www.mediafire.com/file/xehwqjz68lnrtvp/FreeFire-NormalV4.xapk/file" label="Free Fire Normal" color="#06b6d4" />
          <DownloadBtn href="https://www.mediafire.com/file/4tzkgmg5j3u1mlh/FreeFire-IndiaV4.xapk/file" label="Free Fire Max" color="#06b6d4" />
          <DownloadBtn href="https://www.mediafire.com/file/17ctvd6v86q1iap/FreeFire-TelaV4.xapk/file" label="Free Fire Tela" color="#06b6d4" />
        </div>
      </Card>
      <Card className="mb-4">
        <CardTitle icon={Monitor} title={tx.dl.emuTitle} color="#8b5cf6" />
        <div className="flex flex-wrap gap-3">
          <DownloadBtn href="https://www.asuswebstorage.com/navigate/a/#/s/0BAB1D4426C74D55A0C9EA249CE188B14" label="Bluestacks 5.14" color="#8b5cf6" />
          <DownloadBtn href="https://www.asuswebstorage.com/navigate/a/#/s/0BAB1D4426C74D55A0C9EA249CE188B14" label="Bluestacks 5.22" color="#8b5cf6" />
          <DownloadBtn href="https://www.asuswebstorage.com/navigate/a/#/s/0BAB1D4426C74D55A0C9EA249CE188B14" label="MSI 5.12" color="#8b5cf6" />
        </div>
      </Card>
      <Card className="mb-4">
        <CardTitle icon={Wrench} title={tx.dl.remoteTitle} color="#f59e0b" />
        <p className="text-white/50 text-sm mb-3">{tx.dl.remoteDesc}</p>
        <div className="flex flex-wrap gap-3">
          <DownloadBtn href="https://www.asuswebstorage.com/navigate/a/#/s/58AA5A55303549DB8831FAA948E2A1DE4" label="UltraViewer" color="#f59e0b" />
          <DownloadBtn href="https://www.asuswebstorage.com/navigate/a/#/s/0BAB1D4426C74D55A0C9EA249CE188B14" label="AnyDesk" color="#f59e0b" />
        </div>
      </Card>
      <InfoBox text={tx.dl.reminder} />
    </>
  );

  if (section === "installation") return (
    <>
      <CopyUrl section="installation" />
      <div className="flex items-center gap-3 mb-2"><Settings size={28} style={{ color: ACCENT }} /><h1 className="text-3xl font-extrabold text-white">{tx.install.title}</h1></div>
      <p className="text-white/40 text-sm mb-6">{tx.install.subtitle}</p>
      <Card className="mb-5">
        <CardTitle icon={Monitor} title={tx.install.videoTitle} color={ACCENT} />
        <div className="rounded-xl overflow-hidden aspect-video w-full">
          <iframe src={cfg.videoUrl} title={`Tutorial HyperV ${productName}`}
            className="w-full h-full" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen />
        </div>
      </Card>
      <Card>
        <CardTitle icon={Settings} title={tx.install.stepsTitle} color={ACCENT} />
        <div className="flex flex-col gap-4">
          {tx.install.steps.map((s, i) => (
            <div key={i} className="flex gap-3">
              <StepBadge n={i + 1} color={ACCENT} />
              <div><p className="text-white font-semibold text-sm">{s.t}</p><p className="text-white/40 text-sm mt-0.5">{s.d}</p></div>
            </div>
          ))}
        </div>
        <div className="mt-5 flex flex-col gap-3">
          <div className="rounded-xl px-5 py-4 border border-green-500/30 bg-green-500/10 flex gap-3">
            <Check size={16} className="text-green-400 shrink-0 mt-0.5" />
            <div><p className="text-green-400 font-bold text-sm">{tx.install.works}</p><p className="text-green-300/70 text-sm">{tx.install.worksDesc}</p></div>
          </div>
          <div className="rounded-xl px-5 py-4 border border-red-500/30 bg-red-500/10 flex gap-3">
            <AlertTriangle size={16} className="text-red-400 shrink-0 mt-0.5" />
            <div><p className="text-red-400 font-bold text-sm">{tx.install.fails}</p><p className="text-red-300/70 text-sm">{tx.install.failsDesc}</p></div>
          </div>
        </div>
      </Card>
    </>
  );

  return (
    <>
      <CopyUrl section="common-issues" />
      <div className="flex items-center gap-3 mb-2"><AlertTriangle size={28} style={{ color: "#f59e0b" }} /><h1 className="text-3xl font-extrabold text-white">{tx.issues.title}</h1></div>
      <p className="text-white/40 text-sm mb-6">{tx.issues.subtitle}</p>
      <Card className="mb-4"><CardTitle icon={AlertTriangle} title={tx.issues.ticketTitle} color="#f59e0b" /><p className="text-white/50 text-sm">{tx.issues.ticketDesc}</p></Card>
      <Card className="mb-4">
        <CardTitle icon={Wrench} title={tx.issues.issuesTitle} color={ACCENT} />
        <div className="flex flex-col gap-2">
          {tx.issues.items.map((item, i) => <Accordion key={i} title={item.t}>{item.d}</Accordion>)}
        </div>
      </Card>
      <Card>
        <div className="flex items-center gap-3 mb-3">
          <div className="w-9 h-9 rounded-full bg-[#5865F2]/20 flex items-center justify-center"><MessageCircle size={18} className="text-[#5865F2]" /></div>
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

const ComingSoon = ({ productName, tx }) => (
  <div className="flex flex-col items-center justify-center py-24 text-center">
    <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-6" style={{ background: `${ACCENT}20`, border: `1px solid ${ACCENT}40` }}>
      <Package size={28} style={{ color: ACCENT }} />
    </div>
    <h2 className="text-2xl font-extrabold text-white mb-3">{productName}</h2>
    <p className="text-white/40 text-sm max-w-sm">
      {tx.tutorial === "Tutorial"
        ? "Tutorial coming soon. Contact support on Discord."
        : "Tutorial próximamente disponible. Contacta soporte en Discord."}
    </p>
    <a href="https://discord.com/invite/hypervgg" target="_blank" rel="noopener noreferrer"
      className="mt-6 inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-white text-sm font-bold bg-[#5865F2] hover:bg-[#4752c4] transition-colors">
      <MessageCircle size={15} /> Discord <ExternalLink size={13} />
    </a>
  </div>
);

// ── Main page ─────────────────────────────────────────
export default function TutorialPage() {
  const params       = useParams();
  const searchParams = useSearchParams();
  const router       = useRouter();
  const { locale, changeLocale, t } = useLanguage();

  const productId = params?.productId;
  // Use t.tutorial from LanguageContext — no local T object needed
  const tx = t.tutorial;

  const [products,        setProducts]        = useState([]);
  const [currentProduct,  setCurrentProduct]  = useState(null);
  const [loadingProducts, setLoadingProducts] = useState(true);

  const urlSection = searchParams?.get("section");
  const [activeSection, setActiveSection] = useState(urlSection || "general-dependencies");

  const [productOpen, setProductOpen] = useState(false);
  const [setupOpen,   setSetupOpen]   = useState(true);
  const [troubleOpen, setTroubleOpen] = useState(true);
  const [langOpen,    setLangOpen]    = useState(false);
  const productBtnRef = React.useRef(null);
  const [dropdownTop, setDropdownTop] = useState(0);

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

  const handleSectionChange = useCallback((sectionId) => {
    setActiveSection(sectionId);
    const url = new URL(window.location.href);
    url.searchParams.set("section", sectionId);
    router.replace(url.pathname + url.search, { scroll: false });
  }, [router]);

  const sectionIdx  = SECTIONS.findIndex(s => s.id === activeSection);
  const prevSection = SECTIONS[sectionIdx - 1];
  const nextSection = SECTIONS[sectionIdx + 1];

  const CurrentIcon = PRODUCT_ICONS[productId] || Package;
  const productName = currentProduct?.name || productId?.replace(/-/g, " ").replace(/\b\w/g, c => c.toUpperCase()) || "Producto";
  const isGroup1    = GROUP1.includes(productId);

  const LANGUAGES = [
    { code: "es", label: "Español", flag: "🇪🇸" },
    { code: "en", label: "English", flag: "🇺🇸" },
  ];

  return (
    <div className="text-white flex" style={{ background: "#0d0f12", fontFamily: "var(--font-outfit), sans-serif", height: "100vh", overflow: "hidden" }}>

      {/* ── Sidebar ── */}
      <aside className="w-[260px] shrink-0 border-r border-white/10 flex flex-col h-full overflow-y-auto hide-scrollbar" style={{ background: "#13161c" }}>
        <div className="px-4 pt-4 pb-3">
          <Link href="/" className="flex items-center gap-2 text-white/60 hover:text-white text-sm transition-colors font-medium">
            <Home size={14} /> {tx.backToSite}
          </Link>
        </div>

        <div className="px-3 pb-2">
          <button
            ref={productBtnRef}
            onClick={() => {
              if (!productOpen && productBtnRef.current) {
                const rect = productBtnRef.current.getBoundingClientRect();
                setDropdownTop(rect.bottom + 4);
              }
              setProductOpen(!productOpen);
            }}
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
            <div className="fixed rounded-xl shadow-2xl border border-white/15 hide-scrollbar"
              style={{ background: "#1a1d24", maxHeight: "300px", overflowY: "auto", width: "236px", left: "12px",
                top: dropdownTop > 0 ? `${dropdownTop}px` : productBtnRef.current ? `${productBtnRef.current.getBoundingClientRect().bottom + 4}px` : "120px", zIndex: 9999 }}>
              {loadingProducts
                ? <div className="px-4 py-3 text-white/40 text-xs">{tx.loading}</div>
                : products.map(p => {
                    const slug   = p.name?.toLowerCase().replace(/\s+/g, "-");
                    const PIcon  = PRODUCT_ICONS[slug] || Package;
                    const isActive = slug === productId;
                    return (
                      <Link key={p.id} href={`/tutorial/${slug}`} onClick={() => setProductOpen(false)}
                        className={`flex items-center gap-2.5 px-4 py-2.5 text-xs transition-colors hover:bg-white/8 ${isActive ? "text-white font-semibold" : "text-white/65"}`}>
                        <div className="w-5 h-5 rounded-md flex items-center justify-center shrink-0"
                          style={{ background: isActive ? `${ACCENT}40` : "rgba(255,255,255,0.07)" }}>
                          <PIcon size={11} style={{ color: isActive ? ACCENT : "rgba(255,255,255,0.5)" }} />
                        </div>
                        <span className="flex-1 truncate">{p.name}</span>
                        {isActive && <Check size={11} className="text-green-400 shrink-0" />}
                      </Link>
                    );
                  })
              }
            </div>
          )}
        </div>

        <div className="h-px bg-white/10 mx-3 mb-3" />

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
                  <button key={s.id} onClick={() => handleSectionChange(s.id)}
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
                  <button key={s.id} onClick={() => handleSectionChange(s.id)}
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
              <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/>
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
                <div className="absolute top-full mt-1 left-0 rounded-lg border border-white/10 overflow-hidden shadow-xl z-10" style={{ background: "#1a1d24", minWidth: "140px" }}>
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
      </aside>

      {/* ── Main ── */}
      <main className="flex-1 flex flex-col h-full overflow-y-auto hide-scrollbar">
        <div className="flex-1 px-10 py-8 max-w-3xl mx-auto w-full">
          {isGroup1
            ? <Group1Content key={`${activeSection}-${locale}`} section={activeSection} productName={productName} tx={tx} productId={productId} />
            : <ComingSoon productName={productName} tx={tx} />
          }
        </div>

        {isGroup1 && (
          <div className="px-10 py-6 border-t border-white/10 flex items-center justify-between max-w-3xl mx-auto w-full">
            {prevSection
              ? <button onClick={() => handleSectionChange(prevSection.id)} className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-white/5 border border-white/10 text-white/60 hover:text-white text-sm transition-colors">
                  <ChevronRight size={15} className="rotate-180" /> {tx.sections[prevSection.id]}
                </button>
              : <div />}
            {nextSection
              ? <button onClick={() => handleSectionChange(nextSection.id)} className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-white/5 border border-white/10 text-white/60 hover:text-white text-sm transition-colors">
                  {tx.sections[nextSection.id]} <ChevronRight size={15} />
                </button>
              : <div />}
          </div>
        )}

        <div className="text-center py-4 text-white/20 text-sm border-t border-white/5">© 2026 HyperV Community</div>
      </main>
    </div>
  );
}
