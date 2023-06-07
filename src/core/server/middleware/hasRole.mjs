/**
 * @typedef {import("fastify").FastifyRequest} FastifyRequest
 * @typedef {import("fastify").FastifyReply} FastifyReply
 * @typedef {import("fastify").DoneFuncWithErrOrRes} DoneFuncWithErrOrRes
 * @typedef {import("@prisma/client").UserRole} UserRole
 */
import { AuthException } from "#src/core/exceptions/index.mjs"
import { requestMeta } from "#src/core/helpers/requestMeta.mjs"

/**
 * @param {UserRole[]} roles
 */
export const hasRole = (...roles) => {
  /**
   * @param {FastifyRequest} req
   * @param {FastifyReply} _reply
   * @param {DoneFuncWithErrOrRes} done
   */
  return (req, _reply, done) => {
    const { userRole } = requestMeta(req)

    /**
     * at least one of the provided roles must be present in the
     * current user's roles
     */
    if (!roles.includes(userRole)) {
      throw AuthException(
        "Only users with authorized roles can access this resource",
      )
    }

    done()
  }
}
