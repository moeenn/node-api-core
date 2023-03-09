import { service } from "./User.service.mjs"

export const factory = {
  data: {
    name: "sample",
    email: "sample@site.com",
    password: "some-random-password-123",
    confirmPassword: "some-random-password-123",
  },

  async create() {
    return await service.create(this.data)
  }
}