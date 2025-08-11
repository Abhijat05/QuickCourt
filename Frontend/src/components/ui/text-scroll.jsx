import React, { useEffect, useRef } from "react";
import { cn } from "../../lib/utils";

export function TextScroll({
  messages,
  className,
  speed = "normal",
  backgroundColor = "bg-primary/10",
  textColor = "text-primary",
  icon,
  direction = "left"
}) {
  const containerRef = useRef(null);
  
  // Control animation speed
  const speedMap = {
    slow: "30s",
    normal: "20s",
    fast: "10s"
  };
  
  // Create a CSS animation for the scrolling text
  useEffect(() => {
    if (!containerRef.current) return;
    
    const scrollWidth = containerRef.current.scrollWidth;
    const containerWidth = containerRef.current.clientWidth;
    
    // Only apply animation if content is wider than container
    if (scrollWidth > containerWidth) {
      containerRef.current.style.animationDuration = speedMap[speed] || speedMap.normal;
    } else {
      containerRef.current.style.animationPlayState = "paused";
      containerRef.current.style.justifyContent = "center";
    }
  }, [speed, messages]);

  return (
    <div 
      className={cn(
        "relative overflow-hidden py-2 px-4",
        backgroundColor,
        className
      )}
    >
      <div className="container mx-auto flex items-center">
        {icon && (
          <div className={`mr-3 flex-shrink-0 ${textColor}`}>
            {icon}
          </div>
        )}
        
        <div className="overflow-hidden relative flex-1">
          <div 
            ref={containerRef}
            className={cn(
              "whitespace-nowrap inline-flex items-center",
              textColor,
              direction === "left" ? "animate-scroll-left" : "animate-scroll-right"
            )}
          >
            {messages.map((message, i) => (
              <React.Fragment key={i}>
                <span className="font-medium">{message}</span>
                {i < messages.length - 1 && (
                  <span className="mx-4 text-lg">•</span>
                )}
              </React.Fragment>
            ))}
            
            {/* Duplicate content for seamless looping */}
            {messages.length > 0 && (
              <>
                <span className="mx-8" aria-hidden="true">
                  ⋯
                </span>
                {messages.map((message, i) => (
                  <React.Fragment key={`dup-${i}`}>
                    <span className="font-medium" aria-hidden="true">{message}</span>
                    {i < messages.length - 1 && (
                      <span className="mx-4 text-lg" aria-hidden="true">•</span>
                    )}
                  </React.Fragment>
                ))}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
