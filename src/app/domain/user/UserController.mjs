/* eslint-disable-next-line no-unused-vars */
import * as T from "#src/index.d.mjs"

export const UserController = {
  /** @param {T.Request} req */
  async allUsers(req) {
    return {
      message: "hello from controller",
      request: req.ip,
    }
  },
}
