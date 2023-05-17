import { PrismaClient } from "@prisma/client"

/**
 * generally we would have exported prisma client as follows
 * export const database =  new PrismaClient()
 *
 * this works in production, but during testing it leads to multiple
 * prisma client instantiations, using up excessive memory and slowing down
 * the tests.
 *
 * the following code only allows one instance of the prisma client to be
 * instantiated
 */

/** @type {PrismaClient} */
let db

if (process.env.NODE_ENV === "production") {
  db = new PrismaClient()
} else {
  if (!/** @type {any} */ (global).databaseInstance) {
    (/** @type {any} */ (global)).databaseInstance = new PrismaClient()
  }
  db = /** @type {any} */ (global).databaseInstance
}
export { db }

/**
 * check if database is successfully connected with the application
 *
 * @param {PrismaClient} client
 * @returns {Promise<boolean>}
 */
export async function ping(client) {
  try {
    await client.$queryRawUnsafe("SELECT 1")
  } catch (_) {
    return false
  }
  return true
}
