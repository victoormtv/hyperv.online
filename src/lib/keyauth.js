// lib/keyauth.js
import axios from "axios";

const LEVEL_MAP = {
  "Panel Full": 2,
  "Panel Secure": 4,
  "Panel Only Aimbot": 7,
  "Menu Chams ESP": 6,
};

const EXPIRY_MAP = {
  "24 Horas": 1,
  "1 Día": 1,
  Semanal: 7,
  "14 Días": 14,
  "15 Días": 15,
  Mensual: 30,
  "60 Días": 60,
  Trimestral: 90,
  Anual: 365,
  "Por Temporada": 90,
  Permanente: 3650,
};

const KEYAUTH_PRODUCTS = Object.keys(LEVEL_MAP);

export async function generateKeyAuthLicense(productName, planLabel) {
  if (!KEYAUTH_PRODUCTS.includes(productName)) {
    return {
      success: true,
      key: null,
      message: "Producto sin sistema de licencias",
    };
  }

  const sellerKey = process.env.KEYAUTH_SELLER_KEY?.trim();
  if (!sellerKey) {
    return {
      success: false,
      error: "No se encontró KEYAUTH_SELLER_KEY en .env",
    };
  }

  const level = LEVEL_MAP[productName] || 1;
  const expiry = EXPIRY_MAP[planLabel] || 30;

  try {
    const url = `https://keyauth.win/api/seller/?sellerkey=${sellerKey}&type=add&expiry=${expiry}&mask=XXXXXX-XXXXXX-XXXXXX-XXXXXX-XXXXXX-XXXXXX&level=${level}&amount=1&owner=&character=2&note=${encodeURIComponent(productName + " - " + planLabel)}&format=json`;
    const response = await axios.get(url);

    if (response.data.success) {
      return { success: true, key: response.data.key };
    } else {
      return {
        success: false,
        error: response.data.message || "Error al generar licencia",
      };
    }
  } catch (error) {
    console.error("KeyAuth error:", error);
    return { success: false, error: error.message };
  }
}
