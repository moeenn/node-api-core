import { healthCheck } from "./healthcheck/healthcheck.mjs"
import { memoryUsage } from "./healthcheck/memoryUsage/memoryUsage.mjs"
import { passwordStrengthCheck } from "./auth/passwordStrengthCheck/passwordStrengthCheck.mjs"
import { login } from "./auth/login/login.mjs"
import { setFirstPassword } from "./auth/setFirstPassword/setFirstPassword.mjs"
import { refreshAuthToken } from "./auth/refreshAuthToken/refreshAuthToken.mjs"
import { requestPasswordReset } from "./forgotPassword/requestPasswordReset/requestPasswordReset.mjs"
import { validatePasswordResetToken } from "./forgotPassword/validatePasswordResetToken/validatePasswordResetToken.mjs"
import { resetForgottenPassword } from "./forgotPassword/resetForgottenPassword/resetForgottenPassword.mjs"
import { getUserProfile } from "./user/getUserProfile/getUserProfile.mjs"
import { setUserStatus } from "./user/setUserStatus/setUserStatus.mjs"
import { updatePassword } from "./user/updatePassword/updatePassword.mjs"
import { updateUserProfile } from "./user/updateUserProfile/updateUserProfile.mjs"

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
  refreshAuthToken,
  requestPasswordReset,
  validatePasswordResetToken,
  resetForgottenPassword,
  getUserProfile,
  setUserStatus,
  updatePassword,
  updateUserProfile,
]
