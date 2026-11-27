import { useState } from "react";
import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import {
  ArrowLeft,
  Phone,
  Globe,
  MapPin,
  CheckCircle2,
  AlertTriangle,
  ShieldCheck,
  Clock,
  LogIn,
  ExternalLink,
} from "lucide-react";
import StarRating from "@/components/StarRating";
import ReviewList from "@/components/ReviewList";
import ReviewForm from "@/components/ReviewForm";
import { getServiceDetail } from "@/lib/server-fns";
import { useAuth } from "@/lib/AuthContext";

export const Route = createFileRoute("/_site/services/$serviceId")({
  loader: async ({ params }) => {
    const data = await getServiceDetail({ data: { id: params.serviceId } });
    if (!data) throw notFound();
    return data;
  },
  head: ({ loaderData }) => ({
    meta: [
      { title: `${loaderData?.service?.name || "Service"} — Georgia Senior Link` },
      { name: "description", content: (loaderData?.service?.description || "").slice(0, 160) },
    ],
  }),
  component: ServiceDetailPage,
});

const COST_TONE = {
  Free: "bg-[#e7f4ec] text-[#14603a] border-[#bfe3cd]",
  "Sliding scale": "bg-[#fde8db] text-[#9a3412] border-[#f7cbb0]",
  "Income-based": "bg-[#fde8db] text-[#9a3412] border-[#f7cbb0]",
  Medicaid: "bg-[#e7edf8] text-[#1e3a5f] border-[#c7d5ea]",
  Varies: "bg-muted text-foreground border-border",
};

