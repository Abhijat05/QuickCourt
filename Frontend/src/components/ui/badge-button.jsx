import React from "react"
import { SparklesIcon } from "lucide-react"

import { Badge } from "./Badge"

const BadgeButton = ({
  icon = SparklesIcon,
  text = "Component Preview",
  variant = "outline",
  className = "",
}) => {
  const Icon = icon;
  
  return (
    <Badge
      variant={variant}
      className={`mb-3 cursor-pointer rounded-[14px] border border-black/10 bg-white text-base ${className}`}
    >
      <Icon className="mr-2 fill-[#EEBDE0] stroke-1 text-neutral-800" />
      {" "}
      {text}
    </Badge>
  );
}

export default BadgeButton
