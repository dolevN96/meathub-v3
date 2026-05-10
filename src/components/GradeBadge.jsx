export const GradeBadge = ({ grade, size = 'md' }) => {
  const s = { sm: { fs: 9, px: 6, py: 3 }, md: { fs: 10, px: 8, py: 4 }, lg: { fs: 12, px: 10, py: 5 } }[size] || { fs: 10, px: 8, py: 4 };
  return (
    <span style={{
      background: 'rgba(13,9,8,.75)', backdropFilter: 'blur(8px)',
      color: '#F0C060', fontWeight: 800, fontSize: s.fs,
      padding: `${s.py}px ${s.px}px`, borderRadius: 6,
      letterSpacing: '1.5px', display: 'inline-block',
      border: '1px solid rgba(240,192,96,.25)',
    }}>GRADE {grade}</span>
  );
};
