// Performance monitoring utilities for navigation

export interface NavigationMetrics {
  route: string
  startTime: number
  endTime?: number
  duration?: number
  timestamp: Date
}

class PerformanceMonitor {
  private metrics: NavigationMetrics[] = []
  private currentNavigation: NavigationMetrics | null = null

  startNavigation(route: string) {
    this.currentNavigation = {
      route,
      startTime: performance.now(),
      timestamp: new Date()
    }
  }

  endNavigation() {
    if (this.currentNavigation) {
      this.currentNavigation.endTime = performance.now()
      this.currentNavigation.duration = this.currentNavigation.endTime - this.currentNavigation.startTime
      
      this.metrics.push(this.currentNavigation)
      
      // Log performance data in development
      if (process.env.NODE_ENV === 'development') {
        console.log(`🚀 Navigation to ${this.currentNavigation.route}: ${this.currentNavigation.duration.toFixed(2)}ms`)
      }
      
      this.currentNavigation = null
    }
  }

  getMetrics() {
    return this.metrics
  }

  getAverageNavigationTime() {
    if (this.metrics.length === 0) return 0
    
    const totalTime = this.metrics.reduce((sum, metric) => sum + (metric.duration || 0), 0)
    return totalTime / this.metrics.length
  }

  getSlowestNavigation() {
    if (this.metrics.length === 0) return null
    
    return this.metrics.reduce((slowest, current) => {
      if (!slowest || (current.duration || 0) > (slowest.duration || 0)) {
        return current
      }
      return slowest
    }, null as NavigationMetrics | null)
  }

  clearMetrics() {
    this.metrics = []
  }
}

export const performanceMonitor = new PerformanceMonitor()

// Hook for monitoring navigation performance
export const useNavigationPerformance = () => {
  const startNavigation = (route: string) => {
    performanceMonitor.startNavigation(route)
  }

  const endNavigation = () => {
    performanceMonitor.endNavigation()
  }

  const getPerformanceStats = () => ({
    averageTime: performanceMonitor.getAverageNavigationTime(),
    slowestNavigation: performanceMonitor.getSlowestNavigation(),
    totalNavigations: performanceMonitor.getMetrics().length
  })

  return {
    startNavigation,
    endNavigation,
    getPerformanceStats
  }
}

// Utility to measure component render time
export const measureRenderTime = (componentName: string) => {
  const start = performance.now()
  
  return () => {
    const end = performance.now()
    const duration = end - start
    
    if (process.env.NODE_ENV === 'development') {
      console.log(`⚡ ${componentName} render time: ${duration.toFixed(2)}ms`)
    }
    
    return duration
  }
}

// Utility to check if navigation is slow
export const isNavigationSlow = (duration: number) => {
  // Consider navigation slow if it takes more than 300ms
  return duration > 300
}

// Utility to get performance recommendations
export const getPerformanceRecommendations = (metrics: NavigationMetrics[]) => {
  const recommendations: string[] = []
  
  const slowNavigations = metrics.filter(m => m.duration && isNavigationSlow(m.duration))
  
  if (slowNavigations.length > 0) {
    recommendations.push(`Found ${slowNavigations.length} slow navigations (>300ms)`)
    
    const slowest = slowNavigations.reduce((slowest, current) => {
      if (!slowest || (current.duration || 0) > (slowest.duration || 0)) {
        return current
      }
      return slowest
    }, null as NavigationMetrics | null)
    
    if (slowest) {
      recommendations.push(`Slowest navigation: ${slowest.route} (${slowest.duration?.toFixed(2)}ms)`)
    }
  }
  
  const averageTime = metrics.reduce((sum, m) => sum + (m.duration || 0), 0) / metrics.length
  
  if (averageTime > 200) {
    recommendations.push(`Average navigation time (${averageTime.toFixed(2)}ms) is above recommended threshold (200ms)`)
  }
  
  if (recommendations.length === 0) {
    recommendations.push("Navigation performance is good!")
  }
  
  return recommendations
}
