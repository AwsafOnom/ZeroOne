import {
  useMutation,
  useQuery,
  useQueryClient,
  type UseMutationResult,
  type UseQueryResult,
} from "@tanstack/react-query";
import type {
  ApiAssistantChatMessage,
  ApiAssistantChatResponse,
  ApiActivity,
  ApiActivityClaim,
  ApiActivityFreeze,
  ApiAiFeedback,
  ApiCommunity,
  ApiChallenge,
  ApiDashboardSummary,
  ApiEvent,
  ApiHealthCondition,
  ApiImpactEvent,
  ApiLifestyleHabit,
  ApiOnggiState,
  ApiOnggi,
  ApiPagination,
  ApiPost,
  ApiReflection,
  ApiSquadAssignment,
  ApiCreateReflectionResponse,
  ApiJournalAbout,
  ApiJourneyStage,
  ApiNotification,
  ApiNotificationsResponse,
  ApiPeerStory,
  ApiHealingChainOverview,
  ApiSpark,
  ApiSquad,
  ApiRecoveryCycle,
  ApiCycleCrystallization,
  ApiSquadHealth,
  ApiSquadInsights,
  ApiSquadMatchup,
  ApiSquadMemberContribution,
  ApiWellnessAssessment,
  AuthSession,
} from "@zeroone/shared";
import { requestJson } from "../lib/api";

interface QueryAuthOptions {
  token?: string;
  enabled?: boolean;
}

interface Collection<T> {
  [key: string]: T[] | ApiPagination;
  pagination: ApiPagination;
}

function queryEnabled({ enabled, token }: QueryAuthOptions): boolean {
  return (enabled ?? true) && Boolean(token);
}

export function useSession(options: QueryAuthOptions): UseQueryResult<AuthSession> {
  return useQuery({
    queryKey: ["auth", "session", options.token],
    queryFn: () => requestJson<AuthSession>("/api/v1/auth/session", { token: options.token }),
    enabled: queryEnabled(options),
  });
}

export function useDashboardSummary(
  options: QueryAuthOptions,
): UseQueryResult<{ summary: ApiDashboardSummary | null }> {
  return useQuery({
    queryKey: ["dashboard", "summary", options.token],
    queryFn: () =>
      requestJson<{ summary: ApiDashboardSummary | null }>("/api/v1/dashboard/summary", {
        token: options.token,
      }),
    enabled: queryEnabled(options),
  });
}

export function useProfile(options: QueryAuthOptions): UseQueryResult<{ user: AuthSession["user"] }> {
  return useQuery({
    queryKey: ["users", "me", options.token],
    queryFn: () => requestJson<{ user: AuthSession["user"] }>("/api/v1/users/me", { token: options.token }),
    enabled: queryEnabled(options),
  });
}

interface ProfileUpdate {
  name?: string;
  role?: "INDIVIDUAL" | "PROFESSIONAL";
  gender?: string;
  dateOfBirth?: string;
  heightCm?: number;
  weightKg?: number;
}

export function useUpdateProfile(): UseMutationResult<
  { user: AuthSession["user"] },
  Error,
  ProfileUpdate & { token?: string }
> {
  return useMutation({
    mutationFn: ({ token, ...body }) =>
      requestJson<{ user: AuthSession["user"] }>("/api/v1/users/me", {
        method: "PATCH",
        token,
        body,
      }),
  });
}

export function useConditions(options: QueryAuthOptions): UseQueryResult<{ conditions: ApiHealthCondition[] }> {
  return useQuery({
    queryKey: ["onboarding", "conditions", options.token],
    queryFn: () =>
      requestJson<{ conditions: ApiHealthCondition[] }>("/api/v1/onboarding/conditions", {
        token: options.token,
      }),
    enabled: queryEnabled(options),
  });
}

export function useSaveConditions(): UseMutationResult<
  { conditions: Array<{ id: string }> },
  Error,
  { token?: string; conditionIds: string[]; primaryConditionId: string }
> {
  return useMutation({
    mutationFn: ({ token, conditionIds, primaryConditionId }) =>
      requestJson<{ conditions: Array<{ id: string }> }>("/api/v1/users/me/conditions", {
        method: "PUT",
        token,
        body: { conditionIds, primaryConditionId },
      }),
  });
}

export function useAssessment(options: QueryAuthOptions): UseQueryResult<{
  assessment: ApiWellnessAssessment | null;
}> {
  return useQuery({
    queryKey: ["onboarding", "assessment", options.token],
    queryFn: () =>
      requestJson<{ assessment: ApiWellnessAssessment | null }>("/api/v1/onboarding/assessment", {
        token: options.token,
      }),
    enabled: queryEnabled(options),
  });
}

