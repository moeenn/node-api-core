import { describe, it, expect, afterAll } from "vitest"
import { Server } from "#src/core/server"
import { db } from "#src/core/database/index.mjs"
import { UserRole } from "@prisma/client"
import { AuthService } from "#src/core/services/authService/index.mjs"

describe("memoryUsage", () => {
  const server = Server.new()
  const url = "/api/health-check/memory"
  const method = "GET"

  afterAll(() => server.close())

  it("admin auth token is required", async () => {
    /** setup */
    const user = await db.user.create({
      data: {
        email: "user@site.com",
        name: "User",
        staffId: "AB100",
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
    expect(res.statusCode).toBe(401)

    /** cleanup */
    await db.user.delete({ where: { id: user.id } })
  })
})
