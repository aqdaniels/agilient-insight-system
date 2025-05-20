
import React from "react";
import { cn } from "@/lib/utils";
import Card from "./Card";

export interface DataCardProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  value: string | number;
  caption?: string;
  icon?: React.ReactNode;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  loading?: boolean;
}

const DataCard = React.forwardRef<HTMLDivElement, DataCardProps>(
  ({ className, title, value, caption, icon, trend, loading = false, ...props }, ref) => {
    return (
      <Card 
        className={cn("overflow-hidden", className)}
        ref={ref} 
        variant="bordered"
        {...props}
      >
        <div className="flex justify-between items-start">
          <div>
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            
            {loading ? (
              <div className="mt-1 h-8 w-24 rounded bg-neutral-200 dark:bg-neutral-700 animate-pulse"></div>
            ) : (
              <h3 className="text-2xl font-bold mt-1">{value}</h3>
            )}
            
            {(caption || trend) && (
              <div className="flex items-center mt-1">
                {trend && (
                  <span className={cn(
                    "text-xs font-medium flex items-center mr-1",
                    trend.isPositive ? "text-success" : "text-error"
                  )}>
                    {trend.isPositive ? "▲" : "▼"} {Math.abs(trend.value)}%
                  </span>
                )}
                
                {caption && (
                  <span className="text-xs text-muted-foreground">{caption}</span>
                )}
              </div>
            )}
          </div>
          
          {icon && (
            <div className="text-muted-foreground p-1">
              {icon}
            </div>
          )}
        </div>
      </Card>
    );
  }
);

DataCard.displayName = "DataCard";

export default DataCard;
