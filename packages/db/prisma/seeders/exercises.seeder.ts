import { faker } from "@faker-js/faker";

import { BodyPart, Difficulty } from "../../generated/prisma/client";
import type { Seeder, SeederContext } from "./types";

const getRandomImageUrl = (): string => {
  const id = Math.floor(Math.random() * 1024) + 1;

  return `https://picsum.photos/id/${id}/1024/1024`;
};

const maybe = <T>(value: T): T | null => (Math.random() > 0.5 ? value : null);

const pick = <T>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)]!;

const EXERCISE_NAMES: Record<BodyPart, string[]> = {
  CHEST: [
    "Bench Press",
    "Incline Bench Press",
    "Decline Bench Press",
    "Push-up",
    "Wide Push-up",
    "Diamond Push-up",
    "Chest Fly",
    "Cable Crossover",
    "Pec Deck",
    "Dumbbell Pullover",
    "Chest Dip",
    "Svend Press",
  ],
  SHOULDERS: [
    "Overhead Press",
    "Arnold Press",
    "Lateral Raise",
    "Front Raise",
    "Rear Delt Fly",
    "Upright Row",
    "Face Pull",
    "Shrug",
    "Cable Lateral Raise",
    "Machine Shoulder Press",
    "Push Press",
  ],
  BACK: [
    "Pull-up",
    "Chin-up",
    "Deadlift",
    "Romanian Deadlift",
    "Bent-over Row",
    "T-bar Row",
    "Seated Cable Row",
    "Lat Pulldown",
    "Single-arm Dumbbell Row",
    "Pendlay Row",
    "Good Morning",
    "Superman",
  ],
  ARMS: [
    "Bicep Curl",
    "Hammer Curl",
    "Concentration Curl",
    "Preacher Curl",
    "Incline Dumbbell Curl",
    "Tricep Pushdown",
    "Skull Crusher",
    "Overhead Tricep Extension",
    "Close-grip Bench Press",
    "Parallel Bar Dip",
    "Zottman Curl",
    "Reverse Curl",
  ],
  LEGS: [
    "Back Squat",
    "Front Squat",
    "Bulgarian Split Squat",
    "Leg Press",
    "Hack Squat",
    "Lunge",
    "Walking Lunge",
    "Leg Extension",
    "Leg Curl",
    "Calf Raise",
    "Hip Thrust",
    "Glute Bridge",
    "Step-up",
    "Nordic Curl",
  ],
};

const difficulties = Object.values(Difficulty);
const bodyParts = Object.values(BodyPart);

export const exercisesSeeder: Seeder = {
  name: "Exercises",
  description: "Creates exercises with difficulty, body part and description",
  defaultCount: 30,

  async run({ prisma }: SeederContext, count: number) {
    const existingNames = new Set(
      (await prisma.exercise.findMany({ select: { name: true } })).map((e) => e.name),
    );

    for (let i = 0; i < count; i++) {
      const bodyPart = pick(bodyParts);
      const names = EXERCISE_NAMES[bodyPart];
      const baseName = pick(names);

      let name = baseName;
      let variant = 1;

      while (existingNames.has(name)) {
        name = `${baseName} (Variant ${variant++})`;
      }

      existingNames.add(name);

      const difficulty = pick(difficulties);

      await prisma.exercise.create({
        data: {
          name,
          difficulty,
          bodyPart,
          description: maybe(faker.lorem.sentence({ min: 10, max: 50 })),
          imageUrl: getRandomImageUrl(),
        },
      });
    }
  },
};
