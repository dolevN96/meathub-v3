import { Icon } from './Icon';

export const BottomNav = ({ active, onNavigate, cartCount }) => {
  const items = [
    { key: 'home', icon: 'home', label: 'בית' },
    { key: 'catalog', icon: 'search', label: 'קטלוג' },
    { key: 'groups', icon: 'group', label: 'קבוצות' },
    { key: 'cart', icon: 'cart', label: 'עגלה', badge: cartCount },
    { key: 'profile', icon: 'user', label: 'פרופיל' },
  ];

  return (
    <div className="bottom-nav">
      {items.map(item => (
        <button
          key={item.key}
          onClick={() => onNavigate(item.key)}
          style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3, padding: '10px 0 8px', background: 'none', border: 'none', cursor: 'pointer', color: active === item.key ? '#8C5859' : '#8C6B5A', fontFamily: 'inherit', position: 'relative', transition: 'color .15s' }}
        >
          {active === item.key && <div style={{ position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)', width: 20, height: 2, background: '#8C5859', borderRadius: 1 }} />}
          <div style={{ position: 'relative' }}>
            <Icon name={item.icon} size={22} color={active === item.key ? '#8C5859' : '#8C6B5A'} />
            {item.badge > 0 && <div style={{ position: 'absolute', top: -4, left: -4, background: '#8C5859', color: '#fff', fontSize: 9, fontWeight: 800, borderRadius: '50%', width: 15, height: 15, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{item.badge}</div>}
          </div>
          <span style={{ fontSize: 10, fontWeight: active === item.key ? 700 : 500 }}>{item.label}</span>
        </button>
      ))}
    </div>
  );
};
