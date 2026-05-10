import { useState, useEffect } from 'react';

export function useBreakpoint() {
  const [bp, setBp] = useState(() => {
    const w = window.innerWidth;
    return w >= 1200 ? 'desktop' : w >= 768 ? 'tablet' : 'mobile';
  });

  useEffect(() => {
    const handler = () => {
      const w = window.innerWidth;
      setBp(w >= 1200 ? 'desktop' : w >= 768 ? 'tablet' : 'mobile');
    };
    window.addEventListener('resize', handler);
    return () => window.removeEventListener('resize', handler);
  }, []);

  return bp;
}
