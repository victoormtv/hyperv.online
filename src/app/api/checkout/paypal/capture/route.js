import { NextResponse } from "next/server";
import { sendAdminOrderNotification } from "@/lib/email";

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

  const auth = Buffer.from(`${clientId}:${secret}`).toString("base64");

  const res = await fetch(`${PAYPAL_BASE}/v1/oauth2/token`, {
    method: "POST",
    headers: {
      Authorization: `Basic ${auth}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: "grant_type=client_credentials",
    cache: "no-store",
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(
      data?.error_description ||
        data?.error ||
        "No se pudo obtener access token",
    );
  }

  return data.access_token;
}

export async function POST(req) {
  try {
    const { orderID } = await req.json();

    if (!orderID) {
      return NextResponse.json({ error: "orderID requerido" }, { status: 400 });
    }

    const accessToken = await getAccessToken();

    const res = await fetch(
      `${PAYPAL_BASE}/v2/checkout/orders/${orderID}/capture`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        cache: "no-store",
      },
    );

    const data = await res.json();

    if (!res.ok) {
      return NextResponse.json(
        {
          error: data?.message || data?.name || "Error capturando orden",
          details: data,
        },
        { status: 500 },
      );
    }

    if (data?.status === "COMPLETED") {
      const customerEmail = data?.payer?.email_address || "No enviado";
      const customerName =
        `${data?.payer?.name?.given_name || ""} ${data?.payer?.name?.surname || ""}`.trim() ||
        "No enviado";
      const total = data?.purchase_units?.[0]?.amount?.value || "N/A";

      await sendAdminOrderNotification({
        customerName,
        customerEmail,
        productName: "Ver carrito",
        planLabel: "PayPal",
        orderId: data?.id,
        total: `$${total}`,
        paymentMethod: "PayPal",
      });
    }

    return NextResponse.json({
      status: data?.status,
      id: data?.id,
      details: data,
    });
  } catch (error) {
    return NextResponse.json(
      { error: error.message || "Error interno en PayPal capture" },
      { status: 500 },
    );
  }
}
