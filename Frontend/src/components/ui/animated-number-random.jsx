import React from "react"
import NumberFlow, { useCanAnimate } from "@number-flow/react"
import { motion } from "framer-motion"
import { ArrowUp } from "lucide-react"

import { cn } from "@/lib/utils"

const MotionNumberFlow = motion.create(NumberFlow)
const MotionArrowUp = motion.create(ArrowUp)

export default function AnimatedNumberRandom({
  value = 0,
  diff = 0
}) {
  const canAnimate = useCanAnimate()
  
  // Ensure values are numbers
  const numericValue = Number(value) || 0
  const numericDiff = Number(diff) || 0
  
  const isPositive = numericDiff > 0
  const isNegative = numericDiff < 0

  return (
    <span className="flex items-center justify-center gap-2">
      <NumberFlow
        value={numericValue}
        className="text-5xl font-semibold"
        format={{ style: "currency", currency: "USD" }}
        aria-label={`Current value: ${numericValue} dollars`}
      />
      {numericDiff !== 0 && (
        <motion.span
          className={cn(
            isPositive ? "bg-emerald-400" : "bg-red-500",
            "inline-flex items-center px-[0.3em] text-white transition-colors duration-300"
          )}
          style={{ borderRadius: 999 }}
          layout={canAnimate}
          transition={{ layout: { duration: 0.9, bounce: 0, type: "spring" } }}
          aria-label={`${isPositive ? 'Increase' : 'Decrease'} of ${Math.abs(numericDiff)} percent`}
        >
          <MotionArrowUp
            className="mr-0.5 size-[0.75em]"
            absoluteStrokeWidth
            strokeWidth={3}
            transition={{
              rotate: { type: "spring", duration: 0.5, bounce: 0 },
            }}
            animate={{ rotate: isPositive ? 0 : -180 }}
            initial={false}
            aria-hidden="true"
          />
          <MotionNumberFlow
            value={Math.abs(numericDiff)}
            className="font-semibold"
            format={{ style: "percent", maximumFractionDigits: 2 }}
            layout={canAnimate}
            layoutRoot={canAnimate}
          />
        </motion.span>
      )}
    </span>
  )
}
