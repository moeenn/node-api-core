import { describe, it } from "node:test"
import assert from "node:assert/strict"
import { Server } from "#src/core/server/index.mjs"
import { db } from "#src/core/database/index.mjs"
import { UserRole } from "@prisma/client"
import { AuthService } from "#src/core/services/authService/index.mjs"
import { faker } from "@faker-js/faker"

describe("getUserProfile", () => {
  const server = Server.new()
  const url = "/api/user/profile"
  const method = "GET"

  it("valid request", async () => {
    /** setup */
    const user = await db.user.create({
      data: {
        email: faker.internet.email(),
        name: "User",
        staffId: faker.string.alphanumeric(),
        role: UserRole.USER,
      },
    })
    const authToken = await AuthService.generateLoginAuthToken(
      user.id,
      UserRole.USER,
    )

    /** test */
    const res = await server.inject({
      url,
      method,
      headers: {
        authorization: "Bearer " + authToken,
      },
    })

    assert.equal(res.statusCode, 200)
    const body = JSON.parse(res.body)

    assert.equal(body.email, user.email)
    assert.equal(body.role, user.role)

    /** cleanup */
    await db.user.delete({ where: { id: user.id } })
  })

  it("invalid token", async () => {
    /** setup */
    const authToken = await AuthService.generateLoginAuthToken(
      "5000",
      UserRole.USER,
    )

    /** test */
    const res = await server.inject({
      url,
      method,
      headers: {
        authorization: "Bearer " + authToken,
      },
    })
    assert.equal(res.statusCode, 401)
  })

  it("invalid token", async () => {
    const res = await server.inject({
      url,
      method,
      headers: {
        authorization: "Bearer some_random_token",
      },
    })
    assert.equal(res.statusCode, 403)
  })
})
