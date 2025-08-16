import axios, { AxiosInstance, AxiosError } from 'axios';
import Cookies from 'js-cookie';

// Enhanced theme types for REST API
export interface Theme {
  name: string;
  label: string;
  colors: {
    light: Record<string, string>;
    dark: Record<string, string>;
  };
  createdAt?: string;
  updatedAt?: string;
  isDefault?: boolean;
}

export interface ActiveTheme {
  theme: string;
  isDark: boolean;
  userId?: string;
}

export interface User {
  id?: string;
  email: string;
  role: 'admin' | 'user';
  name: string;
  isVerified?: boolean;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

// API Response wrapper
export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export interface LoginResponseData {
  user: User;
  token: string;
  refreshToken: string;
}

export interface LoginResponse {
  user: User;
  token: string;
  refreshToken: string;
}

// API Error types
export interface ApiError {
  message: string;
  code: string;
  status: number;
}

export class ThemeApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public code: string
  ) {
    super(message);
    this.name = 'ThemeApiError';
  }
}

// Enhanced API client with authentication and error handling
export class ThemeApiClient {
  private axios: AxiosInstance;
  private baseURL: string;

  constructor(baseURL: string = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:2718') {
    this.baseURL = baseURL;
    
    // Clean up any invalid cookies from previous sessions
    this.cleanInvalidCookies();
    
    this.axios = axios.create({
      baseURL: this.baseURL,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Request interceptor for authentication
    this.axios.interceptors.request.use(
      (config) => {
        const token = this.getToken();
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response interceptor for error handling
    this.axios.interceptors.response.use(
      (response) => response,
      async (error: AxiosError) => {
        if (error.response?.status === 401) {
          // Try to refresh token
          const refreshed = await this.refreshToken();
          if (refreshed && error.config) {
            // Retry the original request
            return this.axios.request(error.config);
          } else {
            // Redirect to login
            this.logout();
          }
        }
        return Promise.reject(this.handleError(error));
      }
    );
  }

  // Error handling
  private handleError(error: AxiosError): ThemeApiError {
    if (error.response) {
      const { status, data } = error.response;
      const message = (data as any)?.message || 'An error occurred';
      const code = (data as any)?.code || 'UNKNOWN_ERROR';
      return new ThemeApiError(message, status, code);
    } else if (error.request) {
      return new ThemeApiError('Network error', 0, 'NETWORK_ERROR');
    } else {
      return new ThemeApiError(error.message, 0, 'REQUEST_ERROR');
    }
  }

  // Authentication methods
  private getToken(): string | null {
    const token = Cookies.get('auth_token');
    return (token && token !== 'undefined' && token !== 'null') ? token : null;
  }

  private setToken(token: string): void {
    Cookies.set('auth_token', token, { 
      expires: 7, // 7 days
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict'
    });
  }

  private getRefreshToken(): string | null {
    const token = Cookies.get('refresh_token');
    return (token && token !== 'undefined' && token !== 'null') ? token : null;
  }

  private setRefreshToken(token: string): void {
    Cookies.set('refresh_token', token, { 
      expires: 30, // 30 days
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict'
    });
  }

  private removeTokens(): void {
    Cookies.remove('auth_token');
    Cookies.remove('refresh_token');
    Cookies.remove('user_data');
  }

  // Clean up invalid cookies (utility method)
  private cleanInvalidCookies(): void {
    const token = Cookies.get('auth_token');
    const refreshToken = Cookies.get('refresh_token');
    const userData = Cookies.get('user_data');

    if (token === 'undefined' || token === 'null') {
      Cookies.remove('auth_token');
    }
    if (refreshToken === 'undefined' || refreshToken === 'null') {
      Cookies.remove('refresh_token');
    }
    if (userData === 'undefined' || userData === 'null') {
      Cookies.remove('user_data');
    }
  }

  async login(credentials: LoginCredentials): Promise<LoginResponse> {
    try {
      // Try real API first
      const response = await this.axios.post<ApiResponse<LoginResponseData>>('/api/v1/auth/login', credentials);
      
      if (!response.data.success) {
        throw new ThemeApiError(response.data.message || 'Login failed', 400, 'LOGIN_FAILED');
      }
      
      const { user, token, refreshToken } = response.data.data;
      
      // Validate tokens before setting
      if (token && token !== 'undefined') {
        this.setToken(token);
      }
      if (refreshToken && refreshToken !== 'undefined') {
        this.setRefreshToken(refreshToken);
      }
      if (user && typeof user === 'object') {
        Cookies.set('user_data', JSON.stringify(user), { 
          expires: 7,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'strict'
        });
      }
      
      return { user, token, refreshToken };
      
    } catch (apiError: any) {
      // If real API fails, check if it's a network error or actual API error
      if (apiError.response) {
        // API responded with an error
        const errorMessage = apiError.response.data?.message || 'Login failed';
        throw new ThemeApiError(errorMessage, apiError.response.status, 'API_ERROR');
      }
      
      // Network error - try demo credentials as fallback
      const { email, password } = credentials;
      
      // Demo users for development/testing
      const demoUsers = [
        { id: '1', email: 'admin@demo.com', password: 'admin123', name: 'Admin User', role: 'admin' as const },
        { id: '2', email: 'user@demo.com', password: 'user123', name: 'Regular User', role: 'user' as const },
        { id: '3', email: 'solyman100200@gmail.com', password: 'solyman', name: 'Solyman Hossen', role: 'admin' as const },
      ];
      
      const demoUser = demoUsers.find(u => u.email === email && u.password === password);
      
      if (demoUser) {
        // Create mock response for demo user
        const mockResponse: LoginResponse = {
          user: { id: demoUser.id, email: demoUser.email, name: demoUser.name, role: demoUser.role, isVerified: true },
          token: `demo-jwt-token-${demoUser.id}-${Date.now()}`,
          refreshToken: `demo-refresh-token-${demoUser.id}-${Date.now()}`
        };
        
        // Store demo credentials
        this.setToken(mockResponse.token);
        this.setRefreshToken(mockResponse.refreshToken);
        Cookies.set('user_data', JSON.stringify(mockResponse.user), { 
          expires: 7,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'strict'
        });
        
        return mockResponse;
      } else {
        // Invalid credentials
        throw new ThemeApiError('Invalid email or password', 401, 'INVALID_CREDENTIALS');
      }
    }
  }

  async refreshToken(): Promise<boolean> {
    try {
      const refreshToken = this.getRefreshToken();
      if (!refreshToken) return false;

      const response = await this.axios.post<ApiResponse<{ token: string; refreshToken: string }>>('/api/v1/auth/refresh', {
        refreshToken
      });

      if (response.data.success) {
        this.setToken(response.data.data.token);
        this.setRefreshToken(response.data.data.refreshToken);
        return true;
      } else {
        return false;
      }
    } catch {
      return false;
    }
  }

  logout(): void {
    this.removeTokens();
    // Redirect to login page
    if (typeof window !== 'undefined') {
      window.location.href = '/login';
    }
  }

  getCurrentUser(): User | null {
    const userData = Cookies.get('user_data');
    
    // Check if userData exists and is not the string "undefined"
    if (!userData || userData === 'undefined' || userData === 'null') {
      return null;
    }
    
    try {
      return JSON.parse(userData);
    } catch (error) {
      console.warn('Failed to parse user data from cookie:', error);
      // Clear invalid cookie data
      Cookies.remove('user_data');
      return null;
    }
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  isAdmin(): boolean {
    const user = this.getCurrentUser();
    return user?.role === 'admin';
  }

  // Theme API methods
  async getAllThemes(): Promise<Theme[]> {
    try {
      const response = await this.axios.get<ApiResponse<Theme[]>>('/api/v1/themes/');
      
      if (response.data.success) {
        return response.data.data;
      } else {
        throw new ThemeApiError(response.data.message || 'Failed to fetch themes', 400, 'FETCH_THEMES_FAILED');
      }
    } catch (error) {
      throw this.handleError(error as AxiosError);
    }
  }

  async getActiveTheme(): Promise<ActiveTheme> {
    try {
      const response = await this.axios.get<ApiResponse<ActiveTheme>>('/api/v1/themes/active');
      
      if (response.data.success) {
        return response.data.data;
      } else {
        throw new ThemeApiError(response.data.message || 'Failed to fetch active theme', 400, 'FETCH_ACTIVE_THEME_FAILED');
      }
    } catch (error) {
      throw this.handleError(error as AxiosError);
    }
  }

  async getThemeByName(name: string): Promise<Theme> {
    try {
      const response = await this.axios.get<ApiResponse<Theme>>(`/api/v1/themes/${name}`);
      
      if (response.data.success) {
        return response.data.data;
      } else {
        throw new ThemeApiError(response.data.message || 'Failed to fetch theme', 400, 'FETCH_THEME_FAILED');
      }
    } catch (error) {
      throw this.handleError(error as AxiosError);
    }
  }

  // Protected routes (require authentication)
  async createTheme(theme: Omit<Theme, 'createdAt' | 'updatedAt'>): Promise<Theme> {
    if (!this.isAdmin()) {
      throw new ThemeApiError('Admin access required', 403, 'INSUFFICIENT_PERMISSIONS');
    }

    try {
      const response = await this.axios.post<ApiResponse<Theme>>('/api/v1/themes/', theme);
      
      if (response.data.success) {
        return response.data.data;
      } else {
        throw new ThemeApiError(response.data.message || 'Failed to create theme', 400, 'CREATE_THEME_FAILED');
      }
    } catch (error) {
      throw this.handleError(error as AxiosError);
    }
  }

  async updateTheme(name: string, updates: Partial<Theme>): Promise<Theme> {
    if (!this.isAdmin()) {
      throw new ThemeApiError('Admin access required', 403, 'INSUFFICIENT_PERMISSIONS');
    }

    try {
      const response = await this.axios.put<ApiResponse<Theme>>(`/api/v1/themes/${name}`, updates);
      
      if (response.data.success) {
        return response.data.data;
      } else {
        throw new ThemeApiError(response.data.message || 'Failed to update theme', 400, 'UPDATE_THEME_FAILED');
      }
    } catch (error) {
      throw this.handleError(error as AxiosError);
    }
  }

  async deleteTheme(name: string): Promise<void> {
    if (!this.isAdmin()) {
      throw new ThemeApiError('Admin access required', 403, 'INSUFFICIENT_PERMISSIONS');
    }

    try {
      const response = await this.axios.delete<ApiResponse<any>>(`/api/v1/themes/${name}`);
      
      if (!response.data.success) {
        throw new ThemeApiError(response.data.message || 'Failed to delete theme', 400, 'DELETE_THEME_FAILED');
      }
    } catch (error) {
      throw this.handleError(error as AxiosError);
    }
  }

  async setActiveTheme(theme: string, isDark: boolean): Promise<void> {
    try {
      const response = await this.axios.post<ApiResponse<any>>('/api/v1/themes/active', { theme, isDark });
      
      if (!response.data.success) {
        throw new ThemeApiError(response.data.message || 'Failed to set active theme', 400, 'SET_ACTIVE_THEME_FAILED');
      }
    } catch (error) {
      throw this.handleError(error as AxiosError);
    }
  }
}

// Create and export a singleton instance
export const themeApiClient = new ThemeApiClient();
