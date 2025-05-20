
import React from "react";
import { cn } from "@/lib/utils";

export interface ProgressBarProps extends React.HTMLAttributes<HTMLDivElement> {
  value: number;
  max?: number;
  variant?: "default" | "success" | "warning" | "error" | "info";
  size?: "sm" | "md" | "lg";
  showValue?: boolean;
  formatValue?: (value: number, max: number) => string;
}

const ProgressBar = React.forwardRef<HTMLDivElement, ProgressBarProps>(
  ({ 
    className, 
    value, 
    max = 100, 
    variant = "default", 
    size = "md", 
    showValue = false,
    formatValue,
    ...props 
  }, ref) => {
    const percentage = Math.min(Math.max(0, value), max) / max * 100;
    
    // Size styles
    const sizeStyles = {
      sm: "h-1",
      md: "h-2",
      lg: "h-3"
    };
    
    // Variant styles
    const variantStyles = {
      default: "bg-primary",
      success: "bg-success",
      warning: "bg-warning",
      error: "bg-error",
      info: "bg-info"
    };
    
    // Default format function
    const defaultFormatValue = (value: number, max: number) => {
      return `${Math.round(value)}%`;
    };
    
    // Use custom format function or default
    const format = formatValue || defaultFormatValue;
    
    return (
      <div className={cn("w-full", className)} ref={ref} {...props}>
        <div className="flex justify-between items-center mb-1">
          {showValue && (
            <span className="text-xs font-medium">
              {format(percentage, max)}
            </span>
          )}
        </div>
        
        <div className={cn("w-full bg-neutral-200 rounded-full overflow-hidden dark:bg-neutral-800", sizeStyles[size])}>
          <div
            className={cn(
              "h-full rounded-full transition-all",
              variantStyles[variant]
            )}
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>
    );
  }
);

ProgressBar.displayName = "ProgressBar";

export default ProgressBar;
