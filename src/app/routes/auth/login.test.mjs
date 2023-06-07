/**
 * @typedef {import("@prisma/client").User} User
 * @typedef {import("@prisma/client").Password} Password
 */

import { test } from "node:test"
import assert from "node:assert"
import { db } from "#src/core/database/index.mjs"
import { Password as Pwd } from "#src/core/helpers/password.mjs"
import { Server } from "#src/core/server/index.mjs"
import { AuthService } from "#src/core/services/authService/index.mjs"
import { faker } from "@faker-js/faker"

test("login", async t => {
  const server = Server.new()
  const url = "/api/login"
  const method = "POST"

  await t.test("valid credentials", async () => {
    /** setup */
    const password = "123123123123"
    const user = await db.user.create({
      data: {
        email: faker.internet.email(),
        name: faker.internet.userName(),
        password: {
          create: {
            hash: await Pwd.hash(password),
          },
        },
      },
    })

    /** test */
    const res = await server.inject({
      url,
      method,
      payload: {
        email: user.email,
        password,
      },
    })

    assert.equal(res.statusCode, 200)
    const body = /**
      @type {{
      user: User
      password: Password
      token: { token: string, expiry: number }
    }}
    */ (JSON.parse(res.body))

    assert.ok(body.user)
    assert.equal(body.password, undefined)
    assert.ok(body.token)

    const result = await AuthService.validateLoginAuthToken(body.token.token)
    assert.equal(result.userId, user.id)
    assert.equal(result.userRole, user.role)

    /** cleanup */
    await db.user.delete({ where: { id: user.id } })
  })

  await t.test("invalid credentials", async () => {
    const res = await server.inject({
      url,
      method,
      payload: {
        email: faker.internet.email(),
        password: faker.internet.password(),
      },
    })

    assert.equal(res.statusCode, 401)
  })
})
