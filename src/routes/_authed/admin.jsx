import { useMemo, useState } from "react";
import { createFileRoute, Link, useRouter } from "@tanstack/react-router";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { Plus, Pencil, Trash2, Search, ShieldCheck, Loader2, Star, MessageSquare } from "lucide-react";
import { toast } from "sonner";
import StarRating from "@/components/StarRating";
import ServiceForm from "@/components/admin/ServiceForm";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { deleteService, listReviews, listServices } from "@/lib/server-fns";

export const Route = createFileRoute("/_authed/admin")({
  ssr: false,
  loader: async () => {
    const [services, reviews] = await Promise.all([
      listServices({ data: {} }),
      listReviews({ data: { limit: 30 } }),
    ]);
    return { services, reviews };
  },
  head: () => ({ meta: [{ title: "Curator console — Georgia Senior Link" }] }),
  component: AdminPage,
});

const formatDate = (value) => {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric", timeZone: "UTC" });
};

function AdminPage() {
  const { user } = Route.useRouteContext();
  const { services, reviews } = Route.useLoaderData();
  const router = useRouter();
  const queryClient = useQueryClient();
  const remove = useServerFn(deleteService);

  const [term, setTerm] = useState("");
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [pendingDelete, setPendingDelete] = useState(null);

  const deleteMutation = useMutation({
    mutationFn: (id) => remove({ data: { id } }),
    onSuccess: async () => {
      toast.success("Service removed");
      setPendingDelete(null);
      await queryClient.invalidateQueries();
      await router.invalidate();
    },
    onError: (error) => toast.error(error?.message || "That service could not be removed."),
  });

  const stats = useMemo(() => {
    const rated = services.filter((service) => service.editor_rating > 0);
    const editorAverage = rated.length
      ? rated.reduce((total, service) => total + Number(service.editor_rating), 0) / rated.length
      : 0;
    const communityAverage = reviews.length
      ? reviews.reduce((total, review) => total + Number(review.stars || 0), 0) / reviews.length
      : 0;
    return {
      services: services.length,
      reviews: reviews.length,
      editorAverage,
      communityAverage,
      waitlist: services.filter((service) => service.waitlist).length,
    };
  }, [services, reviews]);

  const filtered = useMemo(() => {
    const needle = term.trim().toLowerCase();
    if (!needle) return services;
    return services.filter((service) =>
      [service.name, service.category, ...(service.counties || [])]
        .filter(Boolean)
        .join(" ")
        .toLowerCase()
        .includes(needle),
    );
  }, [services, term]);

  if (user?.role !== "admin") {
    return (
      <div className="wrap max-w-xl py-16">
        <div className="card-quiet p-8 text-center">
          <ShieldCheck className="mx-auto h-8 w-8 text-primary" aria-hidden="true" />
          <h1 className="mt-3 font-display text-2xl font-semibold text-foreground">Curators only</h1>
          <p className="mt-2 text-[0.95rem] leading-relaxed text-muted-foreground">
            This console is for the agency team that maintains the directory. Ask an administrator to
            upgrade your account if you need editing access.
          </p>
          <Link
            to="/"
            className="tap mt-5 inline-flex items-center rounded-xl bg-primary px-5 py-3 text-sm font-bold text-primary-foreground hover:bg-primary/90"
          >
            Back to the directory
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="wrap py-10">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="eyebrow">Curator console</p>
          <h1 className="mt-2 font-display text-[2rem] font-semibold tracking-tight text-foreground sm:text-4xl">
            Maintain the directory
          </h1>
          <p className="mt-2 max-w-2xl text-[0.95rem] leading-relaxed text-muted-foreground">
            Add programs, update contact details, set the official editor rating, and read what the
            community is saying.
          </p>
        </div>
        <button
          type="button"
          onClick={() => {
            setEditing(null);
            setFormOpen(true);
          }}
          className="btn-accent tap inline-flex items-center gap-2 rounded-xl px-5 py-3 text-[0.95rem] font-bold"
        >
          <Plus className="h-4 w-4" aria-hidden="true" /> Add a service
        </button>
      </div>

      <dl className="mt-7 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: "Services listed", value: stats.services, icon: ShieldCheck },
          { label: "Community reviews", value: stats.reviews, icon: MessageSquare },
          { label: "Average community rating", value: stats.communityAverage ? stats.communityAverage.toFixed(1) : "—", icon: Star },
          { label: "On a waitlist", value: stats.waitlist, icon: Loader2 },
        ].map((item) => (
          <div key={item.label} className="card-quiet p-4">
            <dt className="flex items-center gap-1.5 text-[0.72rem] font-bold uppercase tracking-[0.12em] text-muted-foreground">
              <item.icon className="h-3.5 w-3.5" aria-hidden="true" /> {item.label}
            </dt>
            <dd className="mt-1.5 font-display text-2xl font-semibold text-foreground">{item.value}</dd>
          </div>
        ))}
      </dl>

      <div className="mt-8 grid gap-6 lg:grid-cols-[1.55fr_1fr] lg:items-start">
        <section className="card-quiet overflow-hidden">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border/70 p-4">
            <h2 className="font-display text-lg font-semibold text-foreground">Services</h2>
            <div className="relative">
              <Search
                className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
                aria-hidden="true"
              />
              <label htmlFor="admin-search" className="sr-only">
                Filter services
              </label>
              <input
                id="admin-search"
                value={term}
                onChange={(event) => setTerm(event.target.value)}
                placeholder="Filter by name, county"
                className="h-10 w-56 rounded-lg border-2 border-border bg-card pl-9 pr-3 text-sm focus:border-primary focus:outline-none"
              />
            </div>
          </div>

          <ul className="divide-y divide-border/70">
            {filtered.map((service) => (
              <li key={service.id} className="flex flex-wrap items-start justify-between gap-3 p-4">
                <div className="min-w-0 flex-1">
                  <Link
                    to="/services/$serviceId"
                    params={{ serviceId: service.id }}
                    className="text-[0.98rem] font-bold text-foreground underline-offset-4 hover:underline"
                  >
                    {service.name}
                  </Link>
                  <p className="mt-0.5 text-[0.8rem] font-semibold text-muted-foreground">
                    {service.category} ·{" "}
                    {(service.counties || []).includes("Statewide")
                      ? "Statewide"
                      : (service.counties || []).slice(0, 2).join(", ") || "No counties"}
                    {service.waitlist ? " · Waitlist" : ""}
                  </p>
                </div>
                <div className="flex items-center gap-1.5">
                  <StarRating value={service.editor_rating || 0} size="sm" />
                  <button
                    type="button"
                    onClick={() => {
                      setEditing(service);
                      setFormOpen(true);
                    }}
                    className="tap rounded-lg p-2 text-primary hover:bg-secondary"
                    aria-label={`Edit ${service.name}`}
                  >
                    <Pencil className="h-4 w-4" aria-hidden="true" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setPendingDelete(service)}
                    className="tap rounded-lg p-2 text-destructive hover:bg-destructive/10"
                    aria-label={`Delete ${service.name}`}
                  >
                    <Trash2 className="h-4 w-4" aria-hidden="true" />
                  </button>
                </div>
              </li>
            ))}
            {filtered.length === 0 ? (
              <li className="p-6 text-center text-[0.95rem] text-muted-foreground">No services match that filter.</li>
            ) : null}
          </ul>
        </section>

        <section className="card-quiet p-4">
          <h2 className="font-display text-lg font-semibold text-foreground">Recent reviews</h2>
          <ul className="mt-3 space-y-3">
            {reviews.slice(0, 12).map((review) => (
              <li key={review.id} className="rounded-xl border border-border/70 p-3">
                <div className="flex items-center justify-between gap-2">
                  <p className="text-[0.9rem] font-bold text-foreground">
                    {review.author_name || "Community member"}
                  </p>
                  <StarRating value={review.stars} size="sm" />
                </div>
                <p className="mt-0.5 text-[0.78rem] font-semibold uppercase tracking-wide text-muted-foreground">
                  {review.service_name} · {formatDate(review.created_date)}
                </p>
                {review.body ? (
                  <p className="mt-1.5 line-clamp-3 text-[0.88rem] leading-relaxed text-foreground/80">{review.body}</p>
                ) : null}
              </li>
            ))}
            {reviews.length === 0 ? (
              <li className="text-[0.9rem] text-muted-foreground">No community reviews yet.</li>
            ) : null}
          </ul>
        </section>
      </div>

      {formOpen ? (
        <ServiceForm
          key={editing?.id || "new"}
          open={formOpen}
          onOpenChange={(open) => {
            setFormOpen(open);
            if (!open) setEditing(null);
          }}
          service={editing}
        />
      ) : null}

      <AlertDialog open={!!pendingDelete} onOpenChange={(open) => (!open ? setPendingDelete(null) : null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this service?</AlertDialogTitle>
            <AlertDialogDescription>
              {pendingDelete?.name} will be removed from the public directory. Reviews already left for
              it stay on record but the listing will stop showing.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Keep it</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => pendingDelete && deleteMutation.mutate(pendingDelete.id)}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete service
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}