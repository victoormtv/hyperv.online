export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const order = searchParams.get("order");

    if (order) {
      return Response.redirect(new URL(`/success?order=${order}`, req.url));
    }

    return Response.redirect(new URL("/success", req.url));
  } catch (error) {
    console.error("Plisio success error:", error);
    return Response.redirect(new URL("/success", req.url));
  }
}
