import { afterEach, beforeEach, expect, test, vi } from "vitest";
import { deliverContact } from "@/lib/deliver-contact";

const data = { name: "Ana <b>", email: "ana@empresa.com", message: "Quiero digitalizar el taller.\nGracias." };

beforeEach(() => {
  delete process.env.RESEND_API_KEY;
  delete process.env.CONTACT_TO_EMAIL;
  delete process.env.CONTACT_FROM_EMAIL;
});
afterEach(() => vi.unstubAllGlobals());

const configure = () => {
  process.env.RESEND_API_KEY = "re_test";
  process.env.CONTACT_TO_EMAIL = "contacto@serdigital.com.ar";
};

test("sin clave de Resend: not_configured y no llama a la API", async () => {
  const fetchMock = vi.fn();
  vi.stubGlobal("fetch", fetchMock);
  process.env.CONTACT_TO_EMAIL = "contacto@serdigital.com.ar";
  expect(await deliverContact(data)).toBe("not_configured");
  expect(fetchMock).not.toHaveBeenCalled();
});

test("sin casilla de destino: not_configured", async () => {
  vi.stubGlobal("fetch", vi.fn());
  process.env.RESEND_API_KEY = "re_test";
  expect(await deliverContact(data)).toBe("not_configured");
});

test("con todo configurado envía a Resend y responde sent", async () => {
  const fetchMock = vi.fn().mockResolvedValue(new Response(JSON.stringify({ id: "x" }), { status: 200 }));
  vi.stubGlobal("fetch", fetchMock);
  configure();

  expect(await deliverContact(data)).toBe("sent");

  const [url, init] = fetchMock.mock.calls[0];
  expect(url).toBe("https://api.resend.com/emails");
  expect(init.method).toBe("POST");
  expect(init.headers.Authorization).toBe("Bearer re_test");
  const body = JSON.parse(init.body);
  expect(body.to).toEqual(["contacto@serdigital.com.ar"]);
  expect(body.reply_to).toBe("ana@empresa.com");
  expect(body.from).toBe("Serdigital <onboarding@resend.dev>");
  expect(body.subject).toContain("Ana");
  expect(body.text).toContain("Quiero digitalizar el taller.");
  // El HTML escapa lo que escribe el visitante
  expect(body.html).toContain("Ana &#60;b&#62;");
  expect(body.html).not.toContain("<b>");
});

test("usa CONTACT_FROM_EMAIL si está cargado", async () => {
  const fetchMock = vi.fn().mockResolvedValue(new Response("{}", { status: 200 }));
  vi.stubGlobal("fetch", fetchMock);
  configure();
  process.env.CONTACT_FROM_EMAIL = "Serdigital <web@serdigital.com.ar>";
  await deliverContact(data);
  expect(JSON.parse(fetchMock.mock.calls[0][1].body).from).toBe("Serdigital <web@serdigital.com.ar>");
});

test("si Resend responde error: failed", async () => {
  vi.stubGlobal("fetch", vi.fn().mockResolvedValue(new Response("{}", { status: 422 })));
  configure();
  expect(await deliverContact(data)).toBe("failed");
});

test("si falla la red: failed", async () => {
  vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new Error("offline")));
  configure();
  expect(await deliverContact(data)).toBe("failed");
});

test("si Resend rechaza, el log incluye su motivo (ej. dominio sin verificar)", async () => {
  const motivo = "You can only send testing emails to your own email address";
  vi.stubGlobal(
    "fetch",
    vi.fn().mockResolvedValue(new Response(JSON.stringify({ statusCode: 403, message: motivo }), { status: 403 })),
  );
  const log = vi.spyOn(console, "error").mockImplementation(() => {});
  configure();
  expect(await deliverContact(data)).toBe("failed");
  expect(log.mock.calls.flat().join(" ")).toContain(motivo);
  log.mockRestore();
});
