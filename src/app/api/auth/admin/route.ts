import { connectDB } from '@/lib/database'
import { User } from '@/models/users'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    await connectDB()
    const { name, password } = await req.json()
    // Validate input data
    if (!name || !password) {
      return NextResponse.json(
        { error: 'Missing required fields: name and password are required' },
        { status: 400 }
      )
    }
    const unique = await User.findOne({ name })
    if (unique) {
      return NextResponse.json(
        { error: 'User with that name already exists' },
        { status: 400 }
      )
    }
    // Create new user
    const user = new User({ name, password, role: 'admin' })
    await user.save()
    return NextResponse.json(
      { message: 'User created successfully' },
      { status: 201 }
    )
  } catch (error) {
    console.error('Error creating project:', error)
    return NextResponse.json(
      { error: 'Error creating project' },
      { status: 500 }
    )
  }
}
