import { Email } from "#src/core/email/index.mjs"

/**
 * @typedef ForgotPasswordEmailArgs
 * @property {string} resetToken
 */

export class ForgotPasswordEmail extends Email {
  /** @param {ForgotPasswordEmailArgs} args */
  constructor(args) {
    super("Forgot Password")
    this.args = args
  }

  /** returns {string} */
  template() {
    return `
# Reset forgotten password
A request was made for resetting the password of your account for ${this.appConfig.appName}. Please click the following link to reset your account password.

[Reset Password](${this.appConfig.urls.resetPassword}${this.args.resetToken})

**Note**: If you did not request a password reset for your account, you can safely ignore this email.
`
  }
}
