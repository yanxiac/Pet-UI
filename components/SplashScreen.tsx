'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Image from 'next/image'
import type { SplashGridImageItem } from '@/lib/supabase'

interface SplashScreenProps {
  onExplore: () => void
  gridImages: SplashGridImageItem[]
}

const ROW_CONFIGS = [
  { duration: 13.6, offset: -88, imageOpacity: 0.76, overlayOpacity: 0.18 },
  { duration: 16.8, offset: -24, imageOpacity: 0.7, overlayOpacity: 0.24 },
  { duration: 20.4, offset: -108, imageOpacity: 0.64, overlayOpacity: 0.3 },
  { duration: 23.2, offset: -36, imageOpacity: 0.58, overlayOpacity: 0.36 },
]

const DEFAULT_TILE_VISUAL = {
  objectPosition: 'center 36%',
  scale: 1.14,
}

const TILE_VISUAL_TUNING: Record<number, { objectPosition: string; scale: number }> = {
  1: { objectPosition: 'center 26%', scale: 1.16 },
  2: { objectPosition: 'center 30%', scale: 1.12 },
  3: { objectPosition: 'center 24%', scale: 1.16 },
  4: { objectPosition: 'center 48%', scale: 1.1 },
  5: { objectPosition: 'center 34%', scale: 1.15 },
  6: { objectPosition: 'center 28%', scale: 1.14 },
  7: { objectPosition: 'center 30%', scale: 1.14 },
  8: { objectPosition: 'center 24%', scale: 1.16 },
  9: { objectPosition: 'center 42%', scale: 1.12 },
}

function buildMarqueeRows(images: SplashGridImageItem[]) {
  const base = images.length > 0 ? images : []

  if (base.length === 0) {
    return []
  }

  return ROW_CONFIGS.map((row, rowIndex) => ({
    ...row,
    key: `row-${rowIndex}`,
    tiles: Array.from({ length: 5 }, (_, tileIndex) => {
      const image = base[(rowIndex * 2 + tileIndex) % base.length]
      const tuning = TILE_VISUAL_TUNING[image.display_order] ?? DEFAULT_TILE_VISUAL

      return {
        ...image,
        key: `${image.id}-${rowIndex}-${tileIndex}`,
        objectPosition: tuning.objectPosition,
        imageScale: tuning.scale,
      }
    }),
  }))
}

