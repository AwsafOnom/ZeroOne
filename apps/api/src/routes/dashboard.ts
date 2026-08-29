import { Router } from "express";
import { getPrisma } from "../db.js";
import { asyncHandler } from "../http.js";
import { requireAuth, currentUser } from "../auth/middleware.js";

export const dashboardRouter = Router();
dashboardRouter.use(requireAuth);

dashboardRouter.get(
  "/dashboard/summary",
  asyncHandler(async (request, response) => {
    const prisma = getPrisma();
    const summary = await prisma.dailyHealthSummary.findFirst({
      where: { userId: currentUser(request).id },
      orderBy: { summaryDate: "desc" },
    });
    response.json({ summary });
  }),
);
