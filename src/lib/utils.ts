import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount)
}

export function formatNumber(num: number): string {
  return new Intl.NumberFormat('en-US').format(num)
}

export function formatPercentage(num: number): string {
  return `${Math.round(num)}%`
}

export function formatDuration(ms: number): string {
  if (ms < 1000) return `${ms}ms`
  if (ms < 60000) return `${(ms / 1000).toFixed(1)}s`
  return `${(ms / 60000).toFixed(1)}m`
}

export function getTimeAgo(timestamp: string): string {
  const now = new Date()
  const time = new Date(timestamp)
  const diffInMs = now.getTime() - time.getTime()
  
  const diffInMinutes = Math.floor(diffInMs / (1000 * 60))
  const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60))
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24))
  
  if (diffInMinutes < 1) return 'Just now'
  if (diffInMinutes < 60) return `${diffInMinutes}m ago`
  if (diffInHours < 24) return `${diffInHours}h ago`
  if (diffInDays < 7) return `${diffInDays}d ago`
  
  return time.toLocaleDateString()
}

export function getStatusColor(status: string): string {
  switch (status.toLowerCase()) {
    case 'healthy':
    case 'operational':
    case 'green':
    case 'completed':
      return 'text-green-600 bg-green-50'
    case 'warning':
    case 'yellow':
    case 'at_risk':
      return 'text-yellow-600 bg-yellow-50'
    case 'error':
    case 'failed':
    case 'red':
    case 'off_track':
      return 'text-red-600 bg-red-50'
    case 'info':
    case 'blue':
    case 'on_track':
      return 'text-blue-600 bg-blue-50'
    default:
      return 'text-gray-600 bg-gray-50'
  }
}

export function getStatusIndicatorColor(status: string): string {
  switch (status.toLowerCase()) {
    case 'healthy':
    case 'operational':
    case 'green':
    case 'completed':
      return 'bg-green-500'
    case 'warning':
    case 'yellow':
    case 'at_risk':
      return 'bg-yellow-500'
    case 'error':
    case 'failed':
    case 'red':
    case 'off_track':
      return 'bg-red-500'
    case 'info':
    case 'blue':
    case 'on_track':
      return 'bg-blue-500'
    default:
      return 'bg-gray-400'
  }
}

export function getTrendIcon(trend: 'up' | 'down' | 'stable'): string {
  switch (trend) {
    case 'up':
      return '↗'
    case 'down':
      return '↘'
    case 'stable':
    default:
      return '→'
  }
}

export function getTrendColor(trend: 'up' | 'down' | 'stable', isGoodWhenUp = true): string {
  if (trend === 'stable') return 'text-gray-500'
  
  const isPositive = isGoodWhenUp ? trend === 'up' : trend === 'down'
  return isPositive ? 'text-green-600' : 'text-red-600'
}

export function generateId(): string {
  return Math.random().toString(36).substr(2, 9)
}

export function debounce<T extends (...args: any[]) => void>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout
  
  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      clearTimeout(timeout)
      func(...args)
    }
    
    clearTimeout(timeout)
    timeout = setTimeout(later, wait)
  }
}