import {
  Shield,
  Settings,
  MessageCircle,
  Crosshair,
  Smartphone,
  Zap,
  Code2,
  Swords,
  Eye,
  Lock,
  Wifi,
  ScanLine,
  Target,
  Layers,
} from "lucide-react";

export const ACCENT = "#369876";

export const PRODUCT_ICONS = {
  "panel-full": Layers,
  "panel-secure": Lock,
  "panel-only-aimbot": Target,
  "menu-chams-esp": Eye,
  "bypass-apk": Code2,
  "bypass-uid-bluestacks": ScanLine,
  "bypass-uid-memuplay": ScanLine,
  "panel-android": Smartphone,
  "aimbot-body-android": Crosshair,
  "panel-ios": Smartphone,
  "aimbot-body-ios": Crosshair,
  aimlock: Zap,
  regedit: Settings,
  "aimbot-color": Swords,
  "panel-csgo": Shield,
  "panel-warzone": Wifi,
  "menu-chams-bloodstrike": Eye,
  "discord-tools": MessageCircle,
};

export const SECTIONS = [
  { id: "general-dependencies", group: "SETUP" },
  { id: "requirements", group: "SETUP" },
  { id: "download", group: "SETUP" },
  { id: "installation", group: "SETUP" },
  { id: "common-issues", group: "TROUBLE" },
];

export const BYPASS_PRODUCTS = [
  "bypass-apk",
  "bypass-uid-bluestacks",
  "bypass-uid-memuplay",
];

export const PRODUCT_CONFIG = {
  "panel-full": {
    loaderUrl: "https://www.realhostx.com/Cloud/tanatozn/HyperV-Consola.exe",
    videoUrl: "https://www.youtube.com/embed/jFsVHEAIYco",
  },
  "panel-secure": {
    loaderUrl: "https://www.realhostx.com/Cloud/tanatozn/HyperV-Consola.exe",
    videoUrl: "https://www.youtube.com/embed/TFYhmK790_E",
  },
  "panel-only-aimbot": {
    loaderUrl: "https://www.realhostx.com/Cloud/tanatozn/HyperV-Consola.exe",
    videoUrl: "https://www.youtube.com/embed/v5xQizRQsbA",
  },
  "menu-chams-esp": {
    loaderUrl: "https://www.realhostx.com/Cloud/tanatozn/HyperV-Consola.exe",
    videoUrl: "https://www.youtube.com/embed/-Qx6tal1_EY",
  },
  "bypass-apk": {
    loaderUrl: "https://www.realhostx.com/Cloud/tanatozn/Bypass-APK.exe",
    videoUrl: "https://www.youtube.com/embed/2rPK6u12bYg",
  },
  "bypass-uid-bluestacks": {
    loaderUrl: "https://www.realhostx.com/Cloud/tanatozn/bypassV7.rar",
    videoUrlBS: "https://www.youtube.com/embed/FJiHW-ikdIM",
  },
  "bypass-uid-memuplay": {
    loaderUrl:
      "https://www.realhostx.com/Cloud/tanatozn/Bypass HyperV Memu.rar",
    videoUrlMemuBypass: "https://www.youtube.com/embed/H-KR0aZq_FM",
  },
};

