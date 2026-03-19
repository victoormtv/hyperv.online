import { MercadoPagoConfig, Preference } from "mercadopago";

const client = new MercadoPagoConfig({
  accessToken: "APP_USR-549383935739884-010418-8a5a45c5e10af07b2bc41e548206f138-527132541",
});

async function main() {
  const preference = new Preference(client);
  const baseUrl = "http://localhost:3000";

  const body = {
    items: [
      {
        id: "test",
        title: "Test item",
        quantity: 1,
        unit_price: 10,
        currency_id: "PEN"
      }
    ],
    payer: { email: "test@example.com" },
    back_urls: {
      success: `${baseUrl}/success`,
      failure: `${baseUrl}/addtocart`,
      pending: `${baseUrl}/addtocart`,
    },
    auto_return: "approved",
    statement_descriptor: "HyperV Community",
  };

  try {
    const result = await preference.create({ body });
    console.log("Success:", result.init_point);
  } catch (error) {
    console.error("Error stringified:", JSON.stringify(error, null, 2));
  }
}

main().catch(console.error);
