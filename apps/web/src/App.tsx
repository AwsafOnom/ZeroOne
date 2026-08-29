import { BrowserRouter, Navigate, Outlet, Route, Routes, useLocation } from "react-router-dom";
import { useSession } from "./api";
import { AuthPage } from "./components/auth/AuthPages";
import { DashboardPage } from "./components/dashboard/DashboardPage";
import { AppLayout } from "./components/layout";
import {
  ConditionsPage,
  HabitsPage,
  ProfilePage,
  ReviewPage,
  RolePage,
  WellnessPage,
} from "./components/onboarding/OnboardingPages";
import { PlaceholderPage } from "./components/PlaceholderPage";
import { PrimitiveShowcase } from "./components/PrimitiveShowcase";
import { ActivitiesPage, RecoveryPage } from "./components/recovery/RecoveryPage";
import { CrystallizeOnggiPage } from "./components/recovery/CrystallizeOnggiPage";
import { HealingJournalAboutPage } from "./components/journal/HealingJournalAboutPage";
import { HealingJournalPage } from "./components/journal/HealingJournalPage";
import { HealingChainPage } from "./components/healing-chain/HealingChainPage";
import { HealingChainMenteePage, HealingChainMentorPage } from "./components/healing-chain/HealingChainProfileRoutes";
import { AiAssistantPage } from "./components/assistant";
import { NotificationsPage } from "./components/notifications";
import { RoadmapPage, roadmapFeatures, roadmapRoutes } from "./components/roadmap";
import { SettingsPage } from "./components/settings";
import { HowItWorksPage } from "./components/recovery/HowItWorksPage";
import { OnggiGuardianPage } from "./components/recovery/OnggiGuardianPage";
import { SquadDetailsPage } from "./components/recovery/SquadDetailsPage";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { AssistantProvider } from "./context/AssistantContext";

interface ScreenRoute {
  path: string;
  name: string;
}

const roadmapPaths = new Set<string>(roadmapRoutes.map(({ path }) => path));

const scopedRoutes: ScreenRoute[] = [
  { path: "/dashboard", name: "Dashboard" },
  { path: "/recovery", name: "Recovery" },
  { path: "/healing-chain", name: "Healing Chain" },
  { path: "/healing-journal", name: "Healing Journal" },
];

const inventoryPlaceholderRoutes: ScreenRoute[] = [
  { path: "/auth/login", name: "Log In" },
  { path: "/auth/choose-role", name: "Choose Your Role" },
  { path: "/auth/choose-role/compact", name: "Choose Your Role" },
  { path: "/auth/choose-role/signup", name: "Account Creation" },
  { path: "/auth/choose-role/signup/wide", name: "Account Creation" },
  { path: "/auth/otp", name: "OTP Verification" },
  { path: "/auth/otp/variant-2", name: "OTP Verification" },
  { path: "/auth/otp/variant-3", name: "OTP Verification" },
  { path: "/auth/mental-health-conditions", name: "Mental Health Conditions" },
  { path: "/auth/otp/variant-4", name: "OTP Verification" },
  { path: "/auth/otp/variant-5", name: "OTP Verification" },
  { path: "/auth/otp-2", name: "OTP Verification" },
  { path: "/auth/unnamed", name: "Authentication" },
  { path: "/auth/otp-3", name: "OTP Verification" },
  { path: "/auth/otp-4", name: "OTP Verification" },
  { path: "/auth/otp-additional", name: "OTP Verification" },
  { path: "/onboarding/mental-health-conditions", name: "Mental Health Conditions" },
  { path: "/talk-to-doctor", name: "Talk to Doctor" },
  { path: "/doctors", name: "Doctors" },
  { path: "/chat", name: "Chat" },
  { path: "/ai-assistant", name: "AI Assistant" },
  { path: "/notifications", name: "Notification" },
  { path: "/dashboard/variant", name: "Dashboard" },
  { path: "/recovery/onggi-guardian", name: "Onggi Guardian" },
  { path: "/recovery/variant-2", name: "Recovery" },
  { path: "/recovery/variant-3", name: "Recovery" },
  { path: "/recovery/variant-4", name: "Recovery" },
  { path: "/community/variant-2", name: "Community" },
  { path: "/community/variant-3", name: "Community" },
  { path: "/community/variant-4", name: "Community" },
  { path: "/healing-chain/mentor", name: "Your Mentor" },
  { path: "/healing-chain/mentee", name: "Your Mentee" },
  { path: "/healing-chain/variant", name: "Healing Chain" },
  { path: "/healing-journal/variant-2", name: "Healing Journal" },
  { path: "/healing-journal/variant-3", name: "Healing Journal" },
  { path: "/physical-health", name: "Physical Health" },
  { path: "/explore-map", name: "Explore Map" },
  { path: "/explore-map/hospital", name: "Hospital" },
  { path: "/explore-map/hospital/variant-2", name: "Hospital" },
  { path: "/explore-map/hospital/variant-3", name: "Hospital" },
  { path: "/learn-news", name: "Learn & News" },
  { path: "/learning", name: "Learning" },
  { path: "/learn-news/diet-advice", name: "Diet Advice" },
  { path: "/learn-news/meal-details", name: "Meal Details" },
  { path: "/learn-news/news", name: "News" },
  { path: "/rewards", name: "Reward" },
  { path: "/rewards/variant", name: "Reward" },
  { path: "/help", name: "Help" },
  { path: "/help/getting-started", name: "Getting Started" },
  { path: "/help/getting-started/variant-2", name: "Getting Started" },
  { path: "/settings", name: "Settings" },
  { path: "/settings/profile", name: "Settings" },
  { path: "/settings/password", name: "Settings" },
  { path: "/settings/notifications", name: "Settings" },
  { path: "/settings/privacy", name: "Settings" },
  { path: "/settings/terms", name: "Settings" },
  { path: "/settings/about", name: "Settings" },
];

