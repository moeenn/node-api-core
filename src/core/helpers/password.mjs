import argon2 from "argon2"
import owasp, { TestResult } from "owasp-password-strength-test"

export const Password = {
  /**
   * hash & salt a cleartext password string
   * 
   * @param {string} password
   * @returns {Promise<string>}
   */
  async hash(password) {
    return await argon2.hash(password)
  },

  /**
   * verify whether hash / salt combo matches with the cleartext password string
   *
   * @param {string} hashed
   * @param {string} cleartext
   * @returns {Promise<boolean>}
   */
  async verify(hashed, cleartext) {
    return await argon2.verify(hashed, cleartext)
  },

  /**
   * check strength of a cleartext password
   *
   * @param {string} cleartext
   * @returns {Promise<TestResult>}
   */
  async checkStrength(cleartext) {
    return owasp.test(cleartext)
  },
}