export function useSaveAssessment(): UseMutationResult<
  { assessment: ApiWellnessAssessment },
  Error,
  { token?: string; responses: Record<string, string>; status?: "DRAFT" | "COMPLETED" }
> {
  return useMutation({
    mutationFn: ({ token, ...body }) =>
      requestJson<{ assessment: ApiWellnessAssessment }>("/api/v1/onboarding/assessment", {
        method: "PUT",
        token,
        body,
      }),
  });
}

export function useHabits(options: QueryAuthOptions): UseQueryResult<{ habits: ApiLifestyleHabit[] }> {
  return useQuery({
    queryKey: ["onboarding", "habits", options.token],
    queryFn: () =>
      requestJson<{ habits: ApiLifestyleHabit[] }>("/api/v1/onboarding/habits", {
        token: options.token,
      }),
    enabled: queryEnabled(options),
  });
}

export function useSaveHabits(): UseMutationResult<
  { habits: ApiLifestyleHabit[] },
  Error,
  { token?: string; habits: Array<{ type: "SMOKING" | "ALCOHOL" | "DRUG_USE"; frequency: "NEVER" | "OCCASIONALLY" | "REGULARLY" }> }
> {
  return useMutation({
    mutationFn: ({ token, habits }) =>
      requestJson<{ habits: ApiLifestyleHabit[] }>("/api/v1/onboarding/habits", {
        method: "PUT",
        token,
        body: { habits },
      }),
  });
}

export function useAssignSquad(): UseMutationResult<
  ApiSquadAssignment,
  Error,
  { token?: string }
> {
  return useMutation({
    mutationFn: ({ token }) =>
      requestJson<ApiSquadAssignment>("/api/v1/onboarding/assignment", {
        method: "POST",
        token,
        body: {},
      }),
  });
}

export function useActivities(
  options: QueryAuthOptions & { category?: string; scope?: string },
): UseQueryResult<{ activities: ApiActivity[] }> {
  const params = new URLSearchParams();
  if (options.category) params.set("category", options.category);
  if (options.scope) params.set("scope", options.scope);
  const suffix = params.toString() ? `?${params.toString()}` : "";

  return useQuery({
    queryKey: ["activities", options.token, options.category, options.scope],
    queryFn: () =>
      requestJson<{ activities: ApiActivity[] }>(`/api/v1/activities${suffix}`, {
        token: options.token,
      }),
    enabled: queryEnabled(options),
  });
}

export function useSquad(options: QueryAuthOptions): UseQueryResult<{ squad: ApiSquad }> {
  return useQuery({
    queryKey: ["squad", options.token],
    queryFn: () => requestJson<{ squad: ApiSquad }>("/api/v1/squads/me", { token: options.token }),
    enabled: queryEnabled(options),
  });
}

export function useRecoveryCycle(
  options: QueryAuthOptions,
): UseQueryResult<{ cycle: ApiRecoveryCycle }> {
  return useQuery({
    queryKey: ["recovery-cycle", options.token],
    queryFn: () =>
      requestJson<{ cycle: ApiRecoveryCycle }>("/api/v1/squads/me/cycle", { token: options.token }),
    enabled: queryEnabled(options),
  });
}

export function useSquadHealth(
  options: QueryAuthOptions,
): UseQueryResult<{ health: ApiSquadHealth }> {
  return useQuery({
    queryKey: ["squad", "health", options.token],
    queryFn: () =>
      requestJson<{ health: ApiSquadHealth }>("/api/v1/squads/me/health", { token: options.token }),
    enabled: queryEnabled(options),
  });
}

export function useSquadInsights(
  options: QueryAuthOptions,
): UseQueryResult<{ insights: ApiSquadInsights }> {
  return useQuery({
    queryKey: ["squad", "insights", options.token],
    queryFn: () =>
      requestJson<{ insights: ApiSquadInsights }>("/api/v1/squads/me/insights", { token: options.token }),
    enabled: queryEnabled(options),
  });
}

export function useMemberContributions(
  options: QueryAuthOptions,
): UseQueryResult<{ members: ApiSquadMemberContribution[] }> {
  return useQuery({
    queryKey: ["squad", "contributions", options.token],
    queryFn: () =>
      requestJson<{ members: ApiSquadMemberContribution[] }>("/api/v1/squads/me/contributions", {
        token: options.token,
      }),
    enabled: queryEnabled(options),
  });
}

