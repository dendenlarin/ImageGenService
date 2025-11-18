import { NextRequest, NextResponse } from 'next/server'
import { google } from '@ai-sdk/google'
import { experimental_generateImage as generateImage } from 'ai'
import { GeminiModel } from '@/lib/types'

/**
 * API route for generating images with Gemini API using Vercel AI SDK
 * This runs on the server to avoid CORS issues and keep API keys secure
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

    // Generate image using Vercel AI SDK
    const { image } = await generateImage({
      model: google.image(modelName, { apiKey }),
      prompt: prompt,
      aspectRatio: '1:1',
    })

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
    return NextResponse.json({ error: errorMessage }, { status: 500 })
  }
}
