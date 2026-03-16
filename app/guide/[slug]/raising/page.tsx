import { notFound } from 'next/navigation'
import RaisingGuideCarousel from '@/components/RaisingGuideCarousel'
import { fetchPetCategoryItems, mapToPetCategory } from '@/lib/supabase'
import { mockPetCategories } from '@/lib/mock-data'

interface RaisingPageProps {
  params: Promise<{ slug: string }>
}

export default async function RaisingGuidePage({ params }: RaisingPageProps) {
  const { slug } = await params

  const items = await fetchPetCategoryItems().catch(() => [])
  const categories =
    items.length > 0 ? items.map(mapToPetCategory) : mockPetCategories

  const category = categories.find((c) => c.slug === slug)
  if (!category) return notFound()

  const background =
    category.themeGradient ??
    'linear-gradient(180deg, #0A0816 0%, #2D1163 35%, #5C2099 70%, #7230B8 100%)'

  return (
    <main className="min-h-screen flex items-center justify-center">
      <RaisingGuideCarousel background={background} />
    </main>
  )
}
