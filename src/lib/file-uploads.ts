// lib/file-uploads.ts
import { v4 as uuidv4 } from 'uuid';
import { supabaseServerClient } from './supabase-server';

// Maximum file size in bytes (5MB)
const MAX_FILE_SIZE = 5 * 1024 * 1024;

// Allowed file types
const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

// Sanitize filename for storage
function sanitizeFilename(filename: string): string {
  return filename
    .replace(/[^a-z0-9]/gi, '-')
    .replace(/-+/g, '-')
    .toLowerCase();
}

// Validate file before upload
function validateFile(file: File): { valid: boolean; error?: string } {
  if (!ALLOWED_MIME_TYPES.includes(file.type)) {
    return {
      valid: false,
      error: `Unsupported file type. Allowed types: ${ALLOWED_MIME_TYPES.map(type => type.split('/')[1]).join(', ')}`
    };
  }
  
  if (file.size > MAX_FILE_SIZE) {
    return {
      valid: false,
      error: `File too large. Maximum size is ${MAX_FILE_SIZE / (1024 * 1024)}MB`
    };
  }
  
  return { valid: true };
}

// Upload a single file to Supabase storage
async function uploadFile(
  file: File,
  slug: string,
  prefix: string
): Promise<string> {
  // Validate file
  const validation = validateFile(file);
  if (!validation.valid) {
    throw new Error(validation.error);
  }
  
  // Get file extension from mime type
  const fileExtension = file.type.split('/')[1];
  
  // Create unique filename
  const uniqueId = uuidv4().substring(0, 8);
  const sanitizedName = sanitizeFilename(file.name.split('.')[0]);
  const filename = `${slug}-${prefix}-${sanitizedName}-${uniqueId}.${fileExtension}`;
  
  // Path in Supabase storage
  const storagePath = `projects/${slug}/${filename}`;
  
  // Convert file to buffer
  const buffer = Buffer.from(await file.arrayBuffer());
  
  // Upload to Supabase
  const supabase = supabaseServerClient();
  const { data, error } = await supabase.storage
    .from('canaarchitecture')
    .upload(storagePath, buffer, {
      contentType: file.type,
      upsert: true
    });
  
  if (error) {
    console.error('Supabase storage error:', error);
    throw new Error(`File upload failed: ${error.message}`);
  }
  
  // Get public URL
  const { data: urlData } = supabase.storage
    .from('canaarchitecture')
    .getPublicUrl(storagePath);
  
  return urlData.publicUrl;
}

// Upload all project files (cover + project images)
export async function uploadProjectFiles(
  slug: string,
  coverImage: File,
  projectImages: File[]
): Promise<{ coverImageUrl: string; projectImageUrls: string[] }> {
  try {
    // Upload cover image
    const coverImageUrl = await uploadFile(coverImage, slug, 'cover');
    
    // Upload project images
    const projectImagePromises = projectImages.map((file, index) => 
      uploadFile(file, slug, `image-${index + 1}`)
    );
    
    const projectImageUrls = await Promise.all(projectImagePromises);
    
    return {
      coverImageUrl,
      projectImageUrls
    };
  } catch (error) {
    console.error('Error in uploadProjectFiles:', error);
    throw error;
  }
}