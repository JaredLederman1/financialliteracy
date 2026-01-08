import { motion } from 'framer-motion';
import type { ReactElement } from 'react';
import type { Avatar } from '../types';

interface AvatarPreviewProps {
  avatar: Avatar;
  size?: 'sm' | 'md' | 'lg';
}

// Hairstyle SVG paths - each returns the hair shape
const getHairstylePath = (style: string, hairColor: string): ReactElement => {
  switch (style) {
    case 'short':
      return (
        <g>
          {/* Short cropped hair */}
          <ellipse cx="100" cy="55" rx="55" ry="35" fill={hairColor} />
          <ellipse cx="100" cy="70" rx="50" ry="25" fill={hairColor} />
        </g>
      );
    case 'medium':
      return (
        <g>
          {/* Medium length hair */}
          <ellipse cx="100" cy="50" rx="58" ry="38" fill={hairColor} />
          <path
            d={`M 45 70 Q 40 100 50 130 L 50 95 Q 55 75 60 70 Z`}
            fill={hairColor}
          />
          <path
            d={`M 155 70 Q 160 100 150 130 L 150 95 Q 145 75 140 70 Z`}
            fill={hairColor}
          />
        </g>
      );
    case 'wavy':
      return (
        <g>
          {/* Wavy hair */}
          <ellipse cx="100" cy="48" rx="58" ry="38" fill={hairColor} />
          <path
            d={`M 42 65 Q 35 90 45 115 Q 50 130 42 145 L 52 145 Q 55 125 50 110 Q 45 90 52 70 Z`}
            fill={hairColor}
          />
          <path
            d={`M 158 65 Q 165 90 155 115 Q 150 130 158 145 L 148 145 Q 145 125 150 110 Q 155 90 148 70 Z`}
            fill={hairColor}
          />
        </g>
      );
    case 'long':
      return (
        <g>
          {/* Long flowing hair */}
          <ellipse cx="100" cy="50" rx="60" ry="40" fill={hairColor} />
          <path
            d={`M 40 60 Q 30 120 45 180 L 55 180 Q 50 130 55 80 Z`}
            fill={hairColor}
          />
          <path
            d={`M 160 60 Q 170 120 155 180 L 145 180 Q 150 130 145 80 Z`}
            fill={hairColor}
          />
          <path
            d={`M 55 50 Q 50 100 60 160 L 70 155 Q 65 100 68 60 Z`}
            fill={hairColor}
          />
          <path
            d={`M 145 50 Q 150 100 140 160 L 130 155 Q 135 100 132 60 Z`}
            fill={hairColor}
          />
        </g>
      );
    case 'curly':
      return (
        <g>
          {/* Curly hair with circular shapes */}
          <circle cx="60" cy="50" r="22" fill={hairColor} />
          <circle cx="100" cy="40" r="25" fill={hairColor} />
          <circle cx="140" cy="50" r="22" fill={hairColor} />
          <circle cx="50" cy="80" r="18" fill={hairColor} />
          <circle cx="150" cy="80" r="18" fill={hairColor} />
          <circle cx="75" cy="55" r="20" fill={hairColor} />
          <circle cx="125" cy="55" r="20" fill={hairColor} />
        </g>
      );
    default:
      return (
        <ellipse cx="100" cy="55" rx="55" ry="35" fill={hairColor} />
      );
  }
};

