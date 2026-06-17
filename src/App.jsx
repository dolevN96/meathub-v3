import { useState, useEffect, useCallback } from 'react';
import { useBreakpoint } from './hooks/useBreakpoint';
import { supabase } from './lib/supabase';
import { signOut } from './lib/auth';

import { Sidebar } from './components/Sidebar';
import { Topbar } from './components/Topbar';
import { BottomNav } from './components/BottomNav';
import { Icon } from './components/Icon';
import { ToastProvider } from './components/Toast';

import { LandingPage } from './screens/LandingPage';
import { HomeScreen } from './screens/HomeScreen';
import { CatalogScreen } from './screens/CatalogScreen';
import { GroupsScreen } from './screens/GroupsScreen';
import { GroupViewScreen } from './screens/GroupViewScreen';
import { CartScreen } from './screens/CartScreen';
import { CheckoutScreen } from './screens/CheckoutScreen';
import { LoginScreen } from './screens/LoginScreen';
import { DashboardScreen } from './screens/DashboardScreen';
import { BranchesScreen } from './screens/BranchesScreen';

export default function App() {
  const bp = useBreakpoint();
  const isMobile = bp === 'mobile';
  const [screen, setScreen] = useState('landing');
  const [params, setParams] = useState({});
  const [cart, setCart] = useState([]);
  const [user, setUser] = useState(null);
  const [key, setKey] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    try {
      const s = localStorage.getItem('meathub_v3');
      if (s) {
        const { sc, ca } = JSON.parse(s);
        if (sc && sc !== 'landing') setScreen(sc);
        if (ca) setCart(ca);
      }
    } catch (e) {}

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        const u = session.user;
        const displayName = u.user_metadata?.full_name || u.email?.split('@')[0] || 'משתמש';
        setUser({ ...u, name: displayName });
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        const u = session.user;
        const displayName = u.user_metadata?.full_name || u.email?.split('@')[0] || 'משתמש';
        setUser({ ...u, name: displayName });
      } else {
        setUser(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    try { localStorage.setItem('meathub_v3', JSON.stringify({ sc: screen, ca: cart })); } catch (e) {}
  }, [screen, cart]);

  const nav = useCallback((to, p = {}) => {
    if (to !== 'catalog') setSearchQuery('');
    setScreen(to); setParams(p); setKey(k => k + 1);
  }, []);
  const addToCart = useCallback(item => setCart(c => {
    const ex = c.find(i => i.groupId === item.groupId && i.productId === item.productId);
    return ex ? c.map(i => i.groupId === item.groupId && i.productId === item.productId ? { ...i, qty: item.qty } : i) : [...c, item];
  }), []);
  const removeFromCart = useCallback((gid, pid) => setCart(c =>
    pid ? c.filter(i => !(i.groupId === gid && i.productId === pid)) : c.filter(i => i.groupId !== gid)
  ), []);
  const clearCart = useCallback(() => setCart([]), []);
  const login = useCallback(u => {
    const displayName = u.user_metadata?.full_name || u.email?.split('@')[0] || 'משתמש';
    setUser({ ...u, name: displayName });
  }, []);
  const logout = useCallback(async () => {
    await signOut();
    setUser(null);
    nav('landing');
  }, [nav]);

  if (screen === 'landing') return <LandingPage onEnterApp={() => nav('groups')} onGoToCatalog={() => nav('catalog')} onNavigate={nav} cartCount={cart.length} user={user} />;

  const activeNav = ['home', 'catalog', 'groups', 'branches', 'cart', 'profile'].includes(screen) ? screen :
    screen === 'login' ? 'profile' : screen === 'group' ? 'catalog' : 'home';

  if (screen === 'checkout' && user === null) { nav('login'); return null; }

  const handleBottomNav = k => nav(k === 'profile' ? (user ? 'profile' : 'login') : k);
  const commonProps = { onNavigate: nav, cart, bp };

  const screens = {
    home: <HomeScreen {...commonProps} />,
    catalog: <CatalogScreen {...commonProps} searchQuery={searchQuery} setSearchQuery={setSearchQuery} />,
    groups: <GroupsScreen {...commonProps} />,
    group: <GroupViewScreen {...commonProps} groupId={params.groupId} onAddToCart={addToCart} />,
    cart: <CartScreen {...commonProps} onRemove={removeFromCart} />,
    checkout: <CheckoutScreen {...commonProps} onClearCart={clearCart} />,
    login: <LoginScreen {...commonProps} onLogin={login} initialMode={params.mode} />,
    profile: <DashboardScreen {...commonProps} user={user} onLogout={logout} />,
    branches: <BranchesScreen {...commonProps} />,
  };

  const hideNav = ['checkout', 'login'].includes(screen);
  const titles = { home: 'בית', catalog: 'קטלוג נתחים', groups: 'קבוצות', branches: 'נקודות איסוף', cart: 'העגלה', checkout: 'תשלום', profile: 'פרופיל', login: 'כניסה', group: 'פרטי קבוצה' };

  return (
    <ToastProvider>
    <div className="app-root">
      {!isMobile && <Sidebar active={activeNav} onNavigate={nav} cartCount={cart.length} user={user} onLogout={logout} />}

      <div className="main-content">
        {!isMobile && !hideNav && <Topbar onNavigate={nav} cartCount={cart.length} user={user} screen={screen} searchQuery={searchQuery} onSearchChange={setSearchQuery} onLogout={logout} />}
        {isMobile && !hideNav && screen !== 'group' && screen !== 'login' && screen !== 'checkout' && (
          <div className="mobile-topbar">
            {screen === 'catalog' || screen === 'cart' || screen === 'profile' ? (
              <div style={{ flex: 1, fontWeight: 800, fontSize: 18, color: '#0A0705' }}>{titles[screen]}</div>
            ) : (
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 10, color: '#9C8070', fontWeight: 700, letterSpacing: 1.5 }}>MEATHUB</div>
                <div style={{ fontWeight: 900, fontSize: 17, color: '#0A0705', lineHeight: 1 }}>בשר פרימיום ישר מהיבואן</div>
              </div>
            )}
            <button onClick={() => nav('cart')} style={{ position: 'relative', background: 'transparent', border: '1px solid rgba(10,7,5,.14)', borderRadius: 2, width: 40, height: 40, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', flexShrink: 0 }}>
              <Icon name="cart" size={18} color="#0A0705" />
              {cart.length > 0 && <div style={{ position: 'absolute', top: -6, insetInlineStart: -6, background: '#8B1A1A', color: '#fff', fontSize: 9, fontWeight: 800, borderRadius: '50%', width: 17, height: 17, display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px solid #FFFFFF' }}>{cart.length}</div>}
            </button>
          </div>
        )}
        {isMobile && screen === 'group' && (
          <div className="mobile-topbar">
            <button onClick={() => nav('home')} style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4, color: '#0A0705', fontFamily: 'inherit', fontWeight: 600, fontSize: 14, padding: 4 }}>
              <Icon name="back" size={20} color="#0A0705" />חזרה
            </button>
            <div style={{ flex: 1, textAlign: 'center', fontWeight: 800, fontSize: 16, color: '#0A0705' }}>
              אירוע משלוח
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
    </ToastProvider>
  );
}
