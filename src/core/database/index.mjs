import { PrismaClient } from "@prisma/client"
export const database = new PrismaClient()

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
