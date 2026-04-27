'use client';

import { useEffect, useRef } from 'react';

export default function ScrollLogo({ children }: { children: React.ReactNode }) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let scrollFrame: number;

    const handleScroll = () => {
      if (scrollFrame) cancelAnimationFrame(scrollFrame);
      
      scrollFrame = requestAnimationFrame(() => {
        if (containerRef.current) {
          const rotation = window.scrollY * 0.2;
          containerRef.current.style.transform = `rotate(${rotation}deg)`;
        }
      });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Initial rotation

    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (scrollFrame) cancelAnimationFrame(scrollFrame);
    };
  }, []);

  return (
    <div ref={containerRef} className="flex items-center justify-center transition-transform duration-75 ease-linear origin-center will-change-transform">
      {children}
    </div>
  );
}
