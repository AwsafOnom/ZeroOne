-- CreateEnum
CREATE TYPE "Role" AS ENUM ('INDIVIDUAL', 'PROFESSIONAL');
CREATE TYPE "ConditionCategory" AS ENUM ('PHYSICAL', 'MENTAL', 'NEUROLOGICAL');
CREATE TYPE "HabitType" AS ENUM ('SMOKING', 'ALCOHOL', 'DRUG_USE');
CREATE TYPE "HabitFrequency" AS ENUM ('NEVER', 'OCCASIONALLY', 'REGULARLY');
CREATE TYPE "AssessmentStatus" AS ENUM ('DRAFT', 'COMPLETED');
CREATE TYPE "SquadMembershipStatus" AS ENUM ('INVITED', 'ACTIVE', 'PAUSED', 'LEFT', 'REMOVED');
CREATE TYPE "RecoveryCycleState" AS ENUM ('ACTIVE', 'CRYSTALLIZED');
CREATE TYPE "ActivityCategory" AS ENUM ('PHYSICAL', 'COGNITIVE', 'EMOTIONAL', 'SOCIAL');
CREATE TYPE "ActivityScope" AS ENUM ('INDIVIDUAL', 'SHARED_SOCIAL');
CREATE TYPE "SocialBrainGameKind" AS ENUM ('WORD_PUZZLES', 'MEMORY_SEQUENCES', 'REACTION_TIME', 'OBJECT_TRACKING');
CREATE TYPE "SocialBrainGameStatus" AS ENUM ('SCHEDULED', 'LIVE', 'COMPLETED', 'CANCELLED');
CREATE TYPE "ActivityClaimStatus" AS ENUM ('CLAIMED', 'COMPLETED', 'ABANDONED');
CREATE TYPE "ChallengeKind" AS ENUM ('COOKING', 'SLEEP_NIGHT', 'SUNLIGHT_SESSION', 'RECOVERY_ROOM');
CREATE TYPE "MentorshipStatus" AS ENUM ('PENDING', 'ACTIVE', 'PAUSED', 'ENDED');
CREATE TYPE "MentorshipSessionStatus" AS ENUM ('CONFIRMED', 'COMPLETED', 'CANCELLED');
CREATE TYPE "SparkKind" AS ENUM ('ENCOURAGEMENT', 'VOICE_SUPPORT', 'GUIDANCE');
CREATE TYPE "OnggiName" AS ENUM ('NEW_BEGINNING', 'STRENGTH', 'GROWTH', 'WISDOM');
CREATE TYPE "MetricType" AS ENUM ('BREATHING_EXERCISE', 'BREATHING_VEINS', 'WARMTH', 'CIRCULATION', 'HARMONY');
CREATE TYPE "MoodTag" AS ENUM ('SAD', 'ANXIOUS', 'FRUSTRATED', 'LONELY', 'EXHAUSTED', 'HOPEFUL', 'OTHER');
CREATE TYPE "ReflectionEmotionalTag" AS ENUM ('MISSED_EVENT', 'PAIN_FLARE', 'SOCIAL_ISOLATION', 'IDENTITY_LOSS', 'FATIGUE', 'RELATIONSHIP_STRUGGLE', 'ABANDONED_HOBBIES', 'OTHERS');
CREATE TYPE "MilestoneStage" AS ENUM ('BEFORE_DIAGNOSIS', 'DIAGNOSIS', 'STRUGGLES', 'TURNING_POINT', 'IMPROVEMENT', 'MAINTAINING');
CREATE TYPE "EventMode" AS ENUM ('ONLINE', 'OFFLINE');
CREATE TYPE "ReactionType" AS ENUM ('SUPPORT', 'LOVE', 'CELEBRATE', 'INSIGHTFUL');
CREATE TYPE "TimeCapsuleContributionType" AS ENUM ('PHOTO', 'VOICE_RECORDING', 'SONG', 'MEMORY');

