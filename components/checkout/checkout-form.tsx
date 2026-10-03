'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { Banknote, CreditCard, Landmark, Loader2, Lock, LogIn, ShoppingBag, Smartphone } from 'lucide-react'
import { toast } from 'sonner'
import { Button, buttonVariants } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { EmptyState } from '@/components/cart/cart-view'
import { OrderSummary } from '@/components/cart/order-summary'
import type { Address } from '@/lib/data'
import { formatPrice } from '@/lib/format'
import { useStore } from '@/lib/store'
import { cn } from '@/lib/utils'

const PAYMENT_METHODS = [
  { id: 'UPI', label: 'UPI', description: 'Google Pay, PhonePe, Paytm', icon: Smartphone },
  { id: 'Card', label: 'Credit / Debit card', description: 'Visa, Mastercard, RuPay', icon: CreditCard },
  { id: 'Net Banking', label: 'Net banking', description: 'All major banks', icon: Landmark },
  { id: 'Cash on Delivery', label: 'Cash on delivery', description: 'Pay when it arrives', icon: Banknote },
]

type FieldErrors = Partial<Record<keyof Address, string>>

function validate(a: Address): FieldErrors {
  const errors: FieldErrors = {}
  if (a.fullName.trim().length < 2) errors.fullName = 'Enter your full name'
  if (!/^[6-9]\d{9}$/.test(a.phone)) errors.phone = 'Enter a valid 10-digit mobile number'
  if (a.line1.trim().length < 5) errors.line1 = 'Enter your house / street address'
  if (a.city.trim().length < 2) errors.city = 'Enter your city'
  if (a.state.trim().length < 2) errors.state = 'Enter your state'
  if (!/^\d{6}$/.test(a.pincode)) errors.pincode = 'Enter a valid 6-digit PIN code'
  return errors
}

function Field({
  id,
  label,
  error,
  className,
  ...props
}: React.ComponentProps<typeof Input> & { id: keyof Address; label: string; error?: string }) {
  return (
    <div className={cn('flex flex-col gap-1.5', className)}>
      <Label htmlFor={id}>{label}</Label>
      <Input
        id={id}
        name={id}
        aria-invalid={!!error}
        aria-describedby={error ? `${id}-error` : undefined}
        className="h-11 rounded-xl"
        {...props}
      />
      {error && (
        <p id={`${id}-error`} className="text-xs text-destructive">
          {error}
        </p>
      )}
    </div>
  )
}

