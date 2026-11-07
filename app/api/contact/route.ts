import { isSpam, validateContact } from "@/lib/contact";
import { deliverContact } from "@/lib/deliver-contact";

// POST /api/contact
// - 400: el cuerpo no es JSON
// - 422: datos inválidos ({ errors })
// - 503: faltan RESEND_API_KEY o CONTACT_TO_EMAIL ({ error: "not_configured" })
// - 502: el proveedor falló al enviar ({ error: "send_failed" })
// - 200: enviado (o descartado en silencio si es spam)

export async function POST(request: Request): Promise<Response> {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "invalid_json" }, { status: 400 });
  }

  const result = validateContact(body);
  if (!result.ok) return Response.json({ errors: result.errors }, { status: 422 });

  // Bot: respondemos "ok" para no darle pistas, pero no se envía nada
  if (isSpam(result.data)) return Response.json({ ok: true });

  // Envío por email con Resend (lib/deliver-contact.ts). Solo se responde 200 si el mensaje
  // realmente salió; sin configurar, el formulario ofrece WhatsApp y email.
  const delivery = await deliverContact(result.data);
  if (delivery === "not_configured") return Response.json({ error: "not_configured" }, { status: 503 });
  if (delivery === "failed") return Response.json({ error: "send_failed" }, { status: 502 });
  return Response.json({ ok: true });
}
