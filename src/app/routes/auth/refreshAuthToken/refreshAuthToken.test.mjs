import { test } from "node:test"
import assert from "node:assert/strict"
import { db } from "#src/core/database/index.mjs"
import { Server } from "#src/core/server/index.mjs"
import { faker } from "@faker-js/faker"
import { AuthService } from "#src/core/services/authService/index.mjs"

test("refreshAuthToken", async (t) => {
  const server = Server.new()
  const url = "/api/auth/refresh-auth-token"
  const method = "GET"

  const user = await db.user.create({
    data: {
      email: faker.internet.email(),
      name: faker.internet.userName(),
    },
  })

  const userToken = await AuthService.generateLoginToken(user.id, user.role)

  await t.test("valid request", async () => {
    /** sleep */
    await new Promise((resolve) => setTimeout(resolve, 500))

    const res = await server.inject({
      url,
      method,
      headers: {
        authorization: "Bearer " + userToken.token,
      },
    })

    assert.equal(res.statusCode, 200)
    const body = /** @type {{ token: string, expiry: number }} */ (
      JSON.parse(res.body)
    )
    assert.ok(body.token !== userToken.token)
    assert.ok(body.expiry > userToken.expiry)
  })

  await t.test("disabled user", async () => {
    /** setup */
    await db.user.update({
      where: { id: user.id },
      data: { approved: false },
    })

    /** sleep */
    await new Promise((resolve) => setTimeout(resolve, 500))

    /** test */
    const res = await server.inject({
      url,
      method,
      headers: {
        authorization: "Bearer " + userToken.token,
      },
    })

    assert.equal(res.statusCode, 401)
    const body = /** @type {{ message: string }} */ (JSON.parse(res.body))
    assert.ok(body.message.includes("Cannot"))
  })

  await db.user.delete({ where: { id: user.id } })
  server.close()
})
