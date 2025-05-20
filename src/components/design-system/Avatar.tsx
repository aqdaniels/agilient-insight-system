
import React from "react";
import { cn } from "@/lib/utils";
import { User } from "lucide-react";

export interface AvatarProps extends React.HTMLAttributes<HTMLDivElement> {
  src?: string;
  alt?: string;
  fallback?: React.ReactNode;
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  status?: "online" | "busy" | "away" | "offline";
}

const Avatar = React.forwardRef<HTMLDivElement, AvatarProps>(
  ({ className, src, alt, fallback, size = "md", status, ...props }, ref) => {
    const [imageError, setImageError] = React.useState(false);
    
    // Size styles
    const sizeStyles = {
      xs: "h-6 w-6 text-xs",
      sm: "h-8 w-8 text-sm",
      md: "h-10 w-10 text-base",
      lg: "h-12 w-12 text-lg",
      xl: "h-16 w-16 text-xl"
    };
    
    // Status colors
    const statusColors = status && {
      online: "bg-success",
      busy: "bg-error",
      away: "bg-warning",
      offline: "bg-neutral-400"
    };
    
    // Status indicator size based on avatar size
    const statusSizeStyles = {
      xs: "h-1.5 w-1.5",
      sm: "h-2 w-2",
      md: "h-2.5 w-2.5",
      lg: "h-3 w-3",
      xl: "h-4 w-4"
    };
    
    return (
      <div className="relative inline-block" ref={ref} {...props}>
        <div className={cn(
          "flex items-center justify-center rounded-full overflow-hidden bg-muted",
          sizeStyles[size],
          className
        )}>
          {src && !imageError ? (
            <img
              src={src}
              alt={alt || "Avatar"}
              className="h-full w-full object-cover"
              onError={() => setImageError(true)}
            />
          ) : fallback ? (
            <div className="flex h-full w-full items-center justify-center bg-muted">
              {fallback}
            </div>
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-muted text-muted-foreground">
              <User className="h-1/2 w-1/2" />
            </div>
          )}
        </div>
        
        {status && (
          <span className={cn(
            "absolute bottom-0 right-0 rounded-full border-2 border-background",
            statusColors[status],
            statusSizeStyles[size]
          )} />
        )}
      </div>
    );
  }
);

Avatar.displayName = "Avatar";

export default Avatar;
