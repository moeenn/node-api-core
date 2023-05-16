import jwt from "jsonwebtoken"

export const JWT = {
  /**
   * generate a JWT and sign using a secret key
   *
   * @param {string} secret
   * @param {Record<string, unknown>} payload
   * @param {number} [expiredInSeconds]
   * @returns {Promise<string>}
   */
  async generate(secret, payload, expiredInSeconds) {
    if (expiredInSeconds) {
      jwt.sign(payload, secret, { expiresIn: expiredInSeconds })
    }

    return jwt.sign(payload, secret)
  },

  /**
   * check if JWT is valid and extract the payload
   *
   * @param {string} secret
   * @param {string} token
   * @returns {Promise<unknown | undefined>}
   */
  async validate(secret, token) {
    try {
      return jwt.verify(token, secret)
    } catch (err) {
      return
    }
  },
}
