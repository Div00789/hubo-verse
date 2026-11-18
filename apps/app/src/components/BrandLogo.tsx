import React from 'react';

interface BrandLogoProps {
  className?: string;
  showWordmark?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export const BrandLogo: React.FC<BrandLogoProps> = ({
  className = '',
  showWordmark = true,
  size = 'md',
}) => {
  const iconSizes = {
    sm: 'w-7 h-7',
    md: 'w-9 h-9',
    lg: 'w-12 h-12',
  };

  const textSizes = {
    sm: 'text-lg',
    md: 'text-2xl',
    lg: 'text-3xl',
  };

  return (
    <div className={`flex items-center gap-2.5 font-bold tracking-tight select-none ${className}`}>
      {/* Dynamic Orbital 'H' Logo */}
      <div className={`relative flex items-center justify-center ${iconSizes[size]}`}>
        <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
          {/* Orbital Ellipse Back Half */}
          <ellipse
            cx="50"
            cy="50"
            rx="46"
            ry="18"
            transform="rotate(-25 50 50)"
            stroke="#FF5C00"
            strokeWidth="5"
            strokeLinecap="round"
            strokeDasharray="90 30"
          />
          {/* Planetary Node Left */}
          <circle cx="16" cy="62" r="6" fill="#FF5C00" />

          {/* Bold Slanted 'H' Character */}
          <path
            d="M26 22 H40 L34 46 H54 L60 22 H74 L62 78 H48 L54 54 H34 L28 78 H14 L26 22 Z"
            fill="#F8FAFC"
          />

          {/* Dynamic Orange Swoosh on H crossbar */}
          <path
            d="M37 46 H57 L55 54 H35 L37 46 Z"
            fill="#FF5C00"
          />

          {/* Orbital Ellipse Front Half */}
          <ellipse
            cx="50"
            cy="50"
            rx="46"
            ry="18"
            transform="rotate(-25 50 50)"
            stroke="#FF7A00"
            strokeWidth="5"
            strokeLinecap="round"
            strokeDasharray="50 140"
          />
          {/* Planetary Node Right */}
          <circle cx="84" cy="38" r="6" fill="#FF7A00" />
        </svg>
      </div>

      {showWordmark && (
        <span className={`${textSizes[size]} tracking-tight font-extrabold flex items-baseline`}>
          <span className="text-white">Hubo</span>
          <span className="text-[#FF5C00] ml-0.5">Verse</span>
        </span>
      )}
    </div>
  );
};
