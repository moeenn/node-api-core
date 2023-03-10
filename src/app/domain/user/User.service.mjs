/* eslint-disable-next-line no-unused-vars */
import * as t from "#src/index.d.mjs"
import { database } from "#src/core/database/index.mjs"
import { NotFoundException, BadRequestException } from "#src/core/exceptions/index.mjs"
import { Password } from "#src/core/helpers/Password.mjs"

export const service = {
  /**
   * get a single user using ID
   *
   * @param {number} id
   * @returns {Promise<t.User>}
   */
  async findById(id) {
    const user = await database.user.findUnique({
      where: { id },
    })

    if (!user) {
      throw NotFoundException("user not found", { id })
    }

    return user
  },

  /**
   * get s single user with password
   * 
   * @param {number} id
   * @returns {Promise<t.UserWithPassword>}
   */
  async findByIdWithPassword(id) {
    const user = await database.user.findUnique({
      where: { id },
      include: {
        password: true,
      },
    })

    if (!user) {
      throw NotFoundException("user not found", { id })
    }

    return user
  },

  /**
   * get a single user using email
   * 
   * @param {string} email
   * @returns {Promise<t.UserWithPassword>}
   */
  async findByEmail(email) {
    const user = await database.user.findFirst({
      where: { email },
      include: {
        password: true,
      },
    })

    if (!user) return
    return user
  },

  /**
   * list out all users
   * 
   * @returns {Promise<t.User[]>}
   */
  async all() {
    return await database.user.findMany()
  },

  /**
   * check is a user email is already in use
   *
   * @param {string} email
   * @returns {Promise<boolean>}
   */
  async isEmailInUse(email) {
    const user = await database.user.findFirst({
      where: { email },
    })

    return !!user
  },

  /**
   * @typedef CreateArgs
   * @property {string} email
   * @property {string} name
   * @property {string} password
   * @property {string} confirmPassword
  */

  /**
   * register a new user with the system
   *
   * @param {CreateArgs} args
   * @returns {Promise<t.User>}
   */
  async create(args) {
    if (args.password !== args.confirmPassword) {
      throw BadRequestException("password confirmation failed")
    }

    /**
     *  all users must have unique email addresses, ensure that provided
     *  email is unique
     */
    const exists = await this.isEmailInUse(args.email)
    if (exists) {
      throw BadRequestException("user with email address already registered")
    }

    const user = await database.user.create({
      data: {
        name: args.name,
        email: args.email,
        userRole: "USER",
        password: {
          create: {
            hash: await Password.hash(args.password),
          }
        }
      },
    })

    return user
  },

  /**
   * @typedef SetPasswordArgs
   * @property {string} password
   * @property {string} confirmPassword
  */

  /**
   * set password for a user
   *
   * @param {t.User} user
   * @param {SetPasswordArgs} args
   * @returns {Promise<void>}
   */
  async setPassword(user, args) {
    if (args.password !== args.confirmPassword) {
      throw BadRequestException("password confirmation failed")
    }

    const hash = await Password.hash(args.password)
    await database.password.upsert({
      where: {
        userId: user.id,
      },
      update: { hash },
      create: {
        userId: user.id,
        hash,
      },
    })
  },

  /**
   * approve or disapprove a users account
   *
   * @param {t.User} user
   * @param {boolean} status
   * @returns {Promise<void>}
   */
  async setStatus(user, status) {
    await database.user.update({
      where: {
        id: user.id,
      },
      data: {
        approved: status,
      },
    })
  },

  /**
   * @typedef UpdateArgs
   * @property {string} name
  */

  /**
   * update user profile
   * 
   * @param {t.User} user
   * @param {UpdateArgs} args
   * @returns {Promise<t.User>}
   */
  async updateProfile(user, args) {
    return await database.user.update({
      where: {
        id: user.id,
      },
      data: { ...args }
    })
  },

  /**
   * completely delete a single user
   * 
   * @param {t.User} user
   * @returns {Promise<void>}
   */
  async remove(user) {
    /* finally delete the actual user */
    await database.user.delete({
      where: {
        id: user.id,
      },
    })
  },
}