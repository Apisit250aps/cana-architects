import { NextRequest, NextResponse } from 'next/server'
import { MongoClient } from 'mongodb'
import { createClient } from '@supabase/supabase-js'
import slugify from 'slugify'

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
    
    // Extract project details
    const title = formData.get('title') as string;
    const location = formData.get('location') as string;
    const type = formData.get('type') as string;
    const category = formData.get('category') as string;
    const program = formData.get('program') as string;
    const client_ = formData.get('client') as string;
    const siteArea = formData.get('siteArea') as string;
    const builtArea = formData.get('builtArea') as string;
    const design = formData.get('design') as string;
    const completion = formData.get('completion') as string;
    const description = formData.get('description') as string;
    const tags = JSON.parse(formData.get('tags') as string || '[]');
    
    // Get cover image
    const coverImage = formData.get('coverImage') as File;
    
    if (!title || !location || !description || !coverImage) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }
    
    // Connect to MongoDB
    await client.connect();
    const db = client.db('architecture-portfolio');
    const projectsCollection = db.collection('projects');
    
    // Create slug from title
    let slug = slugify(title, { lower: true, strict: true });
    
    // Check if slug already exists and modify if needed
    const existingProject = await projectsCollection.findOne({ slug });
    if (existingProject) {
      slug = `${slug}-${Date.now()}`;
    }
    
    // Upload cover image to Supabase
    let coverImageUrl = '';
    
    if (coverImage) {
      const fileExt = coverImage.name.split('.').pop();
      const fileName = `${slug}-cover.${fileExt}`;
      
      // Convert File to ArrayBuffer
      const arrayBuffer = await coverImage.arrayBuffer();
      const buffer = new Uint8Array(arrayBuffer);
      
      // Upload to Supabase Storage
      const { data: uploadData, error: uploadError } = await supabase
        .storage
        .from('canaarchitecture')
        .upload(`projects/${fileName}`, buffer, {
          contentType: coverImage.type,
          upsert: true
        });
      
      if (uploadError) {
        throw new Error(`Failed to upload cover image: ${uploadError.message}`);
      }
      
      // Get public URL
      const { data: urlData } = supabase
        .storage
        .from('canaarchitecture')
        .getPublicUrl(`projects/${fileName}`);
      
      coverImageUrl = urlData.publicUrl;
    }
    
    // Create project document
    const projectDocument = {
      title,
      slug,
      location,
      type,
      category,
      program,
      client: client_,
      siteArea,
      builtArea,
      design,
      completion,
      description,
      tags,
      coverImage: coverImageUrl,
      galleryImages: [],
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    // Insert project to MongoDB
    const result = await projectsCollection.insertOne(projectDocument);
    
    // Get the inserted document with _id
    const insertedProject = await projectsCollection.findOne({ _id: result.insertedId });
    
    return NextResponse.json({ 
      success: true, 
      message: 'Project created successfully',
      project: insertedProject
    }, { status: 201 });
    
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ 
      error: error instanceof Error ? error.message : 'Failed to create project' 
    }, { status: 500 });
  } finally {
    // Close MongoDB connection
    await client.close();
  }
}

export async function GET(req: NextRequest) {
  try {
    // Connect to MongoDB
    await client.connect();
    const db = client.db('architecture-portfolio');
    const projectsCollection = db.collection('projects');
    
    // Get URL parameters
    const { searchParams } = new URL(req.url);
    const category = searchParams.get('category');
    const limit = parseInt(searchParams.get('limit') || '10');
    const page = parseInt(searchParams.get('page') || '1');
    const skip = (page - 1) * limit;
    
    // Build query
    const query: Record<string, any> = {};
    if (category) {
      query.category = category;
    }
    
    // Find projects
    const projects = await projectsCollection
      .find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .toArray();
    
    // Count total projects
    const totalProjects = await projectsCollection.countDocuments(query);
    
    return NextResponse.json({
      success: true,
      data: {
        projects,
        pagination: {
          total: totalProjects,
          page,
          limit,
          pages: Math.ceil(totalProjects / limit)
        }
      }
    });
    
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ 
      error: error instanceof Error ? error.message : 'Failed to fetch projects' 
    }, { status: 500 });
  } finally {
    // Close MongoDB connection
    await client.close();
  }
}