import { db } from "#src/core/database/index.mjs"
import {
  AuthException,
  BadRequestException,
} from "#src/core/exceptions/index.mjs"
import { Password } from "#src/core/helpers/password.mjs"
import { AuthService } from "#src/core/services/authService/index.mjs"
import { bodySchema } from "./login.schema.mjs"

/** @type {import("fastify").RouteOptions} */
export const login = {
  url: "/login",
  method: "POST",
  config: {
    rateLimit: {
      max: 10,
      timeWindow: 1000 * 60 /* 1 minute */,
    },
  },
  schema: {
    body: bodySchema,
  },
  handler: async (req) => {
    const body = /** @type {import("./login.schema.mjs").Body} */ (req.body)

    const user = await db.user.findFirst({
      where: {
        email: body.email,
      },
      include: {
        password: true,
      },
    })

    if (!user)
      throw AuthException("Invalid email or password", {
        email: body.email,
        message: "login against non-existent user",
      })

    if (!user.password)
      throw BadRequestException("Account not configured", {
        email: body.email,
        message: "failed login against non-configured account",
      })

    if (!user.approved) {
      throw BadRequestException("User account disabled by admin", {
        email: body.email,
        message: "failed login against disabled account",
      })
    }

    /** validate the actual password */
    const isValid = await Password.verify(user.password.hash, body.password)
    if (!isValid) {
      throw AuthException("Invalid email or password", {
        email: body.email,
        message: "invalid login password",
      })
    }

    const token = await AuthService.generateLoginToken(user.id, user.role)

    return {
      message: "Login successful",
      user: Object.assign(user, { password: undefined }),
      token,
    }
  },
}
