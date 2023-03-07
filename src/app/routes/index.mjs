/* eslint-disable-next-line no-unused-vars */
import * as T from "#src/index.d.mjs"
import { UserController } from "#src/app/domain/user/index.mjs"

/**
 *  @param {T.Fastify} server
 *
 */
export async function routes(server) {
  server.get("/", UserController.allUsers)
}
