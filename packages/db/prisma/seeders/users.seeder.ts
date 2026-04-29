import { faker } from "@faker-js/faker";
import { Gender, Role } from "@prisma/client";

import type { Seeder, SeederContext } from "./types";

const getRandomImageUrl = (): string => {
  const id = Math.floor(Math.random() * 1024) + 1;

  return `https://picsum.photos/id/${id}/1024/1024`;
};

const maybe = <T>(value: T): T | null => (Math.random() > 0.5 ? value : null);

export const usersSeeder: Seeder = {
  name: "Users",
  description: "Creates users with profiles and customer profiles",
  defaultCount: 50,

  async run({ prisma }: SeederContext, count: number) {
    for (let i = 0; i < count; i++) {
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
  },
};