-- CreateTable
CREATE TABLE "platform_configs" (
    "id" TEXT NOT NULL DEFAULT 'default',
    "max_squad_members" INTEGER NOT NULL,
    "recovery_cycle_days" INTEGER NOT NULL,
    "activity_freeze_hours" INTEGER NOT NULL,
    "daily_double_activities" INTEGER NOT NULL,
    "daily_activity_grid_size" INTEGER NOT NULL,
    "encouragement_points" INTEGER NOT NULL,
    "voice_support_points" INTEGER NOT NULL,
    "guidance_points" INTEGER NOT NULL,
    "spark_lantern_threshold" INTEGER NOT NULL,
    "onggi_dimensions" INTEGER NOT NULL,
    "peer_stories_per_reflection" INTEGER NOT NULL,
    "ai_feedback_responses" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "platform_configs_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "firebase_uid" TEXT NOT NULL,
    "name" TEXT,
    "email" TEXT,
    "role" "Role",
    "avatar_url" TEXT,
    "gender" TEXT,
    "date_of_birth" DATE,
    "height_cm" DECIMAL(5,2),
    "weight_kg" DECIMAL(5,2),
    "journey_start_date" DATE,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "health_conditions" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "category" "ConditionCategory" NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "health_conditions_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "user_conditions" (
    "user_id" TEXT NOT NULL,
    "condition_id" TEXT NOT NULL,
    "diagnosed_at" DATE,
    "is_primary" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "user_conditions_pkey" PRIMARY KEY ("user_id", "condition_id")
);

CREATE TABLE "lifestyle_habits" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "type" "HabitType" NOT NULL,
    "frequency" "HabitFrequency" NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "lifestyle_habits_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "wellness_assessments" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "status" "AssessmentStatus" NOT NULL DEFAULT 'DRAFT',
    "responses" JSONB NOT NULL,
    "completed_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "wellness_assessments_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "squads" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "max_members" SMALLINT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "squads_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "squad_memberships" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "squad_id" TEXT NOT NULL,
    "condition_id" TEXT NOT NULL,
    "status" "SquadMembershipStatus" NOT NULL DEFAULT 'INVITED',
    "joined_at" TIMESTAMP(3),
    "left_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "squad_memberships_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "recovery_cycles" (
    "id" TEXT NOT NULL,
    "squad_id" TEXT NOT NULL,
    "cycle_days" INTEGER NOT NULL,
    "cycle_day" INTEGER NOT NULL DEFAULT 1,
    "start_date" DATE NOT NULL,
    "end_date" DATE NOT NULL,
    "state" "RecoveryCycleState" NOT NULL DEFAULT 'ACTIVE',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "recovery_cycles_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "onggi_states" (
    "id" TEXT NOT NULL,
    "cycle_id" TEXT NOT NULL,
    "breathing_exercise" INTEGER NOT NULL,
    "breathing_veins" INTEGER NOT NULL,
    "warmth" INTEGER NOT NULL,
    "circulation" INTEGER NOT NULL,
    "harmony" INTEGER NOT NULL,
    "resonance_score" DECIMAL NOT NULL,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "onggi_states_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "onggis" (
    "id" TEXT NOT NULL,
    "cycle_id" TEXT NOT NULL,
    "name" "OnggiName" NOT NULL,
    "theme" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "date_range_start" DATE NOT NULL,
    "date_range_end" DATE NOT NULL,
    "activity_count" INTEGER NOT NULL DEFAULT 0,
    "final_resonance_score" DECIMAL NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "onggis_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "squad_matchups" (
    "id" TEXT NOT NULL,
    "cycle_id" TEXT NOT NULL,
    "left_squad_id" TEXT NOT NULL,
    "right_squad_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "squad_matchups_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "activities" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "points" INTEGER NOT NULL,
    "category" "ActivityCategory" NOT NULL,
    "scope" "ActivityScope" NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "activities_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "social_brain_games" (
    "id" TEXT NOT NULL,
    "squad_id" TEXT NOT NULL,
    "cycle_id" TEXT NOT NULL,
    "kind" "SocialBrainGameKind" NOT NULL,
    "status" "SocialBrainGameStatus" NOT NULL DEFAULT 'SCHEDULED',
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "points" INTEGER NOT NULL,
    "starts_at" TIMESTAMP(3) NOT NULL,
    "ends_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "social_brain_games_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "social_brain_game_participants" (
    "game_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "score" INTEGER NOT NULL DEFAULT 0,
    "joined_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "completed_at" TIMESTAMP(3),
    CONSTRAINT "social_brain_game_participants_pkey" PRIMARY KEY ("game_id", "user_id")
);

CREATE TABLE "activity_claims" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "activity_id" TEXT NOT NULL,
    "cycle_id" TEXT,
    "claim_date" DATE NOT NULL,
    "claimed_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "completed_at" TIMESTAMP(3),
    "status" "ActivityClaimStatus" NOT NULL DEFAULT 'CLAIMED',
    CONSTRAINT "activity_claims_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "activity_freezes" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "activity_id" TEXT NOT NULL,
    "started_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expires_at" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "activity_freezes_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "squad_challenges" (
    "id" TEXT NOT NULL,
    "squad_id" TEXT NOT NULL,
    "kind" "ChallengeKind" NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "points" INTEGER NOT NULL,
    "participant_count" INTEGER NOT NULL DEFAULT 0,
    "deadline" TIMESTAMP(3) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "squad_challenges_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "squad_challenge_participants" (
    "challenge_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "joined_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "squad_challenge_participants_pkey" PRIMARY KEY ("challenge_id", "user_id")
);

