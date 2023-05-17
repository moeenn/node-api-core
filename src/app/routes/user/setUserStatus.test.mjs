import { describe, it, after } from "node:test"
import assert from "node:assert/strict"
import { Server } from "#src/core/server/index.mjs"
import { db } from "#src/core/database/index.mjs"
import { UserRole } from "@prisma/client"
import { AuthService } from "#src/core/services/authService/index.mjs"
import { faker } from "@faker-js/faker"

describe("setUserStatus", async () => {
  const server = Server.new()
  const url = "/api/user/set-status"
  const method = "POST"

  after(() => server.close())

  it("valid request", async () => {
    /** setup */
    const admin = await db.user.create({
      data: {
        email: faker.internet.email(),
        name: "Admin",
        staffId: faker.string.alphanumeric(),
        role: UserRole.ADMIN,
      },
    })

    const adminAuthToken = await AuthService.generateLoginAuthToken(
      admin.id,
      admin.role,
    )

    const user = await db.user.create({
      data: {
        email: faker.internet.email(),
        name: "User",
        staffId: faker.string.alphanumeric(),
        role: UserRole.USER,
      },
    })
    /** test */
    const res = await server.inject({
      url,
      method,
      headers: {
        authorization: "Bearer " + adminAuthToken,
      },
      payload: {
        userId: user.id,
        status: false,
      },
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
})
