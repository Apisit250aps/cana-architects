import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/database';
import { Project } from '@/models/projects';
import { auth } from '@/auth';
import slugify from 'slugify';
import { uploadToStorage } from '@/lib/utils';

export async function POST(req: NextRequest) {
  try {
    // Check authentication
    const session = await auth();
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json(
        { error: 'Unauthorized access. Admin privileges required.' }, 
        { status: 401 }
      );
    }

    // Connect to database
    await connectDB();
    
    // Parse form data
    const formData = await req.formData();
    
    // Extract and validate cover image
    const coverImageFile = formData.get('coverImage') as File | null;
    if (!coverImageFile) {
      return NextResponse.json({ error: 'Cover image is required' }, { status: 400 });
    }
    
    // Extract project details
    const title = formData.get('title') as string;
    const location = formData.get('location') as string;
    const type = formData.get('type') as string;
    const category = formData.get('category') as string;
    const program = formData.get('program') as string;
    const client = formData.get('client') as string;
    const siteArea = formData.get('siteArea') as string;
    const builtArea = formData.get('builtArea') as string;
    const design = formData.get('design') as string;
    const completion = formData.get('completion') as string;
    const description = formData.get('description') as string;
    const tagsJson = formData.get('tags') as string;
    
    // Validate required fields
    if (!title || !location || !description) {
      return NextResponse.json({ 
        error: 'Missing required fields: title, location, and description are required' 
      }, { status: 400 });
    }
    
    // Process tags
    let tags: string[] = [];
    try {
      tags = JSON.parse(tagsJson || '[]');
    } catch (error) {
      console.error('Error parsing tags:', error);
      // Default to empty array if parsing fails
      tags = [];
    }
    
    // Generate slug from title
    const baseSlug = slugify(title, {
      lower: true,
      strict: true,
      replacement: '-'
    });
    
    // Check if slug already exists and append counter if needed
    let slug = baseSlug;
    let counter = 1;
    
    while (await Project.findOne({ slug })) {
      slug = `${baseSlug}-${counter}`;
      counter++;
    }
    
    // Convert cover image File to Buffer and upload
    const coverImageBuffer = Buffer.from(await coverImageFile.arrayBuffer());
    const coverImageName = `projects/${slug}/cover-${Date.now()}-${coverImageFile.name.replace(/\s/g, '-')}`;
    
    // Upload image to storage (e.g. S3, local filesystem, etc.)
    const coverImageUrl = await uploadToStorage(coverImageBuffer, coverImageName, coverImageFile.type);
    
    // Find highest display order to place new project at the top (position 0)
    // Get all projects and shift their display order down
    await Project.updateMany(
      {}, 
      { $inc: { displayOrder: 1 } }
    );
    
    // Create new project with display order 0 (at the top)
    const newProject = new Project({
      title,
      slug,
      location,
      type,
      category,
      program,
      client,
      siteArea,
      builtArea,
      design,
      completion,
      description,
      tags,
      coverImage: coverImageUrl,
      galleryImages: [], // Will be populated later via the gallery endpoint
      displayOrder: 0 // New projects always appear at the top
    });
    
    // Save project to database
    await newProject.save();
    
    // Return success response with project data
    return NextResponse.json({
      message: 'Project created successfully',
      project: newProject
    }, { status: 201 });
    
  } catch (error) {
    console.error('Error creating project:', error);
    return NextResponse.json({ 
      error: error instanceof Error ? error.message : 'Failed to create project' 
    }, { status: 500 });
  }
}

// For handling large uploads
export const config = {
  api: {
    bodyParser: false,
  },
};

type ProjectQuery = { [key: string]: unknown }

export async function GET(req: NextRequest) {
  try {
    // Connect to database
    await connectDB();
    
    // Parse query parameters
    const url = new URL(req.url);
    const category = url.searchParams.get('category');
    const page = parseInt(url.searchParams.get('page') || '1');
    const limit = parseInt(url.searchParams.get('limit') || '10');
    const sortBy = url.searchParams.get('sortBy') || 'displayOrder';
    const sortOrder = url.searchParams.get('sortOrder') || 'asc';
    
    const skip = (page - 1) * limit;
    
    // Build query
    const query: ProjectQuery = {};
    if (category) {
      query.category = category;
    }
    
    // Build sort object
    const sortObj: { [key: string]: 1 | -1 } = {};
    sortObj[sortBy] = sortOrder === 'asc' ? 1 : -1;
    
    // Add secondary sort by displayOrder when sorting by another field
    if (sortBy !== 'displayOrder') {
      sortObj.displayOrder = 1; // Always sort by displayOrder ascending as secondary criteria
    }
    
    // Get total count
    const total = await Project.countDocuments(query);
    
    // Fetch projects with sorting, pagination, and field selection
    const projects = await Project.find(query)
      .sort(sortObj)
      .skip(skip)
      .limit(limit)
      .select('title slug location type category client coverImage displayOrder');
    
    // Return projects with pagination info
    return NextResponse.json({ 
      projects, 
      total, 
      page, 
      totalPages: Math.ceil(total / limit) 
    });
    
  } catch (error) {
    console.error('Error fetching projects:', error);
    return NextResponse.json({ 
      error: error instanceof Error ? error.message : 'Failed to fetch projects' 
    }, { status: 500 });
  }
}