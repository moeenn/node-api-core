/** @typedef {import("./index.d.mjs").EmailProvider} EmailProvider */

/* eslint-disable-next-line no-unused-vars */
import { Email } from "./email.mjs"
import { TestableEmailService } from "./testableEmailService.mjs"
import { emailConfig } from "#src/app/config/emailConfig.mjs"
import { isTest } from "#src/core/helpers/isTest.mjs"

/**
 * email service is a singleton class,
 * instance method can be used to access the private EmailService instance
 */
export class EmailService extends TestableEmailService {
  /** @type {EmailService} */
  static _instance

  /** @type {EmailProvider} */
  _provider

  constructor() {
    super()
    this._provider = new emailConfig.provider()
  }

  /**
   * access the singleton instance using this method
   *
   * @returns {EmailService}
   */
  static instance() {
    if (!this._instance) {
      this._instance = new EmailService()
    }
    return this._instance
  }

  /**
   * 
   * @param {string} to 
   * @param {Email} email 
   */
  sendEmail(to, email) {
    if (isTest()) {
      this.storeEmail(to, email)
      return
    }
    this._provider.sendEmail(to, email)
  }
}
