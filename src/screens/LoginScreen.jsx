import { useState } from 'react';
import { PRODUCTS } from '../data';
import { Icon } from '../components/Icon';
import { Btn } from '../components/Btn';

export const LoginScreen = ({ onNavigate, onLogin, bp }) => {
  const [mode, setMode] = useState('login');
  const [email, setEmail] = useState('');
  const [pw, setPw] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState('');
  const isDesktop = bp === 'desktop';

  const submit = () => {
    if (!email.includes('@')) { setErr('כתובת אימייל לא תקינה'); return; }
    if (pw.length < 6) { setErr('סיסמה חייבת להכיל לפחות 6 תווים'); return; }
    setErr(''); setLoading(true);
    setTimeout(() => { setLoading(false); onLogin({ name: name || email.split('@')[0], email }); onNavigate('home'); }, 1500);
  };

  const inp = { width: '100%', height: 48, borderRadius: 12, border: '1px solid rgba(255,255,255,.12)', background: 'rgba(255,255,255,.05)', padding: '0 16px', fontSize: 14, fontFamily: 'inherit', color: '#F5EDE4', outline: 'none', marginBottom: 12, display: 'block' };

  return (
    <div className="fade-up" style={{ display: 'flex', minHeight: isDesktop ? '80vh' : '100vh' }}>
      {isDesktop && (
        <div style={{ flex: 1, background: 'linear-gradient(160deg,#1E0A06,#0D0908)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 48, borderRadius: 18, marginLeft: 32, position: 'relative', overflow: 'hidden', border: '1px solid rgba(240,192,96,.1)' }}>
          <div style={{ position: 'absolute', inset: 0, background: 'repeating-linear-gradient(45deg,transparent,transparent 30px,rgba(232,54,26,.02) 30px,rgba(232,54,26,.02) 60px)' }} />
          <div style={{ position: 'absolute', top: '30%', left: '50%', transform: 'translate(-50%,-50%)', width: 300, height: 300, borderRadius: '50%', background: 'radial-gradient(circle,rgba(232,54,26,.15),transparent 70%)', pointerEvents: 'none' }} />
          <div style={{ position: 'relative', textAlign: 'center' }}>
            <div style={{ background: 'linear-gradient(135deg,#E8361A,#B82A12)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text', fontWeight: 900, fontSize: 14, letterSpacing: 3, marginBottom: 16 }}>MEATHUB</div>
            <div style={{ color: '#F5EDE4', fontWeight: 900, fontSize: 36, lineHeight: 1.2, marginBottom: 12 }}>בשר פרימיום<br />ישר מהיבואן</div>
            <div style={{ color: '#C4A990', fontSize: 15, marginBottom: 32 }}>חוסכים 40–60% ביחד</div>
            {PRODUCTS.slice(0, 4).map(p => (
              <div key={p.id} style={{ display: 'flex', alignItems: 'center', gap: 12, background: 'rgba(255,255,255,.04)', border: '1px solid rgba(255,255,255,.08)', borderRadius: 12, padding: '10px 16px', marginBottom: 8, textAlign: 'right' }}>
                <div style={{ width: 36, height: 36, borderRadius: 8, background: `linear-gradient(135deg,${p.color1},${p.color2})`, flexShrink: 0 }} />
                <div style={{ flex: 1 }}>
                  <div style={{ color: '#F5EDE4', fontWeight: 700, fontSize: 13 }}>{p.name}</div>
                  <div style={{ color: '#7A5F50', fontSize: 11 }}>₪{p.priceGroup} לק"ג</div>
                </div>
                <div style={{ color: '#E8361A', fontWeight: 800, fontSize: 13 }}>-{Math.round((1 - p.priceGroup / p.priceRetail) * 100)}%</div>
              </div>
            ))}
          </div>
        </div>
      )}
      <div style={{ width: isDesktop ? 400 : '100%', flexShrink: 0, display: 'flex', flexDirection: 'column' }}>
        {!isDesktop && (
          <div style={{ background: 'linear-gradient(160deg,#1E0A06,#0D0908)', padding: '48px 24px 32px', textAlign: 'center', borderBottom: '1px solid rgba(255,255,255,.06)' }}>
            <div style={{ background: 'linear-gradient(135deg,#E8361A,#B82A12)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text', fontWeight: 900, fontSize: 12, letterSpacing: 2, marginBottom: 8 }}>MEATHUB</div>
            <div style={{ color: '#F5EDE4', fontWeight: 900, fontSize: 24, marginBottom: 6 }}>{mode === 'login' ? 'ברוך השב!' : 'הצטרף'}</div>
            <div style={{ color: '#7A5F50', fontSize: 13 }}>בשר פרימיום ישר מהיבואן</div>
          </div>
        )}
        <div style={{ flex: 1, padding: isDesktop ? '32px 0 32px 0' : '28px 24px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          {isDesktop && <div style={{ fontWeight: 900, fontSize: 24, marginBottom: 24, color: '#F5EDE4' }}>{mode === 'login' ? 'כניסה לחשבון' : 'יצירת חשבון'}</div>}
          <button
            onClick={() => { setLoading(true); setTimeout(() => { setLoading(false); onLogin({ name: 'משתמש Google', email: 'user@gmail.com' }); onNavigate('home'); }, 1200); }}
            style={{ width: '100%', height: 50, borderRadius: 14, border: '1px solid rgba(255,255,255,.12)', background: 'rgba(255,255,255,.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, cursor: 'pointer', fontFamily: 'inherit', fontWeight: 700, fontSize: 15, marginBottom: 20, color: '#F5EDE4', transition: 'all .2s' }}
            onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,.08)'}
            onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,.05)'}
          >
            <Icon name="google" size={20} />{mode === 'login' ? 'כניסה עם Google' : 'הרשמה עם Google'}
          </button>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
            <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,.08)' }} />
            <span style={{ color: '#7A5F50', fontSize: 12 }}>או עם אימייל</span>
            <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,.08)' }} />
          </div>
          {mode === 'register' && <input value={name} onChange={e => setName(e.target.value)} placeholder="שם מלא" style={inp} />}
          <input value={email} onChange={e => setEmail(e.target.value)} placeholder="אימייל" type="email" style={{ ...inp, direction: 'ltr', textAlign: 'left' }} />
          <input value={pw} onChange={e => setPw(e.target.value)} placeholder="סיסמה" type="password" style={{ ...inp, direction: 'ltr', textAlign: 'left' }} />
          {err && <div style={{ color: '#EF4444', fontSize: 12, marginBottom: 10, padding: '8px 12px', background: 'rgba(239,68,68,.08)', borderRadius: 8, border: '1px solid rgba(239,68,68,.2)' }}>{err}</div>}
          <Btn full size="lg" onClick={submit} disabled={loading} style={{ marginBottom: 14 }}>{loading ? 'טוען...' : mode === 'login' ? 'התחבר' : 'צור חשבון'}</Btn>
          <div style={{ textAlign: 'center', fontSize: 13, color: '#7A5F50' }}>
            {mode === 'login' ? 'אין לך חשבון? ' : 'כבר יש לך חשבון? '}
            <button onClick={() => { setMode(mode === 'login' ? 'register' : 'login'); setErr(''); }} style={{ background: 'none', border: 'none', color: '#E8361A', fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit', fontSize: 13 }}>{mode === 'login' ? 'הירשם' : 'התחבר'}</button>
          </div>
        </div>
      </div>
    </div>
  );
};
