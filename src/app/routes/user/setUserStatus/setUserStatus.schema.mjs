export const bodySchema = /** @type {const} */ ({
  type: "object",
  properties: {
    userId: { type: "string", format: "uuid" },
    status: { type: "boolean" },
  },
  required: ["userId", "status"],
  additionalProperties: false,
})

/** @typedef {import("json-schema-to-ts").FromSchema<typeof bodySchema>} Body */
