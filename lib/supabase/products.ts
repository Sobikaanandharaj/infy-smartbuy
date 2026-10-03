import { createClient } from './client'

export async function getProducts() {
  const supabase = createClient()

  const { data, error } = await supabase
    .from('products')
    .select('*')
    .order('name')

  if (error) {
    console.error('Error fetching products:', error)
    return []
  }

  return data
}
