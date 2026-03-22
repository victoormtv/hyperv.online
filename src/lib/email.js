// lib/email.js
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendLicenseEmail({
  to,
  productName,
  planLabel,
  licenseKey,
  orderId,
}) {
  const hasKey = !!licenseKey;

  const TUTORIAL_MAP = {
    "Panel Full": "https://hyperv.online/tutorial/panel-full",
    "Panel Secure": "https://hyperv.online/tutorial/panel-secure",
    "Panel Only Aimbot": "https://hyperv.online/tutorial/panel-only-aimbot",
    "Menu Chams ESP": "https://hyperv.online/tutorial/menu-chams-esp",
    "Panel Free": "https://hyperv.online/free/panel-free",
    "Bypass Free": "https://hyperv.online/free/bypass-free",
  };
  const tutorialUrl =
    TUTORIAL_MAP[productName] || "https://hyperv.online/tutorial";

  const html = `
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Tu compra en HyperV</title>
</head>
<body style="margin:0;padding:0;background:#030405;font-family:'Segoe UI',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#030405;padding:40px 20px;">
    <tr>
      <td align="center">
        <table width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background:#0a0c10;border-radius:20px;border:1px solid rgba(255,255,255,0.08);overflow:hidden;position:relative;">

          <!-- Header con grid de fondo -->
          <tr>
            <td style="background:linear-gradient(135deg,#0f1728 0%,#0a1020 50%,#0d1525 100%);padding:36px 40px;text-align:center;position:relative;overflow:hidden;">
              <!-- Grid SVG de fondo -->
              <div style="position:absolute;inset:0;opacity:0.18;background-image:linear-gradient(rgba(6,182,212,0.4) 1px,transparent 1px),linear-gradient(90deg,rgba(6,182,212,0.4) 1px,transparent 1px);background-size:32px 32px;"></div>
              <!-- Glow central -->
              <div style="position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);width:300px;height:120px;background:radial-gradient(ellipse,rgba(6,182,212,0.18) 0%,transparent 70%);pointer-events:none;"></div>
              <!-- Logo + favicon -->
              <div style="position:relative;display:inline-flex;align-items:center;gap:12px;justify-content:center;">
                <img src="https://hyperv.online/logo.png" width="36" height="36" alt="HyperV" style="border-radius:8px;display:block;" />
                <div style="text-align:left;">
                  <h1 style="margin:0;color:#fff;font-size:26px;font-weight:900;letter-spacing:-0.5px;line-height:1;">HyperV</h1>
                  <p style="margin:2px 0 0;color:rgba(6,182,212,0.8);font-size:10px;letter-spacing:3px;text-transform:uppercase;font-weight:600;">Store</p>
                </div>
              </div>
              <p style="position:relative;margin:14px 0 0;color:rgba(255,255,255,0.45);font-size:12px;letter-spacing:1.5px;text-transform:uppercase;">Confirmación de Compra</p>
            </td>
          </tr>

          <!-- Success banner -->
          <tr>
            <td style="padding:20px 40px 0;text-align:center;">
              <div style="background:rgba(74,222,128,0.08);border:1px solid rgba(74,222,128,0.25);border-radius:16px;padding:24px;display:inline-block;width:100%;box-sizing:border-box;">
                <div style="width:40px;height:40px;background:rgba(74,222,128,0.15);border:1.5px solid rgba(74,222,128,0.5);border-radius:50%;margin:0 auto 12px;text-align:center;line-height:40px;">
                  <span style="color:#4ade80;font-size:18px;font-weight:900;">✓</span>
                </div>
                <h2 style="margin:0 0 6px;color:#fff;font-size:20px;font-weight:800;">¡Pago Confirmado!</h2>
                <p style="margin:0;color:rgba(255,255,255,0.45);font-size:13px;line-height:1.6;">Tu pedido fue procesado exitosamente.</p>
              </div>
            </td>
          </tr>

          <!-- Order info -->
          <tr>
            <td style="padding:24px 40px;">
              <table width="100%" cellpadding="0" cellspacing="0" style="background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.07);border-radius:14px;overflow:hidden;">
                <tr>
                  <td style="padding:16px 20px;border-bottom:1px solid rgba(255,255,255,0.05);">
                    <p style="margin:0 0 3px;color:rgba(255,255,255,0.3);font-size:10px;text-transform:uppercase;letter-spacing:1.5px;">Producto</p>
                    <p style="margin:0;color:#fff;font-size:15px;font-weight:700;">${productName}</p>
                  </td>
                </tr>
                <tr>
                  <td style="padding:16px 20px;border-bottom:1px solid rgba(255,255,255,0.05);">
                    <p style="margin:0 0 3px;color:rgba(255,255,255,0.3);font-size:10px;text-transform:uppercase;letter-spacing:1.5px;">Plan</p>
                    <p style="margin:0;color:#fff;font-size:15px;font-weight:700;">${planLabel}</p>
                  </td>
                </tr>
                <tr>
                  <td style="padding:16px 20px;">
                    <p style="margin:0 0 3px;color:rgba(255,255,255,0.3);font-size:10px;text-transform:uppercase;letter-spacing:1.5px;">Order ID</p>
                    <p style="margin:0;color:rgba(255,255,255,0.55);font-size:12px;font-family:monospace;">${orderId}</p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          ${
            hasKey
              ? `
          <!-- License key -->
          <tr>
            <td style="padding:0 40px 24px;">
              <table width="100%" cellpadding="0" cellspacing="0" style="background:rgba(6,182,212,0.06);border:1.5px dashed rgba(6,182,212,0.4);border-radius:14px;overflow:hidden;position:relative;">
                <tr>
                  <td style="padding:24px;text-align:center;">
                    <p style="margin:0 0 10px;color:rgba(6,182,212,0.8);font-size:10px;text-transform:uppercase;letter-spacing:2.5px;font-weight:700;">🔑 Tu Licencia</p>
                    <p style="margin:0;color:#fff;font-size:16px;font-weight:900;font-family:'Courier New',monospace;letter-spacing:1.5px;word-break:break-all;background:rgba(0,0,0,0.3);padding:14px 16px;border-radius:10px;border:1px solid rgba(6,182,212,0.2);">${licenseKey}</p>
                    <p style="margin:10px 0 0;color:rgba(255,255,255,0.3);font-size:11px;">Copia esta clave y úsala en el loader</p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          `
              : `
          <!-- No key -->
          <tr>
            <td style="padding:0 40px 24px;">
              <table width="100%" cellpadding="0" cellspacing="0" style="background:rgba(59,130,246,0.06);border:1px solid rgba(59,130,246,0.2);border-radius:14px;">
                <tr>
                  <td style="padding:20px 24px;text-align:center;">
                    <p style="margin:0 0 6px;color:rgba(99,102,241,0.9);font-size:13px;font-weight:700;">📦 Entrega Manual</p>
                    <p style="margin:0;color:rgba(255,255,255,0.45);font-size:13px;line-height:1.6;">Un miembro del equipo de HyperV te contactará por Discord para entregarte tu producto.</p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          `
          }

          <!-- Tutorial button -->
          <tr>
            <td style="padding:0 40px 16px;text-align:center;">
              <a href="${tutorialUrl}"
                style="display:inline-block;background:linear-gradient(135deg,#3b82f6,#06b6d4);color:#fff;font-weight:800;font-size:14px;text-decoration:none;padding:14px 36px;border-radius:12px;letter-spacing:0.5px;box-shadow:0 4px 20px rgba(6,182,212,0.3);">
                Ver Tutorial de Instalación →
              </a>
            </td>
          </tr>

          <!-- Discord -->
          <tr>
            <td style="padding:0 40px 32px;text-align:center;">
              <p style="margin:0 0 10px;color:rgba(255,255,255,0.3);font-size:12px;">¿Necesitas ayuda? Únete a nuestro Discord</p>
              <a href="https://discord.com/invite/hypervgg"
                style="display:inline-block;background:rgba(88,101,242,0.15);border:1px solid rgba(88,101,242,0.35);color:#8b96f8;font-weight:700;font-size:13px;text-decoration:none;padding:10px 24px;border-radius:10px;">
                discord.com/invite/hypervgg
              </a>
            </td>
          </tr>

          <!-- Divider -->
          <tr>
            <td style="padding:0 40px;">
              <div style="height:1px;background:linear-gradient(90deg,transparent,rgba(6,182,212,0.2),transparent);"></div>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding:20px 40px;text-align:center;">
              <p style="margin:0;color:rgba(255,255,255,0.18);font-size:11px;line-height:1.7;">
                © 2026 HyperV Community · <a href="https://hyperv.online" style="color:rgba(6,182,212,0.5);text-decoration:none;">hyperv.online</a><br/>
                Este email fue enviado a ${to} porque realizaste una compra en nuestra tienda.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `;

  try {
    const { data, error } = await resend.emails.send({
      from: "HyperV <noreply@hyperv.online>",
      to: [to],
      subject: `✅ Tu compra de ${productName} - HyperV`,
      html,
    });

    if (error) throw new Error(error.message);
    return { success: true, id: data.id };
  } catch (err) {
    console.error("Resend error:", err);
    return { success: false, error: err.message };
  }
}
