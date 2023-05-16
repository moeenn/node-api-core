import process from "node:process"
import { db, ping } from "#src/core/database/index.mjs"

export const HealthCheckService = {
  /**
   * check status of the API and its connection with the database
   * 
   */
  async healthcheck() {
    const isConnected = await ping(db)

    return {
      uptime: process.uptime(),
      timestamp: Date.now(),
      status: "OK",
      database: isConnected ? "CONNECTED" : "DISCONNECTED",
    }
  },

  /**
   * check memory usage of the running server,
   * make sure this endpoint is protected
   */
  async memoryUsage() {
    /**
     * @param {number} n
     * @returns {number}
    */
    const toMB = (n) => Math.round((n / 1024 / 1024) * 100) / 100
    const used = process.memoryUsage()

    const heapTotal = toMB(used.heapTotal)
    const heapUsed = toMB(used.heapUsed)

    return {
      heapTotal: heapTotal + " MB",
      heapUsed: heapUsed + " MB",
    }
  },
}
