// TODO: replace with native node fetch
import axios, { Axios } from "axios"
import Ajv from "ajv"
import { logger } from "#src/core/server/logger/index.mjs"

/**
 * any time we need to integrate an enternal JSON REST API in our backend, we
 * will use this class as a dependency for making API requests
 */
export class APIService {
  /** @type {Axios} */
  _axiosInstance

  /** @type {Ajv} */
  _vInstance

  /** @type {string} */
  _baseURL

  /**
   * 
   * @param {string} baseURL 
   * @param {number} [timeoutSeconds] 
   */
  constructor(baseURL, timeoutSeconds = 5) {
    this._baseURL = baseURL

    this._axiosInstance = axios.create({ timeout: timeoutSeconds * 1000 })
    this._vInstance = new Ajv()
  }

  /**
   * @template T
   * @param {Record<string, unknown>} schema 
   * @param {unknown} data 
   * @returns {Error | T}
   */
  validate(schema, data) {
    if (data instanceof Error) {
      return data
    }

    const isValid = this._vInstance.validate(schema, data)
    if (!isValid) {
      const message = "unknown data-structure returned from external API"
      logger.error({ data }, message)
      return new Error(message)
    }

    return /** @type {T} */ (data)
  }

  /**
   * 
   * @param {string} url 
   * @param {string | undefined} [bearerToken] 
   * @returns {Promise<Record<string, unknown> | Error>}
   */
  async get(
    url,
    bearerToken = undefined,
  ) {
    const targetURL = this._baseURL + url

    try {
      const res = await this._axiosInstance.get(targetURL, {
        headers: {
          Authorization: "Bearer " + bearerToken,
        },
      })
      return res.data
    } catch (err) {
      logger.error({ error: err }, "error executing GET request")
      if (err instanceof Error) {
        return new Error(err.message)
      }

      return new Error("request failed")
    }
  }

  /**
   * 
   * @param {string} url 
   * @param {unknown} payload 
   * @param {string | undefined} [bearerToken] 
   * @returns {Promise<Record<string, unknown> | Error>}
   */
  async post(
    url,
    payload,
    bearerToken = undefined,
  ) {
    const targetURL = this._baseURL + url

    try {
      const res = await this._axiosInstance.post(targetURL, payload, {
        headers: {
          Authorization: "Bearer " + bearerToken,
        },
      })
      return res.data
    } catch (err) {
      logger.error({ error: err }, "error executing POST request")
      if (err instanceof Error) {
        return new Error(err.message)
      }

      return new Error("request failed")
    }
  }

  /**
   * 
   * @param {string} url 
   * @param {unknown} payload 
   * @param {string | undefined} bearerToken 
   * @returns {Promise<Record<string, unknown> | Error>}
   */
  async put(
    url,
    payload,
    bearerToken = undefined,
  ) {
    const targetURL = this._baseURL + url

    try {
      const res = await this._axiosInstance.put(targetURL, payload, {
        headers: {
          Authorization: "Bearer " + bearerToken,
        },
      })
      return res.data
    } catch (err) {
      logger.error({ error: err }, "error executing PUT request")
      if (err instanceof Error) {
        return new Error(err.message)
      }

      return new Error("request failed")
    }
  }

  /**
   * 
   * @param {string} url 
   * @param {string | undefined} bearerToken 
   * @returns {Promise<Record<string, unknown> | Error> }
   */
  async delete(
    url,
    bearerToken = undefined,
  ) {
    const targetURL = this._baseURL + url

    try {
      const res = await this._axiosInstance.delete(targetURL, {
        headers: {
          Authorization: "Bearer " + bearerToken,
        },
      })
      return res.data
    } catch (err) {
      logger.error({ error: err }, "error executing DELETE request")
      if (err instanceof Error) {
        return new Error(err.message)
      }

      return new Error("request failed")
    }
  }
}
