import ENV_CONFIG from '#server/configs/env.config'
import teamplate from '#server/helpers/teamplate.helper'
import transporter from '#server/configs/nodemailer.config'

const mail_service = {
  sendMailWelcome: ({ to }) => {
    const message = teamplate.emailWelcome()
    var mailOptions = {
      from: ENV_CONFIG.EMAIL.USER,
      to: to,
      subject: message.subject,
      html: message.html,
    }

    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error)
      } else {
        console.log('Email sent: ' + info.response)
      }
    })
  },
  sendMailForgotPassword: ({ to, link }) => {
    const message = teamplate.emailForgotPassword(link)

    var mailOptions = {
      from: ENV_CONFIG.EMAIL.USER,
      to: to,
      subject: message.subject,
      html: message.html,
    }

    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error)
      } else {
        console.log('Email sent: ' + info.response)
      }
    })
  },
}

export default mail_service
