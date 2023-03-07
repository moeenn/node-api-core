/* eslint-disable-next-line no-unused-vars */
import * as T from "#src/index.d.mjs"

export const AuthController = {
  /** @type {T.Route} */
  login: {
    schema: {
      body: {
        type: "object",
        required: ["email", "password"],
        properties: {
          email: { type: "string" },
          password: { type: "string", minLength: 8 },
        },
      },
    },
    handler: async (req) => {
      /** @type {any} */
      const body = req.body

      return {
        message: "user login successful",
        body,
      }
    },
  },
}
