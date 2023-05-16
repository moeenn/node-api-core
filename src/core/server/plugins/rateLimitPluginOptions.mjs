import { FastifyRequest } from "fastify"
import { serverConfig } from "#src/app/config/serverConfig.mjs"

function rateLimitExceedHandler() {
  /** 
   * @param {FastifyRequest} _req
   * @param {{ after: string; max: number; ttl: number }} context
   */
  const handler = (
    /* eslint-disable-next-line @typescript-eslint/no-unused-vars */
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

  return handler
}

export const rateLimitPluginOptions = {
  ...serverConfig.rateLimit,
  errorResponseBuilder: rateLimitExceedHandler(),
}
