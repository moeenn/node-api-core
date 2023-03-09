/* eslint-disable-next-line no-unused-vars */
import * as t from "#src/index.d.mjs"
import { AuthException } from "#src/core/exceptions/index.mjs"

/**
 * @param {t.UserRole[]} roles
 * @returns {t.Middleware}
 */
export function hasRole(...roles) {
  /** @type {t.Middleware} */
  return (req, reply, done) => {
    const { userRole } = req.requestContext.get("user")

    /**
     * at least one of the provided roles must be present in the
     * current user's roles
     */
    if (!roles.includes(userRole)) {
      throw AuthException("only authorized roles can access this resource", {
        authorized_roles: roles,
      })
    }

    done()
  }
}
