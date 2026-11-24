import StarRating from "@/components/StarRating";

const formatDate = (value) => {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric", timeZone: "UTC" });
};

export default function ReviewList({ reviews, currentUserId, onEdit }) {
  if (!reviews?.length) {
    return (
      <p className="rounded-xl border border-dashed border-border bg-secondary/40 p-5 text-[0.95rem] leading-relaxed text-muted-foreground">
        No community reviews yet. If you have used this program, a short note helps the next family
        know what to expect.
      </p>
    );
  }

  return (
    <ul className="space-y-3">
      {reviews.map((review) => (
        <li key={review.id} className="rounded-xl border border-border/80 bg-card p-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2.5">
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-secondary text-sm font-bold text-primary">
                {(review.author_name || "C").slice(0, 1).toUpperCase()}
              </span>
              <span>
                <span className="block text-[0.95rem] font-bold text-foreground">
                  {review.author_name || "Community member"}
                </span>
                <span className="block text-[0.78rem] font-semibold uppercase tracking-wide text-muted-foreground">
                  {review.author_role || "Community"} · {formatDate(review.created_date)}
                </span>
              </span>
            </div>
            <div className="flex items-center gap-2">
              <StarRating value={review.stars} size="sm" />
              {currentUserId && review.created_by_id === currentUserId ? (
                <button
                  type="button"
                  onClick={() => onEdit?.(review)}
                  className="rounded-lg px-2 py-1 text-[0.8rem] font-bold text-primary hover:bg-secondary"
                >
                  Edit
                </button>
              ) : null}
            </div>
          </div>
          {review.body ? (
            <p className="mt-3 text-[0.95rem] leading-relaxed text-foreground/85">{review.body}</p>
          ) : null}
        </li>
      ))}
    </ul>
  );
}