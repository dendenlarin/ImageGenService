import { NextRequest, NextResponse } from 'next/server'

/**
 * In-memory store for task results
 * In production, replace this with Vercel KV or a database
 */
const taskResults = new Map<
  string,
  {
    taskId: string
    generationId: string
    status: 'completed' | 'failed'
    imageUrl?: string
    error?: string
    completedAt: string
  }
>()

/**
 * Store task result (called by QStash callback or webhook)
 */
export async function POST(request: NextRequest) {
  try {
    const { taskId, generationId, status, imageUrl, error } =
      await request.json()

    if (!taskId || !generationId || !status) {
      return NextResponse.json(
        { error: 'Missing required fields: taskId, generationId, status' },
        { status: 400 }
      )
    }

    // Store the result
    taskResults.set(taskId, {
      taskId,
      generationId,
      status,
      imageUrl,
      error,
      completedAt: new Date().toISOString(),
    })

    console.log(`[TaskResults] Stored result for task ${taskId}: ${status}`)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('[TaskResults] Error storing result:', error)
    return NextResponse.json(
      { error: 'Failed to store task result' },
      { status: 500 }
    )
  }
}

/**
 * Get task results for a generation (polling endpoint)
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const generationId = searchParams.get('generationId')
    const taskIds = searchParams.get('taskIds')?.split(',') || []

    if (!generationId) {
      return NextResponse.json(
        { error: 'Missing generationId parameter' },
        { status: 400 }
      )
    }

    // Get results for requested task IDs
    const results: Record<string, any> = {}

    for (const taskId of taskIds) {
      const result = taskResults.get(taskId)
      if (result && result.generationId === generationId) {
        results[taskId] = result
        // Clean up old results after retrieval
        taskResults.delete(taskId)
      }
    }

    return NextResponse.json({ results })
  } catch (error) {
    console.error('[TaskResults] Error retrieving results:', error)
    return NextResponse.json(
      { error: 'Failed to retrieve task results' },
      { status: 500 }
    )
  }
}
