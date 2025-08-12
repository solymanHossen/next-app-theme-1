import { NextRequest, NextResponse } from 'next/server'
import { getDatabase } from '@/lib/mongodb'

export async function GET() {
  try {
    const db = await getDatabase()
    const themes = await db.collection('themes').find({}).toArray()
    
    return NextResponse.json({ themes })
  } catch (error) {
    console.error('Error fetching themes:', error)
    return NextResponse.json(
      { error: 'Failed to fetch themes' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const { theme } = await request.json()
    
    if (!theme) {
      return NextResponse.json(
        { error: 'Theme data is required' },
        { status: 400 }
      )
    }

    const db = await getDatabase()
    const result = await db.collection('themes').insertOne({
      ...theme,
      createdAt: new Date(),
      updatedAt: new Date()
    })

    return NextResponse.json({ 
      message: 'Theme created successfully',
      themeId: result.insertedId 
    })
  } catch (error) {
    console.error('Error creating theme:', error)
    return NextResponse.json(
      { error: 'Failed to create theme' },
      { status: 500 }
    )
  }
}
