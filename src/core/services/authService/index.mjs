import {
  generateLoginToken,
  generateGeneralToken,
  validateLoginToken,
  validateGeneralToken,
} from "./helpers.mjs"

export const AuthService = {
  generateLoginToken: generateLoginToken("auth"),
  validateLoginToken: validateLoginToken("auth"),

  generateFirstPasswordToken: generateGeneralToken("firstPassword"),
  validateFirstPasswordToken: validateGeneralToken("firstPassword"),

  generatePasswordResetToken: generateGeneralToken("passwordReset"),
  validatePasswordResetToken: validateGeneralToken("passwordReset"),
}