export function CheckoutForm() {
  const router = useRouter()
  const { cart, cartSubtotal, currentUser, placeOrder } = useStore()
  const [address, setAddress] = useState<Address>({
    fullName: currentUser?.name ?? '',
    phone: '',
    line1: '',
    line2: '',
    city: '',
    state: '',
    pincode: '',
  })
  const [payment, setPayment] = useState(PAYMENT_METHODS[0].id)
  const [errors, setErrors] = useState<FieldErrors>({})
  const [processing, setProcessing] = useState(false)

  if (!currentUser) {
    return (
      <div className="mx-auto flex max-w-md flex-col items-center px-4 py-24 text-center">
        <span className="flex size-16 items-center justify-center rounded-2xl bg-accent">
          <LogIn className="size-7 text-accent-foreground" aria-hidden="true" />
        </span>
        <h1 className="mt-5 text-2xl font-semibold tracking-tight">Sign in to checkout</h1>
        <p className="mt-2 text-muted-foreground">Your cart is saved. Sign in or create an account to place your order.</p>
        <div className="mt-6 flex gap-3">
          <Link href="/login?next=/checkout" className={cn(buttonVariants({ size: 'lg' }), 'h-11 rounded-xl px-5')}>
            Sign in
          </Link>
          <Link
            href="/register?next=/checkout"
            className={cn(buttonVariants({ variant: 'outline', size: 'lg' }), 'h-11 rounded-xl px-5')}
          >
            Create account
          </Link>
        </div>
      </div>
    )
  }

  if (cart.length === 0 && !processing) {
    return <EmptyState icon={ShoppingBag} title="Nothing to checkout" text="Add a few products to your cart first." />
  }

  const update = (key: keyof Address) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = key === 'phone' || key === 'pincode' ? e.target.value.replace(/\D/g, '') : e.target.value
    setAddress((a) => ({ ...a, [key]: value }))
    if (errors[key]) setErrors((err) => ({ ...err, [key]: undefined }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const found = validate(address)
    setErrors(found)
    if (Object.keys(found).length > 0) {
      toast.error('Please fix the highlighted fields')
      return
    }
    setProcessing(true)
    await new Promise((r) => setTimeout(r, 1400))
    const order = placeOrder(address, payment)
    if (!order) {
      setProcessing(false)
      toast.error('Some items are no longer available. Please review your cart.')
      return
    }
    router.push(`/orders/${order.id}?placed=1`)
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:py-10">
      <h1 className="text-3xl font-semibold tracking-tight">Checkout</h1>
      <div className="mt-8 grid gap-8 lg:grid-cols-3">
        <div className="flex flex-col gap-6 lg:col-span-2">
          <section aria-labelledby="address-heading" className="rounded-2xl border bg-card p-5 sm:p-6">
            <h2 id="address-heading" className="flex items-center gap-2 text-lg font-semibold">
              <span className="flex size-6 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground">1</span>
              Delivery address
            </h2>
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <Field id="fullName" label="Full name" value={address.fullName} onChange={update('fullName')} error={errors.fullName} autoComplete="name" />
              <Field id="phone" label="Mobile number" value={address.phone} onChange={update('phone')} error={errors.phone} inputMode="tel" maxLength={10} autoComplete="tel-national" />
              <Field id="line1" label="House no., building, street" value={address.line1} onChange={update('line1')} error={errors.line1} className="sm:col-span-2" autoComplete="address-line1" />
              <Field id="line2" label="Landmark (optional)" value={address.line2} onChange={update('line2')} className="sm:col-span-2" autoComplete="address-line2" />
              <Field id="city" label="City" value={address.city} onChange={update('city')} error={errors.city} autoComplete="address-level2" />
              <Field id="state" label="State" value={address.state} onChange={update('state')} error={errors.state} autoComplete="address-level1" />
              <Field id="pincode" label="PIN code" value={address.pincode} onChange={update('pincode')} error={errors.pincode} inputMode="numeric" maxLength={6} autoComplete="postal-code" />
            </div>
          </section>

          <section aria-labelledby="payment-heading" className="rounded-2xl border bg-card p-5 sm:p-6">
            <h2 id="payment-heading" className="flex items-center gap-2 text-lg font-semibold">
              <span className="flex size-6 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground">2</span>
              Payment method
            </h2>
            <fieldset className="mt-5 grid gap-3 sm:grid-cols-2">
              <legend className="sr-only">Choose a payment method</legend>
              {PAYMENT_METHODS.map((m) => (
                <label
                  key={m.id}
                  className={cn(
                    'flex cursor-pointer items-center gap-3 rounded-xl border p-4 transition-colors has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-ring',
                    payment === m.id ? 'border-primary bg-accent' : 'hover:border-foreground/30',
                  )}
                >
                  <input
                    type="radio"
                    name="payment"
                    value={m.id}
                    checked={payment === m.id}
                    onChange={() => setPayment(m.id)}
                    className="sr-only"
                  />
                  <span
                    className={cn(
                      'flex size-10 shrink-0 items-center justify-center rounded-lg',
                      payment === m.id ? 'bg-primary text-primary-foreground' : 'bg-muted text-foreground',
                    )}
                  >
                    <m.icon className="size-5" aria-hidden="true" />
                  </span>
                  <span className="flex flex-col">
                    <span className="text-sm font-semibold">{m.label}</span>
                    <span className="text-xs text-muted-foreground">{m.description}</span>
                  </span>
                </label>
              ))}
            </fieldset>
            <p className="mt-4 flex items-center gap-2 text-xs text-muted-foreground">
              <Lock className="size-3.5" aria-hidden="true" /> This is a demo store — no real payment will be charged.
            </p>
          </section>
        </div>

        <div className="flex flex-col gap-4">
          <section aria-label="Items" className="rounded-2xl border bg-card p-5">
            <h2 className="text-lg font-semibold">Items ({cart.length})</h2>
            <ul className="mt-4 flex flex-col gap-3">
              {cart.map(({ product, quantity }) => (
                <li key={product.id} className="flex items-center gap-3">
                  <div className="relative size-14 shrink-0 overflow-hidden rounded-lg bg-muted">
                    <Image src={product.image || '/placeholder.svg'} alt="" fill sizes="56px" className="object-cover" />
                    <span className="absolute right-0.5 top-0.5 flex size-5 items-center justify-center rounded-full bg-ink text-[10px] font-semibold text-ink-foreground">
                      {quantity}
                    </span>
                  </div>
                  <p className="line-clamp-2 flex-1 text-sm font-medium">{product.name}</p>
                  <p className="text-sm font-semibold">{formatPrice(product.price * quantity)}</p>
                </li>
              ))}
            </ul>
          </section>
          <OrderSummary subtotal={cartSubtotal}>
            <Button type="submit" size="lg" disabled={processing} className="mt-5 h-12 w-full rounded-xl">
              {processing ? (
                <>
                  <Loader2 className="animate-spin" aria-hidden="true" /> Processing payment...
                </>
              ) : (
                <>
                  <Lock aria-hidden="true" /> Place order
                </>
              )}
            </Button>
          </OrderSummary>
        </div>
      </div>
    </form>
  )
}
