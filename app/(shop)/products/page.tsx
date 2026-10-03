import type { Metadata } from 'next'
import { Suspense } from 'react'
import { CatalogRoute } from '@/components/catalog/catalog-route'

export const metadata: Metadata = {
  title: 'Shop all products',
  description: 'Browse laptops, smartphones, headphones and accessories with filters for brand, price and rating.',
}

export default function ProductsPage() {
  return (
    <Suspense fallback={<div className="mx-auto min-h-[60vh] max-w-7xl px-4 py-10 sm:px-6" />}>
      <CatalogRoute />
    </Suspense>
  )
}
