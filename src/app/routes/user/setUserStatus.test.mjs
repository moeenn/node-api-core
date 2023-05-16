import { describe, it, expect, afterAll } from "vitest"
import { Server } from "#src/core/server"
import { db } from "#src/core/database/index.mjs"
import { UserRole } from "@prisma/client"
import { AuthService } from "#src/core/services/authService/index.mjs"

describe("setUserStatus", async () => {
  const server = Server.new()
  const url = "/api/user/set-status"
  const method = "POST"

  const admin = await db.user.create({
    data: {
      email: "admin@site.com",
      name: "Admin",
      staffId: "AB100",
      role: UserRole.ADMIN,
    },
  })
  const adminAuthToken = await AuthService.generateLoginAuthToken(
    admin.id,
    admin.role,
  )

  afterAll(async () => {
    await db.user.delete({ where: { id: admin.id } })
    server.close()
  })

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
    expect(res.statusCode).toBe(200)

    const foundUser = await db.user.findUnique({
      where: {
        id: user.id,
      },
    })
    expect(foundUser).toBeTruthy()
    expect(foundUser?.approved).toBe(false)

    /** cleanup */
    await db.user.delete({ where: { id: user.id } })
  })
})
