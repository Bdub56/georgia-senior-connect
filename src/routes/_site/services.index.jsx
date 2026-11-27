import { useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Plus, Search, SlidersHorizontal, Loader2, Lightbulb } from "lucide-react";
import ServiceCard from "@/components/ServiceCard";
import { useAuth } from "@/lib/AuthContext";
import { CATEGORIES, zipToCounties } from "@/lib/georgia-data";
import { listServices } from "@/lib/server-fns";

export const Route = createFileRoute("/_site/services/")({
  validateSearch: (search) => ({
    q: typeof search.q === "string" ? search.q : undefined,
    category: typeof search.category === "string" ? search.category : undefined,
    county: typeof search.county === "string" ? search.county : undefined,
  }),
  loaderDeps: ({ search }) => ({
    q: search.q || undefined,
    category: search.category || undefined,
    county: search.county || undefined,
  }),
  loader: async ({ deps }) => ({ services: await listServices({ data: deps }) }),
  head: () => ({
    meta: [
      { title: "Find services — Georgia Senior Link" },
      {
        name: "description",
        content:
          "Browse Georgia elder-care programs by category, county, or keyword. Cost, eligibility, waitlists, and phone numbers for every listing.",
      },
    ],
  }),
  component: ServicesPage,
});

function ServicesPage() {
  const { q, category, county } = Route.useSearch();
  const { services } = Route.useLoaderData();
  const { user } = useAuth();
  const navigate = useNavigate({ from: "/services" });
  const [term, setTerm] = useState(q || "");

  const activeFilter = [q, category, county].filter(Boolean).length;
  const zipCounties = /^\d{5}$/.test(q || "") ? zipToCounties(q) : [];

  return (
    <div className="wrap py-10">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div className="max-w-2xl">
          <p className="eyebrow">Directory</p>
          <h1 className="mt-2 font-display text-[2rem] font-semibold tracking-tight text-foreground sm:text-4xl">
            Find services in Georgia
          </h1>
          <p className="mt-3 text-[1rem] leading-relaxed text-muted-foreground">
            Search by county, ZIP code, or service name, or narrow it down by category.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Link
            to="/suggest-service"
            className="tap inline-flex items-center gap-2 rounded-xl border border-primary/25 bg-card px-4 py-3 text-[0.9rem] font-bold text-primary hover:bg-secondary"
          >
            <Lightbulb className="h-4 w-4" aria-hidden="true" /> Suggest a service
          </Link>
          {user?.role === "admin" ? (
            <Link
              to="/admin"
              className="btn-accent tap inline-flex items-center gap-2 rounded-xl px-5 py-3 text-[0.95rem] font-bold"
            >
              <Plus className="h-4 w-4" aria-hidden="true" /> Add a service
            </Link>
          ) : null}
        </div>
      </div>

      <form
        className="mt-7 flex flex-col gap-2.5 sm:flex-row"
        onSubmit={(event) => {
          event.preventDefault();
          navigate({ search: { q: term.trim() || undefined, category, county } });
        }}
        role="search"
      >
        <div className="relative flex-1">
          <Search
            className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground"
            aria-hidden="true"
          />
          <label htmlFor="directory-search" className="sr-only">
            Search services
          </label>
          <input
            id="directory-search"
            type="search"
            value={term}
            onChange={(event) => setTerm(event.target.value)}
            placeholder="County, ZIP code, or service name"
            className="h-14 w-full rounded-xl border-2 border-border bg-card pl-12 pr-4 text-base font-semibold placeholder:font-normal placeholder:text-muted-foreground/80 focus:border-primary focus:outline-none"
          />
        </div>
        <button type="submit" className="btn-accent tap h-14 rounded-xl px-7 text-base font-bold">
          Search
        </button>
      </form>

      <div className="mt-5 flex items-center gap-2 overflow-x-auto pb-1">
        <span className="inline-flex shrink-0 items-center gap-1.5 pr-1 text-[0.8rem] font-bold uppercase tracking-wide text-muted-foreground">
          <SlidersHorizontal className="h-4 w-4" aria-hidden="true" /> Filter
        </span>
        <button
          type="button"
          onClick={() => navigate({ search: { q, county } })}
          className={`tap shrink-0 rounded-full border px-3.5 py-2 text-sm font-semibold transition-colors ${
            !category
              ? "border-primary bg-primary text-primary-foreground"
              : "border-border bg-card text-foreground/80 hover:bg-secondary"
          }`}
        >
          All
        </button>
        {CATEGORIES.map((name) => (
          <button
            key={name}
            type="button"
            onClick={() => navigate({ search: { q, county, category: name } })}
            className={`tap shrink-0 rounded-full border px-3.5 py-2 text-sm font-semibold transition-colors ${
              category === name
                ? "border-primary bg-primary text-primary-foreground"
                : "border-border bg-card text-foreground/80 hover:bg-secondary"
            }`}
          >
            {name}
          </button>
        ))}
      </div>

      <div className="mt-8 flex flex-wrap items-baseline justify-between gap-2 border-b border-border/70 pb-3">
        <div>
          <p className="text-[0.95rem] font-semibold text-foreground">
            {services.length} {services.length === 1 ? "service" : "services"}
            {county ? ` serving ${county} County` : ""}
          </p>
          {zipCounties.length ? (
            <p className="mt-1 text-[0.85rem] text-muted-foreground">
              ZIP {q} is in or near {zipCounties.slice(0, 3).join(", ")} County.
            </p>
          ) : null}
        </div>
        {activeFilter > 0 ? (
          <button
            type="button"
            onClick={() => {
              setTerm("");
              navigate({ search: {} });
            }}
            className="text-sm font-bold text-primary underline-offset-4 hover:underline"
          >
            Clear all filters
          </button>
        ) : null}
      </div>

      {services.length === 0 ? (
        <div className="mt-10 rounded-2xl border border-dashed border-border bg-card p-10 text-center">
          <h2 className="font-display text-xl font-semibold text-foreground">No services match yet</h2>
          <p className="mx-auto mt-2 max-w-md text-[0.95rem] text-muted-foreground">
            Try a nearby county, a broader category, or call the ADRC line at 1-866-552-4464 and a
            specialist will search for you.
          </p>
        </div>
      ) : (
        <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {services.map((service) => (
            <ServiceCard key={service.id} service={service} />
          ))}
        </div>
      )}
    </div>
  );
}