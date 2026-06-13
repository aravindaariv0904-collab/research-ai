import React from 'react';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  glowColor?: 'purple' | 'cyan' | 'pink' | 'none';
  hoverable?: boolean;
}

export function Card({
  children,
  className = '',
  glowColor = 'none',
  hoverable = false,
  ...props
}: CardProps) {
  const glowClasses = {
    none: '',
    purple: 'shadow-[0_0_25px_-5px_rgba(139,92,246,0.15)] border-purple-500/20',
    cyan: 'shadow-[0_0_25px_-5px_rgba(6,182,212,0.15)] border-cyan-500/20',
    pink: 'shadow-[0_0_25px_-5px_rgba(236,72,153,0.15)] border-pink-500/20',
  };

  return (
    <div
      className={`
        glass-panel
        rounded-2xl
        p-6
        ${glowClasses[glowColor]}
        ${hoverable ? 'glass-panel-hover cursor-pointer' : ''}
        ${className}
      `}
      {...props}
    >
      {children}
    </div>
  );
}
