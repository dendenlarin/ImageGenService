import { NextRequest, NextResponse } from 'next/server'
import { createGoogleGenerativeAI } from '@ai-sdk/google'
import { experimental_generateImage as generateImage } from 'ai'

/**
 * Verify QStash signature to ensure request is from QStash
 * In production, you should verify the signature using Upstash SDK
 */
function verifyQStashSignature(request: NextRequest): boolean {
  // For now, we'll skip signature verification for development
  // In production, use @upstash/qstash SDK to verify:
  // const { verify } = require("@upstash/qstash/nextjs");
  // return verify(request);

  // Check if request has QStash headers
  const qstashSignature = request.headers.get('upstash-signature')
  return qstashSignature !== null || process.env.NODE_ENV === 'development'
}

/**
 * Retry utility for handling transient errors
 */
async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  maxRetries: number = 3,
  baseDelay: number = 1000
): Promise<T> {
  let lastError: Error | null = null

  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn()
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error))

      // Don't retry on validation errors (4xx)
      if (lastError.message.includes('400') || lastError.message.includes('401')) {
        throw lastError
      }

      // If this was the last attempt, throw the error
      if (i === maxRetries - 1) {
        throw lastError
      }

      // Wait before retrying with exponential backoff
      const delay = baseDelay * Math.pow(2, i)
      console.log(`Retry ${i + 1}/${maxRetries} after ${delay}ms...`)
      await new Promise((resolve) => setTimeout(resolve, delay))
    }
  }

  throw lastError || new Error('Retry failed')
}

/**
 * QStash webhook endpoint for processing generation tasks
 * This endpoint is called by QStash to generate images
 */
export async function POST(request: NextRequest) {
  let generationId: string = ''
  let taskId: string = ''

  try {
    // Verify QStash signature
    if (!verifyQStashSignature(request)) {
      return NextResponse.json(
        { error: 'Invalid QStash signature' },
        { status: 401 }
      )
    }

    const requestBody = await request.json()
    generationId = requestBody.generationId
    taskId = requestBody.taskId
    const prompt = requestBody.prompt
    const model = requestBody.model
    const geminiApiKey = requestBody.geminiApiKey

    if (!generationId || !taskId || !prompt || !model || !geminiApiKey) {
      return NextResponse.json(
        {
          error:
            'Missing required fields: generationId, taskId, prompt, model, or geminiApiKey',
        },
        { status: 400 }
      )
    }

    console.log(`[QStash] Processing task ${taskId} for generation ${generationId}`)
    console.log(`[QStash] Prompt: ${prompt}`)
    console.log(`[QStash] Model: ${model}`)

    // Map model names to correct Gemini model identifiers
    const modelName =
      model === 'imagen-4' ? 'imagen-4.0-generate-001' : 'gemini-2.5-flash-image'

    // Create Google provider instance with API key
    const google = createGoogleGenerativeAI({ apiKey: geminiApiKey })

    // Generate image with retry logic
    const { image } = await retryWithBackoff(
      async () => {
        return await generateImage({
          model: google.image(modelName),
          prompt: prompt,
          aspectRatio: '16:9',
          providerOptions: {
            google: {
              sampleCount: 1,
            },
          },
        })
      },
      3,
      1000
    )

    // Convert image to base64 data URL
    const base64Image = image.base64
    const mimeType = image.contentType || 'image/png'
    const imageUrl = `data:${mimeType};base64,${base64Image}`

    console.log(`[QStash] Successfully generated image for task ${taskId}`)

    // Store the result for client polling
    try {
      const baseUrl =
        process.env.VERCEL_URL
          ? `https://${process.env.VERCEL_URL}`
          : 'http://localhost:3000'

      await fetch(`${baseUrl}/api/task-results`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          taskId,
          generationId,
          status: 'completed',
          imageUrl,
        }),
      })
    } catch (storeError) {
      console.error('[QStash] Failed to store result:', storeError)
    }

    // Return the result - QStash will handle the response
    return NextResponse.json({
      success: true,
      generationId,
      taskId,
      imageUrl,
      status: 'completed',
    })
  } catch (error) {
    console.error('[QStash] Error processing task:', error)
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'

    // Store the error result for client polling
    if (generationId && taskId) {
      try {
        const baseUrl =
          process.env.VERCEL_URL
            ? `https://${process.env.VERCEL_URL}`
            : 'http://localhost:3000'

        await fetch(`${baseUrl}/api/task-results`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            taskId,
            generationId,
            status: 'failed',
            error: errorMessage,
          }),
        })
      } catch (storeError) {
        console.error('[QStash] Failed to store error result:', storeError)
      }
    }

    // Return error response
    return NextResponse.json(
      {
        success: false,
        error: errorMessage,
        status: 'failed',
      },
      { status: 500 }
    )
  }
}
