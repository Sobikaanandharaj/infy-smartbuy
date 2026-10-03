'use client'

import Link from 'next/link'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { Suspense, useState } from 'react'
import {
  Heart,
  LayoutDashboard,
  LogIn,
  LogOut,
  Menu,
  Package,
  Search,
  ShoppingCart,
  Sparkles,
  User,
  UserPlus,
} from 'lucide-react'
import { BrandLogo } from '@/components/brand-logo'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { CATEGORIES } from '@/lib/data'
import { useStore } from '@/lib/store'
import { cn } from '@/lib/utils'

function SearchForm({ className, onSubmitted }: { className?: string; onSubmitted?: () => void }) {
  const router = useRouter()
  const params = useSearchParams()
  const [query, setQuery] = useState(params.get('q') ?? '')

  return (
    <form
      role="search"
      className={cn('relative', className)}
      onSubmit={(e) => {
        e.preventDefault()
        const q = query.trim()
        router.push(q ? `/products?q=${encodeURIComponent(q)}` : '/products')
        onSubmitted?.()
      }}
    >
      <label htmlFor="site-search" className="sr-only">
        Search products
      </label>
      <Search className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
      <Input
        id="site-search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search laptops, phones, headphones..."
        className="h-11 rounded-xl border-transparent bg-muted pl-10 pr-24 focus-visible:bg-card"
      />
      <Button type="submit" className="absolute right-1.5 top-1/2 h-8 -translate-y-1/2 rounded-lg px-4">
        Search
      </Button>
    </form>
  )
}

function CountBubble({ count }: { count: number }) {
  if (count <= 0) return null
  return (
    <span className="absolute -right-1 -top-1 flex min-w-5 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-semibold leading-5 text-primary-foreground">
      {count}
    </span>
  )
}

