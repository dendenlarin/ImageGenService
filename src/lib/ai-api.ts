// AI API utilities for OpenAI and Gemini

import { generateText } from 'ai'
import { openai } from '@ai-sdk/openai'
import { getSettings } from './storage'
import { GeminiModel } from './types'

/**
 * Generate text using OpenAI API with Vercel AI SDK
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
    const { text } = await generateText({
      model: openai('gpt-4o-mini', {
        apiKey: settings.openaiApiKey,
      }),
      system: systemPrompt,
      prompt: userPrompt,
      temperature: 0.7,
      maxTokens: 1000,
    })

    return text
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
 * Generate image using Gemini Imagen API via Next.js API route
 * This avoids CORS issues by running the request on the server
 */
export async function generateImageWithGemini(
  prompt: string,
  model: GeminiModel
): Promise<string> {
  const settings = getSettings()

  if (!settings.geminiApiKey) {
    throw new Error('Gemini API key not configured')
  }

  try {
    // Call our API route instead of directly calling Gemini API
    const response = await fetch('/api/generate-image', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        prompt,
        model,
        apiKey: settings.geminiApiKey,
      }),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || 'Image generation failed')
    }

    const data = await response.json()
    return data.imageUrl
  } catch (error) {
    console.error('Gemini API error:', error)
    throw error
  }
}
