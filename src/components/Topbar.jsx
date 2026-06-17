import { useState, useRef, useEffect } from 'react';
import { Icon } from './Icon';
import { Btn } from './Btn';

const titles = { home: 'בית', catalog: 'קטלוג נתחים', groups: 'קבוצות פעילות', branches: 'נקודות איסוף', cart: 'העגלה שלי', checkout: 'תשלום', profile: 'הפרופיל שלי', login: 'כניסה', group: 'פרטי קבוצה' };

export const Topbar = ({ onNavigate, cartCount, user, screen, searchQuery = '', onSearchChange, onLogout }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    if (!menuOpen) return;
    const close = e => { if (menuRef.current && !menuRef.current.contains(e.target)) setMenuOpen(false); };
    document.addEventListener('mousedown', close);
    return () => document.removeEventListener('mousedown', close);
  }, [menuOpen]);

  return (
    <div className="topbar">
      <div style={{ display: 'flex', alignItems: 'center', flex: 1, maxWidth: 320, position: 'relative' }}>
        <div style={{ position: 'absolute', insetInlineEnd: searchQuery.length > 0 ? 32 : 10, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}>
          <Icon name="search" size={15} color="#9C8070" />
        </div>
        <input
          value={searchQuery}
          onChange={e => onSearchChange && onSearchChange(e.target.value)}
          placeholder="חיפוש נתח, יבואן, קבוצה..."
          style={{ width: '100%', height: 36, border: '1px solid #E5E5E5', borderRadius: 2, padding: '0 32px 0 12px', fontFamily: 'Heebo, sans-serif', fontSize: 14, direction: 'rtl', outline: 'none', color: '#0A0705', background: '#FFFFFF' }}
        />
        {searchQuery.length > 0 && (
          <button
            onClick={() => onSearchChange && onSearchChange('')}
            style={{ position: 'absolute', left: 8, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#9C8070', fontSize: 16, lineHeight: 1, padding: 0 }}
          >×</button>
        )}
      </div>
      <div className="topbar-actions">
        <button
          onClick={() => onNavigate('cart')}
          style={{ position: 'relative', background: 'transparent', border: '1px solid rgba(10,7,5,.14)', borderRadius: 2, width: 40, height: 40, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', transition: 'border-color 150ms ease' }}
        >
          <Icon name="cart" size={18} color="#0A0705" />
          {cartCount > 0 && <div style={{ position: 'absolute', top: -6, insetInlineStart: -6, background: '#8B1A1A', color: '#fff', fontSize: 9, fontWeight: 800, borderRadius: '50%', width: 17, height: 17, display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px solid #FFFFFF' }}>{cartCount}</div>}
        </button>
        {user ? (
          <div ref={menuRef} style={{ position: 'relative' }}>
            <div
              onClick={() => setMenuOpen(o => !o)}
              style={{ width: 40, height: 40, borderRadius: 0, background: '#0A0705', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 800, fontSize: 15, cursor: 'pointer' }}
            >{user.name?.charAt(0) || 'מ'}</div>
            {menuOpen && (
              <div style={{ position: 'absolute', insetInlineEnd: 0, top: 48, background: '#fff', border: '1px solid rgba(10,7,5,.14)', borderRadius: 2, minWidth: 180, boxShadow: '0 8px 24px rgba(10,7,5,.10)', zIndex: 50, overflow: 'hidden' }}>
                <div style={{ padding: '12px 14px', borderBottom: '1px solid rgba(10,7,5,.08)' }}>
                  <div style={{ fontWeight: 700, fontSize: 13, color: '#0A0705', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user.name}</div>
                  <div style={{ fontSize: 11, color: '#9C8070', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user.email}</div>
                </div>
                <button
                  onClick={() => { setMenuOpen(false); onNavigate('profile'); }}
                  style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 8, background: 'none', border: 'none', cursor: 'pointer', padding: '10px 14px', fontFamily: 'inherit', fontSize: 13, fontWeight: 600, color: '#0A0705' }}
                >
                  <Icon name="user" size={15} color="#0A0705" />פרופיל שלי
                </button>
                <button
                  onClick={() => { setMenuOpen(false); onLogout && onLogout(); }}
                  style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 8, background: 'none', border: 'none', cursor: 'pointer', padding: '10px 14px', fontFamily: 'inherit', fontSize: 13, fontWeight: 600, color: '#8B1A1A', borderTop: '1px solid rgba(10,7,5,.08)' }}
                >
                  <Icon name="logout" size={15} color="#8B1A1A" />התנתק
                </button>
              </div>
            )}
          </div>
        ) : (
          <Btn onClick={() => onNavigate('login')} size="sm" style={{ height: 38, padding: '0 16px', fontSize: 13 }}>כניסה</Btn>
        )}
      </div>
    </div>
  );
};
