# REST API Theme Management System

A Next.js frontend application with complete REST API integration for theme management, featuring authentication, role-based access control, and offline/online mode switching.

## 🚀 Features

### Core Functionality
- **REST API Integration**: Full integration with theme management API endpoints
- **Authentication & Authorization**: JWT-based auth with role-based access control
- **Online/Offline Mode**: Graceful fallback to local themes when API is unavailable
- **Real-time Updates**: Optimistic updates with automatic sync and error handling
- **Theme Management**: Complete CRUD operations for themes (admin only)
- **Persistent Storage**: Local storage backup with automatic theme restoration

### Technical Features
- **Next.js 15.4.6** with Turbopack for fast development
- **TypeScript** for type safety
- **TanStack Query** for data fetching and caching
- **Zustand** for local state management
- **Axios** for HTTP requests with interceptors
- **Sonner** for toast notifications
- **Tailwind CSS** with custom theme system
- **Radix UI** components

## 🛠️ Installation & Setup

1. **Clone and install dependencies:**
   ```bash
   npm install
   ```

2. **Set up environment variables:**
   ```bash
   cp .env.example .env.local
   ```
   Edit `.env.local` with your API configuration:
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:8000
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   ```

## 🔌 API Integration

### Endpoints Used

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/v1/themes/` | Get all themes | No |
| GET | `/api/v1/themes/active` | Get active theme | No |
| GET | `/api/v1/themes/:name` | Get theme by name | No |
| POST | `/api/v1/themes/` | Create new theme | Admin |
| PUT | `/api/v1/themes/:name` | Update theme | Admin |
| DELETE | `/api/v1/themes/:name` | Delete theme | Admin |
| POST | `/api/v1/themes/active` | Set active theme | User |
| POST | `/api/auth/login` | User login | No |
| POST | `/api/auth/refresh` | Refresh token | No |

### Authentication Flow

1. **Login**: POST to `/api/auth/login` with email/password
2. **Token Storage**: JWT stored in secure HTTP-only cookies
3. **Auto-refresh**: Automatic token refresh on 401 responses
4. **Logout**: Token cleanup and redirect to login

### Error Handling

- **Network Errors**: Automatic fallback to offline mode
- **Authentication Errors**: Auto-refresh attempts then logout
- **API Errors**: User-friendly error messages with toast notifications
- **Validation Errors**: Form-level error display

## 🎨 Theme System

### Theme Structure
```typescript
interface Theme {
  name: string;           // Unique identifier
  label: string;          // Display name
  colors: {
    light: Record<string, string>;  // Light mode colors
    dark: Record<string, string>;   // Dark mode colors
  };
  createdAt?: string;     // API timestamp
  updatedAt?: string;     // API timestamp
  isDefault?: boolean;    // Default theme flag
}
```

### Theme Management

#### For Users:
- Switch between available themes
- Toggle dark/light mode
- Themes sync automatically with API when online

#### For Admins:
- Create new custom themes
- Delete non-default themes
- All changes sync with API immediately

### Offline Mode

When the API is unavailable:
- Automatic fallback to local themes
- Local theme switching continues to work
- Visual indicator shows offline status
- Manual toggle between online/offline modes

## 🔐 Authentication & Authorization

### User Roles

1. **Guest**: Can view themes, limited functionality
2. **User**: Can change themes and sync preferences
3. **Admin**: Full theme management capabilities

### Protected Features

- **User Level**: Theme preference syncing
- **Admin Level**: Theme creation, editing, deletion

### Security Features

- JWT token-based authentication
- Automatic token refresh
- Secure cookie storage
- Role-based access control
- CSRF protection ready

## 🏗️ Architecture

### State Management
- **Zustand**: Local theme state with persistence
- **TanStack Query**: Server state with caching and sync
- **Combined Approach**: Optimistic updates with server sync

### API Client
- **Axios Instance**: Configured with interceptors
- **Auto-authentication**: Tokens attached automatically
- **Error Handling**: Centralized error management
- **Type Safety**: Full TypeScript integration

### Component Structure
```
src/
├── app/                    # Next.js app router
├── components/            
│   ├── auth-provider.tsx   # Authentication context
│   ├── theme-provider.tsx  # Theme initialization
│   └── theme-switcher.tsx  # Enhanced theme UI
├── hooks/
│   ├── use-theme-api.tsx   # API data fetching
│   └── use-enhanced-theme.tsx # Combined theme logic
├── lib/
│   └── theme-api-client.ts # API client with auth
└── providers/
    └── react-query-provider.tsx # Query client setup
```

## 🚀 Usage Examples

### Basic Theme Switching
```typescript
import { useTheme } from '@/hooks/use-enhanced-theme'

function MyComponent() {
  const { theme, setTheme, toggleDarkMode, isLoading } = useTheme()
  
  return (
    <div>
      <button onClick={() => setTheme('ocean')}>Ocean Theme</button>
      <button onClick={toggleDarkMode}>Toggle Dark Mode</button>
    </div>
  )
}
```

### Admin Operations
```typescript
import { useCreateTheme, useDeleteTheme } from '@/hooks/use-theme-api'

function AdminPanel() {
  const createTheme = useCreateTheme()
  const deleteTheme = useDeleteTheme()
  
  const handleCreate = () => {
    createTheme.mutate({
      name: 'custom',
      label: 'Custom Theme',
      colors: { /* theme colors */ }
    })
  }
  
  return <button onClick={handleCreate}>Create Theme</button>
}
```

### Protected Routes
```typescript
import { ProtectedRoute } from '@/components/auth-provider'

function AdminFeature() {
  return (
    <ProtectedRoute adminOnly>
      <AdminPanel />
    </ProtectedRoute>
  )
}
```

## 🧪 Development

### Available Scripts
- `npm run dev` - Start development server with Turbopack
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

### Environment Variables
```env
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_AUTH_COOKIE_DOMAIN=localhost
NEXT_PUBLIC_AUTH_SECURE_COOKIES=false
```

## 📝 API Backend Requirements

Your REST API should implement:

1. **Authentication endpoints** with JWT tokens
2. **Theme CRUD operations** with proper permissions
3. **User role management** (user/admin)
4. **CORS configuration** for frontend domain
5. **Error responses** in consistent format

Example API response format:
```json
{
  "data": { /* response data */ },
  "message": "Success message",
  "status": "success"
}
```

## 🤝 Contributing

1. Follow TypeScript best practices
2. Use proper error handling
3. Include proper typing for all API responses
4. Test both online and offline modes
5. Ensure responsive design

## 📄 License

This project is part of a theme management system demonstration.
# next-app-theme-1
