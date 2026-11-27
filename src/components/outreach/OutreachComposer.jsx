import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useRouter } from "@tanstack/react-router";
import { toast } from "sonner";
import { Info, Loader2, Send, Sparkles } from "lucide-react";
import { draftOutreachEmail, sendOutreachEmail } from "@/lib/server-fns";

const inputClass =
  "h-12 w-full rounded-xl border-2 border-border bg-card px-4 text-base focus:border-primary focus:outline-none";

const EMPTY = { prospect_name: "", prospect_email: "", notes: "" };

export default function OutreachComposer() {
  const router = useRouter();
  const draftFn = useServerFn(draftOutreachEmail);
  const sendFn = useServerFn(sendOutreachEmail);

  const [form, setForm] = useState(EMPTY);
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");

  const set = (key) => (event) => setForm((prev) => ({ ...prev, [key]: event.target.value }));

  const draftMutation = useMutation({
    mutationFn: () => draftFn({ data: form }),
    onSuccess: (result) => {
      setSubject(result?.subject || "");
      setBody(result?.body || "");
      toast.success("Draft ready to review");
    },
    onError: (error) => toast.error(error?.message || "The draft could not be written."),
  });

  const sendMutation = useMutation({
    mutationFn: () => sendFn({ data: { ...form, subject, body } }),
    onSuccess: async (result) => {
      if (result?.success === false) {
        toast.error(result.message || "That email could not be sent.");
        return;
      }
      toast.success(`Email sent to ${form.prospect_email}`);
      setForm(EMPTY);
      setSubject("");
      setBody("");
      await router.invalidate();
    },
    onError: (error) => toast.error(error?.message || "That email could not be sent."),
  });

  const canDraft = form.prospect_email.trim().length > 3 && !draftMutation.isPending;
  const canSend = subject.trim().length > 2 && body.trim().length > 19 && !sendMutation.isPending;

  return (
    <section className="card-quiet p-5 sm:p-6">
      <h2 className="font-display text-lg font-semibold text-foreground">Write to a prospect</h2>
      <p className="mt-1 text-[0.88rem] leading-relaxed text-muted-foreground">
        Tell the assistant who you are writing to, then review and edit the note before it goes out.
      </p>

      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="outreach-name" className="text-[0.85rem] font-bold text-foreground">
            Name or organization
          </label>
          <input
            id="outreach-name"
            value={form.prospect_name}
            onChange={set("prospect_name")}
            placeholder="Macon Caregiver Support Group"
            className={`mt-1.5 ${inputClass}`}
          />
        </div>
        <div>
          <label htmlFor="outreach-email" className="text-[0.85rem] font-bold text-foreground">
            Their email
          </label>
          <input
            id="outreach-email"
            type="email"
            value={form.prospect_email}
            onChange={set("prospect_email")}
            placeholder="name@example.org"
            className={`mt-1.5 ${inputClass}`}
          />
        </div>
      </div>

      <div className="mt-4">
        <label htmlFor="outreach-notes" className="text-[0.85rem] font-bold text-foreground">
          What should the note mention? <span className="font-normal text-muted-foreground">(optional)</span>
        </label>
        <textarea
          id="outreach-notes"
          rows={3}
          value={form.notes}
          onChange={set("notes")}
          placeholder="They run a caregiver support group in Macon and asked about respite programs."
          className="mt-1.5 w-full rounded-xl border-2 border-border bg-card px-4 py-3 text-base focus:border-primary focus:outline-none"
        />
      </div>

      <button
        type="button"
        onClick={() => draftMutation.mutate()}
        disabled={!canDraft}
        className="tap mt-4 inline-flex items-center gap-2 rounded-xl border border-primary/25 bg-card px-4 py-3 text-[0.92rem] font-bold text-primary hover:bg-secondary disabled:opacity-60"
      >
        {draftMutation.isPending ? (
          <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
        ) : (
          <Sparkles className="h-4 w-4" aria-hidden="true" />
        )}
        {draftMutation.isPending ? "Writing…" : "Draft with AI"}
      </button>

      <div className="mt-6 border-t border-border/70 pt-5">
        <label htmlFor="outreach-subject" className="text-[0.85rem] font-bold text-foreground">
          Subject
        </label>
        <input
          id="outreach-subject"
          value={subject}
          onChange={(event) => setSubject(event.target.value)}
          placeholder="A free resource directory for the families you serve"
          className={`mt-1.5 ${inputClass}`}
        />

        <label htmlFor="outreach-body" className="mt-4 block text-[0.85rem] font-bold text-foreground">
          Message
        </label>
        <textarea
          id="outreach-body"
          rows={10}
          value={body}
          onChange={(event) => setBody(event.target.value)}
          placeholder="Your note will appear here after you draft it, and you can rewrite any of it."
          className="mt-1.5 w-full rounded-xl border-2 border-border bg-card px-4 py-3 text-[0.95rem] leading-relaxed focus:border-primary focus:outline-none"
        />

        <button
          type="button"
          onClick={() => sendMutation.mutate()}
          disabled={!canSend}
          className="btn-accent tap mt-4 inline-flex w-full items-center justify-center gap-2 rounded-xl px-6 py-3.5 text-base font-bold disabled:opacity-60 sm:w-auto"
        >
          {sendMutation.isPending ? (
            <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
          ) : (
            <Send className="h-4 w-4" aria-hidden="true" />
          )}
          {sendMutation.isPending ? "Sending…" : "Send email"}
        </button>

        <p className="mt-4 flex items-start gap-2 text-[0.82rem] leading-relaxed text-muted-foreground">
          <Info className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
          App members always receive these. An address that is not an app user needs a verified custom
          domain connected to the app, so check the Domains page before a first send to a new contact.
        </p>
      </div>
    </section>
  );
}