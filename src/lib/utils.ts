import fs from 'fs'
import path from 'path'
import { promisify } from 'util'

// Create directory if it doesn't exist
const mkdir = promisify(fs.mkdir)
const writeFile = promisify(fs.writeFile)

/**
 * Upload file to storage (local filesystem implementation)
 * You can replace this with S3, Firebase Storage, etc.
 *
 * @param buffer - File buffer to upload
 * @param fileName - Desired file name with path
 * @param mimeType - MIME type of the file
 * @returns URL of the uploaded file
 */
export async function uploadToStorage(
  buffer: Buffer,
  fileName: string,
  mimeType: string
): Promise<string> {
  // Define uploads directory - adjust based on your project structure
  const uploadsDir = path.join(process.cwd(), 'media')
  console.log(mimeType)
  // Create full file path
  const filePath = path.join(uploadsDir, fileName)

  // Ensure directory exists
  const dirPath = path.dirname(filePath)
  await mkdir(dirPath, { recursive: true })

  // Write file to disk
  await writeFile(filePath, buffer)

  // Return public URL
  return `/uploads/${fileName}`
}

/**
 * Delete file from storage
 *
 * @param fileUrl - URL of the file to delete
 * @returns boolean indicating success
 */
export async function deleteFromStorage(fileUrl: string): Promise<boolean> {
  try {
    // Extract file path from URL
    const filePath = path.join(
      process.cwd(),
      'public',
      fileUrl.replace(/^\//, '') // Remove leading slash if present
    )

    // Check if file exists
    if (fs.existsSync(filePath)) {
      // Delete file
      fs.unlinkSync(filePath)
      return true
    }

    return false
  } catch (error) {
    console.error('Error deleting file:', error)
    return false
  }
}
