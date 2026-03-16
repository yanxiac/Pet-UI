'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion, useMotionValue, useTransform, animate, PanInfo } from 'framer-motion'
import { ArrowLeft, User, ArrowUpRight, Heart, PawPrint, Moon } from 'lucide-react'
import Image from 'next/image'

const SUPABASE_URL = 'https://rcdbihgkbfqjipuyfibu.supabase.co'
const STORAGE_BASE = `${SUPABASE_URL}/storage/v1/object/public/raising-guide-images`

/* ─── 卡片数据（3 张） ──────────────────────────────────────── */
const CARDS = [
  {
    id: 'daily-health',
    title: '日常健康',
    subtitle: '建立科学的日常护理习惯，让爱宠每天都状态最佳。',
    imageUrl: `${STORAGE_BASE}/daily-health.svg`,
    accentColor: '#F472B6',
    Icon: Heart,
  },
  {
    id: 'pet-behavior',
    title: '宠物行为',
    subtitle: '读懂毛孩子的肢体语言，用正向方式引导行为习惯。',
    imageUrl: `${STORAGE_BASE}/pet-behavior.svg`,
    accentColor: '#34D399',
    Icon: PawPrint,
  },
  {
    id: 'end-of-life',
    title: '临终关怀',
    subtitle: '陪伴生命最后旅程，以爱与尊严送别你的老伙伴。',
    imageUrl: `${STORAGE_BASE}/end-of-life.svg`,
    accentColor: '#A78BFA',
    Icon: Moon,
  },
]

/* ─── 3D 扇形堆叠配置（偏移量同比 ×0.8） ───────────────────── */
const STACK_CONFIGS = [
  { rotateZ: 0,   x: 0,   y: 0,  scale: 1,    opacity: 1    },
  { rotateZ: -9,  x: -22, y: 8,  scale: 0.96, opacity: 0.82 },
  { rotateZ: -16, x: -42, y: 14, scale: 0.92, opacity: 0.6  },
]

/* ─── 单张卡片 ──────────────────────────────────────────────── */
interface CardProps {
  card: (typeof CARDS)[number]
  stackIndex: number
  total: number
  onDragEnd: (info: PanInfo) => void
}

function GuideCard({ card, stackIndex, total, onDragEnd }: CardProps) {
  const isActive = stackIndex === 0
  const cfg = STACK_CONFIGS[Math.min(stackIndex, STACK_CONFIGS.length - 1)]

  const dragY = useMotionValue(0)
  const dragOpacity = useTransform(dragY, [0, 260], [1, 0])

  if (stackIndex > 2) return null

  return (
    <motion.div
      className="absolute w-full"
      style={{
        zIndex: total - stackIndex,
        x: cfg.x,
        y: isActive ? dragY : cfg.y,
        opacity: isActive ? dragOpacity : cfg.opacity,
        rotate: cfg.rotateZ,
        scale: cfg.scale,
        originX: 0.5,
        originY: 0.5,
        cursor: isActive ? 'grab' : 'default',
      }}
      animate={
        isActive
          ? { x: 0, y: 0, rotate: 0, scale: 1, opacity: 1 }
          : { x: cfg.x, y: cfg.y, rotate: cfg.rotateZ, scale: cfg.scale, opacity: cfg.opacity }
      }
      transition={{ type: 'spring', damping: 28, stiffness: 200, mass: 1 }}
      drag={isActive ? 'y' : false}
      dragConstraints={{ top: 0, bottom: 320 }}
      dragElastic={0.18}
      whileDrag={{ cursor: 'grabbing' }}
      onDragEnd={(_, info) => {
        if (isActive) onDragEnd(info)
        animate(dragY, 0, { type: 'spring', damping: 22, stiffness: 300 })
      }}
    >
      <div
        className="w-full rounded-[21px] overflow-hidden"
        style={{
          background: 'rgba(255, 255, 255, 0.16)',
          backdropFilter: 'blur(32px)',
          WebkitBackdropFilter: 'blur(32px)',
          boxShadow: '0 8px 32px rgba(0,0,0,0.28), inset 0 0 0 1px rgba(255,255,255,0.35)',
        }}
      >
        {/* ── 上部 70%：图片区（高度 ×0.8 → 240px） ── */}
        <div className="relative w-full" style={{ height: 240 }}>
          <Image
            src={card.imageUrl}
            alt={card.title}
            fill
            className="object-cover"
            sizes="350px"
            priority={stackIndex === 0}
            unoptimized
          />
          {/* 底部渐变遮罩 */}
          <div
            className="absolute inset-0"
            style={{
              background:
                'linear-gradient(180deg, rgba(0,0,0,0) 50%, rgba(0,0,0,0.5) 100%)',
            }}
          />
          {/* 右上角 ↗ 按钮 */}
          <div className="absolute top-3 right-3">
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center"
              style={{
                background: 'rgba(255,255,255,0.22)',
                border: '1px solid rgba(255,255,255,0.4)',
              }}
            >
              <ArrowUpRight className="w-[14px] h-[14px] text-white" />
            </div>
          </div>
          {/* 左上角图标 */}
          <div className="absolute top-3 left-3">
            <div
              className="w-8 h-8 rounded-[10px] flex items-center justify-center"
              style={{ background: 'rgba(255,255,255,0.18)' }}
            >
              <card.Icon className="w-4 h-4 text-white" />
            </div>
          </div>
        </div>

        {/* ── 下部 30%：文字区（minHeight ×0.8 → 102px） ── */}
        <div className="px-4 pt-4 pb-5" style={{ minHeight: 102 }}>
          {/* 大标题 */}
          <h2
            className="text-[22px] font-extrabold leading-tight tracking-tight mb-2 text-white"
            style={{ textShadow: '0 1px 8px rgba(0,0,0,0.35)' }}
          >
            {card.title}
          </h2>
          {/* 副标题 */}
          <p
            className="text-[11px] text-white/70 leading-[1.7]"
            style={{ textShadow: '0 1px 4px rgba(0,0,0,0.3)' }}
          >
            {card.subtitle}
          </p>
        </div>
      </div>
    </motion.div>
  )
}

