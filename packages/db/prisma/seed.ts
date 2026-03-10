import { faker } from "@faker-js/faker";
import { PrismaPg } from "@prisma/adapter-pg";

import { Gender, PrismaClient, Role } from "../generated/prisma/client";

const adapter = new PrismaPg({ connectionString: process.env["DATABASE_URL"]! });
const prisma = new PrismaClient({ adapter });

const getRandomImageUrl = (): string => {
  const id = Math.floor(Math.random() * 1024) + 1;

  return `https://picsum.photos/id/${id}/1024/1024`;
};

const maybe = <T>(value: T): T | null => (Math.random() > 0.5 ? value : null);

const SEED_COUNT = 100;

async function main() {
  // eslint-disable-next-line no-console
  console.log(`Seeding ${SEED_COUNT} users…`);

  for (let i = 0; i < SEED_COUNT; i++) {
    const sex = faker.person.sexType();
    const firstName = faker.person.firstName(sex);
    const lastName = faker.person.lastName();
    const gender = sex === "male" ? Gender.MALE : Gender.FEMALE;

    await prisma.user.create({
      data: {
        email: faker.internet.email({ firstName, lastName }).toLowerCase(),
        role: Role.CUSTOMER,
        passwordHash: null,
        profile: {
          create: {
            nickname: faker.internet.username({ firstName, lastName }).slice(0, 20),
            firstName: maybe(firstName),
            lastName: maybe(lastName),
            bio: maybe(faker.lorem.sentence({ min: 5, max: 200 })),
            birthDate: faker.date.birthdate({ min: 18, max: 60, mode: "age" }),
            gender,
            imageUrl: maybe(getRandomImageUrl()),
            customerProfile: {
              create: {
                height: faker.number.int({ min: 155, max: 210 }),
                weight: faker.number.int({ min: 50, max: 130 }),
                goal: maybe(faker.lorem.sentence({ min: 5, max: 200 })),
                totalPoints: faker.number.int({ min: 0, max: 100000 }),
              },
            },
          },
        },
      },
    });
  }

  // eslint-disable-next-line no-console
  console.log(`✅ Seeded ${SEED_COUNT} users with profiles and customer profiles.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
