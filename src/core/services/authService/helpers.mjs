/** @typedef {import("@prisma/client").UserRole} UserRole */

import { authConfig } from "#src/app/config/authConfig.mjs"
import { JWT } from "#src/core/helpers/index.mjs"
import {
  BadRequestException,
  ForbiddenException,
} from "#src/core/exceptions/index.mjs"

/**
 *
 * @param {number} delayInSeconds
 * @returns {number}
 */
function calculateTokenExpiry(delayInSeconds) {
  const now = new Date()
  const delayInMs = 1000 * delayInSeconds

  return now.getTime() + delayInMs
}

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
    const { scope, expiry } = authConfig.tokens[type]
    const token = await JWT.generate(authConfig.secret, { userId, scope }, expiry)
    return token
  }
}

/**
 * this function is different from the generateToken function because it also
 * encodes the user role inside the token
 *
 * @typedef {{ token: string, expiry: number}} LoginTokenResult
 *
 * @param {keyof typeof authConfig.tokens} type
 * @returns {(userId: string, userRole: UserRole) => Promise<LoginTokenResult>}
 */
export function generateLoginToken(type) {
  /**
   * @param {string} userId
   * @param {string} userRole
   * @returns {Promise<LoginTokenResult>}
   */
  return async (userId, userRole) => {
    const tokenConfig = authConfig.tokens[type]

    const token = await JWT.generate(
      authConfig.secret,
      { userId, scope: tokenConfig.scope, userRole },
      tokenConfig.expiry,
    )

    const expiry = calculateTokenExpiry(tokenConfig.expiry)
    return { token, expiry }
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
    const jwtPayload = await JWT.validate(authConfig.secret, token)

    const result = /** @type {{ userId?: string; scope?: string }} */ (
      jwtPayload
    )
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
    const jwtPayload = await JWT.validate(authConfig.secret, token)
    if (!jwtPayload) {
      throw ForbiddenException("Invalid or expired token")
    }

    const result =
      /** @type {{ userId: string, scope: string, userRole: string }} */ (
        jwtPayload
      )
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
