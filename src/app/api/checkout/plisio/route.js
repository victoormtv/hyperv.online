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

    const params = new URLSearchParams({
      api_key: process.env.PLISIO_SECRET_KEY,
      currency, // ← la que elige el usuario
      order_name: "HyperV Community Products",
      order_number: `HV${Date.now()}`,
      amount: total,
      source_currency: "USD",
      buyer_email: email,
      callback_url: `${baseUrl}/api/webhooks/plisio`,
      success_url: `${baseUrl}/success`,
      fail_url: `${baseUrl}/addtocart`,
    });

    const res = await fetch(`https://plisio.net/api/v1/invoices/new?${params}`);
    const data = await res.json();

    if (data?.status !== "success" || !data?.data?.invoice_url)
      return Response.json(
        { error: data?.message || "Error creando pago en Plisio" },
        { status: 400 },
      );

    return Response.json({ checkoutUrl: data.data.invoice_url });
  } catch (error) {
    console.error("Plisio error:", error);
    return Response.json({ error: error?.message }, { status: 500 });
  }
}
