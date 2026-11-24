import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { Search } from "lucide-react";

export default function HeroSearch({ initialValue = "" }) {
  const navigate = useNavigate();
  const [q, setQ] = useState(initialValue);

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        navigate({ to: "/services", search: { q: q.trim() || undefined } });
      }}
      className="flex flex-col gap-2.5 sm:flex-row"
      role="search"
    >
      <div className="relative flex-1">
        <Search
          className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground"
          aria-hidden="true"
        />
        <label htmlFor="hero-search" className="sr-only">
          Search by county, ZIP code, or service name
        </label>
        <input
          id="hero-search"
          type="search"
          value={q}
          onChange={(event) => setQ(event.target.value)}
          placeholder="County, ZIP code, or service name"
          className="h-14 w-full rounded-xl border-2 border-border bg-card pl-12 pr-4 text-base font-semibold text-foreground placeholder:font-normal placeholder:text-muted-foreground/80 focus:border-primary focus:outline-none"
        />
      </div>
      <button
        type="submit"
        className="btn-accent tap h-14 rounded-xl px-7 text-base font-bold"
      >
        Search
      </button>
    </form>
  );
}