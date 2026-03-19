import { NextResponse } from "next/server";

const PAYPAL_BASE =
  process.env.PAYPAL_ENV === "live"
    ? "https://api-m.paypal.com"
    : "https://api-m.sandbox.paypal.com";

async function getAccessToken() {
  const clientId = process.env.PAYPAL_CLIENT_ID?.trim();
  const secret = process.env.PAYPAL_SECRET?.trim();

  if (!clientId || !secret) {
    throw new Error("Faltan PAYPAL_CLIENT_ID o PAYPAL_SECRET");
  }

  const auth = Buffer.from(`${clientId}:${secret}`, "utf8").toString("base64");

  const res = await fetch(`${PAYPAL_BASE}/v1/oauth2/token`, {
    method: "POST",
    headers: {
      Authorization: `Basic ${auth}`,
      "Content-Type": "application/x-www-form-urlencoded",
      Accept: "application/json",
      "Accept-Language": "en_US",
    },
    body: "grant_type=client_credentials",
    cache: "no-store",
  });

  const text = await res.text();
  let data = {};

  try {
    data = JSON.parse(text);
  } catch {
    throw new Error(`Respuesta inválida de PayPal: ${text}`);
  }

  if (!res.ok) {
    throw new Error(
      data?.error_description || data?.error || `OAuth error (${res.status})`,
    );
  }

  return data.access_token;
}

export async function POST(req) {
  try {
    const { cart } = await req.json();

    if (!Array.isArray(cart) || cart.length === 0) {
      return NextResponse.json({ error: "Carrito vacío" }, { status: 400 });
    }

    const total = cart.reduce((sum, item) => {
      const price = Number(item?.product?.price) || 0;
      const quantity = Number(item?.quantity) || 1;
      return sum + price * quantity;
    }, 0);

    const accessToken = await getAccessToken();

    const res = await fetch(`${PAYPAL_BASE}/v2/checkout/orders`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        intent: "CAPTURE",
        purchase_units: [
          {
            amount: {
              currency_code: "USD",
              value: total.toFixed(2),
            },
          },
        ],
      }),
      cache: "no-store",
    });

    const data = await res.json();

    if (!res.ok) {
      return NextResponse.json(
        {
          error: data?.message || data?.name || "Error creando orden PayPal",
          details: data,
        },
        { status: 500 },
      );
    }

    return NextResponse.json({ orderID: data.id });
  } catch (error) {
    return NextResponse.json(
      { error: error.message || "Error interno en PayPal create" },
      { status: 500 },
    );
  }
}
