import { authConfig } from "#src/app/config/authConfig.mjs"

/**
 * @typedef {import("@fastify/request-context").FastifyRequestContextOptions} FastifyRequestContextOptions
 * @typedef {import("fastify").FastifyRegisterOptions<FastifyRequestContextOptions>} FastifyRegisterOptions
 * @typedef {FastifyRegisterOptions} Options
 */

/** @type {Options} */
export const requestContextPluginOptions = {
  hook: "preValidation",
  defaultStoreValues: authConfig.authStateDefaults,
}
