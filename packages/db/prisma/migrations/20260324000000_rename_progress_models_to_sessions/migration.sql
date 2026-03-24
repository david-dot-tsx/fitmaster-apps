-- Rename enums
ALTER TYPE "ProgressCustomerTrainingDayStatus" RENAME TO "TrainingDaySessionStatus";
ALTER TYPE "ProgressCustomerWorkoutExerciseStatus" RENAME TO "WorkoutExerciseSessionStatus";

-- Rename tables
ALTER TABLE "ProgressCustomerTraining" RENAME TO "TrainingSession";
ALTER TABLE "ProgressCustomerTrainingDay" RENAME TO "TrainingDaySession";
ALTER TABLE "ProgressCustomerWorkoutExercise" RENAME TO "WorkoutExerciseSession";

-- Rename foreign key columns
ALTER TABLE "TrainingDaySession" RENAME COLUMN "progressCustomerTrainingId" TO "trainingSessionId";
ALTER TABLE "WorkoutExerciseSession" RENAME COLUMN "progressCustomerTrainingDayId" TO "trainingDaySessionId";
