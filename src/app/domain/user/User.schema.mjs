/* eslint-disable-next-line no-unused-vars */
import * as t from "#src/index.d.mjs"
import { authConfig } from "#src/app/config/authConfig.mjs"

export const schema = {
  /** @type {t.Schema} */
  create: {
    body: {
      type: "object",
      required: ["name", "email", "password", "confirmPassword"],
      properties: {
        name: { type: "string" },
        email: { type: "string" },
        password: { 
          type: "string", 
          minLength: authConfig.password.minLength 
        },
        confirmPassword: { 
          type: "string", 
          minLength: authConfig.password.minLength 
        },        
      }
    }
  },

  /** @type {t.Schema} */
  setPassword: {
    body: {
      type: "object",
      required: ["password", "confirmPassword"],
      properties: {
        password: { 
          type: "string", 
          minLength: authConfig.password.minLength 
        },
        confirmPassword: { 
          type: "string", 
          minLength: authConfig.password.minLength 
        },        
      }
    }
  },

  /** @type {t.Schema} */
  setStatus: {
    body: {
      type: "object",
      required: ["userId", "status"],
      properties: {
        userId: {
          type: "number",
        },
        status: {
          type: "boolean",
        }
      }
    }
  },

  /** @type {t.Schema} */
  updateProfile: {
    body: {
      type: "object",
      required: ["name"],
      properties: {
        name: { type: "string" }
      }
    }
  },
  
  /** @type {t.Schema} */
  remove: {
    params: {
      type: "object",
      required: ["id"],
      properties: {
        id: { type: "number" },
      }
    }
  }
}