/*
  Warnings:

  - You are about to drop the column `bio` on the `TrainerProfile` table. All the data in the column will be lost.
  - Added the required column `birthDate` to the `Profile` table without a default value. This is not possible if the table is not empty.
  - Added the required column `gender` to the `Profile` table without a default value. This is not possible if the table is not empty.
  - Made the column `nickname` on table `Profile` required. This step will fail if there are existing NULL values in that column.

*/
-- CreateEnum
CREATE TYPE "Gender" AS ENUM ('MALE', 'FEMALE', 'OTHER');

-- AlterTable
ALTER TABLE "Profile" ADD COLUMN     "bio" TEXT,
ADD COLUMN     "birthDate" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "gender" "Gender" NOT NULL,
ADD COLUMN     "imageUrl" TEXT,
ALTER COLUMN "nickname" SET NOT NULL;

-- AlterTable
ALTER TABLE "TrainerProfile" DROP COLUMN "bio";
