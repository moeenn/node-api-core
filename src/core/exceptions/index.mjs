import createError from "@fastify/error"

/**
 * @param {string} code
 * @param {number} statusCode
 * @returns {function (string, unknown=) }
 */
function generateError(code, statusCode) {
  return (message, details) => {
    const json = JSON.stringify({ message, details })
    const ex = createError(code, json, statusCode)
    return new ex()
  }
}

export const BadRequestException = generateError("BAD_REQUEST", 400)
export const ForbiddenException = generateError("FORBIDDEN", 403)
export const AuthException = generateError("AUTH_ERROR", 401)
export const NotFoundException = generateError("NOT_FOUND_ERROR", 404)
