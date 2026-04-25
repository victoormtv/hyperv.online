// delete-bypass-uid.ts
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  const product = await prisma.product.findFirst({
    where: { name: "Bypass UID" },
  });

  if (!product) {
    console.log("✅ 'Bypass UID' no existe, nada que hacer.");
    return;
  }

  console.log(`🔍 Encontrado: ${product.name} (id: ${product.id})`);

  // 1. Borrar planes
  const plans = await prisma.plan.deleteMany({ where: { productId: product.id } });
  console.log(`🗑️  ${plans.count} plan(es) eliminados`);

  // 2. Borrar OrderItems
  const items = await prisma.orderItem.deleteMany({ where: { productId: product.id } });
  console.log(`🗑️  ${items.count} OrderItem(s) eliminados`);

  // 3. Borrar el producto
  await prisma.product.delete({ where: { id: product.id } });
  console.log(`✅ Producto 'Bypass UID' eliminado correctamente`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());