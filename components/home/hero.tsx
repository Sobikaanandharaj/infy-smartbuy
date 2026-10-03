'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { ArrowRight, Search, Sparkles } from 'lucide-react'
import { Button, buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils'

const quickSearches = ['Gaming laptop', 'Noise cancelling', 'iPhone', 'Under ₹10,000']

export function Hero() {
  const router = useRouter()
  const [query, setQuery] = useState('')

  function go(q: string) {
    const term = q.replace('Under ₹10,000', '').trim()
    if (q.startsWith('Under')) return router.push('/products?max=10000')
    router.push(term ? `/products?q=${encodeURIComponent(term)}` : '/products')
  }

  return (
    <section className="relative overflow-hidden bg-ink text-ink-foreground">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-32 -top-32 size-[480px] rounded-full bg-primary/30 blur-3xl"
      />
      <div className="relative mx-auto grid max-w-7xl items-center gap-10 px-4 py-14 sm:px-6 md:py-20 lg:grid-cols-2 lg:gap-12">
        <div className="flex flex-col gap-6">
          <span className="inline-flex w-fit items-center gap-2 rounded-full border border-ink-foreground/15 bg-ink-foreground/5 px-3 py-1 text-xs font-medium">
            <Sparkles className="size-3.5 text-primary" aria-hidden="true" />
            New: AI Shopping Assistant is live
          </span>
          <h1 className="text-balance text-4xl font-semibold leading-[1.05] tracking-tight sm:text-5xl lg:text-6xl">
            Smarter tech.
            <br />
            <span className="text-primary">Smarter prices.</span>
          </h1>
          <p className="max-w-lg text-pretty text-base leading-relaxed text-ink-foreground/70 sm:text-lg">
            Discover flagship laptops, smartphones and audio gear — with up to 40% off this week and an assistant that
            finds the perfect match for your budget.
          </p>

          <form
            role="search"
            onSubmit={(e) => {
              e.preventDefault()
              go(query)
            }}
            className="relative max-w-xl"
          >
            <label htmlFor="hero-search" className="sr-only">
              Search products
            </label>
            <Search className="pointer-events-none absolute left-4 top-1/2 size-5 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
            <input
              id="hero-search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="What are you looking for?"
              className="h-14 w-full rounded-2xl border-0 bg-card pl-12 pr-32 text-base text-foreground shadow-xl outline-none ring-primary placeholder:text-muted-foreground focus-visible:ring-2"
            />
            <Button type="submit" className="absolute right-2 top-1/2 h-10 -translate-y-1/2 rounded-xl px-5">
              Search
            </Button>
          </form>

          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs text-ink-foreground/50">Popular:</span>
            {quickSearches.map((q) => (
              <button
                key={q}
                type="button"
                onClick={() => go(q)}
                className="rounded-full border border-ink-foreground/15 px-3 py-1 text-xs text-ink-foreground/80 transition-colors hover:border-ink-foreground/40 hover:text-ink-foreground"
              >
                {q}
              </button>
            ))}
          </div>

          <div className="flex flex-wrap gap-3 pt-2">
            <Link href="/products" className={cn(buttonVariants({ size: 'lg' }), 'h-11 rounded-xl px-5')}>
              Shop all products <ArrowRight aria-hidden="true" />
            </Link>
            <Link
              href="/assistant"
              className={cn(
                buttonVariants({ variant: 'outline', size: 'lg' }),
                'h-11 rounded-xl border-ink-foreground/20 bg-transparent px-5 text-ink-foreground hover:bg-ink-foreground/10 hover:text-ink-foreground',
              )}
            >
              <Sparkles aria-hidden="true" /> Ask the AI
            </Link>
          </div>
        </div>

        <div className="relative">
          <div className="relative aspect-[16/11] overflow-hidden rounded-3xl border border-ink-foreground/10 shadow-2xl">
            <Image
              src="/hero.png"
              alt="Premium laptop, smartphone and headphones"
              fill
              priority
              sizes="(min-width: 1024px) 50vw, 100vw"
              className="object-cover"
            />
          </div>
          <dl className="absolute -bottom-6 left-4 right-4 grid grid-cols-3 gap-2 rounded-2xl border bg-card p-4 text-foreground shadow-xl sm:left-8 sm:right-8">
            {[
              ['50K+', 'Happy customers'],
              ['4.8★', 'Average rating'],
              ['24h', 'Express delivery'],
            ].map(([value, label]) => (
              <div key={label} className="text-center">
                <dt className="sr-only">{label}</dt>
                <dd className="text-lg font-semibold tracking-tight sm:text-xl">{value}</dd>
                <dd className="text-[11px] text-muted-foreground sm:text-xs">{label}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  )
}
