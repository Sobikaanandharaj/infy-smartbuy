import { Star } from 'lucide-react'
import { LOW_STOCK_THRESHOLD } from '@/lib/data'
import { discountPercent, formatPrice } from '@/lib/format'
import { cn } from '@/lib/utils'

export function RatingStars({
  rating,
  count,
  size = 'sm',
}: {
  rating: number
  count?: number
  size?: 'sm' | 'md'
}) {
  const iconSize = size === 'sm' ? 'size-3.5' : 'size-4'
  return (
    <div className="flex items-center gap-1.5">
      <div className="flex items-center" aria-label={`Rated ${rating} out of 5`} role="img">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star
            key={i}
            aria-hidden="true"
            className={cn(
              iconSize,
              i < Math.round(rating) ? 'fill-deal text-deal' : 'fill-muted text-muted-foreground/30',
            )}
          />
        ))}
      </div>
      <span className={cn('font-medium text-foreground', size === 'sm' ? 'text-xs' : 'text-sm')}>
        {rating.toFixed(1)}
      </span>
      {count !== undefined && (
        <span className={cn('text-muted-foreground', size === 'sm' ? 'text-xs' : 'text-sm')}>
          ({count.toLocaleString('en-IN')})
        </span>
      )}
    </div>
  )
}

export function StockBadge({ stock, className }: { stock: number; className?: string }) {
  if (stock <= 0) {
    return (
      <span className={cn('inline-flex items-center gap-1.5 text-xs font-medium text-destructive', className)}>
        <span className="size-1.5 rounded-full bg-destructive" aria-hidden="true" />
        Out of stock
      </span>
    )
  }
  if (stock <= LOW_STOCK_THRESHOLD) {
    return (
      <span className={cn('inline-flex items-center gap-1.5 text-xs font-medium text-deal-foreground', className)}>
        <span className="size-1.5 rounded-full bg-deal" aria-hidden="true" />
        Only {stock} left
      </span>
    )
  }
  return (
    <span className={cn('inline-flex items-center gap-1.5 text-xs font-medium text-success', className)}>
      <span className="size-1.5 rounded-full bg-success" aria-hidden="true" />
      In stock
    </span>
  )
}

export function PriceTag({
  price,
  originalPrice,
  size = 'md',
}: {
  price: number
  originalPrice: number
  size?: 'md' | 'lg'
}) {
  const off = discountPercent(price, originalPrice)
  return (
    <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
      <span className={cn('font-semibold tracking-tight text-foreground', size === 'lg' ? 'text-3xl' : 'text-lg')}>
        {formatPrice(price)}
      </span>
      {off > 0 && (
        <>
          <span className={cn('text-muted-foreground line-through', size === 'lg' ? 'text-base' : 'text-xs')}>
            {formatPrice(originalPrice)}
          </span>
          <span className={cn('font-semibold text-success', size === 'lg' ? 'text-base' : 'text-xs')}>
            {off}% off
          </span>
        </>
      )}
    </div>
  )
}

export function DiscountBadge({ price, originalPrice, className }: { price: number; originalPrice: number; className?: string }) {
  const off = discountPercent(price, originalPrice)
  if (off <= 0) return null
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-md bg-deal px-2 py-0.5 text-xs font-semibold text-deal-foreground',
        className,
      )}
    >
      -{off}%
    </span>
  )
}
