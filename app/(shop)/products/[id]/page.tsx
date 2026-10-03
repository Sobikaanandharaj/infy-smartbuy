import type { Metadata } from 'next'
import { ProductDetail } from '@/components/product/product-detail'
import { PRODUCTS } from '@/lib/data'

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params
  const product = PRODUCTS.find((p) => p.id === id)
  if (!product) return { title: 'Product' }
  return { title: `${product.brand} ${product.name}`, description: product.tagline }
}

export default async function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  return <ProductDetail id={id} />
}
