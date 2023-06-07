import { env } from "#src/core/helpers/env.mjs"
const frontendURL = env("FRONT_END_URL")

export const appConfig = {
  appName: "NodeJS Backend",
  frontendURL,
  urls: {
    resetPassword: frontendURL + "/forgot-password/reset?token=",
    accountSetup: frontendURL + "/account-setup?token=",
  },
  pagination: {
    perPage: 20,
  },
}
