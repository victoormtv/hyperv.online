import { NextResponse } from "next/server";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const currency = searchParams.get("currency") || "BNB";
    const status = searchParams.get("status") || "";
    const search = searchParams.get("search") || "";
    const page = searchParams.get("page") || "1";
    const limit = searchParams.get("limit") || "20";

    const apiKey = process.env.PLISIO_SECRET_KEY?.trim();

    if (!apiKey) {
      return NextResponse.json(
        { error: "Falta PLISIO_SECRET_KEY" },
        { status: 500 },
      );
    }

    const params = new URLSearchParams({
      api_key: apiKey,
      type: "invoice",
      currency,
      page,
      limit,
    });

    if (status) params.set("status", status);
    if (search) params.set("search", search);

    const res = await fetch(
      `https://api.plisio.net/api/v1/operations?${params.toString()}`,
      { cache: "no-store" },
    );

    const data = await res.json();

    return NextResponse.json({
      success: true,
      query: { currency, status, search, page, limit },
      plisio: data,
    });
  } catch (error) {
    console.error("find-plisio-payments error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
