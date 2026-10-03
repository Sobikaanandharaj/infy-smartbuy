import { AiPromo } from '@/components/home/ai-promo'
import { CategoryGrid } from '@/components/home/category-grid'
import { Hero } from '@/components/home/hero'
import { DealProducts, FeaturedProducts } from '@/components/home/product-rails'

export default function HomePage() {
  return (
    <div className="flex flex-col gap-16 pb-4 sm:gap-20">
      <Hero />
      <div className="pt-4">
        <CategoryGrid />
      </div>
      <FeaturedProducts />
      <DealProducts />
      <AiPromo />
    </div>
  )
}
