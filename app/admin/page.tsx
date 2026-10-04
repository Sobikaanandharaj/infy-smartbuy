"use client"
import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"

export default function AdminPage() {
  const [allowed, setAllowed] = useState<boolean | null>(null)
  const [debug, setDebug] = useState("")
  const [products, setProducts] = useState<any[]>([])
  const [orders, setOrders] = useState<any[]>([])

  useEffect(() => {
    const load = async () => {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        setDebug("no user session")
        return setAllowed(false)
      }
      const { data: p, error } = await supabase
        .from("profiles").select("role").eq("id", user.id).single()
       
      if (p?.role !== "admin") return setAllowed(false)
      setAllowed(true)
      const { data: prod } = await supabase.from("products").select("*")
      const { data: ord } = await supabase.from("orders").select("*")
      setProducts(prod ?? [])
      setOrders(ord ?? [])
    }
    load()
  }, [])

  if (allowed === null) return <p className="p-8">Loading...</p>
  if (!allowed) return <p className="p-8">Admin access only. {debug}</p>

  return (
    <div className="mx-auto max-w-4xl p-8">
      <h1 className="mb-6 text-3xl font-bold">Admin Dashboard</h1>
      <div className="mb-8 grid grid-cols-2 gap-4">
        <div className="rounded-xl border p-4">
          <p className="text-sm text-gray-500">Products</p>
          <p className="text-3xl font-bold">{products.length}</p>
        </div>
        <div className="rounded-xl border p-4">
          <p className="text-sm text-gray-500">Orders</p>
          <p className="text-3xl font-bold">{orders.length}</p>
        </div>
      </div>
      <h2 className="mb-2 text-xl font-semibold">Products</h2>
      <ul className="divide-y rounded-xl border">
        {products.map((x) => (
          <li key={x.id} className="flex justify-between p-3">
            <span>{x.name}</span>
            <span>₹{x.price}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}