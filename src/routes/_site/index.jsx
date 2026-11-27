import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Phone, ShieldAlert, Sparkles } from "lucide-react";
import HeroSearch from "@/components/HeroSearch";
import CategoryTiles from "@/components/CategoryTiles";
import ServiceCard from "@/components/ServiceCard";
import PiConsultCta from "@/components/PiConsultCta";
import { CATEGORIES } from "@/lib/georgia-data";
import { listServices } from "@/lib/server-fns";

export const Route = createFileRoute("/_site/")({
  head: () => ({
    meta: [
      { title: "Georgia Senior Link — Find elder services in Georgia" },
      {
        name: "description",
        content:
          "Search Georgia elder-care services by county or ZIP: meals, Medicare help, caregiver respite, utility relief, rides, legal aid, and senior centers.",
      },
    ],
  }),
  loader: async () => ({ featured: await listServices({ data: { limit: 3 } }) }),
  component: HomePage,
});

function HomePage() {
  const { featured } = Route.useLoaderData();

  return (
    <>
      <section className="relative overflow-hidden border-b border-border/60">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(80%_60%_at_15%_0%,rgba(30,58,95,0.10),transparent_60%),radial-gradient(60%_50%_at_95%_10%,rgba(194,65,12,0.12),transparent_65%)]"
        />
        <div className="wrap relative grid gap-10 py-14 lg:grid-cols-[1.15fr_0.85fr] lg:items-center lg:py-20">
          <div>
            <p className="eyebrow">Georgia's aging network, in one place</p>
            <h1 className="mt-3 max-w-2xl font-display text-[2.35rem] font-semibold leading-[1.08] tracking-tight text-foreground sm:text-5xl">
              Find the right help for an older Georgian.
            </h1>
            <p className="mt-5 max-w-xl text-[1.05rem] leading-relaxed text-muted-foreground">
              A curated directory of meals, Medicare counseling, caregiver respite, utility relief,
              rides, legal aid, and senior centers across all 159 counties. Free to use, no account
              needed to browse.
            </p>
            <div className="mt-7 max-w-xl">
              <HeroSearch />
            </div>
            <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-[0.85rem] font-semibold text-muted-foreground">
              <span className="inline-flex items-center gap-1.5">
                <Sparkles className="h-4 w-4 text-primary" aria-hidden="true" /> 40+ verified programs
              </span>
              <span>12 regional agencies</span>
              <span>159 counties</span>
            </div>
          </div>

          <div className="card-quiet overflow-hidden">
            <div className="bg-primary px-6 py-5 text-primary-foreground">
              <p className="text-[0.7rem] font-bold uppercase tracking-[0.18em] text-primary-foreground/70">
                Not sure where to start?
              </p>
              <p className="mt-1 font-display text-[1.35rem] font-semibold leading-snug">
                Call the statewide ADRC line
              </p>
              <a
                href="tel:18665524464"
                className="tap mt-3 inline-flex items-center gap-2 rounded-xl bg-primary-foreground px-4 py-3 text-lg font-bold text-primary transition-opacity hover:opacity-90"
              >
                <Phone className="h-5 w-5" aria-hidden="true" /> 1-866-552-4464
              </a>
              <p className="mt-3 text-[0.85rem] leading-relaxed text-primary-foreground/80">
                Monday to Friday, 9:00 a.m. to 5:00 p.m. Press 2 for the Area Agency on Aging that
                covers your county. Screenings are free.
              </p>
            </div>
            <div className="divide-y divide-border/70">
              <a
                href="tel:211"
                className="flex items-center justify-between gap-3 px-6 py-4 transition-colors hover:bg-secondary/60"
              >
                <span>
                  <span className="block text-[0.95rem] font-bold text-foreground">Georgia 2-1-1</span>
                  <span className="block text-[0.82rem] text-muted-foreground">
                    Food pantries, rent aid, local charities
                  </span>
                </span>
                <ArrowRight className="h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
              </a>
              <a
                href="tel:18665524464"
                className="flex items-center justify-between gap-3 px-6 py-4 transition-colors hover:bg-secondary/60"
              >
                <span>
                  <span className="flex items-center gap-1.5 text-[0.95rem] font-bold text-foreground">
                    <ShieldAlert className="h-4 w-4 text-destructive" aria-hidden="true" />
                    Report elder abuse
                  </span>
                  <span className="block text-[0.82rem] text-muted-foreground">
                    Adult Protective Services, 24 hours a day
                  </span>
                </span>
                <ArrowRight className="h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
              </a>
            </div>
          </div>
        </div>
      </section>

      <section className="wrap py-14">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 className="font-display text-[1.75rem] font-semibold tracking-tight text-foreground">
              Browse by what you need
            </h2>
            <p className="mt-1.5 text-[0.95rem] text-muted-foreground">
              Every listing shows cost, counties served, and whether there is a waitlist.
            </p>
          </div>
          <Link
            to="/services"
            className="tap inline-flex items-center gap-1.5 rounded-xl px-3 py-2 text-sm font-bold text-primary hover:bg-secondary"
          >
            See all services <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>
        <div className="mt-6">
          <CategoryTiles categories={CATEGORIES} />
        </div>
      </section>

      <section className="wrap pb-14">
        <div className="rounded-2xl border border-primary/20 bg-secondary/50 p-6 sm:p-8">
          <div className="grid gap-6 md:grid-cols-[1fr_auto] md:items-center">
            <div>
              <p className="eyebrow">Four short questions</p>
              <h2 className="mt-2 font-display text-[1.6rem] font-semibold tracking-tight text-foreground">
                Let the needs match build your shortlist
              </h2>
              <p className="mt-2 max-w-xl text-[0.95rem] leading-relaxed text-muted-foreground">
                Tell us the county, the age, and what kind of help is needed. You get a short list of
                programs with why each one matches, who to call, and what to have ready.
              </p>
            </div>
            <Link
              to="/match"
              className="btn-accent tap inline-flex items-center justify-center gap-2 rounded-xl px-6 py-3.5 text-base font-bold"
            >
              Start the needs match <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </section>

      <section className="wrap pb-16">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 className="font-display text-[1.75rem] font-semibold tracking-tight text-foreground">
              Highest rated programs
            </h2>
            <p className="mt-1.5 text-[0.95rem] text-muted-foreground">
              The programs families reach for first, ranked by the curator team.
            </p>
          </div>
        </div>
        <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {featured.map((service) => (
            <ServiceCard key={service.id} service={service} />
          ))}
        </div>
      </section>

      <PiConsultCta />
    </>
  );
}