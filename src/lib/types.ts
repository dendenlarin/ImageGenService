// Core types for Image Generation Service

export interface Settings {
  openaiApiKey: string
  geminiApiKey: string
  qstashToken?: string
  qstashUrl?: string
  supabaseUrl?: string
  supabaseAnonKey?: string
  systemPrompts: {
    parameters: string
    prompts: string
    generations: string
  }
}

export interface Parameter {
  id: string
  name: string // English name for parameter
  values: string[] // Array of values
  createdAt: string
  updatedAt: string
}

export interface Prompt {
  id: string
  name: string
  content: string // Prompt text with {{parameter_name}} placeholders
  createdAt: string
  updatedAt: string
}

export interface PromptVariant {
  id: string
  promptId: string
  content: string // Resolved prompt with actual values
  parameters: Record<string, string> // Map of parameter names to selected values
}

export type GeminiModel = 'imagen-4' | 'nano-banana'

export interface GenerationTask {
  id: string
  variantId: string
  prompt: string
  status: 'pending' | 'processing' | 'completed' | 'failed'
  imageUrl?: string
  error?: string
  qstashMessageId?: string
  retryCount?: number
  createdAt: string
  completedAt?: string
}

export interface Generation {
  id: string
  name: string
  promptId: string
  model: GeminiModel
  rateLimit: number // Requests per hour
  variants: PromptVariant[] // All possible combinations
  tasks: GenerationTask[] // Queue of generation tasks
  createdAt: string
  updatedAt: string
}
