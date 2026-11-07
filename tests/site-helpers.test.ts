import { expect, test } from "vitest";
import { site } from "@/content/site";
import { formatAddress, initials, visibleMetrics, whatsappUrl } from "@/lib/site-helpers";

test("visibleMetrics descarta los null", () => {
  expect(
    visibleMetrics([
      { label: "a", value: null },
      { label: "b", value: "10" },
    ]),
  ).toEqual([{ label: "b", value: "10" }]);
});

test("whatsappUrl arma wa.me con mensaje codificado", () => {
  expect(whatsappUrl("5492995482790", "Hola, quiero consultar")).toBe(
    "https://wa.me/5492995482790?text=Hola%2C%20quiero%20consultar",
  );
});

test("formatAddress respeta showStreet", () => {
  const c = { ...site.contact, showStreet: true };
  expect(formatAddress(c)).toBe("Mengelle 748, Cipolletti, Río Negro");
  expect(formatAddress({ ...c, showStreet: false })).toBe("Cipolletti, Río Negro");
});

test("initials toma la primera letra de nombre y apellido", () => {
  expect(initials("Rodrigo Iparraguirre")).toBe("RI");
  expect(initials("  federico   mazzei ")).toBe("FM");
});

test("contenido real cargado", () => {
  expect(site.contact.email).toBe("daniel@serdigital.com.ar");
  expect(site.contact.whatsapp).toBe("5492995482790");
  expect(site.testimonials).toHaveLength(2);
  expect(site.services.map((s) => s.title)).toEqual([
    "Consultoría de digitalización ágil",
    "Desarrollo de software a medida",
    "Seguridad informática",
  ]);
  expect(site.nav.map((n) => n.label)).toEqual(["Inicio", "Servicios", "Casos", "Blog", "Contacto"]);
});

test("el logo tiene versión para fondo oscuro y claro", () => {
  expect(site.logo).toMatchObject({
    srcDark: "/brand/logo-horizontal-oscuro.png",
    srcLight: "/brand/logo-horizontal-claro.png",
  });
});

test("el contenido no usa rayas largas", () => {
  expect(JSON.stringify(site)).not.toMatch(/[—–]/);
});

test("cada caso tiene su logo y el archivo existe en public", async () => {
  const { existsSync } = await import("node:fs");
  const { join } = await import("node:path");
  for (const c of site.cases) {
    expect(c.logo, c.slug).toBeTruthy();
    expect(existsSync(join(process.cwd(), "public", c.logo!.src)), c.logo!.src).toBe(true);
  }
});

test("el logo del producto existe en public", async () => {
  const { existsSync } = await import("node:fs");
  const { join } = await import("node:path");
  expect(existsSync(join(process.cwd(), "public", site.product.logo.src))).toBe(true);
});

test("el logo de Audire (blanco) se invierte en modo claro", () => {
  expect(site.cases.find((c) => c.slug === "audire")?.logo?.invertOnLight).toBe(true);
});
