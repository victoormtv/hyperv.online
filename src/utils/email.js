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
        <table width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background:#0d0f14;border-radius:20px;border:1px solid rgba(255,255,255,0.08);overflow:hidden;">

          <!-- Header -->
          <tr>
            <td style="background:linear-gradient(135deg,#3b82f6,#06b6d4);padding:32px 40px;text-align:center;">
              <h1 style="margin:0;color:#fff;font-size:28px;font-weight:900;letter-spacing:-0.5px;">HyperV</h1>
              <p style="margin:6px 0 0;color:rgba(255,255,255,0.8);font-size:13px;letter-spacing:2px;text-transform:uppercase;">Community</p>
            </td>
          </tr>

          <!-- Success icon -->
          <tr>
            <td style="padding:36px 40px 0;text-align:center;">
              <div style="width:64px;height:64px;background:rgba(74,222,128,0.15);border:2px solid rgba(74,222,128,0.4);border-radius:50%;margin:0 auto 20px;display:flex;align-items:center;justify-content:center;">
                <span style="font-size:28px;">✓</span>
              </div>
              <h2 style="margin:0 0 8px;color:#fff;font-size:22px;font-weight:800;">¡Pago Confirmado!</h2>
              <p style="margin:0;color:rgba(255,255,255,0.5);font-size:14px;line-height:1.6;">
                Gracias por tu compra. Tu pedido ha sido procesado exitosamente.
              </p>
            </td>
          </tr>

          <!-- Order info -->
          <tr>
            <td style="padding:28px 40px;">
              <table width="100%" cellpadding="0" cellspacing="0" style="background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.08);border-radius:14px;overflow:hidden;">
                <tr>
                  <td style="padding:20px 24px;border-bottom:1px solid rgba(255,255,255,0.06);">
                    <p style="margin:0 0 4px;color:rgba(255,255,255,0.35);font-size:11px;text-transform:uppercase;letter-spacing:1px;">Producto</p>
                    <p style="margin:0;color:#fff;font-size:15px;font-weight:700;">${productName}</p>
                  </td>
                </tr>
                <tr>
                  <td style="padding:20px 24px;border-bottom:1px solid rgba(255,255,255,0.06);">
                    <p style="margin:0 0 4px;color:rgba(255,255,255,0.35);font-size:11px;text-transform:uppercase;letter-spacing:1px;">Plan</p>
                    <p style="margin:0;color:#fff;font-size:15px;font-weight:700;">${planLabel}</p>
                  </td>
                </tr>
                <tr>
                  <td style="padding:20px 24px;">
                    <p style="margin:0 0 4px;color:rgba(255,255,255,0.35);font-size:11px;text-transform:uppercase;letter-spacing:1px;">Order ID</p>
                    <p style="margin:0;color:rgba(255,255,255,0.7);font-size:13px;font-family:monospace;">${orderId}</p>
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
            <td style="padding:0 40px 28px;">
              <table width="100%" cellpadding="0" cellspacing="0" style="background:rgba(6,182,212,0.08);border:2px dashed rgba(6,182,212,0.35);border-radius:14px;">
                <tr>
                  <td style="padding:24px;text-align:center;">
                    <p style="margin:0 0 6px;color:rgba(6,182,212,0.7);font-size:11px;text-transform:uppercase;letter-spacing:2px;font-weight:700;">Tu Licencia</p>
                    <p style="margin:0;color:#fff;font-size:18px;font-weight:900;font-family:monospace;letter-spacing:2px;word-break:break-all;">${licenseKey}</p>
                    <p style="margin:10px 0 0;color:rgba(255,255,255,0.35);font-size:12px;">Copia esta clave y úsala en el loader</p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          `
              : `
          <!-- No key products -->
          <tr>
            <td style="padding:0 40px 28px;">
              <table width="100%" cellpadding="0" cellspacing="0" style="background:rgba(59,130,246,0.08);border:1px solid rgba(59,130,246,0.25);border-radius:14px;">
                <tr>
                  <td style="padding:20px 24px;text-align:center;">
                    <p style="margin:0 0 6px;color:rgba(59,130,246,0.9);font-size:13px;font-weight:700;">📦 Entrega Manual</p>
                    <p style="margin:0;color:rgba(255,255,255,0.5);font-size:13px;line-height:1.6;">
                      Un miembro del equipo de HyperV te contactará por Discord para entregarte tu producto.
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          `
          }

          <!-- Tutorial button -->
          <tr>
            <td style="padding:0 40px 28px;text-align:center;">
              <a href="https://hyperv.online/tutorial" style="display:inline-block;background:linear-gradient(135deg,#3b82f6,#06b6d4);color:#fff;font-weight:800;font-size:14px;text-decoration:none;padding:14px 32px;border-radius:12px;letter-spacing:0.5px;">
                Ver Tutorial de Instalación →
              </a>
            </td>
          </tr>

          <!-- Discord -->
          <tr>
            <td style="padding:0 40px 32px;text-align:center;">
              <p style="margin:0 0 12px;color:rgba(255,255,255,0.35);font-size:13px;">¿Necesitas ayuda? Únete a nuestro Discord</p>
              <a href="https://discord.com/invite/hypervgg" style="display:inline-block;background:rgba(88,101,242,0.2);border:1px solid rgba(88,101,242,0.4);color:#8b96f8;font-weight:700;font-size:13px;text-decoration:none;padding:10px 24px;border-radius:10px;">
                discord.com/invite/hypervgg
              </a>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding:20px 40px;border-top:1px solid rgba(255,255,255,0.06);text-align:center;">
              <p style="margin:0;color:rgba(255,255,255,0.2);font-size:11px;line-height:1.6;">
                © 2026 HyperV Community · hyperv.online<br/>
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
