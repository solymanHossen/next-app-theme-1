#!/usr/bin/env node

const { MongoClient } = require('mongodb')

const uri = 'mongodb://localhost:27017/best-theme'
const themes = [
  {
    name: "default",
    label: "Default",
    colors: {
      light: {
        background: "oklch(1 0 0)",
        foreground: "oklch(0.145 0 0)",
        primary: "oklch(0.205 0 0)",
        "primary-foreground": "oklch(0.985 0 0)",
        secondary: "oklch(0.97 0 0)",
        "secondary-foreground": "oklch(0.205 0 0)",
        accent: "oklch(0.97 0 0)",
        "accent-foreground": "oklch(0.205 0 0)",
        muted: "oklch(0.97 0 0)",
        "muted-foreground": "oklch(0.556 0 0)",
        card: "oklch(1 0 0)",
        "card-foreground": "oklch(0.145 0 0)",
        border: "oklch(0.922 0 0)",
        input: "oklch(0.922 0 0)",
        ring: "oklch(0.708 0 0)",
      },
      dark: {
        background: "oklch(0.145 0 0)",
        foreground: "oklch(0.985 0 0)",
        primary: "oklch(0.985 0 0)",
        "primary-foreground": "oklch(0.205 0 0)",
        secondary: "oklch(0.269 0 0)",
        "secondary-foreground": "oklch(0.985 0 0)",
        accent: "oklch(0.269 0 0)",
        "accent-foreground": "oklch(0.985 0 0)",
        muted: "oklch(0.269 0 0)",
        "muted-foreground": "oklch(0.708 0 0)",
        card: "oklch(0.145 0 0)",
        "card-foreground": "oklch(0.985 0 0)",
        border: "oklch(0.269 0 0)",
        input: "oklch(0.269 0 0)",
        ring: "oklch(0.439 0 0)",
      },
    },
  },
  {
    name: "ocean",
    label: "Ocean Blue",
    colors: {
      light: {
        background: "oklch(0.98 0.01 220)",
        foreground: "oklch(0.15 0.05 220)",
        primary: "oklch(0.55 0.25 220)",
        "primary-foreground": "oklch(0.98 0.01 220)",
        secondary: "oklch(0.94 0.03 220)",
        "secondary-foreground": "oklch(0.15 0.05 220)",
        accent: "oklch(0.88 0.08 200)",
        "accent-foreground": "oklch(0.15 0.05 220)",
        muted: "oklch(0.94 0.03 220)",
        "muted-foreground": "oklch(0.45 0.08 220)",
        card: "oklch(0.99 0.005 220)",
        "card-foreground": "oklch(0.15 0.05 220)",
        border: "oklch(0.88 0.05 220)",
        input: "oklch(0.88 0.05 220)",
        ring: "oklch(0.55 0.25 220)",
      },
      dark: {
        background: "oklch(0.08 0.03 220)",
        foreground: "oklch(0.95 0.02 220)",
        primary: "oklch(0.65 0.25 220)",
        "primary-foreground": "oklch(0.08 0.03 220)",
        secondary: "oklch(0.15 0.05 220)",
        "secondary-foreground": "oklch(0.95 0.02 220)",
        accent: "oklch(0.25 0.08 200)",
        "accent-foreground": "oklch(0.95 0.02 220)",
        muted: "oklch(0.15 0.05 220)",
        "muted-foreground": "oklch(0.65 0.08 220)",
        card: "oklch(0.12 0.04 220)",
        "card-foreground": "oklch(0.95 0.02 220)",
        border: "oklch(0.25 0.08 220)",
        input: "oklch(0.25 0.08 220)",
        ring: "oklch(0.65 0.25 220)",
      },
    },
  }
]

async function initDb() {
  const client = new MongoClient(uri)
  
  try {
    await client.connect()
    console.log('Connected to MongoDB')
    
    const db = client.db('best-theme')
    
    // Insert themes
    const existingThemes = await db.collection('themes').countDocuments()
    if (existingThemes === 0) {
      await db.collection('themes').insertMany(themes.map(theme => ({
        ...theme,
        createdAt: new Date(),
        updatedAt: new Date()
      })))
      console.log('Themes inserted successfully')
    } else {
      console.log('Themes already exist')
    }
    
    // Set default active theme
    const activeTheme = await db.collection('settings').findOne({ type: 'activeTheme' })
    if (!activeTheme) {
      await db.collection('settings').insertOne({
        type: 'activeTheme',
        theme: 'default',
        isDark: false,
        createdAt: new Date(),
        updatedAt: new Date()
      })
      console.log('Default active theme set successfully')
    } else {
      console.log('Active theme already exists')
    }
    
  } catch (error) {
    console.error('Error:', error)
  } finally {
    await client.close()
  }
}

initDb()
