import { hash } from 'bcryptjs'
import { NextResponse } from 'next/server'
import clientPromise from '@/lib/mongodb'

export async function POST(req) {
  try {
    const { email, password, name } = await req.json()
    
    if (!email || !password || !name) {
      return new NextResponse('Missing required fields', { status: 400 })
    }

    const client = await clientPromise
    const users = client.db('your-db-name').collection('users')
    
    const existingUser = await users.findOne({ email })
    if (existingUser) {
      return new NextResponse('User already exists', { status: 409 })
    }

    const hashedPassword = await hash(password, 12)
    
    const result = await users.insertOne({
      email,
      password: hashedPassword,
      name,
      createdAt: new Date()
    })

    return NextResponse.json({
      user: {
        id: result.insertedId,
        email,
        name
      }
    })
  } catch (error) {
    return new NextResponse('Internal error', { status: 500 })
  }
}
