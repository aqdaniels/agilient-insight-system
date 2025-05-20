
import React from "react";
import { cn } from "@/lib/utils";
import { CheckCircle, XCircle } from "lucide-react";

export interface FormFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  helperText?: string;
  error?: string;
  success?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  variant?: "default" | "filled";
}

const FormField = React.forwardRef<HTMLInputElement, FormFieldProps>(
  ({ className, label, helperText, error, success, leftIcon, rightIcon, variant = "default", ...props }, ref) => {
    // Form field container
    const containerStyles = "flex flex-col space-y-1.5";
    
    // Label styles
    const labelStyles = "text-sm font-medium text-foreground";
    
    // Base input styles
    const baseInputStyles = "w-full rounded-md focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-0 disabled:cursor-not-allowed disabled:opacity-50";
    
    // Variant styles
    const variantStyles = {
      default: "border border-input placeholder:text-muted-foreground",
      filled: "bg-neutral-100 dark:bg-neutral-800 border-0"
    };
    
    // State styles
    const stateStyles = error 
      ? "border-error focus:ring-error/20" 
      : success 
        ? "border-success focus:ring-success/20" 
        : "focus:border-primary";
    
    // Icon container styles
    const hasLeftIcon = !!leftIcon;
    const hasRightIcon = !!rightIcon || !!error || !!success;
    const paddingLeft = hasLeftIcon ? "pl-10" : "";
    const paddingRight = hasRightIcon ? "pr-10" : "";
    
    return (
      <div className={containerStyles}>
        {label && (
          <label className={labelStyles}>
            {label}
          </label>
        )}
        
        <div className="relative">
          {leftIcon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
              {leftIcon}
            </div>
          )}
          
          <input
            className={cn(
              baseInputStyles,
              variantStyles[variant],
              stateStyles,
              paddingLeft,
              paddingRight,
              "h-10 px-3 py-2",
              className
            )}
            ref={ref}
            {...props}
          />
          
          {error && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-error">
              <XCircle size={18} />
            </div>
          )}
          
          {!error && success && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-success">
              <CheckCircle size={18} />
            </div>
          )}
          
          {!error && !success && rightIcon && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
              {rightIcon}
            </div>
          )}
        </div>
        
        {(helperText || error || success) && (
          <div className={cn(
            "text-xs",
            error ? "text-error" : success ? "text-success" : "text-muted-foreground"
          )}>
            {error || success || helperText}
          </div>
        )}
      </div>
    );
  }
);

FormField.displayName = "FormField";

export default FormField;
