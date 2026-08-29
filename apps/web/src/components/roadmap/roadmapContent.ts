export const ROADMAP_SCREENSHOT_VERSION = "3";

export interface RoadmapFeature {
  slug: string;
  title: string;
  description: string;
  plannedItems: string[];
}

export const roadmapFeatures: Record<string, RoadmapFeature> = {
  "explore-map": {
    slug: "explore-map",
    title: "Explore Map",
    description:
      "Explore Map surfaces nearby healing spaces with real-time air quality and Smart Check-In for Pulse Points. Peer-curated Community Suggestions help you find places that have worked for others on a similar path.",
    plannedItems: [
      "Interactive map of healing spaces near you",
      "Real-time air quality overlays",
      "Smart Check-In for Pulse Points",
      "Community Suggestions from peers",
    ],
  },
  "learn-news": {
    slug: "learn-news",
    title: "Learn & News",
    description:
      "Learn & News brings geo-tagged health alerts, structured lessons, and a Global Health Situation Map into one feed. Build a seven-day learning streak and test what you learn with quizzes linked from articles.",
    plannedItems: [
      "Geo-tagged health alerts for your area",
      "Structured lesson library with streak tracking",
      "Global Health Situation Map",
      "Article-linked quizzes",
    ],
  },
  "diet-advice": {
    slug: "diet-advice",
    title: "Diet Advice",
    description:
      "Diet Advice tracks five macros, generates AI meal plans, and supports barcode scanning for quick logging. Meal detail pages show Best Time To Eat guidance, alternatives, and a path to dietitian consultation.",
    plannedItems: [
      "Five-macro daily tracking",
      "AI-generated meal plans",
      "Barcode food scanner",
      "Meal detail with timing and alternatives",
      "Dietitian consultation booking",
    ],
  },
  rewards: {
    slug: "rewards",
    title: "Rewards",
    description:
      "Rewards turn every healthy action into Pulse Points you can redeem for real value. Level titles mark your progress, with health-aligned redemptions such as telehealth consultations and nutrition store credit.",
    plannedItems: [
      "Pulse Points for healthy actions",
      "Level titles and progress milestones",
      "Today's Activities (steps, water, active minutes)",
      "Telehealth and nutrition store redemptions",
    ],
  },
  "talk-to-doctor": {
    slug: "talk-to-doctor",
    title: "Talk to Doctor",
    description:
      "Talk to Doctor connects you with verified professionals for guided sessions, Q&A, and care that complements your squad recovery. Live sessions include Guided Yoga, Caregiver Training, and Virtual Support Groups.",
    plannedItems: [
      "Verified professional directory",
      "Secure messaging and session booking",
      "Live Q&A and guided sessions",
      "Caregiver training and support groups",
    ],
  },
  community: {
    slug: "community",
    title: "Community",
    description:
      "Community brings condition-specific channels, a peer post feed, and verified professional-led events into one place. Join live sessions — Q&A, Guided Yoga, Caregiver Training, and Virtual Support Groups — without leaving ZeroOne.",
    plannedItems: [
      "Condition-specific discussion channels",
      "Peer post feed with reactions",
      "Verified professional-led events",
      "Live session calendar and reminders",
    ],
  },
  "global-resonance": {
    slug: "global-resonance",
    title: "Global Resonance",
    description:
      "Global Resonance is a live world map showing active Onggi Guardians across continents. See stories shared today, the platform's Healing Impact level, and a weekly Vibration Trend chart of aggregate squad activity.",
    plannedItems: [
      "Live teal world map of active squads",
      "Stories shared today counter",
      "Healing Impact level indicator",
      "Weekly Vibration Trend chart",
    ],
  },
  "chain-chat": {
    slug: "chain-chat",
    title: "Chain Chat",
    description:
      "Chain Chat is encrypted real-time messaging between you and your mentor or mentee. It keeps healing conversations private, separate from squad channels, and available whenever your chain connection is active.",
    plannedItems: [
      "End-to-end encrypted mentor/mentee messaging",
      "Real-time delivery and read receipts",
      "Session scheduling from chat",
      "Crisis-aware safety routing",
    ],
  },
};

export const roadmapRoutes = [
  { path: "/explore-map", slug: "explore-map" },
  { path: "/learn-news", slug: "learn-news" },
  { path: "/learn-news/diet-advice", slug: "diet-advice" },
  { path: "/rewards", slug: "rewards" },
  { path: "/talk-to-doctor", slug: "talk-to-doctor" },
  { path: "/community", slug: "community" },
  { path: "/healing-chain/chain-chat", slug: "chain-chat" },
  { path: "/chat", slug: "chain-chat" },
] as const;
