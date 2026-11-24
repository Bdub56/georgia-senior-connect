import { createClientFromRequest } from "npm:@base44/sdk@0.8.63";
import { waitUntil } from "base44:runtime";

const OWNER_EMAIL = "vatech1988@gmail.com";
const APP_URL = "https://georgia-senior-link.base44.app";
const LOGO_URL =
  "https://media.base44.com/images/public/6b05e58849590bf5a83f5755/5e50d5a64179028e2f3a618692c96fa9_logo.png";

const escapeHtml = (value) =>
  String(value ?? "").replace(/[&<>"']/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[char]));

const buildHtml = ({ name, email, method }) =>
  `<div style="margin:0;padding:24px;background:#fdfbf7;font-family:'Atkinson Hyperlegible',Helvetica,Arial,sans-serif;">
  <div style="max-width:560px;margin:0 auto;background:#ffffff;border:1px solid #e5e7eb;border-radius:13px;overflow:hidden;">
    <div style="background:#1f3b61;padding:18px 24px;">
      <img src="${LOGO_URL}" alt="Georgia Senior Link" height="30" style="height:30px;display:inline-block;vertical-align:middle;" />
      <span style="color:#fdfbf7;font-family:'Fraunces',Georgia,serif;font-size:17px;font-weight:700;margin-left:10px;vertical-align:middle;">Georgia Senior Link</span>
    </div>
    <div style="padding:24px;">
      <h1 style="margin:0 0 8px;font-family:'Fraunces',Georgia,serif;font-size:22px;line-height:1.25;color:#27323f;">A new user signed up</h1>
      <p style="margin:0 0 18px;color:#4f5b69;font-size:15px;line-height:1.6;">Someone created an account on Georgia Senior Link and was admitted to the app.</p>
      <table style="width:100%;border-collapse:collapse;border-top:1px solid #e5e7eb;">
        <tr><td style="padding:8px 0;border-bottom:1px solid #e5e7eb;color:#4f5b69;font-size:14px;">Name</td><td style="padding:8px 0;border-bottom:1px solid #e5e7eb;color:#27323f;font-size:14px;font-weight:700;text-align:right;">${escapeHtml(name || "Not provided")}</td></tr>
        <tr><td style="padding:8px 0;border-bottom:1px solid #e5e7eb;color:#4f5b69;font-size:14px;">Email</td><td style="padding:8px 0;border-bottom:1px solid #e5e7eb;color:#27323f;font-size:14px;font-weight:700;text-align:right;">${escapeHtml(email)}</td></tr>
        <tr><td style="padding:8px 0;border-bottom:1px solid #e5e7eb;color:#4f5b69;font-size:14px;">Sign-in method</td><td style="padding:8px 0;border-bottom:1px solid #e5e7eb;color:#27323f;font-size:14px;font-weight:700;text-align:right;">${escapeHtml(method || "Email")}</td></tr>
      </table>
      <p style="margin:20px 0 0;"><a href="${APP_URL}" style="color:#1f3b61;font-size:14px;font-weight:700;">Open Georgia Senior Link</a></p>
    </div>
  </div>
</div>`;

export default async function (req: Request): Promise<Response> {
  try {
    const base44 = createClientFromRequest(req);
    const caller = await base44
      .auth.me()
      .catch((error) => (error?.status === 401 || error?.status === 403 ? null : Promise.reject(error)));
    // Never answer with an error status: this runs inside the signup rule, and a
    // failure there would block the account being created.
    if (!caller || caller.role !== "admin") {
      return Response.json({ ok: false, error: "Not allowed" });
    }

    const body = await req.json().catch(() => ({}));
    const email = String(body?.email ?? "").trim().slice(0, 200);
    if (!email) return Response.json({ ok: false, error: "email is required" }, { status: 400 });

    const name = String(body?.full_name ?? "").trim().slice(0, 120);
    const method = String(body?.auth_method ?? "").trim().slice(0, 40);

    // Sent after the response so a mail problem can never block the signup.
    waitUntil(
      base44.asServiceRole.integrations.Core.SendEmail({
        to: OWNER_EMAIL,
        subject: `New signup: ${name || email}`,
        html: buildHtml({ name, email, method }),
        category: "transactional",
      }).catch(() => {}),
    );

    return Response.json({ ok: true });
  } catch (error) {
    return Response.json({ ok: false, error: error?.message ?? "failed" }, { status: 200 });
  }
}