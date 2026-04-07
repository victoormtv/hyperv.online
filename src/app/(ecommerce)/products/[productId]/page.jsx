import prisma from "@/utils/connection";
import { notFound } from "next/navigation";
import ProductPageClient from "@/components/ProductPageClient";

const GOLD_BEST = ["Panel Secure", "Bypass UID", "Aimbot Color", "Panel Full"];

const ProductId = async ({ params }) => {
  const raw = await prisma.product.findUnique({
    where: { id: params.productId },
    include: { Category: true, plans: true },
  });

  if (!raw) notFound();

  const product = { ...raw, category: raw.Category };
  const isGoldBest = GOLD_BEST.includes(product.name);
  const features = Array.isArray(product.features) ? product.features : [];

  return (
    <ProductPageClient
      product={product}
      isGoldBest={isGoldBest}
      features={features}
    />
  );
};

export default ProductId;