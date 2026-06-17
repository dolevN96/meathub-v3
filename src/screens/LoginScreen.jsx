import { useState } from 'react';
import { Icon } from '../components/Icon';
import { Btn } from '../components/Btn';
import { signIn, signUp, signInWithGoogle } from '../lib/auth';
import { useToast } from '../components/Toast';

const toHebrew = (msg = '') => {
  if (msg.includes('Invalid login credentials')) return 'אימייל או סיסמה שגויים';
  if (msg.includes('User already registered')) return 'כתובת האימייל כבר רשומה במערכת';
  if (msg.includes('Email not confirmed')) return 'יש לאמת את כתובת האימייל תחילה';
  return 'אירעה שגיאה, נסה שוב';
};

const pwStrength = pw => {
  if (!pw) return null;
  if (pw.length < 6) return { level: 'חלשה', color: '#8B1A1A', width: '33%' };
  if (pw.length < 10 && !/[A-Z]/.test(pw)) return { level: 'בינונית', color: '#C9A44A', width: '66%' };
  return { level: 'חזקה', color: '#22C55E', width: '100%' };
};

const Spinner = () => (
  <span style={{ display: 'inline-block', width: 14, height: 14, border: '2px solid rgba(255,255,255,.4)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin 0.7s linear infinite', marginLeft: 8 }} />
);

const CITIES = ['תל אביב', 'ירושלים', 'חיפה', 'ראשון לציון', 'פתח תקווה', 'אשדוד', 'נתניה', 'באר שבע', 'חולון', 'רמת גן', 'בני ברק', 'אחר'];

