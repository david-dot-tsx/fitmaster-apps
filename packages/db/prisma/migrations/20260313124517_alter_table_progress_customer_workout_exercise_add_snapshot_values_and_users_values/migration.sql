/*
  Warnings:

  - You are about to drop the column `duration` on the `ProgressCustomerWorkoutExercise` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "ProgressCustomerWorkoutExercise" DROP COLUMN "duration",
ADD COLUMN     "actualDistance" INTEGER,
ADD COLUMN     "actualDuration" INTEGER,
ADD COLUMN     "actualReps" INTEGER,
ADD COLUMN     "actualWeight" DOUBLE PRECISION,
ADD COLUMN     "exercisetime" INTEGER,
ADD COLUMN     "targetDistance" INTEGER,
ADD COLUMN     "targetDuration" INTEGER,
ADD COLUMN     "targetReps" INTEGER,
ADD COLUMN     "targetWeight" DOUBLE PRECISION;
