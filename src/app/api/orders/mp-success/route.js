// app/api/orders/mp-success/route.js
import prisma from "@/utils/connection";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status");
    const externalReference = searchParams.get("external_reference");

    console.log("MP success params:", { status, externalReference });

    if (status && status !== "approved") {
      return Response.redirect(new URL("/addtocart", req.url));
    }

    if (!externalReference) {
      return Response.redirect(new URL("/success", req.url));
    }

    // Recuperar orden de DB usando el external_reference (orderId)
    const order = await prisma.order.findUnique({
      where: { id: externalReference },
    });

    if (!order?.cartData || !order?.email) {
      console.error("Order not found:", externalReference);
      return Response.redirect(new URL("/success", req.url));
    }

    const cart = JSON.parse(order.cartData);
    const email = order.email;
    const baseUrl = (
      process.env.NEXT_PUBLIC_URL || "http://localhost:3000"
    ).trim();

    const res = await fetch(`${baseUrl}/api/orders/process`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ cart, email }),
    });

    const data = await res.json();
    console.log("MP success - process result:", data);

    if (data?.success) {
      const encoded = encodeURIComponent(JSON.stringify(data));
      return Response.redirect(new URL(`/success?data=${encoded}`, req.url));
    }

    return Response.redirect(new URL("/success", req.url));
  } catch (error) {
    console.error("MP success error:", error);
    return Response.redirect(new URL("/success", req.url));
  }
}
