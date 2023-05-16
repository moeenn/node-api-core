import { env } from "#src/core/helpers/env.mjs"

export const storageConfig = {
  region: env("AWS_REGION"),
  bucketName: env("AWS_S3_BUCKET"),
}
