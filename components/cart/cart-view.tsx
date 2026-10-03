'use client'

import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight, Minus, Plus, ShieldCheck, ShoppingBag, Trash2 } from 'lucide-react'
import { buttonVariants } from '@/components/ui/button'
import { OrderSummary } from '@/components/cart/order-summary'
import { StockBadge } from '@/components/product/product-meta'
import { formatPrice } from '@/lib/format'
import { useStore } from '@/lib/store'
import { cn } from '@/lib/utils'

export function EmptyState({
  icon: Icon,
  title,
  text,
  cta = { href: '/products', label: 'Start shopping' },
}: {
  icon: React.ComponentType<{ className?: string }>
  title: string
  text: string
  cta?: { href: string; label: string }
}) {
  return (
    <div className="mx-auto flex max-w-md flex-col items-center px-4 py-24 text-center">
      <span className="flex size-16 items-center justify-center rounded-2xl bg-accent">
        <Icon className="size-7 text-accent-foreground" />
      </span>
      <h1 className="mt-5 text-2xl font-semibold tracking-tight">{title}</h1>
      <p className="mt-2 text-muted-foreground">{text}</p>
      <Link href={cta.href} className={cn(buttonVariants({ size: 'lg' }), 'mt-6 h-11 rounded-xl px-5')}>
        {cta.label} <ArrowRight aria-hidden="true" />
      </Link>
    </div>
  )
}

export function CartView() {
  const { cart, cartCount, cartSubtotal, setQuantity, removeFromCart } = useStore()

  if (cart.length === 0) {
    return <EmptyState icon={ShoppingBag} title="Your cart is empty" text="Looks like you haven't added anything yet. Explore our latest deals." />
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:py-10">
      <h1 className="text-3xl font-semibold tracking-tight">Shopping cart</h1>
      <p className="mt-1 text-sm text-muted-foreground">{cartCount} items</p>

      <div className="mt-8 grid gap-8 lg:grid-cols-3">
        <ul className="flex flex-col gap-3 lg:col-span-2">
          {cart.map(({ product, quantity }) => {
            const max = Math.min(10, product.stock)
            return (
              <li key={product.id} className="flex gap-4 rounded-2xl border bg-card p-3 sm:p-4">
                <Link
                  href={`/products/${product.id}`}
                  className="relative size-24 shrink-0 overflow-hidden rounded-xl bg-muted sm:size-28"
                >
                  <Image src={product.image || '/placeholder.svg'} alt={product.name} fill sizes="112px" className="object-cover" />
                </Link>
                <div className="flex min-w-0 flex-1 flex-col">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">{product.brand}</p>
                      <Link href={`/products/${product.id}`} className="line-clamp-2 font-semibold hover:text-primary">
                        {product.name}
                      </Link>
                      <StockBadge stock={product.stock} className="mt-1" />
                    </div>
                    <p className="shrink-0 font-semibold">{formatPrice(product.price * quantity)}</p>
                  </div>
                  <div className="mt-auto flex items-center justify-between gap-3 pt-3">
                    <div className="flex items-center rounded-lg border" role="group" aria-label={`Quantity for ${product.name}`}>
                      <button
                        type="button"
                        onClick={() => setQuantity(product.id, quantity - 1)}
                        className="flex size-8 items-center justify-center rounded-l-lg hover:bg-muted"
                        aria-label="Decrease quantity"
                      >
                        <Minus className="size-3.5" aria-hidden="true" />
                      </button>
                      <span className="w-8 text-center text-sm font-semibold">{quantity}</span>
                      <button
                        type="button"
                        onClick={() => setQuantity(product.id, quantity + 1)}
                        disabled={quantity >= max}
                        className="flex size-8 items-center justify-center rounded-r-lg hover:bg-muted disabled:opacity-40"
                        aria-label="Increase quantity"
                      >
                        <Plus className="size-3.5" aria-hidden="true" />
                      </button>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeFromCart(product.id)}
                      className="flex items-center gap-1.5 rounded-lg px-2 py-1.5 text-sm text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                    >
                      <Trash2 className="size-4" aria-hidden="true" />
                      <span className="hidden sm:inline">Remove</span>
                      <span className="sr-only sm:hidden">Remove {product.name}</span>
                    </button>
                  </div>
                </div>
              </li>
            )
          })}
        </ul>

        <div className="flex flex-col gap-4">
          <OrderSummary subtotal={cartSubtotal}>
            <Link href="/checkout" className={cn(buttonVariants({ size: 'lg' }), 'mt-5 h-12 w-full rounded-xl')}>
              Proceed to checkout <ArrowRight aria-hidden="true" />
            </Link>
          </OrderSummary>
          <p className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
            <ShieldCheck className="size-4 text-success" aria-hidden="true" /> Safe and secure payments
          </p>
        </div>
      </div>
    </div>
  )
}
