import { describe, it} from "node:test"
import assert from "node:assert/strict"
import { StorageService } from "./storageService.mjs"

describe("StorageService", () => {
  it("extractMimeType valid", () => {
    const testCases = [
      {
        input: "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD",
        output: "image/jpeg",
      },
      {
        input: "data:image/png;base64,/9j/4AAQSkZJRgABAQAAAQABAAD",
        output: "image/png",
      },
      {
        input: "data:document/pdf;base64,/9j/4AAQSkZJRgABAQAAAQABAAD",
        output: "document/pdf",
      },
    ]

    for (const testCase of testCases) {
      const got = StorageService.extractMimeType(testCase.input)
      assert.equal(got, testCase.output)
    }
  })

  it("extractMimeType invalid", () => {
    const input = "some-random-encoding"
    assert.throws(() => StorageService.extractMimeType(input)) /* .toThrowError("Invalid") */
  })

  it("encodingToBuffer", () => {
    const got = StorageService.encodingToBuffer(
      "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD",
    )
    assert.ok(got)

    assert.throws(() =>
      StorageService.encodingToBuffer("invalid encoding"),
    ) /* .toThrowError("Invalid") */
  })
})
