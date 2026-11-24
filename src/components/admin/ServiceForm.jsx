import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useRouter } from "@tanstack/react-router";
import { Loader2, Save } from "lucide-react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import StarPicker from "@/components/StarPicker";
import { saveService } from "@/lib/server-fns";
import { AAAS, CATEGORIES, COST_TYPES } from "@/lib/georgia-data";

const EMPTY = {
  name: "",
  category: CATEGORIES[0],
  description: "",
  region: "",
  phone: "",
  phone_alt: "",
  website: "",
  address: "",
  hours: "",
  eligibility: "",
  cost_type: "Free",
  waitlist: false,
  waitlist_note: "",
  notes: "",
  keywords: "",
  editor_rating: 4,
};

const fieldClass =
  "mt-1.5 w-full rounded-xl border-2 border-border bg-card px-3.5 py-2.5 text-[0.95rem] focus:border-primary focus:outline-none";

export default function ServiceForm({ open, onOpenChange, service }) {
  const save = useServerFn(saveService);
  const router = useRouter();
  const queryClient = useQueryClient();

  const [values, setValues] = useState(() =>
    service
      ? { ...EMPTY, ...service, editor_rating: service.editor_rating ?? 0 }
      : EMPTY,
  );
  const [statewide, setStatewide] = useState((service?.counties || []).includes("Statewide"));
  const [countiesText, setCountiesText] = useState(
    (service?.counties || []).filter((c) => c !== "Statewide").join(", "),
  );
  const [error, setError] = useState("");

  const set = (field, value) => setValues((current) => ({ ...current, [field]: value }));

  const mutation = useMutation({
    mutationFn: (payload) => save({ data: payload }),
    onSuccess: async () => {
      toast.success(service ? "Service updated" : "Service added");
      await queryClient.invalidateQueries();
      await router.invalidate();
      onOpenChange(false);
    },
    onError: (err) => setError(err?.message || "That service could not be saved."),
  });

  const submit = (event) => {
    event.preventDefault();
    setError("");
    if (values.name.trim().length < 2) {
      setError("Add a service name.");
      return;
    }
    const counties = statewide
      ? ["Statewide"]
      : countiesText
          .split(",")
          .map((county) => county.trim())
          .filter(Boolean);
    if (counties.length === 0) {
      setError("Add at least one county, or mark the service as statewide.");
      return;
    }
    mutation.mutate({ ...values, counties, id: service?.id });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-display text-xl">
            {service ? "Edit service" : "Add a service"}
          </DialogTitle>
          <DialogDescription>
            Curator details show up on the public listing. Every field except the name and counties is optional.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={submit} className="space-y-4">
          <div>
            <label htmlFor="svc-name" className="text-sm font-bold text-foreground">
              Service name
            </label>
            <input
              id="svc-name"
              value={values.name}
              onChange={(event) => set("name", event.target.value)}
              className={fieldClass}
              placeholder="Georgia SHIP Medicare counseling"
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="svc-category" className="text-sm font-bold text-foreground">
                Category
              </label>
              <select
                id="svc-category"
                value={values.category}
                onChange={(event) => set("category", event.target.value)}
                className={fieldClass}
              >
                {CATEGORIES.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="svc-cost" className="text-sm font-bold text-foreground">
                Cost structure
              </label>
              <select
                id="svc-cost"
                value={values.cost_type}
                onChange={(event) => set("cost_type", event.target.value)}
                className={fieldClass}
              >
                {COST_TYPES.map((cost) => (
                  <option key={cost} value={cost}>
                    {cost}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label htmlFor="svc-description" className="text-sm font-bold text-foreground">
              Description
            </label>
            <textarea
              id="svc-description"
              rows={3}
              value={values.description}
              onChange={(event) => set("description", event.target.value)}
              className={fieldClass}
              placeholder="What the program provides, in plain language."
            />
          </div>

          <div>
            <label htmlFor="svc-counties" className="text-sm font-bold text-foreground">
              Counties served
            </label>
            <input
              id="svc-counties"
              value={countiesText}
              onChange={(event) => setCountiesText(event.target.value)}
              disabled={statewide}
              className={`${fieldClass} disabled:opacity-50`}
              placeholder="Fulton, DeKalb, Clayton"
            />
            <label className="mt-2 flex items-center gap-2.5 text-[0.9rem] font-semibold text-foreground">
              <Switch checked={statewide} onCheckedChange={setStatewide} />
              Available statewide
            </label>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="svc-phone" className="text-sm font-bold text-foreground">
                Phone
              </label>
              <input
                id="svc-phone"
                value={values.phone}
                onChange={(event) => set("phone", event.target.value)}
                className={fieldClass}
                placeholder="(404) 555-0100"
              />
            </div>
            <div>
              <label htmlFor="svc-phone-alt" className="text-sm font-bold text-foreground">
                Second phone (optional)
              </label>
              <input
                id="svc-phone-alt"
                value={values.phone_alt}
                onChange={(event) => set("phone_alt", event.target.value)}
                className={fieldClass}
                placeholder="1-866-552-4464"
              />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="svc-website" className="text-sm font-bold text-foreground">
                Website
              </label>
              <input
                id="svc-website"
                value={values.website}
                onChange={(event) => set("website", event.target.value)}
                className={fieldClass}
                placeholder="https://"
              />
            </div>
            <div>
              <label htmlFor="svc-region" className="text-sm font-bold text-foreground">
                Region / Area Agency on Aging
              </label>
              <input
                id="svc-region"
                list="aaa-regions"
                value={values.region}
                onChange={(event) => set("region", event.target.value)}
                className={fieldClass}
                placeholder="Statewide or regional agency"
              />
              <datalist id="aaa-regions">
                {AAAS.map((aaa) => (
                  <option key={aaa.id} value={aaa.name} />
                ))}
              </datalist>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="svc-address" className="text-sm font-bold text-foreground">
                Address
              </label>
              <input
                id="svc-address"
                value={values.address}
                onChange={(event) => set("address", event.target.value)}
                className={fieldClass}
                placeholder="567 Swanson Dr., Lawrenceville, GA 30043"
              />
            </div>
            <div>
              <label htmlFor="svc-hours" className="text-sm font-bold text-foreground">
                Hours
              </label>
              <input
                id="svc-hours"
                value={values.hours}
                onChange={(event) => set("hours", event.target.value)}
                className={fieldClass}
                placeholder="Monday to Friday, 9:00 a.m. to 5:00 p.m."
              />
            </div>
          </div>

          <div>
            <label htmlFor="svc-eligibility" className="text-sm font-bold text-foreground">
              Eligibility
            </label>
            <textarea
              id="svc-eligibility"
              rows={2}
              value={values.eligibility}
              onChange={(event) => set("eligibility", event.target.value)}
              className={fieldClass}
              placeholder="Age, income, and residency rules."
            />
          </div>

          <div className="rounded-xl border border-border/80 bg-secondary/40 p-4">
            <label className="flex items-center gap-2.5 text-[0.95rem] font-bold text-foreground">
              <Switch checked={values.waitlist} onCheckedChange={(checked) => set("waitlist", checked)} />
              This program has a waitlist
            </label>
            {values.waitlist ? (
              <input
                value={values.waitlist_note}
                onChange={(event) => set("waitlist_note", event.target.value)}
                className={fieldClass}
                placeholder="How long the wait is, and who gets priority."
              />
            ) : null}
          </div>

          <div>
            <label htmlFor="svc-notes" className="text-sm font-bold text-foreground">
              Notes for callers
            </label>
            <textarea
              id="svc-notes"
              rows={2}
              value={values.notes}
              onChange={(event) => set("notes", event.target.value)}
              className={fieldClass}
              placeholder="Rule changes, what to bring, who to ask for."
            />
          </div>

          <div>
            <label htmlFor="svc-keywords" className="text-sm font-bold text-foreground">
              Extra search terms
            </label>
            <input
              id="svc-keywords"
              value={values.keywords}
              onChange={(event) => set("keywords", event.target.value)}
              className={fieldClass}
              placeholder="medicare, prescription, SHIP"
            />
          </div>

          <div>
            <p className="text-sm font-bold text-foreground">Official editor rating</p>
            <StarPicker value={values.editor_rating} onChange={(value) => set("editor_rating", value)} size="sm" />
          </div>

          {error ? <p className="text-sm font-semibold text-destructive">{error}</p> : null}

          <DialogFooter className="gap-2">
            <button
              type="button"
              onClick={() => onOpenChange(false)}
              className="tap rounded-xl px-4 py-2.5 text-[0.95rem] font-bold text-muted-foreground hover:bg-secondary"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={mutation.isPending}
              className="tap inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-[0.95rem] font-bold text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
            >
              {mutation.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
              ) : (
                <Save className="h-4 w-4" aria-hidden="true" />
              )}
              {service ? "Save changes" : "Add service"}
            </button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}