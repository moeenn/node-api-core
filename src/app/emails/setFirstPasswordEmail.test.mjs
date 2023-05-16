import { describe, it } from "node:test"
import assert from "node:assert/strict"
import { SetFirstPasswordEmail } from "./setFirstPasswordEmail.mjs"
import { appConfig } from "#src/app/config/appConfig.mjs"

describe("SetFirstPasswordEmail test", () => {
  it("email template has all provided fields", () => {
    const args = {
      passwordToken: "123123123",
    }

    const email = new SetFirstPasswordEmail(args)
    const html = email.html()

    assert.ok(html.includes(appConfig.appName))
    assert.ok(html.includes(args.passwordToken))
  })
})
