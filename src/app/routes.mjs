/* eslint-disable-next-line no-unused-vars */
import * as t from "#src/index.d.mjs"
import { Auth } from "#src/app/domain/auth/index.mjs"
import { User } from "#src/app/domain/user/index.mjs"

/** @param {t.Fastify} server */
export async function routes(server) {
  server.post("/login", Auth.controller.login)
  server.post("/register", User.controller.create)
  server.post("/set-password", User.controller.setPassword)
  server.post("/set-status", User.controller.setStatus)
  server.post("/profile", User.controller.updateProfile)
  server.delete("/user/:id", User.controller.remove)
}
