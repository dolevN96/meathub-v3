import { Icon } from './Icon';

export const Sidebar = ({ active, onNavigate, cartCount, user }) => {
  const nav = [
    { key: 'home', icon: 'home', label: 'בית' },
    { key: 'catalog', icon: 'search', label: 'קטלוג' },
    { key: 'groups', icon: 'group', label: 'קבוצות' },
    { key: 'cart', icon: 'cart', label: 'עגלה', badge: cartCount },
    { key: 'profile', icon: 'user', label: 'פרופיל' },
  ];

  return (
    <div className="sidebar">
      <div className="sidebar-logo">
        <div className="logo-mark">MEATHUB</div>
        <div className="logo-sub">Premium Butcher</div>
      </div>
      <nav className="sidebar-nav">
        {nav.map(item => (
          <button
            key={item.key}
            className={`nav-item${active === item.key ? ' active' : ''}`}
            onClick={() => onNavigate(item.key === 'profile' ? (user ? 'profile' : 'login') : item.key)}
          >
            <div style={{ position: 'relative', flexShrink: 0 }}>
              <Icon name={item.icon} size={20} color={active === item.key ? '#E8361A' : '#7A5F50'} />
              {item.badge > 0 && (
                <div style={{ position: 'absolute', top: -5, left: -5, background: '#E8361A', color: '#fff', fontSize: 9, fontWeight: 800, borderRadius: '50%', width: 15, height: 15, display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px solid #0D0908' }}>{item.badge}</div>
              )}
            </div>
            <span>{item.label}</span>
          </button>
        ))}
      </nav>
      {user && (
        <div className="sidebar-footer">
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'linear-gradient(135deg,#E8361A,#F0C060)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 800, fontSize: 14, flexShrink: 0 }}>{user.name?.charAt(0) || 'מ'}</div>
            <div className="sidebar-footer-text" style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontWeight: 700, fontSize: 13, color: '#F5EDE4', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user.name}</div>
              <div style={{ fontSize: 11, color: '#7A5F50', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user.email}</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
