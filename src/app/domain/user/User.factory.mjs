import { service } from "./User.service.mjs"

export const factory = {
  data: {},

  async create() {
    return await service.create(this.data)
  }
}