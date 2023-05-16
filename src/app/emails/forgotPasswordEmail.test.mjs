import { describe, it } from "node:test"
import assert from "node:assert/strict"
import { ForgotPasswordEmail } from "./forgotPasswordEmail.mjs"
import { appConfig } from "#src/app/config/appConfig.mjs"

describe("ForgotPasswordEmail test", () => {
  it("email html has all provided fields", () => {
    const args = {
      resetToken: "http://site.com/reset",
    }

    const email = new ForgotPasswordEmail(args)
    const html = email.html()

    assert.ok(html.includes(appConfig.appName))
    assert.ok(html.includes(args.resetToken))
  })
})
