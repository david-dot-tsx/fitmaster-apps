/*
  Warnings:

  - You are about to drop the column `workoutBlockId` on the `TrainingDay` table. All the data in the column will be lost.
  - Added the required column `trainingDayId` to the `WorkoutBlock` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "TrainingDay" DROP CONSTRAINT "TrainingDay_workoutBlockId_fkey";

-- AlterTable
ALTER TABLE "TrainingDay" DROP COLUMN "workoutBlockId";

-- AlterTable
ALTER TABLE "WorkoutBlock" ADD COLUMN     "trainingDayId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "WorkoutBlock" ADD CONSTRAINT "WorkoutBlock_trainingDayId_fkey" FOREIGN KEY ("trainingDayId") REFERENCES "TrainingDay"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
