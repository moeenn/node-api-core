import process from "node:process"

/**
 * check if system is currently running tests
 * 
 * @returns {boolean}
 */
export function isTest() {
  return process.env.NODE_ENV === "test"
}