function AccountMenu() {
  const router = useRouter()
  const { currentUser, logout } = useStore()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className="flex size-10 items-center justify-center rounded-xl text-foreground transition-colors hover:bg-muted focus-visible:outline-2 focus-visible:outline-ring"
        aria-label="Account menu"
      >
        {currentUser ? (
          <span className="flex size-8 items-center justify-center rounded-full bg-primary text-xs font-semibold text-primary-foreground">
            {currentUser.name.charAt(0)}
          </span>
        ) : (
          <User className="size-5" aria-hidden="true" />
        )}
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        {currentUser ? (
          <>
            <DropdownMenuGroup>
              <DropdownMenuLabel>
                <div className="flex flex-col">
                  <span className="text-sm font-medium text-foreground">{currentUser.name}</span>
                  <span className="text-xs font-normal text-muted-foreground">{currentUser.email}</span>
                </div>
              </DropdownMenuLabel>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => router.push('/orders')}>
              <Package aria-hidden="true" /> My Orders
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => router.push('/wishlist')}>
              <Heart aria-hidden="true" /> Wishlist
            </DropdownMenuItem>
            {currentUser.role === 'admin' && (
              <DropdownMenuItem onClick={() => router.push('/admin')}>
                <LayoutDashboard aria-hidden="true" /> Admin Dashboard
              </DropdownMenuItem>
            )}
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => {
                logout()
                router.push('/')
              }}
            >
              <LogOut aria-hidden="true" /> Sign out
            </DropdownMenuItem>
          </>
        ) : (
          <>
            <DropdownMenuItem onClick={() => router.push('/login')}>
              <LogIn aria-hidden="true" /> Sign in
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => router.push('/register')}>
              <UserPlus aria-hidden="true" /> Create account
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => router.push('/admin')}>
              <LayoutDashboard aria-hidden="true" /> Admin Dashboard
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export function SiteHeader() {
  const pathname = usePathname()
  const { cartCount, wishlist } = useStore()
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <header className="sticky top-0 z-40 border-b bg-card/90 backdrop-blur supports-backdrop-filter:bg-card/75">
      <div className="bg-ink text-ink-foreground">
        <p className="mx-auto max-w-7xl px-4 py-2 text-center text-xs sm:px-6">
          Free delivery on orders above ₹999 · No-cost EMI on cards · 7-day easy returns
        </p>
      </div>

      <div className="mx-auto flex max-w-7xl items-center gap-3 px-4 py-3 sm:px-6 lg:gap-6">
        <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
          <SheetTrigger
            className="flex size-10 items-center justify-center rounded-xl hover:bg-muted lg:hidden"
            aria-label="Open menu"
          >
            <Menu className="size-5" aria-hidden="true" />
          </SheetTrigger>
          <SheetContent side="left" className="w-80">
            <SheetHeader>
              <SheetTitle>
                <span className="sr-only">Navigation</span>
                <BrandLogo />
              </SheetTitle>
            </SheetHeader>
            <nav className="flex flex-col gap-1 px-4" aria-label="Mobile">
              <Link href="/products" onClick={() => setMobileOpen(false)} className="rounded-lg px-3 py-2.5 text-sm font-medium hover:bg-muted">
                All Products
              </Link>
              {CATEGORIES.map((c) => (
                <Link
                  key={c.id}
                  href={`/products?category=${c.id}`}
                  onClick={() => setMobileOpen(false)}
                  className="rounded-lg px-3 py-2.5 text-sm font-medium hover:bg-muted"
                >
                  {c.label}
                </Link>
              ))}
              <Link
                href="/assistant"
                onClick={() => setMobileOpen(false)}
                className="flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium text-primary hover:bg-accent"
              >
                <Sparkles className="size-4" aria-hidden="true" /> AI Assistant
              </Link>
              <Link href="/orders" onClick={() => setMobileOpen(false)} className="rounded-lg px-3 py-2.5 text-sm font-medium hover:bg-muted">
                My Orders
              </Link>
              <Link href="/admin" onClick={() => setMobileOpen(false)} className="rounded-lg px-3 py-2.5 text-sm font-medium hover:bg-muted">
                Admin Dashboard
              </Link>
            </nav>
          </SheetContent>
        </Sheet>

        <BrandLogo className="shrink-0" />

        <Suspense fallback={<div className="hidden h-11 flex-1 md:block" />}>
          <SearchForm className="hidden flex-1 md:block" />
        </Suspense>

        <div className="ml-auto flex items-center gap-1">
          <Link
            href="/assistant"
            className="hidden items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium text-primary transition-colors hover:bg-accent sm:flex"
          >
            <Sparkles className="size-4" aria-hidden="true" />
            <span className="hidden xl:inline">AI Assistant</span>
            <span className="sr-only xl:hidden">AI Assistant</span>
          </Link>
          <Link
            href="/wishlist"
            className="relative flex size-10 items-center justify-center rounded-xl hover:bg-muted"
            aria-label={`Wishlist, ${wishlist.length} items`}
          >
            <Heart className="size-5" aria-hidden="true" />
            <CountBubble count={wishlist.length} />
          </Link>
          <Link
            href="/cart"
            className="relative flex size-10 items-center justify-center rounded-xl hover:bg-muted"
            aria-label={`Cart, ${cartCount} items`}
          >
            <ShoppingCart className="size-5" aria-hidden="true" />
            <CountBubble count={cartCount} />
          </Link>
          <AccountMenu />
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 pb-3 sm:px-6 md:hidden">
        <Suspense fallback={<div className="h-11" />}>
          <SearchForm />
        </Suspense>
      </div>

      <nav aria-label="Categories" className="hidden border-t lg:block">
        <ul className="mx-auto flex max-w-7xl items-center gap-1 px-6 py-1.5">
          <li>
            <Link
              href="/products"
              className={cn(
                'rounded-lg px-3 py-1.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground',
                pathname === '/products' && 'text-foreground',
              )}
            >
              All Products
            </Link>
          </li>
          {CATEGORIES.map((c) => (
            <li key={c.id}>
              <Link
                href={`/products?category=${c.id}`}
                className="rounded-lg px-3 py-1.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              >
                {c.label}
              </Link>
            </li>
          ))}
          <li className="ml-auto">
            <Link
              href="/products?sort=discount"
              className="rounded-lg px-3 py-1.5 text-sm font-semibold text-deal-foreground transition-colors hover:bg-deal/15"
            >
              Today&apos;s Deals
            </Link>
          </li>
        </ul>
      </nav>
    </header>
  )
}
