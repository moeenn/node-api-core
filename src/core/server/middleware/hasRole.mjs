import { FastifyRequest, FastifyReply, DoneFuncWithErrOrRes } from "fastify"
import { AuthException } from "#src/core/exceptions/index.mjs"
import { UserRole } from "@prisma/client"

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