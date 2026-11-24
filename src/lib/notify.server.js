const APP_URL = "https://georgia-senior-link.base44.app";

// Curators who receive a new-review alert.
const CURATORS = ["vatech1988@gmail.com"];

const trim = (value, max) => String(value ?? "").slice(0, max);

const formatWhen = (value) => {
  if (!value) return "just now";
  const when = new Date(value);
  if (Number.isNaN(when.getTime())) return "just now";
  return when.toLocaleString("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "America/New_York",
  });
};

const escapeHtml = (value) =>
  String(value ?? "").replace(/[&<>"']/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[char]);

// Branded shell shared by the owner alerts.
const ownerEmail = ({ heading, intro, rows }) =>
  `<div style="margin:0;padding:24px;background:#fdfbf7;font-family:'Atkinson Hyperlegible',Helvetica,Arial,sans-serif;">
  <div style="max-width:560px;margin:0 auto;background:#ffffff;border:1px solid #e5e7eb;border-radius:13px;overflow:hidden;">
    <div style="background:#1f3b61;padding:18px 24px;">
      <img src="https://media.base44.com/images/public/6b05e58849590bf5a83f5755/5e50d5a64179028e2f3a618692c96fa9_logo.png" alt="Georgia Senior Link" height="30" style="height:30px;display:inline-block;vertical-align:middle;" />
      <span style="color:#fdfbf7;font-family:'Fraunces',Georgia,serif;font-size:17px;font-weight:700;margin-left:10px;vertical-align:middle;">Georgia Senior Link</span>
    </div>
    <div style="padding:24px;">
      <h1 style="margin:0 0 8px;font-family:'Fraunces',Georgia,serif;font-size:22px;line-height:1.25;color:#27323f;">${escapeHtml(heading)}</h1>
      <p style="margin:0 0 18px;color:#4f5b69;font-size:15px;line-height:1.6;">${escapeHtml(intro)}</p>
      <table style="width:100%;border-collapse:collapse;border-top:1px solid #e5e7eb;">${rows
        .map(
          ([label, value]) =>
            `<tr><td style="padding:8px 0;border-bottom:1px solid #e5e7eb;color:#4f5b69;font-size:14px;">${escapeHtml(
              label,
            )}</td><td style="padding:8px 0;border-bottom:1px solid #e5e7eb;color:#27323f;font-size:14px;font-weight:700;text-align:right;">${escapeHtml(
              value,
            )}</td></tr>`,
        )
        .join("")}</table>
      <p style="margin:20px 0 0;"><a href="${APP_URL}" style="color:#1f3b61;font-size:14px;font-weight:700;">Open Georgia Senior Link</a></p>
    </div>
  </div>
</div>`;

// Emails the owner the first time a visitor opens the app on a given day.
export async function notifyOwnerOfVisit(base44, visit) {
  await base44.asServiceRole.integrations.Core.SendEmail({
    to: CURATORS[0],
    subject: "Someone opened Georgia Senior Link",
    html: ownerEmail({
      heading: "A visitor opened the app",
      intro: "This is the first visit from this visitor today.",
      rows: [
        ["Page", trim(visit.path, 200) || "/"],
        ["IP address", trim(visit.ip, 60) || "Not available"],
        ["Came from", trim(visit.referrer, 300) || "Direct visit"],
        ["Signed in", visit.signedIn ? trim(visit.userEmail, 200) || "Yes" : "Not signed in"],
        ["When", formatWhen(new Date().toISOString())],
      ],
    }),
    category: "transactional",
  });

  return { sent: true };
}

// Emails every curator (app admin) when a community member posts a review.
// Called after the review is saved, so a mail failure never blocks the reviewer.
export async function notifyCuratorsOfReview(base44, review) {
  const serviceId = trim(review?.service_id, 120);
  if (!serviceId) return { sent: false, reason: "missing_review" };

  const recipients = CURATORS;

  const variables = {
    service_name: trim(review.service_name, 180) || "a service listing",
    stars: trim(review.stars, 3),
    author_name: trim(review.author_name, 120) || "A community member",
    author_role: trim(review.author_role, 60) || "Other",
    review_body: trim(review.body, 1500) || "No written note was left.",
    submitted_at: formatWhen(review.created_date),
    service_url: `${APP_URL}/services/${serviceId}`,
  };

  for (const to of recipients) {
    await base44.asServiceRole.integrations.Core.SendEmail({
      to,
      template_name: "NewReviewAlert",
      variables,
      category: "transactional",
    });
  }

  return { sent: true, recipients: recipients.length };
}