import { describe, it } from "node:test"
import assert from "node:assert/strict"
import { Dates } from "./dates.mjs"

describe("Dates", () => {
  it("isDateValid", () => {
    const testCases = [
      { input: "2023-03-10", expected: true },
      { input: "2020-5-4", expected: true },
      { input: "2021-13-0", expected: false },
      { input: "2020-12-aa", expected: false },
    ]

    for (const testCase of testCases) {
      const got = Dates.isDateValid(testCase.input)
      assert.equal(got, testCase.expected)
    }
  })

  it("previousDay", () => {
    const testCases = [
      { input: "2022-05-10", expected: new Date("2022-05-09") },
      { input: "2022-02-01", expected: new Date("2022-01-31") },
      { input: "2023-01-01", expected: new Date("2022-12-31") },
    ]

    for (const testCase of testCases) {
      const got = Dates.previousDay(testCase.input)
      assert.equal(got.getTime(), testCase.expected.getTime())
    }
  })

  it("getDateDay", () => {
    const testCases = [
      { input: "2023-04-13", expected: "THU" },
      { input: "2023-06-25", expected: "SUN" },
      { input: "2020-12-11", expected: "FRI" },
    ]

    for (const testCase of testCases) {
      const got = Dates.getDateDay(testCase.input)
      assert.equal(got, testCase.expected)
    }
  })

  it("groupByDate", () => {
    const input = [
      { id: 1, date: new Date("2023-07-20") },
      { id: 2, date: new Date("2023-10-01") },
      { id: 3, date: new Date("2023-07-20") },
      { id: 4, date: new Date("2023-02-15") },
    ]

    const expected = {
      "2023-02-15T00:00:00.000Z": [{ id: 4, date: new Date("2023-02-15") }],
      "2023-07-20T00:00:00.000Z": [
        { id: 1, date: new Date("2023-07-20") },
        { id: 3, date: new Date("2023-07-20") },
      ],
      "2023-10-01T00:00:00.000Z": [{ id: 2, date: new Date("2023-10-01") }],
    }

    const got = Dates.groupByDate(input)
    assert.deepStrictEqual(got, expected)
  })
})
