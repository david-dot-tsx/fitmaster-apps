import { checkbox, number } from "@inquirer/prompts";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";

import { exercisesSeeder } from "./seeders/exercises.seeder";
import { trainingsSeeder } from "./seeders/trainings.seeder";
import type { Seeder } from "./seeders/types";
import { usersSeeder } from "./seeders/users.seeder";
import { env } from "../src/env";

const adapter = new PrismaPg({ connectionString: env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

const SEEDERS: Seeder[] = [usersSeeder, exercisesSeeder, trainingsSeeder];

async function main() {
  // eslint-disable-next-line no-console
  console.log("\n🌱  FitMaster — Database Seeder\n");

  const selectedNames = await checkbox({
    message: "Which seeders do you want to run?",
    choices: SEEDERS.map((s) => ({
      name: `${s.name}  —  ${s.description}  (default: ${s.defaultCount})`,
      value: s.name,
      checked: false,
    })),
    required: true,
  });

  const selected = SEEDERS.filter((s) => selectedNames.includes(s.name));

  // Collect counts for every selected seeder upfront
  const counts: Record<string, number> = {};

  for (const seeder of selected) {
    const count = await number({
      message: `How many ${seeder.name.toLowerCase()} to generate?`,
      default: seeder.defaultCount,
      min: 1,
      required: true,
    });

    counts[seeder.name] = count ?? seeder.defaultCount;
  }

  // eslint-disable-next-line no-console
  console.log("");

  for (const seeder of selected) {
    const count = counts[seeder.name]!;

    // eslint-disable-next-line no-console
    console.log(`⏳  Seeding ${count} ${seeder.name.toLowerCase()}…`);

    const start = Date.now();

    await seeder.run({ prisma }, count);

    const elapsed = ((Date.now() - start) / 1000).toFixed(1);

    // eslint-disable-next-line no-console
    console.log(`✅  ${count} ${seeder.name.toLowerCase()} seeded in ${elapsed}s`);
  }

  // eslint-disable-next-line no-console
  console.log("\n🎉  All done!\n");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
