import React, { forwardRef, type ButtonHTMLAttributes, useState } from 'react';
import { cn } from '../../lib/utils';
import { Loader2 } from 'lucide-react';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'secondary' | 'outline' | 'ghost' | 'destructive';
  size?: 'sm' | 'md' | 'lg' | 'icon';
  isLoading?: boolean;
  asChild?: boolean;
  children: React.ReactNode;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'default', size = 'md', isLoading, disabled, asChild, children, onClick, ...props }, ref) => {
    const [ripples, setRipples] = useState<{ x: number; y: number; id: number }[]>([]);
    
    const baseStyles = 'relative inline-flex items-center justify-center rounded-2xl font-bold transition-all duration-300 focus-visible:outline-none focus:ring-4 focus:ring-primary/20 disabled:pointer-events-none disabled:opacity-50 overflow-hidden select-none active:scale-95 group';
    
    const variants = {
      default: 'bg-primary text-primary-foreground shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 hover:-translate-y-0.5',
      secondary: 'bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80 hover:-translate-y-0.5',
      outline: 'border-2 border-primary/20 bg-background hover:border-primary/50 hover:bg-primary/5 hover:text-primary hover:-translate-y-0.5',
      ghost: 'hover:bg-primary/5 hover:text-primary',
      destructive: 'bg-destructive/10 text-destructive border-2 border-destructive/20 hover:bg-destructive hover:text-destructive-foreground hover:shadow-lg hover:shadow-destructive/20 hover:-translate-y-0.5',
    };
    
    const sizes = {
      sm: 'h-10 px-4 text-sm',
      md: 'h-12 px-6 text-base',
      lg: 'h-14 px-8 text-lg',
      icon: 'h-12 w-12 p-0 rounded-2xl',
    };

    const handleRipple = (e: React.MouseEvent<HTMLButtonElement>) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const id = Date.now();
        
        setRipples(prev => [...prev, { x, y, id }]);
        setTimeout(() => {
            setRipples(prev => prev.filter(ripple => ripple.id !== id));
        }, 600);
        
        onClick?.(e);
    };

    if (asChild && React.isValidElement(children)) {
      const child = children as React.ReactElement<any>;
      return React.cloneElement(child, {
        ...props,
        ...child.props,
        className: cn(
          baseStyles,
          variants[variant],
          sizes[size],
          className,
          child.props.className
        ),
      });
    }

    return (
      <button
        className={cn(
          baseStyles,
          variants[variant],
          sizes[size],
          className
        )}
        ref={ref}
        disabled={disabled || isLoading}
        onClick={handleRipple}
        {...props}
      >
        {/* Ripple container */}
        <span className="absolute inset-0 pointer-events-none overflow-hidden">
            {ripples.map(ripple => (
                <span 
                    key={ripple.id}
                    className="absolute bg-white/30 rounded-full animate-ripple pointer-events-none transform -translate-x-1/2 -translate-y-1/2"
                    style={{
                        left: ripple.x,
                        top: ripple.y,
                        width: '10px',
                        height: '10px',
                    }}
                />
            ))}
        </span>

        {isLoading ? (
          <Loader2 className="mr-2 h-5 w-5 animate-spin" />
        ) : null}
        <span className="relative z-10 flex items-center justify-center gap-2">
            {children}
        </span>
      </button>
    );
  }
);

Button.displayName = 'Button';

export { Button };

