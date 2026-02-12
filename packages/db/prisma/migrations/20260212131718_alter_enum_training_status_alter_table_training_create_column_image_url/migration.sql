/*
  Warnings:

  - The values [VISIBLE,DISABLED] on the enum `TrainingStatus` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "TrainingStatus_new" AS ENUM ('DRAFT', 'READY_TO_PUBLISH', 'PUBLISHED', 'HIDDEN', 'BLOCKED');
ALTER TABLE "Training" ALTER COLUMN "status" TYPE "TrainingStatus_new" USING ("status"::text::"TrainingStatus_new");
ALTER TYPE "TrainingStatus" RENAME TO "TrainingStatus_old";
ALTER TYPE "TrainingStatus_new" RENAME TO "TrainingStatus";
DROP TYPE "public"."TrainingStatus_old";
COMMIT;

-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "WorkoutType" ADD VALUE 'HYPERTROPHY';
ALTER TYPE "WorkoutType" ADD VALUE 'POWER';
ALTER TYPE "WorkoutType" ADD VALUE 'MOBILITY';
ALTER TYPE "WorkoutType" ADD VALUE 'RECOVERY';

-- AlterTable
ALTER TABLE "Training" ADD COLUMN     "imageUrl" TEXT;