function RoadmapRoute({ slug }: { slug: string }) {
  const feature = roadmapFeatures[slug];
  if (!feature) {
    return <PlaceholderPage screenName="This feature" />;
  }
  return <RoadmapPage feature={feature} />;
}

function PlaceholderRoute({ name }: { name: string }) {
  return <PlaceholderPage screenName={name} />;
}

function RouteStatus({ message }: { message: string }) {
  return (
    <main className="flex min-h-screen items-center justify-center bg-surface-default px-[var(--space-page-inline)] font-body text-text-primary">
      <p className="text-body-lg text-text-secondary">{message}</p>
    </main>
  );
}

const onboardingPaths = {
  role: "/onboarding/role",
  profile: "/onboarding/profile",
  conditions: "/onboarding/conditions",
  wellness: "/onboarding/wellness",
  habits: "/onboarding/habits",
  review: "/onboarding/review",
  assignment: "/onboarding/review",
} as const;

function RequireAuth() {
  const location = useLocation();
  const { status, token, user } = useAuth();
  const session = useSession({ enabled: Boolean(token && user), token });

  if (status === "loading" || (user && token && session.isLoading)) {
    return <RouteStatus message="Loading your ZeroOne session…" />;
  }
  if (!user || !token) {
    return <Navigate replace state={{ from: location.pathname }} to="/auth/login" />;
  }
  if (session.isError) {
    return <RouteStatus message={session.error.message} />;
  }
  if (location.pathname.startsWith("/dashboard") && session.data?.onboarding.nextStep !== "complete") {
    const nextPath = onboardingPaths[session.data?.onboarding.nextStep ?? "role"] ?? onboardingPaths.role;
    return <Navigate replace to={nextPath} />;
  }
  return <Outlet />;
}

export function App() {
  return (
    <AuthProvider>
      <AssistantProvider>
        <BrowserRouter>
        <Routes>
          <Route element={<Navigate replace to="/dashboard" />} path="/" />
          <Route element={<PrimitiveShowcase />} path="/dev/primitives" />

          <Route element={<Navigate replace to="/auth/login" />} path="/auth" />
          <Route element={<AuthPage mode="login" />} path="/auth/login" />
          <Route element={<AuthPage mode="signup" />} path="/auth/signup" />
          <Route element={<Navigate replace to="/dashboard" />} path="/auth/logout" />

          <Route element={<RequireAuth />}>
            <Route element={<RolePage />} path="/onboarding/role" />
            <Route element={<ProfilePage />} path="/onboarding/profile" />
            <Route element={<ConditionsPage />} path="/onboarding/conditions" />
            <Route element={<ConditionsPage />} path="/onboarding/mental-health-conditions" />
            <Route element={<WellnessPage />} path="/onboarding/wellness" />
            <Route element={<HabitsPage />} path="/onboarding/habits" />
            <Route element={<ReviewPage />} path="/onboarding/review" />

            <Route element={<AppLayout />}>
              <Route element={<DashboardPage />} path="/dashboard" />
              <Route element={<RecoveryPage />} path="/recovery">
                <Route element={<Navigate replace to="activities" />} index />
                <Route element={<ActivitiesPage />} path="activities" />
                <Route element={<OnggiGuardianPage />} path="onggi-guardian" />
                <Route element={<SquadDetailsPage />} path="squad-details" />
                <Route element={<CrystallizeOnggiPage />} path="crystallize-onggi" />
                <Route element={<HowItWorksPage />} path="how-it-works" />
                <Route element={<RoadmapRoute slug="global-resonance" />} path="global-resonance" />
              </Route>
              <Route element={<HealingJournalPage />} path="/healing-journal" />
              <Route element={<HealingJournalAboutPage />} path="/healing-journal/about" />
              <Route element={<HealingChainPage />} path="/healing-chain" />
              <Route element={<HealingChainMentorPage />} path="/healing-chain/mentor" />
              <Route element={<HealingChainMenteePage />} path="/healing-chain/mentee" />
              <Route element={<AiAssistantPage />} path="/ai-assistant" />
              <Route element={<NotificationsPage />} path="/notifications" />
              <Route element={<SettingsPage />} path="/settings" />
              {roadmapRoutes.map(({ path, slug }) => (
                <Route element={<RoadmapRoute slug={slug} />} key={path} path={path} />
              ))}
              {scopedRoutes.map(({ name, path }) => (
                path !== "/dashboard" && path !== "/recovery" && path !== "/healing-journal" && path !== "/healing-chain" && (
                  <Route element={<PlaceholderRoute name={name} />} key={path} path={path} />
                )
              ))}
              {inventoryPlaceholderRoutes
                .filter(
                  ({ path }) =>
                    !path.startsWith("/auth/") &&
                    !path.startsWith("/onboarding/") &&
                    !path.startsWith("/recovery/") &&
                    path !== "/ai-assistant" &&
                    path !== "/notifications" &&
                    !roadmapPaths.has(path),
                )
                .map(({ name, path }) => (
                  <Route element={<PlaceholderRoute name={name} />} key={path} path={path} />
                ))}
              <Route element={<PlaceholderPage screenName="This screen" />} path="*" />
            </Route>
          </Route>
        </Routes>
      </BrowserRouter>
      </AssistantProvider>
    </AuthProvider>
  );
}
