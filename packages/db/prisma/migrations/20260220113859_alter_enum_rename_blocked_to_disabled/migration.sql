/*
  Warnings:

  - The values [BLOCKED] on the enum `TrainingStatus` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "TrainingStatus_new" AS ENUM ('DRAFT', 'READY_TO_PUBLISH', 'PUBLISHED', 'DISABLED', 'HIDDEN');
ALTER TABLE "public"."Training" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "Training" ALTER COLUMN "status" TYPE "TrainingStatus_new" USING ("status"::text::"TrainingStatus_new");
ALTER TYPE "TrainingStatus" RENAME TO "TrainingStatus_old";
ALTER TYPE "TrainingStatus_new" RENAME TO "TrainingStatus";
DROP TYPE "public"."TrainingStatus_old";
ALTER TABLE "Training" ALTER COLUMN "status" SET DEFAULT 'DRAFT';
COMMIT;
