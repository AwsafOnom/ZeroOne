import {
  crisisSupportContent,
  formatCrisisSupportResponse,
  type CrisisSupportContent,
} from "@zeroone/shared";

export type { CrisisSupportContent };
export { crisisSupportContent, formatCrisisSupportResponse };

const crisisPatterns = [
  /\b(kill|hurt|harm)\s+myself\b/i,
  /\bend\s+my\s+life\b/i,
  /\bwant\s+to\s+die\b/i,
  /\bwish\s+i\s+(?:was|were)\s+dead\b/i,
  /\b(?:don't|do not)\s+want\s+to\s+(?:be\s+alive|live)\b/i,
  /\bno\s+reason\s+to\s+live\b/i,
  /\bbetter\s+off\s+dead\b/i,
  /\bsuicid(?:e|al)\b/i,
  /\bself[\s-]?harm\b/i,
  /\bcut(?:ting)?\s+myself\b/i,
  /\boverdose\b/i,
  /\bcan't\s+go\s+on\b/i,
  /\b(?:give|giving)\s+up\s+on\s+life\b/i,
];

export function detectCrisisLanguage(bodyText: string): boolean {
  const normalized = bodyText.trim();
  if (!normalized) {
    return false;
  }

  return crisisPatterns.some((pattern) => pattern.test(normalized));
}
