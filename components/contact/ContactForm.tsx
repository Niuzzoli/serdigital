"use client";

import { CheckCircleIcon, WarningCircleIcon } from "@phosphor-icons/react";
import { AnimatePresence, motion } from "motion/react";
import { useId, useRef, useState, type FormEvent } from "react";
import PillButton from "@/components/ui/PillButton";
import { site } from "@/content/site";
import { validateContact, type ContactErrors, type ContactField } from "@/lib/contact";
import { DUR, EASE } from "@/lib/motion";
import { whatsappUrl } from "@/lib/site-helpers";
import { cn } from "@/lib/cn";

type Status = "idle" | "sending" | "success" | "error" | "unavailable";
type Values = Record<ContactField, string> & { hp_field_x: string };

const EMPTY: Values = { name: "", email: "", message: "", hp_field_x: "" };

const FIELDS: { key: ContactField; label: string; type?: string; autoComplete: string; multiline?: boolean }[] = [
  { key: "name", label: "Nombre", autoComplete: "name" },
  { key: "email", label: "Email", type: "email", autoComplete: "email" },
  { key: "message", label: "Mensaje", autoComplete: "off", multiline: true },
];

export default function ContactForm() {
  const id = useId();
  const formRef = useRef<HTMLFormElement>(null);
  const [values, setValues] = useState<Values>(EMPTY);
  const [errors, setErrors] = useState<ContactErrors>({});
  const [touched, setTouched] = useState<Partial<Record<ContactField, boolean>>>({});
  const [status, setStatus] = useState<Status>("idle");

  const fieldError = (key: ContactField) => (touched[key] ? errors[key] : undefined);

  const validateField = (key: ContactField, next: Values) => {
    const r = validateContact(next);
    setErrors((prev) => ({ ...prev, [key]: r.ok ? undefined : r.errors[key] }));
  };

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (status === "sending") return;
    const r = validateContact(values);
    if (!r.ok) {
      setErrors(r.errors);
      setTouched({ name: true, email: true, message: true });
      const first = FIELDS.find((f) => r.errors[f.key]);
      if (first) formRef.current?.querySelector<HTMLElement>(`[name="${first.key}"]`)?.focus();
      return;
    }

    setStatus("sending");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      if (res.ok) {
        setStatus("success");
        setValues(EMPTY);
        setTouched({});
      } else if (res.status === 503) {
        setStatus("unavailable");
      } else if (res.status === 422) {
        const body = (await res.json()) as { errors?: ContactErrors };
        setErrors(body.errors ?? {});
        setTouched({ name: true, email: true, message: true });
        setStatus("idle");
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <motion.div
        role="status"
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: DUR.base, ease: EASE }}
        className="rounded-[var(--radius-card)] border border-line bg-surface/60 p-8"
      >
        <CheckCircleIcon aria-hidden weight="fill" className="size-8 text-success" />
        <h2 className="mt-4 text-2xl font-semibold tracking-[-0.02em]">¡Gracias! Recibimos tu mensaje.</h2>
        <p className="mt-2 text-muted">Te vamos a responder a la brevedad al email que nos dejaste.</p>
        <button
          type="button"
          onClick={() => setStatus("idle")}
          className="mt-6 text-sm font-medium text-text underline underline-offset-4"
        >
          Enviar otro mensaje
        </button>
      </motion.div>
    );
  }

  return (
    <form ref={formRef} noValidate onSubmit={onSubmit} className="grid gap-6" aria-describedby={`${id}-status`}>
      {FIELDS.map((f) => {
        const err = fieldError(f.key);
        const inputId = `${id}-${f.key}`;
        const common = {
          id: inputId,
          name: f.key,
          value: values[f.key],
          autoComplete: f.autoComplete,
          "aria-invalid": err ? true : undefined,
          "aria-describedby": err ? `${inputId}-error` : undefined,
          onChange: (e: { target: { value: string } }) => {
            const next = { ...values, [f.key]: e.target.value };
            setValues(next);
            if (touched[f.key]) validateField(f.key, next);
          },
          onBlur: () => {
            setTouched((t) => ({ ...t, [f.key]: true }));
            validateField(f.key, values);
          },
          className: cn(
            "w-full rounded-[var(--radius-input)] border bg-bg-2 px-4 text-base text-text placeholder:text-muted/70",
            "transition-[border-color,box-shadow] duration-200 outline-none",
            "focus-visible:border-accent focus-visible:shadow-[0_0_0_3px_color-mix(in_oklab,var(--accent)_25%,transparent)] focus-visible:outline-none",
            err ? "border-danger" : "border-line-strong hover:border-text/30",
          ),
        };
        return (
          <div key={f.key} className="grid gap-2">
            <label htmlFor={inputId} className="text-sm font-medium text-text">
              {f.label}
            </label>
            {f.multiline ? (
              <textarea {...common} rows={6} className={cn(common.className, "resize-y py-3 leading-relaxed")} />
            ) : (
              <input {...common} type={f.type ?? "text"} className={cn(common.className, "h-12")} />
            )}
            {err && (
              <p id={`${inputId}-error`} className="flex items-center gap-1.5 text-sm text-danger">
                <WarningCircleIcon aria-hidden weight="bold" className="size-4 shrink-0" />
                {err}
              </p>
            )}
          </div>
        );
      })}

      {/* Campo trampa para bots: invisible para personas y lectores de pantalla */}
      <div aria-hidden className="absolute -left-[9999px] h-px w-px overflow-hidden">
        <label htmlFor={`${id}-hp`}>No completar</label>
        <input
          id={`${id}-hp`}
          name="hp_field_x"
          tabIndex={-1}
          autoComplete="off"
          value={values.hp_field_x}
          onChange={(e) => setValues({ ...values, hp_field_x: e.target.value })}
        />
      </div>

      <div className="flex flex-wrap items-center gap-4">
        <PillButton
          type="submit"
          label={status === "sending" ? "Enviando..." : "Enviar mensaje"}
          disabled={status === "sending"}
          aria-busy={status === "sending"}
        />
      </div>

      <div id={`${id}-status`} aria-live="polite">
        <AnimatePresence>
          {(status === "error" || status === "unavailable") && (
            <motion.div
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: DUR.fast, ease: EASE }}
              className="rounded-[var(--radius-input)] border border-accent/40 bg-accent/10 p-5 text-sm leading-relaxed"
            >
              <p className="font-medium text-text">
                {status === "unavailable"
                  ? "El formulario todavía no está activo."
                  : "No pudimos enviar tu mensaje. Probá de nuevo en unos minutos."}
              </p>
              <p className="mt-1 text-text/80">
                Mientras tanto, escribinos por{" "}
                <a
                  href={whatsappUrl(site.contact.whatsapp, site.contact.whatsappMessage)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-medium text-accent-text underline underline-offset-4"
                >
                  WhatsApp
                </a>{" "}
                o a{" "}
                <a href={`mailto:${site.contact.email}`} className="font-medium text-accent-text underline underline-offset-4">
                  {site.contact.email}
                </a>
                .
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </form>
  );
}
