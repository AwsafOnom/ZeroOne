-- Resonance is an accumulating squad competition total, not a percentage.
ALTER TABLE "onggi_states"
  DROP CONSTRAINT IF EXISTS "onggi_states_metrics_check";

ALTER TABLE "onggis"
  DROP CONSTRAINT IF EXISTS "onggis_resonance_score_check";

ALTER TABLE "onggi_states"
  ALTER COLUMN "resonance_score" TYPE DECIMAL;

ALTER TABLE "onggis"
  ALTER COLUMN "final_resonance_score" TYPE DECIMAL;

-- The previous trigger incorrectly replaced the total with a five-dimension mean.
DROP TRIGGER IF EXISTS onggi_state_resonance_score ON "onggi_states";
DROP FUNCTION IF EXISTS set_onggi_resonance_score();

ALTER TABLE "onggi_states" ADD CONSTRAINT "onggi_states_metrics_check"
  CHECK (
    "breathing_exercise" BETWEEN 0 AND 100
    AND "breathing_veins" BETWEEN 0 AND 100
    AND "warmth" BETWEEN 0 AND 100
    AND "circulation" BETWEEN 0 AND 100
    AND "harmony" BETWEEN 0 AND 100
  );
