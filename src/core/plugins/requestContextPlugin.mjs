import { fastifyRequestContextPlugin } from "@fastify/request-context"
import { authConfig } from "#src/app/config/authConfig.mjs"

/** @typedef {import('@fastify/request-context').FastifyRequestContextOptions} FastifyRequestContextOptions */
/** @typedef {import('fastify').FastifyRegisterOptions<FastifyRequestContextOptions>} Options */

export const requestContextPlugin = {
  plug: fastifyRequestContextPlugin,

  /** @type {Options} */
  options: {
    hook: "preValidation",
    defaultStoreValues: authConfig.authStateDefaults,
  },
}
