const APP_URL = "https://georgia-senior-link.base44.app";
const LOGO_URL =
  "https://media.base44.com/images/public/6b05e58849590bf5a83f5755/5e50d5a64179028e2f3a618692c96fa9_logo.png";

const escapeHtml = (value) =>
  String(value ?? "").replace(
    /[&<>"']/g,
    (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[char],
  );

const toParagraphs = (body) =>
  String(body || "")
    .split(/\n{2,}/)
    .map((block) => block.trim())
    .filter(Boolean)
    .map(
      (block) =>
        `<p style="margin:0 0 14px;color:#27323f;font-family:'Atkinson Hyperlegible',Helvetica,Arial,sans-serif;font-size:15px;line-height:1.65;">${escapeHtml(
          block,
        ).replace(/\n/g, "<br />")}</p>`,
    )
    .join("");

// Branded shell for one-to-one outreach to a prospective member.
export function outreachHtml({ subject, body }) {
  return `<div style="margin:0;padding:24px;background:#fdfbf7;font-family:'Atkinson Hyperlegible',Helvetica,Arial,sans-serif;">
  <div style="max-width:560px;margin:0 auto;background:#ffffff;border:1px solid #e5e7eb;border-radius:13px;overflow:hidden;">
    <div style="background:#1f3b61;padding:18px 24px;">
      <img src="${LOGO_URL}" alt="Georgia Senior Link" height="30" style="height:30px;display:inline-block;vertical-align:middle;" />
      <span style="color:#fdfbf7;font-family:'Fraunces',Georgia,serif;font-size:17px;font-weight:700;margin-left:10px;vertical-align:middle;">Georgia Senior Link</span>
    </div>
    <div style="padding:26px 24px;">
      <h1 style="margin:0 0 16px;font-family:'Fraunces',Georgia,serif;font-size:22px;line-height:1.3;color:#27323f;">${escapeHtml(
        subject,
      )}</h1>
      ${toParagraphs(body)}
      <p style="margin:22px 0 0;">
        <a href="${APP_URL}" style="display:inline-block;background:#1f3b61;color:#fdfbf7;font-family:'Atkinson Hyperlegible',Helvetica,Arial,sans-serif;font-size:15px;font-weight:700;text-decoration:none;padding:13px 24px;border-radius:13px;">Open Georgia Senior Link</a>
      </p>
    </div>
    <div style="padding:16px 24px;background:#fdfbf7;border-top:1px solid #e5e7eb;">
      <p style="margin:0;color:#4f5b69;font-family:'Atkinson Hyperlegible',Helvetica,Arial,sans-serif;font-size:12px;line-height:1.6;">
        You are receiving this note from the Georgia Senior Link curator team about a free statewide resource directory.
        Reply to this email and we will not write again.
      </p>
    </div>
  </div>
</div>`;
}

export async function sendProspectEmail(base44, { to, subject, body }) {
  return base44.asServiceRole.integrations.Core.SendEmail({
    to,
    subject,
    html: outreachHtml({ subject, body }),
    text: `${body}\n\nOpen Georgia Senior Link: ${APP_URL}`,
    from_name: "Georgia Senior Link",
    category: "marketing",
  });
}