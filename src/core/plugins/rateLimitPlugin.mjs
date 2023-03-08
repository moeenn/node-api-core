/* eslint-disable-next-line no-unused-vars */
import * as T from "#src/index.d.mjs"
import { serverConfig } from "#src/app/config/serverConfig.mjs"
import rateLimit from "@fastify/rate-limit"

/**
 * @typedef Context
 * @property {string} after
 * @property {number} max
 * @property {number} ttl
 */

/**
 * @typedef ExceedResponse
 * @property {number} code
 * @property {string} error
 * @property {string} message
 * @property {number} date
 * @property {number} expiresIn
 */

function rateLimitExceedHandler() {
  /** @type {function(T.Request, Context): ExceedResponse } */
  return (
    /* eslint-disable-next-line no-unused-vars */
    _req,
    context,
  ) => {
    return {
      code: 429,
      error: "too many requests",
      message: `exceeded limit of ${context.max} requests per ${context.after}`,
      date: Date.now(),
      expiresIn: context.ttl, // milliseconds
    }
  }
}

export const rateLimitPlugin = {
  plug: rateLimit,
  options: {
    ...serverConfig.rateLimit,
    errorResponseBuilder: rateLimitExceedHandler(),
  },
}
