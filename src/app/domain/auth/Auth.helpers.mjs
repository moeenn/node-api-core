/* eslint-disable-next-line no-unused-vars */
import * as t from "#src/index.d.mjs"
import { authConfig } from "#src/app/config/authConfig.mjs"
import { JWT, env } from "#src/core/helpers/index.mjs"
import { BadRequestException, ForbiddenException } from "#src/core/exceptions/index.mjs"

export const helpers = {
  /**
   * @param {t.TokenTypes} type
   * @returns {function(number): Promise<string>} 
  */
  generateToken(type) {
    return async (userId) => {
      const jwtSecret = env("JWT_SECRET")
      const { scope, expiry } = authConfig.tokens[type]

      const token = await JWT.generate({
        secret: jwtSecret,
        payload: { userId, scope },
        expiredInSeconds: expiry,  
      })

      return token
    }
  },

  /**
   * this function is different from the generateToken function because it also
   * encodes the user role inside the token
   * 
   * @param {t.TokenTypes} type
   * @returns {function (number, t.UserRole): Promise<string>}  
   */
  generateLoginToken(type) {
    return async (userId, userRole) => {
      const jwtSecret = env("JWT_SECRET")
      const { scope, expiry } = authConfig.tokens[type]

      const token = await JWT.generate({
        secret: jwtSecret,
        payload: { userId, scope, userRole },
        expiredInSeconds: expiry,  
      })

      return token
    }
  },

  /**
   * @param {t.TokenTypes} type
   * @returns {function (string): Promise<string>}
  */
  validateToken(type) {
    return async (token) => {
      const jwtPayload = await JWT.validate({
        secret: env("JWT_SECRET"), 
        token,
      })

      const scope = authConfig.tokens[type].scope
      if (!jwtPayload.userId || !jwtPayload.scope || jwtPayload.scope !== scope) {
        throw BadRequestException("invalid password token")
      }

      return jwtPayload.userId
    }
  },

  /**
   *  this function is different from the generateToken function because it also
   *  encodes the user role inside the token
   *
   */
  validateLoginToken(
    type: keyof typeof authConfig.tokens,
  ): (token: string) => Promise<{ userId: number; userRole: string }> {
    return async (
      token: string,
    ): Promise<{ userId: number; userRole: string }> => {
      const jwtPayload = await JWT.validate(env("JWT_SECRET"), token)
      if (!jwtPayload) {
        throw ForbiddenException("invalid or expired token")
      }

      const result = jwtPayload as {
        userId: number
        scope: string
        userRole: string
      }
      const scope = authConfig.tokens[type].scope

      if (!result.userId || !result.scope || result.scope !== scope) {
        throw BadRequestException("invalid password token")
      }

      return {
        userId: result.userId,
        userRole: result.userRole,
      }
    }
  },


}