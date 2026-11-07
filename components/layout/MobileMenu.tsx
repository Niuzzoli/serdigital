"use client";

import { ListIcon, XIcon } from "@phosphor-icons/react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import Link from "next/link";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import Logo from "@/components/brand/Logo";
import { site } from "@/content/site";
import { DUR, EASE } from "@/lib/motion";
import { formatAddress, whatsappUrl } from "@/lib/site-helpers";
import type { NavItem } from "@/lib/types";
import { cn } from "@/lib/cn";
import { scrollToTop } from "@/lib/scroll";

// Menú de celular y tablet: panel a pantalla completa.
// Esc cierra y devuelve el foco al botón, el foco queda adentro mientras está abierto
// y se cierra solo al cambiar de página.

export default function MobileMenu({ items, pathname }: { items: NavItem[]; pathname: string }) {
  const [open, setOpen] = useState(false);
  const [openedAt, setOpenedAt] = useState(pathname);
  const button = useRef<HTMLButtonElement>(null);
  const panel = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  // true solo en el navegador (el portal no existe en el HTML del servidor)
  const mounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );
  // Al cerrar con la X o con Esc, el foco vuelve al botón que abrió el menú
  const returnFocus = useRef(false);

  const close = () => {
    returnFocus.current = true;
    setOpen(false);
  };

  // Cerrar al navegar (se compara la ruta en render, sin efecto)
  if (open && pathname !== openedAt) setOpen(false);

  useEffect(() => {
    if (!open) {
      if (returnFocus.current) button.current?.focus();
      returnFocus.current = false;
      return;
    }
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const first = panel.current?.querySelector<HTMLElement>("a, button");
    first?.focus();

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        close();
        return;
      }
      if (e.key !== "Tab" || !panel.current) return;
      const focusables = panel.current.querySelectorAll<HTMLElement>("a, button");
      const firstEl = focusables[0];
      const lastEl = focusables[focusables.length - 1];
      if (e.shiftKey && document.activeElement === firstEl) {
        e.preventDefault();
        lastEl.focus();
      } else if (!e.shiftKey && document.activeElement === lastEl) {
        e.preventDefault();
        firstEl.focus();
      }
    };
    // Si la pantalla pasa a escritorio (ej. una tablet que se gira), el menú se cierra:
    // si no, quedaría abierto, invisible y con el scroll bloqueado.
    const desktop = window.matchMedia("(min-width: 768px)");
    const onDesktop = (e: MediaQueryListEvent) => e.matches && setOpen(false);
    document.addEventListener("keydown", onKey);
    desktop.addEventListener("change", onDesktop);
    return () => {
      document.body.style.overflow = prevOverflow;
      document.removeEventListener("keydown", onKey);
      desktop.removeEventListener("change", onDesktop);
    };
  }, [open]);

  const toggle = () => {
    setOpenedAt(pathname);
    setOpen((v) => !v);
  };

  return (
    <div className="md:hidden">
      <button
        ref={button}
        type="button"
        onClick={toggle}
        aria-expanded={open}
        aria-controls="menu-movil"
        aria-label="Abrir menú"
        tabIndex={open ? -1 : undefined}
        className={cn(
          "grid size-11 place-items-center rounded-full border border-line bg-bg-2/80 text-text transition-transform duration-150 active:scale-[0.95]",
          open && "invisible",
        )}
      >
        <ListIcon className="size-5" />
      </button>

      {/* El panel se monta en <body>: la barra flotante usa backdrop-filter y eso
          encerraría a un elemento fixed dentro de la pastilla */}
      {mounted &&
        createPortal(
      <AnimatePresence>
        {open && (
          <motion.div
            ref={panel}
            id="menu-movil"
            role="dialog"
            aria-modal="true"
            aria-label="Menú"
            className="fixed inset-0 z-[var(--z-menu)] flex flex-col overflow-y-auto bg-bg px-4 pt-3 pb-10 sm:px-6 md:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.2 } }}
            transition={{ duration: DUR.fast, ease: EASE }}
          >
            {/* Encabezado del panel: logo (cierra el menú) y la X, dentro del diálogo */}
            <div className="flex items-center justify-between py-1.5 pl-1">
              <Logo onClick={() => setOpen(false)} />
              <button
                type="button"
                onClick={close}
                aria-label="Cerrar menú"
                className="grid size-11 place-items-center rounded-full border border-line bg-bg-2 text-text transition-transform duration-150 active:scale-[0.95]"
              >
                <XIcon className="size-5" />
              </button>
            </div>
            <motion.ul
              className="mt-10 flex flex-col"
              initial="hidden"
              animate="shown"
              variants={{ hidden: {}, shown: { transition: { staggerChildren: 0.05, delayChildren: 0.05 } } }}
            >
              {items.map((item) => {
                const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
                return (
                  <motion.li
                    key={item.href}
                    variants={{
                      hidden: { opacity: 0, y: reduce ? 0 : 12 },
                      shown: { opacity: 1, y: 0, transition: { duration: DUR.base, ease: EASE } },
                    }}
                    className="border-b border-line"
                  >
                    <Link
                      href={item.href}
                      onClick={(e) => {
                        setOpen(false);
                        // "Inicio" estando en el inicio: cierra el menú y sube al principio
                        if (item.href === "/" && pathname === "/") {
                          e.preventDefault();
                          window.setTimeout(scrollToTop, 60);
                        }
                      }}
                      aria-current={active ? "page" : undefined}
                      className={cn(
                        "flex items-center justify-between py-5 text-[2rem] leading-none font-semibold tracking-[-0.03em]",
                        item.highlight ? "text-accent-text" : active ? "text-text" : "text-text/80",
                      )}
                    >
                      {item.label}
                    </Link>
                  </motion.li>
                );
              })}
            </motion.ul>

            <div className="mt-auto space-y-2 pt-10 text-sm text-muted">
              <a href={`mailto:${site.contact.email}`} className="block text-text">
                {site.contact.email}
              </a>
              <a
                href={whatsappUrl(site.contact.whatsapp, site.contact.whatsappMessage)}
                target="_blank"
                rel="noopener noreferrer"
                className="block text-text"
              >
                WhatsApp {site.contact.whatsappDisplay}
              </a>
              <p>{formatAddress(site.contact)}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>,
          document.body,
        )}
    </div>
  );
}
