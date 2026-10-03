'use client'

import { useSearchParams } from 'next/navigation'
import { Catalog } from '@/components/catalog/catalog'

export function CatalogRoute() {
  const params = useSearchParams()
  return <Catalog key={params.toString()} />
}
