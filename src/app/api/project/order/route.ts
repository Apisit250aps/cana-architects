// app/api/project/order/route.ts
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
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Connect to the database
    await connectDB()

    // Parse the request body
    const body = await request.json()
    const { projects } = body
    console.log(projects)
    if (!projects || !Array.isArray(projects)) {
      return NextResponse.json(
        { error: 'Invalid request format' },
        { status: 400 }
      )
    }

    // Update the display order for each project
    const updatePromises = (projects as OrderUpdateItem[]).map((item, index) =>
      Project.updateOne(
        { _id: new mongoose.Types.ObjectId(item.id)},
        { $set: { displayOrder: index} }
      )
    )

    await Promise.all(updatePromises)
    console.log('successfully updated')

    return NextResponse.json(
      { success: true, message: 'Project order updated successfully' },
      { status: 200 }
    )
  } catch (error) {
    console.error('Error updating project order:', error)
    return NextResponse.json(
      { error: 'Failed to update project order' },
      { status: 500 }
    )
  }
}
