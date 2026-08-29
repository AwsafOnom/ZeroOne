import {
  activeLinkBetweenUsersWhere,
  isSparkRecipientOnLink,
  resolveSparkLinkFromCandidates,
  type MentorshipLinkParties,
} from "../src/services/sparkMentorshipLink.js";

let failed = false;

function assert(condition: boolean, message: string) {
  if (!condition) {
    console.error(`FAIL: ${message}`);
    failed = true;
  } else {
    console.log(`ok: ${message}`);
  }
}

const dualRoleUser = "user-both";
const mentorA = "mentor-a";
const menteeB = "mentee-b";

const links: MentorshipLinkParties[] = [
  { id: "link-as-mentor", mentorId: dualRoleUser, menteeId: menteeB, status: "ACTIVE" },
  { id: "link-as-mentee", mentorId: mentorA, menteeId: dualRoleUser, status: "ACTIVE" },
  { id: "inactive-link", mentorId: dualRoleUser, menteeId: "other", status: "ENDED" },
];

// Sending to mentee while user is mentor on that link
const toMentee = resolveSparkLinkFromCandidates(links, dualRoleUser, menteeB);
assert(toMentee?.id === "link-as-mentor", "resolves mentor→mentee link");

// Sending to mentor while user is mentee on that link
const toMentor = resolveSparkLinkFromCandidates(links, dualRoleUser, mentorA);
assert(toMentor?.id === "link-as-mentee", "resolves mentee→mentor link");

// Old findFirst behavior would return link-as-mentor for both directions
assert(toMentee?.id !== toMentor?.id, "both directions resolve to different links");

const whereToMentee = activeLinkBetweenUsersWhere(dualRoleUser, menteeB);
assert(
  JSON.stringify(whereToMentee) ===
    JSON.stringify({
      status: "ACTIVE",
      OR: [
        { mentorId: dualRoleUser, menteeId: menteeB },
        { mentorId: menteeB, menteeId: dualRoleUser },
      ],
    }),
  "where-clause matches sender/recipient pair",
);

assert(
  isSparkRecipientOnLink(toMentee!, dualRoleUser, menteeB),
  "mentee is valid recipient on mentor link",
);
assert(
  isSparkRecipientOnLink(toMentor!, dualRoleUser, mentorA),
  "mentor is valid recipient on mentee link",
);
assert(
  !isSparkRecipientOnLink(toMentee!, dualRoleUser, mentorA),
  "wrong recipient rejected on mentor link",
);
assert(
  !isSparkRecipientOnLink(toMentor!, dualRoleUser, menteeB),
  "wrong recipient rejected on mentee link",
);
assert(!isSparkRecipientOnLink(toMentee!, dualRoleUser, dualRoleUser), "self-spark rejected");

if (failed) {
  process.exit(1);
}

console.log("\nAll spark recipient matching checks passed.");
