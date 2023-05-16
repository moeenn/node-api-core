import { FastifyRegisterOptions } from "fastify"
import { FastifyRequestContextOptions } from "@fastify/request-context"
import { authConfig } from "#src/app/config/authConfig.mjs"

/** @typedef {FastifyRegisterOptions<FastifyRequestContextOptions>} Options */

/** @type {Options} */
export const requestContextPluginOptions = {
  hook: "preValidation",
  defaultStoreValues: authConfig.authStateDefaults,
}