export function AvatarPreview({ avatar, size = 'md' }: AvatarPreviewProps) {
  const sizeClasses = {
    sm: 'w-24 h-24',
    md: 'w-40 h-40',
    lg: 'w-56 h-56',
  };

  // Slightly darker shade for shadow/depth
  const darkerSkin = adjustBrightness(avatar.skinColor, -20);

  return (
    <motion.div
      className={`${sizeClasses[size]} relative`}
      key={avatar.hairstyleId} // Re-animate when hairstyle changes
      initial={{ scale: 0.9, opacity: 0.8 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
    >
      <svg
        viewBox="0 0 200 220"
        className="w-full h-full"
        style={{ filter: 'drop-shadow(0 4px 6px rgba(0,0,0,0.1))' }}
      >
        {/* Neck */}
        <rect
          x="80"
          y="145"
          width="40"
          height="35"
          rx="5"
          fill={avatar.skinColor}
        />
        
        {/* Shoulders */}
        <ellipse
          cx="100"
          cy="195"
          rx="60"
          ry="30"
          fill="#6366f1" // Shirt color (indigo)
        />
        <ellipse
          cx="100"
          cy="190"
          rx="55"
          ry="25"
          fill="#818cf8" // Lighter shirt collar
        />

        {/* Back hair layer (for some styles) */}
        {['long', 'wavy'].includes(avatar.hairstyleId) && (
          <g opacity="0.3">
            {getHairstylePath(avatar.hairstyleId, avatar.hairColor)}
          </g>
        )}

        {/* Head base */}
        <ellipse
          cx="100"
          cy="95"
          rx="50"
          ry="55"
          fill={avatar.skinColor}
        />

        {/* Ears */}
        <ellipse cx="50" cy="95" rx="8" ry="12" fill={avatar.skinColor} />
        <ellipse cx="50" cy="95" rx="5" ry="8" fill={darkerSkin} />
        <ellipse cx="150" cy="95" rx="8" ry="12" fill={avatar.skinColor} />
        <ellipse cx="150" cy="95" rx="5" ry="8" fill={darkerSkin} />

        {/* Hair (front layer) */}
        {getHairstylePath(avatar.hairstyleId, avatar.hairColor)}

        {/* Eyebrows */}
        <path
          d="M 70 78 Q 80 74 90 78"
          stroke={avatar.hairColor}
          strokeWidth="3"
          fill="none"
          strokeLinecap="round"
        />
        <path
          d="M 110 78 Q 120 74 130 78"
          stroke={avatar.hairColor}
          strokeWidth="3"
          fill="none"
          strokeLinecap="round"
        />

        {/* Eyes - whites */}
        <ellipse cx="80" cy="95" rx="12" ry="10" fill="white" />
        <ellipse cx="120" cy="95" rx="12" ry="10" fill="white" />

        {/* Eyes - iris */}
        <circle cx="80" cy="96" r="7" fill={avatar.eyeColor} />
        <circle cx="120" cy="96" r="7" fill={avatar.eyeColor} />

        {/* Eyes - pupils */}
        <circle cx="80" cy="96" r="3" fill="#1a1a1a" />
        <circle cx="120" cy="96" r="3" fill="#1a1a1a" />

        {/* Eyes - highlights */}
        <circle cx="82" cy="94" r="2" fill="white" opacity="0.8" />
        <circle cx="122" cy="94" r="2" fill="white" opacity="0.8" />

        {/* Nose */}
        <ellipse cx="100" cy="110" rx="5" ry="8" fill={darkerSkin} opacity="0.4" />

        {/* Mouth - friendly smile */}
        <path
          d="M 85 125 Q 100 138 115 125"
          stroke="#c9848a"
          strokeWidth="3"
          fill="none"
          strokeLinecap="round"
        />

        {/* Cheek blush */}
        <ellipse cx="65" cy="110" rx="10" ry="6" fill="#ffb5b5" opacity="0.4" />
        <ellipse cx="135" cy="110" rx="10" ry="6" fill="#ffb5b5" opacity="0.4" />
      </svg>
    </motion.div>
  );
}

// Helper to darken a color
function adjustBrightness(hex: string, percent: number): string {
  const num = parseInt(hex.replace('#', ''), 16);
  const r = Math.min(255, Math.max(0, (num >> 16) + percent));
  const g = Math.min(255, Math.max(0, ((num >> 8) & 0x00ff) + percent));
  const b = Math.min(255, Math.max(0, (num & 0x0000ff) + percent));
  return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
}

