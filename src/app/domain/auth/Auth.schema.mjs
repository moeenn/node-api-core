/* eslint-disable-next-line no-unused-vars */
import * as t from "#src/index.d.mjs"

export const schema = {
  /** @type {t.Schema} */
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
