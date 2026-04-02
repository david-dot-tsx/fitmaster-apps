-- Remove REST from WorkoutBlockType enum.
-- Existing REST records are mapped to COOL_DOWN before changing enum type.

CREATE TYPE "WorkoutBlockType_new" AS ENUM ('WARM_UP', 'MAIN_WORKOUT', 'COOL_DOWN');

ALTER TABLE "WorkoutExercise"
ALTER COLUMN "workoutBlockType"
TYPE "WorkoutBlockType_new"
USING (
  CASE
    WHEN "workoutBlockType"::text = 'REST' THEN 'COOL_DOWN'
    ELSE "workoutBlockType"::text
  END
)::"WorkoutBlockType_new";

ALTER TYPE "WorkoutBlockType" RENAME TO "WorkoutBlockType_old";
ALTER TYPE "WorkoutBlockType_new" RENAME TO "WorkoutBlockType";
DROP TYPE "WorkoutBlockType_old";
