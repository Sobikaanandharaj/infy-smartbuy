import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight, Bot, Check, Sparkles } from 'lucide-react'
import { buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils'

const points = [
  'Recommends products based on budget and use case',
  'Compares specs side by side in plain language',
  'Finds the best active discounts instantly',
]

export function AiPromo() {
  return (
    <section className="mx-auto max-w-7xl px-4 sm:px-6" aria-labelledby="ai-heading">
      <div className="relative grid overflow-hidden rounded-3xl bg-ink text-ink-foreground lg:grid-cols-2">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-24 -top-24 size-96 rounded-full bg-primary/40 blur-3xl"
        />
        <div className="relative flex flex-col gap-5 p-6 sm:p-10">
          <span className="inline-flex w-fit items-center gap-2 rounded-full bg-primary/20 px-3 py-1 text-xs font-medium text-ink-foreground">
            <Sparkles className="size-3.5" aria-hidden="true" /> SmartBuy AI
          </span>
          <h2 id="ai-heading" className="text-balance text-3xl font-semibold tracking-tight sm:text-4xl">
            Not sure what to buy? Just ask.
          </h2>
          <p className="max-w-md text-ink-foreground/70">
            Tell our shopping assistant what you need and it will shortlist the right products from our catalog in
            seconds.
          </p>
          <ul className="flex flex-col gap-3">
            {points.map((p) => (
              <li key={p} className="flex items-start gap-3 text-sm">
                <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-primary">
                  <Check className="size-3 text-primary-foreground" aria-hidden="true" />
                </span>
                {p}
              </li>
            ))}
          </ul>
          <Link href="/assistant" className={cn(buttonVariants({ size: 'lg' }), 'mt-2 h-11 w-fit rounded-xl px-5')}>
            Start chatting <ArrowRight aria-hidden="true" />
          </Link>
        </div>

        <div className="relative p-6 sm:p-10 lg:pl-0">
          <div className="flex flex-col gap-3 rounded-2xl border border-ink-foreground/10 bg-ink-foreground/5 p-4 backdrop-blur">
            <div className="ml-auto max-w-[85%] rounded-2xl rounded-br-md bg-primary px-4 py-2.5 text-sm text-primary-foreground">
              I need a lightweight laptop for college under ₹1.1 lakh
            </div>
            <div className="flex max-w-[90%] items-start gap-2">
              <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-ink-foreground/10">
                <Bot className="size-4" aria-hidden="true" />
              </span>
              <div className="rounded-2xl rounded-bl-md bg-card px-4 py-3 text-sm text-foreground">
                <p>Great choice to look for portability! My top pick is:</p>
                <div className="mt-3 flex items-center gap-3 rounded-xl border bg-background p-2">
                  <div className="relative size-14 shrink-0 overflow-hidden rounded-lg bg-muted">
                    <Image src="/products/macbook-air.png" alt="" fill sizes="56px" className="object-cover" />
                  </div>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold">MacBook Air 13&quot; M3</p>
                    <p className="text-xs text-muted-foreground">1.24 kg · 18h battery</p>
                    <p className="text-sm font-semibold text-primary">₹1,04,900</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
