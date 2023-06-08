/** @typedef {import("./updateUserProfile.schema.mjs").Body} Body */

import { test } from "node:test"
import assert from "node:assert/strict"
import { Server } from "#src/core/server/index.mjs"
import { db } from "#src/core/database/index.mjs"
import { UserRole } from "@prisma/client"
import { AuthService } from "#src/core/services/authService/index.mjs"
import { faker } from "@faker-js/faker"

test("updateUserProfile", async (t) => {
  const server = Server.new()
  const url = "/api/user/profile"
  const method = "PUT"

  await t.test("valid request", async () => {
    /** setup */
    const user = await db.user.create({
      data: {
        email: faker.internet.email(),
        name: faker.internet.userName(),

        role: UserRole.USER,
      },
    })
    const authToken = await AuthService.generateLoginToken(user.id, user.role)

    /** test */
    const updatedName = "Updated Name"
    const res = await server.inject({
      url,
      method,
      headers: {
        authorization: "Bearer " + authToken.token,
      },
      payload: /** @type {Body} */ ({
        name: updatedName,
      }),
    })
    assert.equal(res.statusCode, 200)

    const updatedUser = await db.user.findUnique({
      where: { id: user.id },
    })
    assert.equal(updatedUser?.name, updatedName)

    /** cleanup */
    await db.user.delete({ where: { id: user.id } })
  })

  server.close()
})
