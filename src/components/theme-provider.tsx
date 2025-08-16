"use client";

import React from 'react';
import { useTheme } from '@/hooks/use-enhanced-theme';

interface ThemeProviderProps {
  children: React.ReactNode;
}

function ThemeInitializer() {
  const { applyTheme, isLoading, error } = useTheme();

  React.useEffect(() => {
    // Apply theme on mount
    applyTheme();
  }, [applyTheme]);

  // Optional: Show loading state
  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-background flex items-center justify-center z-50">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return null;
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  return (
    <>
      <ThemeInitializer />
      {children}
    </>
  );
}
