/* eslint-disable-next-line no-unused-vars */
import * as T from "#src/index.d.mjs"

export const schema = {
  /** @type {T.Schema} */
  loginRequest: {
    body: {
      type: "object",
      required: ["email", "password"],
      properties: {
        email: { type: "string" },
        password: { type: "string", minLength: 8 },
      },
    },
  },
}
