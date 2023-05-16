import { RouteOptions } from "fastify"
import { healthCheck } from "./healthcheck/healthcheck"
import { memoryUsage } from "./healthcheck/memoryUsage"
import { passwordStrengthCheck } from "./auth/passwordStrengthCheck"
import { login } from "./auth/login"
import { setFirstPassword } from "./auth/setFirstPassword"
import { requestPasswordReset } from "./forgotPassword/requestPasswordReset"
import { validatePasswordResetToken } from "./forgotPassword/validatePasswordResetToken"
import { resetForgottenPassword } from "./forgotPassword/resetForgottenPassword"
import { getUserProfile } from "./user/getUserProfile"
import { setUserStatus } from "./user/setUserStatus"
import { updatePassword } from "./user/updatePassword"
import { updateUserProfile } from "./user/updateUserProfile"

/**
 * register all routes here
 *
 */
export const routes: RouteOptions[] = [
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
