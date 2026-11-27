import { Mail, Phone, ShieldCheck } from "lucide-react";

export default function PiConsultCta() {
  return (
    <section className="wrap pb-16">
      <div className="overflow-hidden rounded-2xl border border-primary/20 bg-primary text-primary-foreground">
        <div className="grid gap-6 p-6 sm:p-9 md:grid-cols-[1fr_auto] md:items-center">
          <div>
            <p className="inline-flex items-center gap-2 text-[0.7rem] font-bold uppercase tracking-[0.18em] text-primary-foreground/70">
              <ShieldCheck className="h-4 w-4" aria-hidden="true" /> Peace of mind
            </p>
            <h2 className="mt-2 font-display text-[1.6rem] font-semibold leading-snug tracking-tight sm:text-[1.9rem]">
              Talk to a Licensed Private Investigator
            </h2>
            <p className="mt-2 max-w-xl text-[0.98rem] leading-relaxed text-primary-foreground/85">
              Get a free consultation today.
            </p>
          </div>
          <div className="flex flex-col gap-2.5 sm:flex-row md:flex-col">
            <a
              href="tel:7624990812"
              className="tap inline-flex items-center justify-center gap-2 rounded-xl bg-primary-foreground px-5 py-3.5 text-base font-bold text-primary transition-opacity hover:opacity-90"
            >
              <Phone className="h-4 w-4" aria-hidden="true" /> (762) 499-0812
            </a>
            <a
              href="mailto:georgiasenior@gmail.com?subject=Free%20consultation%20request"
              className="tap inline-flex items-center justify-center gap-2 rounded-xl border-2 border-primary-foreground/40 px-5 py-3.5 text-base font-bold text-primary-foreground transition-colors hover:bg-primary-foreground/10"
            >
              <Mail className="h-4 w-4" aria-hidden="true" /> georgiasenior@gmail.com
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}