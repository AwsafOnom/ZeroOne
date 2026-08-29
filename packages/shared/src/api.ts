export interface ApiUserCondition {
  id: string;
  name: string;
  slug: string;
  category: string;
  diagnosedAt: string | null;
  isPrimary: boolean;
}

export interface ApiHealthCondition {
  id: string;
  name: string;
  slug: string;
  category: string;
}

export interface ApiUser {
  id: string;
  firebaseUid: string;
  name: string | null;
  email: string | null;
  role: string | null;
  avatarUrl: string | null;
  gender: string | null;
  dateOfBirth: string | null;
  heightCm: number | null;
  weightKg: number | null;
  journeyStartDate: string | null;
  conditions?: ApiUserCondition[];
}

export type OnboardingStep =
  | "role"
  | "profile"
  | "conditions"
  | "wellness"
  | "habits"
  | "review"
  | "assignment"
  | "complete";

export interface ApiOnboardingStatus {
  roleCompleted: boolean;
  profileCompleted: boolean;
  conditionsCompleted: boolean;
  wellnessCompleted: boolean;
  habitsCompleted: boolean;
  assigned: boolean;
  nextStep: OnboardingStep;
}

export interface AuthSession {
  user: ApiUser;
  unreadNotifications: number;
  onboarding: ApiOnboardingStatus;
}

export interface ApiDashboardSummary {
  id: string;
  summaryDate: string;
  sleepMinutes: number | null;
  sleepGoalMinutes: number | null;
  waterGlasses: number | null;
  waterGoalGlasses: number | null;
  caloriesConsumed: number | null;
  calorieGoal: number | null;
}

