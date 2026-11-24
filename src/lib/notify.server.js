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