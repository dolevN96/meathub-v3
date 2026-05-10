export const Tag = ({ children, active, onClick, style: s = {} }) => (
  <button onClick={onClick} style={{
    background: active ? 'rgba(232,54,26,.15)' : 'rgba(255,255,255,.05)',
    color: active ? '#E8361A' : '#7A5F50',
    border: `1px solid ${active ? 'rgba(232,54,26,.4)' : 'rgba(255,255,255,.1)'}`,
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
