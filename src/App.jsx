import { useState, useEffect, useCallback } from 'react';
import { useBreakpoint } from './hooks/useBreakpoint';
import { GROUPS, PRODUCTS } from './data';

import { Sidebar } from './components/Sidebar';
import { Topbar } from './components/Topbar';
import { BottomNav } from './components/BottomNav';
import { Icon } from './components/Icon';

import { LandingPage } from './screens/LandingPage';
import { HomeScreen } from './screens/HomeScreen';
import { CatalogScreen } from './screens/CatalogScreen';
import { GroupsScreen } from './screens/GroupsScreen';
import { GroupViewScreen } from './screens/GroupViewScreen';
import { CartScreen } from './screens/CartScreen';
import { CheckoutScreen } from './screens/CheckoutScreen';
import { LoginScreen } from './screens/LoginScreen';
import { DashboardScreen } from './screens/DashboardScreen';

export default function App() {
  const bp = useBreakpoint();
  const isMobile = bp === 'mobile';
  const [screen, setScreen] = useState('landing');
  const [params, setParams] = useState({});
  const [cart, setCart] = useState([]);
  const [user, setUser] = useState(null);
  const [key, setKey] = useState(0);

  useEffect(() => {
    try {
      const s = localStorage.getItem('meathub_v3');
      if (s) {
        const { sc, ca, us } = JSON.parse(s);
        if (sc && sc !== 'landing') setScreen(sc);
        if (ca) setCart(ca);
        if (us) setUser(us);
      }
    } catch (e) {}
  }, []);

  useEffect(() => {
    try { localStorage.setItem('meathub_v3', JSON.stringify({ sc: screen, ca: cart, us: user })); } catch (e) {}
  }, [screen, cart, user]);

  const nav = useCallback((to, p = {}) => { setScreen(to); setParams(p); setKey(k => k + 1); }, []);
  const addToCart = useCallback(item => setCart(c => {
    const ex = c.find(i => i.groupId === item.groupId);
    return ex ? c.map(i => i.groupId === item.groupId ? { ...i, qty: item.qty } : i) : [...c, item];
  }), []);
  const removeFromCart = useCallback(gid => setCart(c => c.filter(i => i.groupId !== gid)), []);
  const clearCart = useCallback(() => setCart([]), []);
  const login = useCallback(u => setUser(u), []);

  if (screen === 'landing') return <LandingPage onEnterApp={() => nav('home')} />;

  const activeNav = ['home', 'catalog', 'groups', 'cart', 'profile'].includes(screen) ? screen :
    screen === 'login' ? 'profile' : screen === 'group' ? 'catalog' : 'home';

  const handleBottomNav = k => nav(k === 'profile' ? (user ? 'profile' : 'login') : k);
  const commonProps = { onNavigate: nav, cart, bp };

  const screens = {
    home: <HomeScreen {...commonProps} />,
    catalog: <CatalogScreen {...commonProps} />,
    groups: <GroupsScreen {...commonProps} />,
    group: <GroupViewScreen {...commonProps} groupId={params.groupId || GROUPS[0].id} onAddToCart={addToCart} />,
    cart: <CartScreen {...commonProps} onRemove={removeFromCart} />,
    checkout: <CheckoutScreen {...commonProps} onClearCart={clearCart} />,
    login: <LoginScreen {...commonProps} onLogin={login} />,
    profile: <DashboardScreen {...commonProps} user={user} />,
  };

  const hideNav = ['checkout', 'login'].includes(screen);
  const titles = { home: 'בית', catalog: 'קטלוג נתחים', groups: 'קבוצות', cart: 'העגלה', checkout: 'תשלום', profile: 'פרופיל', login: 'כניסה', group: 'פרטי קבוצה' };

  return (
    <div className="app-root">
      {!isMobile && <Sidebar active={activeNav} onNavigate={nav} cartCount={cart.length} user={user} />}
      {!isMobile && !hideNav && <Topbar onNavigate={nav} cartCount={cart.length} user={user} screen={screen} />}

      <div className="main-content">
        {isMobile && !hideNav && screen !== 'group' && screen !== 'login' && screen !== 'checkout' && (
          <div className="mobile-topbar">
            {screen === 'catalog' || screen === 'cart' || screen === 'profile' ? (
              <div style={{ flex: 1, fontWeight: 800, fontSize: 18, color: '#F5EDE4' }}>{titles[screen]}</div>
            ) : (
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 10, color: '#7A5F50', fontWeight: 700, letterSpacing: 1.5 }}>MEATHUB</div>
                <div style={{ fontWeight: 900, fontSize: 17, color: '#F5EDE4', lineHeight: 1 }}>בשר פרימיום ישר מהיבואן</div>
              </div>
            )}
            <button onClick={() => nav('cart')} style={{ position: 'relative', background: 'rgba(255,255,255,.06)', border: '1px solid rgba(255,255,255,.1)', borderRadius: 11, width: 40, height: 40, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', flexShrink: 0 }}>
              <Icon name="cart" size={18} color="#C4A990" />
              {cart.length > 0 && <div style={{ position: 'absolute', top: -4, left: -4, background: '#E8361A', color: '#fff', fontSize: 9, fontWeight: 800, borderRadius: '50%', width: 15, height: 15, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{cart.length}</div>}
            </button>
          </div>
        )}
        {isMobile && screen === 'group' && (
          <div className="mobile-topbar">
            <button onClick={() => nav('catalog')} style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4, color: '#C4A990', fontFamily: 'inherit', fontWeight: 600, fontSize: 14, padding: 4 }}>
              <Icon name="back" size={20} color="#C4A990" />חזרה
            </button>
            <div style={{ flex: 1, textAlign: 'center', fontWeight: 800, fontSize: 16, color: '#F5EDE4' }}>
              {PRODUCTS.find(p => p.id === GROUPS.find(g => g.id === (params.groupId || GROUPS[0].id))?.productId)?.name || ''}
            </div>
            <div style={{ width: 48 }} />
          </div>
        )}
        <div className="content-inner" key={key}>
          {screens[screen] || screens.home}
        </div>
      </div>

      {isMobile && !hideNav && <BottomNav active={activeNav} onNavigate={handleBottomNav} cartCount={cart.length} />}
    </div>
  );
}
