
import React from "react";
import { cn } from "@/lib/utils";
import { ChevronRight } from "lucide-react";

export interface BreadcrumbsItem {
  label: React.ReactNode;
  href?: string;
}

export interface BreadcrumbsProps extends React.HTMLAttributes<HTMLElement> {
  items: BreadcrumbsItem[];
  separator?: React.ReactNode;
}

const Breadcrumbs = React.forwardRef<HTMLElement, BreadcrumbsProps>(
  ({ className, items, separator, ...props }, ref) => {
    const defaultSeparator = <ChevronRight className="h-4 w-4" />;
    
    return (
      <nav
        className={cn("flex", className)}
        aria-label="Breadcrumb"
        ref={ref}
        {...props}
      >
        <ol className="flex items-center flex-wrap">
          {items.map((item, index) => (
            <li key={index} className="flex items-center">
              {index > 0 && (
                <span className="mx-2 text-muted-foreground">
                  {separator || defaultSeparator}
                </span>
              )}
              
              {item.href && index < items.length - 1 ? (
                <a
                  href={item.href}
                  className="text-sm font-medium text-muted-foreground hover:text-foreground"
                >
                  {item.label}
                </a>
              ) : (
                <span className={cn(
                  "text-sm font-medium",
                  index === items.length - 1 
                    ? "text-foreground" 
                    : "text-muted-foreground"
                )}>
                  {item.label}
                </span>
              )}
            </li>
          ))}
        </ol>
      </nav>
    );
  }
);

Breadcrumbs.displayName = "Breadcrumbs";

export default Breadcrumbs;
