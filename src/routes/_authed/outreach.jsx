import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, ShieldCheck } from "lucide-react";
import { listOutreachEmails } from "@/lib/server-fns";
import OutreachComposer from "@/components/outreach/OutreachComposer";
import OutreachHistory from "@/components/outreach/OutreachHistory";

export const Route = createFileRoute("/_authed/outreach")({
  ssr: false,
  loader: () => listOutreachEmails(),
  head: () => ({
    meta: [
      { title: "Email prospects — Georgia Senior Link" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: OutreachPage,
});

function OutreachPage() {
  const { user } = Route.useRouteContext();
  const emails = Route.useLoaderData();

  if (user?.role !== "admin") {
    return (
      <div className="wrap max-w-xl py-16">
        <div className="card-quiet p-8 text-center">
          <ShieldCheck className="mx-auto h-8 w-8 text-primary" aria-hidden="true" />
          <h1 className="mt-3 font-display text-2xl font-semibold text-foreground">Curators only</h1>
          <p className="mt-2 text-[0.95rem] leading-relaxed text-muted-foreground">
            Outreach email is limited to the curator team. Ask an administrator for access.
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
      <Link
        to="/admin"
        className="inline-flex items-center gap-1.5 text-[0.85rem] font-bold text-primary hover:underline"
      >
        <ArrowLeft className="h-4 w-4" aria-hidden="true" /> Curator console
      </Link>

      <p className="eyebrow mt-4">Outreach</p>
      <h1 className="mt-2 font-display text-[2rem] font-semibold tracking-tight text-foreground sm:text-4xl">
        Tell people about the directory
      </h1>
      <p className="mt-2 max-w-2xl text-[0.95rem] leading-relaxed text-muted-foreground">
        Write to a caregiver group, clinic, church, or county office and invite them to use and share
        Georgia Senior Link.
      </p>

      <div className="mt-7 grid gap-6 lg:grid-cols-[1.5fr_1fr] lg:items-start">
        <OutreachComposer />
        <OutreachHistory emails={emails} />
      </div>
    </div>
  );
}