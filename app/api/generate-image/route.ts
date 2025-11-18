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
    // Note: imagen-4 is not yet available, using imagen-3 instead
    const modelName =
      model === 'imagen-4' ? 'imagen-3.0-generate-001' : 'imagen-3.0-generate-001'
    const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:predict`

    // Make the request to Gemini API
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-goog-api-key': apiKey,
      },
      body: JSON.stringify({
        instances: [
          {
            prompt: prompt,
          },
        ],
        parameters: {
          sampleCount: 1,
          aspectRatio: '1:1',
        },
      }),
    })

    if (!response.ok) {
      let errorMessage = 'Gemini API request failed'
      try {
        const error = await response.json()
        console.error('Gemini API error:', error)
        errorMessage = error.error?.message || error.message || errorMessage
      } catch (e) {
        console.error('Failed to parse error response:', e)
        errorMessage = `${errorMessage}: ${response.statusText} (${response.status})`
      }
      return NextResponse.json({ error: errorMessage }, { status: response.status })
    }

    const data = await response.json()
    console.log('Gemini API response:', JSON.stringify(data, null, 2))

    // Extract image URL from response
    // Gemini API returns predictions array with images
    const imageUrl =
      data.predictions?.[0]?.bytesBase64Encoded ||
      data.predictions?.[0]?.mimeType ||
      data.images?.[0]?.url ||
      data.generatedImages?.[0]?.url ||
      ''

    // If we got base64 encoded image, convert it to data URL
    if (data.predictions?.[0]?.bytesBase64Encoded) {
      const mimeType = data.predictions[0].mimeType || 'image/png'
      const base64Image = data.predictions[0].bytesBase64Encoded
      return NextResponse.json({
        imageUrl: `data:${mimeType};base64,${base64Image}`,
      })
    }

    if (!imageUrl) {
      console.error('No image found in response:', data)
      return NextResponse.json(
        {
          error: 'No image URL in response. Check console for full response details.',
        },
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
