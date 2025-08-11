import * as React from "react"
import { AnimatePresence, motion } from "framer-motion"
import { useOnClickOutside } from "usehooks-ts"

import { cn } from "../../lib/utils"

// Simplified animation variants that won't cause layout shifts
const buttonVariants = {
  initial: {
    width: "auto",
  },
  animate: (isSelected) => ({
    width: isSelected ? "auto" : "auto",
  }),
}

// Keep span animation but with improved positioning
const spanVariants = {
  initial: { width: 0, opacity: 0 },
  animate: { width: "auto", opacity: 1 },
  exit: { width: 0, opacity: 0 },
}

// Use a gentler transition with less bounce
const transition = { 
  type: "spring", 
  bounce: 0.1, 
  duration: 0.5 
}

export function ExpandedTabs({
  tabs,
  className,
  activeColor = "text-primary",
  inactiveColor = "text-muted-foreground",
  hoverColor = "hover:bg-muted",
  tabStyle = "",
  separatorStyle = "bg-border",
  onChange
}) {
  const [selected, setSelected] = React.useState(null)
  const outsideClickRef = React.useRef(null)

  useOnClickOutside(outsideClickRef, () => {
    setSelected(null)
    onChange?.(null)
  })

  const handleSelect = (index) => {
    setSelected(index)
    onChange?.(index)
  }

  const Separator = () => (
    <div className={cn("h-[24px] w-[1.2px]", separatorStyle)} aria-hidden="true" />
  )

  return (
    <div
      ref={outsideClickRef}
      className={cn(
        "flex items-center gap-2 rounded-2xl border bg-background p-1 shadow-sm", 
        className
      )}
    >
      {tabs.map((tab, index) => {
        if (tab.type === "separator") {
          return <Separator key={`separator-${index}`} />;
        }

        const Icon = tab.icon
        const isSelected = selected === index
        
        return (
          <motion.button
            key={tab.title}
            variants={buttonVariants}
            initial="initial"
            animate="animate"
            custom={isSelected}
            onClick={() => handleSelect(index)}
            transition={transition}
            data-selected={isSelected}
            className={cn(
              "relative flex items-center justify-center rounded-xl text-sm transition-colors duration-300",
              "h-8 px-2", // Fixed height with consistent padding
              isSelected
                ? cn("", activeColor)
                : cn(inactiveColor, hoverColor),
              tabStyle
            )}
          >
            {/* Always keep the icon centered with fixed size */}
            <div className="flex items-center justify-center w-5 h-5">
              <Icon size={18} className="flex-shrink-0" />
            </div>
            
            {/* Text container with fixed positioning */}
            <AnimatePresence initial={false}>
              {isSelected && (
                <motion.span
                  variants={spanVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  transition={transition}
                  className="overflow-hidden whitespace-nowrap ml-1.5 font-medium"
                >
                  {tab.title}
                </motion.span>
              )}
            </AnimatePresence>
          </motion.button>
        );
      })}
    </div>
  );
}