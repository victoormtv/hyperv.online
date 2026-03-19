import Header from "@/components/Header";
import CartDrawer from "@/components/CartDrawer";
import { Toaster } from "@/components/ui/toaster";
import { getSession } from "@/utils/actions";
import prisma from "@/utils/connection";
import React from "react";

const EcommerceLayout = async ({ children }) => {
  const categories = await prisma.category.findMany();
  const session = await getSession();
  return (
    <div>
      <Toaster />
      <Header categories={categories} session={session} />
      <CartDrawer />
      {children}
    </div>
  );
};

export default EcommerceLayout;