/** @typedef {import("#src/core/database/seeder/index.mjs").Seeder} Seeder */
import { adminSeeder } from "./adminSeeder.mjs"

/**
 * register all enabled seeders here
 * 
 * @type {Seeder[]}
 */
export const defaultSeeders = [adminSeeder]
