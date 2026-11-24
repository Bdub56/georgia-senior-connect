export default function FooterLegal() {
  return (
    <div className="wrap border-t border-border/70 py-6">
      <div className="mb-5 rounded-2xl border border-[#f7cbb0] bg-[#fde8db] p-4 sm:p-5">
        <p className="text-[0.85rem] leading-relaxed text-[#7c2d12]">
          <span className="font-bold uppercase tracking-[0.12em]">Beta version: </span>
          Georgia Senior Link is a beta release and is not yet fully functional. The directory,
          search, needs matching, and reviews are still being tested and built out, so some
          features may be incomplete, change without notice, or stop working for a time, and some
          listings may be missing, out of date, or awaiting verification. Use the site as a
          starting point for your own research, and always confirm details directly with the
          provider before you act on them.
        </p>
      </div>
      <p className="text-[0.82rem] leading-relaxed text-muted-foreground">
        <span className="font-bold uppercase tracking-[0.12em] text-foreground">Disclaimer: </span>
        Georgia Senior Link is an informational directory only. Listings, phone numbers, eligibility
        rules, and costs change, and a listing here is not an endorsement or a referral. Nothing on
        this site is medical, legal, financial, or benefits advice. Confirm every detail with the
        provider or a qualified professional before you apply, travel, or make a decision. This site
        is not operated by the State of Georgia or any government agency. If someone is in immediate
        danger, call 911.
      </p>
      <p className="mt-4 text-sm text-muted-foreground">
        &copy; 2026 Bryan L. Williams, PhD. All rights reserved.
      </p>
    </div>
  );
}