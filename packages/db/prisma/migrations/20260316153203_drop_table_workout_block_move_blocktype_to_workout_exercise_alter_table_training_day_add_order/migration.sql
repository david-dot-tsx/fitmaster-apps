/*
  Warnings:

  - You are about to drop the column `progressCustomerWorkoutBlockId` on the `ProgressCustomerWorkoutExercise` table. All the data in the column will be lost.
  - You are about to drop the column `workoutBlockId` on the `WorkoutExercise` table. All the data in the column will be lost.
  - You are about to drop the `ProgressCustomerWorkoutBlock` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `WorkoutBlock` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `progressCustomerTrainingDayId` to the `ProgressCustomerWorkoutExercise` table without a default value. This is not possible if the table is not empty.
  - Added the required column `trainingDayId` to the `WorkoutExercise` table without a default value. This is not possible if the table is not empty.
  - Added the required column `workoutBlockType` to the `WorkoutExercise` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "ProgressCustomerWorkoutBlock" DROP CONSTRAINT "ProgressCustomerWorkoutBlock_progressCustomerTrainingDayId_fkey";

-- DropForeignKey
ALTER TABLE "ProgressCustomerWorkoutBlock" DROP CONSTRAINT "ProgressCustomerWorkoutBlock_workoutBlockId_fkey";

-- DropForeignKey
ALTER TABLE "ProgressCustomerWorkoutExercise" DROP CONSTRAINT "ProgressCustomerWorkoutExercise_progressCustomerWorkoutBlo_fkey";

-- DropForeignKey
ALTER TABLE "WorkoutBlock" DROP CONSTRAINT "WorkoutBlock_trainingDayId_fkey";

-- DropForeignKey
ALTER TABLE "WorkoutExercise" DROP CONSTRAINT "WorkoutExercise_workoutBlockId_fkey";

-- AlterTable
ALTER TABLE "ProgressCustomerWorkoutExercise" DROP COLUMN "progressCustomerWorkoutBlockId",
ADD COLUMN     "progressCustomerTrainingDayId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "TrainingDay" ADD COLUMN     "order" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "WorkoutExercise" DROP COLUMN "workoutBlockId",
ADD COLUMN     "trainingDayId" TEXT NOT NULL,
ADD COLUMN     "workoutBlockType" "WorkoutBlockType" NOT NULL;

-- DropTable
DROP TABLE "ProgressCustomerWorkoutBlock";

-- DropTable
DROP TABLE "WorkoutBlock";

-- DropEnum
DROP TYPE "ProgressCustomerWorkoutBlockStatus";

-- AddForeignKey
ALTER TABLE "WorkoutExercise" ADD CONSTRAINT "WorkoutExercise_trainingDayId_fkey" FOREIGN KEY ("trainingDayId") REFERENCES "TrainingDay"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProgressCustomerWorkoutExercise" ADD CONSTRAINT "ProgressCustomerWorkoutExercise_progressCustomerTrainingDa_fkey" FOREIGN KEY ("progressCustomerTrainingDayId") REFERENCES "ProgressCustomerTrainingDay"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
