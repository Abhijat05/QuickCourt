import { useState } from "react";
import { cn } from "../../lib/utils";

export function Tooltip({ children, content, className, side = "top", align = "center" }) {
  const [isVisible, setIsVisible] = useState(false);

  // Calculate positioning based on side and align props
  const getPositionClasses = () => {
    const positions = {
      top: "bottom-full mb-2",
      bottom: "top-full mt-2",
      left: "right-full mr-2",
      right: "left-full ml-2"
    };
    
    const alignments = {
      top: {
        start: "left-0",
        center: "left-1/2 -translate-x-1/2",
        end: "right-0"
      },
      bottom: {
        start: "left-0",
        center: "left-1/2 -translate-x-1/2",
        end: "right-0"
      },
      left: {
        start: "top-0",
        center: "top-1/2 -translate-y-1/2",
        end: "bottom-0"
      },
      right: {
        start: "top-0",
        center: "top-1/2 -translate-y-1/2",
        end: "bottom-0"
      }
    };
    
    return `${positions[side]} ${alignments[side][align]}`;
  };

  return (
    <div className="relative inline-block">
      <div
        onMouseEnter={() => setIsVisible(true)}
        onMouseLeave={() => setIsVisible(false)}
        onFocus={() => setIsVisible(true)}
        onBlur={() => setIsVisible(false)}
      >
        {children}
      </div>
      
      {isVisible && (
        <div
          className={cn(
            "absolute z-50 px-2 py-1 text-xs font-medium text-white bg-gray-900 rounded-md shadow-sm pointer-events-none transition-opacity duration-200",
            getPositionClasses(),
            className
          )}
          role="tooltip"
        >
          {content}
          <div 
            className={cn(
              "absolute w-2 h-2 bg-gray-900 rotate-45",
              side === "top" && "bottom-[-4px] left-1/2 -translate-x-1/2",
              side === "bottom" && "top-[-4px] left-1/2 -translate-x-1/2",
              side === "left" && "right-[-4px] top-1/2 -translate-y-1/2",
              side === "right" && "left-[-4px] top-1/2 -translate-y-1/2"
            )}
          />
        </div>
      )}
    </div>
  );
}