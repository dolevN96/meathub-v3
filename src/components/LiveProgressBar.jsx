export const LiveProgressBar = ({ filled, total, showLabel = true }) => {
  const pct = total > 0 ? Math.min(100, (filled / total) * 100) : 0;
  const pctRound = Math.round(pct);
  const barColor = pct >= 80 ? '#B45309' : '#8B1A1A';
  const bgColor = pct >= 80 ? 'rgba(180, 83, 9, 0.1)' : 'rgba(139, 26, 26, 0.08)';
  return (
    <div>
      <div style={{ height: 3, background: bgColor, borderRadius: 0, overflow: 'hidden', marginBottom: showLabel ? 6 : 0 }}>
        <div style={{
          height: '100%',
          width: `${pct}%`,
          background: barColor,
          transition: 'width 500ms cubic-bezier(0.23,1,0.32,1)',
          willChange: 'width',
        }} />
      </div>
      {showLabel && (
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: '#9C8070' }}>
          <span style={{ fontFamily: "'Courier New',monospace", fontWeight: 700, color: '#0A0705' }}>
            {Number(filled).toFixed(1)} / {Number(total).toFixed(0)} ק"ג
          </span>
          <span>{pctRound}%</span>
        </div>
      )}
    </div>
  );
};
