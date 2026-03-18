'use client'

import { useState, useRef, useEffect } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import {
  Search,
  Home,
  User,
} from 'lucide-react'
import { PetEncyclopediaHomeProps } from '@/types/pet'
import {
  mockPetCategories,
  swapPetCategoryOrder,
} from '@/lib/mock-data'

/** 当无 themeGradient 时的兜底渐变 */
const DEFAULT_GRADIENT =
  'linear-gradient(180deg, #0D0D1A 0%, #0D0D1A 35%, #5B30C0 75%, #7340D8 100%)'

/**
 * 宠物百科首页组件
 *
 * 严格还原 Pencil 设计稿 IMPeo 节点（390 × 844px）
 * 设计变量：
 *   $text-primary   #FFFFFF
 *   $text-secondary #D4C8FF
 *   $icon-inactive  #8888AA
 *   背景渐变        由各品种 themeGradient 动态决定
 *
 * Hero 区支持左右手势滑动切换宠物大类（含阻尼边缘 + 小圆点指示器）
 * 背景色随滑动实时插值过渡：各品种渐变层叠放，opacity 随拖拽进度变化
 */
export default function PetEncyclopediaHome({
  featuredCategory,
  categories: categoriesProp,
  userAvatarUrl,
  activeTab = 'home',
  onTabChange,
  onSearch,
}: PetEncyclopediaHomeProps) {
  const router = useRouter()
  const [searchValue, setSearchValue] = useState('')

  // ── 轮播状态 ──────────────────────────────────────────────────────────────
  const [currentIndex, setCurrentIndex] = useState(0)
  const [dragDeltaX, setDragDeltaX] = useState(0)
  const [isDragging, setIsDragging] = useState(false)
  const dragStartXRef = useRef<number | null>(null)

  // categories 解析：props 传入 > 单个 featuredCategory > Mock 全量数据
  const categories =
    categoriesProp && categoriesProp.length > 0
      ? swapPetCategoryOrder(categoriesProp, '猫类', '爬行与冷血类')
      : featuredCategory
      ? [featuredCategory]
      : swapPetCategoryOrder(mockPetCategories, '猫类', '爬行与冷血类')

  const total = categories.length
  const category = categories[currentIndex]

  // ── 背景层透明度计算 ────────────────────────────────────────────────────────
  // 拖拽中：当前层淡出、相邻层淡入；释放后 CSS transition 平滑收尾
  const getBgOpacity = (idx: number): number => {
    if (!isDragging || dragDeltaX === 0) {
      return idx === currentIndex ? 1 : 0
    }
    // 用屏幕宽度（约 390px）归一化拖拽进度，最大 1
    const SCREEN_W = 390
    const progress = Math.min(Math.abs(dragDeltaX) / SCREEN_W, 1)
    const adjacentIdx = dragDeltaX < 0 ? currentIndex + 1 : currentIndex - 1

    if (idx === currentIndex) return 1 - progress
    if (idx === adjacentIdx) return progress
    return 0
  }

  // ── 拖拽/触摸处理 ──────────────────────────────────────────────────────────
  const dragStartYRef = useRef<number | null>(null)
  // 是否已锁定为水平滑动（锁定后才阻止纵向滚动）
  const isHorizontalLockRef = useRef<boolean | null>(null)
  // 是否发生了有效拖拽（区分 tap 与 drag，超过 8px 视为拖拽）
  const hasDraggedRef = useRef(false)
  const rootRef = useRef<HTMLDivElement>(null)

  const startDrag = (x: number, y: number) => {
    dragStartXRef.current = x
    dragStartYRef.current = y
    isHorizontalLockRef.current = null
    hasDraggedRef.current = false
    setIsDragging(true)
  }

  const moveDrag = (x: number, y: number) => {
    if (dragStartXRef.current === null || dragStartYRef.current === null) return
    const dx = x - dragStartXRef.current
    const dy = y - dragStartYRef.current

    // 超过 8px 时标记为有效拖拽，后续不触发点击跳转
    if (Math.abs(dx) > 8 || Math.abs(dy) > 8) {
      hasDraggedRef.current = true
    }

    // 首次移动时判断方向并锁定
    if (isHorizontalLockRef.current === null) {
      isHorizontalLockRef.current = Math.abs(dx) > Math.abs(dy)
    }

    // 非水平方向：放弃处理，让浏览器正常滚动
    if (!isHorizontalLockRef.current) return

    let delta = dx
    // 边缘阻尼：到头时保留 30% 的位移感
    if ((delta > 0 && currentIndex === 0) || (delta < 0 && currentIndex === total - 1)) {
      delta = delta * 0.3
    }
    setDragDeltaX(delta)
  }

  const endDrag = () => {
    const THRESHOLD = 60
    if (isHorizontalLockRef.current) {
      if (dragDeltaX < -THRESHOLD && currentIndex < total - 1) {
        setCurrentIndex((i) => i + 1)
      } else if (dragDeltaX > THRESHOLD && currentIndex > 0) {
        setCurrentIndex((i) => i - 1)
      }
    }
    dragStartXRef.current = null
    dragStartYRef.current = null
    isHorizontalLockRef.current = null
    setDragDeltaX(0)
    setIsDragging(false)
  }

  // 挂载非 passive 的原生 touchmove，才能在水平滑动时调用 preventDefault()
  // 阻止浏览器把水平手势当成纵向滚动
  useEffect(() => {
    const el = rootRef.current
    if (!el) return

    const handleTouchMove = (e: TouchEvent) => {
      if (dragStartXRef.current === null || dragStartYRef.current === null) return
      const dx = e.touches[0].clientX - dragStartXRef.current
      const dy = e.touches[0].clientY - dragStartYRef.current
      if (isHorizontalLockRef.current === null) {
        isHorizontalLockRef.current = Math.abs(dx) > Math.abs(dy)
      }
      if (isHorizontalLockRef.current) {
        e.preventDefault()
      }
    }

    el.addEventListener('touchmove', handleTouchMove, { passive: false })
    return () => el.removeEventListener('touchmove', handleTouchMove)
  }, [])

  // ── 其他事件 ───────────────────────────────────────────────────────────────
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
     * 背景由各品种主题渐变层叠加实现；拖拽时通过 opacity 插值过渡
     * 拖拽/触摸事件挂在根容器，让全屏都可以左右滑动；
     * transform 仅作用于内部轮播轨道，顶部栏和底部导航栏保持静止
     */
    <div
      className={[
        'relative flex flex-col overflow-hidden',
        'w-screen h-screen',
        'bg-[#0D0D1A]',
        'font-[Inter,sans-serif]',
      ].join(' ')}
      ref={rootRef}
      style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
      /* Touch — 全屏监听（touchmove 由原生非 passive 监听器处理以阻止纵向滚动） */
      onTouchStart={(e) => startDrag(e.touches[0].clientX, e.touches[0].clientY)}
      onTouchMove={(e) => moveDrag(e.touches[0].clientX, e.touches[0].clientY)}
      onTouchEnd={endDrag}
      onTouchCancel={endDrag}
      /* Mouse — 全屏监听 */
      onMouseDown={(e) => startDrag(e.clientX, e.clientY)}
      onMouseMove={(e) => { if (dragStartXRef.current !== null) moveDrag(e.clientX, e.clientY) }}
      onMouseUp={endDrag}
      onMouseLeave={endDrag}
    >

      {/* ── 品种主题渐变背景层组 ──────────────────────────────────────────────
           各品种渐变铺满全屏并叠放；通过 opacity 实现滑动时的颜色过渡。
           isDragging 时实时更新 opacity（无 transition），
           释放后加上 transition 让颜色平滑收尾到目标状态。
      */}
      {categories.map((cat, idx) => (
        <div
          key={cat.id}
          aria-hidden="true"
          className="absolute inset-0 pointer-events-none"
          style={{
            background: cat.themeGradient ?? DEFAULT_GRADIENT,
            opacity: getBgOpacity(idx),
            transition: isDragging
              ? 'none'
              : 'opacity 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
            zIndex: 0,
          }}
        />
      ))}

      {/* ── Search Row ──────────────────────────────────────────────────────── */}
      {/* padding: [0,20,16,20] | gap: 12 | align-center */}
      <div className="flex items-center gap-3 px-5 pt-12 pb-4 shrink-0 relative z-10">
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

      {/* ── Hero + Info（整体垂直居中于搜索栏与导航之间）────────────────────── */}
      <div className="flex-1 flex flex-col items-center justify-center overflow-hidden min-h-0 relative z-10">

        {/* ── Hero Carousel ──────────────────────────────────────────────────── */}
        {/*
          外层固定高度 overflow-hidden，内层横向排列所有类别图片
          通过 translateX 实现跟手滑动与 snap 动画
        */}
        <div
          className="w-full shrink-0 overflow-hidden relative select-none"
          style={{ height: '510px' }}
        >
          {/* 横向轨道 */}
          <div
            className="flex h-full"
            style={{
              transform: `translateX(calc(${-currentIndex * 100}% + ${dragDeltaX}px))`,
              transition: isDragging ? 'none' : 'transform 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
              willChange: 'transform',
            }}
          >
            {categories.map((cat, idx) => (
              <div
                key={cat.id}
                className="flex-shrink-0 w-full h-full flex items-center justify-center"
                aria-hidden={idx !== currentIndex}
                onClick={() => {
                  // 仅当没有发生拖拽（即纯点击/tap）且是当前展示项时跳转
                  if (!hasDraggedRef.current && idx === currentIndex) {
                    router.push(`/guide/${cat.slug}`)
                  }
                }}
              >
                <Image
                  src={cat.imageUrl}
                  alt={cat.name}
                  width={425}
                  height={510}
                  className="w-[425px] h-[510px] object-cover pointer-events-none"
                  priority={idx === 0}
                  unoptimized
                  draggable={false}
                />
              </div>
            ))}
          </div>
        </div>

        {/* ── Category Info ────────────────────────────────────────────────── */}
        <div className="flex flex-col items-center gap-2 px-6 py-4 shrink-0">
          <h1
            key={`name-${currentIndex}`}
            className="text-[34px] font-bold text-white text-center leading-none"
            style={{ fontFamily: "var(--font-plus-jakarta-sans), 'Plus Jakarta Sans', Inter, sans-serif" }}
          >
            {category.name}
          </h1>
          <p
            key={`desc-${currentIndex}`}
            className="text-[15px] text-center leading-[1.5] text-[#D4C8FF] max-w-[300px]"
            style={{ whiteSpace: 'pre-line' }}
          >
            {category.description}
          </p>
        </div>

      </div>

      {/* ── Tab Bar ─────────────────────────────────────────────────────────── */}
      {/* padding: [12,21,21,21] */}
      <div className="shrink-0 px-[21px] pt-3 pb-[21px] relative z-10">
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
