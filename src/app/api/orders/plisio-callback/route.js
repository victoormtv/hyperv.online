import crypto from "crypto";

const processedPayments = globalThis.__processedPlisioPayments || new Set();
globalThis.__processedPlisioPayments = processedPayments;

function sortObject(obj) {
  return Object.keys(obj)
    .sort()
    .reduce((acc, key) => {
      acc[key] = obj[key];
      return acc;
    }, {});
}

function verifyPlisioCallback(data, secretKey) {
  try {
    if (!data?.verify_hash || !secretKey) return false;

    const payload = { ...data };
    const verifyHash = payload.verify_hash;
    delete payload.verify_hash;

    const ordered = sortObject(payload);

    if (ordered.expire_utc !== undefined && ordered.expire_utc !== null) {
      ordered.expire_utc = String(ordered.expire_utc);
    }

    if (ordered.tx_urls !== undefined && ordered.tx_urls !== null) {
      ordered.tx_urls = String(ordered.tx_urls);
    }

    const serialized = JSON.stringify(ordered);
    const expectedHash = crypto
      .createHmac("sha1", secretKey)
      .update(serialized)
      .digest("hex");

    return expectedHash === verifyHash;
  } catch {
    return false;
  }
}

function isPaidStatus(status) {
  return ["completed", "mismatch"].includes(String(status || "").toLowerCase());
}

export async function POST(req) {
  try {
    const url = new URL(req.url);
    const orderDataRaw = url.searchParams.get("orderData");
    const baseUrl = (
      process.env.NEXT_PUBLIC_URL || "http://localhost:3000"
    ).trim();
    const secretKey = process.env.PLISIO_SECRET_KEY?.trim();

    const body = await req.json();

    console.log("=== PLISIO CALLBACK ===");
    console.log(JSON.stringify(body, null, 2));

    if (!verifyPlisioCallback(body, secretKey)) {
      console.error("Firma inválida en callback de Plisio");
      return Response.json({ error: "Invalid signature" }, { status: 403 });
    }

    const status = String(body?.status || "").toLowerCase();
    const txnId = body?.txn_id || body?.order_number || body?.invoice_id;

    if (!txnId) {
      return Response.json(
        { error: "Callback sin identificador" },
        { status: 400 },
      );
    }

    if (!isPaidStatus(status)) {
      return Response.json({
        ok: true,
        ignored: true,
        reason: `Estado no procesable: ${status}`,
      });
    }

    if (processedPayments.has(String(txnId))) {
      return Response.json({
        ok: true,
        duplicated: true,
        txnId,
      });
    }

    if (!orderDataRaw) {
      return Response.json({ error: "Falta orderData" }, { status: 400 });
    }

    const parsed = JSON.parse(decodeURIComponent(orderDataRaw));
    const { cart, email, orderNumber } = parsed || {};

    if (!cart || !email) {
      return Response.json({ error: "orderData incompleto" }, { status: 400 });
    }

    const processRes = await fetch(`${baseUrl}/api/orders/process`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        cart,
        email,
        paymentProvider: "plisio",
        paymentStatus: status,
        paymentTxnId: body?.txn_id || null,
        paymentOrderNumber: body?.order_number || orderNumber || null,
        rawPayment: body,
      }),
      cache: "no-store",
    });

    const processData = await processRes.json();

    if (!processRes.ok || !processData?.success) {
      console.error("Error procesando orden:", processData);
      return Response.json(
        { error: "No se pudo procesar la orden", details: processData },
        { status: 500 },
      );
    }

    processedPayments.add(String(txnId));

    return Response.json({
      ok: true,
      processed: true,
      txnId,
      orderNumber: body?.order_number || orderNumber || null,
      result: processData,
    });
  } catch (error) {
    console.error("Plisio callback error:", error);
    return Response.json(
      { error: error?.message || "Error interno" },
      { status: 500 },
    );
  }
}
