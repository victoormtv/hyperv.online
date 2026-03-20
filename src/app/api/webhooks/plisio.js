import { NextResponse } from "next/server";
import crypto from "crypto";

export async function POST(req) {
  try {
    const body = await req.text();
    const params = new URLSearchParams(body);
    const data = Object.fromEntries(params);

    const secretKey = process.env.PLISIO_SECRET_KEY?.trim();
    const receivedHash = data.verify_hash;
    delete data.verify_hash;

    const sortedData = Object.keys(data)
      .sort()
      .reduce((acc, key) => {
        acc[key] = data[key];
        return acc;
      }, {});

    const expectedHash = crypto
      .createHash("sha1")
      .update(JSON.stringify(sortedData) + secretKey)
      .digest("hex");

    if (receivedHash !== expectedHash) {
      console.error("Plisio webhook: firma inválida");
      return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
    }

    const status = data.status;

    if (status !== "completed") {
      return NextResponse.json({ ok: true });
    }

    const orderId = data.order_number;

    console.log("Plisio payment completed:", {
      orderId,
      amount: data.invoice_total_sum,
      currency: data.currency,
      txnId: data.txn_id,
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Plisio webhook error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
