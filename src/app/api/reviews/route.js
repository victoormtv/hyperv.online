import { NextResponse } from "next/server";

const CHANNEL_ID = process.env.FEEDBACK_CHANNEL_ID;
const BOT_TOKEN = process.env.DISCORD_BOT_TOKEN;

export async function GET() {
  try {
    const res = await fetch(
      `https://discord.com/api/v10/channels/${CHANNEL_ID}/messages?limit=30`,
      {
        headers: { Authorization: `Bot ${BOT_TOKEN}` },
        next: { revalidate: 3600 },
      },
    );

    if (!res.ok) throw new Error(`Discord error: ${res.status}`);

    const messages = await res.json();

    const reviews = messages
      .filter((m) => m.embeds?.length > 0)
      .map((m) => {
        const embed = m.embeds[0];
        const fields = embed.fields || [];

        const getField = (keyword) =>
          fields.find((f) => f.name.toLowerCase().includes(keyword))?.value ||
          null;

        const username =
          getField("usuario")
            ?.replace(/[*_`<>:]/g, "")
            .trim() || "Anónimo";
        const producto = getField("producto");
        const experiencia = getField("experiencia");
        const gusto = getField("gustó") || getField("gusto");
        const soporte = getField("soporte") || getField("vendedor");

        const parts = [];
        if (producto) parts.push(`🛒 **Producto:** ${producto}`);
        if (soporte) parts.push(`🤝 **Soporte:** ${soporte}`);
        if (experiencia) parts.push(`⭐ ${experiencia}`);
        if (gusto) parts.push(`💬 ${gusto}`);

        return {
          username,
          message: parts.join("\n") || "Sin comentario",
          date: new Date(embed.timestamp || m.timestamp).toLocaleDateString(
            "es-PE",
          ),
          image: embed.image?.url || null,
        };
      })
      .reverse();

    return NextResponse.json(reviews);
  } catch (e) {
    console.error("❌ Error fetching reviews:", e.message);
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
