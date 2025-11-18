// Utilities for working with prompts and parameters

import { Parameter, Prompt, PromptVariant } from './types'
import { getParameterByName } from './storage'

/**
 * Extract parameter names from prompt content
 * Finds all {{parameter_name}} patterns
 */
export function extractParameterNames(content: string): string[] {
  const regex = /\{\{(\w+)\}\}/g
  const matches = content.matchAll(regex)
  const names = Array.from(matches, (match) => match[1])
  return Array.from(new Set(names)) // Remove duplicates
}

/**
 * Check if a parameter exists in the system
 */
export function isParameterValid(name: string): boolean {
  return getParameterByName(name) !== undefined
}

/**
 * Validate all parameters in a prompt
 * Returns array of invalid parameter names
 */
export function validatePromptParameters(content: string): {
  valid: string[]
  invalid: string[]
} {
  const parameterNames = extractParameterNames(content)
  const valid: string[] = []
  const invalid: string[] = []

  parameterNames.forEach((name) => {
    if (isParameterValid(name)) {
      valid.push(name)
    } else {
      invalid.push(name)
    }
  })

  return { valid, invalid }
}

/**
 * Replace parameters in prompt with actual values
 */
export function replaceParameters(
  content: string,
  values: Record<string, string>
): string {
  let result = content
  Object.entries(values).forEach(([name, value]) => {
    const regex = new RegExp(`\\{\\{${name}\\}\\}`, 'g')
    result = result.replace(regex, value)
  })
  return result
}

/**
 * Generate cartesian product of parameter values
 * Creates all possible combinations of parameter values
 */
export function generatePromptVariants(prompt: Prompt): PromptVariant[] {
  const parameterNames = extractParameterNames(prompt.content)

  // Get all parameters with their values
  const parameters: Array<{ name: string; values: string[] }> = []
  for (const name of parameterNames) {
    const param = getParameterByName(name)
    if (param && param.values.length > 0) {
      parameters.push({ name, values: param.values })
    }
  }

  // If no valid parameters, return single variant with original content
  if (parameters.length === 0) {
    return [
      {
        id: `${prompt.id}-variant-0`,
        promptId: prompt.id,
        content: prompt.content,
        parameters: {},
      },
    ]
  }

  // Generate cartesian product
  const combinations = cartesianProduct(
    parameters.map((p) => p.values)
  )

  // Create variants
  return combinations.map((combination, index) => {
    const parameterValues: Record<string, string> = {}
    parameters.forEach((param, i) => {
      parameterValues[param.name] = combination[i]
    })

    return {
      id: `${prompt.id}-variant-${index}`,
      promptId: prompt.id,
      content: replaceParameters(prompt.content, parameterValues),
      parameters: parameterValues,
    }
  })
}

/**
 * Helper function to generate cartesian product of arrays
 */
function cartesianProduct<T>(arrays: T[][]): T[][] {
  if (arrays.length === 0) return [[]]
  if (arrays.length === 1) return arrays[0].map((item) => [item])

  const [first, ...rest] = arrays
  const restProduct = cartesianProduct(rest)

  return first.flatMap((item) =>
    restProduct.map((combination) => [item, ...combination])
  )
}

/**
 * Format parameter values for display
 */
export function formatParameterValues(values: string[]): string {
  return values.join(', ')
}

/**
 * Parse comma-separated values into array
 */
export function parseParameterValues(input: string): string[] {
  return input
    .split(',')
    .map((v) => v.trim())
    .filter((v) => v.length > 0)
}
