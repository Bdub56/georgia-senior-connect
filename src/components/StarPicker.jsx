import { Star } from "lucide-react";

export default function StarPicker({ value, onChange, size = "lg" }) {
  const dimension = size === "lg" ? "h-9 w-9" : "h-7 w-7";

  return (
    <div className="flex items-center gap-1" role="radiogroup" aria-label="Star rating">
      {[1, 2, 3, 4, 5].map((star) => {
        const active = star <= value;
        return (
          <button
            key={star}
            type="button"
            role="radio"
            aria-checked={value === star}
            aria-label={`${star} ${star === 1 ? "star" : "stars"}`}
            onClick={() => onChange(star)}
            className="tap flex items-center justify-center rounded-lg p-1 transition-transform hover:scale-110"
          >
            <Star
              className={`${dimension} ${active ? "text-[#c2410c]" : "text-border"}`}
              strokeWidth={1.75}
              fill={active ? "currentColor" : "none"}
              aria-hidden="true"
            />
          </button>
        );
      })}
    </div>
  );
}