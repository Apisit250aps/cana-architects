// app/api/projects/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { uploadProjectFiles } from '@/lib/file-uploads';
import { createProject, checkSlugExists } from '@/lib/db';
import { createSlug } from '@/lib/utils';

export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    // Parse multipart form data
    const formData = await req.formData();
    
    // Extract basic project details
    const title = formData.get('title') as string;
    const location = formData.get('location') as string;
    const description = formData.get('description') as string;
    
    // Validate required fields
    if (!title || !location || !description) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }
    
    // Create URL slug from title
    const baseSlug = createSlug(title);
    
    // Check if slug exists and get a unique one if needed
    const { uniqueSlug } = await checkSlugExists(baseSlug);
    
    // Get all form fields
    const projectData = {
      title,
      slug: uniqueSlug,
      location,
      type: formData.get('type') as string || '',
      category: formData.get('category') as string || 'exterior',
      program: formData.get('program') as string || '',
      client: formData.get('client') as string || '',
      siteArea: formData.get('siteArea') as string || '',
      builtArea: formData.get('builtArea') as string || '',
      design: formData.get('design') as string || '',
      completion: formData.get('completion') as string || '',
      description,
      tags: JSON.parse(formData.get('tags') as string || '[]'),
    };
    
    // Get cover image file
    const coverImageFile = formData.get('coverImage') as File;
    if (!coverImageFile) {
      return NextResponse.json(
        { success: false, error: 'Cover image is required' },
        { status: 400 }
      );
    }
    
    // Find project image files
    const projectImageFiles: File[] = [];
    for (const [key, value] of formData.entries()) {
      if (key.startsWith('projectImage-') && value instanceof File) {
        projectImageFiles.push(value);
      }
    }
    
    // Upload files to Supabase Storage
    const { coverImageUrl, projectImageUrls } = await uploadProjectFiles(
      uniqueSlug,
      coverImageFile,
      projectImageFiles
    );
    
    // Save project to MongoDB
    const project = await createProject({
      ...projectData,
      coverImage: coverImageUrl,
      images: projectImageUrls,
    });
    
    // Return success response
    return NextResponse.json({
      success: true,
      message: 'Project created successfully',
      project
    }, { status: 201 });
    
  } catch (error: any) {
    console.error('Error creating project:', error);
    
    return NextResponse.json({
      success: false,
      error: error.message || 'An unknown error occurred'
    }, { status: 500 });
  }
}

// Check if a slug exists or suggest a new one
export async function GET(req: NextRequest): Promise<NextResponse> {
  try {
    const { searchParams } = new URL(req.url);
    const title = searchParams.get('title');
    
    if (!title) {
      return NextResponse.json(
        { success: false, error: 'Title parameter is required' },
        { status: 400 }
      );
    }
    
    const baseSlug = createSlug(title);
    const { exists, uniqueSlug } = await checkSlugExists(baseSlug);
    
    return NextResponse.json({
      success: true,
      exists,
      suggestedSlug: uniqueSlug
    });
    
  } catch (error: any) {
    console.error('Error checking slug:', error);
    
    return NextResponse.json({
      success: false,
      error: error.message || 'An unknown error occurred'
    }, { status: 500 });
  }
}