export const LoginScreen = ({ onNavigate, onLogin, bp, initialMode }) => {
  const [mode, setMode] = useState(initialMode === 'register' ? 'register' : 'login');
  const [email, setEmail] = useState('');
  const [pw, setPw] = useState('');
  const [pw2, setPw2] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [city, setCity] = useState('');
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState('');
  const [emailErr, setEmailErr] = useState('');
  const [pwErr, setPwErr] = useState('');
  const [pw2Err, setPw2Err] = useState('');
  const [nameErr, setNameErr] = useState('');
  const [cityErr, setCityErr] = useState('');
  const isDesktop = bp === 'desktop';
  const toast = useToast();

  const validateEmail = v => {
    if (!v) { setEmailErr('נא להזין אימייל'); return false; }
    if (!v.includes('@')) { setEmailErr('כתובת אימייל לא תקינה'); return false; }
    setEmailErr(''); return true;
  };
  const validatePw = v => {
    if (v.length < 6) { setPwErr('סיסמה חייבת להכיל לפחות 6 תווים'); return false; }
    setPwErr(''); return true;
  };
  const validatePw2 = (v, base = pw) => {
    if (mode !== 'register') { setPw2Err(''); return true; }
    if (v !== base) { setPw2Err('הסיסמאות אינן תואמות'); return false; }
    setPw2Err(''); return true;
  };
  const validateName = v => {
    if (mode !== 'register') { setNameErr(''); return true; }
    if (!v.trim()) { setNameErr('נא להזין שם מלא'); return false; }
    setNameErr(''); return true;
  };
  const validateCity = v => {
    if (mode !== 'register') { setCityErr(''); return true; }
    if (!v) { setCityErr('נא לבחור עיר'); return false; }
    setCityErr(''); return true;
  };

  const submit = async () => {
    const okEmail = validateEmail(email);
    const okPw = validatePw(pw);
    const okPw2 = validatePw2(pw2);
    const okName = validateName(name);
    const okCity = validateCity(city);
    if (!okEmail || !okPw || (mode === 'register' && (!okPw2 || !okName || !okCity))) return;
    setErr(''); setLoading(true);
    const { data, error } = mode === 'login'
      ? await signIn(email, pw)
      : await signUp(email, pw, name, { phone, city });
    setLoading(false);
    if (error) {
      const msg = toHebrew(error.message);
      setErr(msg);
      toast.error(msg);
      return;
    }
    if (data?.user) {
      toast.success('ברוך הבא! 👋');
      onLogin(data.user);
      onNavigate('home');
    }
  };

  const strength = mode === 'register' ? pwStrength(pw) : null;

  const inp = {
    width: '100%', height: 48, borderRadius: 4,
    border: '1px solid rgba(10,7,5,.14)',
    background: '#FFFFFF',
    padding: '0 16px', fontSize: 14, fontFamily: 'inherit',
    color: '#0A0705', outline: 'none', display: 'block',
    transition: 'border-color 150ms ease, box-shadow 150ms ease',
  };

  const inpWithIcon = { ...inp, paddingInlineStart: 42 };

  const focusRing = e => { e.target.style.borderColor = '#8B1A1A'; e.target.style.boxShadow = '0 0 0 3px rgba(139,26,26,.08)'; };
  const blurRing = e => { e.target.style.boxShadow = 'none'; };

  return (
    <div className="fade-up" style={{ display: 'flex', minHeight: isDesktop ? 'auto' : 'auto' }}>
      {isDesktop && (
        <div style={{ flex: 1, background: '#F5F2EC', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 48, borderRadius: 4, marginInlineStart: 32, position: 'relative', overflow: 'hidden', border: '1px solid rgba(10,7,5,.10)' }}>
          <div style={{ position: 'relative', textAlign: 'center' }}>
            <div style={{ width: 44, height: 44, margin: '0 auto 20px', background: '#0A0705', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 900, fontSize: 18, fontFamily: "'Courier New', monospace" }}>M</div>
            <div style={{ fontWeight: 900, fontSize: 13, letterSpacing: 3, marginBottom: 16, color: '#9C7B6A' }}>MEATHUB</div>
            <div style={{ color: '#1A0F0A', fontWeight: 900, fontSize: 36, lineHeight: 1.2, marginBottom: 12, fontFamily: "'Playfair Display', Georgia, serif" }}>בשר פרימיום<br />ישר מהיבואן</div>
            <div style={{ color: '#8B1A1A', fontSize: 15, marginBottom: 32, fontWeight: 600 }}>חוסכים 40–60% ביחד</div>
            {[
              { name: 'פיקניה', name_en: 'Picanha', price_group: 145, price_retail: 220 },
              { name: 'אנטריקוט', name_en: 'Ribeye', price_group: 189, price_retail: 310 },
              { name: 'פילה', name_en: 'Tenderloin', price_group: 210, price_retail: 380 },
              { name: 'אסאדו', name_en: 'Short Rib', price_group: 98, price_retail: 160 },
            ].map(p => (
              <div key={p.name} style={{ display: 'flex', alignItems: 'center', gap: 12, background: '#FFFFFF', border: '1px solid rgba(10,7,5,.10)', borderRadius: 4, padding: '10px 16px', marginBottom: 8, textAlign: 'right' }}>
                <div style={{ width: 36, height: 36, background: '#0A0705', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#FFF', fontSize: 10, fontWeight: 700 }}>{p.name.slice(0,2)}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ color: '#1A0F0A', fontWeight: 700, fontSize: 13 }}>{p.name}</div>
                  <div style={{ color: '#9C7B6A', fontSize: 11, fontFamily: "'Courier New', monospace" }}>₪{p.price_group} לק"ג</div>
                </div>
                <div style={{ color: '#8B1A1A', fontWeight: 800, fontSize: 13, fontFamily: "'Courier New', monospace" }}>-{Math.round((1 - p.price_group / p.price_retail) * 100)}%</div>
              </div>
            ))}
          </div>
        </div>
      )}
      <div style={{ width: isDesktop ? 400 : '100%', flexShrink: 0, display: 'flex', flexDirection: 'column', background: '#fff', borderRadius: isDesktop ? 4 : 0, border: isDesktop ? '1px solid rgba(10,7,5,.10)' : 'none', boxShadow: isDesktop ? '0 4px 24px rgba(10,7,5,.06)' : 'none', overflow: 'hidden' }}>
        {!isDesktop && (
          <div style={{ background: '#F5F2EC', padding: '44px 24px 32px', textAlign: 'center', borderBottom: '1px solid rgba(10,7,5,.10)' }}>
            <div style={{ width: 40, height: 40, margin: '0 auto 14px', background: '#0A0705', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 900, fontSize: 16, fontFamily: "'Courier New', monospace" }}>M</div>
            <div style={{ fontWeight: 900, fontSize: 11, letterSpacing: 3, marginBottom: 10, color: '#9C7B6A' }}>MEATHUB</div>
            <div style={{ color: '#1A0F0A', fontWeight: 900, fontSize: 24, marginBottom: 6, fontFamily: "'Playfair Display', Georgia, serif" }}>{mode === 'login' ? 'ברוך השב!' : 'הצטרף אלינו'}</div>
            <div style={{ color: '#9C7B6A', fontSize: 13 }}>בשר פרימיום ישר מהיבואן · חיסכון 40–60%</div>
          </div>
        )}
        <div style={{ flex: 1, padding: isDesktop ? '32px 32px' : '28px 24px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          {isDesktop && <div style={{ fontWeight: 900, fontSize: 24, marginBottom: 24, color: '#0A0705' }}>{mode === 'login' ? 'כניסה לחשבון' : 'יצירת חשבון'}</div>}
          <button
            onClick={() => signInWithGoogle()}
            style={{ width: '100%', height: 50, borderRadius: 2, border: '1px solid rgba(10,7,5,.14)', background: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, cursor: 'pointer', fontFamily: 'inherit', fontWeight: 700, fontSize: 15, marginBottom: 20, color: '#0A0705', transition: 'border-color 150ms ease' }}
            onMouseEnter={e => e.currentTarget.style.borderColor = 'rgba(10,7,5,.30)'}
            onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(10,7,5,.14)'}
          >
            <Icon name="google" size={20} />{mode === 'login' ? 'כניסה עם Google' : 'הרשמה עם Google'}
          </button>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
            <div style={{ flex: 1, height: 1, background: 'rgba(140,88,89,.10)' }} />
            <span style={{ color: '#8C6B5A', fontSize: 12 }}>או עם אימייל</span>
            <div style={{ flex: 1, height: 1, background: 'rgba(140,88,89,.10)' }} />
          </div>
          {mode === 'register' && (
            <>
              <div style={{ marginBottom: 12 }}>
                <input
                  value={name}
                  onChange={e => { setName(e.target.value); if (nameErr) validateName(e.target.value); }}
                  onBlur={e => validateName(e.target.value)}
                  placeholder="שם מלא"
                  style={{ ...inp, border: `1px solid ${nameErr ? 'rgba(239,68,68,.6)' : 'rgba(10,7,5,.14)'}` }}
                />
                {nameErr && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 4, color: '#8B1A1A', fontSize: 12, marginTop: 4 }}>
                    <span>✗</span><span>{nameErr}</span>
                  </div>
                )}
              </div>
              <div style={{ display: 'flex', gap: 12, marginBottom: 12 }}>
                <input
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  placeholder="טלפון (לא חובה)"
                  type="tel"
                  dir="rtl"
                  style={{ ...inp, flex: 1, direction: 'rtl', textAlign: 'right', unicodeBidi: 'plaintext' }}
                />
                <div style={{ flex: 1 }}>
                  <select
                    value={city}
                    onChange={e => { setCity(e.target.value); if (cityErr) validateCity(e.target.value); }}
                    onBlur={e => validateCity(e.target.value)}
                    style={{ ...inp, border: `1px solid ${cityErr ? 'rgba(239,68,68,.6)' : 'rgba(10,7,5,.14)'}`, cursor: 'pointer' }}
                  >
                    <option value="">בחר עיר</option>
                    {CITIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
              </div>
              {cityErr && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 4, color: '#8B1A1A', fontSize: 12, marginTop: -8, marginBottom: 12 }}>
                  <span>✗</span><span>{cityErr}</span>
                </div>
              )}
            </>
          )}

          <div style={{ marginBottom: 12 }}>
            <div style={{ position: 'relative' }}>
              <div style={{ position: 'absolute', insetInlineStart: 14, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}>
                <Icon name="mail" size={16} color={emailErr ? '#8B1A1A' : '#9C8070'} />
              </div>
              <input
                value={email}
                onChange={e => { setEmail(e.target.value); if (emailErr) validateEmail(e.target.value); }}
                onBlur={e => { blurRing(e); validateEmail(e.target.value); }}
                onFocus={focusRing}
                placeholder="אימייל"
                type="email"
                style={{ ...inpWithIcon, border: `1px solid ${emailErr ? 'rgba(239,68,68,.6)' : 'rgba(10,7,5,.14)'}` }}
              />
            </div>
            {emailErr && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 4, color: '#8B1A1A', fontSize: 12, marginTop: 4 }}>
                <span style={{ color: '#8B1A1A' }}>✗</span><span>{emailErr}</span>
              </div>
            )}
          </div>

          <div style={{ marginBottom: 14 }}>
            <div style={{ position: 'relative' }}>
              <div style={{ position: 'absolute', insetInlineStart: 14, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}>
                <Icon name="lock" size={16} color={pwErr ? '#8B1A1A' : '#9C8070'} />
              </div>
              <input
                value={pw}
                onChange={e => { setPw(e.target.value); if (pwErr) validatePw(e.target.value); }}
                onBlur={e => { blurRing(e); validatePw(e.target.value); }}
                onFocus={focusRing}
                placeholder="סיסמה"
                type="password"
                style={{ ...inpWithIcon, border: `1px solid ${pwErr ? 'rgba(239,68,68,.6)' : 'rgba(10,7,5,.14)'}` }}
              />
            </div>
            {pwErr && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 4, color: '#8B1A1A', fontSize: 12, marginTop: 4 }}>
                <span>✗</span><span>{pwErr}</span>
              </div>
            )}
            {strength && !pwErr && (
              <div style={{ marginTop: 6 }}>
                <div style={{ height: 3, background: 'rgba(10,7,5,.10)', borderRadius: 0, overflow: 'hidden', marginBottom: 4 }}>
                  <div style={{ height: '100%', width: strength.width, background: strength.color, borderRadius: 0, transition: 'width .3s, background .3s' }} />
                </div>
                <div style={{ fontSize: 11, color: strength.color, fontWeight: 600 }}>חוזק סיסמה: {strength.level}</div>
              </div>
            )}
          </div>

          {mode === 'register' && (
            <div style={{ marginBottom: 14 }}>
              <div style={{ position: 'relative' }}>
                <div style={{ position: 'absolute', insetInlineStart: 14, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}>
                  <Icon name="lock" size={16} color={pw2Err ? '#8B1A1A' : '#9C8070'} />
                </div>
                <input
                  value={pw2}
                  onChange={e => { setPw2(e.target.value); if (pw2Err) validatePw2(e.target.value); }}
                  onBlur={e => { blurRing(e); validatePw2(e.target.value); }}
                  onFocus={focusRing}
                  placeholder="אימות סיסמה"
                  type="password"
                  style={{ ...inpWithIcon, border: `1px solid ${pw2Err ? 'rgba(239,68,68,.6)' : pw2 && pw2 === pw ? 'rgba(34,197,94,.5)' : 'rgba(10,7,5,.14)'}` }}
                />
              </div>
              {pw2Err ? (
                <div style={{ display: 'flex', alignItems: 'center', gap: 4, color: '#8B1A1A', fontSize: 12, marginTop: 4 }}>
                  <span>✗</span><span>{pw2Err}</span>
                </div>
              ) : pw2 && pw2 === pw ? (
                <div style={{ display: 'flex', alignItems: 'center', gap: 4, color: '#22C55E', fontSize: 12, marginTop: 4 }}>
                  <span>✓</span><span>הסיסמאות תואמות</span>
                </div>
              ) : null}
            </div>
          )}

          {err && <div style={{ color: '#8B1A1A', fontSize: 12, marginBottom: 10, padding: '8px 12px', background: 'transparent', borderRadius: 0, border: '1px solid rgba(139,26,26,.30)' }}>{err}</div>}
          <Btn full size="lg" onClick={submit} disabled={loading} style={{ marginBottom: 14, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {loading && <Spinner />}
            {loading ? 'מתחבר...' : mode === 'login' ? 'התחבר' : 'צור חשבון'}
          </Btn>
          <div style={{ textAlign: 'center', fontSize: 13, color: '#8C6B5A' }}>
            {mode === 'login' ? 'אין לך חשבון? ' : 'כבר יש לך חשבון? '}
            <button onClick={() => { setMode(mode === 'login' ? 'register' : 'login'); setErr(''); setEmailErr(''); setPwErr(''); setPw2Err(''); setNameErr(''); setCityErr(''); }} style={{ background: 'none', border: 'none', color: '#8B1A1A', fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit', fontSize: 13 }}>{mode === 'login' ? 'הירשם' : 'התחבר'}</button>
          </div>
        </div>
      </div>
    </div>
  );
};
