import { Suspense } from 'react'
import { OrderDetail } from '@/components/orders/order-detail'

export default async function OrderPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  return (
    <Suspense>
      <OrderDetail id={id} />
    </Suspense>
  )
}
