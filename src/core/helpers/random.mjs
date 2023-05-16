import crypto from "node:crypto"

export const Random = {
  /**
   * generate a random string of provided length
   *
   * @param {number} bytes
   * @returns {Promise<string>}
   */
  async string(bytes) {
    return crypto.randomBytes(bytes).toString("hex")
  },

  /**
   * generate a random number in the provided range
   *
   * @param {number} min
   * @param {number} max
   * @returns {Promise<number>}
   */
  async int(min, max) {
    return crypto.randomInt(min, max)
  },

  /**
   * generate a fixed length numeric pin
   *
   * @param {number} length
   * @returns {Promise<string>}
   */
  async pin(length) {
    /* eslint-disable-next-line no-unused-vars */
    return [...Array(length)].map((_) => crypto.randomInt(0, 9)).join("")
  },
}
