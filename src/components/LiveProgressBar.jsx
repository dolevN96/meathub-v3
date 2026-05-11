import { useState, useEffect } from 'react';

export const LiveProgressBar = ({ filled, total, showLabel = true, compact = false }) => {
  const pct = Math.min(100, Math.round((filled / total) * 100));
  const [anim, setAnim] = useState(0);

  useEffect(() => {
    const t = setTimeout(() => setAnim(pct), 120);
    return () => clearTimeout(t);
  }, [pct]);

  return (
    <div>
      {showLabel && (
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ background: 'rgba(232,54,26,.2)', color: '#8C5859', fontSize: 9, fontWeight: 800, padding: '2px 7px', borderRadius: 6, letterSpacing: 1, border: '1px solid rgba(140,88,89,.45)' }}>LIVE</span>
            <span style={{ color: '#8C6B5A', fontSize: 12 }}>{filled} / {total} ק"ג</span>
          </div>
          <span style={{ color: '#8C5859', fontWeight: 800, fontSize: 15 }}>{pct}%</span>
        </div>
      )}
      <div style={{ background: 'rgba(140,88,89,.10)', borderRadius: 999, height: compact ? 8 : 12, overflow: 'hidden' }}>
        <div style={{
          width: `${anim}%`, height: '100%',
          background: 'linear-gradient(90deg,#6E3F40,#8C5859,#FF5030)',
          borderRadius: 999,
          transition: 'width 1.2s cubic-bezier(0.23,1,0.32,1)',
          position: 'relative', overflow: 'hidden',
          boxShadow: '0 0 12px rgba(232,54,26,.6)',
        }}>
          <div style={{ position: 'absolute', inset: 0, background: 'repeating-linear-gradient(45deg,transparent,transparent 6px,rgba(140,88,89,.18) 6px,rgba(140,88,89,.18) 12px)', animation: 'stripes 1s linear infinite' }} />
        </div>
      </div>
    </div>
  );
};
