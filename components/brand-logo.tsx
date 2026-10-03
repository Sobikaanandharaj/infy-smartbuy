import Link from 'next/link'
import { Zap } from 'lucide-react'
import { cn } from '@/lib/utils'

export function BrandLogo({ className, inverted = false }: { className?: string; inverted?: boolean }) {
  return (
    <Link href="/" className={cn('flex items-center gap-2 font-semibold tracking-tight', className)}>
      <span className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
        <Zap className="size-4" fill="currentColor" aria-hidden="true" />
      </span>
      <span className={cn('text-lg', inverted ? 'text-ink-foreground' : 'text-foreground')}>
        INFY <span className="text-primary">SmartBuy</span>
      </span>
    </Link>
  )
}
