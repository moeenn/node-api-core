import { test } from "node:test"
import assert from "node:assert/strict"
import { Server } from "#src/core/server/index.mjs"

test("passwordStrengthCheck", async (t) => {
  /** @typedef {import("./passwordStrengthCheck.schema.mjs").Body} Body */

  const server = Server.new()
  const url = "/api/password-strength"
  const method = "POST"

  await t.test("strong password", async () => {
    const payload = /** @type {Body} */ ({
      password: "!@#abc#$%Ac1",
    })

    const res = await server.inject({
      url,
      method,
      payload,
    })

    assert.equal(res.statusCode, 200)
    const body = /**
      @type {{ strong: boolean; errors: string[] }}
    */ (JSON.parse(res.body))

    assert.ok(body.strong)
    assert.equal(body.errors.length, 0)
  })

  await t.test("weak (short) password", async () => {
    const payload = /** @type {Body} */ ({
      password: "!@#abc",
    })

    const res = await server.inject({
      url,
      method,
      payload,
    })

    assert.equal(res.statusCode, 200)
    const body = /**
      @type {{ strong: boolean; errors: string[] }}
    */ (JSON.parse(res.body))

    assert.equal(body.strong, false)
    assert.equal(body.errors.length, 1)
  })

  await t.test("weak (repeating) password", async () => {
    const payload = /** @type {Body} */ ({
      password: "111111111111111111111111111111111",
    })

    const res = await server.inject({
      url,
      method,
      payload,
    })

    assert.equal(res.statusCode, 200)
    const body = /** 
      @type {{ strong: boolean; errors: string[] 
    }} */ (JSON.parse(res.body))

    assert.equal(body.strong, false)
  })
})
