import nodemailer from "nodemailer"

export default class MailerService {
  constructor({ host, port, secure, auth }) {
    this.transporter = nodemailer.createTransport({
      host,
      port,
      secure,
      auth: {
        user: auth.user,
        pass: auth.pass
      }
    })
    this.sender = auth.user
  }

  async sendMail({ to, subject, body}) {
      try {
        const result = await this.transporter.sendMail({
          to,
          subject,
          from: this.sender,
          text: body
        })
        return result
      } catch (err) {
        throw err
      }
  }

  close() {
    this.transporter.close()
  }
}
