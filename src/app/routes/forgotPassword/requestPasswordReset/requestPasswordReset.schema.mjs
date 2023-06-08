export const bodySchema = /** @type {const} */ ({
  type: "object",
  properties: {
    email: { type: "string", format: "email" },
  },
  required: ["email"],
  additionalProperties: false,
})

/** @typedef {import("json-schema-to-ts").FromSchema<typeof bodySchema>} Body */
