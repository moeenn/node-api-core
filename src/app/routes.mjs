/* eslint-disable-next-line no-unused-vars */
import * as T from "#src/index.d.mjs"
import { AuthController } from "#src/app/domain/auth/index.mjs"

/**
 *  @param {T.Fastify} server
 *
 */
export async function routes(server) {
  server.post("/login", AuthController.login)
}
