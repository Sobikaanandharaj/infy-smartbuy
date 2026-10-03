'use client'

import Image from 'next/image'
import Link from 'next/link'
import { ChevronRight, LogIn, Package } from 'lucide-react'
import { EmptyState } from '@/components/cart/cart-view'
import { OrderStatusBadge } from '@/components/orders/order-status'
import { formatDate, formatPrice } from '@/lib/format'
import { useStore } from '@/lib/store'

export default function OrdersPage() {
  const { currentUser, orders } = useStore()

  if (!currentUser) {
    return (
      <EmptyState
        icon={LogIn}
        title="Sign in to view orders"
        text="Track deliveries and view your order history after signing in."
        cta={{ href: '/login?next=/orders', label: 'Sign in' }}
      />
    )
  }

  const mine = orders.filter((o) => o.userEmail === currentUser.email)

  if (mine.length === 0) {
    return <EmptyState icon={Package} title="No orders yet" text="When you place an order, it will show up here." />
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:py-10">
      <h1 className="text-3xl font-semibold tracking-tight">My orders</h1>
      <p className="mt-1 text-sm text-muted-foreground">{mine.length} orders</p>
      <ul className="mt-8 flex flex-col gap-3">
        {mine.map((o) => (
          <li key={o.id}>
            <Link
              href={`/orders/${o.id}`}
              className="flex flex-col gap-4 rounded-2xl border bg-card p-4 transition-colors hover:border-primary/40 sm:flex-row sm:items-center sm:p-5"
            >
              <div className="flex -space-x-3">
                {o.items.slice(0, 3).map((it) => (
                  <div key={it.productId} className="relative size-14 overflow-hidden rounded-xl border-2 border-card bg-muted">
                    <Image src={it.image || '/placeholder.svg'} alt="" fill sizes="56px" className="object-cover" />
                  </div>
                ))}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="font-mono text-sm font-semibold">#{o.id}</p>
                  <OrderStatusBadge status={o.status} />
                </div>
                <p className="mt-1 truncate text-sm text-muted-foreground">
                  {o.items.map((i) => i.name).join(', ')}
                </p>
                <p className="mt-0.5 text-xs text-muted-foreground">Placed on {formatDate(o.createdAt)}</p>
              </div>
              <div className="flex items-center justify-between gap-3 sm:flex-col sm:items-end">
                <p className="font-semibold">{formatPrice(o.total)}</p>
                <span className="flex items-center gap-0.5 text-sm font-medium text-primary">
                  Track <ChevronRight className="size-4" aria-hidden="true" />
                </span>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}
