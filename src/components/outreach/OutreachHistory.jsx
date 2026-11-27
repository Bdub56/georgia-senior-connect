const formatStamp = (value) => {
  if (!value) return "";
  const when = new Date(value);
  if (Number.isNaN(when.getTime())) return "";
  return when.toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    timeZone: "America/New_York",
  });
};

export default function OutreachHistory({ emails }) {
  return (
    <section className="card-quiet overflow-hidden">
      <div className="border-b border-border/70 p-4">
        <h2 className="font-display text-lg font-semibold text-foreground">Recent outreach</h2>
        <p className="mt-0.5 text-[0.82rem] text-muted-foreground">Newest first.</p>
      </div>
      <ul className="divide-y divide-border/70">
        {emails.map((email) => (
          <li key={email.id} className="p-4">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="truncate text-[0.92rem] font-bold text-foreground">{email.subject}</p>
                <p className="mt-0.5 truncate text-[0.82rem] text-muted-foreground">
                  {email.prospect_name ? `${email.prospect_name} · ` : ""}
                  {email.prospect_email}
                </p>
              </div>
              <span
                className={`shrink-0 rounded-full border px-2.5 py-1 text-[0.7rem] font-bold uppercase tracking-wide ${
                  email.status === "sent"
                    ? "border-[#bfe3cd] bg-[#e7f4ec] text-[#14603a]"
                    : "border-[#f7cbb0] bg-[#fde8db] text-[#9a3412]"
                }`}
              >
                {email.status === "sent" ? "Sent" : "Failed"}
              </span>
            </div>
            <p className="mt-1 text-[0.78rem] text-muted-foreground">{formatStamp(email.created_date)}</p>
            {email.status === "failed" && email.note ? (
              <p className="mt-1.5 text-[0.8rem] leading-relaxed text-[#9a3412]">{email.note}</p>
            ) : null}
          </li>
        ))}
        {emails.length === 0 ? (
          <li className="p-5 text-center text-[0.9rem] text-muted-foreground">No outreach sent yet.</li>
        ) : null}
      </ul>
    </section>
  );
}