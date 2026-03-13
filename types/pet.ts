/** 单个宠物类别（对应 Supabase pet_categories 表结构） */
export interface PetCategory {
  id: string
  name: string
  /** 简短描述文案，展示在 Hero 区底部 */
  description: string
  /** 宠物大图 URL，后续从 Supabase Storage 取值 */
  imageUrl: string
  /** URL slug，用于页面路由 */
  slug: string
  /** 品种数量 */
  count?: number
}

/** PetEncyclopediaHome 组件 Props */
export interface PetEncyclopediaHomeProps {
  /** 当前 Hero 区展示的精选类别；未传则使用默认 Mock 数据 */
  featuredCategory?: PetCategory
  /** 用户头像 URL；未传则显示默认占位图标 */
  userAvatarUrl?: string
  /** 当前激活的底部 Tab */
  activeTab?: 'home' | 'mine'
  /** Tab 切换回调，父组件可在此处理路由跳转 */
  onTabChange?: (tab: 'home' | 'mine') => void
  /** 搜索输入回调 */
  onSearch?: (query: string) => void
  /** 点击某个类别卡片的回调（为后续扩展类别列表预留） */
  onCategorySelect?: (category: PetCategory) => void
}
