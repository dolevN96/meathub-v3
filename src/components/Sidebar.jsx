import { Icon } from './Icon';

export const Sidebar = ({ active, onNavigate, cartCount, user, onLogout }) => {
  const nav = [
    { key: 'catalog', icon: 'search', label: 'קטלוג' },
    { key: 'groups', icon: 'group', label: 'קבוצות' },
    { key: 'branches', icon: 'map', label: 'נקודות חלוקה' },
    { key: 'cart', icon: 'cart', label: 'עגלה', badge: cartCount },
    { key: 'profile', icon: 'user', label: 'פרופיל' },
  ];

  return (
    <div className="sidebar">
      <button
        className="sidebar-logo"
        onClick={() => onNavigate('landing')}
        style={{ background: 'none', border: 'none', borderBottom: '1px solid rgba(10,7,5,.08)', cursor: 'pointer', textAlign: 'right', width: '100%', padding: '28px 22px 22px' }}
      >
        <div className="logo-word">MEATHUB</div>
        <div className="logo-sub">V3</div>
      </button>
      <nav className="sidebar-nav">
        {nav.map(item => (
          <button
            key={item.key}
            className={`nav-item${active === item.key ? ' active' : ''}`}
            onClick={() => onNavigate(item.key === 'profile' ? (user ? 'profile' : 'login') : item.key)}
          >
            <div style={{ position: 'relative', flexShrink: 0 }}>
              <Icon name={item.icon} size={20} color={active === item.key ? '#8B1A1A' : '#9C8070'} />
              {item.badge > 0 && (
                <div style={{ position: 'absolute', top: -5, insetInlineStart: -5, background: '#8B1A1A', color: '#fff', fontSize: 9, fontWeight: 800, borderRadius: '50%', width: 15, height: 15, display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px solid #FFFFFF' }}>{item.badge}</div>
              )}
            </div>
            <span>{item.label}</span>
          </button>
        ))}
      </nav>
      {user && (
        <div className="sidebar-footer">
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 36, height: 36, borderRadius: 0, background: '#0A0705', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 800, fontSize: 14, flexShrink: 0 }}>{user.name?.charAt(0) || 'מ'}</div>
            <div className="sidebar-footer-text" style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontWeight: 700, fontSize: 13, color: '#0A0705', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user.name}</div>
              <div style={{ fontSize: 11, color: '#9C8070', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user.email}</div>
            </div>
            <button
              onClick={onLogout}
              title="התנתק"
              style={{ background: 'none', border: '1px solid rgba(10,7,5,.14)', borderRadius: 2, width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', flexShrink: 0 }}
            >
              <Icon name="logout" size={15} color="#8B1A1A" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
