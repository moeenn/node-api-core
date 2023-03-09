/* eslint-disable-next-line no-unused-vars */
import * as T from "#src/index.d.mjs"
import { schema } from "./Auth.schema.mjs"

export const AuthController = {
  /** @type {T.Route} */
  login: {
    schema: schema.loginRequest,
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
