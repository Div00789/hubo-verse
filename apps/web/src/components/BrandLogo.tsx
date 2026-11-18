import React from 'react';
import Link from 'next/link';

interface BrandLogoProps {
  className?: string;
  showWordmark?: boolean;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'dark' | 'light' | 'original';
  href?: string;
  onClick?: () => void;
}

export const BrandLogo: React.FC<BrandLogoProps> = ({
  className = '',
  size = 'md',
  variant = 'dark',
  href = '/',
  onClick,
}) => {
  const heightClasses = {
    sm: 'h-8',
    md: 'h-10',
    lg: 'h-12',
    xl: 'h-16',
  };

  const logoSrc =
    variant === 'dark'
      ? '/huboverse-logo-dark.png'
      : variant === 'light'
      ? '/huboverse-logo-transparent.png'
      : '/huboverse-logo.jpg';

  const content = (
    <div
      onClick={onClick}
      className={`inline-flex items-center select-none group cursor-pointer transition-transform duration-200 hover:scale-[1.03] active:scale-[0.98] ${className}`}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={logoSrc}
        alt="HuboVerse"
        className={`${heightClasses[size]} w-auto object-contain transition-transform group-hover:scale-105 duration-200 drop-shadow-sm`}
      />
    </div>
  );

  if (href) {
    return (
      <Link href={href} className="inline-flex items-center">
        {content}
      </Link>
    );
  }

  return content;
};
