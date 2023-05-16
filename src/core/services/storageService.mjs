import {
  PutObjectCommand,
  S3Client,
  DeleteObjectCommand,
} from "@aws-sdk/client-s3"
import { storageConfig } from "#src/app/config/storageConfig.mjs"
import { logger } from "#src/core/server/logger/index.mjs"
import { isTest } from "#src/core/helpers/isTest.mjs"
import { BadRequestException } from "#src/core/exceptions/index.mjs"

export const StorageService = {
  client: new S3Client({
    region: storageConfig.region,
  }),

  /**
   * upload a file to S3 bucket, if the upload fails, this function can throw
   *
   * @param {string} filename
   * @param {Buffer} fileData
   * @returns {Promise<string | undefined>}
   */
  async upload(filename, fileData) {
    if (isTest()) {
      return "FAKE-" + this.calculatePublicURL(filename)
    }

    const command = new PutObjectCommand({
      Bucket: storageConfig.bucketName,
      Key: filename,
      Body: fileData,
    })

    const res = await this.client.send(command).catch((error) => {
      logger.error({ error }, "failed to upload file")
    })

    if (!res) return
    if (res.$metadata.httpStatusCode !== 200) {
      return
    }

    return this.calculatePublicURL(filename)
  },

  /**
   * upload file to S3 bucket in base64 format
   *
   * @param {string} filename
   * @param {string} encoding
   * @returns {Promise<string | undefined>}
   */
  async uploadBase64(filename, encoding) {
    const buffer = this.encodingToBuffer(encoding)
    if (isTest()) {
      return "FAKE-" + this.calculatePublicURL(filename)
    }

    const command = new PutObjectCommand({
      Bucket: storageConfig.bucketName,
      Key: filename,
      Body: buffer,
      ContentEncoding: "base64",
      ContentType: this.extractMimeType(encoding),
    })

    const res = await this.client.send(command).catch((error) => {
      logger.error({ error }, "failed to upload file")
    })

    if (!res) return
    if (res.$metadata.httpStatusCode !== 200) {
      return
    }

    return this.calculatePublicURL(filename)
  },

  /**
   * the full URL for uploaded file can be easily determined
   * the above upload mechanism doesn't return the public location for the
   * file so we calculate it locally
   *
   * @param {string} filename
   * @returns {string}
   */
  calculatePublicURL(filename) {
    const { bucketName, region } = storageConfig
    return `https://${bucketName}.s3.${region}.amazonaws.com/${filename}`
  },

  /**
   * extract mimetype from the provided base64 encoding
   *
   * @param {string} encoding
   * @returns {string}
   */
  extractMimeType(encoding) {
    /* matches[1] should be image/jpg etc. */
    const matches = /data:(.*);/g.exec(encoding)
    if (!matches || !matches[1]) {
      throw BadRequestException("Invalid base64 encoding")
    }
    return matches[1]
  },

  /**
   * convert base64 encoding into binary buffer
   *
   * @param {string} encoding
   * @returns {Buffer}
   */
  encodingToBuffer(encoding) {
    /* extract the raw encoding i.e. part after data:image/png; */
    const raw = encoding.split(",")
    if (!raw[1]) {
      throw BadRequestException("Invalid base64 encoding")
    }
    /* convert raw encoding to binary data */
    return Buffer.from(raw[1], "base64")
  },

  /**
   * remove a file from S3 storage bucket
   *
   * @param {string} filename
   * @returns {Promise<boolean>}
   */
  async delete(filename) {
    if (isTest()) {
      return true
    }

    const command = new DeleteObjectCommand({
      Bucket: storageConfig.bucketName,
      Key: filename,
    })

    const res = await this.client.send(command).catch((error) => {
      logger.error({ error }, "failed to upload file")
    })

    if (!res) return false
    if (res.$metadata.httpStatusCode !== 204) {
      return false
    }

    return true
  },
}
