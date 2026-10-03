'use client'

import Image from 'next/image'
import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'
import { CATEGORIES } from '@/lib/data'
import { useStore } from '@/lib/store'
import { SectionHeading } from '@/components/home/section-heading'

export function CategoryGrid() {
  const { products } = useStore()

  return (
    <section className="mx-auto max-w-7xl px-4 sm:px-6" aria-labelledby="categories-heading">
      <SectionHeading id="categories-heading" eyebrow="Browse" title="Shop by category" href="/products" />
      <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
        {CATEGORIES.map((c) => {
          const count = products.filter((p) => p.category === c.id).length
          return (
            <Link
              key={c.id}
              href={`/products?category=${c.id}`}
              className="group relative flex flex-col overflow-hidden rounded-2xl border bg-card p-4 transition-all hover:border-primary/40 hover:shadow-lg hover:shadow-primary/5 sm:p-5"
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h3 className="text-base font-semibold text-foreground sm:text-lg">{c.label}</h3>
                  <p className="text-xs text-muted-foreground">{count} products</p>
                </div>
                <span className="flex size-8 items-center justify-center rounded-full bg-muted text-foreground transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                  <ArrowUpRight className="size-4" aria-hidden="true" />
                </span>
              </div>
              <div className="relative mt-3 aspect-[4/3]">
                <Image
                  src={c.image || '/placeholder.svg'}
                  alt=""
                  fill
                  sizes="(min-width: 1024px) 25vw, 50vw"
                  className="object-contain transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <p className="mt-2 hidden text-xs text-muted-foreground sm:block">{c.blurb}</p>
            </Link>
          )
        })}
      </div>
    </section>
  )
}
