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
  } catch (e) {
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

// ─── 辅助函数 ─────────────────────────────────────────────────────────────────

/**
 * 从 Supabase Storage 生成宠物类别大图的公共 URL
 * @param path  Storage 桶内路径，例如 "categories/cats.jpg"
 */
export function getPetImageUrl(path: string): string {
  const { data } = supabase.storage.from('pet-images').getPublicUrl(path)
  return data.publicUrl
}
