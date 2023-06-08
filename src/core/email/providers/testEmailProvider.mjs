export class TestEmailProvider {
  /**
   * this method is not marked async because the email must always be sent
   * in the background. we dont want this method to be awaited because
   * it will slow down the response to the client
   *
   * @param {string} to
   * @param {import("#src/core/email/index.mjs").Email} email
   */
  sendEmail(to, email) {
    console.log("sending email", { to, email })
  }
}
