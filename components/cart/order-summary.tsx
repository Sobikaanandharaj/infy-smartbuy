import { calcTotals, formatPrice } from '@/lib/format'

export function OrderSummary({ subtotal, children }: { subtotal: number; children?: React.ReactNode }) {
  const { shipping, tax, total } = calcTotals(subtotal)
  const remaining = 999 - subtotal

  return (
    <section aria-labelledby="summary-heading" className="rounded-2xl border bg-card p-5 lg:sticky lg:top-40">
      <h2 id="summary-heading" className="text-lg font-semibold">
        Order summary
      </h2>
      <dl className="mt-4 flex flex-col gap-3 text-sm">
        <div className="flex justify-between">
          <dt className="text-muted-foreground">Subtotal</dt>
          <dd className="font-medium">{formatPrice(subtotal)}</dd>
        </div>
        <div className="flex justify-between">
          <dt className="text-muted-foreground">Shipping</dt>
          <dd className={shipping === 0 ? 'font-medium text-success' : 'font-medium'}>
            {shipping === 0 ? 'Free' : formatPrice(shipping)}
          </dd>
        </div>
        <div className="flex justify-between">
          <dt className="text-muted-foreground">GST (18%)</dt>
          <dd className="font-medium">{formatPrice(tax)}</dd>
        </div>
        <div className="mt-1 flex justify-between border-t pt-4 text-base">
          <dt className="font-semibold">Total</dt>
          <dd className="font-semibold">{formatPrice(total)}</dd>
        </div>
      </dl>
      {remaining > 0 && subtotal > 0 && (
        <p className="mt-4 rounded-lg bg-accent px-3 py-2 text-xs text-accent-foreground">
          Add {formatPrice(remaining)} more for free delivery.
        </p>
      )}
      {children}
    </section>
  )
}
