import { createFileRoute } from "@tanstack/react-router";
import { LogIn } from "lucide-react";
import SuggestServiceForm from "@/components/SuggestServiceForm";
import { useAuth } from "@/lib/AuthContext";

export const Route = createFileRoute("/_site/suggest-service")({
  head: () => ({
    meta: [
      { title: "Suggest a service — Georgia Senior Link" },
      {
        name: "description",
        content:
          "Know a Georgia program that helps older adults? Suggest it for the directory and the curator team will review it.",
      },
    ],
  }),
  component: SuggestServicePage,
});

function SuggestServicePage() {
  const { user, isLoadingAuth, navigateToLogin } = useAuth();

  return (
    <div className="wrap max-w-2xl py-10">
      <p className="eyebrow">Help the directory grow</p>
      <h1 className="mt-2 font-display text-[2rem] font-semibold tracking-tight text-foreground sm:text-4xl">
        Suggest a service
      </h1>
      <p className="mt-3 text-[1rem] leading-relaxed text-muted-foreground">
        If you know a Georgia program that helps older adults and their families, send it in. The
        curator team checks the details before it appears in the directory.
      </p>

      <div className="mt-6">
        {isLoadingAuth ? (
          <p className="text-sm text-muted-foreground">Checking your account…</p>
        ) : !user ? (
          <div className="card-quiet p-6 text-center sm:p-8">
            <h2 className="font-display text-xl font-semibold text-foreground">Sign in to suggest a service</h2>
            <p className="mx-auto mt-2 max-w-md text-[0.95rem] leading-relaxed text-muted-foreground">
              Suggestions are tied to an account so the curators can follow up if they need more detail.
            </p>
            <button
              type="button"
              onClick={() => navigateToLogin()}
              className="btn-accent tap mt-5 inline-flex items-center gap-2 rounded-xl px-5 py-3 text-[0.95rem] font-bold"
            >
              <LogIn className="h-4 w-4" aria-hidden="true" /> Sign in
            </button>
          </div>
        ) : (
          <SuggestServiceForm />
        )}
      </div>
    </div>
  );
}