import { afterEach, expect, test, vi } from "vitest";
import { isSpam, validateContact } from "@/lib/contact";
import { POST } from "@/app/api/contact/route";

const ok = { name: "Ana", email: "ana@empresa.com", message: "Quiero digitalizar el taller." };
const req = (body: unknown) =>
  new Request("http://x/api/contact", { method: "POST", body: typeof body === "string" ? body : JSON.stringify(body) });

afterEach(() => {
  delete process.env.RESEND_API_KEY;
  delete process.env.CONTACT_TO_EMAIL;
  vi.unstubAllGlobals();
});

test("valida los tres campos", () => {
  const r = validateContact({ name: "A", email: "x", message: "corto" });
  expect(r.ok).toBe(false);
  if (!r.ok) expect(Object.keys(r.errors).sort()).toEqual(["email", "message", "name"]);
});

test("acepta un input correcto y recorta espacios", () => {
  const r = validateContact({ ...ok, name: "  Ana  " });
  expect(r).toEqual({ ok: true, data: { ...ok, hp_field_x: "" } });
});

test("un campo 'company' (autocompletado del navegador) NO marca spam", () => {
  const r = validateContact({ ...ok, company: "Mi Empresa SA" });
  expect(r.ok && isSpam(r.data)).toBe(false);
});

test("rechaza algo que no es un objeto", () => {
  expect(validateContact(null).ok).toBe(false);
  expect(validateContact("hola").ok).toBe(false);
});

test("mensaje demasiado largo", () => {
  const r = validateContact({ ...ok, message: "x".repeat(2001) });
  expect(r.ok).toBe(false);
});

test("honeypot", () => {
  expect(isSpam({ ...ok, hp_field_x: "bot" })).toBe(true);
  expect(isSpam({ ...ok, hp_field_x: "" })).toBe(false);
});

test("route: 503 sin proveedor configurado", async () => {
  const res = await POST(req(ok));
  expect(res.status).toBe(503);
  expect(await res.json()).toEqual({ error: "not_configured" });
});

test("route: 422 con datos inválidos", async () => {
  const res = await POST(req({}));
  expect(res.status).toBe(422);
  expect((await res.json()).errors.email).toBeTruthy();
});

test("route: 400 con JSON roto", async () => {
  const res = await POST(req("{no es json"));
  expect(res.status).toBe(400);
});

test("route: spam responde 200 sin enviar", async () => {
  const res = await POST(req({ ...ok, hp_field_x: "bot" }));
  expect(res.status).toBe(200);
});

test("route: con la clave pero sin casilla de destino sigue en 503 (nunca un falso 'enviado')", async () => {
  process.env.RESEND_API_KEY = "re_test";
  const res = await POST(req(ok));
  expect(res.status).toBe(503);
});

test("route: configurado y Resend OK responde 200", async () => {
  vi.stubGlobal("fetch", vi.fn().mockResolvedValue(new Response("{}", { status: 200 })));
  process.env.RESEND_API_KEY = "re_test";
  process.env.CONTACT_TO_EMAIL = "contacto@serdigital.com.ar";
  const res = await POST(req(ok));
  expect(res.status).toBe(200);
});

test("route: si Resend falla responde 502 (el formulario muestra error y alternativas)", async () => {
  vi.stubGlobal("fetch", vi.fn().mockResolvedValue(new Response("{}", { status: 500 })));
  process.env.RESEND_API_KEY = "re_test";
  process.env.CONTACT_TO_EMAIL = "contacto@serdigital.com.ar";
  const res = await POST(req(ok));
  expect(res.status).toBe(502);
});
