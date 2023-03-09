/* eslint-disable-next-line no-unused-vars */
import * as t from "#src/index.d.mjs"
import { schema } from "./Auth.schema.mjs"

export const controller = {
  /** @type {t.Route} */
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
