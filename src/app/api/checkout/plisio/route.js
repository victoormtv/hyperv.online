// app/api/checkout/plisio/route.js
export async function POST(req) {
  try {
    const { cart, email, currency = "USDT" } = await req.json();

    if (!Array.isArray(cart) || cart.length === 0)
      return Response.json({ error: "Carrito vacío" }, { status: 400 });

    const SUPPORTED = [
      "USDT",
      "BTC",
      "ETH",
      "LTC",
      "TRX",
      "BNB",
      "DOGE",
      "USDC",
    ];
    if (!SUPPORTED.includes(currency))
      return Response.json({ error: "Moneda no soportada" }, { status: 400 });

    const total = cart
      .reduce(
        (sum, i) =>
          sum + (Number(i?.product?.price) || 0) * (Number(i?.quantity) || 1),
        0,
      )
      .toFixed(2);

    const baseUrl = (
      process.env.NEXT_PUBLIC_URL || "http://localhost:3000"
    ).trim();
    const apiKey = process.env.PLISIO_SECRET_KEY?.trim();

    // ── DEBUG: ver qué estamos mandando ──────────────
    console.log("=== PLISIO DEBUG ===");
    console.log("api_key:", apiKey ? `${apiKey.slice(0, 8)}...` : "MISSING");
    console.log("currency:", currency);
    console.log("total:", total);
    console.log("email:", email);
    console.log("baseUrl:", baseUrl);
    // ─────────────────────────────────────────────────

    if (!apiKey)
      return Response.json(
        { error: "Falta PLISIO_SECRET_KEY en .env" },
        { status: 500 },
      );

    const params = new URLSearchParams({
      api_key: apiKey,
      currency,
      order_name: "HyperV Community Products",
      order_number: `HV${Date.now()}`,
      amount: total,
      source_currency: "USD",
      buyer_email: email,
      callback_url: `${baseUrl}/api/webhooks/plisio`,
      success_url: `${baseUrl}/success`,
      fail_url: `${baseUrl}/addtocart`,
    });

    const url = `https://plisio.net/api/v1/invoices/new?${params}`;
    console.log("Plisio URL:", url.replace(apiKey, "***KEY***"));

    const res = await fetch(url);
    const data = await res.json();

    // ── DEBUG: ver respuesta exacta de Plisio ────────
    console.log("Plisio status:", res.status);
    console.log("Plisio response:", JSON.stringify(data, null, 2));
    // ─────────────────────────────────────────────────

    if (data?.status !== "success" || !data?.data?.invoice_url)
      return Response.json(
        {
          error:
            data?.message ||
            data?.data?.message ||
            "Error creando pago en Plisio",
          plisio: data,
        },
        { status: 400 },
      );

    return Response.json({ checkoutUrl: data.data.invoice_url });
  } catch (error) {
    console.error("Plisio error:", error);
    return Response.json({ error: error?.message }, { status: 500 });
  }
}
