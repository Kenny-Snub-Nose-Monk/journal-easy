import { NextResponse } from 'next/server'
import { sendErrorAlert } from '@/utils/emailService'

export async function POST(request: Request) {
  console.log('Received error alert request with method:', request.method)
  try {
    const body = await request.json()
    console.log('Request body:', JSON.stringify(body, null, 2))
    const { error, context } = body

    if (!error || !context) {
      return NextResponse.json(
        { message: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Add error handling for email service
    try {
      await sendErrorAlert(error, context)
      return NextResponse.json(
        { message: 'Error alert sent successfully' },
        { status: 200 }
      )
    } catch (emailError) {
      console.error('Email service error:', emailError)
      return NextResponse.json(
        {
          message: 'Failed to send error alert email',
          error:
            emailError instanceof Error ? emailError.message : 'Unknown error',
        },
        { status: 500 }
      )
    }
  } catch (err) {
    console.error('Error processing request:', err)
    return NextResponse.json(
      {
        message: 'Failed to process error alert request',
        error: err instanceof Error ? err.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}

// This handles other HTTP methods
export async function GET() {
  return NextResponse.json({ message: 'Method not allowed' }, { status: 405 })
}
