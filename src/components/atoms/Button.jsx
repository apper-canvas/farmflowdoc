import React, { forwardRef } from "react";
import { cn } from "@/utils/cn";
import ApperIcon from "@/components/ApperIcon";

const Button = forwardRef(({ 
  children, 
  className, 
  variant = "primary", 
  size = "default",
  icon,
  iconPosition = "left",
  disabled = false,
  ...props 
}, ref) => {
  const variants = {
    primary: "btn-primary",
    secondary: "btn-secondary",
    outline: "border-2 border-primary text-primary hover:bg-primary hover:text-white bg-transparent",
    ghost: "text-primary hover:bg-primary/10 bg-transparent",
    danger: "bg-gradient-to-r from-error to-error/90 hover:from-error/90 hover:to-error text-white"
  };

  const sizes = {
    sm: "px-4 py-2 text-sm min-h-[36px]",
    default: "px-6 py-3 min-h-[44px]",
    lg: "px-8 py-4 text-lg min-h-[52px]"
  };

  return (
    <button
      ref={ref}
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-lg font-semibold transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100",
        variants[variant],
        sizes[size],
        className
      )}
      disabled={disabled}
      {...props}
    >
      {icon && iconPosition === "left" && <ApperIcon name={icon} size={18} />}
      {children}
      {icon && iconPosition === "right" && <ApperIcon name={icon} size={18} />}
    </button>
  );
});

Button.displayName = "Button";

export default Button;