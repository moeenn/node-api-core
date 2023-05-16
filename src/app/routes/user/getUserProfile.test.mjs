import { describe, it, expect, afterAll } from "vitest"
import { Server } from "#src/core/server"
import { db } from "#src/core/database/index.mjs"
import { UserRole } from "@prisma/client"
import { AuthService } from "#src/core/services/authService/index.mjs"

describe("getUserProfile", () => {
  const server = Server.new()
  const url = "/api/user/profile"
  const method = "GET"

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

    expect(res.statusCode).toBe(200)

    const body = JSON.parse(res.body)
    expect(body.email).toBe(user.email)
    expect(body.role).toBe(user.role)

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
    expect(res.statusCode).toBe(401)
  })

  it("invalid token", async () => {
    const res = await server.inject({
      url,
      method,
      headers: {
        authorization: "Bearer some_random_token",
      },
    })
    expect(res.statusCode).toBe(403)
  })
})
