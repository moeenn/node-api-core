export const bodySchema = /** @type {const} */ ({
  type: "object",
  properties: {
    token: { type: "string" },
  },
  required: ["token"],
  additionalProperties: false,
})

/** @typedef {import("json-schema-to-ts").FromSchema<typeof bodySchema>} Body */
