import { Router } from "express";
import { z } from "zod";
import { asyncHandler, parse } from "../http.js";
import { requireAuth } from "../auth/middleware.js";
import { userIdFrom } from "./helpers.js";
import {
  attachReadState,
  listNotificationRecords,
  markNotificationsRead,
} from "../services/notifications.js";

const listQuerySchema = z
  .object({
    limit: z.coerce.number().int().min(1).max(50).default(20),
  })
  .passthrough();

const markReadSchema = z
  .object({
    ids: z.array(z.string().min(1).max(120)).optional(),
    all: z.boolean().optional(),
  })
  .strict()
  .refine((body) => body.all || (body.ids?.length ?? 0) > 0, {
    message: "Provide notification ids or set all to true.",
    path: ["ids"],
  });

export const notificationsRouter = Router();
notificationsRouter.use(requireAuth);

notificationsRouter.get(
  "/notifications",
  asyncHandler(async (request, response) => {
    const { limit } = parse(listQuerySchema, request.query);
    const userId = userIdFrom(request);
    const notifications = await listNotificationRecords(userId, limit);
    const withReadState = await attachReadState(userId, notifications);
    const unreadCount = withReadState.filter((notification) => !notification.read).length;

    response.json({
      notifications: withReadState,
      unreadCount,
    });
  }),
);

notificationsRouter.patch(
  "/notifications/read",
  asyncHandler(async (request, response) => {
    const body = parse(markReadSchema, request.body);
    const userId = userIdFrom(request);
    await markNotificationsRead(userId, { ids: body.ids, all: body.all });

    const notifications = await listNotificationRecords(userId, 20);
    const withReadState = await attachReadState(userId, notifications);
    const unreadCount = withReadState.filter((notification) => !notification.read).length;

    response.json({
      notifications: withReadState,
      unreadCount,
    });
  }),
);
