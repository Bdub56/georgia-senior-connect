import { Link, useRouterState } from "@tanstack/react-router";
import { Phone, LifeBuoy } from "lucide-react";
import AuthMenu from "@/components/AuthMenu";
import FooterLegal from "@/components/FooterLegal";

const NAV = [
  { label: "Find services", to: "/services" },
  { label: "Needs match", to: "/match" },
  { label: "My AAA", to: "/aaa" },
];

function Brand() {
  return (
    <Link to="/" className="flex items-center gap-2.5 rounded-lg py-1 pr-2">
      <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary font-display text-lg font-bold text-primary-foreground">
        GA
      </span>
      <span className="leading-tight">
        <span className="block font-display text-[1.05rem] font-semibold tracking-tight text-foreground">
          Georgia Senior Link
        </span>
        <span className="block text-[0.7rem] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
          Elder services directory
        </span>
      </span>
    </Link>
  );
}

export default function Layout({ children }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-lg focus:bg-primary focus:px-4 focus:py-2 focus:text-primary-foreground"
      >
        Skip to content
      </a>

      <header className="sticky top-0 z-40 border-b border-border/70 bg-background/90 backdrop-blur-md">
        <div className="wrap flex h-[4.5rem] items-center justify-between gap-4">
          <Brand />
          <nav aria-label="Main" className="hidden items-center gap-1 md:flex">
            {NAV.map((item) => {
              const active = pathname === item.to || pathname.startsWith(`${item.to}/`);
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  className={`tap rounded-xl px-4 py-2.5 text-[0.95rem] font-semibold transition-colors ${
                    active ? "bg-secondary text-primary" : "text-foreground/80 hover:bg-secondary/70"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
          <div className="flex items-center gap-2">
            <a
              href="tel:18665524464"
              className="tap hidden items-center gap-2 rounded-xl border border-primary/25 bg-card px-3.5 py-2.5 text-sm font-bold text-primary transition-colors hover:bg-secondary sm:inline-flex"
            >
              <Phone className="h-4 w-4" aria-hidden="true" />
              <span>1-866-552-4464</span>
            </a>
            <AuthMenu />
          </div>
        </div>
        <div className="border-t border-border/60 md:hidden">
          <div className="wrap flex gap-1 overflow-x-auto py-2">
            {NAV.map((item) => {
              const active = pathname === item.to || pathname.startsWith(`${item.to}/`);
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  className={`tap shrink-0 rounded-lg px-3.5 py-2 text-sm font-semibold ${
                    active ? "bg-secondary text-primary" : "text-foreground/75"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </div>
        </div>
      </header>

      <main id="main" className="flex-1">
        {children}
      </main>

      <footer className="mt-16 border-t border-border/70 bg-secondary/40">
        <div className="wrap grid gap-8 py-12 md:grid-cols-3">
          <div>
            <Brand />
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-muted-foreground">
              A new state agency initiative connecting older Georgians, their families, and the caseworkers
              who serve them to the state's aging network.
            </p>
          </div>
          <div>
            <h2 className="text-sm font-bold uppercase tracking-[0.14em] text-foreground">Start here</h2>
            <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
              <li>
                <a className="font-semibold text-primary underline-offset-4 hover:underline" href="tel:18665524464">
                  ADRC line: 1-866-552-4464
                </a>
              </li>
              <li>
                <a className="font-semibold text-primary underline-offset-4 hover:underline" href="tel:211">
                  Georgia 2-1-1
                </a>
              </li>
              <li>
                <a className="font-semibold text-primary underline-offset-4 hover:underline" href="tel:18665524464">
                  Report elder abuse (24/7)
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h2 className="text-sm font-bold uppercase tracking-[0.14em] text-foreground">About the listings</h2>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              Programs and phone numbers change. Always confirm details with the provider before you
              travel or apply. This directory is not run by the State of Georgia.
            </p>
            <p className="mt-3 inline-flex items-center gap-2 text-sm font-semibold text-primary">
              <LifeBuoy className="h-4 w-4" aria-hidden="true" /> In an emergency, call 911.
            </p>
          </div>
        </div>
        <FooterLegal />
      </footer>
    </div>
  );
}