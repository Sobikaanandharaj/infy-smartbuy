'use client'

import { useMemo, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { PackageSearch, SlidersHorizontal, Star, X } from 'lucide-react'
import { ProductCard } from '@/components/product/product-card'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { Switch } from '@/components/ui/switch'
import { CATEGORIES, type Category, type Product } from '@/lib/data'
import { discountPercent } from '@/lib/format'
import { useStore } from '@/lib/store'
import { cn } from '@/lib/utils'

const SORT_OPTIONS = [
  { value: 'relevance', label: 'Relevance' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
  { value: 'rating', label: 'Top Rated' },
  { value: 'discount', label: 'Biggest Discount' },
]

const PRICE_PRESETS = [
  { label: 'Under ₹5,000', min: 0, max: 5000 },
  { label: '₹5,000 – ₹30,000', min: 5000, max: 30000 },
  { label: '₹30,000 – ₹1,00,000', min: 30000, max: 100000 },
  { label: 'Above ₹1,00,000', min: 100000, max: 0 },
]

type Filters = {
  categories: Category[]
  brands: string[]
  min: string
  max: string
  minRating: number
  inStockOnly: boolean
}

function sortProducts(list: Product[], sort: string) {
  const sorted = [...list]
  switch (sort) {
    case 'price-asc':
      return sorted.sort((a, b) => a.price - b.price)
    case 'price-desc':
      return sorted.sort((a, b) => b.price - a.price)
    case 'rating':
      return sorted.sort((a, b) => b.rating - a.rating)
    case 'discount':
      return sorted.sort(
        (a, b) => discountPercent(b.price, b.originalPrice) - discountPercent(a.price, a.originalPrice),
      )
    default:
      return sorted
  }
}

function FilterPanel({
  filters,
  setFilters,
  brands,
}: {
  filters: Filters
  setFilters: (f: Filters) => void
  brands: string[]
}) {
  const toggle = <T,>(list: T[], value: T) => (list.includes(value) ? list.filter((v) => v !== value) : [...list, value])

  return (
    <div className="flex flex-col gap-7">
      <fieldset className="flex flex-col gap-3">
        <legend className="mb-3 text-sm font-semibold text-foreground">Category</legend>
        {CATEGORIES.map((c) => (
          <Label key={c.id} className="flex cursor-pointer items-center gap-2.5 font-normal">
            <Checkbox
              checked={filters.categories.includes(c.id)}
              onCheckedChange={() => setFilters({ ...filters, categories: toggle(filters.categories, c.id) })}
            />
            {c.label}
          </Label>
        ))}
      </fieldset>

      <fieldset className="flex flex-col gap-3">
        <legend className="mb-3 text-sm font-semibold text-foreground">Brand</legend>
        <div className="flex max-h-56 flex-col gap-3 overflow-y-auto pr-1">
          {brands.map((b) => (
            <Label key={b} className="flex cursor-pointer items-center gap-2.5 font-normal">
              <Checkbox
                checked={filters.brands.includes(b)}
                onCheckedChange={() => setFilters({ ...filters, brands: toggle(filters.brands, b) })}
              />
              {b}
            </Label>
          ))}
        </div>
      </fieldset>

      <fieldset className="flex flex-col gap-3">
        <legend className="mb-3 text-sm font-semibold text-foreground">Price range</legend>
        <div className="flex items-center gap-2">
          <Label htmlFor="price-min" className="sr-only">
            Minimum price
          </Label>
          <Input
            id="price-min"
            inputMode="numeric"
            placeholder="Min ₹"
            value={filters.min}
            onChange={(e) => setFilters({ ...filters, min: e.target.value.replace(/\D/g, '') })}
            className="h-9"
          />
          <span className="text-muted-foreground" aria-hidden="true">
            –
          </span>
          <Label htmlFor="price-max" className="sr-only">
            Maximum price
          </Label>
          <Input
            id="price-max"
            inputMode="numeric"
            placeholder="Max ₹"
            value={filters.max}
            onChange={(e) => setFilters({ ...filters, max: e.target.value.replace(/\D/g, '') })}
            className="h-9"
          />
        </div>
        <div className="flex flex-wrap gap-1.5">
          {PRICE_PRESETS.map((p) => {
            const active = filters.min === (p.min ? String(p.min) : '') && filters.max === (p.max ? String(p.max) : '')
            return (
              <button
                key={p.label}
                type="button"
                aria-pressed={active}
                onClick={() =>
                  setFilters({
                    ...filters,
                    min: active ? '' : p.min ? String(p.min) : '',
                    max: active ? '' : p.max ? String(p.max) : '',
                  })
                }
                className={cn(
                  'rounded-full border px-2.5 py-1 text-xs transition-colors',
                  active ? 'border-primary bg-accent text-accent-foreground' : 'hover:border-foreground/30',
                )}
              >
                {p.label}
              </button>
            )
          })}
        </div>
      </fieldset>

      <fieldset className="flex flex-col gap-2">
        <legend className="mb-3 text-sm font-semibold text-foreground">Customer rating</legend>
        {[4.5, 4, 0].map((r) => (
          <button
            key={r}
            type="button"
            aria-pressed={filters.minRating === r}
            onClick={() => setFilters({ ...filters, minRating: r })}
            className={cn(
              'flex items-center gap-2 rounded-lg px-2.5 py-1.5 text-left text-sm transition-colors',
              filters.minRating === r ? 'bg-accent font-medium text-accent-foreground' : 'hover:bg-muted',
            )}
          >
            {r === 0 ? (
              'Any rating'
            ) : (
              <>
                <Star className="size-3.5 fill-deal text-deal" aria-hidden="true" /> {r} & above
              </>
            )}
          </button>
        ))}
      </fieldset>

      <div className="flex items-center justify-between gap-3">
        <Label htmlFor="in-stock" className="text-sm font-semibold">
          In stock only
        </Label>
        <Switch
          id="in-stock"
          checked={filters.inStockOnly}
          onCheckedChange={(v) => setFilters({ ...filters, inStockOnly: v })}
        />
      </div>
    </div>
  )
}

export function Catalog() {
  const params = useSearchParams()
  const { products } = useStore()
  const query = params.get('q')?.trim() ?? ''
  const initialCategory = params.get('category') as Category | null

  const emptyFilters: Filters = { categories: [], brands: [], min: '', max: '', minRating: 0, inStockOnly: false }
  const [filters, setFilters] = useState<Filters>({
    ...emptyFilters,
    categories: initialCategory && CATEGORIES.some((c) => c.id === initialCategory) ? [initialCategory] : [],
    max: params.get('max') ?? '',
  })
  const [sort, setSort] = useState(params.get('sort') ?? 'relevance')

  const brands = useMemo(() => Array.from(new Set(products.map((p) => p.brand))).sort(), [products])

  const results = useMemo(() => {
    const q = query.toLowerCase()
    const min = Number(filters.min) || 0
    const max = Number(filters.max) || Infinity
    const filtered = products.filter((p) => {
      if (q) {
        const haystack = `${p.name} ${p.brand} ${p.category} ${p.tagline}`.toLowerCase()
        if (!q.split(/\s+/).every((word) => haystack.includes(word))) return false
      }
      if (filters.categories.length && !filters.categories.includes(p.category)) return false
      if (filters.brands.length && !filters.brands.includes(p.brand)) return false
      if (p.price < min || p.price > max) return false
      if (p.rating < filters.minRating) return false
      if (filters.inStockOnly && p.stock <= 0) return false
      return true
    })
    return sortProducts(filtered, sort)
  }, [products, query, filters, sort])

  const activeCount =
    filters.categories.length +
    filters.brands.length +
    (filters.min || filters.max ? 1 : 0) +
    (filters.minRating ? 1 : 0) +
    (filters.inStockOnly ? 1 : 0)

  const heading =
    query
      ? `Results for “${query}”`
      : filters.categories.length === 1
        ? CATEGORIES.find((c) => c.id === filters.categories[0])?.label
        : 'All products'

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:py-10">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight text-foreground">{heading}</h1>
          <p className="mt-1 text-sm text-muted-foreground" aria-live="polite">
            {results.length} {results.length === 1 ? 'product' : 'products'} found
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Sheet>
            <SheetTrigger
              render={
                <Button variant="outline" className="h-10 rounded-xl lg:hidden">
                  <SlidersHorizontal aria-hidden="true" /> Filters
                  {activeCount > 0 && (
                    <span className="rounded-full bg-primary px-1.5 text-[10px] text-primary-foreground">{activeCount}</span>
                  )}
                </Button>
              }
            />
            <SheetContent side="left" className="w-80 overflow-y-auto">
              <SheetHeader>
                <SheetTitle>Filters</SheetTitle>
              </SheetHeader>
              <div className="px-4 pb-6">
                <FilterPanel filters={filters} setFilters={setFilters} brands={brands} />
              </div>
            </SheetContent>
          </Sheet>
          <Select
            value={sort}
            onValueChange={(v) => setSort(v ?? 'relevance')}
            items={SORT_OPTIONS}
          >
            <SelectTrigger className="h-10 min-w-48 rounded-xl bg-card" aria-label="Sort products">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {SORT_OPTIONS.map((o) => (
                <SelectItem key={o.value} value={o.value}>
                  {o.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex gap-8">
        <aside className="hidden w-60 shrink-0 lg:block" aria-label="Filters">
          <div className="sticky top-40 rounded-2xl border bg-card p-5">
            <div className="mb-5 flex items-center justify-between">
              <h2 className="text-base font-semibold">Filters</h2>
              {activeCount > 0 && (
                <button
                  type="button"
                  onClick={() => setFilters(emptyFilters)}
                  className="text-xs font-medium text-primary hover:underline"
                >
                  Clear all
                </button>
              )}
            </div>
            <FilterPanel filters={filters} setFilters={setFilters} brands={brands} />
          </div>
        </aside>

        <section className="min-w-0 flex-1" aria-label="Product results">
          {activeCount > 0 && (
            <div className="mb-4 flex flex-wrap gap-2">
              {filters.categories.map((c) => (
                <FilterChip
                  key={c}
                  label={CATEGORIES.find((x) => x.id === c)?.label ?? c}
                  onRemove={() => setFilters({ ...filters, categories: filters.categories.filter((x) => x !== c) })}
                />
              ))}
              {filters.brands.map((b) => (
                <FilterChip
                  key={b}
                  label={b}
                  onRemove={() => setFilters({ ...filters, brands: filters.brands.filter((x) => x !== b) })}
                />
              ))}
              {(filters.min || filters.max) && (
                <FilterChip
                  label={`₹${filters.min || 0} – ${filters.max ? `₹${filters.max}` : 'any'}`}
                  onRemove={() => setFilters({ ...filters, min: '', max: '' })}
                />
              )}
              {filters.minRating > 0 && (
                <FilterChip label={`${filters.minRating}★ & up`} onRemove={() => setFilters({ ...filters, minRating: 0 })} />
              )}
              {filters.inStockOnly && (
                <FilterChip label="In stock" onRemove={() => setFilters({ ...filters, inStockOnly: false })} />
              )}
            </div>
          )}

          {results.length > 0 ? (
            <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3">
              {results.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed bg-card px-6 py-20 text-center">
              <PackageSearch className="size-10 text-muted-foreground" aria-hidden="true" />
              <h2 className="mt-4 text-lg font-semibold">No products match your filters</h2>
              <p className="mt-1 max-w-sm text-sm text-muted-foreground">
                Try removing a filter or searching for something broader.
              </p>
              <Button variant="outline" className="mt-5 rounded-xl" onClick={() => setFilters(emptyFilters)}>
                Reset filters
              </Button>
            </div>
          )}
        </section>
      </div>
    </div>
  )
}

function FilterChip({ label, onRemove }: { label: string; onRemove: () => void }) {
  return (
    <span className="inline-flex items-center gap-1 rounded-full border bg-card py-1 pl-3 pr-1 text-xs font-medium">
      {label}
      <button
        type="button"
        onClick={onRemove}
        className="flex size-5 items-center justify-center rounded-full hover:bg-muted"
        aria-label={`Remove filter ${label}`}
      >
        <X className="size-3" aria-hidden="true" />
      </button>
    </span>
  )
}
