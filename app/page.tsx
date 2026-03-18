import PetEncyclopediaHome from '@/components/PetEncyclopediaHome'
import SplashContainer from '@/components/SplashContainer'
import { mockPetCategories } from '@/lib/mock-data'
import {
  fetchPetCategoryItems,
  fetchSplashGridImages,
  getFallbackSplashGridImages,
  mapToPetCategory,
} from '@/lib/supabase'

/**
 * 演示页面：启动页 → 首页切换
 *
 * 数据优先级：Supabase pet_category 全量数据 → Mock 数据兜底
 * 启动时展示 SplashScreen，点击「立即探索」后首页从下往上滑入
 */
export default async function HomePage() {
  const [items, splashGridImages] = await Promise.all([
    fetchPetCategoryItems().catch(() => []),
    fetchSplashGridImages().catch(() => []),
  ])
  const categories =
    items.length > 0 ? items.map(mapToPetCategory) : mockPetCategories
  const splashImages =
    splashGridImages.length > 0 ? splashGridImages : getFallbackSplashGridImages()

  return (
    <main className="min-h-screen">
      <SplashContainer splashGridImages={splashImages}>
        <PetEncyclopediaHome
          categories={categories}
          activeTab="home"
        />
      </SplashContainer>
    </main>
  )
}
