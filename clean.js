// reset-mongo.js
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function resetMongo() {
  console.log("🗑️ MONGO RESET COMPLETO...");

  // Borra en orden correcto (padres antes que hijos)
  await prisma.plan.deleteMany();
  console.log("✅ Planes borrados");

  await prisma.planToProduct.deleteMany();
  console.log("✅ PlanToProduct borrado");

  await prisma.product.deleteMany();
  console.log("✅ Productos borrados");

  await prisma.category.deleteMany();
  console.log("✅ Categorías borradas");

  console.log("🎉 BD VACÍA - ¡Ejecuta seed!");
}

resetMongo()
  .catch((e) => console.error("❌", e))
  .finally(() => prisma.$disconnect());
