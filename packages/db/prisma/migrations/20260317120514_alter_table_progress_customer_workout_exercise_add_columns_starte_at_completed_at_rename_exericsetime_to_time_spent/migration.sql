/*
  Warnings:

  - You are about to drop the column `exercisetime` on the `ProgressCustomerWorkoutExercise` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "ProgressCustomerWorkoutExercise" DROP COLUMN "exercisetime",
ADD COLUMN     "completedAt" TIMESTAMP(3),
ADD COLUMN     "startedAt" TIMESTAMP(3),
ADD COLUMN     "timeSpent" INTEGER;
