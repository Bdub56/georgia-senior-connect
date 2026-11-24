import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireUser } from "@/lib/auth-middleware";
import { CATEGORIES, COST_TYPES, NEEDS, zipToCounties } from "@/lib/georgia-data";

const MAX_SERVICES = 400;

const adminOnly = (user) => {
  if (!user || user.role !== "admin") {
    throw Object.assign(new Error("Only curators can change the directory."), { status: 403 });
  }
};

const matchesTerm = (service, term) => {
  const haystack = [
    service.name,
    service.description,
    service.category,
    service.keywords,
    service.eligibility,
    service.notes,
    ...(service.counties || []),
    service.region,
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();
  return haystack.includes(term);
};

const byRating = (a, b) => (b.editor_rating || 0) - (a.editor_rating || 0) || a.name.localeCompare(b.name);

export const listServices = createServerFn({ method: "GET" })
  .validator(
    z.object({
      q: z.string().max(120).optional(),
      category: z.string().max(80).optional(),
      county: z.string().max(80).optional(),
      limit: z.number().min(1).max(MAX_SERVICES).optional(),
    }),
  )
  .handler(async ({ data, context }) => {
    const base44 = context.getBase44();
    const filter = {};
    if (data.category) filter.category = data.category;
    if (data.county) {
      filter.$or = [{ counties: data.county }, { counties: "Statewide" }];
    }

    const page = await base44.entities.Service.filter(filter, { limit: MAX_SERVICES, sort: "-editor_rating" });
    let services = page.items || [];

    const term = (data.q || "").trim();
    const zipCounties = /^\d{5}$/.test(term) ? zipToCounties(term) : [];
    if (zipCounties.length) {
      services = services.filter((service) => {
        const counties = service.counties || [];
        return counties.includes("Statewide") || counties.some((county) => zipCounties.includes(county));
      });
    } else if (term) {
      services = services.filter((service) => matchesTerm(service, term.toLowerCase()));
    }

    services.sort(byRating);
    if (data.limit) services = services.slice(0, data.limit);
    return services;
  });

export const getServiceDetail = createServerFn({ method: "GET" })
  .validator(z.object({ id: z.string().min(1).max(120) }))
  .handler(async ({ data, context }) => {
    const base44 = context.getBase44();
    const service = await base44.entities.Service.get(data.id).catch((error) => {
      if (error?.status === 404) return null;
      throw error;
    });
    if (!service) return null;

    const page = await base44.entities.Review.filter({ service_id: data.id }, { limit: 100, sort: "-created_date" });
    const reviews = page.items || [];
    const reviewCount = reviews.length;
    const average = reviewCount
      ? reviews.reduce((total, review) => total + (Number(review.stars) || 0), 0) / reviewCount
      : 0;

    return { service, reviews, reviewCount, average };
  });

export const saveReview = createServerFn({ method: "POST" })
  .middleware([requireUser])
  .validator(
    z.object({
      service_id: z.string().min(1).max(120),
      stars: z.number().int().min(1).max(5),
      body: z.string().max(1500).optional(),
      author_role: z.string().max(60).optional(),
    }),
  )
  .handler(async ({ data, context }) => {
    const base44 = context.getBase44();
    const service = await base44.entities.Service.get(data.service_id);
    if (!service) {
      throw Object.assign(new Error("That service is no longer listed."), { status: 404 });
    }

    const existing = await base44.entities.Review.filter(
      { service_id: data.service_id, created_by_id: context.user.id },
      { limit: 1 },
    );

    const payload = {
      service_id: data.service_id,
      service_name: service.name,
      stars: data.stars,
      body: (data.body || "").trim(),
      author_name: context.user.full_name || "Community member",
      author_role: data.author_role || "Senior or family",
    };

    if (existing.items?.length) {
      return base44.entities.Review.update(existing.items[0].id, payload);
    }
    return base44.entities.Review.create(payload);
  });

export const deleteReview = createServerFn({ method: "POST" })
  .middleware([requireUser])
  .validator(z.object({ id: z.string().min(1).max(120) }))
  .handler(async ({ data, context }) => {
    const base44 = context.getBase44();
    const review = await base44.entities.Review.get(data.id);
    if (review.created_by_id !== context.user.id && context.user.role !== "admin") {
      throw Object.assign(new Error("You can only remove your own review."), { status: 403 });
    }
    await base44.entities.Review.delete(data.id);
    return { success: true };
  });

export const listReviews = createServerFn({ method: "GET" })
  .validator(z.object({ limit: z.number().min(1).max(200).optional() }).optional())
  .handler(async ({ data, context }) => {
    const base44 = context.getBase44();
    const page = await base44.entities.Review.filter({}, { limit: data?.limit || 40, sort: "-created_date" });
    return page.items || [];
  });

const serviceInput = z.object({
  name: z.string().min(2).max(180),
  category: z.enum(CATEGORIES),
  description: z.string().max(2000).optional(),
  counties: z.array(z.string().max(80)).max(200).optional(),
  region: z.string().max(160).optional(),
  phone: z.string().max(60).optional(),
  phone_alt: z.string().max(60).optional(),
  website: z.string().max(400).optional(),
  address: z.string().max(300).optional(),
  hours: z.string().max(200).optional(),
  eligibility: z.string().max(1200).optional(),
  cost_type: z.enum(COST_TYPES).optional(),
  waitlist: z.boolean().optional(),
  waitlist_note: z.string().max(800).optional(),
  notes: z.string().max(1600).optional(),
  keywords: z.string().max(500).optional(),
  editor_rating: z.number().min(0).max(5).optional(),
});

export const saveService = createServerFn({ method: "POST" })
  .middleware([requireUser])
  .validator(serviceInput.extend({ id: z.string().max(120).optional() }))
  .handler(async ({ data, context }) => {
    adminOnly(context.user);
    const base44 = context.getBase44();
    const { id, ...fields } = data;

    if (id) {
      return base44.entities.Service.update(id, fields);
    }
    return base44.entities.Service.create(fields);
  });

export const deleteService = createServerFn({ method: "POST" })
  .middleware([requireUser])
  .validator(z.object({ id: z.string().min(1).max(120) }))
  .handler(async ({ data, context }) => {
    adminOnly(context.user);
    const base44 = context.getBase44();
    await base44.entities.Service.delete(data.id);
    return { success: true };
  });

export const matchServices = createServerFn({ method: "POST" })
  .validator(
    z.object({
      county: z.string().max(80).optional(),
      age: z.string().max(40).optional(),
      needs: z.array(z.string().max(40)).max(12),
    }),
  )
  .handler(async ({ data, context }) => {
    const base44 = context.getBase44();
    const wantedCategories = NEEDS.filter((need) => data.needs.includes(need.id)).map((need) => need.category);
    const page = await base44.entities.Service.filter({}, { limit: MAX_SERVICES, sort: "-editor_rating" });
    const all = page.items || [];

    const services = all
      .filter((service) => wantedCategories.includes(service.category))
      .filter((service) => {
        if (!data.county) return true;
        const counties = service.counties || [];
        return counties.includes("Statewide") || counties.includes(data.county);
      })
      .sort(byRating)
      .slice(0, 12);

    const tips = [];
    if (data.county) {
      tips.push(`Call the Area Agency on Aging that covers ${data.county} County through the ADRC line, 1-866-552-4464, to confirm waitlists before applying.`);
    }
    if (data.needs.includes("food") && data.age === "60 to 64") {
      tips.push("Senior SNAP now requires every household member to be 65 or older. If the person is 60 to 64, apply for regular SNAP instead.");
    }
    if (data.needs.includes("food")) {
      tips.push("SNAP, a monthly CSFP food box, and seasonal farmers market coupons can be combined, so apply for each one.");
    }
    if (data.needs.includes("bills")) {
      tips.push("Households with someone 65+ get a one-month head start on LIHEAP applications. Apply through the Community Action Agency for the county, not DFCS.");
    }
    if (data.needs.includes("homecare")) {
      tips.push("CCSP and SOURCE are service models inside the same Elderly and Disabled Waiver. Ask for a functional screening now, because the waitlist is ordered by urgency.");
    }
    if (data.needs.includes("legal")) {
      tips.push("If there is immediate danger, call 911. Otherwise Adult Protective Services takes reports 24 hours a day at 1-866-552-4464.");
    }
    if (data.needs.includes("rides")) {
      tips.push("Medicaid rides through Verida must be requested 3 to 30 business days ahead, so book as soon as the appointment is scheduled.");
    }
    tips.push("Bring photo ID, Social Security award letters, proof of Georgia residency, and recent income statements to every intake call.");

    return { services, tips };
  });