export function useSquadMatchup(
  options: QueryAuthOptions,
): UseQueryResult<{ matchup: ApiSquadMatchup }> {
  return useQuery({
    queryKey: ["squad", "matchup", options.token],
    queryFn: () =>
      requestJson<{ matchup: ApiSquadMatchup }>("/api/v1/squads/me/matchup", { token: options.token }),
    enabled: queryEnabled(options),
  });
}

export function useCrystallization(
  options: QueryAuthOptions,
): UseQueryResult<{ crystallization: ApiCycleCrystallization }> {
  return useQuery({
    queryKey: ["squad", "crystallization", options.token],
    queryFn: () =>
      requestJson<{ crystallization: ApiCycleCrystallization }>("/api/v1/squads/me/crystallization", {
        token: options.token,
      }),
    enabled: queryEnabled(options),
  });
}

export function useOnggis(options: QueryAuthOptions): UseQueryResult<{ onggis: ApiOnggi[] }> {
  return useQuery({
    queryKey: ["onggis", options.token],
    queryFn: () =>
      requestJson<{ onggis: ApiOnggi[] }>("/api/v1/squads/me/onggis", { token: options.token }),
    enabled: queryEnabled(options),
  });
}

export function useChallenges(
  options: QueryAuthOptions,
): UseQueryResult<{ challenges: ApiChallenge[] }> {
  return useQuery({
    queryKey: ["squad", "challenges", options.token],
    queryFn: () =>
      requestJson<{ challenges: ApiChallenge[] }>("/api/v1/squads/me/challenges", {
        token: options.token,
      }),
    enabled: queryEnabled(options),
  });
}

export function useImpactFeed(
  options: QueryAuthOptions & { limit?: number; offset?: number },
): UseQueryResult<{ events: ApiImpactEvent[]; pagination: ApiPagination }> {
  const limit = options.limit ?? 20;
  const offset = options.offset ?? 0;
  return useQuery({
    queryKey: ["impact-feed", options.token, limit, offset],
    queryFn: () =>
      requestJson<{ events: ApiImpactEvent[]; pagination: ApiPagination }>(
        `/api/v1/squads/me/impact-feed?limit=${limit}&offset=${offset}`,
        { token: options.token },
      ),
    enabled: queryEnabled(options),
  });
}

export function useHealingChain(
  options: QueryAuthOptions,
): UseQueryResult<ApiHealingChainOverview> {
  return useQuery({
    queryKey: ["healing-chain", options.token],
    queryFn: () =>
      requestJson<ApiHealingChainOverview>("/api/v1/healing-chain", {
        token: options.token,
      }),
    enabled: queryEnabled(options),
  });
}

export function useSparks(
  options: QueryAuthOptions & { limit?: number; offset?: number },
): UseQueryResult<{ sparks: ApiSpark[]; receivedPoints: number; pagination: ApiPagination }> {
  const limit = options.limit ?? 20;
  const offset = options.offset ?? 0;
  return useQuery({
    queryKey: ["sparks", options.token, limit, offset],
    queryFn: () =>
      requestJson<{ sparks: ApiSpark[]; receivedPoints: number; pagination: ApiPagination }>(
        `/api/v1/healing-chain/sparks?limit=${limit}&offset=${offset}`,
        { token: options.token },
      ),
    enabled: queryEnabled(options),
  });
}

export function useReflections(
  options: QueryAuthOptions & { limit?: number; offset?: number },
): UseQueryResult<{ reflections: ApiReflection[]; pagination: ApiPagination }> {
  const limit = options.limit ?? 20;
  const offset = options.offset ?? 0;
  return useQuery({
    queryKey: ["journal", "reflections", options.token, limit, offset],
    queryFn: () =>
      requestJson<{ reflections: ApiReflection[]; pagination: ApiPagination }>(
        `/api/v1/journal/reflections?limit=${limit}&offset=${offset}`,
        { token: options.token },
      ),
    enabled: queryEnabled(options),
  });
}

export function useSharedStories(
  options: QueryAuthOptions & { limit?: number; offset?: number },
): UseQueryResult<{ stories: ApiPeerStory[]; pagination: ApiPagination }> {
  const limit = options.limit ?? 20;
  const offset = options.offset ?? 0;
  return useQuery({
    queryKey: ["journal", "stories", options.token, limit, offset],
    queryFn: () =>
      requestJson<{ stories: ApiPeerStory[]; pagination: ApiPagination }>(
        `/api/v1/journal/stories?limit=${limit}&offset=${offset}`,
        { token: options.token },
      ),
    enabled: queryEnabled(options),
  });
}

