import crypto from "crypto";

export async function POST(req) {
  try {
    const { cart, email } = await req.json();

    if (!Array.isArray(cart) || cart.length === 0) {
      return Response.json({ error: "Carrito vacío" }, { status: 400 });
    }

    if (!email || !email.includes("@")) {
      return Response.json({ error: "Email inválido" }, { status: 400 });
    }

    const apiKey = process.env.BINANCE_API_KEY?.trim();
    const secret = process.env.BINANCE_SECRET?.trim();
    const baseUrl = (
      process.env.NEXT_PUBLIC_URL || "http://localhost:3000"
    ).trim();

    if (!apiKey || !secret) {
      return Response.json(
        { error: "Faltan BINANCE_API_KEY o BINANCE_SECRET" },
        { status: 500 },
      );
    }

    const total = Number(
      cart
        .reduce((sum, i) => {
          const price = Number(i?.product?.price) || 0;
          const quantity = Number(i?.quantity) || 1;
          return sum + price * quantity;
        }, 0)
        .toFixed(2),
    );

    const merchantTradeNo = `HV${Date.now()}`;
    const timestamp = Date.now();
    const nonce = crypto.randomBytes(16).toString("hex");

    const body = {
      env: { terminalType: "WEB" },
      merchantTradeNo,
      orderAmount: total,
      currency: "USDT",
      description: "HyperV Community Products",
      goods: {
        goodsType: "02",
        goodsCategory: "Z000",
        referenceGoodsId: "HYPERV_ORDER",
        goodsName: "HyperV Community Products",
        goodsDetail: cart.map((i) => i?.product?.name || "Producto").join(", "),
      },
      returnUrl: `${baseUrl}/success`,
      cancelUrl: `${baseUrl}/addtocart`,
      buyer: { buyerEmail: email },
    };

    const bodyStr = JSON.stringify(body);
    const payload = `${timestamp}\n${nonce}\n${bodyStr}\n`;

    const signature = crypto
      .createHmac("sha512", secret)
      .update(payload)
      .digest("hex")
      .toUpperCase();

    const res = await fetch(
      "https://bpay.binanceapi.com/binancepay/openapi/v2/order",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "BinancePay-Timestamp": timestamp.toString(),
          "BinancePay-Nonce": nonce,
          "BinancePay-Certificate-SN": apiKey,
          "BinancePay-Signature": signature,
        },
        body: bodyStr,
        cache: "no-store",
      },
    );

    const data = await res.json();

    if (data?.status === "SUCCESS") {
      return Response.json({
        checkoutUrl: data?.data?.checkoutUrl,
        prepayId: data?.data?.prepayId,
      });
    }

    return Response.json(
      {
        error: data?.errorMessage || "Error en Binance Pay",
        code: data?.code || null,
        details: data,
      },
      { status: 400 },
    );
  } catch (error) {
    console.error("Binance Pay error:", error);
    return Response.json(
      { error: error?.message || "Error de conexión con Binance Pay" },
      { status: 500 },
    );
  }
}
