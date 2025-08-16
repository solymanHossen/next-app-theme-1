"use client"

import { useEffect, useState } from 'react'
import { useTheme } from './use-enhanced-theme'

interface ThemePerformanceMetrics {
  themeChangeTime: number
  apiResponseTime: number
  renderTime: number
  totalTransitionTime: number
}

export function useThemePerformance() {
  const [metrics, setMetrics] = useState<ThemePerformanceMetrics>({
    themeChangeTime: 0,
    apiResponseTime: 0,
    renderTime: 0,
    totalTransitionTime: 0,
  })
  
  const { theme, isDark, isLoading, error } = useTheme()

  useEffect(() => {
    // Performance monitoring for theme changes
    const startTime = performance.now()
    
    const observer = new MutationObserver(() => {
      const endTime = performance.now()
      const transitionTime = endTime - startTime
      
      setMetrics(prev => ({
        ...prev,
        totalTransitionTime: transitionTime,
        renderTime: transitionTime < 50 ? transitionTime : prev.renderTime, // Only update if reasonable
      }))
    })

    // Observe changes to the document element attributes (theme changes)
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-theme', 'data-mode', 'class']
    })

    return () => observer.disconnect()
  }, [theme, isDark])

  return {
    metrics,
    isOptimal: metrics.totalTransitionTime < 100, // Less than 100ms is optimal
    isGood: metrics.totalTransitionTime < 300,     // Less than 300ms is good
    performance: {
      excellent: metrics.totalTransitionTime < 50,
      good: metrics.totalTransitionTime < 100,
      acceptable: metrics.totalTransitionTime < 300,
      poor: metrics.totalTransitionTime >= 300,
    }
  }
}
