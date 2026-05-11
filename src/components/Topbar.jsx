import { Icon } from './Icon';
import { Btn } from './Btn';

const titles = { home: 'בית', catalog: 'קטלוג נתחים', groups: 'קבוצות פעילות', cart: 'העגלה שלי', checkout: 'תשלום', profile: 'הפרופיל שלי', login: 'כניסה', group: 'פרטי קבוצה' };

export const Topbar = ({ onNavigate, cartCount, user, screen }) => (
  <div className="topbar">
    <div style={{ fontWeight: 800, fontSize: 17, color: '#1E0E0E', marginLeft: 24 }}>{titles[screen] || 'MeatHub'}</div>
    <div style={{ position: 'relative', flex: 1, maxWidth: 380 }}>
      <div style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}><Icon name="search" size={16} color="#8C6B5A" /></div>
      <input className="topbar-search" placeholder="חיפוש נתח, יבואן, קבוצה..." style={{ paddingRight: 40 }} />
    </div>
    <div className="topbar-actions">
      <button onClick={() => onNavigate('cart')} style={{ position: 'relative', background: 'rgba(140,88,89,.08)', border: '1px solid rgba(140,88,89,.18)', borderRadius: 11, width: 40, height: 40, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', transition: 'all .2s' }}>
        <Icon name="cart" size={18} color="#5C3535" />
        {cartCount > 0 && <div style={{ position: 'absolute', top: -4, left: -4, background: '#8C5859', color: '#fff', fontSize: 9, fontWeight: 800, borderRadius: '50%', width: 16, height: 16, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{cartCount}</div>}
      </button>
      {user ? (
        <div onClick={() => onNavigate('profile')} style={{ width: 40, height: 40, borderRadius: '50%', background: 'linear-gradient(135deg,#8C5859,#C9A44A)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 800, fontSize: 15, cursor: 'pointer' }}>{user.name?.charAt(0) || 'מ'}</div>
      ) : (
        <Btn onClick={() => onNavigate('login')} size="sm" style={{ height: 38, padding: '0 16px', fontSize: 13 }}>כניסה</Btn>
      )}
    </div>
  </div>
);
