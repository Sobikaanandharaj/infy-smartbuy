'use client'

import { Timer } from 'lucide-react'
import { ProductCard } from '@/components/product/product-card'
import { SectionHeading } from '@/components/home/section-heading'
import { discountPercent } from '@/lib/format'
import { useStore } from '@/lib/store'

export function FeaturedProducts() {
  const { products } = useStore()
  const featured = products.filter((p) => p.featured).slice(0, 8)

  return (
    <section className="mx-auto max-w-7xl px-4 sm:px-6" aria-labelledby="featured-heading">
      <SectionHeading id="featured-heading" eyebrow="Handpicked" title="Featured products" href="/products" />
      <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-4">
        {featured.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
    </section>
  )
}

export function DealProducts() {
  const { products } = useStore()
  const deals = [...products]
    .filter((p) => p.stock > 0)
    .sort((a, b) => discountPercent(b.price, b.originalPrice) - discountPercent(a.price, a.originalPrice))
    .slice(0, 4)

  return (
    <section className="mx-auto max-w-7xl px-4 sm:px-6" aria-labelledby="deals-heading">
      <div className="rounded-3xl border bg-gradient-to-br from-deal/15 via-card to-card p-4 sm:p-8">
        <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-deal-foreground">Limited time</p>
            <h2 id="deals-heading" className="mt-1 text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
              Biggest discounts this week
            </h2>
          </div>
          <div className="flex w-fit items-center gap-2 rounded-xl bg-ink px-3 py-2 font-mono text-sm text-ink-foreground">
            <Timer className="size-4 text-deal" aria-hidden="true" />
            Ends in 02d : 14h : 36m
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
          {deals.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </div>
    </section>
  )
}
