import Carousels from "@/components/Carousels";
import Feedbacks from "@/components/Feedbacks";
import Fashsales from "@/components/Fashsales";
import Footer from "@/components/Footer";
import { Separator } from "@/components/ui/separator";
import prisma from "@/utils/connection";

export default async function Home() {
  const PRODUCT_NAMES = [
    "Panel Secure",
    "Bypass UID",
    "Aimbot Color",
    "Panel Full",
    "Panel Android",
    "Panel CSGO",
  ];

  const [products, popularProducts, categories] = await prisma?.$transaction([
    prisma.product.findMany({ take: 12, skip: 0 }),
    prisma.product.findMany({
      where: { name: { in: PRODUCT_NAMES } },
      take: 6,
      orderBy: { name: "asc" },
    }),
    prisma.category.findMany({ take: 12, skip: 0 }),
  ]);

  return (
    <div className="">
      <Carousels />
      <div className="px-[10%]">
        <Fashsales
          title="Nuestros Productos"
          heading="Explora Nuestros Productos"
          products={popularProducts}
        />
        <Separator className="my-4" />
        <Feedbacks />
      </div>
      <Footer />
    </div>
  );
}
