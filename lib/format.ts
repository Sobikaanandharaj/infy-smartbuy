const inr = new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 })

export function formatPrice(value: number) {
  return inr.format(value)
}

export function discountPercent(price: number, originalPrice: number) {
  if (originalPrice <= price) return 0
  return Math.round(((originalPrice - price) / originalPrice) * 100)
}

export function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
}

export function calcTotals(subtotal: number) {
  const shipping = subtotal === 0 || subtotal >= 999 ? 0 : 99
  const tax = Math.round(subtotal * 0.18)
  return { subtotal, shipping, tax, total: subtotal + shipping + tax }
}
