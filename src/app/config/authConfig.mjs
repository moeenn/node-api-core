import { env } from "#src/core/helpers/env.mjs"

export const authConfig = {
  /** secret for signing tokens */
  secret: env("APP_SECRET"),
  password: {
    minLength: 10 /* 10 is min required by OWASP */,
  },
  /**
   * set expiry time for different token (in seconds)
   * undefined means never expires
   */
  tokens: {
    auth: { scope: "AUTH", expiry: 60 * 60 * 12 },
    firstPassword: { scope: "FIRST_PASSWORD", expiry: 60 * 60 * 72 },
    passwordReset: { scope: "RESET_PASSWORD", expiry: 60 * 15 },
  },
  /**
   * fastify requires that keys (with default values) for all request context
   * variables should be defined ahead of time
   */
  authStateDefaults: {
    userId: "",
    userRole: "",
  },
}
