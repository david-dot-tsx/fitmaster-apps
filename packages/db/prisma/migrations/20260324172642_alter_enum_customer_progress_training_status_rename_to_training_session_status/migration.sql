/*
  Warnings:

  - The `status` column on the `TrainingSession` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "TrainingSessionStatus" AS ENUM ('NOT_STARTED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED');

-- AlterTable
ALTER TABLE "TrainingSession" DROP COLUMN "status",
ADD COLUMN     "status" "TrainingSessionStatus" NOT NULL DEFAULT 'NOT_STARTED';

-- DropEnum
DROP TYPE "CustomerProgressTrainingStatus";
