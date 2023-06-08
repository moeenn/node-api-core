/** @typedef {import("./setUserStatus.schema.mjs").Body} Body */

import { test } from "node:test"
import assert from "node:assert/strict"
import { Server } from "#src/core/server/index.mjs"
import { db } from "#src/core/database/index.mjs"
import { UserRole } from "@prisma/client"
import { AuthService } from "#src/core/services/authService/index.mjs"
import { faker } from "@faker-js/faker"

test("setUserStatus", async (t) => {
  const server = Server.new()
  const url = "/api/user/set-status"
  const method = "POST"

  await t.test("valid request", async () => {
    /** setup */
    const admin = await db.user.create({
      data: {
        email: faker.internet.email(),
        name: faker.internet.userName(),
        role: UserRole.ADMIN,
      },
    })

    const adminAuthToken = await AuthService.generateLoginToken(
      admin.id,
      admin.role,
    )

    const user = await db.user.create({
      data: {
        email: faker.internet.email(),
        name: faker.internet.userName(),
        role: UserRole.USER,
      },
    })

    /** test */
    const res = await server.inject({
      url,
      method,
      headers: {
        authorization: "Bearer " + adminAuthToken.token,
      },
      payload: /** @type {Body} */ ({
        userId: user.id,
        status: false,
      }),
    })

    assert.equal(res.statusCode, 200)
    const foundUser = await db.user.findUnique({
      where: {
        id: user.id,
      },
    })
    assert.ok(foundUser)
    assert.equal(foundUser?.approved, false)

    /** cleanup */
    await db.user.delete({ where: { id: admin.id } })
    await db.user.delete({ where: { id: user.id } })
  })

  server.close()
})
