import { Seeder } from "#src/core/database/seeder/index.mjs"
import { adminSeeder } from "./adminSeeder.mjs"

/**
 * register all enabled seeders here
 * 
 * @type {Seeder[]}
 */
export const defaultSeeders = [adminSeeder]
