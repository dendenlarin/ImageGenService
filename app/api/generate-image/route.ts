import { NextRequest, NextResponse } from 'next/server'
import { GeminiModel } from '@/lib/types'

/**
 * API route for generating images with Gemini API
 * This runs on the server to avoid CORS issues
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

    // Determine the model name
    const modelName =
      model === 'imagen-4' ? 'imagen-4.0-generate-001' : 'nano-banana'
    const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generate`

    // Make the request to Gemini API
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-goog-api-key': apiKey,
      },
      body: JSON.stringify({
        prompt: {
          text: prompt,
        },
        config: {
          aspectRatio: '1:1',
          numberOfImages: 1,
        },
      }),
    })

    if (!response.ok) {
      const error = await response.json()
      console.error('Gemini API error:', error)
      return NextResponse.json(
        { error: error.error?.message || 'Gemini API request failed' },
        { status: response.status }
      )
    }

    const data = await response.json()

    // Extract image URL from response
    const imageUrl =
      data.images?.[0]?.url || data.generatedImages?.[0]?.url || ''

    if (!imageUrl) {
      return NextResponse.json(
        { error: 'No image URL in response' },
        { status: 500 }
      )
    }

    return NextResponse.json({ imageUrl })
  } catch (error) {
    console.error('API route error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}