export default function SplashScreen({ onExplore, gridImages }: SplashScreenProps) {
  const [showContent, setShowContent] = useState(false)
  const marqueeRows = buildMarqueeRows(gridImages)

  // 开场 0.5 秒后开始上移，并在 2.5 秒时到达最终位置
  useEffect(() => {
    const t = setTimeout(() => setShowContent(true), 500)
    return () => clearTimeout(t)
  }, [])

  return (
    <div
      className="relative h-full w-full overflow-hidden"
      style={{
        background:
          'linear-gradient(180deg, #080611 0%, #1A0E36 42%, #2D145A 72%, #140A2B 100%)',
      }}
    >
      {/* ── 倾斜图片网格背景层 ── */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          inset: '-16% -24% -10%',
          overflow: 'hidden',
          zIndex: 0,
        }}
      >
        <div
          style={{
            transform: 'rotate(-14deg)',
            transformOrigin: 'center center',
          }}
        >
          <motion.div
            initial={{ y: -88, scale: 1.05 }}
            animate={{ y: 28, scale: 1 }}
            transition={{ duration: 2.4, ease: [0.22, 1, 0.36, 1] }}
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: 18,
              width: '138%',
              marginLeft: '-19%',
            }}
          >
            {marqueeRows.map((row, rowIndex) => (
              <div
                key={row.key}
                style={{
                  overflow: 'hidden',
                }}
              >
                <motion.div
                  initial={{ x: 0 }}
                  animate={{ x: 'calc(-50% - 9px)' }}
                  transition={{
                    duration: row.duration,
                    ease: 'linear',
                    repeat: Infinity,
                  }}
                  style={{
                    display: 'flex',
                    gap: 18,
                    width: 'max-content',
                    marginLeft: row.offset,
                    willChange: 'transform',
                  }}
                >
                  {[0, 1].map((copyIndex) => (
                    <div
                      key={`${row.key}-copy-${copyIndex}`}
                      style={{
                        display: 'flex',
                        gap: 18,
                      }}
                    >
                      {row.tiles.map((tile, tileIndex) => (
                        <div
                          key={`${tile.key}-copy-${copyIndex}`}
                          style={{
                            position: 'relative',
                            flex: '0 0 clamp(166px, 28vw, 240px)',
                            aspectRatio: '0.88',
                            overflow: 'hidden',
                            borderRadius: 30,
                            border: '1px solid rgba(105, 54, 183, 0.55)',
                            background: 'rgba(27, 13, 54, 0.36)',
                            boxShadow:
                              '0 0 0 1px rgba(80, 33, 146, 0.42), 0 18px 42px rgba(5, 2, 16, 0.44)',
                          }}
                        >
                          <Image
                            src={tile.image_url}
                            alt={tile.title}
                            fill
                            priority={rowIndex === 0 && copyIndex === 0 && tileIndex < 2}
                            loading={
                              rowIndex === 0 && copyIndex === 0 && tileIndex < 2
                                ? 'eager'
                                : 'lazy'
                            }
                            unoptimized
                            sizes="28vw"
                            className="object-cover"
                            style={{
                              objectPosition: tile.objectPosition,
                              transform: `scale(${tile.imageScale})`,
                              opacity: row.imageOpacity,
                              filter: 'saturate(0.98) contrast(1.02) brightness(0.98)',
                            }}
                          />

                          <div
                            style={{
                              position: 'absolute',
                              inset: 0,
                              background: `linear-gradient(180deg, rgba(24, 12, 50, 0.04) 0%, rgba(30, 13, 64, ${Math.min(
                                row.overlayOpacity,
                                0.42
                              )}) 52%, rgba(18, 8, 36, ${Math.min(
                                row.overlayOpacity + 0.12,
                                0.52
                              )}) 100%)`,
                            }}
                          />
                          <div
                            style={{
                              position: 'absolute',
                              inset: 0,
                              background:
                                'radial-gradient(circle at 50% 12%, rgba(126, 70, 226, 0.1), transparent 48%)',
                            }}
                          />
                        </div>
                      ))}
                    </div>
                  ))}
                </motion.div>
              </div>
            ))}
          </motion.div>
        </div>

      </div>

      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          inset: 0,
          zIndex: 2,
          background:
            'linear-gradient(180deg, rgba(10, 6, 22, 0.03) 0%, rgba(23, 10, 47, 0.06) 28%, rgba(88, 35, 170, 0.1) 54%, rgba(10, 6, 22, 0.08) 100%)',
          pointerEvents: 'none',
        }}
      />

      {/* ── 底部渐变遮罩 ── */}
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: 620,
          zIndex: 3,
          background:
            'linear-gradient(180deg, rgba(7, 4, 16, 0) 0%, rgba(9, 5, 20, 0.08) 18%, rgba(14, 8, 28, 0.36) 46%, rgba(10, 6, 21, 0.74) 74%, #080611 100%)',
          pointerEvents: 'none',
        }}
      />

      {/* ── 底部内容区：延迟后从下往上弹出 ── */}
      <motion.div
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          zIndex: 5,
          padding: '0 24px 48px',
          display: 'flex',
          flexDirection: 'column',
          gap: 16,
        }}
        initial={{ y: 320 }}
        animate={{ y: showContent ? 0 : 320 }}
        transition={{
          duration: 2,
          ease: [0.32, 0.72, 0, 1],
        }}
      >
        {/* 标题 */}
        <h1
          style={{
            color: '#FFFFFF',
            fontSize: 36,
            fontWeight: 800,
            lineHeight: 1.2,
            margin: 0,
            fontFamily: '"PingFang SC", "Helvetica Neue", sans-serif',
          }}
        >
          萌宠星球
        </h1>

        {/* 副标题 */}
        <p
          style={{
            color: 'rgba(255,255,255,0.7)',
            fontSize: 16,
            fontWeight: 400,
            margin: 0,
            fontFamily: '"PingFang SC", "Helvetica Neue", sans-serif',
          }}
        >
          探索每一只毛茸伙伴的故事
        </p>

        {/* 统计数据 */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            height: 64,
          }}
        >
          <StatItem value="1,200+" label="宠物品种" />
          <div style={{ width: 1, height: 36, background: 'rgba(255,255,255,0.25)' }} />
          <StatItem value="50万+" label="活跃用户" />
          <div style={{ width: 1, height: 36, background: 'rgba(255,255,255,0.25)' }} />
          <StatItem value="4.9 ★" label="用户评分" />
        </div>

        {/* 立即探索按钮 */}
        <motion.button
          onClick={onExplore}
          style={{
            width: '100%',
            height: 56,
            borderRadius: 28,
            background: 'rgba(255,255,255,0.15)',
            border: '1px solid rgba(255,255,255,0.31)',
            color: '#FFFFFF',
            fontSize: 17,
            fontWeight: 600,
            cursor: 'pointer',
            fontFamily: '"PingFang SC", "Helvetica Neue", sans-serif',
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)',
          }}
          whileTap={{ scale: 0.97 }}
          whileHover={{ background: 'rgba(255,255,255,0.22)' }}
        >
          立即探索
        </motion.button>
      </motion.div>
    </div>
  )
}

// ── 统计项子组件 ──
function StatItem({ value, label }: { value: string; label: string }) {
  return (
    <div
      style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 4,
      }}
    >
      <span
        style={{
          color: '#FFFFFF',
          fontSize: 20,
          fontWeight: 700,
          fontFamily: '"PingFang SC", "Helvetica Neue", sans-serif',
        }}
      >
        {value}
      </span>
      <span
        style={{
          color: 'rgba(255,255,255,0.7)',
          fontSize: 12,
          fontWeight: 400,
          fontFamily: '"PingFang SC", "Helvetica Neue", sans-serif',
        }}
      >
        {label}
      </span>
    </div>
  )
}