export function usePeerStoryMatches(
  options: QueryAuthOptions & { emotionalTags: string[]; enabled?: boolean },
): UseQueryResult<{ stories: ApiPeerStory[] }> {
  return useQuery({
    queryKey: ["journal", "peer-stories", options.token, options.emotionalTags],
    queryFn: () =>
      requestJson<{ stories: ApiPeerStory[] }>("/api/v1/journal/peer-stories/match", {
        method: "POST",
        token: options.token,
        body: { emotionalTags: options.emotionalTags },
      }),
    enabled: queryEnabled(options) && (options.enabled ?? true) && options.emotionalTags.length > 0,
  });
}

export function useJourneyTimeline(
  options: QueryAuthOptions,
): UseQueryResult<{ stages: ApiJourneyStage[] }> {
  return useQuery({
    queryKey: ["journal", "journey", options.token],
    queryFn: () => requestJson<{ stages: ApiJourneyStage[] }>("/api/v1/journal/journey", { token: options.token }),
    enabled: queryEnabled(options),
  });
}

export function useJournalAbout(options: QueryAuthOptions): UseQueryResult<ApiJournalAbout> {
  return useQuery({
    queryKey: ["journal", "about", options.token],
    queryFn: () => requestJson<ApiJournalAbout>("/api/v1/journal/about", { token: options.token }),
    enabled: queryEnabled(options),
  });
}

export function useCommunities(
  options: QueryAuthOptions & { conditionId?: string },
): UseQueryResult<{ communities: ApiCommunity[] }> {
  const suffix = options.conditionId ? `?conditionId=${encodeURIComponent(options.conditionId)}` : "";
  return useQuery({
    queryKey: ["communities", options.token, options.conditionId],
    queryFn: () =>
      requestJson<{ communities: ApiCommunity[] }>(`/api/v1/community${suffix}`, {
        token: options.token,
      }),
    enabled: queryEnabled(options),
  });
}

export function usePosts(
  communityId: string,
  options: QueryAuthOptions & { limit?: number; offset?: number },
): UseQueryResult<{ posts: ApiPost[]; pagination: ApiPagination }> {
  const limit = options.limit ?? 20;
  const offset = options.offset ?? 0;
  return useQuery({
    queryKey: ["community", communityId, "posts", options.token, limit, offset],
    queryFn: () =>
      requestJson<{ posts: ApiPost[]; pagination: ApiPagination }>(
        `/api/v1/community/${encodeURIComponent(communityId)}/posts?limit=${limit}&offset=${offset}`,
        { token: options.token },
      ),
    enabled: queryEnabled(options) && Boolean(communityId),
  });
}

export function useEvents(
  communityId: string,
  options: QueryAuthOptions & { limit?: number; offset?: number },
): UseQueryResult<{ events: ApiEvent[]; pagination: ApiPagination }> {
  const limit = options.limit ?? 20;
  const offset = options.offset ?? 0;
  return useQuery({
    queryKey: ["community", communityId, "events", options.token, limit, offset],
    queryFn: () =>
      requestJson<{ events: ApiEvent[]; pagination: ApiPagination }>(
        `/api/v1/community/${encodeURIComponent(communityId)}/events?limit=${limit}&offset=${offset}`,
        { token: options.token },
      ),
    enabled: queryEnabled(options) && Boolean(communityId),
  });
}

interface ActivityMutationVariables {
  id: string;
  token?: string;
}

export function useClaimActivity(): UseMutationResult<
  { claim: ApiActivityClaim },
  Error,
  ActivityMutationVariables
> {
  return useMutation({
    mutationFn: ({ id, token }) =>
      requestJson<{ claim: ApiActivityClaim }>(`/api/v1/activities/${encodeURIComponent(id)}/claim`, {
        method: "POST",
        token,
      }),
  });
}

export function useCompleteActivity(): UseMutationResult<
  { claim: ApiActivityClaim; onggiState: ApiOnggiState },
  Error,
  ActivityMutationVariables
> {
  return useMutation({
    mutationFn: ({ id, token }) =>
      requestJson<{ claim: ApiActivityClaim; onggiState: ApiOnggiState }>(
        `/api/v1/activity-claims/${encodeURIComponent(id)}/complete`,
        {
          method: "POST",
          token,
        },
      ),
  });
}

export function useAbandonActivity(): UseMutationResult<
  { abandonedClaim: ApiActivityClaim; freeze: ApiActivityFreeze },
  Error,
  ActivityMutationVariables
> {
  return useMutation({
    mutationFn: ({ id, token }) =>
      requestJson<{ abandonedClaim: ApiActivityClaim; freeze: ApiActivityFreeze }>(
        `/api/v1/activity-claims/${encodeURIComponent(id)}/abandon`,
        {
          method: "POST",
          token,
        },
      ),
  });
}