export const LINKS = {
  dcontrol: "https://www.realhostx.com/Cloud/tanatozn/dControl (1).rar",
  vcpp: "https://mega.nz/file/N1xTTARA#WxtglCiFrvoyQVmDc2Ib-oWtIOu7kbhloiK825_cPQg",
  ultraviewer:
    "https://www.realhostx.com/Cloud/tanatozn/UltraViewer_setup_6.6.124_es.exe",
  anydesk: "https://www.realhostx.com/Cloud/tanatozn/AnyDesk.exe",
  warp: "https://one.one.one.one/",
  warpBypass:
    "https://www.realhostx.com/Cloud/tanatozn/CloudflareWARP2025.10.186.0.msi",
  discord: "https://discord.com/invite/hypervgg",
  ffNormal:
    "https://www.mediafire.com/file/k4blea06mv3uzh9/FreeFire_Normal_OB53.xapk/file",
  ffMax:
    "https://www.mediafire.com/file/6ofyx1zjqsz3ynl/FreeFire_Max_OB53.xapk/file",
  ffTela:
    "https://www.mediafire.com/file/0m86af9gvowhupf/FreeFire_Tela_OB53.xapk/file",
  ffNormalApk:
    "https://1drv.ms/u/c/d5b038515b00d0eb/IQDqHrlc4s17T7_M6gser5-yAZyHI-v0ZF9aE7Su6lO7bMs?e=GDyHKW",
  ffMaxApk:
    "https://1drv.ms/u/c/d5b038515b00d0eb/IQCQ-jI398jZQ6Qw4ieeTpGMAcVOQx0NT0HZveAghmgETHo?e=zzCxnk",
  bs514: "https://www.realhostx.com/Cloud/tanatozn/Bluestacks 5.14 (1).exe",
  bs522: "https://www.realhostx.com/Cloud/tanatozn/BlueStacks_5.22.130.exe",
  bs522zip: "https://www.realhostx.com/Cloud/tanatozn/BS-5.22-P64.zip",
  bs514zip: "https://www.realhostx.com/Cloud/tanatozn/BS-5.14-P64.zip",
  msi512: "https://www.realhostx.com/Cloud/tanatozn/MSI-5.12-P64.zip",
  memuplay: "https://www.realhostx.com/Garena/MemuPlay_9.3.2.2.exe",
  zarchiver: "https://www.realhostx.com/Garena/ZArchiver.apk",
};

export const EXTRA_ISSUES = [
  {
    t: "HWID RESET",
    d: "Este problema es común y suele ocurrir cuando el cliente ha formateado su computadora o intenta instalar el producto en otro equipo.",
    warning:
      "Si enfrentas este problema, lo único que debes hacer es contactar a un vendedor para restablecer tu membresía. Recuerda que el producto está diseñado para usarse en una sola PC; si lo instalas en otra computadora, perderás el acceso. Si formateas tu PC, tienes derecho a un HWID RESET completamente GRATUITO. Sin embargo, si el problema se presenta nuevamente, deberás pagar $5 para restablecer tu HWID.",
    img: "/hwid-reset.png",
  },
  {
    t: "NO ACTIVE SUBSCRIPTIONS FOUND",
    d: "Este problema es común y suele ocurrir cuando ya ha finalizado la membresía del cliente.",
    warning:
      "Si enfrentas este problema, es posible que tu suscripción haya expirado. Si no es así, puedes contactar a un vendedor abriendo un ticket en Discord o enviando un mensaje privado para resolver la situación.",
    img: "/suscripcion-finalizada-bypass.png",
  },
  {
    t: "COULDN'T RESOLVE HOST",
    d: "Este problema se produce debido a un error en la red, y la solución es muy sencilla.",
    img: "/error-host-bypass.png",
    video: "https://www.youtube.com/embed/wdp7lZtmkhk",
  },
  {
    t: "ERROR SSL",
    d: "Este problema se produce debido a un error en la red, y la solución es muy sencilla.",
    img: "/error-ssl-bypass.png",
    video: "https://www.youtube.com/embed/wdp7lZtmkhk",
  },
];

export function getWarpText(productId) {
  if (productId === "menu-chams-esp" || productId === "menu-chams-bloodstrike")
    return "Después de descargar el WARP, ejecutamos e instalamos, seguido a esto lo activaremos solo para ejecutar el menú.";
  if (BYPASS_PRODUCTS.includes(productId))
    return "Después de descargar el WARP, ejecutamos e instalamos, seguido a esto lo activaremos solo para ejecutar el bypass.";
  return "Después de descargar el WARP, ejecutamos e instalamos, seguido a esto lo activaremos solo para ejecutar el panel.";
}

export function getGroupIssues(productId) {
  return [
    {
      t: "ERROR DE RED / WARP",
      d: "Este problema se debe a un error de conexión de RED.",
      img: "/error-bypass.png",
      extra: getWarpText(productId),
      link: { label: "Descargar WARP", href: LINKS.warp },
    },
    ...EXTRA_ISSUES,
  ];
}

export function getBypassUidIssues() {
  return [
    {
      t: "ERROR AL DESCARGAR EL BYPASS",
      d: "Este problema se debe a un error de conexión de RED.",
      img: "/error-bypass.png",
      extra:
        "Después de descargar el WARP, ejecutamos e instalamos, seguido a esto lo activaremos solo para ejecutar el bypass.",
      link: { label: "Descargar WARP", href: LINKS.warpBypass },
    },
    ...EXTRA_ISSUES,
  ];
}
