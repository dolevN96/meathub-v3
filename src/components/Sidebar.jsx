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
      <button className="sidebar-logo" onClick={() => onNavigate('home')} style={{ background: 'none', border: 'none', cursor: 'pointer', textAlign: 'right', width: '100%', padding: 0 }}>
        <div className="logo-mark" style={{ background: 'linear-gradient(135deg,#C9A44A,#A07830)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>MEATHUB</div>
        <div className="logo-sub">Premium Butcher</div>
      </button>
      <nav className="sidebar-nav">
        {nav.map(item => (
          <button
            key={item.key}
            className={`nav-item${active === item.key ? ' active' : ''}`}
            onClick={() => onNavigate(item.key === 'profile' ? (user ? 'profile' : 'login') : item.key)}
          >
            <div style={{ position: 'relative', flexShrink: 0 }}>
              <Icon name={item.icon} size={20} color={active === item.key ? '#8C5859' : '#8C6B5A'} />
              {item.badge > 0 && (
                <div style={{ position: 'absolute', top: -5, left: -5, background: '#8C5859', color: '#fff', fontSize: 9, fontWeight: 800, borderRadius: '50%', width: 15, height: 15, display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px solid #EEE9D6' }}>{item.badge}</div>
              )}
            </div>
            <span>{item.label}</span>
          </button>
        ))}
      </nav>
      {user && (
        <div className="sidebar-footer">
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'linear-gradient(135deg,#8C5859,#C9A44A)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 800, fontSize: 14, flexShrink: 0 }}>{user.name?.charAt(0) || 'מ'}</div>
            <div className="sidebar-footer-text" style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontWeight: 700, fontSize: 13, color: '#1E0E0E', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user.name}</div>
              <div style={{ fontSize: 11, color: '#8C6B5A', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user.email}</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
