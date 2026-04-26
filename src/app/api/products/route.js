import prisma from "@/utils/connection";

export async function GET() {
  try {
    const products = await prisma.product.findMany({
      select: { id: true, name: true, images: true },
      orderBy: { order: "asc" },
    });

    return Response.json(products);
  } catch (e) {
    return Response.json({ error: "Error fetching products" }, { status: 500 });
  }
}
