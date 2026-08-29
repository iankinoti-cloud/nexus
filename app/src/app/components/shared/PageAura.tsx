import React from 'react';

export type AuraShape = 'circle' | 'oval' | 'pill' | 'diamond' | 'triangle' | 'blob';
export type AuraPosition =
  | 'top-left' | 'top-right' | 'top-center'
  | 'bottom-left' | 'bottom-right' | 'bottom-center' | 'bottom-full'
  | 'center';

export interface AuraConfig {
  color: string;
  shape: AuraShape;
  position: AuraPosition;
  size?: number;
  opacity?: number;
  blur?: number;
}

const SHAPE_BORDER_RADIUS: Record<AuraShape, string> = {
  circle:   '50%',
  oval:     '50%',
  pill:     '100vw',
  diamond:  '12%',
  triangle: '0',
  blob:     '60% 40% 30% 70% / 60% 30% 70% 40%',
};

const SHAPE_CLIP_PATH: Partial<Record<AuraShape, string>> = {
  diamond:  'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)',
  triangle: 'polygon(50% 0%, 100% 100%, 0% 100%)',
};

const WHITE_GRADIENT_AT: Record<AuraPosition, string> = {
  'top-left':      '80% 80%',
  'top-right':     '20% 80%',
  'top-center':    '50% 80%',
  'bottom-left':   '80% 20%',
  'bottom-right':  '20% 20%',
  'bottom-center': '50% 20%',
  'bottom-full':   '50% 10%',
  'center':        '50% 20%',
};

function getShapeSize(shape: AuraShape, size: number): { width: number; height: number } {
  switch (shape) {
    case 'oval':        return { width: size * 1.5, height: size * 0.65 };
    case 'pill':        return { width: size * 1.8, height: size * 0.45 };
    case 'triangle':    return { width: size, height: size * 0.86 };
    case 'blob':        return { width: size * 1.1, height: size };
    case 'bottom-full' as AuraShape: return { width: size * 2.5, height: size * 0.5 };
    default:            return { width: size, height: size };
  }
}

function getPositionStyle(position: AuraPosition, w: number, h: number): React.CSSProperties {
  const ox = w * 0.3;
  const oy = h * 0.3;
  switch (position) {
    case 'top-left':      return { top: -oy, left: -ox };
    case 'top-right':     return { top: -oy, right: -ox };
    case 'top-center':    return { top: -oy, left: '50%', transform: 'translateX(-50%)' };
    case 'bottom-left':   return { bottom: -oy, left: -ox };
    case 'bottom-right':  return { bottom: -oy, right: -ox };
    case 'bottom-center': return { bottom: -oy, left: '50%', transform: 'translateX(-50%)' };
    case 'bottom-full':   return { bottom: -oy * 2, left: '50%', transform: 'translateX(-50%)' };
    case 'center':        return { top: '50%', left: '50%', transform: 'translate(-50%, -50%)' };
  }
}

function hexToRgb(hex: string): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `${r}, ${g}, ${b}`;
}

export function PageAura({ color, shape, position, size = 600, opacity = 0.15, blur = 90 }: AuraConfig) {
  const { width, height } = getShapeSize(shape, size);
  const posStyle = getPositionStyle(position, width, height);
  const rgb = hexToRgb(color);
  const whiteAt = WHITE_GRADIENT_AT[position];

  const shapeStyle: React.CSSProperties = {
    position: 'absolute',
    width,
    height,
    borderRadius: SHAPE_BORDER_RADIUS[shape],
    ...(SHAPE_CLIP_PATH[shape] ? { clipPath: SHAPE_CLIP_PATH[shape] } : {}),
    background: `rgba(${rgb}, ${opacity})`,
    filter: `blur(${blur}px)`,
    ...posStyle,
  };

  const whiteStyle: React.CSSProperties = {
    position: 'absolute',
    inset: 0,
    background: `radial-gradient(ellipse at ${whiteAt}, rgba(255,255,255,0.13) 0%, rgba(255,255,255,0.06) 30%, transparent 65%)`,
    pointerEvents: 'none',
  };

  return (
    <div
      aria-hidden="true"
      style={{
        position: 'absolute',
        inset: 0,
        overflow: 'hidden',
        pointerEvents: 'none',
        zIndex: 0,
      }}
    >
      <div style={shapeStyle} />
      <div style={whiteStyle} />
    </div>
  );
}