function ServiceDetailPage() {
  const { service, reviews, reviewCount, average } = Route.useLoaderData();
  const { user, isLoadingAuth, navigateToLogin } = useAuth();
  const [editing, setEditing] = useState(false);

  const myReview = user ? reviews.find((review) => review.created_by_id === user.id) : null;
  const counties = service.counties || [];
  const tel = String(service.phone || "").replace(/[^0-9+]/g, "");

  return (
    <div className="wrap py-8">
      <Link to="/services" className="inline-flex items-center gap-1.5 text-sm font-bold text-primary hover:underline">
        <ArrowLeft className="h-4 w-4" aria-hidden="true" /> Back to the directory
      </Link>

      <div className="mt-5 grid gap-6 lg:grid-cols-[1.6fr_1fr] lg:items-start">
        <article className="card-quiet p-6 sm:p-8">
          <p className="eyebrow">{service.category}</p>
          <h1 className="mt-2 font-display text-[1.9rem] font-semibold leading-tight tracking-tight text-foreground sm:text-4xl">
            {service.name}
          </h1>

          <div className="mt-4 flex flex-wrap items-center gap-2.5">
            {service.editor_rating > 0 ? (
              <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/25 bg-secondary px-3 py-1 text-[0.78rem] font-bold text-primary">
                <ShieldCheck className="h-3.5 w-3.5" aria-hidden="true" /> Official {Number(service.editor_rating).toFixed(1)}
              </span>
            ) : null}
            <span className="inline-flex items-center gap-2 text-[0.9rem] font-semibold text-muted-foreground">
              <StarRating value={average} size="sm" />
              {reviewCount ? `${average.toFixed(1)} from ${reviewCount} ${reviewCount === 1 ? "review" : "reviews"}` : "No community reviews yet"}
            </span>
            <span
              className={`rounded-full border px-3 py-1 text-[0.75rem] font-bold uppercase tracking-wide ${
                COST_TONE[service.cost_type] || COST_TONE.Varies
              }`}
            >
              {service.cost_type || "Varies"}
            </span>
            {service.waitlist ? (
              <span className="inline-flex items-center gap-1.5 rounded-full border border-[#f7cbb0] bg-[#fde8db] px-3 py-1 text-[0.75rem] font-bold uppercase tracking-wide text-[#9a3412]">
                <AlertTriangle className="h-3.5 w-3.5" aria-hidden="true" /> Waitlist
              </span>
            ) : null}
          </div>

          <p className="mt-6 text-[1.02rem] leading-relaxed text-foreground/85">{service.description}</p>

          {service.waitlist && service.waitlist_note ? (
            <div className="mt-6 flex gap-3 rounded-xl border border-[#f7cbb0] bg-[#fdf1e9] p-4">
              <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-[#9a3412]" aria-hidden="true" />
              <p className="text-[0.92rem] leading-relaxed text-[#7c2d12]">{service.waitlist_note}</p>
            </div>
          ) : null}

          <dl className="mt-8 space-y-5 border-t border-border/70 pt-6">
            {service.eligibility ? (
              <div>
                <dt className="text-[0.78rem] font-bold uppercase tracking-[0.14em] text-muted-foreground">Who qualifies</dt>
                <dd className="mt-1 text-[1rem] leading-relaxed text-foreground">{service.eligibility}</dd>
              </div>
            ) : null}
            <div>
              <dt className="text-[0.78rem] font-bold uppercase tracking-[0.14em] text-muted-foreground">
                Counties served
              </dt>
              <dd className="mt-1.5 flex flex-wrap gap-1.5">
                {counties.length ? (
                  counties.map((county) => (
                    <span
                      key={county}
                      className="rounded-md bg-secondary px-2 py-1 text-[0.85rem] font-semibold text-foreground/80"
                    >
                      {county}
                    </span>
                  ))
                ) : (
                  <span className="text-[1rem] text-foreground">Ask the provider</span>
                )}
              </dd>
            </div>
            {service.region ? (
              <div>
                <dt className="text-[0.78rem] font-bold uppercase tracking-[0.14em] text-muted-foreground">Region</dt>
                <dd className="mt-1 text-[1rem] leading-relaxed text-foreground">{service.region}</dd>
              </div>
            ) : null}
            {service.address ? (
              <div>
                <dt className="text-[0.78rem] font-bold uppercase tracking-[0.14em] text-muted-foreground">Address</dt>
                <dd className="mt-1 flex items-start gap-2 text-[1rem] leading-relaxed text-foreground">
                  <MapPin className="mt-1 h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
                  <a
                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(service.address)}`}
                    target="_blank"
                    rel="noreferrer"
                    className="underline-offset-4 hover:underline"
                  >
                    {service.address}
                  </a>
                </dd>
              </div>
            ) : null}
            {service.hours ? (
              <div>
                <dt className="text-[0.78rem] font-bold uppercase tracking-[0.14em] text-muted-foreground">Hours</dt>
                <dd className="mt-1 flex items-start gap-2 text-[1rem] leading-relaxed text-foreground">
                  <Clock className="mt-1 h-4 w-4 shrink-0 text-primary" aria-hidden="true" /> {service.hours}
                </dd>
              </div>
            ) : null}
            {service.notes ? (
              <div>
                <dt className="text-[0.78rem] font-bold uppercase tracking-[0.14em] text-muted-foreground">Good to know</dt>
                <dd className="mt-1 text-[1rem] leading-relaxed text-foreground">{service.notes}</dd>
              </div>
            ) : null}
          </dl>

          {service.google_reviews_summary ? (
            <div className="mt-6 rounded-xl border border-border/80 bg-secondary/40 p-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="text-[0.78rem] font-bold uppercase tracking-[0.14em] text-muted-foreground">
                  Google reviews
                </p>
                {service.google_rating > 0 ? (
                  <span className="inline-flex items-center gap-2 text-[0.9rem] font-bold text-foreground">
                    <StarRating value={service.google_rating} size="sm" />
                    {Number(service.google_rating).toFixed(1)}
                    {service.google_review_count ? (
                      <span className="font-semibold text-muted-foreground">
                        ({service.google_review_count})
                      </span>
                    ) : null}
                  </span>
                ) : null}
              </div>
              {service.google_listing_name ? (
                <p className="mt-1.5 text-[0.85rem] font-semibold text-foreground/80">
                  Google listing: {service.google_listing_name}
                </p>
              ) : null}
              <p className="mt-2 text-[0.95rem] leading-relaxed text-foreground/85">
                {service.google_reviews_summary}
              </p>
              <a
                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                  service.google_listing_name || service.name,
                )}`}
                target="_blank"
                rel="noreferrer"
                className="mt-3 inline-flex items-center gap-1.5 text-sm font-bold text-primary underline-offset-4 hover:underline"
              >
                See it on Google Maps <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
              </a>
            </div>
          ) : null}
        </article>

        <aside className="space-y-5 lg:sticky lg:top-24">
          <div className="card-quiet p-6">
            <h2 className="font-display text-lg font-semibold text-foreground">Get in touch</h2>
            <div className="mt-4 space-y-2.5">
              {tel ? (
                <a
                  href={`tel:${tel}`}
                  className="btn-accent tap flex items-center justify-center gap-2 rounded-xl px-4 py-3.5 text-base font-bold"
                >
                  <Phone className="h-5 w-5" aria-hidden="true" /> {service.phone}
                </a>
              ) : null}
              {service.phone_alt ? (
                <a
                  href={`tel:${String(service.phone_alt).replace(/[^0-9+]/g, "")}`}
                  className="tap flex items-center justify-center gap-2 rounded-xl border border-border bg-card px-4 py-3 text-[0.95rem] font-bold text-foreground hover:bg-secondary"
                >
                  <Phone className="h-4 w-4" aria-hidden="true" /> {service.phone_alt}
                </a>
              ) : null}
              {service.website ? (
                <a
                  href={service.website}
                  target="_blank"
                  rel="noreferrer"
                  className="tap flex items-center justify-center gap-2 rounded-xl border border-primary/25 bg-card px-4 py-3.5 text-base font-bold text-primary hover:bg-secondary"
                >
                  <Globe className="h-5 w-5" aria-hidden="true" /> Visit website
                </a>
              ) : null}
            </div>
            <div className="mt-5 rounded-xl bg-secondary/60 p-4">
              <p className="flex items-center gap-2 text-sm font-bold text-foreground">
                <CheckCircle2 className="h-4 w-4 text-primary" aria-hidden="true" /> What to have ready
              </p>
              <p className="mt-1.5 text-[0.88rem] leading-relaxed text-muted-foreground">
                Photo ID, Social Security award letter, proof of Georgia residency, and recent income or
                bank statements speed up every application.
              </p>
            </div>
          </div>
        </aside>
      </div>

      <section className="mt-10">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 className="font-display text-[1.6rem] font-semibold tracking-tight text-foreground">
              What people say
            </h2>
            <p className="mt-1 text-[0.92rem] text-muted-foreground">
              {reviewCount
                ? `${average.toFixed(1)} average from ${reviewCount} ${reviewCount === 1 ? "review" : "reviews"}`
                : "Be the first to review this service."}
            </p>
          </div>
          {reviewCount ? <StarRating value={average} /> : null}
        </div>

        <div className="mt-5">
          <ReviewList reviews={reviews} currentUserId={user?.id} onEdit={() => setEditing(true)} />
        </div>

        <div className="mt-6 rounded-2xl border border-border/80 bg-secondary/30 p-5 sm:p-6">
          {isLoadingAuth ? (
            <p className="text-sm text-muted-foreground">Checking your account…</p>
          ) : !user ? (
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <p className="font-display text-lg font-semibold text-foreground">Used this program?</p>
                <p className="mt-1 max-w-md text-[0.92rem] leading-relaxed text-muted-foreground">
                  Sign in to leave a star rating and a short note so the next family knows what to expect.
                </p>
              </div>
              <button
                type="button"
                onClick={() => navigateToLogin()}
                className="btn-accent tap inline-flex items-center gap-2 rounded-xl px-5 py-3 text-[0.95rem] font-bold"
              >
                <LogIn className="h-4 w-4" aria-hidden="true" /> Sign in to review
              </button>
            </div>
          ) : myReview && !editing ? (
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <p className="font-display text-lg font-semibold text-foreground">Thanks for reviewing</p>
                <p className="mt-1 text-[0.92rem] text-muted-foreground">
                  You rated this {myReview.stars} of 5. You can change or remove it any time.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setEditing(true)}
                className="tap inline-flex items-center gap-2 rounded-xl border border-primary/25 bg-card px-5 py-3 text-[0.95rem] font-bold text-primary hover:bg-secondary"
              >
                Edit my review
              </button>
            </div>
          ) : (
            <ReviewForm serviceId={service.id} existing={myReview} onDone={() => setEditing(false)} />
          )}
        </div>
      </section>
    </div>
  );
}