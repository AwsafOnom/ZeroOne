import type { NextFunction, Request, RequestHandler, Response } from "express";
import { verifyFirebaseIdToken } from "./firebase.js";
import { getPrisma } from "../db.js";
import { HttpError } from "../http.js";

export interface RequestUser {
  id: string;
  firebaseUid: string;
  email: string | null;
  name: string | null;
}

declare global {
  namespace Express {
    interface Request {
      authUser?: RequestUser;
    }
  }
}

async function resolveAuthenticatedUser(decoded: {
  uid: string;
  email?: string;
  name?: string;
  picture?: string;
}) {
  const prisma = getPrisma();
  const byFirebaseUid = await prisma.user.findUnique({
    where: { firebaseUid: decoded.uid },
  });
  if (byFirebaseUid) {
    return byFirebaseUid;
  }

  const email = decoded.email?.trim().toLowerCase();
  if (email) {
    const byEmail = await prisma.user.findUnique({
      where: { email },
    });
    if (byEmail) {
      return prisma.user.update({
        where: { id: byEmail.id },
        data: {
          firebaseUid: decoded.uid,
          name: byEmail.name ?? decoded.name ?? null,
          avatarUrl: byEmail.avatarUrl ?? decoded.picture ?? null,
        },
      });
    }
  }

  return prisma.user.create({
    data: {
      firebaseUid: decoded.uid,
      email: email ?? null,
      name: decoded.name ?? null,
      avatarUrl: decoded.picture ?? null,
    },
  });
}

export const requireAuth: RequestHandler = async (
  request: Request,
  _response: Response,
  next: NextFunction,
) => {
  try {
    const header = request.header("authorization");
    const token = header?.startsWith("Bearer ") ? header.slice("Bearer ".length).trim() : "";

    if (!token) {
      throw new HttpError(401, "A Firebase bearer token is required.");
    }

    const decoded = await verifyFirebaseIdToken(token);
    const user = await resolveAuthenticatedUser(decoded);

    request.authUser = {
      id: user.id,
      firebaseUid: user.firebaseUid,
      email: user.email,
      name: user.name,
    };
    next();
  } catch (error) {
    next(error instanceof HttpError ? error : new HttpError(401, "Invalid Firebase bearer token."));
  }
};

export function currentUser(request: Request): RequestUser {
  if (!request.authUser) {
    throw new HttpError(401, "Authentication is required.");
  }

  return request.authUser;
}
