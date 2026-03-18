import { createClient } from '@supabase/supabase-js'
import type { PetCategory } from '@/types/pet'
import { CATEGORY_THEME_GRADIENTS } from '@/lib/mock-data'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    'Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY in .env.local'
  )
}

/**
 * 浏览器 / 客户端组件通用 Supabase 客户端
 * 在 'use client' 组件中直接引入即可使用
 */
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// ─── pet_category 表类型（与数据库字段一一对应）────────────────────────────────

export type PetCategoryItem = {
  id: string
  name: string
  description: string | null
  category: string | null
  image_url: string | null
  created_at: string
}

// ─── 查询函数 ─────────────────────────────────────────────────────────────────

/**
 * 获取 pet_category 表中所有记录（按创建时间倒序）
 * 网络不通或 Supabase 不可用时静默返回 []，由调用方降级为 mock 数据
 */
export async function fetchPetCategoryItems(): Promise<PetCategoryItem[]> {
  try {
    const { data, error } = await supabase
      .from('pet_category')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      console.warn('[Supabase] fetchPetCategoryItems:', error.message)
      return []
    }

    return data ?? []
  } catch {
    console.warn('[Supabase] fetchPetCategoryItems: unreachable, using mock data')
    return []
  }
}

// ─── 数据映射 ─────────────────────────────────────────────────────────────────

/**
 * 将 Supabase DB 行映射为前端 PetCategory 接口
 */
export function mapToPetCategory(row: PetCategoryItem): PetCategory {
  return {
    id: row.id,
    name: row.name,
    description: row.description ?? '',
    imageUrl: row.image_url ?? '',
    slug: row.category?.toLowerCase().replace(/\s+/g, '-') ?? row.id,
    count: 0,
    themeGradient: CATEGORY_THEME_GRADIENTS[row.name],
  }
}

// ─── parenting_guide 表类型 ───────────────────────────────────────────────────

export type ParentingGuideItem = {
  id: string
  name: string
  description: string | null
  category: string | null
  image_url: string | null
  created_at: string
}

/**
 * 获取 parenting_guide 表中所有记录（按创建时间升序）
 */
export async function fetchParentingGuideItems(): Promise<ParentingGuideItem[]> {
  try {
    const { data, error } = await supabase
      .from('parenting_guide')
      .select('*')
      .order('created_at', { ascending: true })

    if (error) {
      console.warn('[Supabase] fetchParentingGuideItems:', error.message)
      return []
    }

    return data ?? []
  } catch {
    console.warn('[Supabase] fetchParentingGuideItems: unreachable')
    return []
  }
}

// ─── splash_grid_images 表类型 ────────────────────────────────────────────────

export type SplashGridImageItem = {
  id: string
  title: string
  image_url: string
  display_order: number
  created_at: string
}

/**
 * 获取启动页图片网格数据（按 display_order 升序）
 */
export async function fetchSplashGridImages(): Promise<SplashGridImageItem[]> {
  try {
    const { data, error } = await supabase
      .from('splash_grid_images')
      .select('*')
      .order('display_order', { ascending: true })

    if (error) {
      if (error.code === 'PGRST205') {
        return []
      }
      console.warn('[Supabase] fetchSplashGridImages:', error.message)
      return []
    }

    return data ?? []
  } catch {
    console.warn('[Supabase] fetchSplashGridImages: unreachable')
    return []
  }
}

const FALLBACK_SPLASH_GRID_IMAGES: SplashGridImageItem[] = [
  {
    id: 'splash-cat-1',
    title: '猫类',
    image_url:
      'https://rcdbihgkbfqjipuyfibu.supabase.co/storage/v1/object/public/pet-images/cat.png',
    display_order: 1,
    created_at: '',
  },
  {
    id: 'splash-dog-1',
    title: '犬类',
    image_url:
      'https://rcdbihgkbfqjipuyfibu.supabase.co/storage/v1/object/public/pet-images/dog.png',
    display_order: 2,
    created_at: '',
  },
  {
    id: 'splash-bird-1',
    title: '鸟类',
    image_url:
      'https://rcdbihgkbfqjipuyfibu.supabase.co/storage/v1/object/public/pet-images/bird.png',
    display_order: 3,
    created_at: '',
  },
  {
    id: 'splash-fish-1',
    title: '水族与两栖类',
    image_url:
      'https://rcdbihgkbfqjipuyfibu.supabase.co/storage/v1/object/public/pet-images/fish.png',
    display_order: 4,
    created_at: '',
  },
  {
    id: 'splash-reptile-1',
    title: '爬行与冷血类',
    image_url:
      'https://rcdbihgkbfqjipuyfibu.supabase.co/storage/v1/object/public/pet-images/reptile.png',
    display_order: 5,
    created_at: '',
  },
  {
    id: 'splash-cat-2',
    title: '猫类',
    image_url:
      'https://rcdbihgkbfqjipuyfibu.supabase.co/storage/v1/object/public/pet-images/cat.png',
    display_order: 6,
    created_at: '',
  },
  {
    id: 'splash-dog-2',
    title: '犬类',
    image_url:
      'https://rcdbihgkbfqjipuyfibu.supabase.co/storage/v1/object/public/pet-images/dog.png',
    display_order: 7,
    created_at: '',
  },
  {
    id: 'splash-bird-2',
    title: '鸟类',
    image_url:
      'https://rcdbihgkbfqjipuyfibu.supabase.co/storage/v1/object/public/pet-images/bird.png',
    display_order: 8,
    created_at: '',
  },
  {
    id: 'splash-fish-2',
    title: '水族与两栖类',
    image_url:
      'https://rcdbihgkbfqjipuyfibu.supabase.co/storage/v1/object/public/pet-images/fish.png',
    display_order: 9,
    created_at: '',
  },
]

export function getFallbackSplashGridImages(): SplashGridImageItem[] {
  return FALLBACK_SPLASH_GRID_IMAGES
}

// ─── 辅助函数 ─────────────────────────────────────────────────────────────────

/**
 * 从 Supabase Storage 生成宠物类别大图的公共 URL
 * @param path  Storage 桶内路径，例如 "categories/cats.jpg"
 */
export function getPetImageUrl(path: string): string {
  const { data } = supabase.storage.from('pet-images').getPublicUrl(path)
  return data.publicUrl
}
