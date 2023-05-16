import { Email } from "#src/core/email/index.mjs"

/**
 * @typedef SetFirstPasswordEmailArgs
 * @property {string} passwordToken
 */

export class SetFirstPasswordEmail extends Email {
  /** @param {SetFirstPasswordEmailArgs} args */
  constructor(args) {
    super("Account setup")
    this.args = args
  }

  /** @returns {string} */
  template() {
    return `
# Account setup
You account has been successfully created for ${this.appConfig.appName}. Please click on the following link to setup your account. 

[Setup account](${this.appConfig.urls.accountSetup}${this.args.passwordToken})
`
  }
}
