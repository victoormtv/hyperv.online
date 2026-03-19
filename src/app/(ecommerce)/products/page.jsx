import ProductsGrid from "@/components/ProductsGrid";
import Footer from "@/components/Footer";
import prisma from "@/utils/connection";
import React from "react";

const Products = async ({ searchParams }) => {
  let products;
  if (searchParams?.cat) {
    products = await prisma.product.findMany({
      where: { categoryId: searchParams.cat },
      include: { Category: true },
    });
  } else {
    products = await prisma.product.findMany({
      orderBy: { name: "asc" },
      include: { Category: true },
    });
  }

  products = products.map(p => ({ ...p, category: p.Category }));

  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex-1">
        <ProductsGrid products={products} />
      </div>
      <Footer />
    </div>
  );
};

export default Products;
