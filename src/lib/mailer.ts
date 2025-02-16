import 'server-only'
import nodemailer from 'nodemailer'

interface EmailConfig {
  subject: string
  to: string | string[]
  template: string
}

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_SERVER_USER,
    pass: process.env.EMAIL_SERVER_PASSWORD,
  },
})

// Verify email configuration
function verifyEmailConfig() {
  if (!process.env.EMAIL_SERVER_USER || !process.env.EMAIL_SERVER_PASSWORD) {
    console.error('Missing email configuration:', {
      hasEmailUser: !!process.env.EMAIL_SERVER_USER,
      hasServerPassword: !!process.env.EMAIL_SERVER_PASSWORD,
    })
    throw new Error('Email configuration is missing')
  }
}

// Generic email sending function
export async function sendEmail({ subject, to, template }: EmailConfig) {
  verifyEmailConfig()

  const mailOptions = {
    from: process.env.EMAIL_SERVER_USER,
    to,
    subject,
    html: template,
  }

  try {
    await transporter.verify()
    console.log('Email service ready')

    const info = await transporter.sendMail(mailOptions)
    console.log('Email sent successfully:', info.response)
    return info
  } catch (emailError) {
    console.error('Failed to send email:', emailError)
    throw emailError
  }
}

// Predefined email templates
export const EmailTemplates = {
  ERROR_ALERT: (error: any, context: string) => `
    <h2>System Error Alert</h2>
    <p><strong>Context:</strong> ${context}</p>
    <p><strong>Error Message:</strong> ${error.message || 'Unknown error'}</p>
    <p><strong>Timestamp:</strong> ${new Date().toISOString()}</p>
    <p><strong>Stack Trace:</strong></p>
    <pre>${error.stack || 'No stack trace available'}</pre>
  `,

  USAGE_ALERT: (usage: { user: string; tokens: number }) => `
    <h2>Usage Alert</h2>
    <p><strong>User:</strong> ${usage.user}</p>
    <p><strong>Tokens Used:</strong> ${usage.tokens}</p>
    <p><strong>Timestamp:</strong> ${new Date().toISOString()}</p>
  `,

  USER_FEEDBACK: (feedback: { user: string; message: string }) => `
    <h2>User Feedback Received</h2>
    <p><strong>From User:</strong> ${feedback.user}</p>
    <p><strong>Message:</strong> ${feedback.message}</p>
    <p><strong>Timestamp:</strong> ${new Date().toISOString()}</p>
  `,
}

// Utility functions for common email scenarios
export async function sendErrorAlert(error: any, context: string) {
  return sendEmail({
    subject: 'System Error Alert',
    to: 'love970057@gmail.com', // Consider moving to environment variable
    template: EmailTemplates.ERROR_ALERT(error, context),
  })
}

export async function sendUsageAlert(usage: { user: string; tokens: number }) {
  return sendEmail({
    subject: 'Usage Alert',
    to: 'love970057@gmail.com',
    template: EmailTemplates.USAGE_ALERT(usage),
  })
}

export async function sendUserFeedback(feedback: {
  user: string
  message: string
}) {
  return sendEmail({
    subject: 'User Feedback',
    to: 'love970057@gmail.com',
    template: EmailTemplates.USER_FEEDBACK(feedback),
  })
}
