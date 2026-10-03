import Link from 'next/link'
import { ShieldCheck, Truck, RotateCcw, Headphones } from 'lucide-react'
import { BrandLogo } from '@/components/brand-logo'
import { CATEGORIES } from '@/lib/data'

const perks = [
  { icon: Truck, title: 'Free delivery', text: 'On orders above ₹999' },
  { icon: RotateCcw, title: 'Easy returns', text: '7-day replacement' },
  { icon: ShieldCheck, title: 'Genuine products', text: 'Brand warranty included' },
  { icon: Headphones, title: '24/7 support', text: 'AI + human experts' },
]

export function SiteFooter() {
  return (
    <footer className="mt-20 bg-ink text-ink-foreground">
      <div className="mx-auto grid max-w-7xl grid-cols-2 gap-6 border-b border-ink-foreground/10 px-4 py-10 sm:px-6 lg:grid-cols-4">
        {perks.map((p) => (
          <div key={p.title} className="flex items-start gap-3">
            <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-ink-foreground/10">
              <p.icon className="size-5 text-ink-foreground" aria-hidden="true" />
            </span>
            <div>
              <p className="text-sm font-semibold">{p.title}</p>
              <p className="text-xs text-ink-foreground/60">{p.text}</p>
            </div>
          </div>
        ))}
      </div>
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:px-6 md:grid-cols-4">
        <div className="md:col-span-2">
          <BrandLogo inverted />
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-ink-foreground/60">
            India&apos;s smartest destination for premium electronics. Curated tech, honest prices and an AI assistant that
            actually helps you choose.
          </p>
        </div>
        <div>
          <h2 className="text-sm font-semibold">Shop</h2>
          <ul className="mt-4 flex flex-col gap-2.5 text-sm text-ink-foreground/60">
            {CATEGORIES.map((c) => (
              <li key={c.id}>
                <Link href={`/products?category=${c.id}`} className="hover:text-ink-foreground">
                  {c.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h2 className="text-sm font-semibold">Account</h2>
          <ul className="mt-4 flex flex-col gap-2.5 text-sm text-ink-foreground/60">
            <li><Link href="/orders" className="hover:text-ink-foreground">My Orders</Link></li>
            <li><Link href="/wishlist" className="hover:text-ink-foreground">Wishlist</Link></li>
            <li><Link href="/assistant" className="hover:text-ink-foreground">AI Assistant</Link></li>
            <li><Link href="/admin" className="hover:text-ink-foreground">Admin</Link></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-ink-foreground/10">
        <p className="mx-auto max-w-7xl px-4 py-6 text-xs text-ink-foreground/50 sm:px-6">
          © 2026 INFY SmartBuy. Demo storefront — payments are simulated.
        </p>
      </div>
    </footer>
  )
}
