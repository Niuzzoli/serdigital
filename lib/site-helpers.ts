import type { Contact, Metric } from "./types";

/** Métricas con valor cargado. Las que siguen en null no se muestran. */
export function visibleMetrics(metrics: Metric[]): Metric[] {
  return metrics.filter((m) => m.value !== null && m.value.trim() !== "");
}

export function whatsappUrl(phone: string, message: string): string {
  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
}

export function formatAddress(c: Contact): string {
  const place = `${c.city}, ${c.region}`;
  return c.showStreet && c.street ? `${c.street}, ${place}` : place;
}

export function initials(name: string): string {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}
