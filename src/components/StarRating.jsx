import { Star } from "lucide-react";

const SIZES = {
  sm: "h-3.5 w-3.5",
  md: "h-[1.15rem] w-[1.15rem]",
  lg: "h-6 w-6",
};

export default function StarRating({ value = 0, size = "md", className = "" }) {
  const safe = Number.isFinite(Number(value)) ? Number(value) : 0;
  const pct = Math.max(0, Math.min(100, (safe / 5) * 100));
  const stars = [0, 1, 2, 3, 4];

  return (
    <span
      className={`relative inline-flex align-middle ${className}`}
      role="img"
      aria-label={`${safe.toFixed(1)} out of 5 stars`}
    >
      <span className="flex gap-0.5 text-border">
        {stars.map((i) => (
          <Star key={i} className={SIZES[size]} strokeWidth={1.75} />
        ))}
      </span>
      <span className="absolute inset-0 overflow-hidden" style={{ width: `${pct}%` }} aria-hidden="true">
        <span className="flex gap-0.5 text-[#c2410c]">
          {stars.map((i) => (
            <Star key={i} className={SIZES[size]} strokeWidth={1.75} fill="currentColor" />
          ))}
        </span>
      </span>
    </span>
  );
}