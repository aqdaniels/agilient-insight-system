
import React from "react";
import { cn } from "@/lib/utils";

export interface StatusIndicatorProps extends React.HTMLAttributes<HTMLDivElement> {
  status: "online" | "busy" | "away" | "offline" | "success" | "warning" | "error";
  size?: "sm" | "md" | "lg";
  withPulse?: boolean;
  label?: string;
}

const StatusIndicator = React.forwardRef<HTMLDivElement, StatusIndicatorProps>(
  ({ className, status, size = "md", withPulse = false, label, ...props }, ref) => {
    // Size styles
    const sizeStyles = {
      sm: "h-2 w-2",
      md: "h-3 w-3",
      lg: "h-4 w-4"
    };
    
    // Status colors
    const statusColors = {
      online: "bg-success",
      busy: "bg-error",
      away: "bg-warning",
      offline: "bg-neutral-400",
      success: "bg-success",
      warning: "bg-warning",
      error: "bg-error"
    };
    
    // Pulse animation
    const pulseAnimation = withPulse ? "animate-pulse" : "";
    
    return (
      <div className={cn("flex items-center", className)} ref={ref} {...props}>
        <span className={cn(
          "rounded-full",
          sizeStyles[size],
          statusColors[status],
          pulseAnimation
        )} />
        
        {label && (
          <span className="ml-2 text-sm">{label}</span>
        )}
      </div>
    );
  }
);

StatusIndicator.displayName = "StatusIndicator";

export default StatusIndicator;
