'use client'

import { motion } from 'framer-motion'
import { ReactNode } from 'react'

interface MotionWrapperProps {
  children: ReactNode
  initial?: any
  animate?: any
  whileInView?: any
  transition?: any
  viewport?: any
  className?: string
}

export default function MotionWrapper({
  children,
  initial,
  animate,
  whileInView,
  transition,
  viewport,
  className,
}: MotionWrapperProps) {
  return (
    <motion.div
      initial={initial}
      animate={animate}
      whileInView={whileInView}
      transition={transition}
      viewport={viewport}
      className={className}
    >
      {children}
    </motion.div>
  )
}
