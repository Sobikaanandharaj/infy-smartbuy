'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Heart, ShoppingCart } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { DiscountBadge, PriceTag, RatingStars, StockBadge } from '@/components/product/product-meta'
import type { Product } from '@/lib/data'
import { useStore } from '@/lib/store'
import { cn } from '@/lib/utils'

export function ProductCard({ product, className }: { product: Product; className?: string }) {
  const { addToCart, toggleWishlist, wishlist } = useStore()
  const wished = wishlist.includes(product.id)
  const outOfStock = product.stock <= 0

  function handleAdd() {
    if (addToCart(product.id)) {
      toast.success('Added to cart', { description: `${product.brand} ${product.name}` })
    }
  }

  function handleWish() {
    const added = toggleWishlist(product.id)
    toast(added ? 'Saved to wishlist' : 'Removed from wishlist', { description: product.name })
  }

  return (
    <article
      className={cn(
        'group relative flex flex-col overflow-hidden rounded-2xl border bg-card transition-shadow hover:shadow-lg hover:shadow-primary/5',
        className,
      )}
    >
      <div className="relative aspect-square overflow-hidden bg-muted">
        <Link href={`/products/${product.id}`} aria-label={`View ${product.name}`}>
          <Image
            src={product.image || '/placeholder.svg'}
            alt={`${product.brand} ${product.name}`}
            fill
            sizes="(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw"
            className={cn(
              'object-cover transition-transform duration-500 group-hover:scale-105',
              outOfStock && 'opacity-60 grayscale',
            )}
          />
        </Link>
        <DiscountBadge price={product.price} originalPrice={product.originalPrice} className="absolute left-3 top-3" />
        <button
          type="button"
          onClick={handleWish}
          aria-pressed={wished}
          aria-label={wished ? 'Remove from wishlist' : 'Add to wishlist'}
          className="absolute right-3 top-3 flex size-9 items-center justify-center rounded-full bg-card/90 text-foreground shadow-sm backdrop-blur transition-colors hover:bg-card hover:text-destructive focus-visible:outline-2 focus-visible:outline-ring"
        >
          <Heart className={cn('size-4', wished && 'fill-destructive text-destructive')} aria-hidden="true" />
        </button>
      </div>

      <div className="flex flex-1 flex-col gap-2 p-4">
        <div className="flex items-center justify-between gap-2">
          <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">{product.brand}</span>
          <StockBadge stock={product.stock} />
        </div>
        <h3 className="line-clamp-2 text-sm font-semibold leading-snug text-foreground">
          <Link href={`/products/${product.id}`} className="hover:text-primary">
            {product.name}
          </Link>
        </h3>
        <RatingStars rating={product.rating} count={product.reviewCount} />
        <div className="mt-auto pt-2">
          <PriceTag price={product.price} originalPrice={product.originalPrice} />
        </div>
        <Button onClick={handleAdd} disabled={outOfStock} className="mt-2 h-10 w-full rounded-xl">
          <ShoppingCart aria-hidden="true" />
          {outOfStock ? 'Out of stock' : 'Add to Cart'}
        </Button>
      </div>
    </article>
  )
}
