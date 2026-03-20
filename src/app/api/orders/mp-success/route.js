export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const cartRaw = searchParams.get("cart");
  const email = searchParams.get("email");

  if (!cartRaw || !email) {
    return Response.redirect(new URL("/success", req.url));
  }

  try {
    const cart = JSON.parse(decodeURIComponent(cartRaw));

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_URL}/api/orders/process`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cart, email }),
      },
    );
    const data = await res.json();

    if (data?.success) {
      const encoded = encodeURIComponent(JSON.stringify(data));
      return Response.redirect(new URL(`/success?data=${encoded}`, req.url));
    }
  } catch (err) {
    console.error("MP success error:", err);
  }

  return Response.redirect(new URL("/success", req.url));
}
