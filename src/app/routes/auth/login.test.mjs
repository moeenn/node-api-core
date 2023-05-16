/**
 * @typedef {import("@prisma/client").User} User
 * @typedef {import("@prisma/client").Password} Password
 */

import { describe, it } from "node:test"
import assert from "node:assert"
import { db } from "#src/core/database/index.mjs"
import { Password as Pwd } from "#src/core/helpers/password.mjs"
import { Server } from "#src/core/server/index.mjs"
import { AuthService } from "#src/core/services/authService/index.mjs"

describe("login", () => {
  const server = Server.new()
  const url = "/api/login"
  const method = "POST"

  it("valid credentials", async () => {
    /** setup */
    const password = "123123123123"
    const user = await db.user.create({
      data: {
        email: "user@site.com",
        name: "Mr. User",
        staffId: "AB100",
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
        password: password,
      },
    })

    assert.equal(res.statusCode, 200)
    const body = /**
      @type {{
      user: User
      password: Password
      token: string
    }}
    */ (JSON.parse(res.body))

    assert.ok(body.user)
    assert.equal(body.password, undefined)
    assert.ok(body.token)

    const result = await AuthService.validateLoginAuthToken(body.token)
    assert.equal(result.userId, user.id)
    assert.equal(result.userRole, user.role)

    /** cleanup */
    await db.user.delete({ where: { id: user.id } })
  })

  it("invalid credentials", async () => {
    const res = await server.inject({
      url,
      method,
      payload: {
        email: "non-existent-user@site.com",
        password: "some-random-wrong-password",
      },
    })

    assert.equal(res.statusCode, 401)
  })
})
