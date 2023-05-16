/* eslint-disable-next-line no-unused-vars */
import { Email } from "./email.mjs"

/**
 * all emails that this system sends must implement this abstract class
 *
 * @typedef SentEmail
 * @property {string} to
 * @property {Email} email
 *
 *
 * @typedef EmailProvider
 * @property {(to: string, email: Email) => void} sendEmail
 */
