import { NextResponse } from "next/server";
import prisma from "@/utils/connection";
import { generateKeyAuthLicense } from "@/lib/keyauth";
import { sendLicenseEmail } from "@/lib/email";

export async function POST(req) {
  try {
    const body = await req.json();
    const { cart, email } = body;

    console.log("=== PROCESS ORDER ===");
    console.log("email:", email);
    console.log("cart items:", cart?.length);

    if (!cart || !email) {
      return NextResponse.json({ error: "Faltan datos" }, { status: 400 });
    }

    const results = [];

    for (const item of cart) {
      const productName = item.product?.name;
      const planLabel =
        item.product?.planLabel || item.product?.plans?.[0]?.label || "Mensual";
      const quantity = item.quantity || 1;
      const productId = item.product?.id;

      console.log(`Procesando: ${productName} - ${planLabel}`);

      const keyResult = await generateKeyAuthLicense(productName, planLabel);
      console.log("KeyAuth result:", keyResult);

      let orderId = `ORD-${Date.now()}`;
      if (productId) {
        try {
          const order = await prisma.order.create({
            data: {
              isPaid: true,
              OrderItem: {
                create: [{ quantity, productId }],
              },
            },
          });
          orderId = order.id;
          console.log("Order created:", orderId);
        } catch (dbErr) {
          console.error("DB error (non-fatal):", dbErr.message);
        }
      }

      results.push({
        orderId,
        productName,
        planLabel,
        licenseKey: keyResult.key || null,
        hasKey: !!keyResult.key,
      });
    }

    const firstResult = results[0];
    const productNames = results.map((r) => r.productName).join(" + ");
    const planLabels = results.map((r) => r.planLabel).join(" + ");

    const licenseKey =
      results.length === 1
        ? firstResult.licenseKey
        : results
            .filter((r) => r.licenseKey)
            .map((r) => `${r.productName}: ${r.licenseKey}`)
            .join("\n") || null;

    console.log("Sending email to:", email);
    const emailResult = await sendLicenseEmail({
      to: email,
      productName: productNames,
      planLabel: planLabels,
      licenseKey,
      orderId: firstResult.orderId,
    });
    console.log("Email result:", emailResult);

    return NextResponse.json({
      success: true,
      orderId: firstResult.orderId,
      products: results,
      email,
    });
  } catch (error) {
    console.error("Process order ERROR:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
