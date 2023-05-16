import { marked } from "marked"
import { appConfig } from "#src/app/config/appConfig.mjs"

export class Email {

  /** @type {typeof appConfig} */
  appConfig = appConfig

  /** @type {string} */
  subject

  /** @type {unknown} */
  args

  /**
   * @param {string} subject
   */
  constructor(subject) {
    this.subject = subject
  }

  /**
   * Over-ride in derive classes 
   * 
   * @returns {string}
  */
  template() { return "" }

  /**
   * 
   * @returns {string}
   */
  html() {
    const md = this.template().trim()
    return marked.parse(md)
  }
}
