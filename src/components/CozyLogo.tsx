import React from 'react';

interface CozyLogoProps {
  className?: string;
  size?: number;
}

export const CozyLogo: React.FC<CozyLogoProps> = ({ className = '', size = 52 }) => {
  return (
    <div 
      className={`relative inline-flex items-center justify-center shrink-0 ${className}`}
      style={{ width: size, height: size }}
      aria-label="Cozy Knot Logo"
    >
      <svg
        viewBox="0 0 200 200"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full drop-shadow-sm select-none"
      >
        {/* Soft Circular Background */}
        <circle cx="100" cy="100" r="96" fill="#FCEAE8" stroke="#F5D5D3" strokeWidth="2" />
        
        {/* Woven Yarn Ball Texture */}
        <g opacity="0.95">
          {/* Base Yarn Silhouette */}
          <circle cx="100" cy="100" r="76" fill="#FFA5A3" />
          
          {/* Swirling Yarn Strands */}
          <path
            d="M 40 90 Q 75 55 120 70 Q 155 80 160 115"
            stroke="#F78B88"
            strokeWidth="11"
            strokeLinecap="round"
          />
          <path
            d="M 50 120 Q 90 145 145 130 Q 165 110 160 85"
            stroke="#EF7774"
            strokeWidth="12"
            strokeLinecap="round"
          />
          <path
            d="M 70 50 Q 110 80 100 135 Q 90 160 65 150"
            stroke="#FFB3B1"
            strokeWidth="10"
            strokeLinecap="round"
          />
          <path
            d="M 85 45 Q 140 60 145 110 Q 130 155 90 160"
            stroke="#F59390"
            strokeWidth="11"
            strokeLinecap="round"
          />
          <path
            d="M 45 75 Q 85 115 135 110 Q 160 90 150 65"
            stroke="#FCAAA8"
            strokeWidth="9"
            strokeLinecap="round"
          />
          <path
            d="M 60 135 Q 100 110 130 145"
            stroke="#F07C79"
            strokeWidth="10"
            strokeLinecap="round"
          />
          <path
            d="M 35 105 Q 65 85 95 100 Q 125 125 160 98"
            stroke="#FFBCBA"
            strokeWidth="8"
            strokeLinecap="round"
          />
        </g>

        {/* Crochet Hook piercing diagonally */}
        <g transform="rotate(-36 100 100)">
          {/* Hook Shaft */}
          <rect
            x="20"
            y="93"
            width="155"
            height="14"
            rx="7"
            fill="#FFFDF9"
            stroke="#EFE5DB"
            strokeWidth="1.5"
          />
          {/* Hook Throat & Tip */}
          <path
            d="M 24 93 C 14 93 10 98 12 102 C 14 105 19 104 22 102 C 25 100 28 97 32 97"
            fill="#FFFDF9"
            stroke="#DDD4C8"
            strokeWidth="1.5"
          />
          {/* Grip / Handle accent */}
          <rect
            x="145"
            y="93"
            width="30"
            height="14"
            rx="4"
            fill="#E0D2C7"
          />
        </g>

        {/* Script Brand Text: Cozy knot */}
        <g>
          <text
            x="100"
            y="96"
            textAnchor="middle"
            fontFamily="'Reenie Beanie', 'Playfair Display', cursive, serif"
            fontSize="38"
            fontWeight="bold"
            fill="#3F2721"
            className="tracking-wide"
          >
            Cozy
          </text>
          <text
            x="104"
            y="126"
            textAnchor="middle"
            fontFamily="'Reenie Beanie', 'Playfair Display', cursive, serif"
            fontSize="35"
            fontWeight="bold"
            fill="#3F2721"
            className="tracking-wide"
          >
            knot
          </text>
        </g>
      </svg>
    </div>
  );
};
