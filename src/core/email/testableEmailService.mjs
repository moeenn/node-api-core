/** @typedef {import("./index.d.mjs").SentEmail } SentEmail */

/* eslint-disable-next-line no-unused-vars */
import { Email } from "./email.mjs"

export class TestableEmailService {
  /** @type {SentEmail[]} */
  emails = []

  /** @returns {SentEmail[]} */
  get sentEmails() {
    return this.emails
  }

  clearSentEmails() {
    this.emails = []
  }

  /**
   * 
   * @param {string} to 
   * @param {Email} email 
   */
  storeEmail(to, email) {
    this.emails.push({ to, email })
  }
}
