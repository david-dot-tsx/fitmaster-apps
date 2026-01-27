-- CreateEnum
CREATE TYPE "Difficulty" AS ENUM ('EASY', 'MEDIUM', 'HARD');

-- CreateEnum
CREATE TYPE "BodyPart" AS ENUM ('CHEST', 'SHOULDERS', 'BACK', 'ARMS', 'LEGS');

-- CreateEnum
CREATE TYPE "WorkoutType" AS ENUM ('STRENGTH', 'ENDURANCE', 'FLEXIBILITY', 'BALANCE');

-- CreateEnum
CREATE TYPE "WorkoutBlockType" AS ENUM ('WARM_UP', 'MAIN_WORKOUT', 'REST', 'COOL_DOWN');

-- CreateEnum
CREATE TYPE "TrainingStatus" AS ENUM ('VISIBLE', 'HIDDEN', 'DISABLED');

-- CreateEnum
CREATE TYPE "CustomerProgressTrainingStatus" AS ENUM ('NOT_STARTED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "ProgressCustomerTrainingDayStatus" AS ENUM ('NOT_STARTED', 'IN_PROGRESS', 'COMPLETED', 'SKIPPED');

-- CreateEnum
CREATE TYPE "ProgressCustomerWorkoutBlockStatus" AS ENUM ('NOT_STARTED', 'IN_PROGRESS', 'COMPLETED', 'SKIPPED');

-- CreateEnum
CREATE TYPE "ProgressCustomerWorkoutExerciseStatus" AS ENUM ('NOT_STARTED', 'IN_PROGRESS', 'COMPLETED', 'SKIPPED');

-- CreateTable
CREATE TABLE "Exercise" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "difficulty" "Difficulty" NOT NULL,
    "bodyPart" "BodyPart" NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "Exercise_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WorkoutExercise" (
    "id" TEXT NOT NULL,
    "reps" INTEGER,
    "duration" INTEGER,
    "distance" INTEGER,
    "weight" DOUBLE PRECISION,
    "exerciseId" TEXT NOT NULL,
    "workoutBlockId" TEXT NOT NULL,
    "workoutType" "WorkoutType" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "WorkoutExercise_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WorkoutBlock" (
    "id" TEXT NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,
    "workoutBlockType" "WorkoutBlockType" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "WorkoutBlock_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TrainingDay" (
    "id" TEXT NOT NULL,
    "workoutBlockId" TEXT NOT NULL,
    "trainingId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "TrainingDay_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Training" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "status" "TrainingStatus" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "Training_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProgressCustomerTraining" (
    "id" TEXT NOT NULL,
    "customerProfileId" TEXT NOT NULL,
    "trainingId" TEXT NOT NULL,
    "status" "CustomerProgressTrainingStatus" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "ProgressCustomerTraining_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProgressCustomerTrainingDay" (
    "id" TEXT NOT NULL,
    "status" "ProgressCustomerTrainingDayStatus" NOT NULL DEFAULT 'NOT_STARTED',
    "progressCustomerTrainingId" TEXT NOT NULL,
    "trainingDayId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "ProgressCustomerTrainingDay_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProgressCustomerWorkoutBlock" (
    "id" TEXT NOT NULL,
    "status" "ProgressCustomerWorkoutBlockStatus" NOT NULL DEFAULT 'NOT_STARTED',
    "progressCustomerTrainingDayId" TEXT NOT NULL,
    "workoutBlockId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "ProgressCustomerWorkoutBlock_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProgressCustomerWorkoutExercise" (
    "id" TEXT NOT NULL,
    "duration" INTEGER,
    "status" "ProgressCustomerWorkoutExerciseStatus" NOT NULL DEFAULT 'NOT_STARTED',
    "progressCustomerWorkoutBlockId" TEXT NOT NULL,
    "workoutExerciseId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "ProgressCustomerWorkoutExercise_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "WorkoutExercise" ADD CONSTRAINT "WorkoutExercise_exerciseId_fkey" FOREIGN KEY ("exerciseId") REFERENCES "Exercise"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WorkoutExercise" ADD CONSTRAINT "WorkoutExercise_workoutBlockId_fkey" FOREIGN KEY ("workoutBlockId") REFERENCES "WorkoutBlock"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TrainingDay" ADD CONSTRAINT "TrainingDay_workoutBlockId_fkey" FOREIGN KEY ("workoutBlockId") REFERENCES "WorkoutBlock"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TrainingDay" ADD CONSTRAINT "TrainingDay_trainingId_fkey" FOREIGN KEY ("trainingId") REFERENCES "Training"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProgressCustomerTraining" ADD CONSTRAINT "ProgressCustomerTraining_customerProfileId_fkey" FOREIGN KEY ("customerProfileId") REFERENCES "CustomerProfile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProgressCustomerTraining" ADD CONSTRAINT "ProgressCustomerTraining_trainingId_fkey" FOREIGN KEY ("trainingId") REFERENCES "Training"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProgressCustomerTrainingDay" ADD CONSTRAINT "ProgressCustomerTrainingDay_progressCustomerTrainingId_fkey" FOREIGN KEY ("progressCustomerTrainingId") REFERENCES "ProgressCustomerTraining"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProgressCustomerTrainingDay" ADD CONSTRAINT "ProgressCustomerTrainingDay_trainingDayId_fkey" FOREIGN KEY ("trainingDayId") REFERENCES "TrainingDay"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProgressCustomerWorkoutBlock" ADD CONSTRAINT "ProgressCustomerWorkoutBlock_progressCustomerTrainingDayId_fkey" FOREIGN KEY ("progressCustomerTrainingDayId") REFERENCES "ProgressCustomerTrainingDay"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProgressCustomerWorkoutBlock" ADD CONSTRAINT "ProgressCustomerWorkoutBlock_workoutBlockId_fkey" FOREIGN KEY ("workoutBlockId") REFERENCES "WorkoutBlock"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProgressCustomerWorkoutExercise" ADD CONSTRAINT "ProgressCustomerWorkoutExercise_progressCustomerWorkoutBlo_fkey" FOREIGN KEY ("progressCustomerWorkoutBlockId") REFERENCES "ProgressCustomerWorkoutBlock"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProgressCustomerWorkoutExercise" ADD CONSTRAINT "ProgressCustomerWorkoutExercise_workoutExerciseId_fkey" FOREIGN KEY ("workoutExerciseId") REFERENCES "WorkoutExercise"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
