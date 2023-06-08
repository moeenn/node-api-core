export const bodySchema = /** @type {const} */ ({
  type: "object",
  properties: {
    password: { type: "string" },
  },
  required: ["password"],
  additionalProperties: false,
})

/** @typedef {import("json-schema-to-ts").FromSchema<typeof bodySchema>} Body */
