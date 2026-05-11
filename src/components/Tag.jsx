export const Tag = ({ children, active, onClick, style: s = {} }) => (
  <button onClick={onClick} style={{
    background: active ? 'rgba(232,54,26,.15)' : 'rgba(90,61,43,.05)',
    color: active ? '#8C5859' : '#8C6B5A',
    border: `1px solid ${active ? 'rgba(140,88,89,.45)' : 'rgba(140,88,89,.18)'}`,
    borderRadius: 8,
    padding: '6px 14px',
    fontSize: 12,
    fontWeight: active ? 700 : 600,
    fontFamily: 'inherit',
    cursor: 'pointer',
    letterSpacing: '.5px',
    transition: 'all .15s',
    whiteSpace: 'nowrap',
    ...s,
  }}>{children}</button>
);
