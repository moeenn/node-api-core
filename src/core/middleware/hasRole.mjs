/* eslint-disable-next-line no-unused-vars */
import * as T from "#src/index.d.mjs"
import { AuthException } from "#src/core/exceptions/index.mjs"

/**
 * @param {string[]} roles
 * @returns {T.Middleware}
 */
export function hasRole(...roles) {
  /** @type {T.Middleware} */
  return (req, reply, done) => {
    const currentRole = req.requestContext.get("userRole")

    /**
     * at least one of the provided roles must be present in the
     * current user's roles
     */
    if (!roles.includes(currentRole)) {
      throw AuthException("only authorized roles can access this resource", {
        authorized_roles: roles,
      })
    }

    done()
  }
}
