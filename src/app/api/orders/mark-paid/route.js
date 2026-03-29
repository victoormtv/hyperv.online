// app/api/orders/mark-paid/route.js
import { NextResponse } from "next/server";
import prisma from "@/utils/connection";

export async function POST(req) {
  try {
    const { orderId } = await req.json();

    if (!orderId) {
      return NextResponse.json({ error: "Falta orderId" }, { status: 400 });
    }

    const updatedOrder = await prisma.order.update({
      where: { id: orderId },
      data: { isPaid: true },
    });

    return NextResponse.json({
      success: true,
      order: updatedOrder,
    });
  } catch (error) {
    console.error("mark-paid error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
