import { NextRequest, NextResponse } from 'next/server'
import { verifySignatureAppRouter } from '@upstash/qstash/nextjs'

/**
 * API route for processing generation tasks from QStash
 * This endpoint is called by QStash and protected by signature verification
 */
async function handler(request: NextRequest) {
  try {
    const { generationId, taskId } = await request.json()

    if (!generationId || !taskId) {
      return NextResponse.json(
        { error: 'Missing required fields: generationId or taskId' },
        { status: 400 }
      )
    }

    console.log(
      `Processing task ${taskId} for generation ${generationId} via QStash`
    )

    // Return success - the actual processing will be handled on the client side
    // by polling the generation status or using webhooks
    return NextResponse.json({
      success: true,
      generationId,
      taskId,
      message: 'Task queued for processing',
    })
  } catch (error) {
    console.error('Process task error:', error)
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    return NextResponse.json({ error: errorMessage }, { status: 500 })
  }
}

// Export with signature verification if QStash signing keys are available
export const POST =
  process.env.QSTASH_CURRENT_SIGNING_KEY && process.env.QSTASH_NEXT_SIGNING_KEY
    ? verifySignatureAppRouter(handler)
    : handler
