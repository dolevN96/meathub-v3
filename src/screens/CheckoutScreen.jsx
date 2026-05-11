import { useState } from 'react';
import React from 'react';
import { PRODUCTS, GROUPS } from '../data';
import { Icon } from '../components/Icon';
import { Btn } from '../components/Btn';

export const CheckoutScreen = ({ onNavigate, cart, onClearCart, bp }) => {
  const [step, setStep] = useState(0);
  const [pay, setPay] = useState('visa');
  const [cardNum, setCardNum] = useState('');
  const [exp, setExp] = useState('');
  const [cvv, setCvv] = useState('');
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState('');
  const isDesktop = bp === 'desktop';
  const total = cart.reduce((s, i) => {
    const p = PRODUCTS.find(pr => pr.id === i.productId);
    return s + (p ? p.priceGroup * i.qty : 0);
  }, 0) * 1.06;
  const steps = ['סיכום', 'תשלום', 'אישור'];

  const handlePay = () => {
    if (pay === 'visa' && cardNum.replace(/\s/g, '').length < 12) { setErr('נא להזין מספר כרטיס תקין'); return; }
    setErr(''); setLoading(true);
    setTimeout(() => { setLoading(false); setStep(2); onClearCart && onClearCart(); }, 1800);
  };

  if (step === 2) return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '60px 32px', textAlign: 'center', minHeight: '60vh' }} className="fade-up">
      <div style={{ width: 80, height: 80, borderRadius: '50%', background: '#22C55E', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 20, boxShadow: '0 4px 30px rgba(34,197,94,.4)' }}><Icon name="check" size={40} color="#fff" /></div>
      <div style={{ fontWeight: 900, fontSize: 26, marginBottom: 8, color: '#1E0E0E' }}>ההזמנה אושרה!</div>
      <div style={{ fontSize: 14, color: '#8C6B5A', marginBottom: 28 }}>תקבל התראה כשהקבוצה תסגר</div>
      <div className="card" style={{ width: '100%', maxWidth: 340, marginBottom: 24 }}>
        <div style={{ fontSize: 12, color: '#8C6B5A', marginBottom: 4 }}>מספר הזמנה</div>
        <div style={{ fontWeight: 800, fontSize: 18, letterSpacing: 2, marginBottom: 16, color: '#1E0E0E' }}>#MH-{Math.floor(Math.random() * 90000 + 10000)}</div>
        <div style={{ background: 'rgba(255,255,255,.04)', borderRadius: 10, padding: 20, border: '2px dashed rgba(140,88,89,.45)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
          <Icon name="qr" size={64} color="#1E0E0E" />
          <div style={{ fontSize: 11, color: '#8C6B5A', fontWeight: 600 }}>QR לאיסוף</div>
        </div>
      </div>
      <Btn onClick={() => onNavigate('home')} style={{ minWidth: 200 }}>חזור לדף הבית</Btn>
    </div>
  );

  const StepDots = () => (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0, paddingBottom: 20 }}>
      {steps.map((s, i) => (
        <React.Fragment key={i}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
            <div style={{ width: 28, height: 28, borderRadius: '50%', background: i < step ? '#22C55E' : i === step ? '#8C5859' : 'rgba(140,88,89,.18)', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all .3s' }}>
              {i < step ? <Icon name="check" size={14} color="#fff" /> : <span style={{ color: i === step ? '#fff' : '#8C6B5A', fontSize: 12, fontWeight: 700 }}>{i + 1}</span>}
            </div>
            <span style={{ fontSize: 10, color: i === step ? '#8C5859' : '#8C6B5A', fontWeight: i === step ? 700 : 500 }}>{s}</span>
          </div>
          {i < 2 && <div style={{ width: 52, height: 2, background: i < step ? '#22C55E' : 'rgba(140,88,89,.10)', marginBottom: 14, transition: 'background .3s' }} />}
        </React.Fragment>
      ))}
    </div>
  );

  const inp = { width: '100%', height: 46, borderRadius: 12, border: '1px solid rgba(255,255,255,.12)', background: 'rgba(255,255,255,.04)', padding: '0 14px', fontSize: 14, fontFamily: 'inherit', color: '#1E0E0E', outline: 'none', marginBottom: 12, display: 'block' };

  return (
    <div className="fade-up">
      <StepDots />
      <div style={{ maxWidth: isDesktop ? 560 : 9999, margin: '0 auto' }} className="px-mobile">
        {step === 0 && (
          <>
            {cart.map(item => {
              const p = PRODUCTS.find(pr => pr.id === item.productId);
              const g = GROUPS.find(gr => gr.id === item.groupId);
              if (!p || !g) return null;
              return (
                <div key={item.groupId} className="card" style={{ marginBottom: 10, display: 'flex', gap: 12 }}>
                  <div style={{ width: 50, height: 50, borderRadius: 10, background: `linear-gradient(135deg,${p.color1},${p.color2})`, flexShrink: 0 }} />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 700, fontSize: 14, color: '#1E0E0E' }}>{p.name}</div>
                    <div style={{ fontSize: 12, color: '#8C6B5A' }}>{item.qty} ק"ג · {g.location}</div>
                  </div>
                  <div style={{ fontWeight: 800, fontSize: 15, color: '#8C5859' }}>₪{(p.priceGroup * item.qty).toFixed(0)}</div>
                </div>
              );
            })}
            <div className="card" style={{ marginBottom: 14 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                <span style={{ color: '#8C6B5A', fontSize: 13 }}>סכום ביניים</span>
                <span style={{ fontWeight: 600, color: '#5C3535' }}>{(total / 1.06).toFixed(0)}₪</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                <span style={{ color: '#8C6B5A', fontSize: 13 }}>עמלת תפעול (6%)</span>
                <span style={{ fontWeight: 600, color: '#5C3535' }}>{(total - total / 1.06).toFixed(0)}₪</span>
              </div>
              <div style={{ height: 1, background: 'rgba(140,88,89,.10)', margin: '10px 0' }} />
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ fontWeight: 800, color: '#1E0E0E' }}>סה"כ</span>
                <span style={{ fontWeight: 900, fontSize: 18, color: '#8C5859' }}>₪{total.toFixed(0)}</span>
              </div>
            </div>
            <Btn full size="lg" onClick={() => setStep(1)}>המשך לתשלום →</Btn>
          </>
        )}
        {step === 1 && (
          <>
            <div style={{ fontWeight: 800, fontSize: 15, marginBottom: 14, color: '#1E0E0E' }}>אמצעי תשלום</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 16 }}>
              {[{ k: 'visa', l: 'כרטיס אשראי', s: 'Visa, Mastercard, Amex' }, { k: 'bit', l: 'Bit', s: 'ביט' }, { k: 'paybox', l: 'PayBox', s: 'פייבוקס' }].map(m => (
                <div key={m.k} onClick={() => setPay(m.k)} style={{ background: pay === m.k ? 'rgba(232,54,26,.1)' : 'rgba(255,255,255,.04)', borderRadius: 14, padding: '14px 16px', border: `2px solid ${pay === m.k ? 'rgba(232,54,26,.5)' : 'rgba(140,88,89,.18)'}`, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 12, transition: 'all .2s' }}>
                  <div style={{ width: 20, height: 20, borderRadius: '50%', border: `2px solid ${pay === m.k ? '#8C5859' : 'rgba(255,255,255,.2)'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    {pay === m.k && <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#8C5859' }} />}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 700, fontSize: 14, color: '#1E0E0E' }}>{m.l}</div>
                    <div style={{ fontSize: 11, color: '#8C6B5A' }}>{m.s}</div>
                  </div>
                </div>
              ))}
            </div>
            {pay === 'visa' && (
              <div className="card" style={{ marginBottom: 14 }}>
                <label style={{ fontSize: 12, fontWeight: 600, color: '#8C6B5A', display: 'block', marginBottom: 6 }}>מספר כרטיס</label>
                <input value={cardNum} onChange={e => setCardNum(e.target.value.replace(/[^\d\s]/g, '').substring(0, 19))} placeholder="0000 0000 0000 0000" style={{ ...inp, direction: 'ltr', textAlign: 'left', border: `1px solid ${err ? 'rgba(239,68,68,.5)' : 'rgba(255,255,255,.12)'}` }} />
                <div style={{ display: 'flex', gap: 12 }}>
                  <div style={{ flex: 1 }}>
                    <label style={{ fontSize: 12, fontWeight: 600, color: '#8C6B5A', display: 'block', marginBottom: 6 }}>תוקף</label>
                    <input value={exp} onChange={e => setExp(e.target.value)} placeholder="MM/YY" style={{ ...inp, direction: 'ltr', textAlign: 'left' }} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <label style={{ fontSize: 12, fontWeight: 600, color: '#8C6B5A', display: 'block', marginBottom: 6 }}>CVV</label>
                    <input value={cvv} onChange={e => setCvv(e.target.value)} placeholder="000" style={{ ...inp, direction: 'ltr', textAlign: 'left' }} />
                  </div>
                </div>
                {err && <div style={{ color: '#EF4444', fontSize: 12 }}>{err}</div>}
              </div>
            )}
            <div style={{ background: 'rgba(34,197,94,.06)', borderRadius: 12, padding: '10px 14px', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8, border: '1px solid rgba(34,197,94,.2)' }}>
              <Icon name="lock" size={15} color="#22C55E" />
              <span style={{ fontSize: 12, color: '#22C55E' }}>תשלום מאובטח. חיוב רק לאחר סגירת הקבוצה.</span>
            </div>
            <Btn full size="lg" onClick={handlePay} disabled={loading}>{loading ? 'מעבד...' : `שלם ₪${total.toFixed(0)}`}</Btn>
          </>
        )}
      </div>
    </div>
  );
};
