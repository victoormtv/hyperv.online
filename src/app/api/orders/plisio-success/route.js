// app/api/orders/plisio-success/route.js
export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const cartRaw = searchParams.get("cart");
    const email = searchParams.get("email");

    if (!cartRaw || !email) {
      return Response.redirect(new URL("/success", req.url));
    }

    const cart = JSON.parse(decodeURIComponent(cartRaw));
    const decodedEmail = decodeURIComponent(email);
    const baseUrl = (
      process.env.NEXT_PUBLIC_URL || "http://localhost:3000"
    ).trim();

    const res = await fetch(`${baseUrl}/api/orders/process`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ cart, email: decodedEmail }),
    });

    const data = await res.json();
    console.log("Plisio success - process result:", data);

    if (data?.success) {
      const encoded = encodeURIComponent(JSON.stringify(data));
      return Response.redirect(new URL(`/success?data=${encoded}`, req.url));
    }

    return Response.redirect(new URL("/success", req.url));
  } catch (error) {
    console.error("Plisio success error:", error);
    return Response.redirect(new URL("/success", req.url));
  }
}
