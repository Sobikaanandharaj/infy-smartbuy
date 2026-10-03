import { Check, ClipboardCheck, Clock, PackageCheck, Truck, Home } from 'lucide-react'
import { ORDER_STATUSES, type OrderStatus } from '@/lib/data'
import { cn } from '@/lib/utils'

const STATUS_STYLES: Record<OrderStatus, string> = {
  Pending: 'bg-muted text-muted-foreground',
  Confirmed: 'bg-accent text-accent-foreground',
  Processing: 'bg-deal/20 text-deal-foreground',
  Shipped: 'bg-primary/15 text-primary',
  Delivered: 'bg-success/15 text-success',
}

const STATUS_ICONS = {
  Pending: Clock,
  Confirmed: ClipboardCheck,
  Processing: PackageCheck,
  Shipped: Truck,
  Delivered: Home,
} as const

export function OrderStatusBadge({ status, className }: { status: OrderStatus; className?: string }) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold',
        STATUS_STYLES[status],
        className,
      )}
    >
      <span className="size-1.5 rounded-full bg-current" aria-hidden="true" />
      {status}
    </span>
  )
}

export function OrderTimeline({ status }: { status: OrderStatus }) {
  const current = ORDER_STATUSES.indexOf(status)

  return (
    <ol className="flex flex-col gap-0 sm:flex-row" aria-label="Order progress">
      {ORDER_STATUSES.map((s, i) => {
        const Icon = STATUS_ICONS[s]
        const done = i < current
        const active = i === current
        return (
          <li key={s} className="relative flex flex-1 gap-3 pb-6 sm:flex-col sm:items-center sm:pb-0 sm:text-center last:pb-0">
            {i < ORDER_STATUSES.length - 1 && (
              <span
                aria-hidden="true"
                className={cn(
                  'absolute left-[18px] top-10 h-[calc(100%-2.5rem)] w-0.5 sm:left-[calc(50%+22px)] sm:top-[18px] sm:h-0.5 sm:w-[calc(100%-44px)]',
                  i < current ? 'bg-primary' : 'bg-border',
                )}
              />
            )}
            <span
              className={cn(
                'relative z-10 flex size-9 shrink-0 items-center justify-center rounded-full border-2',
                done && 'border-primary bg-primary text-primary-foreground',
                active && 'border-primary bg-accent text-primary ring-4 ring-primary/15',
                !done && !active && 'border-border bg-card text-muted-foreground',
              )}
            >
              {done ? <Check className="size-4" aria-hidden="true" /> : <Icon className="size-4" aria-hidden="true" />}
            </span>
            <span className="flex flex-col justify-center sm:mt-2">
              <span className={cn('text-sm font-medium', !done && !active && 'text-muted-foreground')}>{s}</span>
              {active && <span className="text-xs text-primary">Current status</span>}
            </span>
          </li>
        )
      })}
    </ol>
  )
}
