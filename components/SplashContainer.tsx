'use client'

/**
 * SplashContainer
 *
 * 负责管理「启动页 → 首页」三段式切换：
 *   1. splash   — 首屏展示启动页，首页停在视口下方
 *   2. sliding  — 首页从底部滑入，覆盖启动页
 *   3. done     — 移除启动页，仅保留首页
 *
 * 首页内容始终保留在同一个 DOM 节点中，只是根据阶段调整位置，
 * 这样首屏不会先闪出首页，再切回启动页。
 */

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import SplashScreen from './SplashScreen'
import type { SplashGridImageItem } from '@/lib/supabase'

type Phase = 'splash' | 'sliding' | 'done'

interface SplashContainerProps {
  children: React.ReactNode
  splashGridImages: SplashGridImageItem[]
}

export default function SplashContainer({
  children,
  splashGridImages,
}: SplashContainerProps) {
  const [phase, setPhase] = useState<Phase>('splash')

  return (
    <div className="relative w-full h-screen overflow-hidden">
      <AnimatePresence>
        {phase !== 'done' && (
          <motion.div
            key="splash-screen"
            className="absolute inset-0 z-10"
            initial={false}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
          >
            <SplashScreen
              gridImages={splashGridImages}
              onExplore={() => setPhase('sliding')}
            />
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        className="absolute inset-0 z-20 overflow-auto"
        style={{
          background: '#0d0d1a',
          pointerEvents: phase === 'splash' ? 'none' : 'auto',
        }}
        initial={false}
        animate={{ y: phase === 'splash' ? '100%' : 0 }}
        transition={
          phase === 'sliding'
            ? { duration: 0.7, ease: [0.22, 1, 0.36, 1] }
            : { duration: 0 }
        }
        onAnimationComplete={() => {
          if (phase === 'sliding') {
            setPhase('done')
          }
        }}
      >
        {children}
      </motion.div>
    </div>
  )
}
