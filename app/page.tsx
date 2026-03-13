import PetEncyclopediaHome from '@/components/PetEncyclopediaHome'
import { defaultFeaturedCategory } from '@/lib/mock-data'
import { fetchPetCategoryItems, mapToPetCategory } from '@/lib/supabase'

/**
 * 演示页面：在居中容器中渲染 PetEncyclopediaHome 组件
 * 模拟手机画面，方便在桌面浏览器中预览
 *
 * 数据优先级：Supabase pet_category 表第一条 → Mock 数据兜底
 */
export default async function HomePage() {
  const items = await fetchPetCategoryItems()
  const featuredCategory =
    items.length > 0 ? mapToPetCategory(items[0]) : defaultFeaturedCategory

  return (
    <main className="min-h-screen bg-[#060610] flex items-center justify-center p-8">
      {/* 手机模拟外框 */}
      <div className="relative">
        {/* 模拟手机外壳阴影 */}
        <div className="absolute -inset-3 rounded-[52px] bg-[#1A1530] shadow-[0_0_80px_#7340D840]" />
        <div className="relative rounded-[44px] overflow-hidden shadow-2xl ring-1 ring-white/10">
          <PetEncyclopediaHome
            featuredCategory={featuredCategory}
            activeTab="home"
          />
        </div>
      </div>
    </main>
  )
}
