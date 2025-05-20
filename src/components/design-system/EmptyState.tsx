
import React from "react";
import { cn } from "@/lib/utils";
import Button from "./Button";

export interface EmptyStateProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string;
  description?: string;
  icon?: React.ReactNode;
  action?: {
    label: string;
    onClick: () => void;
  };
  variant?: "default" | "compact" | "card";
}

const EmptyState = React.forwardRef<HTMLDivElement, EmptyStateProps>(
  ({ className, title, description, icon, action, variant = "default", ...props }, ref) => {
    // Base styles
    const baseStyles = "flex flex-col items-center justify-center text-center";
    
    // Variant styles
    const variantStyles = {
      default: "py-16 px-4",
      compact: "py-8 px-4",
      card: "py-12 px-4 border border-dashed rounded-lg"
    };
    
    return (
      <div
        className={cn(
          baseStyles,
          variantStyles[variant],
          className
        )}
        ref={ref}
        {...props}
      >
        {icon && (
          <div className="text-muted-foreground mb-4">{icon}</div>
        )}
        
        {title && (
          <h3 className="text-lg font-medium mb-2">{title}</h3>
        )}
        
        {description && (
          <p className="text-sm text-muted-foreground max-w-md mb-4">{description}</p>
        )}
        
        {action && (
          <Button onClick={action.onClick} variant="primary">
            {action.label}
          </Button>
        )}
      </div>
    );
  }
);

EmptyState.displayName = "EmptyState";

export default EmptyState;