/* ─── 进度指示器 ────────────────────────────────────────────── */
function ProgressDots({ total, active }: { total: number; active: number }) {
  return (
    <div className="flex items-center gap-[6px]">
      {Array.from({ length: total }).map((_, i) => (
        <motion.div
          key={i}
          animate={{ width: i === active ? 20 : 6, opacity: i === active ? 1 : 0.35 }}
          transition={{ type: 'spring', damping: 20, stiffness: 200 }}
          className="h-[6px] rounded-full bg-white"
        />
      ))}
    </div>
  )
}

/* ─── 主组件 ────────────────────────────────────────────────── */
export default function RaisingGuideCarousel({
  background,
  userAvatarUrl,
}: {
  background?: string
  userAvatarUrl?: string
}) {
  const router = useRouter()
  const [activeIndex, setActiveIndex] = useState(0)

  const bg =
    background ??
    'linear-gradient(180deg, #0A0816 0%, #2D1163 35%, #5C2099 70%, #7230B8 100%)'

  const advance = () => setActiveIndex((prev) => (prev + 1) % CARDS.length)

  const handleDragEnd = (info: PanInfo) => {
    if (info.offset.y > 80) advance()
  }

  const orderedCards = CARDS.map((card, i) => ({
    card,
    stackIndex: (i - activeIndex + CARDS.length) % CARDS.length,
  }))

  return (
    <div
      className="relative flex flex-col overflow-hidden w-screen h-screen font-[Inter,sans-serif]"
      style={{ background: bg }}
    >
      {/* ── 顶部导航 ── */}
      <div className="flex items-center justify-between pt-12 pb-4 px-5 shrink-0 relative z-20">
        <button
          onClick={() => router.back()}
          className="flex items-center justify-center w-12 h-12 -ml-2"
          aria-label="返回"
        >
          <ArrowLeft className="w-[26px] h-[26px] text-white" strokeWidth={2} />
        </button>
        <div className="text-white/80 text-[15px] font-semibold tracking-wide">养育指南</div>
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

      {/* ── 卡片堆叠区域 ── */}
      <div className="flex-1 flex items-center justify-center px-8 relative z-10 -mt-20">
        <div className="relative w-full" style={{ height: 368 }}>
          {orderedCards.map(({ card, stackIndex }) => (
            <GuideCard
              key={card.id}
              card={card}
              stackIndex={stackIndex}
              total={CARDS.length}
              onDragEnd={handleDragEnd}
            />
          ))}
        </div>
      </div>

      {/* ── 底部进度 ── */}
      <div className="shrink-0 px-6 pb-12 relative z-20 flex flex-col items-center gap-4">
        <ProgressDots total={CARDS.length} active={activeIndex} />
        <p className="text-white/30 text-[11px] tracking-wide">向下拖动卡片切换</p>
      </div>
    </div>
  )
}
