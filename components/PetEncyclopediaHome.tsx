'use client'

import { useState } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import {
  Wifi,
  Signal,
  BatteryFull,
  Search,
  Home,
  User,
} from 'lucide-react'
import { PetEncyclopediaHomeProps } from '@/types/pet'
import { defaultFeaturedCategory } from '@/lib/mock-data'

/**
 * 宠物百科首页组件
 *
 * 严格还原 Pencil 设计稿 IMPeo 节点（390 × 844px）
 * 设计变量：
 *   $text-primary   #FFFFFF
 *   $text-secondary #D4C8FF
 *   $icon-inactive  #8888AA
 *   背景渐变        #0D0D1A → #0D0D1A(35%) → #5B30C0(75%) → #7340D8
 *
 * 后续接入 Supabase：将 featuredCategory.imageUrl 替换为 supabase.storage 公共 URL
 */
export default function PetEncyclopediaHome({
  featuredCategory,
  userAvatarUrl,
  activeTab = 'home',
  onTabChange,
  onSearch,
}: PetEncyclopediaHomeProps) {
  const router = useRouter()
  const [searchValue, setSearchValue] = useState('')

  const category = featuredCategory ?? defaultFeaturedCategory

  const handleTabClick = (tab: 'home' | 'mine') => {
    onTabChange?.(tab)
    router.push(tab === 'home' ? '/' : '/mine')
  }

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value)
    onSearch?.(e.target.value)
  }

  return (
    /**
     * 根容器
     * 固定 390×844px，严格对应设计稿尺寸（iPhone 标准逻辑像素）
     * 背景渐变：stops 0/35/75/100%，与设计稿 gradient colors 完全一致
     */
    <div
      className={[
        'relative flex flex-col overflow-hidden',
        'w-[390px] h-[844px]',
        'bg-[linear-gradient(180deg,#0D0D1A_0%,#0D0D1A_35%,#5B30C0_75%,#7340D8_100%)]',
        'font-[Inter,sans-serif]',
      ].join(' ')}
    >
      {/* ── Status Bar ──────────────────────────────────────────────────────── */}
      {/* height: 62px | padding: [0,24] | justify-between | align-center */}
      <div className="flex items-center justify-between h-[62px] px-6 shrink-0">
        <span className="text-[17px] font-semibold text-white tracking-tight">
          9:41
        </span>
        <div className="flex items-center gap-1.5">
          <Wifi className="w-[18px] h-[18px] text-white" strokeWidth={2} />
          <Signal className="w-[18px] h-[18px] text-white" strokeWidth={2} />
          <BatteryFull
            className="w-[18px] h-[18px] text-white"
            strokeWidth={2}
          />
        </div>
      </div>

      {/* ── Search Row ──────────────────────────────────────────────────────── */}
      {/* padding: [0,20,16,20] | gap: 12 | align-center */}
      <div className="flex items-center gap-3 px-5 pb-4 shrink-0">
        {/* Search Bar: h-48px | rounded-full | bg #FFFFFF22 | gap 10 | px-16 */}
        <label className="flex-1 flex items-center gap-2.5 h-12 rounded-full bg-[#FFFFFF22] px-4 cursor-text">
          <Search
            className="w-[18px] h-[18px] shrink-0"
            style={{ color: '#AAAACC' }}
            strokeWidth={2}
          />
          <input
            type="text"
            value={searchValue}
            onChange={handleSearchChange}
            placeholder="Search"
            className="flex-1 bg-transparent outline-none text-[15px] text-white placeholder:text-[#AAAACC]"
          />
        </label>

        {/* Avatar: 46×46px | rounded-full | border #FFFFFF40 outside */}
        <div
          className="shrink-0 w-[46px] h-[46px] rounded-full overflow-hidden ring-2 ring-white/25"
        >
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

      {/* ── Hero Area ───────────────────────────────────────────────────────── */}
      {/* flex-1 | layout: vertical | align-center | justify-center */}
      <div className="flex-1 flex items-center justify-center overflow-hidden">
        <Image
          src={category.imageUrl}
          alt={category.name}
          width={425}
          height={510}
          className="w-[425px] h-[510px] object-cover"
          priority
          unoptimized
        />
      </div>

      {/* ── Category Info ───────────────────────────────────────────────────── */}
      {/* layout: vertical | padding: [16,24] | gap: 8 | align-center */}
      <div className="flex flex-col items-center gap-2 px-6 py-4 shrink-0">
        <h1
          className="text-[34px] font-bold text-white text-center leading-none"
          style={{ fontFamily: "var(--font-plus-jakarta-sans), 'Plus Jakarta Sans', Inter, sans-serif" }}
        >
          {category.name}
        </h1>
        <p
          className="text-[15px] text-center leading-[1.5] text-[#D4C8FF] max-w-[300px]"
          style={{ whiteSpace: 'pre-line' }}
        >
          {category.description}
        </p>
      </div>

      {/* ── Tab Bar ─────────────────────────────────────────────────────────── */}
      {/* padding: [12,21,21,21] */}
      <div className="shrink-0 px-[21px] pt-3 pb-[21px]">
        {/* Tab Pill: h-62px | rounded-[36px] | bg #FFFFFF18 | border #FFFFFF22 | p-1 */}
        <div
          className="flex h-[62px] rounded-[36px] p-1 border border-[#FFFFFF22] bg-[#FFFFFF18]"
        >
          {/* Tab: 主页 ── active */}
          <button
            onClick={() => handleTabClick('home')}
            className={[
              'flex-1 flex flex-col items-center justify-center gap-1 rounded-[26px] transition-colors',
              activeTab === 'home' ? 'bg-[#FFFFFF22]' : 'bg-transparent',
            ].join(' ')}
          >
            <Home
              className="w-[18px] h-[18px]"
              style={{ color: activeTab === 'home' ? '#FFFFFF' : '#8888AA' }}
              strokeWidth={2}
            />
            <span
              className="text-[10px] font-semibold tracking-[0.5px]"
              style={{ color: activeTab === 'home' ? '#FFFFFF' : '#8888AA' }}
            >
              主页
            </span>
          </button>

          {/* Tab: 我的 ── inactive */}
          <button
            onClick={() => handleTabClick('mine')}
            className={[
              'flex-1 flex flex-col items-center justify-center gap-1 rounded-[26px] transition-colors',
              activeTab === 'mine' ? 'bg-[#FFFFFF22]' : 'bg-transparent',
            ].join(' ')}
          >
            <User
              className="w-[18px] h-[18px]"
              style={{ color: activeTab === 'mine' ? '#FFFFFF' : '#8888AA' }}
              strokeWidth={2}
            />
            <span
              className="text-[10px] font-semibold tracking-[0.5px]"
              style={{ color: activeTab === 'mine' ? '#FFFFFF' : '#8888AA' }}
            >
              我的
            </span>
          </button>
        </div>
      </div>
    </div>
  )
}
