import { env } from "#src/core/helpers/env.mjs"
import { AWSEmailProvider } from "#src/core/email/providers/AWSEmailProvider.mjs"

export const emailConfig = {
  provider: AWSEmailProvider,
  fromEmail: env("FROM_EMAIL"),
}
