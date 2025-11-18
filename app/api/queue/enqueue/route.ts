import { NextRequest, NextResponse } from 'next/server'
import { Client } from '@upstash/qstash'

/**
 * API route for enqueuing generation tasks to QStash
 */
export async function POST(request: NextRequest) {
  try {
    const { generationId, taskId, qstashToken } = await request.json()

    if (!generationId || !taskId || !qstashToken) {
      return NextResponse.json(
        { error: 'Missing required fields: generationId, taskId, or qstashToken' },
        { status: 400 }
      )
    }

    // Initialize QStash client
    const client = new Client({ token: qstashToken })

    // Get the base URL for the callback
    const baseUrl = process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : request.headers.get('origin') || 'http://localhost:3000'

    // Enqueue the task
    const result = await client.publishJSON({
      url: `${baseUrl}/api/queue/process-task`,
      body: {
        generationId,
        taskId,
      },
    })

    return NextResponse.json({
      messageId: result.messageId,
      success: true,
    })
  } catch (error) {
    console.error('Enqueue error:', error)
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    return NextResponse.json({ error: errorMessage }, { status: 500 })
  }
}
