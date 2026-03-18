import { PetCategory } from '@/types/pet'

/**
 * 品种主题渐变色映射表
 * key = 分类名称（与 Supabase name 字段一致），value = CSS linear-gradient
 * mapToPetCategory() 通过此表为 Supabase 数据注入 themeGradient
 */
/**
 * 渐变规则：特征色覆盖下半部分 65%
 *   0%–35%  : 极深暗底色（特征色 × 6%，保留色相）
 *   35%–65% : 深中间调（特征色 × 45%，渐变起步）
 *   65%–100%: 特征色全量
 *
 * 特征色（来源：设计稿截图）：
 *   犬类          #FB923C  暖橙色
 *   猫类          #A78BFA  丁香紫
 *   爬行与冷血类   #34D399  森绿色
 *   小型哺乳动物类 #F472B6  樱花粉
 *   鸟类          #38BDF8  天空蓝
 *   水族与两栖类   #22D3EE  湖水青
 */
export const CATEGORY_THEME_GRADIENTS: Record<string, string> = {
  // key 严格对应 Supabase pet_category.name 字段
  犬类:          'linear-gradient(180deg, #0F0904 0%, #0F0904 35%, #71421B 65%, #FB923C 100%)',
  猫类:          'linear-gradient(180deg, #0A080F 0%, #0A080F 35%, #4B3F71 65%, #A78BFA 100%)',
  爬行与冷血类:   'linear-gradient(180deg, #030D09 0%, #030D09 35%, #175F45 65%, #34D399 100%)',
  小型哺乳动物类: 'linear-gradient(180deg, #0F070B 0%, #0F070B 35%, #6E3352 65%, #F472B6 100%)',
  鸟类:          'linear-gradient(180deg, #030B0F 0%, #030B0F 35%, #195570 65%, #38BDF8 100%)',
  水族与两栖类:   'linear-gradient(180deg, #020D0E 0%, #020D0E 35%, #0F5F6B 65%, #22D3EE 100%)',
}

/**
 * Mock 宠物类别数据
 * 所有 imageUrl 目前使用 Unsplash 公共图片作为占位符
 * 接入 Supabase Storage 后替换为真实 URL
 */
export const mockPetCategories: PetCategory[] = [
  {
    id: 'cat-001',
    name: '猫类',
    description: '独立又迷人的室内宠物，陪伴感强，主要按\n被毛长度划分。',
    imageUrl:
      'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=800&q=85',
    slug: 'cats',
    count: 48,
    themeGradient: CATEGORY_THEME_GRADIENTS['猫类'],
  },
  {
    id: 'dog-001',
    name: '狗类',
    description: '忠诚活泼的人类好友，品种多样，按体型\n与用途可细分为数十个品系。',
    imageUrl:
      'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=800&q=85',
    slug: 'dogs',
    count: 92,
    themeGradient: CATEGORY_THEME_GRADIENTS['犬类'],
  },
  {
    id: 'reptile-001',
    name: '爬行与冷血类',
    description: '安静而充满观察乐趣的异宠伙伴，涵盖爬宠、两栖与冷血类家庭饲养方向。',
    imageUrl:
      'https://rcdbihgkbfqjipuyfibu.supabase.co/storage/v1/object/public/pet-images/reptile.png',
    slug: 'reptiles',
    count: 18,
    themeGradient: CATEGORY_THEME_GRADIENTS['爬行与冷血类'],
  },
  {
    id: 'bird-001',
    name: '鸟类',
    description: '灵动多彩的羽毛精灵，善于鸣叫学语，\n为家居空间增添勃勃生机。',
    imageUrl:
      'https://images.unsplash.com/photo-1444464666168-49d633b86797?w=800&q=85',
    slug: 'birds',
    count: 36,
    themeGradient: CATEGORY_THEME_GRADIENTS['鸟类'],
  },
  {
    id: 'fish-001',
    name: '鱼类',
    description: '静谧优雅的水中精灵，品种繁多色彩斑斓，\n观赏价值极高。',
    imageUrl:
      'https://images.unsplash.com/photo-1524704796725-9fc3044a58b2?w=800&q=85',
    slug: 'fish',
    count: 60,
    themeGradient: CATEGORY_THEME_GRADIENTS['水族与两栖类'],
  },
]

/**
 * 首页分类顺序微调：
 * 仅交换指定两个分类的位置，其余分类保持原有相对顺序不变。
 */
export function swapPetCategoryOrder(
  categories: PetCategory[],
  firstName: string,
  secondName: string
): PetCategory[] {
  const firstIndex = categories.findIndex((category) => category.name === firstName)
  const secondIndex = categories.findIndex((category) => category.name === secondName)

  if (firstIndex === -1 || secondIndex === -1 || firstIndex === secondIndex) {
    return categories
  }

  const nextCategories = [...categories]
  ;[nextCategories[firstIndex], nextCategories[secondIndex]] = [
    nextCategories[secondIndex],
    nextCategories[firstIndex],
  ]

  return nextCategories
}

/** 首页默认精选类别（猫类） */
export const defaultFeaturedCategory = mockPetCategories[0]
