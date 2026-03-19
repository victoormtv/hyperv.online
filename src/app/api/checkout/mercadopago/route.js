import { MercadoPagoConfig, Preference } from "mercadopago";

const client = new MercadoPagoConfig({
  accessToken: process.env.MP_ACCESS_TOKEN?.trim(),
});

export async function POST(req) {
  try {
    const { cart } = await req.json();

    const items = cart.map((item) => ({
      id: String(item.product.id),
      title: String(item.product.name),
      quantity: Math.max(1, Math.round(Number(item.quantity))),
      unit_price: Math.max(0.01, Number(item.product.price)),
      currency_id: "USD",
    }));

    const preference = new Preference(client);

    const baseUrl = (
      process.env.NEXT_PUBLIC_URL || "http://localhost:3000"
    ).trim();

    const body = {
      items,
      back_urls: {
        success: `${baseUrl}/success`,
        failure: `${baseUrl}/addtocart`,
        pending: `${baseUrl}/addtocart`,
      },
    };

    const result = await preference.create({ body });

    return Response.json({
      preferenceId: result.id,
    });
  } catch (error) {
    return Response.json(
      {
        error: error?.message ?? "Error al crear preferencia",
        cause: error?.cause ?? null,
      },
      { status: 500 },
    );
  }
}
