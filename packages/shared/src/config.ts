export const ZEROONE_CONFIG = {
  squadSize: 8,
  cycleLengthDays: 28,
  activityFreezeHours: 6,
  dailyDoublePointsActivities: 4,
  dailyActivityGridSize: 12,
  sparkPoints: {
    encouragement: 10,
    voiceSupport: 20,
    guidance: 20,
  },
  lanternIgnitionThreshold: 1000,
  onggiDimensions: 5,
  peerStoriesPerReflection: 3,
  aiFeedbackResponsesPerReflection: 3,
} as const;

export type ZeroOneConfig = typeof ZEROONE_CONFIG;
