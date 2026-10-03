'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { ChevronRight, Heart, Minus, PackageX, Plus, RotateCcw, ShieldCheck, ShoppingCart, Truck, Zap } from 'lucide-react'
import { toast } from 'sonner'
import { Button, buttonVariants } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ProductCard } from '@/components/product/product-card'
import { DiscountBadge, PriceTag, RatingStars, StockBadge } from '@/components/product/product-meta'
import { CATEGORIES } from '@/lib/data'
import { formatDate, formatPrice } from '@/lib/format'
import { useStore } from '@/lib/store'
import { cn } from '@/lib/utils'

export function ProductDetail({ id }: { id: string }) {
  const router = useRouter()
  const { products, addToCart, toggleWishlist, wishlist } = useStore()
  const product = products.find((p) => p.id === id)
  const [quantity, setQuantity] = useState(1)

  if (!product) {
    return (
      <div className="mx-auto flex max-w-xl flex-col items-center px-4 py-24 text-center">
        <PackageX className="size-12 text-muted-foreground" aria-hidden="true" />
        <h1 className="mt-4 text-2xl font-semibold">Product not found</h1>
        <p className="mt-2 text-muted-foreground">This product may have been removed from the catalog.</p>
        <Link href="/products" className={cn(buttonVariants(), 'mt-6 rounded-xl')}>
          Browse products
        </Link>
      </div>
    )
  }

  const category = CATEGORIES.find((c) => c.id === product.category)
  const wished = wishlist.includes(product.id)
  const outOfStock = product.stock <= 0
  const maxQty = Math.min(10, product.stock)
  const related = products.filter((p) => p.category === product.category && p.id !== product.id).slice(0, 4)
  const ratingBreakdown = [5, 4, 3, 2, 1].map((star) => ({
    star,
    count: product.reviews.filter((r) => r.rating === star).length,
  }))

  function handleAdd(buyNow = false) {
    if (!product) return
    if (addToCart(product.id, quantity)) {
      if (buyNow) {
        router.push('/checkout')
      } else {
        toast.success('Added to cart', { description: `${quantity} × ${product.name}` })
      }
    } else {
      toast.error('Not enough stock available')
    }
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:py-10">
      <nav aria-label="Breadcrumb" className="mb-6">
        <ol className="flex flex-wrap items-center gap-1 text-sm text-muted-foreground">
          <li><Link href="/" className="hover:text-foreground">Home</Link></li>
          <li aria-hidden="true"><ChevronRight className="size-3.5" /></li>
          <li>
            <Link href={`/products?category=${product.category}`} className="hover:text-foreground">
              {category?.label}
            </Link>
          </li>
          <li aria-hidden="true"><ChevronRight className="size-3.5" /></li>
          <li aria-current="page" className="truncate font-medium text-foreground">{product.name}</li>
        </ol>
      </nav>

      <div className="grid gap-8 lg:grid-cols-2 lg:gap-12">
        <div className="relative aspect-square overflow-hidden rounded-3xl border bg-card">
          <Image
            src={product.image || '/placeholder.svg'}
            alt={`${product.brand} ${product.name}`}
            fill
            priority
            sizes="(min-width: 1024px) 50vw, 100vw"
            className={cn('object-cover', outOfStock && 'opacity-60 grayscale')}
          />
          <DiscountBadge price={product.price} originalPrice={product.originalPrice} className="absolute left-4 top-4 text-sm" />
        </div>

        <div className="flex flex-col gap-5">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wider text-primary">{product.brand}</p>
            <h1 className="mt-1 text-balance text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
              {product.name}
            </h1>
            <p className="mt-2 text-muted-foreground">{product.tagline}</p>
          </div>

          <div className="flex flex-wrap items-center gap-4">
            <RatingStars rating={product.rating} count={product.reviewCount} size="md" />
            <span className="h-4 w-px bg-border" aria-hidden="true" />
            <StockBadge stock={product.stock} className="text-sm" />
          </div>

          <div className="rounded-2xl border bg-card p-5">
            <PriceTag price={product.price} originalPrice={product.originalPrice} size="lg" />
            <p className="mt-1 text-xs text-muted-foreground">Inclusive of all taxes · No-cost EMI from {formatPrice(Math.round(product.price / 12))}/mo</p>

            <div className="mt-5 flex flex-wrap items-center gap-3">
              <div className="flex items-center rounded-xl border" role="group" aria-label="Quantity">
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  disabled={quantity <= 1 || outOfStock}
                  className="flex size-11 items-center justify-center rounded-l-xl hover:bg-muted disabled:opacity-40"
                  aria-label="Decrease quantity"
                >
                  <Minus className="size-4" aria-hidden="true" />
                </button>
                <span className="w-10 text-center text-sm font-semibold" aria-live="polite">
                  {outOfStock ? 0 : quantity}
                </span>
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.min(maxQty, q + 1))}
                  disabled={quantity >= maxQty || outOfStock}
                  className="flex size-11 items-center justify-center rounded-r-xl hover:bg-muted disabled:opacity-40"
                  aria-label="Increase quantity"
                >
                  <Plus className="size-4" aria-hidden="true" />
                </button>
              </div>
              <Button onClick={() => handleAdd()} disabled={outOfStock} size="lg" className="h-11 flex-1 rounded-xl">
                <ShoppingCart aria-hidden="true" /> Add to Cart
              </Button>
              <Button
                variant="outline"
                size="lg"
                onClick={() => {
                  const added = toggleWishlist(product.id)
                  toast(added ? 'Saved to wishlist' : 'Removed from wishlist')
                }}
                aria-pressed={wished}
                aria-label={wished ? 'Remove from wishlist' : 'Add to wishlist'}
                className="size-11 rounded-xl p-0"
              >
                <Heart className={cn(wished && 'fill-destructive text-destructive')} aria-hidden="true" />
              </Button>
            </div>
            <Button
              onClick={() => handleAdd(true)}
              disabled={outOfStock}
              variant="secondary"
              size="lg"
              className="mt-3 h-11 w-full rounded-xl bg-ink text-ink-foreground hover:bg-ink/90"
            >
              <Zap aria-hidden="true" /> Buy Now
            </Button>
          </div>

          <ul className="grid grid-cols-3 gap-2 text-center text-xs">
            {[
              { icon: Truck, label: product.price >= 999 ? 'Free delivery' : 'Fast delivery' },
              { icon: RotateCcw, label: '7-day returns' },
              { icon: ShieldCheck, label: '1-year warranty' },
            ].map((f) => (
              <li key={f.label} className="flex flex-col items-center gap-1.5 rounded-xl border bg-card p-3">
                <f.icon className="size-5 text-primary" aria-hidden="true" />
                <span className="font-medium">{f.label}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <Tabs defaultValue="description" className="mt-12">
        <TabsList variant="line" className="w-full justify-start gap-4 border-b">
          <TabsTrigger value="description">Description</TabsTrigger>
          <TabsTrigger value="specs">Specifications</TabsTrigger>
          <TabsTrigger value="reviews">Reviews ({product.reviews.length})</TabsTrigger>
        </TabsList>
        <TabsContent value="description" className="pt-6">
          <p className="max-w-3xl leading-relaxed text-muted-foreground">{product.description}</p>
        </TabsContent>
        <TabsContent value="specs" className="pt-6">
          <dl className="max-w-3xl divide-y overflow-hidden rounded-2xl border bg-card">
            {Object.entries(product.specs).map(([k, v]) => (
              <div key={k} className="grid grid-cols-3 gap-4 px-5 py-3 text-sm">
                <dt className="font-medium text-muted-foreground">{k}</dt>
                <dd className="col-span-2 text-foreground">{v}</dd>
              </div>
            ))}
          </dl>
        </TabsContent>
        <TabsContent value="reviews" className="pt-6">
          <div className="grid gap-8 lg:grid-cols-3">
            <div className="rounded-2xl border bg-card p-5">
              <p className="text-5xl font-semibold tracking-tight">{product.rating.toFixed(1)}</p>
              <div className="mt-2">
                <RatingStars rating={product.rating} />
              </div>
              <p className="mt-1 text-sm text-muted-foreground">
                Based on {product.reviewCount.toLocaleString('en-IN')} ratings
              </p>
              <div className="mt-5 flex flex-col gap-2">
                {ratingBreakdown.map((r) => (
                  <div key={r.star} className="flex items-center gap-3 text-xs">
                    <span className="w-6 font-medium">{r.star}★</span>
                    <Progress
                      value={product.reviews.length ? (r.count / product.reviews.length) * 100 : 0}
                      className="flex-1"
                      aria-label={`${r.star} star reviews`}
                    />
                    <span className="w-4 text-right text-muted-foreground">{r.count}</span>
                  </div>
                ))}
              </div>
            </div>
            <ul className="flex flex-col gap-4 lg:col-span-2">
              {product.reviews.map((r) => (
                <li key={r.id} className="rounded-2xl border bg-card p-5">
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <span className="flex size-9 items-center justify-center rounded-full bg-accent text-sm font-semibold text-accent-foreground">
                        {r.author.charAt(0)}
                      </span>
                      <div>
                        <p className="text-sm font-semibold">{r.author}</p>
                        <p className="text-xs text-muted-foreground">{formatDate(r.date)} · Verified buyer</p>
                      </div>
                    </div>
                    <RatingStars rating={r.rating} />
                  </div>
                  <p className="mt-3 font-medium">{r.title}</p>
                  <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{r.body}</p>
                </li>
              ))}
            </ul>
          </div>
        </TabsContent>
      </Tabs>

      {related.length > 0 && (
        <section className="mt-16" aria-labelledby="related-heading">
          <h2 id="related-heading" className="mb-6 text-2xl font-semibold tracking-tight">
            You may also like
          </h2>
          <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
            {related.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
