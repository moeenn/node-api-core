/** @typedef {import("#src/core/database/seeder/index.mjs").Seeder} Seeder */
import { UserRole } from "@prisma/client"
import { Password } from "#src/core/helpers/password.mjs"

/** @type {Seeder} */
export const adminSeeder = async (client) => {
  await client.user.create({
    data: {
      name: "Admin",
      email: "admin@site.com",
      role: UserRole.ADMIN,
      password: {
        create: {
          hash: await Password.hash("123_Orangez"),
        },
      },
    },
  })
}
