'use client'

import { useEffect, useState } from 'react'
import {
  AnimatePresence,
  motion,
  type MotionValue,
  PanInfo,
  useMotionValue,
  useMotionValueEvent,
  useSpring,
  useTransform,
} from 'framer-motion'
import { useRouter } from 'next/navigation'
import { ArrowLeft, ArrowUpRight, Heart, Moon, PawPrint, User, type LucideIcon } from 'lucide-react'
import Image from 'next/image'
import { fetchParentingGuideItems, type ParentingGuideItem } from '@/lib/supabase'

const SWIPE_THRESHOLD = 100
const EXIT_DISTANCE = 560

const CATEGORY_CONFIG: Record<string, { Icon: LucideIcon }> = {
  'daily-health': { Icon: Heart },
  'pet-behavior': { Icon: PawPrint },
  'end-of-life': { Icon: Moon },
}

type CardData = {
  id: string
  title: string
  subtitle: string
  imageUrl: string
  Icon: LucideIcon
}

const FALLBACK_CARDS: CardData[] = [
  {
    id: 'daily-health',
    title: '日常健康',
    subtitle: '建立科学的日常护理习惯，让爱宠每天都状态最佳。',
    imageUrl:
      'https://rcdbihgkbfqjipuyfibu.supabase.co/storage/v1/object/public/raising-guide-images/daily-health.png',
    Icon: Heart,
  },
  {
    id: 'pet-behavior',
    title: '宠物行为',
    subtitle: '读懂毛孩子的肢体语言，用正向方式引导行为习惯。',
    imageUrl:
      'https://rcdbihgkbfqjipuyfibu.supabase.co/storage/v1/object/public/raising-guide-images/pet-behavior.png',
    Icon: PawPrint,
  },
  {
    id: 'end-of-life',
    title: '临终关怀',
    subtitle: '陪伴生命最后旅程，以爱与尊严送别你的老伙伴。',
    imageUrl:
      'https://rcdbihgkbfqjipuyfibu.supabase.co/storage/v1/object/public/raising-guide-images/end-of-life.png',
    Icon: Moon,
  },
]

const STACK_LAYOUTS = [
  { x: 0, y: 0, scale: 1, opacity: 1, rotate: 0, blur: 0 },
  { x: -18, y: 18, scale: 0.955, opacity: 0.84, rotate: -4, blur: 0 },
  { x: -22, y: 24, scale: 0.93, opacity: 0.26, rotate: -5, blur: 0 },
]

function mix(from: number, to: number, progress: number) {
  return from + (to - from) * progress
}

function buildDeck(rows: ParentingGuideItem[]): CardData[] {
  const mapped = rows.map((row) => {
    const id = row.category ?? row.id
    const fallback = FALLBACK_CARDS.find((card) => card.id === id)
    const Icon = CATEGORY_CONFIG[id]?.Icon ?? fallback?.Icon ?? Heart

    return {
      id,
      title: row.name || fallback?.title || '宠物养育',
      subtitle: row.description || fallback?.subtitle || '精选宠物养育知识卡片。',
      imageUrl: row.image_url || fallback?.imageUrl || FALLBACK_CARDS[0].imageUrl,
      Icon,
    }
  })

  const deduped = new Map<string, CardData>()
  mapped.forEach((card) => {
    if (!deduped.has(card.id)) deduped.set(card.id, card)
  })
  FALLBACK_CARDS.forEach((card) => {
    if (!deduped.has(card.id)) deduped.set(card.id, card)
  })

  return Array.from(deduped.values()).slice(0, 3)
}

