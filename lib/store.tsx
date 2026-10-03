'use client'

import { createContext, useCallback, useContext, useMemo, useState } from 'react'
import {
  PRODUCTS,
  SEED_ORDERS,
  SEED_USERS,
  type Address,
  type Order,
  type OrderStatus,
  type Product,
  type User,
} from '@/lib/data'
import { calcTotals } from '@/lib/format'

export type CartLine = { productId: string; quantity: number }
export type CartItem = CartLine & { product: Product }

type AuthResult = { ok: true; user: User } | { ok: false; error: string }

type StoreValue = {
  products: Product[]
  users: User[]
  orders: Order[]
  currentUser: User | null
  cart: CartItem[]
  cartCount: number
  cartSubtotal: number
  wishlist: string[]
  login: (email: string, password: string) => AuthResult
  register: (name: string, email: string, password: string) => AuthResult
  logout: () => void
  addToCart: (productId: string, quantity?: number) => boolean
  setQuantity: (productId: string, quantity: number) => void
  removeFromCart: (productId: string) => void
  clearCart: () => void
  toggleWishlist: (productId: string) => boolean
  placeOrder: (address: Address, paymentMethod: string) => Order | null
  updateOrderStatus: (orderId: string, status: OrderStatus) => void
  saveProduct: (product: Product) => void
  deleteProduct: (productId: string) => void
  updateUser: (userId: string, patch: Partial<Pick<User, 'role' | 'active'>>) => void
}

const StoreContext = createContext<StoreValue | null>(null)

const MAX_QTY_PER_ITEM = 10

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [products, setProducts] = useState<Product[]>(PRODUCTS)
  const [users, setUsers] = useState<User[]>(SEED_USERS)
  const [orders, setOrders] = useState<Order[]>(SEED_ORDERS)
  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const [cartLines, setCartLines] = useState<CartLine[]>([])
  const [wishlist, setWishlist] = useState<string[]>([])

  const cart = useMemo<CartItem[]>(
    () =>
      cartLines.flatMap((line) => {
        const product = products.find((p) => p.id === line.productId)
        return product ? [{ ...line, product }] : []
      }),
    [cartLines, products],
  )

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0)
  const cartSubtotal = cart.reduce((sum, item) => sum + item.quantity * item.product.price, 0)

  const login = useCallback(
    (email: string, password: string): AuthResult => {
      const user = users.find((u) => u.email.toLowerCase() === email.trim().toLowerCase())
      if (!user || user.password !== password) return { ok: false, error: 'Invalid email or password.' }
      if (!user.active) return { ok: false, error: 'This account has been deactivated.' }
      setCurrentUser(user)
      return { ok: true, user }
    },
    [users],
  )

  const register = useCallback(
    (name: string, email: string, password: string): AuthResult => {
      const normalized = email.trim().toLowerCase()
      if (users.some((u) => u.email.toLowerCase() === normalized)) {
        return { ok: false, error: 'An account with this email already exists.' }
      }
      const user: User = {
        id: `u${Date.now()}`,
        name: name.trim(),
        email: normalized,
        password,
        role: 'customer',
        joinedAt: new Date().toISOString().slice(0, 10),
        active: true,
      }
      setUsers((prev) => [...prev, user])
      setCurrentUser(user)
      return { ok: true, user }
    },
    [users],
  )

  const logout = useCallback(() => setCurrentUser(null), [])

  const addToCart = useCallback(
    (productId: string, quantity = 1) => {
      const product = products.find((p) => p.id === productId)
      if (!product || product.stock <= 0) return false
      setCartLines((prev) => {
        const existing = prev.find((l) => l.productId === productId)
        const limit = Math.min(product.stock, MAX_QTY_PER_ITEM)
        if (existing) {
          return prev.map((l) =>
            l.productId === productId ? { ...l, quantity: Math.min(limit, l.quantity + quantity) } : l,
          )
        }
        return [...prev, { productId, quantity: Math.min(limit, quantity) }]
      })
      return true
    },
    [products],
  )

  const setQuantity = useCallback(
    (productId: string, quantity: number) => {
      const product = products.find((p) => p.id === productId)
      if (!product) return
      const limit = Math.min(product.stock, MAX_QTY_PER_ITEM)
      const next = Math.max(1, Math.min(limit, Math.floor(quantity)))
      setCartLines((prev) => prev.map((l) => (l.productId === productId ? { ...l, quantity: next } : l)))
    },
    [products],
  )

  const removeFromCart = useCallback((productId: string) => {
    setCartLines((prev) => prev.filter((l) => l.productId !== productId))
  }, [])

  const clearCart = useCallback(() => setCartLines([]), [])

  const toggleWishlist = useCallback(
    (productId: string) => {
      const added = !wishlist.includes(productId)
      setWishlist((prev) => (added ? [...prev, productId] : prev.filter((id) => id !== productId)))
      return added
    },
    [wishlist],
  )

  const placeOrder = useCallback(
    (address: Address, paymentMethod: string): Order | null => {
      if (!currentUser || cart.length === 0) return null
      const totals = calcTotals(cartSubtotal)
      const order: Order = {
        id: `SB-${10443 + orders.length - SEED_ORDERS.length}`,
        userEmail: currentUser.email,
        customerName: currentUser.name,
        items: cart.map((item) => ({
          productId: item.productId,
          name: `${item.product.brand} ${item.product.name}`,
          image: item.product.image,
          price: item.product.price,
          quantity: item.quantity,
        })),
        ...totals,
        status: 'Confirmed',
        paymentMethod,
        address,
        createdAt: new Date().toISOString(),
      }
      setOrders((prev) => [order, ...prev])
      setProducts((prev) =>
        prev.map((p) => {
          const line = cart.find((c) => c.productId === p.id)
          return line ? { ...p, stock: Math.max(0, p.stock - line.quantity) } : p
        }),
      )
      setCartLines([])
      return order
    },
    [cart, cartSubtotal, currentUser, orders.length],
  )

  const updateOrderStatus = useCallback((orderId: string, status: OrderStatus) => {
    setOrders((prev) => prev.map((o) => (o.id === orderId ? { ...o, status } : o)))
  }, [])

  const saveProduct = useCallback((product: Product) => {
    setProducts((prev) =>
      prev.some((p) => p.id === product.id)
        ? prev.map((p) => (p.id === product.id ? product : p))
        : [product, ...prev],
    )
  }, [])

  const deleteProduct = useCallback((productId: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== productId))
    setCartLines((prev) => prev.filter((l) => l.productId !== productId))
    setWishlist((prev) => prev.filter((id) => id !== productId))
  }, [])

  const updateUser = useCallback((userId: string, patch: Partial<Pick<User, 'role' | 'active'>>) => {
    setUsers((prev) => prev.map((u) => (u.id === userId ? { ...u, ...patch } : u)))
    setCurrentUser((prev) => (prev && prev.id === userId ? { ...prev, ...patch } : prev))
  }, [])

  const value: StoreValue = {
    products,
    users,
    orders,
    currentUser,
    cart,
    cartCount,
    cartSubtotal,
    wishlist,
    login,
    register,
    logout,
    addToCart,
    setQuantity,
    removeFromCart,
    clearCart,
    toggleWishlist,
    placeOrder,
    updateOrderStatus,
    saveProduct,
    deleteProduct,
    updateUser,
  }

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>
}

export function useStore() {
  const ctx = useContext(StoreContext)
  if (!ctx) throw new Error('useStore must be used within StoreProvider')
  return ctx
}
