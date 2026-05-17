import { NextResponse } from "next/server";
import prisma from "@/utils/connection";
import { generateKeyAuthLicense } from "@/lib/keyauth";
import { sendLicenseEmail, sendAdminOrderNotification } from "@/lib/email";

const FREE_PRODUCTS = ["Panel Free", "Bypass Free"];

export async function POST(req) {
  try {
    const body = await req.json();
    const { cart, email, existingOrderId, paymentProvider, contactInfo } = body;

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

      let keyResult = { success: true, key: null };

      try {
        keyResult = await generateKeyAuthLicense(productName, planLabel);
      } catch (keyErr) {
        console.error("KeyAuth error (non-fatal):", keyErr.message);
      }

      let orderId = existingOrderId || `ORD-${Date.now()}`;

      if (productId) {
        try {
          let savedOrder;

          if (existingOrderId) {
            savedOrder = await prisma.order.update({
              where: { id: existingOrderId },
              data: { isPaid: true },
            });
          } else {
            savedOrder = await prisma.order.create({
              data: {
                isPaid: true,
                email,
                cartData: JSON.stringify(cart),
                OrderItem: {
                  create: [{ quantity, productId }],
                },
              },
            });
          }

          orderId = savedOrder.id;
          console.log("Order saved:", orderId);
        } catch (dbErr) {
          console.error("DB error (non-fatal):", dbErr.message);
        }
      }

      results.push({
        orderId,
        productName,
        planLabel,
        licenseKey: keyResult?.key || null,
        hasKey: !!keyResult?.key,
      });
    }

    if (!results.length) {
      return NextResponse.json(
        { error: "No se pudo procesar ningún producto" },
        { status: 500 }
      );
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

    const total = cart
      .reduce((sum, item) => {
        const price = Number(item?.product?.price) || 0;
        const qty = Number(item?.quantity) || 1;
        return sum + price * qty;
      }, 0)
      .toFixed(2);

    const emailResult = await sendLicenseEmail({
      to: email,
      productName: productNames,
      planLabel: planLabels,
      licenseKey,
      orderId: firstResult.orderId,
    });

    console.log("Email cliente result:", emailResult);

    const hasFreeOnlyProducts = results.every((r) =>
      FREE_PRODUCTS.includes(r.productName)
    );

    if (!hasFreeOnlyProducts) {
      const adminEmailResult = await sendAdminOrderNotification({
        customerName: email,
        customerEmail: email,
        productName: productNames,
        planLabel: planLabels,
        orderId: firstResult.orderId,
        total: `$${total}`,
        paymentMethod: paymentProvider,
        contactInfo,
        licenseKey,
      });

      console.log("Email admin result:", adminEmailResult);
    }

    return NextResponse.json({
      success: true,
      orderId: firstResult.orderId,
      products: results,
      email,
      emailResult,
    });
  } catch (error) {
    console.error("Process order ERROR:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}