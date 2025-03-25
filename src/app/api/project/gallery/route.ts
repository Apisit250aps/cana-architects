import { NextRequest, NextResponse } from 'next/server'
import { MongoClient, ObjectId } from 'mongodb'
import { createClient } from '@supabase/supabase-js'

// Environment variables
const MONGODB_URI = process.env.MONGODB_URI || '';
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

// Initialize MongoDB client
const client = new MongoClient(MONGODB_URI);

// Initialize Supabase client
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

export async function POST(req: NextRequest) {
  try {
    // Parse the form data
    const formData = await req.formData();
    
    // Extract data
    const projectId = formData.get('projectId') as string;
    const galleryImage = formData.get('galleryImage') as File;
    
    if (!projectId || !galleryImage) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }
    
    // Connect to MongoDB
    await client.connect();
    const db = client.db('architecture-portfolio');
    const projectsCollection = db.collection('projects');
    
    // Find the project to get the slug
    const project = await projectsCollection.findOne({ _id: new ObjectId(projectId) });
    
    if (!project) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }
    
    // Upload gallery image to Supabase
    const fileExt = galleryImage.name.split('.').pop();
    const timestamp = Date.now();
    const fileName = `${project.slug}-gallery-${timestamp}.${fileExt}`;
    
    // Convert File to ArrayBuffer
    const arrayBuffer = await galleryImage.arrayBuffer();
    const buffer = new Uint8Array(arrayBuffer);
    
    // Upload to Supabase Storage
    const { data: uploadData, error: uploadError } = await supabase
      .storage
      .from('projects')
      .upload(`gallery/${fileName}`, buffer, {
        contentType: galleryImage.type,
        upsert: true
      });
    
    if (uploadError) {
      throw new Error(`Failed to upload gallery image: ${uploadError.message}`);
    }
    
    // Get public URL
    const { data: urlData } = supabase
      .storage
      .from('projects')
      .getPublicUrl(`gallery/${fileName}`);
    
    const galleryImageUrl = urlData.publicUrl;
    
    // Update project document with new gallery image
    await projectsCollection.updateOne(
      { _id: new ObjectId(projectId) },
      { 
        $push: { galleryImages: galleryImageUrl },
        $set: { updatedAt: new Date() }
      }
    );
    
    return NextResponse.json({ 
      success: true, 
      message: 'Gallery image uploaded successfully',
      imageUrl: galleryImageUrl
    });
    
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ 
      error: error instanceof Error ? error.message : 'Failed to upload gallery image' 
    }, { status: 500 });
  } finally {
    // Close MongoDB connection
    await client.close();
  }
}

export async function DELETE(req: NextRequest) {
  try {
    // Get URL parameters
    const { searchParams } = new URL(req.url);
    const projectId = searchParams.get('projectId');
    const imageUrl = searchParams.get('imageUrl');
    
    if (!projectId || !imageUrl) {
      return NextResponse.json({ error: 'Missing required parameters' }, { status: 400 });
    }
    
    // Connect to MongoDB
    await client.connect();
    const db = client.db('architecture-portfolio');
    const projectsCollection = db.collection('projects');
    
    // Update project to remove the image from galleryImages
    await projectsCollection.updateOne(
      { _id: new ObjectId(projectId) },
      { 
        $pull: { galleryImages: imageUrl },
        $set: { updatedAt: new Date() }
      }
    );
    
    // Extract file path from URL
    const urlParts = imageUrl.split('/');
    const filePath = `gallery/${urlParts[urlParts.length - 1]}`;
    
    // Delete file from Supabase storage
    const { error: deleteError } = await supabase
      .storage
      .from('projects')
      .remove([filePath]);
    
    if (deleteError) {
      console.warn('Failed to delete file from storage:', deleteError);
    }
    
    return NextResponse.json({ 
      success: true, 
      message: 'Gallery image deleted successfully' 
    });
    
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ 
      error: error instanceof Error ? error.message : 'Failed to delete gallery image' 
    }, { status: 500 });
  } finally {
    // Close MongoDB connection
    await client.close();
  }
}