import { forwardRef } from "react";
import { cn } from "../../lib/utils";

const Select = forwardRef(({ className, error, ...props }, ref) => {
  return (
    <select
      className={cn(
        "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50",
        error && "border-destructive focus:ring-destructive",
        className
      )}
      ref={ref}
      {...props}
    />
  );
});

Select.displayName = "Select";

export default Select;