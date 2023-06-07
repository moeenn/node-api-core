import { env } from "#src/core/helpers/env.mjs"
import { TestEmailProvider } from "#src/core/email/providers/testEmailProvider.mjs"

export const emailConfig = {
  provider: TestEmailProvider,
  fromEmail: env("FROM_EMAIL"),
}
