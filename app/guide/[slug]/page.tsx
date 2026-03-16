import { notFound } from 'next/navigation'
import PetGuideHome from '@/components/PetGuideHome'
import { fetchPetCategoryItems, mapToPetCategory } from '@/lib/supabase'
import { mockPetCategories } from '@/lib/mock-data'

interface GuidePageProps {
  params: Promise<{ slug: string }>
}

/**
 * 宠物指南首页路由
 * 根据 slug 匹配对应宠物大类，渲染 Pet Guide Home 界面（对应设计稿 RxYNc 节点）
 */
export default async function GuidePage({ params }: GuidePageProps) {
  const { slug } = await params

  const items = await fetchPetCategoryItems().catch(() => [])
  const categories =
    items.length > 0 ? items.map(mapToPetCategory) : mockPetCategories

  const category = categories.find((c) => c.slug === slug)

  if (!category) return notFound()

  return (
    <main className="min-h-screen flex items-center justify-center">
      <PetGuideHome category={category} />
    </main>
  )
}
