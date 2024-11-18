// app/api/profile/route.ts
import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import clientPromise from '@/lib/mongodb'
import { ObjectId } from 'mongodb'
import { hash } from 'bcryptjs'

// GET handler to fetch profile
export async function GET(req) {
  try {
    const session = await getServerSession()
    if (!session?.user?.email) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    const client = await clientPromise
    const users = client.db('your-db-name').collection('users')
    
    const user = await users.findOne({ email: session.user.email })
    if (!user) {
      return new NextResponse('User not found', { status: 404 })
    }

    // Remove sensitive data before sending
    const { password, ...userWithoutPassword } = user
    return NextResponse.json(userWithoutPassword)
  } catch (error) {
    return new NextResponse('Internal error', { status: 500 })
  }
}

// PATCH handler to update profile
export async function PATCH(req) {
  try {
    const session = await getServerSession()
    if (!session?.user?.email) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    const { name, email, currentPassword, newPassword } = await req.json()
    
    const client = await clientPromise
    const users = client.db('your-db-name').collection('users')
    
    const user = await users.findOne({ email: session.user.email })
    if (!user) {
      return new NextResponse('User not found', { status: 404 })
    }

    // Prepare update object
    const updateData = {}
    if (name) updateData.name = name
    if (email && email !== user.email) {
      // Check if new email is already taken
      const existingUser = await users.findOne({ email })
      if (existingUser) {
        return new NextResponse('Email already in use', { status: 409 })
      }
      updateData.email = email
    }

    // If password change is requested
    if (currentPassword && newPassword) {
      const isValid = await compare(currentPassword, user.password)
      if (!isValid) {
        return new NextResponse('Invalid current password', { status: 400 })
      }
      updateData.password = await hash(newPassword, 12)
    }

    if (Object.keys(updateData).length === 0) {
      return new NextResponse('No changes to update', { status: 400 })
    }

    // Update user
    await users.updateOne(
      { email: session.user.email },
      { $set: { ...updateData, updatedAt: new Date() } }
    )

    // Return updated user without password
    const updatedUser = await users.findOne({ email: updateData.email || session.user.email })
    const { password, ...userWithoutPassword } = updatedUser

    return NextResponse.json(userWithoutPassword)
  } catch (error) {
    return new NextResponse('Internal error', { status: 500 })
  }
}