function extractHexColors(gradient: string) {
  return gradient.match(/#[0-9a-fA-F]{6}/g) ?? []
}

function hexToRgb(hex: string) {
  const value = hex.replace('#', '')
  return {
    r: Number.parseInt(value.slice(0, 2), 16),
    g: Number.parseInt(value.slice(2, 4), 16),
    b: Number.parseInt(value.slice(4, 6), 16),
  }
}

function rgba(hex: string, alpha: number) {
  const { r, g, b } = hexToRgb(hex)
  return `rgba(${r},${g},${b},${alpha})`
}

function mixHex(from: string, to: string, amount: number) {
  const start = hexToRgb(from)
  const end = hexToRgb(to)
  const mix = (a: number, b: number) => Math.round(a + (b - a) * amount)

  return `#${[mix(start.r, end.r), mix(start.g, end.g), mix(start.b, end.b)]
    .map((value) => value.toString(16).padStart(2, '0'))
    .join('')}`
}

function buildCardTheme(background: string) {
  const colors = extractHexColors(background)
  const top = colors[0] ?? '#0A0816'
  const upper = colors[1] ?? top
  const lower = colors.at(-2) ?? '#5C2099'
  const accent = colors.at(-1) ?? '#7230B8'
  const glow = mixHex(accent, '#ffffff', 0.18)
  const brightGlow = mixHex(accent, '#ffffff', 0.42)
  const iconTint = mixHex(top, accent, 0.28)

  return {
    surfaceGradient: `linear-gradient(180deg, ${top} 0%, ${upper} 58%, ${lower} 78%, ${accent} 100%)`,
    cardShadow: `0 18px 52px rgba(0,0,0,0.28), 0 0 26px ${rgba(accent, 0.16)}, 0 0 46px ${rgba(lower, 0.12)}, 0 0 68px ${rgba(glow, 0.08)}`,
    innerFrameShadow: `inset 0 0 0 1px ${rgba(brightGlow, 0.12)}, inset 0 0 34px ${rgba(accent, 0.12)}`,
    leftEdgeGlow: `linear-gradient(90deg, ${rgba(accent, 0.24)} 0%, ${rgba(accent, 0.08)} 42%, ${rgba(accent, 0)} 100%)`,
    topEdgeGlow: `linear-gradient(180deg, ${rgba(accent, 0.22)} 0%, ${rgba(accent, 0.04)} 52%, ${rgba(accent, 0)} 100%)`,
    topBloom: rgba(accent, 0.18),
    bottomOuterGlow: rgba(accent, 0.9),
    bottomInnerGlow: rgba(brightGlow, 0.55),
    bottomGradient: `linear-gradient(180deg, ${rgba(top, 0)} 0%, ${rgba(lower, 0.09)} 16%, ${rgba(lower, 0.34)} 44%, ${rgba(accent, 0.58)} 72%, ${rgba(brightGlow, 0.78)} 100%)`,
    bridgeGlow: rgba(accent, 0.26),
    imageOverlay: `linear-gradient(180deg, ${rgba(top, 0.08)} 0%, ${rgba(top, 0.03)} 42%, ${rgba(top, 0.14)} 82%, ${rgba(top, 0)} 100%)`,
    iconBackground: rgba(iconTint, 0.78),
    iconBorder: rgba(accent, 0.45),
    iconShadow: `0 0 18px ${rgba(accent, 0.24)}`,
    dimOverlay: top,
  }
}

function CardFace({
  card,
  priority,
  theme,
}: {
  card: CardData
  priority: boolean
  theme: ReturnType<typeof buildCardTheme>
}) {
  return (
    <div
      className="relative aspect-[300/356] overflow-hidden rounded-[32px] border border-white/28 bg-[#090814]"
      style={{ boxShadow: theme.cardShadow }}
    >
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0" style={{ background: theme.surfaceGradient }} />
        <div className="absolute inset-0 rounded-[32px]" style={{ boxShadow: theme.innerFrameShadow }} />
        <div className="absolute inset-y-[6%] left-0 w-[10%] blur-[12px]" style={{ background: theme.leftEdgeGlow }} />
        <div className="absolute inset-x-[2%] top-0 h-[10%] blur-[10px]" style={{ background: theme.topEdgeGlow }} />
        <div className="absolute inset-x-[6%] top-[2%] h-[14%] rounded-full blur-[22px]" style={{ background: theme.topBloom }} />
        <div className="absolute -bottom-[20%] left-1/2 h-[44%] w-[136%] -translate-x-1/2 rounded-full blur-[62px]" style={{ background: theme.bottomOuterGlow }} />
        <div className="absolute bottom-[8%] left-1/2 h-[26%] w-[94%] -translate-x-1/2 rounded-full blur-[52px]" style={{ background: theme.bottomInnerGlow }} />
        <div className="absolute inset-x-0 bottom-0 h-[55%]" style={{ background: theme.bottomGradient }} />
        <div className="absolute inset-x-[10%] top-[61%] h-[17%] rounded-full blur-[40px]" style={{ background: theme.bridgeGlow }} />
      </div>

      <div className="relative z-10 flex h-full flex-col">
        <div className="relative h-[74%] w-full overflow-hidden">
          <Image
            src={card.imageUrl}
            alt={card.title}
            fill
            priority={priority}
            unoptimized
            sizes="(max-width: 768px) 78vw, 360px"
            className="object-contain object-center px-2 pt-10"
          />
          <div className="absolute inset-0" style={{ background: theme.imageOverlay }} />

          <div
            className="absolute left-5 top-5 flex h-12 w-12 items-center justify-center rounded-[16px]"
            style={{
              border: `1px solid ${theme.iconBorder}`,
              background: theme.iconBackground,
              boxShadow: theme.iconShadow,
            }}
          >
            <card.Icon className="h-5 w-5 text-white" />
          </div>

          <div className="pointer-events-none absolute right-5 top-5 flex h-12 w-12 items-center justify-center rounded-full border border-white/40 bg-white/14">
            <ArrowUpRight className="h-5 w-5 text-white" />
          </div>
        </div>

        <div className="flex min-h-0 flex-1 flex-col justify-end space-y-3 px-7 pb-9 pt-2">
          <h2 className="text-[25px] font-extrabold leading-none tracking-tight text-white">
            {card.title}
          </h2>
          <p className="max-w-[92%] text-[14px] leading-7 text-white/72">
            {card.subtitle}
          </p>
        </div>
      </div>
    </div>
  )
}

function BackgroundCard({
  card,
  stackIndex,
  dragX,
  isPromoting,
  theme,
}: {
  card: CardData
  stackIndex: number
  dragX: MotionValue<number>
  isPromoting: boolean
  theme: ReturnType<typeof buildCardTheme>
}) {
  const layout = STACK_LAYOUTS[stackIndex]
  const nextLayout = stackIndex === 1 ? STACK_LAYOUTS[0] : STACK_LAYOUTS[1]
  const dragProgress = useTransform(() =>
    isPromoting ? 1 : Math.min(Math.abs(dragX.get()) / 180, 1)
  )
  const targetX = useTransform(dragProgress, (progress) =>
    mix(layout.x, nextLayout.x, progress)
  )
  const targetY = useTransform(dragProgress, (progress) =>
    mix(layout.y, nextLayout.y, progress)
  )
  const targetScale = useTransform(dragProgress, (progress) =>
    mix(layout.scale, nextLayout.scale, progress)
  )
  const targetRotate = useTransform(dragProgress, (progress) =>
    mix(layout.rotate, nextLayout.rotate, progress)
  )
  const targetBlur = useTransform(dragProgress, (progress) =>
    mix(layout.blur, nextLayout.blur, progress)
  )
  const targetDimOpacity = useTransform(dragProgress, (progress) =>
    mix(stackIndex === 1 ? 0.08 : 0.18, stackIndex === 1 ? 0 : 0.06, progress)
  )

  const x = useSpring(targetX, { stiffness: 360, damping: 30, mass: 0.75 })
  const y = useSpring(targetY, { stiffness: 360, damping: 30, mass: 0.75 })
  const scale = useSpring(targetScale, { stiffness: 360, damping: 30, mass: 0.75 })
  const rotate = useSpring(targetRotate, { stiffness: 360, damping: 30, mass: 0.75 })
  const blur = useSpring(targetBlur, { stiffness: 300, damping: 32, mass: 0.75 })
  const dimOpacity = useSpring(targetDimOpacity, { stiffness: 320, damping: 30, mass: 0.75 })
  const filter = useTransform(blur, (value) => `blur(${value}px)`)

  return (
    <motion.div
      key={card.id}
      className="absolute inset-0"
      initial={false}
      style={{
        x,
        y,
        scale,
        rotate,
        filter,
        zIndex: 30 - stackIndex,
      }}
    >
      <CardFace card={card} priority={false} theme={theme} />
      <motion.div
        className="pointer-events-none absolute inset-0 rounded-[32px]"
        style={{ background: theme.dimOverlay, opacity: dimOpacity }}
      />
    </motion.div>
  )
}

function DraggableCard({
  card,
  cardKey,
  isInteractive,
  onDismiss,
  mirrorDragX,
  theme,
}: {
  card: CardData
  cardKey: string
  isInteractive: boolean
  onDismiss: (direction: 1 | -1) => void
  mirrorDragX: MotionValue<number>
  theme: ReturnType<typeof buildCardTheme>
}) {
  const x = useMotionValue(0)
  const rotate = useTransform(x, [-220, 0, 220], [-14, 0, 14])
  const overlayOpacity = useTransform(x, [-220, 0, 220], [0.18, 0, 0.18])
  const exitVariants = {
    exit: (direction: 1 | -1) => ({
      x: direction * EXIT_DISTANCE,
      rotate: direction * 20,
      opacity: 0,
      transition: { duration: 0.32, ease: [0.22, 1, 0.36, 1] as const },
    }),
  }

  useMotionValueEvent(x, 'change', (latest) => {
    mirrorDragX.set(latest)
  })

  const handleDragEnd = (_event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    if (Math.abs(info.offset.x) < SWIPE_THRESHOLD) return
    onDismiss(info.offset.x > 0 ? 1 : -1)
  }

  return (
    <motion.div
      key={cardKey}
      className="absolute inset-0 touch-pan-y cursor-grab"
      style={{ x, rotate, zIndex: 40 }}
      initial={{ x: 0, y: 0, scale: 1, opacity: 1, rotate: 0 }}
      animate={{ x: 0, y: 0, scale: 1, opacity: 1, rotate: 0 }}
      variants={exitVariants}
      exit="exit"
      transition={{ type: 'spring', stiffness: 360, damping: 30, mass: 0.85 }}
      drag={isInteractive ? 'x' : false}
      dragConstraints={{ left: 0, right: 0 }}
      dragElastic={0.16}
      dragMomentum={false}
      whileDrag={{ cursor: 'grabbing', scale: 1.01 }}
      onDragEnd={handleDragEnd}
    >
      <motion.div
        className="pointer-events-none absolute inset-0 z-10 rounded-[32px] bg-white/10"
        style={{ opacity: overlayOpacity }}
      />
      <CardFace card={card} priority theme={theme} />
    </motion.div>
  )
}

function ProgressDots({ total, active }: { total: number; active: number }) {
  return (
    <div className="flex items-center gap-2">
      {Array.from({ length: total }).map((_, index) => (
        <motion.div
          key={index}
          className="h-2 rounded-full bg-white"
          animate={{
            width: index === active ? 30 : 8,
            opacity: index === active ? 1 : 0.35,
          }}
          transition={{ type: 'spring', stiffness: 320, damping: 24 }}
        />
      ))}
    </div>
  )
}

export default function RaisingGuideCarousel({
  background,
  userAvatarUrl,
}: {
  background?: string
  userAvatarUrl?: string
}) {
  const router = useRouter()
  const [cards, setCards] = useState<CardData[]>(FALLBACK_CARDS)
  const [activeIndex, setActiveIndex] = useState(0)
  const [swipeCount, setSwipeCount] = useState(0)
  const [exitDirection, setExitDirection] = useState<1 | -1>(1)
  const [isExiting, setIsExiting] = useState(false)
  const dragX = useMotionValue(0)

  useEffect(() => {
    fetchParentingGuideItems().then((rows) => {
      const nextCards = buildDeck(rows)
      if (nextCards.length) setCards(nextCards)
    })
  }, [])

  const bg =
    background ??
    'linear-gradient(180deg, #0A0816 0%, #2D1163 35%, #5C2099 70%, #7230B8 100%)'
  const theme = buildCardTheme(bg)

  const visibleCards = Array.from({ length: Math.min(cards.length, 3) }, (_, stackIndex) => ({
    card: cards[(activeIndex + stackIndex) % cards.length],
    stackIndex,
  }))

  const topCard = visibleCards[0]?.card
  const backgroundCards = visibleCards.slice(1)

  const dismissTopCard = (direction: 1 | -1) => {
    if (isExiting || cards.length <= 1) return
    setExitDirection(direction)
    setIsExiting(true)
  }

  const handleExitComplete = () => {
    if (!isExiting || cards.length === 0) return
    dragX.set(0)
    setActiveIndex((prev) => (prev + 1) % cards.length)
    setSwipeCount((prev) => prev + 1)
    setIsExiting(false)
  }

  return (
    <div
      className="relative flex h-screen w-screen flex-col overflow-hidden bg-[length:100%_100%] font-[Inter,sans-serif]"
      style={{ background: bg }}
    >
      <div className="relative z-20 flex shrink-0 items-center justify-between px-5 pb-4 pt-12">
        <button
          type="button"
          onClick={() => router.back()}
          className="-ml-2 flex h-12 w-12 items-center justify-center"
          aria-label="返回"
        >
          <ArrowLeft className="h-[26px] w-[26px] text-white" strokeWidth={2} />
        </button>

        <div className="text-[15px] font-semibold tracking-wide text-white/80">养育指南</div>

        <div className="h-[46px] w-[46px] shrink-0 overflow-hidden rounded-full ring-2 ring-white/25">
          {userAvatarUrl ? (
            <Image
              src={userAvatarUrl}
              alt="用户头像"
              width={46}
              height={46}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-[#5B30C0]">
              <User className="h-5 w-5 text-white/80" strokeWidth={2} />
            </div>
          )}
        </div>
      </div>

      <div className="relative z-10 flex flex-1 items-center justify-center px-6 -mt-14">
        <div className="relative h-[482px] w-full max-w-[380px]">
          {backgroundCards
            .slice()
            .reverse()
            .map(({ card, stackIndex }) => (
              <BackgroundCard
                key={card.id}
                card={card}
                stackIndex={stackIndex}
                dragX={dragX}
                isPromoting={isExiting}
                theme={theme}
              />
            ))}

          <AnimatePresence
            initial={false}
            custom={exitDirection}
            onExitComplete={handleExitComplete}
          >
            {!isExiting && topCard ? (
              <DraggableCard
                key={`${topCard.id}-${swipeCount}`}
                card={topCard}
                cardKey={`${topCard.id}-${swipeCount}`}
                isInteractive={cards.length > 1}
                onDismiss={dismissTopCard}
                mirrorDragX={dragX}
                theme={theme}
              />
            ) : null}
          </AnimatePresence>
        </div>
      </div>

      <div className="relative z-20 flex shrink-0 flex-col items-center gap-4 px-6 pb-12">
        <ProgressDots total={cards.length} active={activeIndex % cards.length} />
        <p className="text-[11px] tracking-[0.24em] text-white/35">左右滑动卡片切换</p>
      </div>
    </div>
  )
}
