import { cn } from "../../lib/utils";  // Use the alias defined in jsconfig.json

const Alert = ({
  variant = "default",
  className,
  children,
  ...props
}) => {
  return (
    <div
      role="alert"
      className={cn(
        "relative w-full rounded-lg border p-4 [&>svg]:absolute [&>svg]:left-4 [&>svg]:top-4 [&>svg+div]:translate-y-[-3px] [&:has(svg)]:pl-11",
        variant === "default" && "bg-background text-foreground",
        variant === "destructive" && "border-destructive/50 text-destructive dark:border-destructive [&>svg]:text-destructive",
        variant === "success" && "border-green-500/50 text-green-700 dark:text-green-400 [&>svg]:text-green-500",
        variant === "warning" && "border-yellow-500/50 text-yellow-700 dark:text-yellow-400 [&>svg]:text-yellow-500",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

const AlertTitle = ({ className, ...props }) => {
  return (
    <h3
      className={cn("text-lg font-semibold", className)}
      {...props}
    />
  );
};

const AlertDescription = ({ className, ...props }) => {
  return (
    <p
      className={cn("text-sm text-muted-foreground", className)}
      {...props}
    />
  );
};

export { Alert, AlertTitle, AlertDescription };