import pino from "pino"
import { isTest } from "#src/core/helpers/isTest.mjs"

const level = isTest() ? "silent" : "info"
export const logger = pino({ level })
