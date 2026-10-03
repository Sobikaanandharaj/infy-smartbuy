'use client'

import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { useState } from 'react'
import { Eye, EyeOff, Loader2, ShieldCheck, UserRound } from 'lucide-react'
import { toast } from 'sonner'
import { BrandLogo } from '@/components/brand-logo'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useStore } from '@/lib/store'

const DEMO_ACCOUNTS = [
  { label: 'Customer', email: 'user@infy.com', password: 'user123', icon: UserRound },
  { label: 'Admin', email: 'admin@infy.com', password: 'admin123', icon: ShieldCheck },
]

export function AuthForm({ mode }: { mode: 'login' | 'register' }) {
  const router = useRouter()
  const params = useSearchParams()
  const next = params.get('next')
  const safeNext = next && next.startsWith('/') && !next.startsWith('//') ? next : null
  const { login, register } = useStore()

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const isLogin = mode === 'login'

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    if (!isLogin && name.trim().length < 2) return setError('Please enter your name.')
    if (!/^\S+@\S+\.\S+$/.test(email)) return setError('Please enter a valid email address.')
    if (password.length < 6) return setError('Password must be at least 6 characters.')

    setLoading(true)
    await new Promise((r) => setTimeout(r, 500))
    const result = isLogin ? login(email, password) : register(name, email, password)
    setLoading(false)
    if (!result.ok) return setError(result.error)

    toast.success(isLogin ? `Welcome back, ${result.user.name.split(' ')[0]}!` : 'Account created successfully')
    router.push(safeNext ?? (result.user.role === 'admin' ? '/admin' : '/'))
  }

  const altHref = `${isLogin ? '/register' : '/login'}${safeNext ? `?next=${encodeURIComponent(safeNext)}` : ''}`

  return (
    <div className="flex min-h-[calc(100vh-12rem)] items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="mb-8 flex flex-col items-center text-center">
          <BrandLogo />
          <h1 className="mt-6 text-2xl font-semibold tracking-tight">{isLogin ? 'Welcome back' : 'Create your account'}</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {isLogin ? 'Sign in to track orders and checkout faster.' : 'Join SmartBuy for exclusive deals and faster checkout.'}
          </p>
        </div>

        <form onSubmit={submit} noValidate className="flex flex-col gap-4 rounded-2xl border bg-card p-6 shadow-sm">
          {!isLogin && (
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="name">Full name</Label>
              <Input id="name" value={name} onChange={(e) => setName(e.target.value)} autoComplete="name" className="h-11 rounded-xl" />
            </div>
          )}
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              placeholder="you@example.com"
              className="h-11 rounded-xl"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete={isLogin ? 'current-password' : 'new-password'}
                className="h-11 rounded-xl pr-11"
              />
              <button
                type="button"
                onClick={() => setShowPassword((s) => !s)}
                className="absolute right-1 top-1/2 flex size-9 -translate-y-1/2 items-center justify-center rounded-lg text-muted-foreground hover:bg-muted"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff className="size-4" aria-hidden="true" /> : <Eye className="size-4" aria-hidden="true" />}
              </button>
            </div>
          </div>

          {error && (
            <p role="alert" className="rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive">
              {error}
            </p>
          )}

          <Button type="submit" size="lg" disabled={loading} className="mt-1 h-11 rounded-xl">
            {loading && <Loader2 className="animate-spin" aria-hidden="true" />}
            {isLogin ? 'Sign in' : 'Create account'}
          </Button>

          <p className="text-center text-sm text-muted-foreground">
            {isLogin ? 'New to SmartBuy?' : 'Already have an account?'}{' '}
            <Link href={altHref} className="font-medium text-primary hover:underline">
              {isLogin ? 'Create an account' : 'Sign in'}
            </Link>
          </p>
        </form>

        {isLogin && (
          <div className="mt-6 rounded-2xl border border-dashed bg-card/50 p-4">
            <p className="mb-3 text-center text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Demo accounts
            </p>
            <div className="grid grid-cols-2 gap-2">
              {DEMO_ACCOUNTS.map((a) => (
                <button
                  key={a.label}
                  type="button"
                  onClick={() => {
                    setEmail(a.email)
                    setPassword(a.password)
                    setError('')
                  }}
                  className="flex items-center gap-2 rounded-xl border bg-card p-3 text-left transition-colors hover:border-primary/40"
                >
                  <a.icon className="size-4 shrink-0 text-primary" aria-hidden="true" />
                  <span className="min-w-0">
                    <span className="block text-sm font-semibold">{a.label}</span>
                    <span className="block truncate text-xs text-muted-foreground">{a.email}</span>
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
