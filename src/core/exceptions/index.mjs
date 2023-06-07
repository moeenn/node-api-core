import createError from "@fastify/error"

/**
 * @param {string} code
 * @param {number} statusCode
 */
function generateError(code, statusCode) {
  /** @param {string} message */
  return (message) => {
    const ex = createError(code, message, statusCode)
    return new ex()
  }
}

export const BadRequestException = generateError("BAD_REQUEST", 400)
export const AuthException = generateError("UNAUTHORIZED", 401)
export const ForbiddenException = generateError("FORBIDDEN", 403)
export const NotFoundException = generateError("NOT_FOUND", 404)
export const ValidationException = generateError("UNPROCESSABLE_ENTITY", 422)
