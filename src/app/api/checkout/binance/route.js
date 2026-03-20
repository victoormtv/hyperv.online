export async function POST(req) {
  try {
    const { cart, email } = await req.json();

    if (!Array.isArray(cart) || cart.length === 0)
      return Response.json({ error: "Carrito vacío" }, { status: 400 });

    const total = cart
      .reduce((sum, i) => {
        return (
          sum + (Number(i?.product?.price) || 0) * (Number(i?.quantity) || 1)
        );
      }, 0)
      .toFixed(2);

    const baseUrl = (
      process.env.NEXT_PUBLIC_URL || "http://localhost:3000"
    ).trim();

    const res = await fetch("https://api.nowpayments.io/v1/invoice", {
      method: "POST",
      headers: {
        "x-api-key": process.env.NOWPAYMENTS_API_KEY,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        price_amount: total,
        price_currency: "usd",
        pay_currency: "usdtbsc", // USDT en BEP20 (Binance Smart Chain)
        order_id: `HV${Date.now()}`,
        order_description: "HyperV Community Products",
        ipn_callback_url: `${baseUrl}/api/webhooks/nowpayments`,
        success_url: `${baseUrl}/success`,
        cancel_url: `${baseUrl}/addtocart`,
      }),
    });

    const data = await res.json();

    if (!res.ok || !data?.invoice_url)
      return Response.json(
        { error: data?.message || "Error creando pago" },
        { status: 400 },
      );

    return Response.json({ checkoutUrl: data.invoice_url });
  } catch (error) {
    console.error("NOWPayments error:", error);
    return Response.json({ error: error?.message }, { status: 500 });
  }
}
