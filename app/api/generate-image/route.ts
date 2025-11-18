import { NextRequest, NextResponse } from 'next/server'
import { createGoogleGenerativeAI } from '@ai-sdk/google'
import { experimental_generateImage as generateImage } from 'ai'
import { GeminiModel } from '@/lib/types'

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
 * API route for generating images with Gemini API using Vercel AI SDK
 * This runs on the server to avoid CORS issues and keep API keys secure
 * Includes retry logic for handling transient errors
 */
export async function POST(request: NextRequest) {
  try {
    const { prompt, model, apiKey } = await request.json()

    if (!prompt || !model || !apiKey) {
      return NextResponse.json(
        { error: 'Missing required fields: prompt, model, or apiKey' },
        { status: 400 }
      )
    }

    // Map model names to correct Gemini model identifiers
    const modelName =
      model === 'imagen-4'
        ? 'imagen-4.0-generate-001'
        : 'gemini-2.5-flash-image'

    console.log(`Generating image with model: ${modelName}`)
    console.log(`Prompt: ${prompt}`)

    // Create Google provider instance with API key
    const google = createGoogleGenerativeAI({ apiKey })

    // Generate image with retry logic
    const { image } = await retryWithBackoff(
      async () => {
        return await generateImage({
          model: google.image(modelName),
          prompt: prompt,
          aspectRatio: '1:1',
        })
      },
      3, // max retries
      1000 // base delay in ms
    )

    // Convert image to base64 data URL
    const base64Image = image.base64
    const mimeType = image.contentType || 'image/png'
    const imageUrl = `data:${mimeType};base64,${base64Image}`

    console.log('Image generated successfully')

    return NextResponse.json({ imageUrl })
  } catch (error) {
    console.error('API route error:', error)
    const errorMessage =
      error instanceof Error ? error.message : 'Unknown error'

    // Provide more detailed error messages
    let detailedError = errorMessage
    if (errorMessage.includes('API key')) {
      detailedError = 'Invalid or missing API key. Please check your Gemini API key in settings.'
    } else if (errorMessage.includes('quota')) {
      detailedError = 'API quota exceeded. Please try again later or check your API limits.'
    } else if (errorMessage.includes('rate limit')) {
      detailedError = 'Rate limit exceeded. Please wait before making more requests.'
    } else if (errorMessage.includes('timeout')) {
      detailedError = 'Request timed out. Please try again.'
    }

    return NextResponse.json({ error: detailedError }, { status: 500 })
  }
}
