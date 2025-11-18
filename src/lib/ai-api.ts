// AI API utilities for OpenAI and Gemini

import { getSettings } from './storage'
import { GeminiModel } from './types'

/**
 * Generate text using OpenAI API
 */
export async function generateWithOpenAI(
  systemPrompt: string,
  userPrompt: string
): Promise<string> {
  const settings = getSettings()

  if (!settings.openaiApiKey) {
    throw new Error('OpenAI API key not configured')
  }

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${settings.openaiApiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt },
        ],
        temperature: 0.7,
        max_tokens: 1000,
      }),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error?.message || 'OpenAI API request failed')
    }

    const data = await response.json()
    return data.choices[0]?.message?.content || ''
  } catch (error) {
    console.error('OpenAI API error:', error)
    throw error
  }
}

/**
 * Generate parameter values using OpenAI
 */
export async function generateParameterValues(
  parameterName: string,
  systemPrompt: string
): Promise<string> {
  const userPrompt = `Generate a comma-separated list of values for the parameter: "${parameterName}". Provide 5-10 relevant values.`
  return generateWithOpenAI(systemPrompt, userPrompt)
}

/**
 * Generate prompt content using OpenAI
 */
export async function generatePromptContent(
  promptName: string,
  systemPrompt: string
): Promise<string> {
  const userPrompt = `Create a detailed image generation prompt for the theme: "${promptName}". The prompt should be descriptive and suitable for AI image generation.`
  return generateWithOpenAI(systemPrompt, userPrompt)
}

/**
 * Generate image using Gemini Imagen API
 */
export async function generateImageWithGemini(
  prompt: string,
  model: GeminiModel
): Promise<string> {
  const settings = getSettings()

  if (!settings.geminiApiKey) {
    throw new Error('Gemini API key not configured')
  }

  // Note: This is a placeholder implementation
  // The actual Gemini Imagen API endpoint and request format may differ
  // Update this based on the official Gemini API documentation

  try {
    const modelName = model === 'imagen-4' ? 'imagen-4.0-generate-001' : 'nano-banana'
    const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generate`

    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-goog-api-key': settings.geminiApiKey,
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
      throw new Error(error.error?.message || 'Gemini API request failed')
    }

    const data = await response.json()
    // Extract image URL from response
    // This depends on the actual API response format
    return data.images?.[0]?.url || data.generatedImages?.[0]?.url || ''
  } catch (error) {
    console.error('Gemini API error:', error)
    throw error
  }
}
