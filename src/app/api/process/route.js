import { NextResponse } from "next/server";
import prisma from "@/utils/connection";
import { generateKeyAuthLicense } from "@/lib/keyauth";
import { sendLicenseEmail } from "@/lib/email";

export async function POST(req) {
  try {
    const { cart, email, paymentMethod, paymentId } = await req.json();

    if (!cart || !email) {
      return NextResponse.json({ error: "Faltan datos" }, { status: 400 });
    }

    const results = [];

    for (const item of cart) {
      const productName = item.product?.name;
      const planLabel =
        item.product?.plans?.[0]?.label || item.planLabel || "Mensual";
      const quantity = item.quantity || 1;

      const keyResult = await generateKeyAuthLicense(productName, planLabel);

      const order = await prisma.order.create({
        data: {
          isPaid: true,
          OrderItem: {
            create: [
              {
                quantity,
                productId: item.product.id,
              },
            ],
          },
        },
      });

      results.push({
        orderId: order.id,
        productName,
        planLabel,
        licenseKey: keyResult.key || null,
        hasKey: !!keyResult.key,
      });
    }

    const firstResult = results[0];
    const allKeys = results
      .filter((r) => r.licenseKey)
      .map((r) => `${r.productName} (${r.planLabel}): ${r.licenseKey}`)
      .join("\n");

    await sendLicenseEmail({
      to: email,
      productName: results.map((r) => r.productName).join(" + "),
      planLabel: results.map((r) => r.planLabel).join(" + "),
      licenseKey:
        results.length === 1 ? firstResult.licenseKey : allKeys || null,
      orderId: firstResult.orderId,
    });

    return NextResponse.json({
      success: true,
      orderId: firstResult.orderId,
      products: results,
      email,
    });
  } catch (error) {
    console.error("Process order error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
