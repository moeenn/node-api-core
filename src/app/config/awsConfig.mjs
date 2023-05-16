import { env } from "#src/core/helpers/env.mjs"

export const awsConfig = {
  accessKey: env("AWS_ACCESS_KEY_ID"),
  accessSecret: env("AWS_SECRET_ACCESS_KEY"),
  region: env("AWS_REGION"),
}
