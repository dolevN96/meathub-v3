import { Icon } from './Icon';

export const BottomNav = ({ active, onNavigate, cartCount }) => {
  const items = [
    { key: 'catalog', icon: 'search', label: 'קטלוג' },
    { key: 'groups', icon: 'group', label: 'קבוצות' },
    { key: 'branches', icon: 'map', label: 'נקודות חלוקה' },
    { key: 'cart', icon: 'cart', label: 'עגלה', badge: cartCount },
    { key: 'profile', icon: 'user', label: 'פרופיל' },
  ];

  return (
    <div className="bottom-nav">
      {items.map(item => (
        <button
          key={item.key}
          onClick={() => onNavigate(item.key)}
          style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3, padding: '10px 0 8px', background: 'none', border: 'none', cursor: 'pointer', color: active === item.key ? '#8B1A1A' : '#9C8070', fontFamily: 'inherit', position: 'relative', transition: 'color 150ms ease' }}
        >
          {active === item.key && <div style={{ position: 'absolute', top: 0, insetInlineStart: '50%', transform: 'translateX(-50%)', width: 20, height: 2, background: '#8B1A1A' }} />}
          <div style={{
            position: 'relative',
            transform: active === item.key ? 'scale(1.1)' : 'scale(1)',
            transition: 'transform 150ms ease',
            color: active === item.key ? '#8B1A1A' : '#9C8070'
          }}>
            <Icon name={item.icon} size={22} color={active === item.key ? '#8B1A1A' : '#9C8070'} />
            {item.badge > 0 && <div style={{ position: 'absolute', top: -4, insetInlineStart: -4, background: '#8B1A1A', color: '#fff', fontSize: 9, fontWeight: 800, borderRadius: '50%', width: 15, height: 15, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{item.badge}</div>}
          </div>
          <span style={{ fontSize: 10, fontWeight: active === item.key ? 700 : 500 }}>{item.label}</span>
        </button>
      ))}
    </div>
  );
};
