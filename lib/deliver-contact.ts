import type { ContactInput } from "./contact";

export type DeliveryResult = "sent" | "not_configured" | "failed";

// Envío del formulario de contacto por email con Resend (https://resend.com), vía su API HTTP.
//
// Variables de entorno (cargarlas en Vercel → Settings → Environment Variables; ver .env.example):
//   RESEND_API_KEY      clave de la cuenta de Resend
//   CONTACT_TO_EMAIL    casilla que recibe las consultas (ej. contacto@serdigital.com.ar)
//   CONTACT_FROM_EMAIL  remitente. Opcional: sin dominio verificado en Resend solo se puede enviar
//                       desde onboarding@resend.dev y únicamente al mail con el que creaste la cuenta.
//                       Con serdigital.com.ar verificado: "Serdigital <web@serdigital.com.ar>"
//
// Si falta la clave o el destino devuelve "not_configured": el formulario muestra WhatsApp y email
// en lugar de decir "enviado". Nunca escribas claves en el código.

const RESEND_URL = "https://api.resend.com/emails";
const DEFAULT_FROM = "Serdigital <onboarding@resend.dev>";

const escapeHtml = (text: string) => text.replace(/[&<>"']/g, (c) => `&#${c.charCodeAt(0)};`);

export async function deliverContact(data: ContactInput): Promise<DeliveryResult> {
  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_TO_EMAIL;
  if (!apiKey || !to) return "not_configured";

  const from = process.env.CONTACT_FROM_EMAIL || DEFAULT_FROM;
  const lines = [`Nombre: ${data.name}`, `Email: ${data.email}`];

  try {
    const res = await fetch(RESEND_URL, {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from,
        to: [to],
        // "Responder" en el mail le contesta directo al visitante
        reply_to: data.email,
        subject: `Nueva consulta desde la web · ${data.name}`,
        text: [...lines, "", data.message].join("\n"),
        html: `${lines.map((l) => `<p style="margin:0 0 4px">${escapeHtml(l)}</p>`).join("")}
<p style="margin:16px 0 0;white-space:pre-wrap">${escapeHtml(data.message)}</p>`,
      }),
    });
    if (!res.ok) {
      // El motivo de Resend queda en los logs de Vercel. El más común:
      // "You can only send testing emails to your own email address" → falta verificar el dominio
      // en Resend y/o cargar CONTACT_FROM_EMAIL con una dirección de ese dominio.
      const detail = await res
        .json()
        .then((b: { message?: string }) => b?.message ?? "")
        .catch(() => "");
      console.error(`Formulario de contacto: Resend respondió ${res.status}. ${detail}`);
      return "failed";
    }
    return "sent";
  } catch (error) {
    console.error("Formulario de contacto: no se pudo conectar con Resend", error);
    return "failed";
  }
}
