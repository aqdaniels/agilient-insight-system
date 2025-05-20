
import React from "react";
import { cn } from "@/lib/utils";

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "outline" | "success" | "warning" | "error" | "info";
  size?: "sm" | "md" | "lg";
}

const Badge = React.forwardRef<HTMLDivElement, BadgeProps>(
  ({ className, variant = "default", size = "md", ...props }, ref) => {
    // Base badge styles
    const baseStyles = "inline-flex items-center font-medium rounded-full";
    
    // Variant styles
    const variantStyles = {
      default: "bg-primary/10 text-primary",
      outline: "border border-border",
      success: "bg-success/15 text-success",
      warning: "bg-warning/15 text-warning",
      error: "bg-error/15 text-error",
      info: "bg-info/15 text-info"
    };
    
    // Size styles
    const sizeStyles = {
      sm: "text-xs px-2 py-0.5",
      md: "text-sm px-2.5 py-0.5",
      lg: "text-base px-3 py-1"
    };
    
    return (
      <div
        className={cn(
          baseStyles,
          variantStyles[variant],
          sizeStyles[size],
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);

Badge.displayName = "Badge";

export default Badge;
