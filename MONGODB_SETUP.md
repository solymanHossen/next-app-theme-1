# Theme Management with MongoDB Backend

This project implements dynamic theme management using MongoDB as the backend storage instead of localStorage.

## Setup Instructions

### 1. MongoDB Setup

Make sure you have MongoDB running locally on `mongodb://localhost:27017/best-theme`

### 2. Install Dependencies

```bash
npm install
```

### 3. Initialize Database

Run the database initialization script to populate MongoDB with default themes:

```bash
npm run init-db
```

This will:
- Create the `best-theme` database
- Insert default themes into the `themes` collection
- Set the default active theme in the `settings` collection

### 4. Start the Development Server

```bash
npm run dev
```

## API Endpoints

### GET /api/themes/active
Fetches the currently active theme and dark mode setting.

### POST /api/themes/active
Updates the currently active theme and dark mode setting.
```json
{
  "theme": "ocean",
  "isDark": true
}
```

### GET /api/themes
Fetches all available themes from the database.

### POST /api/themes
Creates a new theme in the database.

## Database Collections

### themes
Stores all available theme definitions with their color palettes for light and dark modes.

### settings
Stores application settings including the currently active theme.

## Features

- **Dynamic Theme Loading**: Themes are fetched from MongoDB on app start
- **Real-time Theme Switching**: Theme changes are automatically saved to the database
- **No Local Storage**: All theme data is stored and retrieved from MongoDB
- **Dark/Light Mode Toggle**: Each theme supports both light and dark modes
- **Backend Persistence**: Theme preferences persist across sessions and devices

## Environment Variables

You can customize the MongoDB connection by setting the `MONGODB_URI` environment variable:

```bash
MONGODB_URI=mongodb://localhost:27017/best-theme
```

## Theme Structure

Themes are stored in MongoDB with the following structure:

```json
{
  "_id": "ObjectId",
  "name": "ocean",
  "label": "Ocean Blue",
  "colors": {
    "light": {
      "background": "oklch(0.98 0.01 220)",
      "foreground": "oklch(0.15 0.05 220)",
      // ... more color definitions
    },
    "dark": {
      "background": "oklch(0.08 0.03 220)",
      "foreground": "oklch(0.95 0.02 220)",
      // ... more color definitions
    }
  },
  "createdAt": "Date",
  "updatedAt": "Date"
}
```
