import React from 'react';
import { cn } from "@/lib/utils";

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'neon' | 'success';
}

export default function GlassCard({ children, className, variant = 'default' }: GlassCardProps) {
  const variantClasses = {
    default: 'glass-panel',
    neon: 'glass-panel border-[#00f2ff]/40 shadow-[0_0_20px_rgba(0,242,255,0.15)]',
    success: 'glass-panel border-[#39ff14]/40 shadow-[0_0_20px_rgba(57,255,20,0.15)]'
  };

  return (
    <div className={cn(
      "p-6 rounded-2xl overflow-hidden transition-all duration-500",
      variantClasses[variant],
      className
    )}>
      {children}
    </div>
  );
}
