"use client"
import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"

export default function ProfilePage() {
  const [profile, setProfile] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        const { data } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", user.id)
          .single()
        setProfile(data ?? { email: user.email })
      }
      setLoading(false)
    }
    load()
  }, [])

  if (loading) return <p className="p-8">Loading...</p>
  if (!profile) return <p className="p-8">Please login first.</p>

  return (
    <div className="mx-auto max-w-md p-8">
      <h1 className="mb-4 text-2xl font-bold">My Profile</h1>
      <p><b>Name:</b> {profile.full_name ?? "Not set"}</p>
      <p><b>Email:</b> {profile.email}</p>
      <p><b>Role:</b> {profile.role ?? "customer"}</p>
    </div>
  )
}