CREATE TABLE "impact_events" (
    "id" TEXT NOT NULL,
    "squad_id" TEXT NOT NULL,
    "cycle_id" TEXT,
    "actor_user_id" TEXT,
    "activity_claim_id" TEXT,
    "activity_category" "ActivityCategory" NOT NULL,
    "metric" "MetricType" NOT NULL,
    "delta" DECIMAL(5,2) NOT NULL,
    "message" TEXT NOT NULL,
    "occurred_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "impact_events_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "mentorship_links" (
    "id" TEXT NOT NULL,
    "mentor_id" TEXT NOT NULL,
    "mentee_id" TEXT NOT NULL,
    "condition_id" TEXT NOT NULL,
    "status" "MentorshipStatus" NOT NULL DEFAULT 'PENDING',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "mentorship_links_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "healing_chain_profiles" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "bio" TEXT,
    "specialization" TEXT,
    "is_available" BOOLEAN NOT NULL DEFAULT false,
    "preferred_communication_style" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "healing_chain_profiles_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "mentorship_sessions" (
    "id" TEXT NOT NULL,
    "mentorship_link_id" TEXT NOT NULL,
    "starts_at" TIMESTAMP(3) NOT NULL,
    "status" "MentorshipSessionStatus" NOT NULL DEFAULT 'CONFIRMED',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "mentorship_sessions_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "chain_messages" (
    "id" TEXT NOT NULL,
    "mentorship_link_id" TEXT NOT NULL,
    "sender_id" TEXT NOT NULL,
    "ciphertext" TEXT NOT NULL,
    "sent_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "chain_messages_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "spark_action_configs" (
    "id" TEXT NOT NULL,
    "kind" "SparkKind" NOT NULL,
    "points" INTEGER NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "spark_action_configs_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "sparks" (
    "id" TEXT NOT NULL,
    "action_id" TEXT NOT NULL,
    "sender_id" TEXT NOT NULL,
    "recipient_id" TEXT NOT NULL,
    "mentorship_link_id" TEXT,
    "points" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "sparks_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "lanterns" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "cycle_id" TEXT NOT NULL,
    "emotional_growth" DECIMAL(5,2) NOT NULL,
    "support_given" INTEGER NOT NULL,
    "consistency_percent" DECIMAL(5,2) NOT NULL,
    "compassion_acts_percent" DECIMAL(5,2) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "lanterns_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "reflections" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "body_text" TEXT NOT NULL,
    "mood_tags" "MoodTag"[] NOT NULL,
    "emotional_tags" "ReflectionEmotionalTag"[] NOT NULL,
    "is_private" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "reflections_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "ai_feedback" (
    "id" TEXT NOT NULL,
    "reflection_id" TEXT NOT NULL,
    "model" TEXT NOT NULL,
    "response_text" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "ai_feedback_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "shared_stories" (
    "id" TEXT NOT NULL,
    "source_reflection_id" TEXT,
    "author_user_id" TEXT,
    "emotional_tags" "ReflectionEmotionalTag"[] NOT NULL,
    "anonymized_body" TEXT NOT NULL,
    "is_published" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "shared_stories_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "journey_milestones" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "stage" "MilestoneStage" NOT NULL,
    "occurred_at" TIMESTAMP(3) NOT NULL,
    "notes" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "journey_milestones_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "communities" (
    "id" TEXT NOT NULL,
    "condition_id" TEXT NOT NULL,
    "member_count" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "communities_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "posts" (
    "id" TEXT NOT NULL,
    "community_id" TEXT NOT NULL,
    "author_user_id" TEXT,
    "body_text" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "posts_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "comments" (
    "id" TEXT NOT NULL,
    "post_id" TEXT NOT NULL,
    "community_id" TEXT NOT NULL,
    "author_user_id" TEXT,
    "body_text" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "comments_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "reactions" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "post_id" TEXT,
    "comment_id" TEXT,
    "type" "ReactionType" NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "reactions_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "events" (
    "id" TEXT NOT NULL,
    "community_id" TEXT NOT NULL,
    "host_user_id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "starts_at" TIMESTAMP(3) NOT NULL,
    "mode" "EventMode" NOT NULL,
    "attendee_count" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "events_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "event_attendees" (
    "event_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "joined_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "event_attendees_pkey" PRIMARY KEY ("event_id", "user_id")
);

CREATE TABLE "anonymous_support_messages" (
    "id" TEXT NOT NULL,
    "community_id" TEXT NOT NULL,
    "recipient_condition_id" TEXT NOT NULL,
    "body_text" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "anonymous_support_messages_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "time_capsule_contributions" (
    "id" TEXT NOT NULL,
    "cycle_id" TEXT NOT NULL,
    "onggi_id" TEXT,
    "user_id" TEXT NOT NULL,
    "type" "TimeCapsuleContributionType" NOT NULL,
    "storage_key" TEXT NOT NULL,
    "caption" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "time_capsule_contributions_pkey" PRIMARY KEY ("id")
);

-- Unique indexes
CREATE UNIQUE INDEX "users_firebase_uid_key" ON "users"("firebase_uid");
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");
CREATE UNIQUE INDEX "health_conditions_name_key" ON "health_conditions"("name");
CREATE UNIQUE INDEX "health_conditions_slug_key" ON "health_conditions"("slug");
CREATE UNIQUE INDEX "lifestyle_habits_user_id_type_key" ON "lifestyle_habits"("user_id", "type");
CREATE UNIQUE INDEX "squad_memberships_squad_id_user_id_key" ON "squad_memberships"("squad_id", "user_id");
CREATE UNIQUE INDEX "squad_memberships_squad_id_condition_id_key" ON "squad_memberships"("squad_id", "condition_id");
CREATE UNIQUE INDEX "onggi_states_cycle_id_key" ON "onggi_states"("cycle_id");
CREATE UNIQUE INDEX "onggis_cycle_id_key" ON "onggis"("cycle_id");
CREATE UNIQUE INDEX "squad_matchups_cycle_id_left_squad_id_right_squad_id_key" ON "squad_matchups"("cycle_id", "left_squad_id", "right_squad_id");
CREATE UNIQUE INDEX "mentorship_links_mentor_id_mentee_id_condition_id_key" ON "mentorship_links"("mentor_id", "mentee_id", "condition_id");
CREATE UNIQUE INDEX "healing_chain_profiles_user_id_key" ON "healing_chain_profiles"("user_id");
CREATE UNIQUE INDEX "spark_action_configs_kind_key" ON "spark_action_configs"("kind");
CREATE UNIQUE INDEX "lanterns_user_id_cycle_id_key" ON "lanterns"("user_id", "cycle_id");
CREATE UNIQUE INDEX "shared_stories_source_reflection_id_key" ON "shared_stories"("source_reflection_id");
CREATE UNIQUE INDEX "journey_milestones_user_id_stage_key" ON "journey_milestones"("user_id", "stage");
CREATE UNIQUE INDEX "communities_condition_id_key" ON "communities"("condition_id");
CREATE UNIQUE INDEX "reactions_user_id_post_id_type_key" ON "reactions"("user_id", "post_id", "type");
CREATE UNIQUE INDEX "reactions_user_id_comment_id_type_key" ON "reactions"("user_id", "comment_id", "type");

-- Hot-path indexes
CREATE INDEX "users_role_idx" ON "users"("role");
CREATE INDEX "users_journey_start_date_idx" ON "users"("journey_start_date");
CREATE INDEX "health_conditions_category_idx" ON "health_conditions"("category");
CREATE INDEX "user_conditions_condition_id_idx" ON "user_conditions"("condition_id");
CREATE INDEX "lifestyle_habits_user_id_type_idx" ON "lifestyle_habits"("user_id", "type");
CREATE INDEX "wellness_assessments_user_id_status_idx" ON "wellness_assessments"("user_id", "status");
CREATE INDEX "squads_name_idx" ON "squads"("name");
CREATE INDEX "squad_memberships_squad_id_status_idx" ON "squad_memberships"("squad_id", "status");
CREATE INDEX "squad_memberships_user_id_status_idx" ON "squad_memberships"("user_id", "status");
CREATE INDEX "recovery_cycles_squad_id_state_idx" ON "recovery_cycles"("squad_id", "state");
CREATE INDEX "recovery_cycles_squad_id_start_date_idx" ON "recovery_cycles"("squad_id", "start_date");
CREATE INDEX "squad_matchups_cycle_id_idx" ON "squad_matchups"("cycle_id");
CREATE INDEX "activities_category_scope_is_active_idx" ON "activities"("category", "scope", "is_active");
CREATE INDEX "social_brain_games_squad_id_status_starts_at_idx" ON "social_brain_games"("squad_id", "status", "starts_at");
CREATE INDEX "social_brain_games_cycle_id_starts_at_idx" ON "social_brain_games"("cycle_id", "starts_at");
CREATE INDEX "social_brain_game_participants_user_id_joined_at_idx" ON "social_brain_game_participants"("user_id", "joined_at");
CREATE INDEX "activity_claims_user_id_claim_date_idx" ON "activity_claims"("user_id", "claim_date");
CREATE INDEX "activity_claims_user_id_claimed_at_idx" ON "activity_claims"("user_id", "claimed_at");
CREATE INDEX "activity_claims_activity_id_claim_date_idx" ON "activity_claims"("activity_id", "claim_date");
CREATE INDEX "activity_claims_cycle_id_claimed_at_idx" ON "activity_claims"("cycle_id", "claimed_at");
CREATE INDEX "activity_freezes_user_id_activity_id_expires_at_idx" ON "activity_freezes"("user_id", "activity_id", "expires_at");
CREATE INDEX "activity_freezes_expires_at_idx" ON "activity_freezes"("expires_at");
CREATE INDEX "squad_challenges_squad_id_deadline_idx" ON "squad_challenges"("squad_id", "deadline");
CREATE INDEX "squad_challenges_deadline_idx" ON "squad_challenges"("deadline");
CREATE INDEX "squad_challenge_participants_user_id_joined_at_idx" ON "squad_challenge_participants"("user_id", "joined_at");
CREATE INDEX "impact_events_squad_id_occurred_at_idx" ON "impact_events"("squad_id", "occurred_at");
CREATE INDEX "impact_events_cycle_id_occurred_at_idx" ON "impact_events"("cycle_id", "occurred_at");
CREATE INDEX "impact_events_actor_user_id_occurred_at_idx" ON "impact_events"("actor_user_id", "occurred_at");
CREATE INDEX "mentorship_links_mentor_id_status_idx" ON "mentorship_links"("mentor_id", "status");
CREATE INDEX "mentorship_links_mentee_id_status_idx" ON "mentorship_links"("mentee_id", "status");
CREATE INDEX "mentorship_links_condition_id_status_idx" ON "mentorship_links"("condition_id", "status");
CREATE INDEX "healing_chain_profiles_is_available_idx" ON "healing_chain_profiles"("is_available");
CREATE INDEX "mentorship_sessions_mentorship_link_id_status_starts_at_idx" ON "mentorship_sessions"("mentorship_link_id", "status", "starts_at");
CREATE INDEX "mentorship_sessions_starts_at_status_idx" ON "mentorship_sessions"("starts_at", "status");
CREATE INDEX "chain_messages_mentorship_link_id_sent_at_idx" ON "chain_messages"("mentorship_link_id", "sent_at");
CREATE INDEX "chain_messages_sender_id_sent_at_idx" ON "chain_messages"("sender_id", "sent_at");
CREATE INDEX "sparks_recipient_id_created_at_idx" ON "sparks"("recipient_id", "created_at");
CREATE INDEX "sparks_sender_id_created_at_idx" ON "sparks"("sender_id", "created_at");
CREATE INDEX "sparks_mentorship_link_id_created_at_idx" ON "sparks"("mentorship_link_id", "created_at");
CREATE INDEX "lanterns_user_id_created_at_idx" ON "lanterns"("user_id", "created_at");
CREATE INDEX "reflections_user_id_created_at_idx" ON "reflections"("user_id", "created_at");
CREATE INDEX "reflections_user_id_is_private_created_at_idx" ON "reflections"("user_id", "is_private", "created_at");
CREATE INDEX "ai_feedback_reflection_id_created_at_idx" ON "ai_feedback"("reflection_id", "created_at");
CREATE INDEX "shared_stories_is_published_created_at_idx" ON "shared_stories"("is_published", "created_at");
CREATE INDEX "journey_milestones_user_id_occurred_at_idx" ON "journey_milestones"("user_id", "occurred_at");
CREATE INDEX "posts_community_id_created_at_idx" ON "posts"("community_id", "created_at");
CREATE INDEX "posts_author_user_id_created_at_idx" ON "posts"("author_user_id", "created_at");
CREATE INDEX "comments_post_id_created_at_idx" ON "comments"("post_id", "created_at");
CREATE INDEX "comments_community_id_created_at_idx" ON "comments"("community_id", "created_at");
CREATE INDEX "reactions_post_id_type_idx" ON "reactions"("post_id", "type");
CREATE INDEX "reactions_comment_id_type_idx" ON "reactions"("comment_id", "type");
CREATE INDEX "events_community_id_starts_at_idx" ON "events"("community_id", "starts_at");
CREATE INDEX "events_host_user_id_starts_at_idx" ON "events"("host_user_id", "starts_at");
CREATE INDEX "events_starts_at_mode_idx" ON "events"("starts_at", "mode");
CREATE INDEX "event_attendees_user_id_joined_at_idx" ON "event_attendees"("user_id", "joined_at");
CREATE INDEX "anonymous_support_messages_community_id_created_at_idx" ON "anonymous_support_messages"("community_id", "created_at");
CREATE INDEX "anonymous_support_messages_recipient_condition_id_created_at_idx" ON "anonymous_support_messages"("recipient_condition_id", "created_at");
CREATE INDEX "time_capsule_contributions_cycle_id_created_at_idx" ON "time_capsule_contributions"("cycle_id", "created_at");
CREATE INDEX "time_capsule_contributions_onggi_id_created_at_idx" ON "time_capsule_contributions"("onggi_id", "created_at");
CREATE INDEX "time_capsule_contributions_user_id_created_at_idx" ON "time_capsule_contributions"("user_id", "created_at");

-- Domain checks
ALTER TABLE "onggi_states" ADD CONSTRAINT "onggi_states_metrics_check"
  CHECK ("breathing_exercise" BETWEEN 0 AND 100 AND "breathing_veins" BETWEEN 0 AND 100 AND "warmth" BETWEEN 0 AND 100 AND "circulation" BETWEEN 0 AND 100 AND "harmony" BETWEEN 0 AND 100);
ALTER TABLE "squads" ADD CONSTRAINT "squads_max_members_check"
  CHECK ("max_members" > 0);
ALTER TABLE "shared_stories" ADD CONSTRAINT "shared_stories_published_source_check"
  CHECK (NOT "is_published" OR "source_reflection_id" IS NOT NULL);

-- Foreign keys
ALTER TABLE "user_conditions" ADD CONSTRAINT "user_conditions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "user_conditions" ADD CONSTRAINT "user_conditions_condition_id_fkey" FOREIGN KEY ("condition_id") REFERENCES "health_conditions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "lifestyle_habits" ADD CONSTRAINT "lifestyle_habits_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "wellness_assessments" ADD CONSTRAINT "wellness_assessments_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "squad_memberships" ADD CONSTRAINT "squad_memberships_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "squad_memberships" ADD CONSTRAINT "squad_memberships_squad_id_fkey" FOREIGN KEY ("squad_id") REFERENCES "squads"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "squad_memberships" ADD CONSTRAINT "squad_memberships_condition_id_fkey" FOREIGN KEY ("condition_id") REFERENCES "health_conditions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "squad_memberships" ADD CONSTRAINT "squad_memberships_user_condition_fkey" FOREIGN KEY ("user_id", "condition_id") REFERENCES "user_conditions"("user_id", "condition_id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "recovery_cycles" ADD CONSTRAINT "recovery_cycles_squad_id_fkey" FOREIGN KEY ("squad_id") REFERENCES "squads"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "onggi_states" ADD CONSTRAINT "onggi_states_cycle_id_fkey" FOREIGN KEY ("cycle_id") REFERENCES "recovery_cycles"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "onggis" ADD CONSTRAINT "onggis_cycle_id_fkey" FOREIGN KEY ("cycle_id") REFERENCES "recovery_cycles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "squad_matchups" ADD CONSTRAINT "squad_matchups_cycle_id_fkey" FOREIGN KEY ("cycle_id") REFERENCES "recovery_cycles"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "squad_matchups" ADD CONSTRAINT "squad_matchups_left_squad_id_fkey" FOREIGN KEY ("left_squad_id") REFERENCES "squads"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "squad_matchups" ADD CONSTRAINT "squad_matchups_right_squad_id_fkey" FOREIGN KEY ("right_squad_id") REFERENCES "squads"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "social_brain_games" ADD CONSTRAINT "social_brain_games_squad_id_fkey" FOREIGN KEY ("squad_id") REFERENCES "squads"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "social_brain_games" ADD CONSTRAINT "social_brain_games_cycle_id_fkey" FOREIGN KEY ("cycle_id") REFERENCES "recovery_cycles"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "social_brain_game_participants" ADD CONSTRAINT "social_brain_game_participants_game_id_fkey" FOREIGN KEY ("game_id") REFERENCES "social_brain_games"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "social_brain_game_participants" ADD CONSTRAINT "social_brain_game_participants_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "activity_claims" ADD CONSTRAINT "activity_claims_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "activity_claims" ADD CONSTRAINT "activity_claims_activity_id_fkey" FOREIGN KEY ("activity_id") REFERENCES "activities"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "activity_claims" ADD CONSTRAINT "activity_claims_cycle_id_fkey" FOREIGN KEY ("cycle_id") REFERENCES "recovery_cycles"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "activity_freezes" ADD CONSTRAINT "activity_freezes_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "activity_freezes" ADD CONSTRAINT "activity_freezes_activity_id_fkey" FOREIGN KEY ("activity_id") REFERENCES "activities"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "squad_challenges" ADD CONSTRAINT "squad_challenges_squad_id_fkey" FOREIGN KEY ("squad_id") REFERENCES "squads"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "squad_challenge_participants" ADD CONSTRAINT "squad_challenge_participants_challenge_id_fkey" FOREIGN KEY ("challenge_id") REFERENCES "squad_challenges"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "squad_challenge_participants" ADD CONSTRAINT "squad_challenge_participants_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "impact_events" ADD CONSTRAINT "impact_events_squad_id_fkey" FOREIGN KEY ("squad_id") REFERENCES "squads"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "impact_events" ADD CONSTRAINT "impact_events_cycle_id_fkey" FOREIGN KEY ("cycle_id") REFERENCES "recovery_cycles"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "impact_events" ADD CONSTRAINT "impact_events_actor_user_id_fkey" FOREIGN KEY ("actor_user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "impact_events" ADD CONSTRAINT "impact_events_activity_claim_id_fkey" FOREIGN KEY ("activity_claim_id") REFERENCES "activity_claims"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "mentorship_links" ADD CONSTRAINT "mentorship_links_mentor_id_fkey" FOREIGN KEY ("mentor_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "mentorship_links" ADD CONSTRAINT "mentorship_links_mentee_id_fkey" FOREIGN KEY ("mentee_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "mentorship_links" ADD CONSTRAINT "mentorship_links_condition_id_fkey" FOREIGN KEY ("condition_id") REFERENCES "health_conditions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "healing_chain_profiles" ADD CONSTRAINT "healing_chain_profiles_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "mentorship_sessions" ADD CONSTRAINT "mentorship_sessions_mentorship_link_id_fkey" FOREIGN KEY ("mentorship_link_id") REFERENCES "mentorship_links"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "chain_messages" ADD CONSTRAINT "chain_messages_mentorship_link_id_fkey" FOREIGN KEY ("mentorship_link_id") REFERENCES "mentorship_links"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "chain_messages" ADD CONSTRAINT "chain_messages_sender_id_fkey" FOREIGN KEY ("sender_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "sparks" ADD CONSTRAINT "sparks_action_id_fkey" FOREIGN KEY ("action_id") REFERENCES "spark_action_configs"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "sparks" ADD CONSTRAINT "sparks_sender_id_fkey" FOREIGN KEY ("sender_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "sparks" ADD CONSTRAINT "sparks_recipient_id_fkey" FOREIGN KEY ("recipient_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "sparks" ADD CONSTRAINT "sparks_mentorship_link_id_fkey" FOREIGN KEY ("mentorship_link_id") REFERENCES "mentorship_links"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "lanterns" ADD CONSTRAINT "lanterns_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "lanterns" ADD CONSTRAINT "lanterns_cycle_id_fkey" FOREIGN KEY ("cycle_id") REFERENCES "recovery_cycles"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "reflections" ADD CONSTRAINT "reflections_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "ai_feedback" ADD CONSTRAINT "ai_feedback_reflection_id_fkey" FOREIGN KEY ("reflection_id") REFERENCES "reflections"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "shared_stories" ADD CONSTRAINT "shared_stories_source_reflection_id_fkey" FOREIGN KEY ("source_reflection_id") REFERENCES "reflections"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "shared_stories" ADD CONSTRAINT "shared_stories_author_user_id_fkey" FOREIGN KEY ("author_user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "journey_milestones" ADD CONSTRAINT "journey_milestones_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "communities" ADD CONSTRAINT "communities_condition_id_fkey" FOREIGN KEY ("condition_id") REFERENCES "health_conditions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "posts" ADD CONSTRAINT "posts_community_id_fkey" FOREIGN KEY ("community_id") REFERENCES "communities"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "posts" ADD CONSTRAINT "posts_author_user_id_fkey" FOREIGN KEY ("author_user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "comments" ADD CONSTRAINT "comments_post_id_fkey" FOREIGN KEY ("post_id") REFERENCES "posts"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "comments" ADD CONSTRAINT "comments_community_id_fkey" FOREIGN KEY ("community_id") REFERENCES "communities"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "comments" ADD CONSTRAINT "comments_author_user_id_fkey" FOREIGN KEY ("author_user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "reactions" ADD CONSTRAINT "reactions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "reactions" ADD CONSTRAINT "reactions_post_id_fkey" FOREIGN KEY ("post_id") REFERENCES "posts"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "reactions" ADD CONSTRAINT "reactions_comment_id_fkey" FOREIGN KEY ("comment_id") REFERENCES "comments"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "events" ADD CONSTRAINT "events_community_id_fkey" FOREIGN KEY ("community_id") REFERENCES "communities"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "events" ADD CONSTRAINT "events_host_user_id_fkey" FOREIGN KEY ("host_user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "event_attendees" ADD CONSTRAINT "event_attendees_event_id_fkey" FOREIGN KEY ("event_id") REFERENCES "events"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "event_attendees" ADD CONSTRAINT "event_attendees_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "anonymous_support_messages" ADD CONSTRAINT "anonymous_support_messages_community_id_fkey" FOREIGN KEY ("community_id") REFERENCES "communities"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "anonymous_support_messages" ADD CONSTRAINT "anonymous_support_messages_recipient_condition_id_fkey" FOREIGN KEY ("recipient_condition_id") REFERENCES "health_conditions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "time_capsule_contributions" ADD CONSTRAINT "time_capsule_contributions_cycle_id_fkey" FOREIGN KEY ("cycle_id") REFERENCES "recovery_cycles"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "time_capsule_contributions" ADD CONSTRAINT "time_capsule_contributions_onggi_id_fkey" FOREIGN KEY ("onggi_id") REFERENCES "onggis"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "time_capsule_contributions" ADD CONSTRAINT "time_capsule_contributions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

CREATE OR REPLACE FUNCTION prevent_impact_event_mutation()
RETURNS TRIGGER AS $$
BEGIN
  RAISE EXCEPTION 'ImpactEvent records are append-only';
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER impact_event_append_only
BEFORE UPDATE OR DELETE ON "impact_events"
FOR EACH ROW EXECUTE FUNCTION prevent_impact_event_mutation();

CREATE OR REPLACE FUNCTION prevent_onggi_mutation()
RETURNS TRIGGER AS $$
BEGIN
  RAISE EXCEPTION 'Crystallized Onggi records are immutable and cannot be updated or deleted';
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER onggi_immutable
BEFORE UPDATE OR DELETE ON "onggis"
FOR EACH ROW EXECUTE FUNCTION prevent_onggi_mutation();

CREATE OR REPLACE FUNCTION enforce_squad_membership_limit()
RETURNS TRIGGER AS $$
DECLARE
  configured_limit INTEGER;
  active_count INTEGER;
BEGIN
  SELECT s.max_members INTO configured_limit
  FROM "squads" AS s
  WHERE s.id = NEW.squad_id;
  SELECT COALESCE(pc.max_squad_members, configured_limit) INTO configured_limit
  FROM "platform_configs" AS pc
  WHERE pc.id = 'default';
  IF configured_limit IS NULL THEN
    RAISE EXCEPTION 'Default platform configuration is missing';
  END IF;
  SELECT COUNT(*) INTO active_count
  FROM "squad_memberships"
  WHERE squad_id = NEW.squad_id
    AND status IN ('INVITED', 'ACTIVE', 'PAUSED');
  IF active_count > configured_limit THEN
    RAISE EXCEPTION 'Squad membership limit exceeded';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER squad_membership_limit
AFTER INSERT OR UPDATE OF squad_id, status ON "squad_memberships"
FOR EACH ROW EXECUTE FUNCTION enforce_squad_membership_limit();

CREATE OR REPLACE FUNCTION enforce_recovery_cycle_squad_size()
RETURNS TRIGGER AS $$
DECLARE
  required_size INTEGER;
  member_count INTEGER;
BEGIN
  SELECT max_squad_members INTO required_size
  FROM "platform_configs"
  WHERE id = 'default';
  IF required_size IS NULL THEN
    RAISE EXCEPTION 'Default platform configuration is missing';
  END IF;
  SELECT COUNT(*) INTO member_count
  FROM "squad_memberships"
  WHERE squad_id = NEW.squad_id
    AND status IN ('INVITED', 'ACTIVE', 'PAUSED');
  IF member_count <> required_size THEN
    RAISE EXCEPTION 'A recovery cycle requires exactly the configured squad size';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER recovery_cycle_squad_size
AFTER INSERT OR UPDATE OF squad_id ON "recovery_cycles"
FOR EACH ROW EXECUTE FUNCTION enforce_recovery_cycle_squad_size();
