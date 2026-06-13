import React from 'react';

interface GlowEffectProps {
  color?: 'purple' | 'cyan' | 'pink' | 'indigo';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function GlowEffect({
  color = 'purple',
  size = 'md',
  className = '',
}: GlowEffectProps) {
  const colorMap = {
    purple: 'bg-purple-600/15 blur-[100px]',
    cyan: 'bg-cyan-500/10 blur-[80px]',
    pink: 'bg-pink-500/10 blur-[90px]',
    indigo: 'bg-indigo-600/15 blur-[120px]',
  };

  const sizeMap = {
    sm: 'w-48 h-48',
    md: 'w-72 h-72',
    lg: 'w-[500px] h-[500px]',
  };

  return (
    <div
      className={`
        absolute
        rounded-full
        pointer-events-none
        z-0
        ${colorMap[color]}
        ${sizeMap[size]}
        ${className}
      `}
    />
  );
}
