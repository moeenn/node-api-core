/* eslint-disable-next-line no-unused-vars */
import { Email } from "#src/core/email/index.mjs"
import { SESClient, SendEmailCommand } from "@aws-sdk/client-ses"
import { awsConfig, emailConfig } from "#src/app/config/index.mjs"
import { logger } from "#src/core/server/logger/index.mjs"

export class AWSEmailProvider {
  /** @type {SESClient} */
  _sesInstance

  constructor() {
    /**
     * SDK credentials are automatically picked up from the environment
     * variables
     */
    this._sesInstance = new SESClient({
      region: awsConfig.region,
    })
  }

  /**
   * this method is not marked async because the email must always be sent
   * in the background. we dont want this method to be awaited because
   * it will slow down the response to the client
   * 
   * @param {string} to
   * @param {Email} email
   */
  sendEmail(to, email) {
    const body = email.html()
    const command = new SendEmailCommand({
      Source: emailConfig.fromEmail,
      Destination: {
        ToAddresses: [to],
      },
      Message: {
        Body: {
          Html: {
            Charset: "UTF-8",
            Data: body,
          },
        },
        Subject: {
          Charset: "UTF-8",
          Data: email.subject,
        },
      },
    })

    this._sesInstance.send(command).catch((err) => {
      logger.error({
        message: "email sending failed",
        to,
        subject: email.subject,
        details: err,
      })
    })
  }
}
