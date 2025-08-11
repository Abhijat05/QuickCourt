import { Link } from "react-router-dom";
import { cn } from "../../lib/utils"; // Updated to use relative path

const Breadcrumb = ({
  className,
  ...props
}) => {
  return (
    <nav
      aria-label="breadcrumb"
      className={cn("flex", className)}
      {...props}
    />
  );
};

const BreadcrumbList = ({
  className,
  ...props
}) => {
  return (
    <ol
      className={cn(
        "flex flex-wrap items-center gap-1.5 break-words text-sm text-muted-foreground",
        className
      )}
      {...props}
    />
  );
};

const BreadcrumbItem = ({
  className,
  ...props
}) => {
  return (
    <li
      className={cn("inline-flex items-center gap-1.5", className)}
      {...props}
    />
  );
};

const BreadcrumbLink = ({
  asChild,
  className,
  to,
  ...props
}) => {
  return (
    <Link
      to={to}
      className={cn("hover:text-foreground", className)}
      {...props}
    />
  );
};

const BreadcrumbSeparator = ({
  children = "/",
  className,
  ...props
}) => {
  return (
    <li
      role="presentation"
      aria-hidden="true"
      className={cn("text-muted-foreground", className)}
      {...props}
    >
      {children}
    </li>
  );
};

const BreadcrumbEllipsis = ({
  className,
  ...props
}) => {
  return (
    <span
      role="presentation"
      aria-hidden="true"
      className={cn("flex h-9 w-9 items-center justify-center", className)}
      {...props}
    >
      &#8230;
    </span>
  );
};

export {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
  BreadcrumbEllipsis,
};