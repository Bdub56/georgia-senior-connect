import { Link } from "@tanstack/react-router";
import { Phone, MapPin, ArrowRight, AlertTriangle } from "lucide-react";
import StarRating from "@/components/StarRating";
import { CategoryIcon } from "@/components/categoryIcons";

const COST_STYLES = {
  Free: "bg-[#e7f4ec] text-[#14603a] border-[#bfe3cd]",
  "Sliding scale": "bg-[#fde8db] text-[#9a3412] border-[#f7cbb0]",
  "Income-based": "bg-[#fde8db] text-[#9a3412] border-[#f7cbb0]",
  Medicaid: "bg-[#e7edf8] text-[#1e3a5f] border-[#c7d5ea]",
  Varies: "bg-muted text-foreground border-border",
};

export default function ServiceCard({ service, showPhone = true }) {
  const counties = service.counties || [];
  const countyLabel = counties.includes("Statewide")
    ? "Statewide"
    : counties.slice(0, 2).join(", ") + (counties.length > 2 ? ` +${counties.length - 2}` : "");

  return (
    <article className="card-quiet group flex h-full flex-col p-5 transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-[0_2px_4px_rgba(16,42,46,0.05),0_22px_40px_-28px_rgba(16,42,46,0.45)]">
      <div className="flex items-start gap-3">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-secondary text-primary">
          <CategoryIcon category={service.category} />
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-[0.72rem] font-bold uppercase tracking-[0.14em] text-muted-foreground">
            {service.category}
          </p>
          <h3 className="mt-0.5 text-lg font-semibold leading-snug text-foreground">
            <Link
              to="/services/$serviceId"
              params={{ serviceId: service.id }}
              className="decoration-primary/40 decoration-2 underline-offset-4 hover:underline"
            >
              {service.name}
            </Link>
          </h3>
        </div>
      </div>

      <p className="mt-3 line-clamp-3 text-[0.95rem] leading-relaxed text-muted-foreground">
        {service.description}
      </p>

      <div className="mt-4 flex flex-wrap items-center gap-2">
        <span
          className={`rounded-full border px-2.5 py-1 text-[0.72rem] font-bold uppercase tracking-wide ${
            COST_STYLES[service.cost_type] || COST_STYLES.Varies
          }`}
        >
          {service.cost_type || "Varies"}
        </span>
        {service.waitlist ? (
          <span className="inline-flex items-center gap-1 rounded-full border border-[#f7cbb0] bg-[#fde8db] px-2.5 py-1 text-[0.72rem] font-bold uppercase tracking-wide text-[#9a3412]">
            <AlertTriangle className="h-3.5 w-3.5" aria-hidden="true" /> Waitlist
          </span>
        ) : null}
        <span className="inline-flex items-center gap-1 text-[0.8rem] font-semibold text-muted-foreground">
          <MapPin className="h-3.5 w-3.5" aria-hidden="true" /> {countyLabel}
        </span>
      </div>

      {service.editor_rating > 0 ? (
        <div className="mt-4 flex items-center gap-2">
          <StarRating value={service.editor_rating} size="sm" />
          <span className="text-[0.8rem] font-semibold text-muted-foreground">
            {Number(service.editor_rating).toFixed(1)} editor rating
          </span>
        </div>
      ) : null}

      <div className="mt-5 flex flex-wrap items-center gap-2 border-t border-border/70 pt-4">
        {showPhone && service.phone ? (
          <a
            href={`tel:${String(service.phone).replace(/[^0-9+]/g, "")}`}
            className="tap inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-bold text-primary-foreground transition-colors hover:bg-primary/90"
          >
            <Phone className="h-4 w-4" aria-hidden="true" /> {service.phone}
          </a>
        ) : null}
        <Link
          to="/services/$serviceId"
          params={{ serviceId: service.id }}
          className="tap inline-flex items-center gap-1.5 rounded-xl px-3 py-2.5 text-sm font-bold text-primary hover:bg-secondary"
        >
          Details <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </Link>
      </div>
    </article>
  );
}