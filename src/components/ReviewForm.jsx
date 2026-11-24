import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useRouter } from "@tanstack/react-router";
import { Loader2, Trash2, Check } from "lucide-react";
import StarPicker from "@/components/StarPicker";
import { saveReview, deleteReview } from "@/lib/server-fns";

const ROLES = ["Senior or family", "Caregiver", "Social worker or APS", "Other"];

export default function ReviewForm({ serviceId, existing, onDone }) {
  const save = useServerFn(saveReview);
  const remove = useServerFn(deleteReview);
  const queryClient = useQueryClient();
  const router = useRouter();

  const [stars, setStars] = useState(existing?.stars || 0);
  const [body, setBody] = useState(existing?.body || "");
  const [role, setRole] = useState(existing?.author_role || ROLES[0]);
  const [error, setError] = useState("");

  const refresh = async () => {
    await queryClient.invalidateQueries();
    await router.invalidate();
    onDone?.();
  };

  const saveMutation = useMutation({
    mutationFn: (payload) => save({ data: payload }),
    onSuccess: refresh,
    onError: (err) => setError(err?.message || "That review could not be saved."),
  });

  const deleteMutation = useMutation({
    mutationFn: () => remove({ data: { id: existing.id } }),
    onSuccess: refresh,
    onError: (err) => setError(err?.message || "That review could not be removed."),
  });

  const busy = saveMutation.isPending || deleteMutation.isPending;

  return (
    <form
      className="mt-4"
      onSubmit={(event) => {
        event.preventDefault();
        setError("");
        if (stars < 1) {
          setError("Pick a star rating first.");
          return;
        }
        saveMutation.mutate({ service_id: serviceId, stars, body: body.trim(), author_role: role });
      }}
    >
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-sm font-bold text-foreground">Your rating</p>
          <StarPicker value={stars} onChange={setStars} />
        </div>
        <div>
          <label htmlFor="review-role" className="block text-sm font-bold text-foreground">
            I am a
          </label>
          <select
            id="review-role"
            value={role}
            onChange={(event) => setRole(event.target.value)}
            className="mt-1 h-11 rounded-xl border-2 border-border bg-card px-3 text-[0.95rem] font-semibold focus:border-primary focus:outline-none"
          >
            {ROLES.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>
      </div>

      <label htmlFor="review-body" className="mt-4 block text-sm font-bold text-foreground">
        What should other families know? (optional)
      </label>
      <textarea
        id="review-body"
        value={body}
        onChange={(event) => setBody(event.target.value)}
        rows={4}
        maxLength={1500}
        placeholder="How long did the wait take? Did they ask for documents? Was the staff helpful?"
        className="mt-1.5 w-full rounded-xl border-2 border-border bg-card p-3.5 text-[0.98rem] leading-relaxed focus:border-primary focus:outline-none"
      />

      {error ? <p className="mt-2 text-sm font-semibold text-destructive">{error}</p> : null}

      <div className="mt-4 flex flex-wrap items-center gap-2">
        <button
          type="submit"
          disabled={busy}
          className="tap inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-3 text-[0.95rem] font-bold text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
        >
          {busy ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> : <Check className="h-4 w-4" aria-hidden="true" />}
          {existing ? "Update my review" : "Post review"}
        </button>
        {existing ? (
          <button
            type="button"
            onClick={() => deleteMutation.mutate()}
            disabled={busy}
            className="tap inline-flex items-center gap-2 rounded-xl border border-destructive/30 px-4 py-3 text-[0.95rem] font-bold text-destructive hover:bg-destructive/5 disabled:opacity-50"
          >
            <Trash2 className="h-4 w-4" aria-hidden="true" /> Delete
          </button>
        ) : null}
        {existing ? (
          <button
            type="button"
            onClick={onDone}
            className="tap rounded-xl px-4 py-3 text-[0.95rem] font-bold text-muted-foreground hover:bg-secondary"
          >
            Cancel
          </button>
        ) : null}
      </div>
    </form>
  );
}