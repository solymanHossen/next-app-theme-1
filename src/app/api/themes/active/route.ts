import { NextRequest, NextResponse } from 'next/server'
import { getDatabase } from '@/lib/mongodb'

export async function GET() {
  try {
    const db = await getDatabase()
    
    // Get the current active theme
    let activeTheme = await db.collection('settings').findOne({ type: 'activeTheme' })
    
    let response = {
      theme: 'default',
      isDark: false
    }
    
    if (activeTheme) {
      response = {
        theme: activeTheme.theme || 'default',
        isDark: activeTheme.isDark || false
      }
    }

    return NextResponse.json(response)
  } catch (error) {
    console.error('Error fetching active theme:', error)
    return NextResponse.json(
      { error: 'Failed to fetch active theme' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const { theme, isDark } = await request.json()
    
    if (!theme) {
      return NextResponse.json(
        { error: 'Theme name is required' },
        { status: 400 }
      )
    }

    const db = await getDatabase()
    
    // Update or create the active theme setting
    await db.collection('settings').updateOne(
      { type: 'activeTheme' },
      { 
        $set: { 
          theme, 
          isDark: isDark || false,
          updatedAt: new Date()
        }
      },
      { upsert: true }
    )

    return NextResponse.json({ 
      message: 'Active theme updated successfully',
      theme,
      isDark 
    })
  } catch (error) {
    console.error('Error updating active theme:', error)
    return NextResponse.json(
      { error: 'Failed to update active theme' },
      { status: 500 }
    )
  }
}
