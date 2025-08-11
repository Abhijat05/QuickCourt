import { cn } from "@/lib/utils"; 

const Badge = ({
  variant = "default",
  className,
  ...props
}) => {
  return (
    <div
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
        variant === "default" && "border-transparent bg-primary text-primary-foreground",
        variant === "secondary" && "border-transparent bg-secondary text-secondary-foreground",
        variant === "destructive" && "border-transparent bg-destructive text-destructive-foreground",
        variant === "outline" && "text-foreground",
        variant === "success" && "border-transparent bg-green-500 text-white",
        className
      )}
      {...props}
    />
  );
};

export default Badge;