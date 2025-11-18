// Supabase Storage utilities for image uploads

import { createClient, SupabaseClient } from '@supabase/supabase-js'

/**
 * Configuration for Supabase Storage
 */
export interface SupabaseConfig {
  url: string
  anonKey: string
}

/**
 * Bucket name for generated images
 */
const BUCKET_NAME = 'generated-images'

/**
 * Creates a Supabase client instance
 */
function createSupabaseClient(config: SupabaseConfig): SupabaseClient | null {
  if (!config.url || !config.anonKey) {
    return null
  }

  try {
    return createClient(config.url, config.anonKey)
  } catch (error) {
    console.error('Error creating Supabase client:', error)
    return null
  }
}

/**
 * Checks if Supabase is configured
 */
export function isSupabaseConfigured(config: SupabaseConfig): boolean {
  return Boolean(config.url && config.anonKey)
}

/**
 * Converts base64 string to Blob
 */
function base64ToBlob(base64: string, mimeType: string = 'image/png'): Blob {
  // Remove data URL prefix if present
  const base64Data = base64.replace(/^data:image\/\w+;base64,/, '')

  // Decode base64
  const byteCharacters = atob(base64Data)
  const byteArrays: Uint8Array[] = []

  for (let offset = 0; offset < byteCharacters.length; offset += 512) {
    const slice = byteCharacters.slice(offset, offset + 512)
    const byteNumbers = new Array(slice.length)

    for (let i = 0; i < slice.length; i++) {
      byteNumbers[i] = slice.charCodeAt(i)
    }

    const byteArray = new Uint8Array(byteNumbers)
    byteArrays.push(byteArray)
  }

  return new Blob(byteArrays, { type: mimeType })
}

/**
 * Generates a unique file path for the image
 */
function generateFilePath(
  generationId: string,
  taskId: string,
  extension: string = 'png'
): string {
  const timestamp = Date.now()
  return `generations/${generationId}/${taskId}_${timestamp}.${extension}`
}

/**
 * Uploads image to Supabase Storage
 *
 * @param base64Image - Base64 encoded image string
 * @param generationId - ID of the generation
 * @param taskId - ID of the task
 * @param config - Supabase configuration
 * @param mimeType - MIME type of the image (default: 'image/png')
 * @returns Public URL of the uploaded image, or null if upload failed
 */
export async function uploadImageToSupabase(
  base64Image: string,
  generationId: string,
  taskId: string,
  config: SupabaseConfig,
  mimeType: string = 'image/png'
): Promise<string | null> {
  try {
    // Check if Supabase is configured
    if (!isSupabaseConfigured(config)) {
      console.warn('Supabase is not configured, skipping upload')
      return null
    }

    // Create Supabase client
    const supabase = createSupabaseClient(config)
    if (!supabase) {
      console.error('Failed to create Supabase client')
      return null
    }

    // Convert base64 to blob
    const blob = base64ToBlob(base64Image, mimeType)

    // Generate unique file path
    const extension = mimeType.split('/')[1] || 'png'
    const filePath = generateFilePath(generationId, taskId, extension)

    console.log(`Uploading image to Supabase: ${filePath}`)

    // Upload to Supabase Storage
    const { data, error } = await supabase.storage
      .from(BUCKET_NAME)
      .upload(filePath, blob, {
        contentType: mimeType,
        cacheControl: '3600', // Cache for 1 hour
        upsert: false, // Don't overwrite existing files
      })

    if (error) {
      console.error('Supabase upload error:', error)
      return null
    }

    // Get public URL
    const { data: publicUrlData } = supabase.storage
      .from(BUCKET_NAME)
      .getPublicUrl(filePath)

    if (!publicUrlData?.publicUrl) {
      console.error('Failed to get public URL')
      return null
    }

    console.log(`Image uploaded successfully: ${publicUrlData.publicUrl}`)
    return publicUrlData.publicUrl
  } catch (error) {
    console.error('Error uploading image to Supabase:', error)
    return null
  }
}

/**
 * Uploads image with fallback to base64 data URL
 *
 * @param base64Image - Base64 encoded image string
 * @param generationId - ID of the generation
 * @param taskId - ID of the task
 * @param config - Supabase configuration
 * @param mimeType - MIME type of the image
 * @returns Public URL from Supabase, or base64 data URL as fallback
 */
export async function uploadImageWithFallback(
  base64Image: string,
  generationId: string,
  taskId: string,
  config: SupabaseConfig,
  mimeType: string = 'image/png'
): Promise<string> {
  // Try to upload to Supabase
  const supabaseUrl = await uploadImageToSupabase(
    base64Image,
    generationId,
    taskId,
    config,
    mimeType
  )

  // If upload succeeded, return Supabase URL
  if (supabaseUrl) {
    return supabaseUrl
  }

  // Fallback to base64 data URL
  console.log('Using base64 data URL as fallback')
  const base64Data = base64Image.replace(/^data:image\/\w+;base64,/, '')
  return `data:${mimeType};base64,${base64Data}`
}

/**
 * Deletes all images for a generation
 *
 * @param generationId - ID of the generation
 * @param config - Supabase configuration
 * @returns True if deletion succeeded, false otherwise
 */
export async function deleteGenerationImages(
  generationId: string,
  config: SupabaseConfig
): Promise<boolean> {
  try {
    if (!isSupabaseConfigured(config)) {
      console.warn('Supabase is not configured, skipping deletion')
      return false
    }

    const supabase = createSupabaseClient(config)
    if (!supabase) {
      return false
    }

    // List all files in the generation folder
    const { data: files, error: listError } = await supabase.storage
      .from(BUCKET_NAME)
      .list(`generations/${generationId}`)

    if (listError || !files) {
      console.error('Error listing files:', listError)
      return false
    }

    // If no files, nothing to delete
    if (files.length === 0) {
      return true
    }

    // Delete all files
    const filePaths = files.map(
      (file) => `generations/${generationId}/${file.name}`
    )
    const { error: deleteError } = await supabase.storage
      .from(BUCKET_NAME)
      .remove(filePaths)

    if (deleteError) {
      console.error('Error deleting files:', deleteError)
      return false
    }

    console.log(`Deleted ${files.length} images for generation ${generationId}`)
    return true
  } catch (error) {
    console.error('Error deleting generation images:', error)
    return false
  }
}
