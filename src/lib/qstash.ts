// QStash utilities for managing generation queues

import { getSettings } from './storage'

export interface QStashPublishOptions {
  url: string
  body: Record<string, unknown>
  delay?: number // Delay in seconds
  retries?: number
  headers?: Record<string, string>
}

/**
 * Publish a message to QStash
 * @param options Publishing options
 * @returns QStash message ID
 */
export async function publishToQStash(
  options: QStashPublishOptions
): Promise<string> {
  const settings = getSettings()

  if (!settings.qstashToken) {
    throw new Error('QStash token not configured')
  }

  const { url, body, delay, retries = 3, headers = {} } = options

  const qstashHeaders: Record<string, string> = {
    Authorization: `Bearer ${settings.qstashToken}`,
    'Content-Type': 'application/json',
    'Upstash-Retries': retries.toString(),
    ...headers,
  }

  // Add delay if specified
  if (delay) {
    qstashHeaders['Upstash-Delay'] = `${delay}s`
  }

  try {
    const response = await fetch('https://qstash.upstash.io/v2/publish/' + url, {
      method: 'POST',
      headers: qstashHeaders,
      body: JSON.stringify(body),
    })

    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(`QStash publish failed: ${response.status} ${errorText}`)
    }

    const result = await response.json()
    return result.messageId
  } catch (error) {
    console.error('QStash publish error:', error)
    throw error
  }
}

/**
 * Enqueue a generation task to QStash with rate limiting
 * @param taskData Task data to process
 * @param geminiApiKey Gemini API key for image generation
 * @param delaySeconds Delay before processing (for rate limiting)
 * @returns QStash message ID
 */
export async function enqueueGenerationTask(
  taskData: {
    generationId: string
    taskId: string
    prompt: string
    model: string
  },
  geminiApiKey: string,
  delaySeconds: number = 0
): Promise<string> {
  const settings = getSettings()

  // Get the base URL for the webhook endpoint
  const baseUrl =
    typeof window !== 'undefined'
      ? window.location.origin
      : process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : 'http://localhost:3000'

  const webhookUrl = `${baseUrl}/api/process-generation-task`
  const callbackUrl = `${baseUrl}/api/task-results`

  return publishToQStash({
    url: webhookUrl,
    body: {
      ...taskData,
      geminiApiKey,
      supabaseUrl: settings.supabaseUrl || '',
      supabaseAnonKey: settings.supabaseAnonKey || '',
    },
    delay: delaySeconds,
    retries: 3,
    headers: {
      'Upstash-Callback': callbackUrl,
    },
  })
}

/**
 * Cancel a QStash message by ID
 * @param messageId QStash message ID
 */
export async function cancelQStashMessage(messageId: string): Promise<void> {
  const settings = getSettings()

  if (!settings.qstashToken) {
    throw new Error('QStash token not configured')
  }

  try {
    const response = await fetch(
      `https://qstash.upstash.io/v2/messages/${messageId}`,
      {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${settings.qstashToken}`,
        },
      }
    )

    if (!response.ok) {
      const errorText = await response.text()
      console.warn(`Failed to cancel QStash message: ${errorText}`)
    }
  } catch (error) {
    console.error('Error canceling QStash message:', error)
    throw error
  }
}
