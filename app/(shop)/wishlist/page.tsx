'use client'

import { Heart } from 'lucide-react'
import { EmptyState } from '@/components/cart/cart-view'
import { ProductCard } from '@/components/product/product-card'
import { useStore } from '@/lib/store'

export default function WishlistPage() {
  const { products, wishlist } = useStore()
  const items = products.filter((p) => wishlist.includes(p.id))

  if (items.length === 0) {
    return (
      <EmptyState
        icon={Heart}
        title="Your wishlist is empty"
        text="Tap the heart on any product to save it here for later."
        cta={{ href: '/products', label: 'Discover products' }}
      />
    )
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:py-10">
      <h1 className="text-3xl font-semibold tracking-tight">Wishlist</h1>
      <p className="mt-1 text-sm text-muted-foreground">{items.length} saved items</p>
      <div className="mt-8 grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-4">
        {items.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
    </div>
  )
}
