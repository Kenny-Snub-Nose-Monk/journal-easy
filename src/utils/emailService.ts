import nodemailer from 'nodemailer'

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_SERVER_USER,
    pass: process.env.EMAIL_SERVER_PASSWORD,
  },
})

export async function sendErrorAlert(error: any, context: string) {
  // First, verify the environment variables
  if (!process.env.EMAIL_SERVER_USER || !process.env.EMAIL_SERVER_PASSWORD) {
    console.error('Missing email configuration:', {
      hasEmailUser: !!process.env.EMAIL_USER,
      hasServerPassword: !!process.env.SERVER_PASSWORD,
    })
    throw new Error('Email configuration is missing')
  }

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: 'love970057@gmail.com',
    subject: 'OpenAI API Error Alert',
    html: `
      <h2>OpenAI API Error Detected</h2>
      <p><strong>Context:</strong> ${context}</p>
      <p><strong>Error Message:</strong> ${error.message || 'Unknown error'}</p>
      <p><strong>Timestamp:</strong> ${new Date().toISOString()}</p>
      <p><strong>Stack Trace:</strong></p>
      <pre>${error.stack || 'No stack trace available'}</pre>
    `,
  }

  try {
    // Verify transporter connection
    await transporter.verify()
    console.log('Email service ready')

    // Send email
    const info = await transporter.sendMail(mailOptions)
    console.log('Email sent successfully:', info.response)
    return info
  } catch (emailError) {
    console.error('Failed to send error alert email:', emailError)
    throw emailError // Re-throw to handle in the API route
  }
}
