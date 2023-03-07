import jwt from "jsonwebtoken"

export const JWT = {
  /**
   *  @typedef GenerateArgs
   *  @property {string} secret
   *  @property {Record<string, unknown>} payload
   *  @property {number=} expiredInSeconds
  */

  /**
   *  generate a JWT and sign using a secret key
   *  
   *  @param {GenerateArgs} args
   *  @returns {Promise<string>}
   */
  async generate(args) {
    if (args.expiredInSeconds) {
      jwt.sign(args.payload, args.secret, { expiresIn: args.expiredInSeconds })
    }

    return jwt.sign(args.payload, args.secret)
  },

  /**
   *  check if JWT is valid and extract the payload
   * 
   *  @param {{ secret: string, token: string}} args
   *  @returns {Promise<unknown>}
   */
  async validate(args) {
    try {
      return jwt.verify(args.token, args.secret)
    } catch (err) {
      return
    }
  },
}
