import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

export function SectionHeading({
  id,
  eyebrow,
  title,
  href,
  linkLabel = 'View all',
}: {
  id: string
  eyebrow: string
  title: string
  href?: string
  linkLabel?: string
}) {
  return (
    <div className="mb-6 flex items-end justify-between gap-4">
      <div>
        <p className="text-xs font-semibold uppercase tracking-widest text-primary">{eyebrow}</p>
        <h2 id={id} className="mt-1 text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
          {title}
        </h2>
      </div>
      {href && (
        <Link href={href} className="flex shrink-0 items-center gap-1 text-sm font-medium text-primary hover:underline">
          {linkLabel} <ArrowRight className="size-4" aria-hidden="true" />
        </Link>
      )}
    </div>
  )
}