export interface ApiWellnessAssessment {
  id: string;
  status: string;
  responses: Record<string, unknown>;
  completedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface ApiLifestyleHabit {
  id: string;
  type: string;
  frequency: string;
}

export interface ApiSquadAssignment {
  status: "ASSIGNED";
  conditionId: string;
  squad: ApiSquad | null;
}

export interface ApiActivity {
  id: string;
  title: string;
  description: string;
  points: number;
  category: string;
  scope: string;
  isActive: boolean;
  currentClaim?: ApiActivityClaim | null;
  freeze?: ApiActivityFreeze | null;
}

export interface ApiActivityClaim {
  id: string;
  userId: string;
  activityId: string;
  cycleId: string | null;
  claimDate: string;
  claimedAt: string;
  completedAt: string | null;
  status: string;
  activity?: ApiActivity;
}

export interface ApiActivityFreeze {
  id: string;
  userId: string;
  activityId: string;
  startedAt: string;
  expiresAt: string;
}

export interface ApiOnggiState {
  breathingExercise: number;
  breathingVeins: number;
  warmth: number;
  circulation: number;
  harmony: number;
  resonanceScore: number;
}

export interface ApiRecoveryCycle {
  id: string;
  squadId: string;
  cycleDays: number;
  cycleDay: number;
  startDate: string;
  endDate: string;
  state: string;
  onggiState: ApiOnggiState | null;
}

export interface ApiOnggi {
  id: string;
  cycleId: string;
  name: string;
  theme: string;
  description: string;
  dateRangeStart: string;
  dateRangeEnd: string;
  activityCount: number;
  finalResonanceScore: number;
  createdAt: string;
  timeCapsuleContributionCount: number;
}

export interface ApiSquadMember {
  id: string;
  name: string | null;
  avatarUrl: string | null;
  condition: { id: string; name: string; slug: string; category: string };
  status: string;
  joinedAt: string | null;
}

export interface ApiSquad {
  id: string;
  name: string;
  maxMembers: number;
  members: ApiSquadMember[];
}

export interface ApiSquadHealth {
  activitiesCompleted: number;
  activitiesGoal: number;
  collectivePoints: number;
  pointsToday: number;
  activeMembers: number;
  maxMembers: number;
}

export interface ApiSquadInsights {
  synchronizationPercent: number;
  currentStreakDays: number;
  bestStreakDays: number;
  engagementLast7Days: number;
  resonanceGainToday: number;
  rank: number;
  totalSquads: number;
  stabilityPercent: number;
}

export interface ApiSquadMemberContribution {
  id: string;
  name: string | null;
  avatarUrl: string | null;
  condition: { id: string; name: string; slug: string; category: string };
  status: string;
  weeklyProgress: number;
  completedActivities: number;
}

export interface ApiSquadMatchupSide {
  squad: ApiSquad | null;
  cycle: ApiRecoveryCycle | null;
}

export interface ApiSquadMatchup {
  yourSquad: ApiSquadMatchupSide;
  opponentSquad: ApiSquadMatchupSide;
  insights: ApiSquadInsights;
  health: ApiSquadHealth;
}

export interface ApiTimeCapsuleContribution {
  id: string;
  cycleId: string;
  onggiId: string | null;
  userId: string;
  type: string;
  caption: string | null;
  createdAt: string;
  contributor: { id: string; name: string | null; avatarUrl: string | null } | null;
}

export interface ApiCycleCrystallization {
  cycle: ApiRecoveryCycle;
  daysRemaining: number;
  contributions: ApiTimeCapsuleContribution[];
  crystallizedOnggis: ApiOnggi[];
}

export interface ApiChallenge {
  id: string;
  squadId: string;
  kind: string;
  title: string;
  description: string;
  points: number;
  participantCount: number;
  deadline: string;
  createdAt: string;
  joined: boolean;
}

export interface ApiPagination {
  limit: number;
  offset: number;
  returned: number;
}

export interface ApiImpactMetricChange {
  metric: string;
  delta: number;
}

export interface ApiImpactEvent {
  id: string;
  squadId: string;
  cycleId: string | null;
  activityClaimId?: string | null;
  activityCategory: string;
  metric: string;
  delta: number;
  metrics: ApiImpactMetricChange[];
  message: string;
  occurredAt: string;
  actor: { id: string; name: string | null; avatarUrl: string | null } | null;
  activity: ApiActivity | null;
}

export interface ApiReflection {
  id: string;
  bodyText: string;
  moodTags: string[];
  emotionalTags: string[];
  isPrivate: boolean;
  createdAt: string;
  updatedAt: string;
  aiFeedback?: ApiAiFeedback[];
}

export interface ApiAiFeedback {
  id: string;
  reflectionId: string;
  model: string;
  responseText: string;
  createdAt: string;
  kind?: "reflection" | "crisis" | "unavailable" | "fallback";
}

export interface ApiPeerStory {
  id: string;
  anonymizedBody: string;
  emotionalTags: string[];
}

export interface ApiSharedStory extends ApiPeerStory {
  createdAt?: string;
}

export interface ApiJourneyStage {
  stage: string;
  label: string;
  occurredAt: string | null;
  isComplete: boolean;
  isCurrent: boolean;
}

export interface ApiCreateReflectionResponse {
  reflection: ApiReflection;
  aiFeedback: ApiAiFeedback | null;
  aiFeedbackStatus: "ready" | "crisis" | "unavailable" | "failed";
  peerStories: ApiPeerStory[];
}

export type ApiAssistantChatStatus = "ready" | "crisis" | "unavailable" | "failed";

export interface ApiAssistantChatMessage {
  role: "user" | "assistant";
  content: string;
}

export interface ApiAssistantChatResponse {
  status: ApiAssistantChatStatus;
  message: ApiAssistantChatMessage | null;
  model: string | null;
  errorMessage?: string;
}

export interface ApiJournalAbout {
  banner: string;
  principles: Array<{ title: string; description: string }>;
}

export interface ApiCommunity {
  id: string;
  conditionId: string;
  memberCount: number;
  condition: { id: string; name: string; slug: string; category: string };
}

export interface ApiPost {
  id: string;
  communityId: string;
  authorUserId: string | null;
  author?: { id: string; name: string | null; avatarUrl: string | null } | null;
  bodyText: string;
  createdAt: string;
  updatedAt: string;
}

export interface ApiEvent {
  id: string;
  communityId: string;
  hostUserId: string;
  title: string;
  description: string;
  startsAt: string;
  mode: string;
  attendeeCount: number;
  createdAt: string;
}

export interface ApiSpark {
  id: string;
  senderId: string;
  recipientId: string;
  mentorshipLinkId: string | null;
  points: number;
  createdAt: string;
  action: { kind: string; points: number };
}

export interface ApiHealingChainProfile {
  bio: string | null;
  specialization: string | null;
  isAvailable: boolean;
  preferredCommunicationStyle: string | null;
}

export interface ApiHealingChainPerson {
  id: string;
  name: string | null;
  avatarUrl: string | null;
  journeyStartDate: string | null;
  primaryCondition: { id: string; name: string; slug: string } | null;
  profile: ApiHealingChainProfile | null;
}

export interface ApiMentorshipSession {
  id: string;
  startsAt: string;
  status: string;
}

export interface ApiHealingChainConnection {
  linkId: string;
  status: string;
  condition: { id: string; name: string; slug: string };
  person: ApiHealingChainPerson;
  upcomingSession: ApiMentorshipSession | null;
}

export interface ApiSparkAction {
  id: string;
  kind: string;
  points: number;
  label: string;
  description: string;
}

export interface ApiSparkProgress {
  receivedPoints: number;
  threshold: number;
  remainingPoints: number;
  progressPercent: number;
  isIgnited: boolean;
}

export interface ApiHealingImpact {
  peopleSupported: number;
  encouragementsSent: number;
  voiceSessions: number;
  guidanceShared: number;
}

export interface ApiLanternArtifact {
  id: string;
  cycleId: string;
  emotionalGrowth: number;
  supportGiven: number;
  consistencyPercent: number;
  compassionActsPercent: number;
  isForming: boolean;
}

export type ApiHealingChainConnectionStatus = "connected" | "partial" | "unmatched";

export interface ApiHealingChainOverview {
  banner: string;
  connectionStatus: ApiHealingChainConnectionStatus;
  mentor: ApiHealingChainConnection | null;
  mentee: ApiHealingChainConnection | null;
  links: Array<Record<string, unknown>>;
  sparkActions: ApiSparkAction[];
  sparkProgress: ApiSparkProgress;
  healingImpact: ApiHealingImpact;
  lantern: ApiLanternArtifact | null;
  journeyStages: ApiJourneyStage[];
}

export type ApiNotificationType = "IMPACT" | "CHALLENGE_DEADLINE";

export interface ApiNotification {
  id: string;
  type: ApiNotificationType;
  title: string;
  body: string;
  timestamp: string;
  href: string;
  read: boolean;
}

export interface ApiNotificationsResponse {
  notifications: ApiNotification[];
  unreadCount: number;
}
