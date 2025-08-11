import React from "react"
import { MoonIcon, SunIcon } from "lucide-react"
import { useTheme } from "next-themes"

// Fix the import path to use relative path instead of alias
import Button from "./Button"

import { createAnimation } from "./theme-animations";

export default function ThemeToggleButton({
  variant = "circle-blur",
  start = "top-left",
  showLabel = false,
  url = ""
}) {
  const { theme, setTheme } = useTheme()

  const styleId = "theme-transition-styles"

  const updateStyles = React.useCallback((css, name) => {
    if (typeof window === "undefined") return

    let styleElement = document.getElementById(styleId)

    if (!styleElement) {
      styleElement = document.createElement("style")
      styleElement.id = styleId
      document.head.appendChild(styleElement)
    }

    styleElement.textContent = css
  }, [])

  const toggleTheme = React.useCallback(() => {
    const animation = createAnimation(variant, start, url)

    updateStyles(animation.css, animation.name)

    if (typeof window === "undefined") return

    const switchTheme = () => {
      setTheme(theme === "light" ? "dark" : "light")
    }

    // Check if the browser supports view transitions
    if (!document.startViewTransition) {
      switchTheme()
      return
    }

    // Use view transitions API for smooth theme change animation
    document.startViewTransition(switchTheme)
  }, [theme, setTheme, variant, start, url, updateStyles])

  return (
    <Button
      onClick={toggleTheme}
      variant="ghost"
      size="icon"
      className="w-9 p-0 h-9 relative group"
      aria-label="Theme Toggle Button">
      <SunIcon
        className="size-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
      <MoonIcon
        className="absolute size-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
      <span className="sr-only">Theme Toggle</span>
      {showLabel && (
        <>
          <span
            className="hidden group-hover:block border rounded-full px-2 absolute -top-10">
            variant = {variant}
          </span>
          <span
            className="hidden group-hover:block border rounded-full px-2 absolute -bottom-10">
            start = {start}
          </span>
        </>
      )}
    </Button>
  );
}
