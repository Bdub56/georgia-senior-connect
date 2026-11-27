import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { toast } from "sonner";
import { CheckCircle2, Loader2, Send } from "lucide-react";
import { CATEGORIES } from "@/lib/georgia-data";
import { submitServiceSuggestion } from "@/lib/server-fns";

const EMPTY = {
  name: "",
  category: CATEGORIES[0],
  counties: "",
  phone: "",
  website: "",
  description: "",
  notes: "",
};

const inputClass =
  "h-12 w-full rounded-xl border-2 border-border bg-card px-4 text-base focus:border-primary focus:outline-none";

export default function SuggestServiceForm() {
  const submit = useServerFn(submitServiceSuggestion);
  const [form, setForm] = useState(EMPTY);
  const [sent, setSent] = useState(false);

  const mutation = useMutation({
    mutationFn: (payload) => submit({ data: payload }),
    onSuccess: () => {
      setForm(EMPTY);
      setSent(true);
    },
    onError: (error) => toast.error(error?.message || "That suggestion could not be sent."),
  });

  const set = (key) => (event) => setForm((prev) => ({ ...prev, [key]: event.target.value }));

  if (sent) {
    return (
      <div className="card-quiet p-6 text-center sm:p-8">
        <CheckCircle2 className="mx-auto h-10 w-10 text-primary" aria-hidden="true" />
        <h2 className="mt-3 font-display text-xl font-semibold text-foreground">Thank you</h2>
        <p className="mx-auto mt-2 max-w-md text-[0.95rem] leading-relaxed text-muted-foreground">
          Your suggestion is with the curator team. They check details before a listing goes live.
        </p>
        <button
          type="button"
          onClick={() => setSent(false)}
          className="tap mt-5 inline-flex items-center gap-2 rounded-xl border border-primary/25 bg-card px-5 py-3 text-[0.95rem] font-bold text-primary hover:bg-secondary"
        >
          Suggest another service
        </button>
      </div>
    );
  }

  return (
    <form
      className="card-quiet space-y-4 p-5 sm:p-6"
      onSubmit={(event) => {
        event.preventDefault();
        mutation.mutate(form);
      }}
    >
      <div>
        <label htmlFor="suggest-name" className="text-[0.85rem] font-bold text-foreground">
          Program or organization name
        </label>
        <input
          id="suggest-name"
          required
          value={form.name}
          onChange={set("name")}
          placeholder="e.g. Cobb Senior Services Meals on Wheels"
          className={`mt-1.5 ${inputClass}`}
        />
      </div>

      <div>
        <label htmlFor="suggest-category" className="text-[0.85rem] font-bold text-foreground">
          Category
        </label>
        <select
          id="suggest-category"
          value={form.category}
          onChange={set("category")}
          className={`mt-1.5 ${inputClass}`}
        >
          {CATEGORIES.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="suggest-counties" className="text-[0.85rem] font-bold text-foreground">
          Counties served <span className="font-normal text-muted-foreground">(comma separated, or Statewide)</span>
        </label>
        <input
          id="suggest-counties"
          value={form.counties}
          onChange={set("counties")}
          placeholder="Fulton, Cobb"
          className={`mt-1.5 ${inputClass}`}
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="suggest-phone" className="text-[0.85rem] font-bold text-foreground">
            Phone number
          </label>
          <input
            id="suggest-phone"
            value={form.phone}
            onChange={set("phone")}
            placeholder="(770) 555-0100"
            className={`mt-1.5 ${inputClass}`}
          />
        </div>
        <div>
          <label htmlFor="suggest-website" className="text-[0.85rem] font-bold text-foreground">
            Website
          </label>
          <input
            id="suggest-website"
            value={form.website}
            onChange={set("website")}
            placeholder="https://"
            className={`mt-1.5 ${inputClass}`}
          />
        </div>
      </div>

      <div>
        <label htmlFor="suggest-description" className="text-[0.85rem] font-bold text-foreground">
          What does the program provide?
        </label>
        <textarea
          id="suggest-description"
          rows={3}
          value={form.description}
          onChange={set("description")}
          placeholder="Meals, rides, counseling, help applying for benefits…"
          className="mt-1.5 w-full rounded-xl border-2 border-border bg-card px-4 py-3 text-base focus:border-primary focus:outline-none"
        />
      </div>

      <div>
        <label htmlFor="suggest-notes" className="text-[0.85rem] font-bold text-foreground">
          Why are you suggesting it? <span className="font-normal text-muted-foreground">(optional)</span>
        </label>
        <textarea
          id="suggest-notes"
          rows={2}
          value={form.notes}
          onChange={set("notes")}
          className="mt-1.5 w-full rounded-xl border-2 border-border bg-card px-4 py-3 text-base focus:border-primary focus:outline-none"
        />
      </div>

      <button
        type="submit"
        disabled={mutation.isPending}
        className="btn-accent tap inline-flex w-full items-center justify-center gap-2 rounded-xl px-6 py-3.5 text-base font-bold disabled:opacity-70 sm:w-auto"
      >
        {mutation.isPending ? (
          <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
        ) : (
          <Send className="h-4 w-4" aria-hidden="true" />
        )}
        {mutation.isPending ? "Sending…" : "Send suggestion"}
      </button>
    </form>
  );
}