import { authConfig } from "#src/app/config/authConfig.mjs"
import { JWT, env } from "#src/core/helpers/index.mjs"
import { BadRequestException, ForbiddenException } from "#src/core/exceptions/index.mjs"

/* eslint-ignore-next-line no-unused-vars */
import * as t from "#src/index.d.mjs"

/**
 * 
 * @param {keyof typeof authConfig.tokens} type 
 * @returns {(userId: string) => Promise<string>}
 */
export function generateGeneralToken(type) {

  /** 
   * @param {string} userId
   * @returns {Promise<string>}
  */
  return async (userId) => {
    const jwtSecret = env("JWT_SECRET")
    const { scope, expiry } = authConfig.tokens[type]

    const token = await JWT.generate(jwtSecret, { userId, scope }, expiry)
    return token
  }
}

/**
 * this function is different from the generateToken function because it also
 * encodes the user role inside the token
 * 
 * @param {keyof typeof authConfig.tokens} type 
 * @returns {(userId: string, userRole: t.UserRole) => Promise<string>}
 */
export function generateLoginToken(type) {

  /** 
   * @param {string} userId
   * @param {string} userRole
   * @returns {Promise<string>}
  */
  return async (userId, userRole) => {
    const jwtSecret = env("JWT_SECRET")
    const { scope, expiry } = authConfig.tokens[type]

    const token = await JWT.generate(
      jwtSecret,
      { userId, scope, userRole },
      expiry,
    )
    return token
  }
}

/**
 * 
 * @param {keyof typeof authConfig.tokens} type 
 * @returns {(token: string) => Promise<string>}
 */
export function validateGeneralToken(type) {

  /**
   * @param {string} token
   * @returns {Promise<string>}
   */
  return async (token) => {
    const jwtPayload = await JWT.validate(env("JWT_SECRET"), token)

    const result = /** @type {{ userId?: string; scope?: string }} */ (jwtPayload)
    const scope = authConfig.tokens[type].scope

    if (!result || !result.userId || !result.scope || result.scope !== scope) {
      throw BadRequestException("Invalid auth token")
    }

    return result.userId
  }
}

/**
 * this function is different from the generateToken function because it also
 * encodes the user role inside the token
 *
 * @param {keyof typeof authConfig.tokens} type
 * @returns {(token: string) => Promise<{ userId: string; userRole: string }>}
 */
export function validateLoginToken(type) {

  /** 
   * @param {string} token
   * @returns {Promise<{ userId: string; userRole: string }>}
   */
  return async (token) => {
    const jwtPayload = await JWT.validate(env("JWT_SECRET"), token)
    if (!jwtPayload) {
      throw ForbiddenException("Invalid or expired token")
    }

    const result = /** @type {{ userId: string, scope: string, userRole: string }} */ (jwtPayload)
    const scope = authConfig.tokens[type].scope

    if (!result || !result.userId || !result.scope || result.scope !== scope) {
      throw BadRequestException("Invalid password token")
    }

    return {
      userId: result.userId,
      userRole: result.userRole,
    }
  }
}
