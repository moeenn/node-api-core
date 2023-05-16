import { describe, it } from "node:test"
import assert from "node:assert/strict"
import { routes } from "#src/app/routes/index.mjs"

describe("route definitins", () => {
  it("route method and url duplication test", () => {

    /** @type {string[]} */
    const routeKeys = routes.map((r) => r.method + " " + r.url)
    const duplicates = findDuplicates(routeKeys)

    assert.strictEqual(duplicates, [])
  })
})

/**
 * 
 * @param {string[]} items 
 * @returns {string[]}
 */
function findDuplicates(items) {
  const inputList = new Set()

  /** @type {Set<string>} */
  const duplicates = new Set()

  for (const item of items) {
    if (inputList.has(item)) {
      duplicates.add(item)
    } else {
      inputList.add(item)
    }
  }

  return Array.from(duplicates)
}
