import { NextResponse } from 'next/server'
import mongoose from 'mongoose'
import { Project } from '@/models/projects'
import { auth } from '@/auth'
import { connectDB } from '@/lib/database'

interface OrderUpdateItem {
  id: string
  displayOrder: number
}

export async function PUT(request: Request) {
  try {
    // Check authentication
    const session = await auth()
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json(
        { error: 'Unauthorized access. Admin privileges required.' }, 
        { status: 401 }
      )
    }

    // Connect to the database
    await connectDB()

    // Parse and validate the request body
    const body = await request.json()
    const { projects } = body
    
    if (!projects || !Array.isArray(projects) || projects.length === 0) {
      return NextResponse.json(
        { error: 'Invalid request format. Expected non-empty array of projects.' },
        { status: 400 }
      )
    }

    // Validate each project item
    const invalidItems = projects.filter(
      (item: OrderUpdateItem) => !item.id || typeof item.id !== 'string' || !mongoose.Types.ObjectId.isValid(item.id)
    )
    
    if (invalidItems.length > 0) {
      return NextResponse.json(
        { error: 'Invalid project IDs found in request.' },
        { status: 400 }
      )
    }

    // Optimize for bulk updates - collect all IDs first to verify they exist
    const projectIds = projects.map((item: OrderUpdateItem) => 
      new mongoose.Types.ObjectId(item.id)
    )
    
    const existingProjects = await Project.find({
      _id: { $in: projectIds }
    }).select('_id').lean()
    
    if (existingProjects.length !== projectIds.length) {
      return NextResponse.json(
        { error: 'Some project IDs do not exist in the database.' },
        { status: 404 }
      )
    }

    // Use bulkWrite for more efficient updates
    const bulkOperations = projects.map((item: OrderUpdateItem) => ({
      updateOne: {
        filter: { _id: new mongoose.Types.ObjectId(item.id) },
        update: { $set: { displayOrder: item.displayOrder } }
      }
    }))

    const result = await Project.bulkWrite(bulkOperations)

    // Log results for debugging
    console.log(`Project order update: ${result.modifiedCount} projects updated successfully`)

    return NextResponse.json({
      success: true,
      message: 'Project order updated successfully',
      modifiedCount: result.modifiedCount
    }, { status: 200 })
    
  } catch (error) {
    console.error('Error updating project order:', error)
    
    // Provide appropriate error message based on error type
    const errorMessage = error instanceof Error 
      ? `Failed to update project order: ${error.message}`
      : 'Failed to update project order due to an unknown error'
      
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    )
  }
}