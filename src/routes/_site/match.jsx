import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { AlertTriangle, ArrowLeft, ArrowRight, Check, Loader2, RotateCcw } from "lucide-react";
import ServiceCard from "@/components/ServiceCard";
import { COUNTIES, NEEDS } from "@/lib/georgia-data";
import { matchServices } from "@/lib/server-fns";

export const Route = createFileRoute("/_site/match")({
  head: () => ({
    meta: [
      { title: "Guided needs match — Georgia Senior Link" },
      {
        name: "description",
        content:
          "Answer four short questions about county, age, and needs to get a shortlist of Georgia elder-care programs with next steps.",
      },
    ],
  }),
  component: MatchPage,
});

const AGES = ["Under 60", "60 to 64", "65 to 74", "75 or older"];

function MatchPage() {
  const [step, setStep] = useState(1);
  const [county, setCounty] = useState("");
  const [age, setAge] = useState("");
  const [needs, setNeeds] = useState([]);
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const toggleNeed = (id) =>
    setNeeds((current) => (current.includes(id) ? current.filter((n) => n !== id) : [...current, id]));

  const runMatch = async () => {
    setLoading(true);
    setError("");
    try {
      const matched = await matchServices({ data: { county, age, needs } });
      setResults(matched);
    } catch (err) {
      setError(err?.message || "The needs match could not run. Try again in a moment.");
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setResults(null);
    setStep(1);
    setNeeds([]);
    setAge("");
    setCounty("");
  };

  if (results) {
    return (
      <div className="wrap py-10">
        <p className="eyebrow">Your shortlist</p>
        <h1 className="mt-2 font-display text-[2rem] font-semibold tracking-tight text-foreground sm:text-4xl">
          {results.services.length} programs match
        </h1>
        <p className="mt-3 max-w-2xl text-[1rem] leading-relaxed text-muted-foreground">
          Start with the first listing and work down. Each one shows the county coverage, cost, and
          whether there is a waitlist. Have ID, Social Security letters, and income proof ready before
          you call.
        </p>
        <div className="mt-6 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={reset}
            className="tap inline-flex items-center gap-2 rounded-xl border border-primary/25 bg-card px-4 py-2.5 text-sm font-bold text-primary hover:bg-secondary"
          >
            <RotateCcw className="h-4 w-4" aria-hidden="true" /> Start over
          </button>
          <Link
            to="/aaa"
            className="tap inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-bold text-primary-foreground hover:bg-primary/90"
          >
            Find your Area Agency on Aging <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>
        <div className="mt-6 space-y-2">
          {results.tips.map((tip) => (
            <p
              key={tip}
              className="flex gap-2.5 rounded-xl border border-[#f7cbb0] bg-[#fdf1e9] p-3.5 text-[0.92rem] leading-relaxed text-[#7c2d12]"
            >
              <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" /> {tip}
            </p>
          ))}
        </div>
        {results.services.length === 0 ? (
          <div className="mt-6 rounded-2xl border border-dashed border-border bg-card p-8 text-center">
            <h2 className="font-display text-lg font-semibold text-foreground">Nothing matched those answers</h2>
            <p className="mx-auto mt-2 max-w-md text-[0.95rem] text-muted-foreground">
              Call the ADRC line at 1-866-552-4464 and a specialist will search the full network with you.
            </p>
          </div>
        ) : (
          <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {results.services.map((service) => (
              <ServiceCard key={service.id} service={service} />
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="wrap max-w-3xl py-10">
      <p className="eyebrow">Guided needs match</p>
      <h1 className="mt-2 font-display text-[2rem] font-semibold tracking-tight text-foreground sm:text-4xl">
        Let's narrow it down
      </h1>
      <p className="mt-3 text-[1rem] leading-relaxed text-muted-foreground">
        Three quick questions. No account needed, and nothing is saved.
      </p>

      <div className="mt-7 flex items-center gap-2" aria-hidden="true">
        {[1, 2, 3].map((n) => (
          <span
            key={n}
            className={`h-1.5 flex-1 rounded-full transition-colors ${n <= step ? "bg-primary" : "bg-border"}`}
          />
        ))}
      </div>

      <div className="card-quiet mt-6 p-6 sm:p-8">
        {step === 1 ? (
          <div>
            <label htmlFor="match-county" className="block font-display text-xl font-semibold text-foreground">
              Which county does the person live in?
            </label>
            <p className="mt-1.5 text-[0.92rem] text-muted-foreground">
              Many programs only serve specific counties.
            </p>
            <select
              id="match-county"
              value={county}
              onChange={(event) => setCounty(event.target.value)}
              className="mt-4 h-14 w-full rounded-xl border-2 border-border bg-card px-4 text-base font-semibold focus:border-primary focus:outline-none"
            >
              <option value="">Select a county</option>
              {COUNTIES.map((name) => (
                <option key={name} value={name}>
                  {name}
                </option>
              ))}
            </select>
          </div>
        ) : null}

        {step === 2 ? (
          <fieldset>
            <legend className="font-display text-xl font-semibold text-foreground">
              What is the person's age?
            </legend>
            <p className="mt-1.5 text-[0.92rem] text-muted-foreground">
              Most Older Americans Act programs start at 60, and some Medicaid waivers start earlier.
            </p>
            <div className="mt-4 grid gap-2.5 sm:grid-cols-2">
              {AGES.map((option) => (
                <button
                  key={option}
                  type="button"
                  onClick={() => setAge(option)}
                  aria-pressed={age === option}
                  className={`tap rounded-xl border-2 px-4 py-3.5 text-left text-[1rem] font-semibold transition-colors ${
                    age === option
                      ? "border-primary bg-secondary text-primary"
                      : "border-border bg-card text-foreground hover:bg-secondary/60"
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>
          </fieldset>
        ) : null}

        {step === 3 ? (
          <fieldset>
            <legend className="font-display text-xl font-semibold text-foreground">
              What kind of help is needed?
            </legend>
            <p className="mt-1.5 text-[0.92rem] text-muted-foreground">Choose everything that applies.</p>
            <div className="mt-4 grid gap-2.5">
              {NEEDS.map((need) => {
                const checked = needs.includes(need.id);
                return (
                  <button
                    key={need.id}
                    type="button"
                    onClick={() => toggleNeed(need.id)}
                    aria-pressed={checked}
                    className={`tap flex items-center justify-between gap-3 rounded-xl border-2 px-4 py-3.5 text-left text-[1rem] font-semibold transition-colors ${
                      checked
                        ? "border-primary bg-secondary text-primary"
                        : "border-border bg-card text-foreground hover:bg-secondary/60"
                    }`}
                  >
                    {need.label}
                    <span
                      className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-md border-2 ${
                        checked ? "border-primary bg-primary text-primary-foreground" : "border-border"
                      }`}
                      aria-hidden="true"
                    >
                      {checked ? <Check className="h-4 w-4" /> : null}
                    </span>
                  </button>
                );
              })}
            </div>
          </fieldset>
        ) : null}

        {error ? <p className="mt-4 text-sm font-semibold text-destructive">{error}</p> : null}

        <div className="mt-7 flex items-center justify-between gap-3 border-t border-border/70 pt-5">
          <button
            type="button"
            onClick={() => setStep((s) => Math.max(1, s - 1))}
            disabled={step === 1}
            className="tap inline-flex items-center gap-1.5 rounded-xl px-3 py-2.5 text-sm font-bold text-muted-foreground disabled:opacity-40"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden="true" /> Back
          </button>
          {step < 3 ? (
            <button
              type="button"
              onClick={() => setStep((s) => s + 1)}
              disabled={(step === 1 && !county) || (step === 2 && !age)}
              className="tap inline-flex items-center gap-1.5 rounded-xl bg-primary px-6 py-3 text-base font-bold text-primary-foreground disabled:opacity-40"
            >
              Next <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </button>
          ) : (
            <button
              type="button"
              onClick={runMatch}
              disabled={needs.length === 0 || loading}
              className="tap inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-3 text-base font-bold text-primary-foreground disabled:opacity-40"
            >
              {loading ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> : null}
              See my matches
            </button>
          )}
        </div>
      </div>
    </div>
  );
}