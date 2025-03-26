import { NextRequest, NextResponse } from 'next/server'

import slugify from 'slugify'

import { Project } from '@/models/projects'
import { connectDB } from '@/lib/database'
import { deleteFromStorage, uploadToStorage } from '@/lib/utils'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Connect to the database
    await connectDB()

    // Get project ID from params
    const { id } = await params
    const projectId = id

    if (!projectId) {
      return NextResponse.json(
        { error: 'Project ID is required' },
        { status: 400 }
      )
    }

    // Find project by ID
    const project = await Project.findById(projectId)

    // Check if project exists
    if (!project) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 })
    }

    // Return project data
    return NextResponse.json({
      success: true,
      project
    })
  } catch (error) {
    console.error('Error fetching project:', error)
    return NextResponse.json(
      { error: 'Failed to fetch project' },
      { status: 500 }
    )
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Connect to database
    await connectDB()

    // Get project ID from params
    const { id } = await params
    const projectId = id

    if (!projectId) {
      return NextResponse.json(
        { error: 'Project ID is required' },
        { status: 400 }
      )
    }

    // Find existing project
    const existingProject = await Project.findById(projectId)

    if (!existingProject) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 })
    }

    // Parse form data
    const formData = await req.formData()

    // Extract project details
    const title = formData.get('title') as string
    const location = formData.get('location') as string
    const type = formData.get('type') as string
    const category = formData.get('category') as string
    const program = formData.get('program') as string
    const client = formData.get('client') as string
    const siteArea = formData.get('siteArea') as string
    const builtArea = formData.get('builtArea') as string
    const design = formData.get('design') as string
    const completion = formData.get('completion') as string
    const description = formData.get('description') as string
    const tagsJson = formData.get('tags') as string
    const removedImagesJson = formData.get('removedImages') as string

    // Validate required fields
    if (!title || !location || !description) {
      return NextResponse.json(
        {
          error:
            'Missing required fields: title, location, and description are required'
        },
        { status: 400 }
      )
    }

    // Process tags
    let tags: string[] = []
    try {
      tags = JSON.parse(tagsJson || '[]')
    } catch (error) {
      console.error('Error parsing tags:', error)
      // Default to existing tags if parsing fails
      tags = existingProject.tags
    }

    // Process removed images
    let removedImages: string[] = []
    try {
      removedImages = JSON.parse(removedImagesJson || '[]')
    } catch (error) {
      console.error('Error parsing removed images:', error)
      removedImages = []
    }

    // Update slug only if title has changed
    let slug = existingProject.slug

    if (title !== existingProject.title) {
      const baseSlug = slugify(title, {
        lower: true,
        strict: true,
        replacement: '-'
      })

      // Check if new slug already exists and append counter if needed
      slug = baseSlug
      let counter = 1

      while (await Project.findOne({ slug, _id: { $ne: projectId } })) {
        slug = `${baseSlug}-${counter}`
        counter++
      }
    }

    // Handle cover image update
    const coverImageFile = formData.get('coverImage') as File | null
    let coverImageUrl = existingProject.coverImage

    if (coverImageFile) {
      // Delete old cover image if it exists
      if (existingProject.coverImage) {
        try {
          // Extract filename from URL
          const oldFilename = existingProject.coverImage.split('/').pop()
          if (oldFilename) {
            await deleteFromStorage(
              `projects/${existingProject.slug}/${oldFilename}`
            )
          }
        } catch (error) {
          console.error('Error deleting old cover image:', error)
          // Continue execution even if deletion fails
        }
      }

      // Upload new cover image
      const coverImageBuffer = Buffer.from(await coverImageFile.arrayBuffer())
      const coverImageName = `projects/${slug}/cover-${Date.now()}-${coverImageFile.name.replace(
        /\s/g,
        '-'
      )}`
      coverImageUrl = await uploadToStorage(
        coverImageBuffer,
        coverImageName,
        coverImageFile.type
      )
    }

    // Delete removed gallery images
    if (removedImages.length > 0) {
      try {
        for (const imageUrl of removedImages) {
          const filename = imageUrl.split('/').pop()
          if (filename) {
            await deleteFromStorage(
              `projects/${existingProject.slug}/${filename}`
            )
          }
        }

        // Remove the URLs from the galleryImages array
        existingProject.galleryImages = existingProject.galleryImages.filter(
          (url: string) => !removedImages.includes(url)
        )
      } catch (error) {
        console.error('Error deleting removed images:', error)
      }
    }

    // Update project data
    existingProject.title = title
    existingProject.slug = slug
    existingProject.location = location
    existingProject.type = type
    existingProject.category = category
    existingProject.program = program
    existingProject.client = client
    existingProject.siteArea = siteArea
    existingProject.builtArea = builtArea
    existingProject.design = design
    existingProject.completion = completion
    existingProject.description = description
    existingProject.tags = tags
    existingProject.coverImage = coverImageUrl

    // Save updated project
    await existingProject.save()

    // Return success response with updated project data
    return NextResponse.json({
      message: 'Project updated successfully',
      project: existingProject
    })
  } catch (error) {
    console.error('Error updating project:', error)
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : 'Failed to update project'
      },
      { status: 500 }
    )
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Connect to database
    await connectDB()

    // Get project ID from params
    const { id } = await params
    const projectId = id

    if (!projectId) {
      return NextResponse.json(
        { error: 'Project ID is required' },
        { status: 400 }
      )
    }

    // Find existing project
    const existingProject = await Project.findById(projectId)

    if (!existingProject) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 })
    }

    // Delete cover image
    if (existingProject.coverImage) {
      try {
        // Extract filename from URL
        const filename = existingProject.coverImage.split('/').pop()
        if (filename) {
          await deleteFromStorage(
            `projects/${existingProject.slug}/${filename}`
          )
        }
      } catch (error) {
        console.error('Error deleting cover image:', error)
      }
    }

    // Delete gallery images
    if (existingProject.galleryImages.length > 0) {
      try {
        for (const imageUrl of existingProject.galleryImages) {
          const filename = imageUrl.split('/').pop()
          if (filename) {
            await deleteFromStorage(
              `projects/${existingProject.slug}/${filename}`
            )
          }
        }
      } catch (error) {
        console.error('Error deleting gallery images:', error)
      }
    }

    // Delete project from database
    await Project.deleteOne({ _id: projectId })

    // Return success response
    return NextResponse.json({ message: 'Project deleted successfully' })
  } catch (error) {
    console.error('Error deleting project:', error)
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : 'Failed to delete project'
      },
      { status: 500 }
    )
  }
}
