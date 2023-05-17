import { describe, it } from "node:test"
import assert from "node:assert/strict"
import { Server } from "#src/core/server/index.mjs"
import { db } from "#src/core/database/index.mjs"
import { UserRole } from "@prisma/client"
import { AuthService } from "#src/core/services/authService/index.mjs"
import { faker } from "@faker-js/faker"

describe("memoryUsage", () => {
  const server = Server.new()
  const url = "/api/health-check/memory"
  const method = "GET"

  it("admin auth token is required", async () => {
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
      user.role,
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

    /** cleanup */
    await db.user.delete({ where: { id: user.id } })
  })
})
