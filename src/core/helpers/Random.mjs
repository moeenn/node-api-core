import crypto from "node:crypto"

export const Random = {
  /**
   *  generate a random string of provided length
   *  
   *  @param {number} bytes
   *  @returns {string}
   */
  string(bytes) {
    return crypto.randomBytes(bytes).toString("hex")
  },

  /**
   *  generate a random number in the provided range
   *  
   *  @param {number} min
   *  @param {number} max
   *  @returns {number}
   */
  int(min, max) {
    return crypto.randomInt(min, max)
  },

  /**
   *  generate a fixed length numeric pin
   * 
   *  @param {number} length
   *  @returns {string}
   */
  pin(length) {
    return [...Array(length)].map(() => crypto.randomInt(0, 9)).join("")
  },
}
