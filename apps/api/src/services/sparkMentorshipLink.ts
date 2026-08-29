export interface MentorshipLinkParties {
  id: string;
  mentorId: string;
  menteeId: string;
  status: string;
}

/** Prisma where-clause for an active link between sender and recipient. */
export function activeLinkBetweenUsersWhere(senderId: string, recipientId: string) {
  return {
    status: "ACTIVE" as const,
    OR: [
      { mentorId: senderId, menteeId: recipientId },
      { mentorId: recipientId, menteeId: senderId },
    ],
  };
}

export function isSparkRecipientOnLink(
  link: Pick<MentorshipLinkParties, "mentorId" | "menteeId">,
  senderId: string,
  recipientId: string,
): boolean {
  if (recipientId === senderId) {
    return false;
  }

  return recipientId === link.mentorId || recipientId === link.menteeId;
}

/** Pick the link that matches sender + recipient when mentorshipLinkId is omitted. */
export function resolveSparkLinkFromCandidates(
  links: MentorshipLinkParties[],
  senderId: string,
  recipientId: string,
): MentorshipLinkParties | null {
  const match = links.find(
    (link) =>
      link.status === "ACTIVE" &&
      ((link.mentorId === senderId && link.menteeId === recipientId) ||
        (link.mentorId === recipientId && link.menteeId === senderId)),
  );
  return match ?? null;
}
