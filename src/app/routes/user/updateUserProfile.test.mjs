import { describe, it, expect, afterAll } from "vitest"
import { Server } from "#src/core/server"
import { db } from "#src/core/database/index.mjs"
import { UserRole } from "@prisma/client"
import { AuthService } from "#src/core/services/authService/index.mjs"

describe("updateUserProfile", () => {
  const server = Server.new()
  const url = "/api/user/profile"
  const method = "PUT"

  afterAll(() => server.close())

  it("valid request", async () => {
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
    const updatedName = "Updated Name"
    const res = await server.inject({
      url,
      method,
      headers: {
        authorization: "Bearer " + authToken,
      },
      payload: {
        name: updatedName,
      },
    })
    expect(res.statusCode).toBe(200)

    const updatedUser = await db.user.findUnique({
      where: { id: user.id },
    })
    expect(updatedUser?.name).toBe(updatedName)

    /** cleanup */
    await db.user.delete({ where: { id: user.id } })
  })
})
