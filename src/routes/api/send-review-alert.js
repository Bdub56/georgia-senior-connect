import { createFileRoute } from "@tanstack/react-router";
import { requireUserRoute } from "@/lib/auth-middleware";
import { notifyCuratorsOfReview } from "@/lib/notify.server";

export const Route = createFileRoute("/api/send-review-alert")({
  server: {
    middleware: [requireUserRoute],
    handlers: {
      POST: async ({ request, context }) => {
        if (context.user?.role !== "admin") {
          return Response.json({ error: "Forbidden" }, { status: 403 });
        }
        const body = await request.json().catch(() => ({}));
        const result = await notifyCuratorsOfReview(context.getBase44(), body?.data ?? {});
        return Response.json(result);
      },
    },
  },
});