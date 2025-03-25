import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/database';
import { Project } from '@/models/projects';

import { isValidObjectId } from 'mongoose';
import { uploadToStorage } from '@/lib/utils';

// Connect to database before processing reques

export async function POST(req: NextRequest) {
  try {
    // Connect to database
    await connectDB();
    
    // Parse form data
    const formData = await req.formData();
    
    // Extract project ID and validate
    const projectId = formData.get('projectId') as string;
    if (!projectId || !isValidObjectId(projectId)) {
      return NextResponse.json({ error: 'Valid project ID is required' }, { status: 400 });
    }
    
    // Find project by ID
    const project = await Project.findById(projectId);
    if (!project) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }
    
    // Extract gallery image
    const galleryImageFile = formData.get('galleryImage') as File | null;
    if (!galleryImageFile) {
      return NextResponse.json({ error: 'Gallery image is required' }, { status: 400 });
    }
    
    // Convert image File to Buffer and upload
    const galleryImageBuffer = Buffer.from(await galleryImageFile.arrayBuffer());
    const galleryImageName = `projects/${project.slug}/gallery-${Date.now()}-${galleryImageFile.name.replace(/\s/g, '-')}`;
    
    // Upload image to storage
    const galleryImageUrl = await uploadToStorage(galleryImageBuffer, galleryImageName, galleryImageFile.type);
    
    // Add gallery image URL to project
    project.galleryImages.push(galleryImageUrl);
    await project.save();
    
    // Return success response
    return NextResponse.json({
      message: 'Gallery image uploaded successfully',
      imageUrl: galleryImageUrl
    }, { status: 200 });
    
  } catch (error) {
    console.error('Error uploading gallery image:', error);
    return NextResponse.json({ 
      error: error instanceof Error ? error.message : 'Failed to upload gallery image' 
    }, { status: 500 });
  }
}

// For handling large uploads
export const config = {
  api: {
    bodyParser: false,
  },
};