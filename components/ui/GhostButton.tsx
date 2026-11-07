import Link from "next/link";
import { ArrowRightIcon } from "@phosphor-icons/react/dist/ssr";
import { cn } from "@/lib/cn";

// Botón secundario con borde: la flecha avanza un poco al pasar el mouse.
export default function GhostButton({
  href,
  label,
  className,
}: {
  href: string;
  label: string;
  className?: string;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "group inline-flex h-12 shrink-0 items-center gap-2 rounded-full border border-line-strong px-5 text-[15px] font-medium whitespace-nowrap text-text",
        "transition-[background-color,border-color,transform] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] active:scale-[0.97]",
        "hover:border-text/40 hover:bg-surface",
        className,
      )}
    >
      {label}
      <ArrowRightIcon
        weight="bold"
        aria-hidden
        className="size-4 transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-x-0.5"
      />
    </Link>
  );
}
