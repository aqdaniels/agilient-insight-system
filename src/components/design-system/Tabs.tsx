
import React from "react";
import { cn } from "@/lib/utils";

export interface TabItemProps {
  id: string;
  label: React.ReactNode;
  content: React.ReactNode;
  disabled?: boolean;
}

export interface TabsProps extends React.HTMLAttributes<HTMLDivElement> {
  items: TabItemProps[];
  activeTab?: string;
  onTabChange?: (tabId: string) => void;
  variant?: "default" | "pills" | "underlined";
  size?: "sm" | "md" | "lg";
}

const Tabs = React.forwardRef<HTMLDivElement, TabsProps>(
  ({ className, items, activeTab, onTabChange, variant = "default", size = "md", ...props }, ref) => {
    const [activeTabId, setActiveTabId] = React.useState<string>(activeTab || (items.length > 0 ? items[0].id : ""));

    React.useEffect(() => {
      if (activeTab) {
        setActiveTabId(activeTab);
      }
    }, [activeTab]);

    const handleTabClick = (tabId: string) => {
      setActiveTabId(tabId);
      if (onTabChange) {
        onTabChange(tabId);
      }
    };

    // Tab list styles
    const tabListStyles = "flex border-b border-border";
    
    // Tab styles based on variant and size
    const getTabStyles = (isActive: boolean, disabled: boolean = false) => {
      const baseStyles = "font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2";
      
      // Variant styles
      const variantStyles = {
        default: cn(
          "border-b-2", 
          isActive 
            ? "border-primary text-primary" 
            : "border-transparent text-muted-foreground hover:text-foreground hover:border-border"
        ),
        pills: cn(
          "rounded-md", 
          isActive 
            ? "bg-primary text-primary-foreground" 
            : "text-muted-foreground hover:text-foreground hover:bg-muted"
        ),
        underlined: cn(
          "border-b-2", 
          isActive 
            ? "border-primary text-primary" 
            : "border-transparent text-muted-foreground hover:text-foreground"
        )
      };
      
      // Size styles
      const sizeStyles = {
        sm: "text-xs px-3 py-1.5",
        md: "text-sm px-4 py-2",
        lg: "text-base px-6 py-3"
      };
      
      return cn(
        baseStyles,
        variantStyles[variant],
        sizeStyles[size],
        disabled && "opacity-50 cursor-not-allowed"
      );
    };

    return (
      <div className={cn("w-full", className)} ref={ref} {...props}>
        {/* Tab navigation */}
        <div className={tabListStyles}>
          {items.map((item) => (
            <button
              key={item.id}
              onClick={() => !item.disabled && handleTabClick(item.id)}
              className={getTabStyles(activeTabId === item.id, item.disabled)}
              disabled={item.disabled}
              type="button"
              role="tab"
              aria-selected={activeTabId === item.id}
            >
              {item.label}
            </button>
          ))}
        </div>
        
        {/* Tab content */}
        <div className="py-4">
          {items.map((item) => (
            <div
              key={item.id}
              role="tabpanel"
              className={cn(activeTabId === item.id ? "block" : "hidden")}
            >
              {item.content}
            </div>
          ))}
        </div>
      </div>
    );
  }
);

Tabs.displayName = "Tabs";

export default Tabs;
