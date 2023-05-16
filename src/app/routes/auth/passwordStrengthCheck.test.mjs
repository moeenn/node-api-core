import { describe, it, expect, afterAll } from "vitest"
import { Server } from "#src/core/server"

describe("passwordStrengthCheck", async () => {
  const server = Server.new()
  const url = "/api/password-strength"
  const method = "POST"

  afterAll(() => server.close())

  it("strong password", async () => {
    const payload = {
      password: "!@#abc#$%Ac1",
    }

    const res = await server.inject({
      url,
      method,
      payload,
    })

    expect(res.statusCode).toBe(200)
    const body = JSON.parse(res.body) as { strong: boolean; errors: string[] }
    expect(body.strong).toBe(true)
    expect(body.errors.length).toBe(0)
  })

  it("weak (short) password", async () => {
    const payload = {
      password: "!@#abc",
    }

    const res = await server.inject({
      url,
      method,
      payload,
    })

    expect(res.statusCode).toBe(200)
    const body = JSON.parse(res.body) as { strong: boolean; errors: string[] }
    expect(body.strong).toBe(false)
    expect(body.errors.length).toBe(1)
  })

  it("weak (repeating) password", async () => {
    const payload = {
      password: "111111111111111111111111111111111",
    }

    const res = await server.inject({
      url,
      method,
      payload,
    })

    expect(res.statusCode).toBe(200)
    const body = JSON.parse(res.body) as { strong: boolean; errors: string[] }
    expect(body.strong).toBe(false)
  })
})
