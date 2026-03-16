import PetEncyclopediaHome from '@/components/PetEncyclopediaHome'
import { mockPetCategories } from '@/lib/mock-data'
import { fetchPetCategoryItems, mapToPetCategory } from '@/lib/supabase'

/**
 * 演示页面：在居中容器中渲染 PetEncyclopediaHome 组件
 * 模拟手机画面，方便在桌面浏览器中预览
 *
 * 数据优先级：Supabase pet_category 全量数据 → Mock 数据兜底
 */
export default async function HomePage() {
  const items = await fetchPetCategoryItems().catch(() => [])
  const categories =
    items.length > 0 ? items.map(mapToPetCategory) : mockPetCategories

  return (
    <main className="min-h-screen flex items-center justify-center">
      <PetEncyclopediaHome
        categories={categories}
        activeTab="home"
      />
    </main>
  )
}
