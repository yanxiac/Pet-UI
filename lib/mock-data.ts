import { PetCategory } from '@/types/pet'

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
  },
  {
    id: 'dog-001',
    name: '狗类',
    description: '忠诚活泼的人类好友，品种多样，按体型\n与用途可细分为数十个品系。',
    imageUrl:
      'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=800&q=85',
    slug: 'dogs',
    count: 92,
  },
  {
    id: 'rabbit-001',
    name: '兔类',
    description: '温顺安静的小型宠物，毛茸茸惹人喜爱，\n适合居家安静环境饲养。',
    imageUrl:
      'https://images.unsplash.com/photo-1585110396000-c9ffd4e4b308?w=800&q=85',
    slug: 'rabbits',
    count: 25,
  },
  {
    id: 'bird-001',
    name: '鸟类',
    description: '灵动多彩的羽毛精灵，善于鸣叫学语，\n为家居空间增添勃勃生机。',
    imageUrl:
      'https://images.unsplash.com/photo-1444464666168-49d633b86797?w=800&q=85',
    slug: 'birds',
    count: 36,
  },
  {
    id: 'fish-001',
    name: '鱼类',
    description: '静谧优雅的水中精灵，品种繁多色彩斑斓，\n观赏价值极高。',
    imageUrl:
      'https://images.unsplash.com/photo-1524704796725-9fc3044a58b2?w=800&q=85',
    slug: 'fish',
    count: 60,
  },
]

/** 首页默认精选类别（猫类） */
export const defaultFeaturedCategory = mockPetCategories[0]
