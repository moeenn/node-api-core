import { healthCheck } from "./healthcheck/healthcheck.mjs"
import { memoryUsage } from "./healthcheck/memoryUsage.mjs"
import { passwordStrengthCheck } from "./auth/passwordStrengthCheck.mjs"
import { login } from "./auth/login.mjs"
import { setFirstPassword } from "./auth/setFirstPassword.mjs"
import { requestPasswordReset } from "./forgotPassword/requestPasswordReset.mjs"
import { validatePasswordResetToken } from "./forgotPassword/validatePasswordResetToken.mjs"
import { resetForgottenPassword } from "./forgotPassword/resetForgottenPassword.mjs"
import { getUserProfile } from "./user/getUserProfile.mjs"
import { setUserStatus } from "./user/setUserStatus.mjs"
import { updatePassword } from "./user/updatePassword.mjs"
import { updateUserProfile } from "./user/updateUserProfile.mjs"

/**
 * register all routes here
 *
 * @type {import("fastify").RouteOptions[]}
 */
export const routes = [
  healthCheck,
  memoryUsage,
  passwordStrengthCheck,
  login,
  setFirstPassword,
  requestPasswordReset,
  validatePasswordResetToken,
  resetForgottenPassword,
  getUserProfile,
  setUserStatus,
  updatePassword,
  updateUserProfile,
]
