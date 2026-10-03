'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { ArrowLeft, CircleCheck, CreditCard, MapPin, PackageX } from 'lucide-react'
import { buttonVariants } from '@/components/ui/button'
import { OrderStatusBadge, OrderTimeline } from '@/components/orders/order-status'
import { formatDate, formatPrice } from '@/lib/format'
import { useStore } from '@/lib/store'
import { cn } from '@/lib/utils'

export function OrderDetail({ id }: { id: string }) {
  const params = useSearchParams()
  const justPlaced = params.get('placed') === '1'
  const { orders, currentUser } = useStore()
  const order = orders.find((o) => o.id === id)
  const canView = order && currentUser && (currentUser.role === 'admin' || currentUser.email === order.userEmail)

  if (!order || !canView) {
    return (
      <div className="mx-auto flex max-w-md flex-col items-center px-4 py-24 text-center">
        <PackageX className="size-12 text-muted-foreground" aria-hidden="true" />
        <h1 className="mt-4 text-2xl font-semibold">Order not found</h1>
        <p className="mt-2 text-muted-foreground">Sign in with the account that placed this order to view it.</p>
        <Link href="/orders" className={cn(buttonVariants(), 'mt-6 rounded-xl')}>
          My orders
        </Link>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:py-10">
      {justPlaced && (
        <div className="mb-8 flex items-start gap-4 rounded-2xl border border-success/30 bg-success/10 p-5" role="status">
          <CircleCheck className="size-7 shrink-0 text-success" aria-hidden="true" />
          <div>
            <h2 className="text-lg font-semibold">Order placed successfully!</h2>
            <p className="text-sm text-muted-foreground">
              Thank you, {order.customerName.split(' ')[0]}. We&apos;ve sent a confirmation to {order.userEmail}.
            </p>
          </div>
        </div>
      )}

      <Link href="/orders" className="mb-4 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="size-4" aria-hidden="true" /> All orders
      </Link>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-mono text-2xl font-semibold tracking-tight sm:text-3xl">#{order.id}</h1>
          <p className="mt-1 text-sm text-muted-foreground">Placed on {formatDate(order.createdAt)}</p>
        </div>
        <OrderStatusBadge status={order.status} className="text-sm" />
      </div>

      <section aria-labelledby="tracking-heading" className="mt-8 rounded-2xl border bg-card p-5 sm:p-6">
        <h2 id="tracking-heading" className="mb-6 text-lg font-semibold">
          Order tracking
        </h2>
        <OrderTimeline status={order.status} />
      </section>

      <div className="mt-6 grid gap-6 md:grid-cols-3">
        <section aria-labelledby="items-heading" className="rounded-2xl border bg-card p-5 md:col-span-2">
          <h2 id="items-heading" className="text-lg font-semibold">
            Items
          </h2>
          <ul className="mt-4 divide-y">
            {order.items.map((it) => (
              <li key={it.productId} className="flex items-center gap-3 py-3 first:pt-0 last:pb-0">
                <div className="relative size-16 shrink-0 overflow-hidden rounded-xl bg-muted">
                  <Image src={it.image || '/placeholder.svg'} alt="" fill sizes="64px" className="object-cover" />
                </div>
                <div className="min-w-0 flex-1">
                  <Link href={`/products/${it.productId}`} className="line-clamp-1 font-medium hover:text-primary">
                    {it.name}
                  </Link>
                  <p className="text-sm text-muted-foreground">
                    {it.quantity} × {formatPrice(it.price)}
                  </p>
                </div>
                <p className="font-semibold">{formatPrice(it.price * it.quantity)}</p>
              </li>
            ))}
          </ul>
          <dl className="mt-4 flex flex-col gap-2 border-t pt-4 text-sm">
            <div className="flex justify-between"><dt className="text-muted-foreground">Subtotal</dt><dd>{formatPrice(order.subtotal)}</dd></div>
            <div className="flex justify-between"><dt className="text-muted-foreground">Shipping</dt><dd>{order.shipping ? formatPrice(order.shipping) : 'Free'}</dd></div>
            <div className="flex justify-between"><dt className="text-muted-foreground">GST</dt><dd>{formatPrice(order.tax)}</dd></div>
            <div className="flex justify-between pt-2 text-base font-semibold"><dt>Total</dt><dd>{formatPrice(order.total)}</dd></div>
          </dl>
        </section>

        <div className="flex flex-col gap-6">
          <section aria-labelledby="ship-heading" className="rounded-2xl border bg-card p-5">
            <h2 id="ship-heading" className="flex items-center gap-2 font-semibold">
              <MapPin className="size-4 text-primary" aria-hidden="true" /> Shipping to
            </h2>
            <address className="mt-3 text-sm not-italic leading-relaxed text-muted-foreground">
              <span className="font-medium text-foreground">{order.address.fullName}</span>
              <br />
              {order.address.line1}
              {order.address.line2 && (
                <>
                  <br />
                  {order.address.line2}
                </>
              )}
              <br />
              {order.address.city}, {order.address.state} {order.address.pincode}
              <br />
              +91 {order.address.phone}
            </address>
          </section>
          <section aria-labelledby="pay-heading" className="rounded-2xl border bg-card p-5">
            <h2 id="pay-heading" className="flex items-center gap-2 font-semibold">
              <CreditCard className="size-4 text-primary" aria-hidden="true" /> Payment
            </h2>
            <p className="mt-3 text-sm text-muted-foreground">{order.paymentMethod}</p>
          </section>
        </div>
      </div>
    </div>
  )
}
