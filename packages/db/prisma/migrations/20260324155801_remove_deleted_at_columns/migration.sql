/*
  Warnings:

  - You are about to drop the column `deletedAt` on the `CustomerProfile` table. All the data in the column will be lost.
  - You are about to drop the column `deletedAt` on the `Exercise` table. All the data in the column will be lost.
  - You are about to drop the column `deletedAt` on the `Profile` table. All the data in the column will be lost.
  - You are about to drop the column `deletedAt` on the `TrainerProfile` table. All the data in the column will be lost.
  - You are about to drop the column `deletedAt` on the `Training` table. All the data in the column will be lost.
  - You are about to drop the column `deletedAt` on the `TrainingDay` table. All the data in the column will be lost.
  - You are about to drop the column `deletedAt` on the `TrainingDaySession` table. All the data in the column will be lost.
  - You are about to drop the column `deletedAt` on the `TrainingSession` table. All the data in the column will be lost.
  - You are about to drop the column `deletedAt` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `deletedAt` on the `WorkoutExercise` table. All the data in the column will be lost.
  - You are about to drop the column `deletedAt` on the `WorkoutExerciseSession` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "CustomerProfile" DROP COLUMN "deletedAt";

-- AlterTable
ALTER TABLE "Exercise" DROP COLUMN "deletedAt";

-- AlterTable
ALTER TABLE "Profile" DROP COLUMN "deletedAt";

-- AlterTable
ALTER TABLE "TrainerProfile" DROP COLUMN "deletedAt";

-- AlterTable
ALTER TABLE "Training" DROP COLUMN "deletedAt";

-- AlterTable
ALTER TABLE "TrainingDay" DROP COLUMN "deletedAt";

-- AlterTable
ALTER TABLE "TrainingDaySession" RENAME CONSTRAINT "ProgressCustomerTrainingDay_pkey" TO "TrainingDaySession_pkey";
ALTER TABLE "TrainingDaySession" DROP COLUMN "deletedAt";

-- AlterTable
ALTER TABLE "TrainingSession" RENAME CONSTRAINT "ProgressCustomerTraining_pkey" TO "TrainingSession_pkey";
ALTER TABLE "TrainingSession" DROP COLUMN "deletedAt";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "deletedAt";

-- AlterTable
ALTER TABLE "WorkoutExercise" DROP COLUMN "deletedAt";

-- AlterTable
ALTER TABLE "WorkoutExerciseSession" RENAME CONSTRAINT "ProgressCustomerWorkoutExercise_pkey" TO "WorkoutExerciseSession_pkey";
ALTER TABLE "WorkoutExerciseSession" DROP COLUMN "deletedAt";

-- RenameForeignKey
ALTER TABLE "TrainingDaySession" RENAME CONSTRAINT "ProgressCustomerTrainingDay_progressCustomerTrainingId_fkey" TO "TrainingDaySession_trainingSessionId_fkey";

-- RenameForeignKey
ALTER TABLE "TrainingDaySession" RENAME CONSTRAINT "ProgressCustomerTrainingDay_trainingDayId_fkey" TO "TrainingDaySession_trainingDayId_fkey";

-- RenameForeignKey
ALTER TABLE "TrainingSession" RENAME CONSTRAINT "ProgressCustomerTraining_customerProfileId_fkey" TO "TrainingSession_customerProfileId_fkey";

-- RenameForeignKey
ALTER TABLE "TrainingSession" RENAME CONSTRAINT "ProgressCustomerTraining_trainingId_fkey" TO "TrainingSession_trainingId_fkey";

-- RenameForeignKey
ALTER TABLE "WorkoutExerciseSession" RENAME CONSTRAINT "ProgressCustomerWorkoutExercise_progressCustomerTrainingDa_fkey" TO "WorkoutExerciseSession_trainingDaySessionId_fkey";

-- RenameForeignKey
ALTER TABLE "WorkoutExerciseSession" RENAME CONSTRAINT "ProgressCustomerWorkoutExercise_workoutExerciseId_fkey" TO "WorkoutExerciseSession_workoutExerciseId_fkey";
