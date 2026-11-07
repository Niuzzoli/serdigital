import { RevealGroup, RevealItem } from "@/components/ui/Reveal";
import { site } from "@/content/site";
import { CaseCard, CaseDetail } from "./CaseCard";

export default function CasesList({ variant }: { variant: "compact" | "full" }) {
  if (variant === "full") {
    return (
      <div>
        {site.cases.map((c) => (
          <CaseDetail key={c.slug} item={c} />
        ))}
      </div>
    );
  }
  return (
    <RevealGroup className="grid gap-4 md:grid-cols-2">
      {site.cases.map((c) => (
        <RevealItem key={c.slug}>
          <CaseCard item={c} />
        </RevealItem>
      ))}
    </RevealGroup>
  );
}
