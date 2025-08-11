import React from "react"
import { Link } from "react-router-dom" // Changed from Next.js Link to React Router Link
import { ArrowRight, Globe, ChevronRight } from "lucide-react"

import { cn } from "../../lib/utils" // Fixed import path to use relative path

export const WrapButton = ({
  className,
  children,
  href,
  icon,
  color = "primary", // Added color prop with default
  variant = "default", // Added variant option
  ...props
}) => {
  // Define color variants based on your theme
  const colorVariants = {
    primary: "bg-primary border-primary/30 text-primary-foreground",
    success: "bg-success border-success/30 text-success-foreground",
    accent: "bg-accent border-accent/30 text-accent-foreground",
    secondary: "bg-secondary border-secondary/30 text-foreground",
  }

  // Handle icon selection
  const Icon = icon || (variant === "globe" ? Globe : ChevronRight);
  
  // Button content element to reuse in both Link and div versions
  const ButtonContent = () => (
    <div
      className={cn(
        "group cursor-pointer border relative overflow-hidden border-border/30 bg-background/80 backdrop-blur-sm gap-2 h-[56px] flex items-center p-[8px] rounded-full transition-all hover:shadow-md",
        className
      )}>
      <div
        className={cn(
          "border border-border/20 h-[40px] rounded-full flex items-center justify-center transition-all",
          colorVariants[color]
        )}>
        {variant === "globe" && <Globe className="ml-2 animate-spin-slow" size={18} />}
        <p className="font-medium tracking-tight mx-3 flex items-center gap-2 justify-center">
          {children || "Get Started"}
        </p>
      </div>
      <div
        className={cn(
          "text-muted-foreground group-hover:text-foreground group-hover:ml-1 ease-in-out transition-all size-[26px] flex items-center justify-center rounded-full border border-border",
          `group-hover:border-${color}/50`
        )}>
        <Icon 
          size={16} 
          className="group-hover:rotate-45 ease-in-out transition-all" 
        />
      </div>
      
      {/* Add subtle animated glow effect */}
      <div className="absolute -inset-1 bg-gradient-to-r from-transparent via-primary/10 to-transparent opacity-0 group-hover:opacity-100 blur-lg transition-opacity rounded-full animate-glow-slide"></div>
    </div>
  );

  // Return link or button depending on href prop
  return (
    <div className="flex items-center justify-center">
      {href ? (
        <Link to={href} {...props}>
          <ButtonContent />
        </Link>
      ) : (
        <button type="button" {...props}>
          <ButtonContent />
        </button>
      )}
    </div>
  );
}

export default WrapButton;