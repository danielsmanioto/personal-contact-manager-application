import { animations } from '@design-tokens/animations'
import { Variants, TargetAndTransition } from 'framer-motion'

export const fadeInVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.3 } },
  exit: { opacity: 0, transition: { duration: 0.2 } },
}

export const slideUpVariants: Variants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { duration: 0.3 } },
  exit: { y: 20, opacity: 0, transition: { duration: 0.2 } },
}

export const scaleVariants: Variants = {
  hidden: { scale: 0.95, opacity: 0 },
  visible: { scale: 1, opacity: 1, transition: { duration: 0.2 } },
  exit: { scale: 0.95, opacity: 0, transition: { duration: 0.15 } },
}

export const hoverScale: TargetAndTransition = {
  scale: 1.05,
  transition: { duration: 0.2 },
}

export const activeScale: TargetAndTransition = {
  scale: 0.98,
  transition: { duration: 0.1 },
}
