import { test } from "node:test"
import assert from "node:assert/strict"
import { routes } from "#src/app/routes/index.mjs"

test("route definitins", async t => {
  await t.test("route method and url duplication test", () => {
    /** @type {string[]} */
    const routeKeys = routes.map((r) => r.method + " " + r.url)
    const duplicates = findDuplicates(routeKeys)

    assert.deepStrictEqual(duplicates, [])
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
