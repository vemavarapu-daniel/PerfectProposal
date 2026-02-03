
import React, { useEffect, useState } from 'react';

const HEART_SVG = `<svg viewBox="0 0 32 32" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M16 28.5L14.1 26.7C7.25 20.5 2.75 16.4 2.75 11.35C2.75 7.2 5.95 4 10.1 4C12.45 4 14.7 5.1 16 6.85C17.3 5.1 19.55 4 21.9 4C26.05 4 29.25 7.2 29.25 11.35C29.25 16.4 24.75 20.5 17.9 26.7L16 28.5Z"/></svg>`;
const FLOWER_SVG = `<svg viewBox="0 0 32 32" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M16 2C16 2 13 8 8 8C3 8 2 12 2 14C2 16 4 17 6 17C4 19 3 21 3 23C3 25 5 28 8 28C13 28 16 22 16 22C16 22 19 28 24 28C27 28 29 25 29 23C29 21 28 19 26 17C28 17 30 16 30 14C30 12 29 8 24 8C19 8 16 2 16 2Z"/></svg>`;

export const BackgroundDecorations: React.FC = () => {
  const [particles, setParticles] = useState<{ id: number; left: number; size: number; duration: number; delay: number; type: 'heart' | 'flower' }[]>([]);

  useEffect(() => {
    const newParticles = Array.from({ length: 20 }).map((_, i) => ({
      id: i,
      left: Math.random() * 100,
      size: 15 + Math.random() * 25,
      duration: 6 + Math.random() * 8,
      delay: Math.random() * 5,
      type: Math.random() > 0.5 ? 'heart' as const : 'flower' as const
    }));
    setParticles(newParticles);
  }, []);

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      {particles.map((p) => (
        <div
          key={p.id}
          className="heart-particle text-pink-300/40"
          style={{
            left: `${p.left}%`,
            width: `${p.size}px`,
            height: `${p.size}px`,
            animationDuration: `${p.duration}s`,
            animationDelay: `${p.delay}s`,
          }}
          dangerouslySetInnerHTML={{ __html: p.type === 'heart' ? HEART_SVG : FLOWER_SVG }}
        />
      ))}
    </div>
  );
};
