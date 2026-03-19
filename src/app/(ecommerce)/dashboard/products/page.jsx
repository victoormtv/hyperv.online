import ProductsGrid from "@/components/ProductsGrid";
import prisma from "@/utils/connection";
import React from "react";

const Products = async () => {
  const products = await prisma.product.findMany({
    orderBy: { name: "asc" },
    include: { Category: true },
  });

  const normalized = products.map((p) => ({ ...p, category: p.Category }));

  return <ProductsGrid products={normalized} />;
};

export default Products;
