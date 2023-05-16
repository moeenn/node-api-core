/**
 * @typedef {import("fastify").FastifyRequest} FastifyRequest
 * @typedef {import("fastify").FastifyReply} FastifyReply
 * @typedef {import("fastify").DoneFuncWithErrOrRes} DoneFuncWithErrOrRes
 */
import { AuthException } from "#src/core/exceptions/index.mjs"

/* eslint-disable-next-line no-unused-vars */
import * as t from "#src/index.d.mjs"

/** 
 * @param {t.UserRole[]} roles
 */
export const hasRole = (...roles) => {

  /**
   * @param {FastifyRequest} req
   * @param {FastifyReply} _reply
   * @param {DoneFuncWithErrOrRes} done
   */
  return (req, _reply, done) => {
    const currentRole = req.requestContext.get("userRole")

    /**
     * at least one of the provided roles must be present in the
     * current user's roles
     */
    if (!roles.includes(currentRole)) {
      throw AuthException(
        "Only users with authorized roles can access this resource",
      )
    }

    done()
  }
}
