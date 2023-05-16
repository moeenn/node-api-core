import { db } from "#src/core/database/index.mjs"
import { defaultSeeders } from "#src/app/seeders/defaultSeeders.mjs"

export async function seedRunner() {
  try {
    for (const seeder of defaultSeeders) {
      /**
       * stop seeding at the first error
       */
      await seeder(db)
    }
  } finally {
    await db.$disconnect()
  }
}
