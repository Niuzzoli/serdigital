import Link from "next/link";
import type { ComponentProps } from "react";
import { ArrowUpRightIcon } from "@phosphor-icons/react/dist/ssr";
import { cn } from "@/lib/cn";

// Botón pastilla con flecha (portado del portafolio).
// Hover: el círculo de la flecha crece hasta llenar la pastilla, el texto rueda
// hacia arriba y la flecha sale en diagonal mientras entra otra desde abajo.
// Con href es un link (interno con next/link); sin href, un <button>.

const sizes = {
  sm: { pill: "h-10 gap-3 pl-4 pr-1 text-sm font-medium", dot: "size-8", arrow: "size-3.5" },
  md: { pill: "h-12 gap-4 pl-6 pr-1.5 text-[15px] font-semibold", dot: "size-9", arrow: "size-4" },
};

const variants = {
  // Naranja con círculo oscuro; al hover se llena de oscuro y el texto pasa a claro (en ambos temas)
  accent: {
    pill: "bg-accent text-accent-ink",
    dot: "bg-accent-ink text-accent",
    // El relleno es --accent-ink en los dos temas: el texto va siempre claro encima
    hoverText: "group-hover:text-on-accent-ink group-focus-visible:text-on-accent-ink",
  },
  // Claro con círculo naranja; al hover se llena de naranja
  light: {
    pill: "bg-text text-bg",
    dot: "bg-accent text-accent-ink",
    hoverText: "group-hover:text-accent-ink group-focus-visible:text-accent-ink",
  },
};

type Common = {
  label: string;
  size?: keyof typeof sizes;
  variant?: keyof typeof variants;
  className?: string;
};

type PillButtonProps = Common &
  (
    | (Omit<ComponentProps<"a">, "className"> & { href: string })
    | (Omit<ComponentProps<"button">, "className"> & { href?: undefined })
  );

const EASE = "ease-[cubic-bezier(0.22,1,0.36,1)]";

export default function PillButton({
  label,
  size = "md",
  variant = "accent",
  className,
  ...props
}: PillButtonProps) {
  const s = sizes[size];
  const v = variants[variant];

  const classes = cn(
    "group relative isolate inline-flex w-fit shrink-0 items-center overflow-hidden whitespace-nowrap rounded-full select-none",
    "transition-transform duration-150 ease-out active:scale-[0.97] disabled:pointer-events-none disabled:opacity-60",
    s.pill,
    v.pill,
    className,
  );

  const content = (
    <>
      <span
        aria-hidden
        className={cn(
          "absolute top-1/2 right-1.5 -z-10 -translate-y-1/2 rounded-full transition-transform duration-700",
          "group-hover:scale-[12] group-focus-visible:scale-[12]",
          size === "sm" && "right-1",
          EASE,
          s.dot,
          v.dot,
        )}
      />
      <span className={cn("relative block overflow-hidden transition-colors duration-500", v.hoverText)}>
        <span
          className={cn(
            "block transition-transform duration-500 group-hover:-translate-y-full group-focus-visible:-translate-y-full",
            EASE,
          )}
        >
          {label}
        </span>
        <span
          aria-hidden
          className={cn(
            "absolute inset-0 translate-y-full transition-transform duration-500 group-hover:translate-y-0 group-focus-visible:translate-y-0",
            EASE,
          )}
        >
          {label}
        </span>
      </span>
      <span
        className={cn(
          "relative grid shrink-0 place-items-center overflow-hidden rounded-full transition-transform duration-500 group-hover:rotate-45 group-focus-visible:rotate-45",
          EASE,
          s.dot,
          v.dot,
        )}
      >
        <ArrowUpRightIcon
          weight="bold"
          className={cn(
            s.arrow,
            "transition-transform duration-500 group-hover:translate-x-[180%] group-hover:-translate-y-[180%] group-focus-visible:translate-x-[180%] group-focus-visible:-translate-y-[180%]",
            EASE,
          )}
        />
        <ArrowUpRightIcon
          weight="bold"
          aria-hidden
          className={cn(
            s.arrow,
            "absolute -translate-x-[180%] translate-y-[180%] transition-transform delay-100 duration-500 group-hover:translate-0 group-focus-visible:translate-0",
            EASE,
          )}
        />
      </span>
    </>
  );

  if (props.href !== undefined) {
    const { href, ...rest } = props as ComponentProps<"a"> & { href: string };
    if (href.startsWith("/")) {
      return (
        <Link href={href} {...rest} className={classes}>
          {content}
        </Link>
      );
    }
    return (
      <a href={href} {...rest} className={classes}>
        {content}
      </a>
    );
  }
  return (
    <button {...(props as ComponentProps<"button">)} className={classes}>
      {content}
    </button>
  );
}
