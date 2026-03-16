'use client'

import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Home, User } from 'lucide-react'
import { PetCategory } from '@/types/pet'

/** Pet Guide Home 四张功能卡片（固定内容，与具体宠物无关） */
const GUIDE_CARDS = [
  {
    id: 'selection',
    title: '选宠指南',
    subtitle: '科学匹配，帮你找到最契合生活方式的专属伴侣。',
    imageUrl:
      'https://images.unsplash.com/photo-1577611612381-e4fb6f980ab7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w4NDM0ODN8MHwxfHJhbmRvbXx8fHx8fHx8fDE3NzM2NjE0OTV8&ixlib=rb-4.1.0&q=80&w=400',
    cardBg: '#FFFFFF18',
    cardBorder: '#FFFFFF30',
  },
  {
    id: 'raising',
    title: '养育指南',
    subtitle: '从新手到专家，涵盖饮食、医疗与行为训练的科学攻略。',
    imageUrl:
      'https://images.unsplash.com/photo-1552493512-cda1df4e3b62?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w4NDM0ODN8MHwxfHJhbmRvbXx8fHx8fHx8fDE3NzM2NjE1MDJ8&ixlib=rb-4.1.0&q=80&w=400',
    cardBg: '#FFFFFF18',
    cardBorder: '#FFFFFF30',
  },
  {
    id: 'travel',
    title: '出行指南',
    subtitle: '宠物友好地图，带它一起安心探索世界。',
    imageUrl:
      'https://images.unsplash.com/photo-1768691728636-027c2acbaf6b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w4NDM0ODN8MHwxfHJhbmRvbXx8fHx8fHx8fDE3NzM2NjE1MDN8&ixlib=rb-4.1.0&q=80&w=400',
    cardBg: '#FFFFFF18',
    cardBorder: '#FFFFFF30',
  },
  {
    id: 'coming-soon',
    title: '敬请期待',
    subtitle: '更多实用工具正在路上，准备好迎接惊喜！',
    imageUrl:
      'https://images.unsplash.com/photo-1690871196258-2821360b2893?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w4NDM0ODN8MHwxfHJhbmRvbXx8fHx8fHx8fDE3NzM2NjE1MDN8&ixlib=rb-4.1.0&q=80&w=400',
    cardBg: '#FFFFFF10',
    cardBorder: '#FFFFFF20',
  },
]

/**
 * Pet Guide Home 页面组件
 *
 * 严格还原 Pencil 设计稿 RxYNc 节点（390 × 844px）
 * 背景渐变由宠物主题色决定，卡片为四大功能入口
 */
export default function PetGuideHome({
  category,
  userAvatarUrl,
}: {
  category: PetCategory
  userAvatarUrl?: string
}) {
  const router = useRouter()

  /** 设计稿默认紫色渐变（#0A0816 → #2D1163 35% → #5C2099 70% → #7230B8 100%） */
  const background =
    category.themeGradient ??
    'linear-gradient(180deg, #0A0816 0%, #2D1163 35%, #5C2099 70%, #7230B8 100%)'

  return (
    /**
     * 根容器：390×844px，对应设计稿 RxYNc 节点
     * 使用 w-screen/h-screen 以支持全屏展示，同时
     * 背景由宠物主题渐变动态决定
     */
    <div
      className="relative flex flex-col overflow-hidden w-screen h-screen font-[Inter,sans-serif]"
      style={{ background }}
    >
      {/* ── 顶部导航栏 ── pt-12 pb-4 与首页搜索行一致，内容垂直对齐 ── */}
      <div className="flex items-center justify-between pt-12 pb-4 px-5 shrink-0 relative z-10">
        {/* 返回按钮：arrow-left 白色 26×26 */}
        <button
          onClick={() => router.back()}
          className="flex items-center justify-center w-12 h-12 -ml-2"
          aria-label="返回"
        >
          <ArrowLeft className="w-[26px] h-[26px] text-white" strokeWidth={2} />
        </button>

        {/* 头像：46×46 | rounded-full | 与首页一致，无真实头像时显示 User 图标 */}
        <div className="shrink-0 w-[46px] h-[46px] rounded-full overflow-hidden ring-2 ring-white/25">
          {userAvatarUrl ? (
            <Image
              src={userAvatarUrl}
              alt="用户头像"
              width={46}
              height={46}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-[#5B30C0] flex items-center justify-center">
              <User className="w-5 h-5 text-white/80" strokeWidth={2} />
            </div>
          )}
        </div>
      </div>

      {/* ── 内容区 ── fill_container | vertical | justifyContent center | alignItems center ── */}
      {/* padding [16, 24, 8, 24] | gap 18 */}
      <div className="flex-1 flex flex-col justify-center items-center gap-[24px] px-6 relative z-10">
        {GUIDE_CARDS.map((card) => (
          <div
            key={card.id}
            className="flex w-full h-[100px] rounded-[44px] overflow-hidden cursor-pointer active:scale-[0.98] transition-transform duration-150"
            style={{
              background: card.cardBg,
              boxShadow: `inset 0 0 0 1px ${card.cardBorder}`,
            }}
          >
            {/* 文字区：居中对齐 */}
            <div className="flex flex-col items-center justify-center gap-[5px] flex-1 px-6">
              <span className="text-[23px] font-bold text-white leading-none">
                {card.title}
              </span>
              <span className="text-[11px] text-[#D4C8FF] leading-[1.5] text-center">
                {card.subtitle}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* ── 底部 Tab Bar ── padding [12, 21, 21, 21] ── */}
      <div className="shrink-0 px-[21px] pt-3 pb-[21px] relative z-10">
        {/* Tab Pill：height 62px | rounded-[36px] | bg #FFFFFF18 | border #FFFFFF22 | p-1 */}
        <div className="flex h-[62px] rounded-[36px] p-1 border border-[#FFFFFF22] bg-[#FFFFFF18]">
          {/* 主页 Tab（当前页面属于主页分支，高亮激活） */}
          <button
            onClick={() => router.push('/')}
            className="flex-1 flex flex-col items-center justify-center gap-1 rounded-[26px] bg-[#FFFFFF22] transition-colors"
          >
            <Home className="w-[18px] h-[18px] text-white" strokeWidth={2} />
            <span className="text-[10px] font-semibold tracking-[0.5px] text-white">
              主页
            </span>
          </button>

          {/* 我的 Tab */}
          <button
            onClick={() => router.push('/mine')}
            className="flex-1 flex flex-col items-center justify-center gap-1 rounded-[26px] bg-transparent transition-colors"
          >
            <User className="w-[18px] h-[18px] text-[#8888AA]" strokeWidth={2} />
            <span className="text-[10px] font-semibold tracking-[0.5px] text-[#8888AA]">
              我的
            </span>
          </button>
        </div>
      </div>
    </div>
  )
}
