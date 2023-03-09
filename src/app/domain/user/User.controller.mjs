/* eslint-disable-next-line no-unused-vars */
import * as t from "#src/index.d.mjs"
import { validateToken, hasRole } from "#src/core/middleware/index.mjs"
import { schema } from "./User.schema.mjs"
import { service } from "./User.service.mjs"

export const controller = {
  /** @type {t.Route} */
  create: {
    schema: schema.create,
    handler: async req => {
      /** @type {any} */
      const body = req.body
      const user = await service.create(body)

      return {
        message: "user created",
        user,
      }
    }
  },

  /** @type {t.Route} */
  setPassword: {
    schema: schema.setPassword,
    preValidation: [validateToken],
    handler: async req => {
      const { userId } = req.requestContext.get("user")
      const user = await service.findById(userId)

      /** @type {any} */
      const body = req.body

      await service.setPassword(user, body)
      return {
        message: "password updated",
      }      
    }
  },
  
  /** @type {t.Route} */
  setStatus: {
    schema: schema.setStatus,
    preValidation: [validateToken, hasRole("ADMIN")],
    handler: async req => {
      /** @type {any} */
      const body = req.body

      const user = await service.findById(body.userId)
      await service.setStatus(user, body)

      return {
        message: "approval status updated",
      }      
    }
  },
  
  /** @type {t.Route} */
  updateProfile: {
    schema: schema.updateProfile,
    preValidation: [validateToken],
    handler: async req => {
      const { userId } = req.requestContext.get("user")
      const user = await service.findById(userId)

      /** @type {any} */
      const body = req.body
      
      return {
        message: "user profile updated",
        profile: await service.updateProfile(user, body)
      }
    }
  },

  /** @type {t.Route} */
  remove: {
    schema: schema.remove,
    preValidation: [validateToken, hasRole("ADMIN")],
    handler: async req => {      
      /** @type {any} */
      const params = req.params    
      const user = await service.findById(params.id)

      await service.remove(user)
      return {
        message: "user account removed"
      }
    }
  }
}