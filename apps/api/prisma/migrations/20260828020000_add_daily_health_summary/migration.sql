CREATE TABLE "daily_health_summaries" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "summary_date" DATE NOT NULL,
    "sleep_minutes" INTEGER,
    "sleep_goal_minutes" INTEGER,
    "water_glasses" INTEGER,
    "water_goal_glasses" INTEGER,
    "calories_consumed" INTEGER,
    "calorie_goal" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "daily_health_summaries_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "daily_health_summaries_user_id_summary_date_key"
ON "daily_health_summaries"("user_id", "summary_date");

CREATE INDEX "daily_health_summaries_user_id_summary_date_idx"
ON "daily_health_summaries"("user_id", "summary_date");

ALTER TABLE "daily_health_summaries"
ADD CONSTRAINT "daily_health_summaries_user_id_fkey"
FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
