
import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';

interface ConfettiProps {
  isActive: boolean;
}

const colors = ['#fbbf24', '#3b82f6', '#ec4899', '#10b981', '#f59e0b'];

export const Confetti: React.FC<ConfettiProps> = ({ isActive }) => {
  const [particles, setParticles] = useState<{ id: number; x: number; color: string; animationDelay: string; left: string }[]>([]);

  useEffect(() => {
    if (isActive) {
      const newParticles = Array.from({ length: 50 }).map((_, i) => ({
        id: i,
        x: Math.random() * 100,
        color: colors[Math.floor(Math.random() * colors.length)],
        animationDelay: `${Math.random() * 0.5}s`,
        left: `${Math.random() * 100}vw`,
      }));
      setParticles(newParticles);
    } else {
        // Clear after animation to prevent DOM clutter
        const timer = setTimeout(() => setParticles([]), 2000);
        return () => clearTimeout(timer);
    }
  }, [isActive]);

  if (!isActive && particles.length === 0) return null;

  // We use a Portal to ensure confetti is always on top of everything
  return ReactDOM.createPortal(
    <div className="fixed inset-0 pointer-events-none z-[100] overflow-hidden">
      {particles.map((p) => (
        <div
          key={p.id}
          className="absolute top-[-20px] w-3 h-3 rounded-sm animate-confetti"
          style={{
            backgroundColor: p.color,
            left: p.left,
            animationDelay: p.animationDelay,
            animationDuration: '2s',
          }}
        />
      ))}
      <style>{`
        @keyframes confetti-fall {
          0% { transform: translateY(0) rotate(0deg); opacity: 1; }
          100% { transform: translateY(100vh) rotate(720deg); opacity: 0; }
        }
        .animate-confetti {
          animation-name: confetti-fall;
          animation-timing-function: ease-out;
          animation-fill-mode: forwards;
        }
      `}</style>
    </div>,
    document.body
  );
};
