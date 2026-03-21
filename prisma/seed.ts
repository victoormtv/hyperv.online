import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  // ========================================
  // CATEGORÍAS
  // ========================================
  let freeFire = await prisma.category.findFirst({ where: { name: "Free Fire" } });
  if (!freeFire) {
    freeFire = await prisma.category.create({
      data: { name: "Free Fire", image: "/images/categories/free-fire.jpg" },
    });
  }

  let valorant = await prisma.category.findFirst({ where: { name: "Valorant" } });
  if (!valorant) {
    valorant = await prisma.category.create({
      data: { name: "Valorant", image: "/images/categories/valorant.jpg" },
    });
  }

  let csgo = await prisma.category.findFirst({ where: { name: "CS2" } });
  if (!csgo) {
    csgo = await prisma.category.create({
      data: { name: "CS2", image: "/images/categories/csgo.jpg" },
    });
  }

  let cod = await prisma.category.findFirst({ where: { name: "Call of Duty" } });
  if (!cod) {
    cod = await prisma.category.create({
      data: { name: "Call of Duty", image: "/images/categories/cod.jpg" },
    });
  }

  let bloodstrike = await prisma.category.findFirst({ where: { name: "Bloodstrike" } });
  if (!bloodstrike) {
    bloodstrike = await prisma.category.create({
      data: { name: "Bloodstrike", image: "/images/categories/bloodstrike.jpg" },
    });
  }

  let freeProducts = await prisma.category.findFirst({ where: { name: "Free Products" } });
  if (!freeProducts) {
    freeProducts = await prisma.category.create({
      data: { name: "Free Products", image: "/images/categories/free-fire.jpg" },
    });
  }

  let discord = await prisma.category.findFirst({ where: { name: "Discord" } });
  if (!discord) {
    discord = await prisma.category.create({
      data: { name: "Discord", image: "/images/categories/discord.jpg" },
    });
  }

  // ========================================
  // PRODUCTOS
  // ========================================
  const allProducts = [
    // ── FREE FIRE ──────────────────────────
    {
      category: freeFire,
      data: {
        name: "Panel Full",
        description: "Panel completo con todas las funciones sin restricciones para Free Fire Emulador",
        features: ["Aimbots externals: Neck y Leggit", "Aimbot Rage sin bug", "Aimbot Helper sin bug", "Aimbot Silent", "ESP/Chams", "Teletransportacion", "Speed y WallHack", "Actualizaciones y soporte incluido"],
        isBest: true,
        status: "UNDETECTED",
        images: ["/panel-full.png"],
        plans: [
          { label: "Semanal",    price: 24.99 },
          { label: "Mensual",    price: 39.99 },
          { label: "Trimestral", price: 49.99 },
          { label: "Anual",      price: 64.99 },
        ],
      },
    },
    {
      category: freeFire,
      data: {
        name: "Panel Secure",
        description: "Panel basico con las funciones esenciales para Free Fire Emulador",
        features: ["Aimbots external", "Chams", "Fix Lag", "Actualizaciones y soporte incluido"],
        isBest: false,
        status: "UNDETECTED",
        images: ["/panel-secure.png"],
        plans: [
          { label: "Semanal",    price: 10.99 },
          { label: "Mensual",    price: 22.99 },
          { label: "Trimestral", price: 31.99 },
          { label: "Anual",      price: 39.99 },
        ],
      },
    },
    {
      category: freeProducts,
      data: {
        name: "Panel Free",
        description: "Versión gratuita del Panel — 3 días de prueba",
        features: ["Aimbots external", "Chams", "Fix Lag", "Prueba gratuita por 3 días"],
        isBest: false,
        status: "UNDETECTED",
        images: ["/panel-free.png"],
        plans: [
          { label: "3 Días Gratis", price: 0 },
        ],
      },
    },
    {
      category: freeFire,
      data: {
        name: "Panel Only Aimbot",
        description: "Panel especializado solo en Aimbot para Free Fire",
        features: ["Aimbot External: Neck y Leggit", "Fix Lag", "Actualizaciones y soporte incluido"],
        isBest: false,
        status: "UNDETECTED",
        images: ["/panel-only-aimbot.png"],
        plans: [
          { label: "Semanal",    price: 5.99  },
          { label: "Mensual",    price: 14.99 },
          { label: "Trimestral", price: 24.99 },
          { label: "Anual",      price: 29.99 },
        ],
      },
    },
    {
      category: freeFire,
      data: {
        name: "Menu Chams ESP",
        description: "Menú de Chams y ESP para Free Fire Emulador",
        features: ["Box ESP", "Skeleton ESP", "Distance", "Colores personalizables", "Health ESP"],
        isBest: false,
        status: "UNDETECTED",
        images: ["/menu-chams.png"],
        plans: [
          { label: "Semanal",    price: 4.99  },
          { label: "Mensual",    price: 14.99 },
          { label: "Trimestral", price: 19.99 },
          { label: "Anual",      price: 24.99 },
        ],
      },
    },
    {
      category: freeFire,
      data: {
        name: "Bypass APK",
        description: "Bypass para PC - Empareja con 50 jugadores",
        features: ["Indetectable", "Activacion Rapida", "Sin riesgo de black/ban", "Actualizaciones y soporte incluido"],
        isBest: false,
        status: "UNDETECTED",
        images: ["/bypass-apk.png"],
        plans: [
          { label: "Semanal", price: 14.99 },
          { label: "Mensual", price: 34.99 },
        ],
      },
    },
    {
      category: freeFire,
      data: {
        name: "Bypass UID",
        description: "Bypass vinculado a tu cuenta de Free Fire",
        features: ["Indetectable", "Activacion Rapida", "Sin riesgo de black/ban", "Actualizaciones y soporte incluido"],
        isBest: false,
        status: "UNDETECTED",
        images: ["/bypass-uid.png"],
        plans: [
          { label: "Semanal",    price: 9.99  },
          { label: "14 Días",    price: 19.99 },
          { label: "Mensual",    price: 29.99 },
          { label: "Trimestral", price: 44.99 },
          { label: "Anual",      price: 59.99 },
        ],
      },
    },
    {
      category: freeProducts,
      data: {
        name: "Bypass Free",
        description: "Versión gratuita del Bypass— 3 días de prueba. Contacta soporte en Discord para recibir tu key.",
        features: ["Indetectable", "Activacion Rapida", "Sin riesgo de black/ban", "Prueba gratuita por 3 días", "Key entregada por Discord"],
        isBest: false,
        status: "UNDETECTED",
        images: ["/bypass-free.png"],
        plans: [
          { label: "3 Días Gratis", price: 0 },
        ],
      },
    },
    {
      category: freeFire,
      data: {
        name: "Panel Android",
        description: "Panel compatible con dispositivos Android",
        features: ["Tricks", "Hologramas", "Misc", "Todas las versiones de Android"],
        isBest: false,
        status: "UNDETECTED",
        images: ["/panel-android.png"],
        plans: [
          { label: "Semanal",  price: 9.99  },
          { label: "14 Días",  price: 16.99 },
          { label: "Mensual",  price: 29.99 },
          { label: "60 Días",  price: 44.99 },
        ],
      },
    },
    {
      category: freeFire,
      data: {
        name: "Aimbot Body Android",
        description: "Aimbot especializado para Android - Apunta al pecho",
        features: ["Aimbot al pecho", "Alta precisión", "Sin bugs de daño", "Compatible con Xiaomi"],
        isBest: false,
        status: "UNDETECTED",
        images: ["/aimbot-body-android.png"],
        plans: [
          { label: "Por Temporada", price: 39.99 },
        ],
      },
    },
    {
      category: freeFire,
      data: {
        name: "Panel iOS",
        description: "Panel compatible con dispositivos iOS",
        features: ["Sin jailbreak", "Fácil instalación", "Certificado GBOX", "iOS 14+"],
        isBest: false,
        status: "UNDETECTED",
        images: ["/panel-ios.png"],
        plans: [
          { label: "24 Horas", price: 14.99 },
          { label: "Semanal",  price: 29.99 },
          { label: "Mensual",  price: 49.99 },
        ],
      },
    },
    {
      category: freeFire,
      data: {
        name: "Aimbot Body iOS",
        description: "Aimbot especializado para iOS - Apunta al pecho",
        features: ["Aimbot al pecho", "Alta precisión", "Sin bugs de daño", "Sin jailbreak"],
        isBest: false,
        status: "UPDATING",
        images: ["/aimbot-ios.png"],
        plans: [
          { label: "Por Temporada", price: 64.99 },
        ],
      },
    },
    {
      category: freeFire,
      data: {
        name: "Aimlock",
        description: "Sistema de puntería asistida para iOS y Android",
        features: ["Facil instalacion", "Sin bugs de daño", "iOS y Android", "Sin jailbreak"],
        isBest: false,
        status: "UNDETECTED",
        images: ["/aimlock.png"],
        plans: [
          { label: "Anual", price: 49.99 },
        ],
      },
    },
    {
      category: freeFire,
      data: {
        name: "Regedit",
        description: "Editor de registro optimizado para iOS & Android",
        features: ["Corrije la mira", "Archivos indetectables", "Preset incluido", "Fácil de usar"],
        isBest: false,
        status: "UNDETECTED",
        images: ["/regedit.png"],
        plans: [
          { label: "Mensual", price: 24.99 },
          { label: "Anual",   price: 34.99 },
        ],
      },
    },

    // ── VALORANT ───────────────────────────
    {
      category: valorant,
      data: {
        name: "Aimbot Color",
        description: "Aimbot basado en colores para Valorant",
        features: ["Detección por color", "FOV ajustable", "Actualizaciones frecuentes", "TriggerBot"],
        isBest: true,
        status: "UNDETECTED",
        images: ["/aimbot-color.png"],
        plans: [
          { label: "Semanal",    price: 14.99 },
          { label: "Mensual",    price: 34.99 },
          { label: "Trimestral", price: 64.99 },
        ],
      },
    },
    {
      category: valorant,
      data: {
        name: "Boost Rank",
        description: "Boost para subir de rank en Valorant",
        features: ["Sube de nivel", "100% Efectivo", "Jugadores profesionales"],
        isBest: false,
        status: "UNDETECTED",
        images: ["/boost-rank.png"],
        plans: [
          { label: "A consultar", price: 0 },
        ],
      },
    },
    {
      category: valorant,
      data: {
        name: "Spoofer",
        description: "Quita el ban HWID de Valorant",
        features: ["Desbanea por placa", "100% Efectivo"],
        isBest: false,
        status: "UNDETECTED",
        images: ["/spoofer.png"],
        plans: [
          { label: "Permanente", price: 49.99 },
        ],
      },
    },

    // ── CS2 ────────────────────────────────
    {
      category: csgo,
      data: {
        name: "Panel CSGO",
        description: "Panel completo con todas las funciones externas para CS2",
        features: ["Aimbots totalmente configurables", "Granada Helper", "Stream Mode", "Soporte Windows 8/10/11", "CPU Intel/AMD/Xeon"],
        isBest: false,
        status: "UNDETECTED",
        images: ["/panel-csgo.png"],
        plans: [
          { label: "Semanal", price: 19.99 },
          { label: "Mensual", price: 44.99 },
        ],
      },
    },

    // ── CALL OF DUTY ───────────────────────
    {
      category: cod,
      data: {
        name: "Panel COD iOS",
        description: "Panel completo para Call of Duty en iOS",
        features: ["Aimbot: Head/Neck/Assist/Cycle/Silent/AimKill", "ESP: Line/Box/Name/Skeleton/Health", "Misc: NoRecoil/BackJump/InvertedWall"],
        isBest: false,
        status: "UNDETECTED",
        images: ["/panel-cod-ios.png"],
        plans: [
          { label: "1 Día",   price: 14.99 },
          { label: "Semanal", price: 29.99 },
          { label: "Mensual", price: 49.99 },
        ],
      },
    },
    {
      category: cod,
      data: {
        name: "Panel Warzone",
        description: "Panel completo para Warzone - Xbox, Steam y BattleNet",
        features: ["Aimbot", "Silent Aim", "Triggerbot", "FOV ajustable", "ESP y Hologramas", "Desbloqueos exclusivos"],
        isBest: false,
        status: "UNDETECTED",
        images: ["/panel-warzone.png"],
        plans: [
          { label: "15 Días", price: 29.99 },
          { label: "Mensual", price: 64.99 },
        ],
      },
    },

    // ── BLOODSTRIKE ────────────────────────
    {
      category: bloodstrike,
      data: {
        name: "Menu Chams Bloodstrike",
        description: "Menú completo con Chams y ESP para Bloodstrike",
        features: ["Chams: 3D/Glow/Solido/Wireframe/RGB", "ESP completo", "Stream Spoof", "HVCI ON & OFF", "Windows 8/10/11"],
        isBest: false,
        status: "UNDETECTED",
        images: ["/chams-blood.png"],
        plans: [
          { label: "Semanal",    price: 11.99 },
          { label: "Mensual",    price: 29.99 },
          { label: "Trimestral", price: 39.99 },
        ],
      },
    },

    // ── DISCORD ────────────────────────────
    {
      category: discord,
      data: {
        name: "Discord Tools",
        description: "Discord Nitro, Boosts y herramientas premium",
        features: ["Boosts permanentes", "Members reales", "Entrega inmediata", "Nitro disponible"],
        isBest: false,
        status: "UNDETECTED",
        images: ["https://i.ibb.co/XZn91S4y/DISCORD-TOOLS-HYPER-V.png"],
        plans: [
          { label: "6 Boosts x1 mes",    price: 6.99  },
          { label: "6 Boosts x3 meses",  price: 11.99 },
          { label: "14 Boosts x1 mes",   price: 11.99 },
          { label: "14 Boosts x3 meses", price: 19.99 },
          { label: "30 Boosts x1 mes",   price: 19.99 },
          { label: "30 Boosts x3 meses", price: 39.99 },
          { label: "1000 Users Online",  price: 11.99 },
          { label: "1000 Users Offline", price: 24.99 },
        ],
      },
    },
  ];

  // ========================================
  // INSERTAR TODOS LOS PRODUCTOS
  // ========================================
  for (const { category, data } of allProducts) {
    const existing = await prisma.product.findFirst({ where: { name: data.name } });
    if (existing) {
      console.log(`⏭️  [${category.name}] ${data.name} ya existe, saltando...`);
      continue;
    }

    const { plans, ...productData } = data;
    const product = await prisma.product.create({
      data: {
        ...productData,
        price: Math.min(...plans.map((p) => p.price)),
        categoryId: category.id,
      },
    });
    await prisma.plan.createMany({
      data: plans.map((p) => ({ ...p, productId: product.id })),
    });
    console.log(`✅ [${category.name}] ${product.name} — ${plans.length} plan(es)`);
  }

  console.log("\n🎉 Seed completado exitosamente!");
}

main()
  .catch((e) => {
    console.error("❌ Error en seed:", e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
