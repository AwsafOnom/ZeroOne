import { Router } from "express";
import { z } from "zod";
import { getPrisma } from "../db.js";
import { asyncHandler, conflict, notFound, parse } from "../http.js";
import { requireAuth } from "../auth/middleware.js";
import { pageQuery, userIdFrom } from "./helpers.js";

const idSchema = z.object({ id: z.string().min(1).max(120) }).strict();
const postSchema = z.object({ bodyText: z.string().trim().min(1).max(10_000) }).strict();
const commentSchema = z.object({ bodyText: z.string().trim().min(1).max(5_000) }).strict();
const reactionSchema = z.object({ type: z.enum(["SUPPORT", "LOVE", "CELEBRATE", "INSIGHTFUL"]) }).strict();
const eventSchema = z
  .object({
    title: z.string().trim().min(1).max(200),
    description: z.string().trim().min(1).max(10_000),
    startsAt: z.coerce.date(),
    mode: z.enum(["ONLINE", "OFFLINE"]),
  })
  .strict();
const communityQuerySchema = z
  .object({ conditionId: z.string().min(1).max(120).optional() })
  .strict();

async function accessibleCommunity(communityId: string, userId: string) {
  const prisma = getPrisma();
  const community = await prisma.community.findFirst({
    where: {
      id: communityId,
      condition: { users: { some: { userId } } },
    },
    include: { condition: true },
  });

  return community ?? notFound("Community not found.");
}

export const communityRouter = Router();
communityRouter.use(requireAuth);

communityRouter.get(
  "/community",
  asyncHandler(async (request, response) => {
    const query = parse(communityQuerySchema, request.query);
    const prisma = getPrisma();
    const communities = await prisma.community.findMany({
      where: {
        conditionId: query.conditionId,
        condition: { users: { some: { userId: userIdFrom(request) } } },
      },
      include: { condition: true },
      orderBy: { memberCount: "desc" },
    });

    response.json({ communities });
  }),
);

communityRouter.get(
  "/community/:id",
  asyncHandler(async (request, response) => {
    const { id } = parse(idSchema, request.params);
    const community = await accessibleCommunity(id, userIdFrom(request));
    response.json({ community });
  }),
);

communityRouter.get(
  "/community/:id/posts",
  asyncHandler(async (request, response) => {
    const { id } = parse(idSchema, request.params);
    const { limit, offset } = pageQuery(request.query);
    await accessibleCommunity(id, userIdFrom(request));
    const prisma = getPrisma();
    const posts = await prisma.post.findMany({
      where: { communityId: id },
      orderBy: { createdAt: "desc" },
      skip: offset,
      take: limit,
      include: {
        author: { select: { id: true, name: true, avatarUrl: true } },
        comments: {
          orderBy: { createdAt: "asc" },
          include: { author: { select: { id: true, name: true, avatarUrl: true } } },
        },
        _count: { select: { reactions: true } },
      },
    });

    response.json({ posts, pagination: { limit, offset, returned: posts.length } });
  }),
);

communityRouter.post(
  "/community/:id/posts",
  asyncHandler(async (request, response) => {
    const { id } = parse(idSchema, request.params);
    const body = parse(postSchema, request.body);
    await accessibleCommunity(id, userIdFrom(request));
    const prisma = getPrisma();
    const post = await prisma.post.create({
      data: { communityId: id, authorUserId: userIdFrom(request), bodyText: body.bodyText },
    });

    response.status(201).json({ post });
  }),
);

communityRouter.post(
  "/community/posts/:id/comments",
  asyncHandler(async (request, response) => {
    const { id: postId } = parse(idSchema, request.params);
    const body = parse(commentSchema, request.body);
    const prisma = getPrisma();
    const post = await prisma.post.findUnique({ where: { id: postId } });
    if (!post) {
      return notFound("Post not found.");
    }
    await accessibleCommunity(post.communityId, userIdFrom(request));
    const comment = await prisma.comment.create({
      data: {
        postId,
        communityId: post.communityId,
        authorUserId: userIdFrom(request),
        bodyText: body.bodyText,
      },
    });

    response.status(201).json({ comment });
  }),
);

communityRouter.post(
  "/community/posts/:id/reactions",
  asyncHandler(async (request, response) => {
    const { id: postId } = parse(idSchema, request.params);
    const body = parse(reactionSchema, request.body);
    const prisma = getPrisma();
    const post = await prisma.post.findUnique({ where: { id: postId } });
    if (!post) {
      return notFound("Post not found.");
    }
    await accessibleCommunity(post.communityId, userIdFrom(request));
    const existing = await prisma.reaction.findFirst({
      where: { postId, userId: userIdFrom(request), type: body.type },
    });
    if (existing) {
      return conflict("Reaction already exists.");
    }
    const reaction = await prisma.reaction.create({
      data: { postId, userId: userIdFrom(request), type: body.type },
    });

    response.status(201).json({ reaction });
  }),
);

communityRouter.get(
  "/community/:id/events",
  asyncHandler(async (request, response) => {
    const { id } = parse(idSchema, request.params);
    const { limit, offset } = pageQuery(request.query);
    await accessibleCommunity(id, userIdFrom(request));
    const prisma = getPrisma();
    const events = await prisma.event.findMany({
      where: { communityId: id },
      orderBy: { startsAt: "asc" },
      skip: offset,
      take: limit,
      include: { host: { select: { id: true, name: true, avatarUrl: true } } },
    });

    response.json({ events, pagination: { limit, offset, returned: events.length } });
  }),
);

communityRouter.post(
  "/community/:id/events",
  asyncHandler(async (request, response) => {
    const { id } = parse(idSchema, request.params);
    const body = parse(eventSchema, request.body);
    await accessibleCommunity(id, userIdFrom(request));
    const prisma = getPrisma();
    const event = await prisma.event.create({
      data: {
        communityId: id,
        hostUserId: userIdFrom(request),
        title: body.title,
        description: body.description,
        startsAt: body.startsAt,
        mode: body.mode,
      },
    });

    response.status(201).json({ event });
  }),
);

communityRouter.post(
  "/community/events/:id/attend",
  asyncHandler(async (request, response) => {
    const { id } = parse(idSchema, request.params);
    const prisma = getPrisma();
    const event = await prisma.event.findUnique({ where: { id } });
    if (!event) {
      return notFound("Event not found.");
    }
    await accessibleCommunity(event.communityId, userIdFrom(request));
    const existing = await prisma.eventAttendee.findUnique({
      where: { eventId_userId: { eventId: id, userId: userIdFrom(request) } },
    });
    if (existing) {
      return conflict("You are already attending this event.");
    }
    await prisma.$transaction([
      prisma.eventAttendee.create({ data: { eventId: id, userId: userIdFrom(request) } }),
      prisma.event.update({ where: { id }, data: { attendeeCount: { increment: 1 } } }),
    ]);

    response.status(201).json({ attending: true, eventId: id });
  }),
);
