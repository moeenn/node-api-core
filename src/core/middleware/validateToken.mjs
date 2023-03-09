/* eslint-disable-next-line no-unused-vars */
import * as t from "#src/index.d.mjs"
import { AuthException } from "#src/core/exceptions/index.mjs"
import { AuthService } from "#src/app/domain/auth/index.mjs"

/** @type {t.Middleware} */
export async function validateToken(req) {
  const token = parseBearerToken(req)
  if (!token) {
    throw AuthException("invalid bearer token")
  }

  const { userId, userRole } = await AuthService.validateLoginAuthToken(token)

  /* store id of the validated user on the request object */
  req.requestContext.set("user", { id: userId, role: userRole, token })
}

/**
 * @param {t.Request} req
 * @returns {string=}
 */
function parseBearerToken(req) {
  const header = req.headers["authorization"]
  if (!header) return

  const token = header.replace("Bearer ", "")
  if (!token) return

  return token
}
