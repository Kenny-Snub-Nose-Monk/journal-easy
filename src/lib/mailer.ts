import 'server-only' // 標記只在伺服器端使用（客戶端組件引入會報錯）

import nodemailer from 'nodemailer'

const config = {
  host: process.env.EMAIL_HOST,
  port: parseInt(process.env.EMAIL_PORT || '', 10),
  auth: {
    user: process.env.EMAIL_FROM,
    pass: process.env.EMAIL_PASSWORD,
  },
}

const transporter = nodemailer.createTransport(config)

interface SendEmailOpt {
  subject?: string
  text?: string
  toEmail?: string
}

export async function sendEmail(opt: SendEmailOpt = {}) {
  const { subject = '', text = '', toEmail } = opt
  if (!subject) {
    console.error('subject required')
    return
  }

  if (!process.env.EMAIL_HOST || !process.env.EMAIL_FROM || !(toEmail || process.env.NOTICE_EMAIL_TO)) {
    console.log('Wont send email in dev env... ', subject, text)
    return
  }

  const mailConfig = {
    from: `Journal Easy<${process.env.EMAIL_FROM}>`, // '暱稱<發件人郵箱>'
    subject,
    to: toEmail || process.env.NOTICE_EMAIL_TO,
    text,
  }
  const res = await transporter.sendMail(mailConfig).catch((error) => {
    console.error('Email delivery failed', error.message)
    return null
  })
  console.log('Message sent: %s', res?.messageId)
  return res
}
