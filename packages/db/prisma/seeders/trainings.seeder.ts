import { faker } from "@faker-js/faker";
import { TrainingStatus, WorkoutBlockType, WorkoutType } from "@prisma/client";

import type { Seeder, SeederContext } from "./types";

const getRandomImageUrl = (): string => {
  const id = Math.floor(Math.random() * 1024) + 1;

  return `https://picsum.photos/id/${id}/1024/1024`;
};

const maybe = <T>(value: T): T | null => (Math.random() > 0.5 ? value : null);

const pick = <T>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)]!;

const range = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;

const TRAINING_NAMES = [
  "Full Body Blast",
  "Upper Body Power",
  "Lower Body Strength",
  "Core Crusher",
  "HIIT Circuit",
  "Strength Foundation",
  "Endurance Builder",
  "Flexibility Flow",
  "Athletic Performance",
  "Recovery & Mobility",
  "Push Day",
  "Pull Day",
  "Leg Day",
  "Chest & Triceps",
  "Back & Biceps",
  "Shoulders & Arms",
  "Total Body Conditioning",
  "Explosive Power",
  "Beginner's Journey",
  "Advanced Shred",
];

const workoutTypes = Object.values(WorkoutType);

const buildWorkoutExercises = (
  exerciseIds: string[],
  workoutBlockType: WorkoutBlockType,
): object[] =>
  Array.from({ length: range(3, 6) }, (_, order) => {
    const exerciseId = pick(exerciseIds);
    const workoutType = pick(workoutTypes);

    const isStrengthBased =
      workoutType === WorkoutType.STRENGTH || workoutType === WorkoutType.HYPERTROPHY;
    const isTimeBased =
      workoutType === WorkoutType.ENDURANCE ||
      workoutType === WorkoutType.MOBILITY ||
      workoutType === WorkoutType.FLEXIBILITY ||
      workoutType === WorkoutType.RECOVERY;

    return {
      exerciseId,
      workoutType,
      workoutBlockType: workoutBlockType,
      order: order + 1,
      reps: isStrengthBased ? range(6, 15) : null,
      duration: isTimeBased ? range(30, 120) : null,
      weight: isStrengthBased ? parseFloat((Math.random() * 80 + 10).toFixed(1)) : null,
    };
  });

export const trainingsSeeder: Seeder = {
  name: "Trainings",
  description: "Creates full trainings with days, workout blocks and exercises",
  defaultCount: 10,

  async run({ prisma }: SeederContext, count: number) {
    const trainingsWithoutImage = await prisma.training.findMany({
      where: { imageUrl: null },
      select: { id: true },
    });

    for (const { id } of trainingsWithoutImage) {
      await prisma.training.update({ where: { id }, data: { imageUrl: getRandomImageUrl() } });
    }

    if (trainingsWithoutImage.length > 0) {
      console.warn(
        `  🖼️  Backfilled images for ${trainingsWithoutImage.length} existing trainings.`,
      );
    }

    const exercises = await prisma.exercise.findMany({ select: { id: true } });

    if (exercises.length === 0) {
      console.warn(
        "  ⚠️  No exercises found in the DB — workout blocks will be created without exercises.",
      );
    }

    const exerciseIds = exercises.map((e) => e.id);

    for (let i = 0; i < count; i++) {
      const baseName = TRAINING_NAMES[i % TRAINING_NAMES.length] ?? `Training ${i + 1}`;
      const suffix = Math.floor(i / TRAINING_NAMES.length);
      const name = suffix > 0 ? `${baseName} ${suffix + 1}` : baseName;
      const daysCount = range(3, 7);

      await prisma.training.create({
        data: {
          name,
          description: maybe(faker.lorem.sentences({ min: 1, max: 3 })),
          status: TrainingStatus.PUBLISHED,
          imageUrl: getRandomImageUrl(),
          trainingDays: {
            create: Array.from({ length: daysCount }, (_value, index) => {
              const exercises = Object.values([
                WorkoutBlockType.WARM_UP,
                WorkoutBlockType.MAIN_WORKOUT,
                WorkoutBlockType.COOL_DOWN,
              ])
                .map((workoutBlockType) => {
                  return buildWorkoutExercises(exerciseIds, workoutBlockType);
                })
                .flat();

              return {
                order: index + 1,
                workoutExercises: {
                  create: exercises,
                },
              };
            }),
          },
        },
      });
    }
  },
};
