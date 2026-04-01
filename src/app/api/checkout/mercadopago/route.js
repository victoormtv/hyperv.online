// app/api/checkout/mercadopago/route.js
import { MercadoPagoConfig, Preference } from "mercadopago";
import prisma from "@/utils/connection";

const client = new MercadoPagoConfig({
  accessToken: process.env.MP_ACCESS_TOKEN?.trim(),
});

export async function POST(req) {
  try {
    const { cart, email, contactInfo } = await req.json();

    const items = cart.map((item) => ({
      id: String(item.product.id),
      title: String(item.product.name),
      quantity: Math.max(1, Math.round(Number(item.quantity))),
      unit_price: Math.max(0.01, Number(item.product.price)),
      currency_id: "USD",
    }));

    const baseUrl = (
      process.env.NEXT_PUBLIC_URL || "http://localhost:3000"
    ).trim();

    const pendingOrder = await prisma.order.create({
      data: {
        isPaid: false,
        cartData: JSON.stringify(cart),
        email: email,
        contactInfo: JSON.stringify(contactInfo),
        OrderItem: {
          create: cart.map((item) => ({
            quantity: item.quantity || 1,
            productId: item.product.id,
          })),
        },
      },
    });

    const preference = new Preference(client);

    const body = {
      items,
      external_reference: pendingOrder.id,
      auto_return: "approved",
      back_urls: {
        success: `${baseUrl}/api/orders/mp-success`,
        failure: `${baseUrl}/addtocart`,
        pending: `${baseUrl}/addtocart`,
      },
    };

    const result = await preference.create({ body });

    return Response.json({ preferenceId: result.id });
  } catch (error) {
    console.error("MP error:", error);
    return Response.json(
      { error: error?.message ?? "Error al crear preferencia" },
      { status: 500 },
    );
  }
}
