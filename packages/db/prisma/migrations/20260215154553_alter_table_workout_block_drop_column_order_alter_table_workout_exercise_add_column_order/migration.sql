/*
  Warnings:

  - You are about to drop the column `order` on the `WorkoutBlock` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "WorkoutBlock" DROP COLUMN "order";

-- AlterTable
ALTER TABLE "WorkoutExercise" ADD COLUMN     "order" INTEGER NOT NULL DEFAULT 0;
