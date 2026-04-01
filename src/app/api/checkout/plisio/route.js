export async function POST(req) {
  try {
    const { cart, email, currency = "USDT", contactInfo } = await req.json();

    if (!Array.isArray(cart) || cart.length === 0) {
      return Response.json({ error: "Carrito vacío" }, { status: 400 });
    }

    if (!email || typeof email !== "string") {
      return Response.json({ error: "Email inválido" }, { status: 400 });
    }

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

    if (!SUPPORTED.includes(currency)) {
      return Response.json({ error: "Moneda no soportada" }, { status: 400 });
    }

    const total = cart
      .reduce((sum, i) => {
        const price = Number(i?.product?.price) || 0;
        const quantity = Number(i?.quantity) || 1;
        return sum + price * quantity;
      }, 0)
      .toFixed(2);

    const baseUrl = process.env.NEXT_PUBLIC_URL.trim();
    const apiKey = process.env.PLISIO_SECRET_KEY?.trim();

    if (!apiKey) {
      return Response.json(
        { error: "Falta PLISIO_SECRET_KEY en .env" },
        { status: 500 },
      );
    }

    const orderNumber = `HV${Date.now()}`;

    const orderData = encodeURIComponent(
      JSON.stringify({
        orderNumber,
        email,
        cart,
        total,
        currency,
        contactInfo: contactInfo || null,
      }),
    );

    const params = new URLSearchParams({
      api_key: apiKey,
      currency,
      order_name: "HyperV Community Products",
      order_number: orderNumber,
      source_currency: "USD",
      source_amount: total,
      email,
      callback_url: `${baseUrl}/api/orders/plisio-callback?json=true&orderData=${orderData}`,
      success_invoice_url: `${baseUrl}/api/orders/plisio-success?order=${orderNumber}`,
      fail_invoice_url: `${baseUrl}/addtocart`,
    });

    const res = await fetch(
      `https://api.plisio.net/api/v1/invoices/new?${params.toString()}`,
      {
        method: "GET",
        cache: "no-store",
      },
    );

    const data = await res.json();
    console.log("Plisio response:", JSON.stringify(data, null, 2));

    if (data?.status !== "success") {
      return Response.json(
        {
          error: data?.data?.message || data?.message || "Error en Plisio",
          plisio: data,
        },
        { status: 400 },
      );
    }

    const invoice = data.data;

    return Response.json({
      success: true,
      checkoutUrl: invoice.invoice_url,
      walletAddress: invoice.wallet_hash,
      cryptoAmount: invoice.invoice_total_sum,
      currency: invoice.currency,
      orderId: invoice.txn_id,
      orderNumber,
      expireAt: invoice.expire_utc,
      qrCode: invoice.qr_code,
    });
  } catch (error) {
    console.error("Plisio checkout error:", error);
    return Response.json(
      { error: error?.message || "Error interno" },
      { status: 500 },
    );
  }
}
