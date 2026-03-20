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
      success_url: `${baseUrl}/success`,
      fail_url: `${baseUrl}/addtocart`,
    });

    const res = await fetch(`https://plisio.net/api/v1/invoices/new?${params}`);
    const data = await res.json();

    console.log("Plisio response:", JSON.stringify(data, null, 2));

    if (data?.status !== "success")
      return Response.json(
        {
          error: data?.data?.message || data?.message || "Error en Plisio",
          plisio: data,
        },
        { status: 400 },
      );

    const invoice = data.data;

    return Response.json({
      checkoutUrl: invoice.invoice_url,
      walletAddress: invoice.wallet_hash,
      cryptoAmount: invoice.invoice_total_sum,
      currency: invoice.currency,
      orderId: invoice.txn_id,
      expireAt: invoice.expire_utc,
      qrCode: invoice.qr_code,
    });
  } catch (error) {
    console.error("Plisio error:", error);
    return Response.json({ error: error?.message }, { status: 500 });
  }
}