interface CreateReflectionVariables {
  token?: string;
  bodyText: string;
  moodTags?: string[];
  emotionalTags?: string[];
  isPrivate?: boolean;
  shareAsStory?: boolean;
}

export function useCreateReflection(): UseMutationResult<
  ApiCreateReflectionResponse,
  Error,
  CreateReflectionVariables
> {
  return useMutation({
    mutationFn: ({ token, ...body }) =>
      requestJson<ApiCreateReflectionResponse>("/api/v1/journal/reflections", {
        method: "POST",
        token,
        body,
      }),
  });
}

export function useRequestAiFeedback(): UseMutationResult<
  { feedback: ApiAiFeedback },
  Error,
  ActivityMutationVariables
> {
  return useMutation({
    mutationFn: ({ id, token }) =>
      requestJson<{ feedback: ApiAiFeedback }>(
        `/api/v1/journal/reflections/${encodeURIComponent(id)}/ai-feedback`,
        { method: "POST", token },
      ),
  });
}

interface SendSparkVariables {
  token?: string;
  recipientId: string;
  kind: string;
  mentorshipLinkId?: string;
}

export function useSendSpark(): UseMutationResult<{ spark: ApiSpark }, Error, SendSparkVariables> {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ token, ...body }) =>
      requestJson<{ spark: ApiSpark }>("/api/v1/healing-chain/sparks", {
        method: "POST",
        token,
        body,
      }),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["healing-chain"] });
      void queryClient.invalidateQueries({ queryKey: ["sparks"] });
    },
  });
}

interface JoinChallengeVariables {
  token?: string;
  id: string;
}

export function useJoinChallenge(): UseMutationResult<
  { joined: boolean; challengeId: string },
  Error,
  JoinChallengeVariables
> {
  return useMutation({
    mutationFn: ({ id, token }) =>
      requestJson<{ joined: boolean; challengeId: string }>(
        `/api/v1/squads/me/challenges/${encodeURIComponent(id)}/join`,
        { method: "POST", token },
      ),
  });
}

interface CreatePostVariables {
  token?: string;
  communityId: string;
  bodyText: string;
}

export function useCreatePost(): UseMutationResult<
  { post: ApiPost },
  Error,
  CreatePostVariables
> {
  return useMutation({
    mutationFn: ({ token, communityId, bodyText }) =>
      requestJson<{ post: ApiPost }>(
        `/api/v1/community/${encodeURIComponent(communityId)}/posts`,
        { method: "POST", token, body: { bodyText } },
      ),
  });
}

interface AttendEventVariables {
  token?: string;
  id: string;
}

export function useAttendEvent(): UseMutationResult<
  { attending: boolean; eventId: string },
  Error,
  AttendEventVariables
> {
  return useMutation({
    mutationFn: ({ id, token }) =>
      requestJson<{ attending: boolean; eventId: string }>(
        `/api/v1/community/events/${encodeURIComponent(id)}/attend`,
        { method: "POST", token },
      ),
  });
}

interface AssistantChatVariables {
  token?: string;
  messages: ApiAssistantChatMessage[];
}

export function useAssistantChat(): UseMutationResult<ApiAssistantChatResponse, Error, AssistantChatVariables> {
  return useMutation({
    mutationFn: ({ token, messages }) =>
      requestJson<ApiAssistantChatResponse>("/api/v1/assistant/chat", {
        method: "POST",
        token,
        body: { messages },
      }),
  });
}

export function useNotifications(
  options: QueryAuthOptions & { limit?: number },
): UseQueryResult<ApiNotificationsResponse> {
  const limit = options.limit ?? 20;
  return useQuery({
    queryKey: ["notifications", options.token, limit],
    queryFn: () =>
      requestJson<ApiNotificationsResponse>(`/api/v1/notifications?limit=${limit}`, {
        token: options.token,
      }),
    enabled: queryEnabled(options),
  });
}

export function useMarkNotificationsRead(): UseMutationResult<
  ApiNotificationsResponse,
  Error,
  { token?: string; ids?: string[]; all?: boolean }
> {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ token, ids, all }) =>
      requestJson<ApiNotificationsResponse>("/api/v1/notifications/read", {
        method: "PATCH",
        token,
        body: { ids, all },
      }),
    onSuccess: (_data, variables) => {
      void queryClient.invalidateQueries({ queryKey: ["notifications", variables.token] });
      void queryClient.invalidateQueries({ queryKey: ["auth", "session", variables.token] });
    },
  });
}

export type ApiCollection<T> = Collection<T>;
