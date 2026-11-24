import { Link } from "@tanstack/react-router";
import { ArrowUpRight } from "lucide-react";
import { CategoryIcon } from "@/components/categoryIcons";
import { CATEGORY_BLURBS } from "@/lib/georgia-data";

export default function CategoryTiles({ categories }) {
  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
      {categories.map((category) => (
        <Link
          key={category}
          to="/services"
          search={{ category }}
          className="card-quiet group flex flex-col gap-2 p-4 transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/35 hover:shadow-[0_2px_4px_rgba(16,42,46,0.05),0_18px_34px_-26px_rgba(16,42,46,0.5)]"
        >
          <span className="flex items-center justify-between">
            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-secondary text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
              <CategoryIcon category={category} className="h-5 w-5" />
            </span>
            <ArrowUpRight className="h-4 w-4 text-muted-foreground/50 transition-colors group-hover:text-primary" aria-hidden="true" />
          </span>
          <span className="mt-1 text-[1rem] font-bold leading-snug text-foreground">{category}</span>
          <span className="text-[0.82rem] leading-snug text-muted-foreground">
            {CATEGORY_BLURBS[category]}
          </span>
        </Link>
      ))}
    </div>
  );
}