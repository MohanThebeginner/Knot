import { useState } from 'react'
import { cn } from '@/utils/cn'

export function PostImage({ url, alt, className }) {
  const [status, setStatus] = useState('loading') // loading | loaded | error

  if (!url) return null

  return (
    <div className={cn('relative overflow-hidden rounded-lg bg-surface-2', className)}>
      {status === 'loading' && (
        <div className="absolute inset-0 animate-pulse bg-surface-2" />
      )}
      {status === 'error' ? (
        <div className="flex items-center justify-center h-48 text-text-secondary">
          <span className="text-xs">Image unavailable</span>
        </div>
      ) : (
        <img
          src={url}
          alt={alt || 'Post image'}
          onLoad={() => setStatus('loaded')}
          onError={() => setStatus('error')}
          className={cn(
            'w-full object-cover transition-opacity duration-200',
            status === 'loaded' ? 'opacity-100' : 'opacity-0'
          )}
        />
      )}
    </div>
  )
}
