import React from 'react';
import { cn } from '../lib/utils';
import { motion } from 'motion/react';

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  hoverEffect?: boolean;
}

export const GlassCard: React.FC<GlassCardProps> = ({ children, className, hoverEffect = true }) => {
  return (
    <motion.div
      whileHover={hoverEffect ? { scale: 1.01, backgroundColor: 'rgba(255, 255, 255, 0.08)' } : {}}
      className={cn(
        "glass-card p-6 overflow-hidden relative",
        className
      )}
    >
      {/* Decorative gradient overlay */}
      <div className="absolute inset-0 premium-gradient pointer-events-none opacity-50" />
      <div className="relative z-10">{children}</div>
    </motion.div>
  );
};

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
}

export const Button: React.FC<ButtonProps> = ({ 
  children, 
  className, 
  variant = 'primary', 
  size = 'md',
  ...props 
}) => {
  const variants = {
    primary: "bg-white text-black hover:bg-white/90",
    secondary: "bg-gold text-white hover:bg-gold/90",
    outline: "border border-white/20 text-white hover:bg-white/10",
    ghost: "text-white/70 hover:text-white hover:bg-white/5",
  };
  
  const sizes = {
    sm: "px-3 py-1.5 text-xs",
    md: "px-6 py-2.5 text-sm",
    lg: "px-10 py-4 text-base font-medium",
  };

  return (
    <button
      className={cn(
        "rounded-full transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2",
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
};
