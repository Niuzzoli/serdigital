// Validación del formulario de contacto. La usan el formulario (cliente) y el
// route handler (servidor), así las reglas son siempre las mismas.

export type ContactInput = {
  name: string;
  email: string;
  message: string;
  /**
   * Campo trampa para bots (oculto). Si viene con texto, es spam.
   * El nombre no significa nada para el autocompletado del navegador
   * (un campo "company" se rellenaba solo y descartaba consultas reales).
   */
  hp_field_x?: string;
};

export type ContactField = "name" | "email" | "message";
export type ContactErrors = Partial<Record<ContactField, string>>;

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateContact(
  input: unknown,
): { ok: true; data: ContactInput } | { ok: false; errors: ContactErrors } {
  const raw = (typeof input === "object" && input !== null ? input : {}) as Record<string, unknown>;
  const str = (v: unknown) => (typeof v === "string" ? v.trim() : "");
  const data: ContactInput = {
    name: str(raw.name),
    email: str(raw.email),
    message: str(raw.message),
    hp_field_x: str(raw.hp_field_x),
  };

  const errors: ContactErrors = {};
  if (data.name.length < 2) errors.name = "Escribí tu nombre.";
  else if (data.name.length > 80) errors.name = "El nombre es demasiado largo (máximo 80 caracteres).";

  if (!data.email) errors.email = "Escribí tu email.";
  else if (data.email.length > 120 || !EMAIL.test(data.email))
    errors.email = "Revisá el email: parece que no es válido.";

  if (data.message.length < 10) errors.message = "Contanos un poco más (al menos 10 caracteres).";
  else if (data.message.length > 2000) errors.message = "El mensaje es demasiado largo (máximo 2000 caracteres).";

  return Object.keys(errors).length > 0 ? { ok: false, errors } : { ok: true, data };
}

export function isSpam(input: ContactInput): boolean {
  return Boolean(input.hp_field_x && input.hp_field_x.trim() !== "");
}
