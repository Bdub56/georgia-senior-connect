import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Phone, MapPin, ClipboardCheck, Globe } from "lucide-react";
import { COUNTIES, INTAKE_CHECKLIST, findAaa, zipToCounties } from "@/lib/georgia-data";

export const Route = createFileRoute("/_site/aaa")({
  head: () => ({
    meta: [
      { title: "Find your Area Agency on Aging — Georgia Senior Link" },
      {
        name: "description",
        content:
          "Enter a Georgia county or ZIP code to find the regional Area Agency on Aging, the direct phone number, and the intake checklist.",
      },
    ],
  }),
  component: AaaPage,
});

function AaaPage() {
  const [county, setCounty] = useState("");
  const [zip, setZip] = useState("");
  const [zipHint, setZipHint] = useState("");

  const aaa = county ? findAaa(county) : null;

  const lookupZip = (value) => {
    setZip(value);
    const cleaned = value.replace(/[^0-9]/g, "");
    if (cleaned.length < 3) {
      setZipHint("");
      return;
    }
    const counties = zipToCounties(cleaned);
    if (counties.length === 0) {
      setZipHint("That ZIP is outside Georgia. Choose a county instead.");
      setCounty("");
      return;
    }
    setCounty(counties[0]);
    setZipHint(`ZIP ${cleaned.slice(0, 5)} is in or near ${counties.slice(0, 3).join(", ")} County.`);
  };

  return (
    <div className="wrap py-10">
      <div className="max-w-2xl">
        <p className="eyebrow">Regional help</p>
        <h1 className="mt-2 font-display text-[2rem] font-semibold tracking-tight text-foreground sm:text-4xl">
          Find your Area Agency on Aging
        </h1>
        <p className="mt-3 text-[1rem] leading-relaxed text-muted-foreground">
          Twelve regional agencies cover all 159 counties. They run the free screenings, the waiver
          waitlists, and the referrals to local providers.
        </p>
      </div>

      <div className="card-quiet mt-7 grid gap-4 p-6 sm:grid-cols-2 sm:p-7">
        <div>
          <label htmlFor="aaa-county" className="block text-sm font-bold text-foreground">
            County
          </label>
          <select
            id="aaa-county"
            value={county}
            onChange={(event) => {
              setCounty(event.target.value);
              setZipHint("");
            }}
            className="mt-2 h-14 w-full rounded-xl border-2 border-border bg-card px-4 text-base font-semibold focus:border-primary focus:outline-none"
          >
            <option value="">Select a county</option>
            {COUNTIES.map((name) => (
              <option key={name} value={name}>
                {name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="aaa-zip" className="block text-sm font-bold text-foreground">
            Or ZIP code
          </label>
          <input
            id="aaa-zip"
            inputMode="numeric"
            value={zip}
            onChange={(event) => lookupZip(event.target.value)}
            placeholder="30310"
            maxLength={5}
            className="mt-2 h-14 w-full rounded-xl border-2 border-border bg-card px-4 text-base font-semibold placeholder:font-normal focus:border-primary focus:outline-none"
          />
          {zipHint ? <p className="mt-2 text-[0.85rem] font-semibold text-muted-foreground">{zipHint}</p> : null}
        </div>
      </div>

      {aaa ? (
        <div className="card-quiet mt-5 overflow-hidden">
          <div className="bg-primary px-6 py-6 text-primary-foreground sm:px-8">
            <p className="text-[0.7rem] font-bold uppercase tracking-[0.18em] text-primary-foreground/70">
              {aaa.short}
            </p>
            <h2 className="mt-1.5 font-display text-2xl font-semibold leading-snug">{aaa.name}</h2>
            <p className="mt-1.5 flex items-center gap-1.5 text-[0.9rem] text-primary-foreground/80">
              <MapPin className="h-4 w-4" aria-hidden="true" /> Serves {aaa.counties.length} counties, including {county}
            </p>
          </div>
          <div className="flex flex-wrap gap-3 p-6 sm:px-8">
            <a
              href={`tel:${aaa.phone.replace(/[^0-9+]/g, "")}`}
              className="tap inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-3.5 text-base font-bold text-primary-foreground hover:bg-primary/90"
            >
              <Phone className="h-5 w-5" aria-hidden="true" /> {aaa.phone}
            </a>
            <a
              href={aaa.website}
              target="_blank"
              rel="noreferrer"
              className="tap inline-flex items-center gap-2 rounded-xl border border-primary/25 bg-card px-5 py-3.5 text-base font-bold text-primary hover:bg-secondary"
            >
              <Globe className="h-5 w-5" aria-hidden="true" /> Agency website
            </a>
            <Link
              to="/services"
              search={{ county }}
              className="tap inline-flex items-center gap-2 rounded-xl px-5 py-3.5 text-base font-bold text-primary hover:bg-secondary"
            >
              Services in {county} County <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>
          <div className="border-t border-border/70 bg-secondary/40 px-6 py-4 text-[0.9rem] leading-relaxed text-muted-foreground sm:px-8">
            Also works: the statewide ADRC line at{" "}
            <a href="tel:18665524464" className="font-bold text-primary hover:underline">
              1-866-552-4464
            </a>{" "}
            (press 2) reaches the same agency. Calling the regional office directly is usually faster.
          </div>
        </div>
      ) : null}

      <section className="mt-10">
        <h2 className="flex items-center gap-2 font-display text-[1.5rem] font-semibold tracking-tight text-foreground">
          <ClipboardCheck className="h-5 w-5 text-primary" aria-hidden="true" /> Intake checklist for families and caseworkers
        </h2>
        <ol className="mt-5 grid gap-3 md:grid-cols-2">
          {INTAKE_CHECKLIST.map((item, index) => (
            <li key={item.title} className="card-quiet flex gap-4 p-5">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-secondary font-display text-sm font-bold text-primary">
                {index + 1}
              </span>
              <span>
                <span className="block text-[1rem] font-bold text-foreground">{item.title}</span>
                <span className="mt-1 block text-[0.9rem] leading-relaxed text-muted-foreground">{item.body}</span>
              </span>
            </li>
          ))}
        </ol>
      </section>
    </div>
  );
}