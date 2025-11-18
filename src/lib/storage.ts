// Storage utilities for managing app data in localStorage

import { Settings, Parameter, Prompt, Generation } from './types'

const STORAGE_KEYS = {
  SETTINGS: 'image-gen-settings',
  PARAMETERS: 'image-gen-parameters',
  PROMPTS: 'image-gen-prompts',
  GENERATIONS: 'image-gen-generations',
} as const

// Default settings
const DEFAULT_SETTINGS: Settings = {
  openaiApiKey: '',
  geminiApiKey: '',
  supabaseUrl: '',
  supabaseAnonKey: '',
  systemPrompts: {
    parameters:
      'You are an AI assistant that generates parameter values. Given a parameter name, generate a comma-separated list of relevant values.',
    prompts:
      'You are an AI assistant that generates image generation prompts. Given a topic or theme, create a detailed, descriptive prompt suitable for AI image generation.',
    generations:
      'You are an AI assistant helping with image generation workflows.',
  },
}

// Generic storage functions
function getFromStorage<T>(key: string, defaultValue: T): T {
  if (typeof window === 'undefined') return defaultValue

  try {
    const item = window.localStorage.getItem(key)
    return item ? JSON.parse(item) : defaultValue
  } catch (error) {
    console.error(`Error reading ${key} from localStorage:`, error)
    return defaultValue
  }
}

function saveToStorage<T>(key: string, value: T): void {
  if (typeof window === 'undefined') return

  try {
    window.localStorage.setItem(key, JSON.stringify(value))
  } catch (error) {
    console.error(`Error saving ${key} to localStorage:`, error)
  }
}

// Settings
export function getSettings(): Settings {
  return getFromStorage(STORAGE_KEYS.SETTINGS, DEFAULT_SETTINGS)
}

export function saveSettings(settings: Settings): void {
  saveToStorage(STORAGE_KEYS.SETTINGS, settings)
}

// Parameters
export function getParameters(): Parameter[] {
  return getFromStorage<Parameter[]>(STORAGE_KEYS.PARAMETERS, [])
}

export function saveParameters(parameters: Parameter[]): void {
  saveToStorage(STORAGE_KEYS.PARAMETERS, parameters)
}

export function getParameterById(id: string): Parameter | undefined {
  return getParameters().find((p) => p.id === id)
}

export function getParameterByName(name: string): Parameter | undefined {
  return getParameters().find((p) => p.name === name)
}

// Prompts
export function getPrompts(): Prompt[] {
  return getFromStorage<Prompt[]>(STORAGE_KEYS.PROMPTS, [])
}

export function savePrompts(prompts: Prompt[]): void {
  saveToStorage(STORAGE_KEYS.PROMPTS, prompts)
}

export function getPromptById(id: string): Prompt | undefined {
  return getPrompts().find((p) => p.id === id)
}

// Generations
export function getGenerations(): Generation[] {
  return getFromStorage<Generation[]>(STORAGE_KEYS.GENERATIONS, [])
}

export function saveGenerations(generations: Generation[]): void {
  saveToStorage(STORAGE_KEYS.GENERATIONS, generations)
}

export function getGenerationById(id: string): Generation | undefined {
  return getGenerations().find((g) => g.id === id)
}
