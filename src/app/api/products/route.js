import prisma from "@/utils/connection";

// Fixed display order matching seed.js
const PRODUCT_ORDER = [
  "Panel Full",
  "Panel Secure",
  "Panel Only Aimbot",
  "Menu Chams ESP",
  "Bypass APK",
  "Bypass UID Bluestacks",
  "Bypass UID Memu Play",
  "Panel Android",
  "Aimbot Body Android",
  "Panel iOS",
  "Aimbot Body iOS",
  "Aimlock",
  "Regedit",
  "Aimbot Color",
  "Boost Rank",
  "Spoofer",
  "Panel CSGO",
  "Panel COD iOS",
  "Panel Warzone",
  "Menu Chams Bloodstrike",
  "Discord Tools",
];

export async function GET() {
  try {
    const products = await prisma.product.findMany({
      select: { id: true, name: true, images: true },
    });

    const sorted = products.sort((a, b) => {
      const ai = PRODUCT_ORDER.indexOf(a.name);
      const bi = PRODUCT_ORDER.indexOf(b.name);
      if (ai === -1 && bi === -1) return a.name.localeCompare(b.name);
      if (ai === -1) return 1;
      if (bi === -1) return -1;
      return ai - bi;
    });

    return Response.json(sorted);
  } catch (e) {
    return Response.json({ error: "Error fetching products" }, { status: 500 });
  }
}
