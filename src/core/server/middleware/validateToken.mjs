/** @typedef {import("fastify").FastifyRequest} FastifyRequest */
import { AuthException } from "#src/core/exceptions/index.mjs"
import { AuthService } from "#src/core/services/authService/index.mjs"

/** @param {FastifyRequest} req */
export const validateToken = async (req) => {
  const token = parseBearerToken(req)
  if (!token) {
    throw AuthException("Invalid bearer token")
  }

  const { userId, userRole } = await AuthService.validateLoginToken(token)

  /* store id of the validated user on the request object */
  req.requestContext.set(/** @type never */("userId"), /** @type never */(userId))
  req.requestContext.set(/** @type never */("userRole"), /** @type never */(userRole))
}

/**
 *
 * @param {FastifyRequest} req
 * @returns {string | undefined}
 */
function parseBearerToken(req) {
  const header = req.headers["authorization"]
  if (!header) return

  const token = header.replace("Bearer ", "")
  if (!token) return

  return token
}
