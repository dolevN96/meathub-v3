export const GradeBadge = ({ grade, gradeLabel }) => (
  <div style={{
    display: 'inline-block',
    background: '#0A0705',
    color: '#FFFFFF',
    fontFamily: "'Courier New', monospace",
    fontWeight: 700,
    fontSize: 10,
    letterSpacing: '0.08em',
    padding: '3px 8px',
    borderRadius: 0,
    textTransform: 'uppercase',
    whiteSpace: 'nowrap',
    lineHeight: 1.4,
  }}>
    {gradeLabel || grade}
  </div>
);
