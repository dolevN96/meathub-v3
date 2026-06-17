import { useState, useEffect } from 'react';
import { Icon } from '../components/Icon';
import { Btn } from '../components/Btn';

export const LandingPage = ({ onEnterApp, onGoToCatalog, onNavigate, cartCount = 0, user }) => {
  const [scrolled, setScrolled] = useState(false);
  const [visibleSections, setVisibleSections] = useState({});
  const [openFaq, setOpenFaq] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(e => {
          if (e.isIntersecting) setVisibleSections(prev => ({ ...prev, [e.target.id]: true }));
        });
      },
      { threshold: 0.15 }
    );
    document.querySelectorAll('[data-animate]').forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const features = [
    { icon: 'zap', title: 'חיסכון של 40–60%', desc: 'קנייה קבוצתית ישירות מהיבואן, ללא רווחי ביניים. המחיר המשתלם ביותר בשוק.' },
    { icon: 'shield', title: 'איכות מאומתת', desc: 'כל ספק עובר בדיקת איכות קפדנית. רק בשר פרימיום, עם תעודות כשרות ואיכות.' },
    { icon: 'users', title: 'כוח הקבוצה', desc: 'ככל שיותר אנשים מצטרפים — המחיר יורד. ביחד אנחנו חזקים יותר.' },
    { icon: 'map', title: 'איסוף קל ונוח', desc: 'נקודות איסוף בכל רחבי הארץ, עם תיאום מדויק לפי לוח הזמנים שלך.' },
    { icon: 'flame', title: 'נתחים פרימיום', desc: 'מבחר של עשרות נתחים מכל העולם — אנטריקוט, פילה, טומהוק ועוד.' },
    { icon: 'bell', title: 'התראות בזמן אמת', desc: 'קבל עדכון מיידי כשהקבוצה נסגרת ומתי להגיע לאיסוף.' },
  ];

  const steps = [
    { num: 1, title: 'בחר נתח', desc: 'עיין בקטלוג וגלה נתחים פרימיום ממיטב הספקים' },
    { num: 2, title: 'הצטרף לקבוצה', desc: 'הצטרף לקבוצת רכישה פעילה ונהנה מהמחיר הנמוך' },
    { num: 3, title: 'ממתין לסגירה', desc: 'הקבוצה נסגרת כשמגיעים ליעד — תקבל עדכון' },
    { num: 4, title: 'אוסף ונהנה', desc: 'הגע לנקודת האיסוף, קח את ההזמנה ותהנה!' },
  ];

  const faqs = [
    { q: 'איך התשלום עובד?', a: 'אתם מצטרפים לקבוצה בלי לשלם מראש. החיוב מתבצע רק כשהקבוצה נסגרת ומגיעה למספר המשתתפים הנדרש — אם הקבוצה לא נסגרת, אתם לא משלמים כלום.' },
    { q: 'מה קורה אם קבוצה לא נסגרת?', a: 'ההזמנה שלכם מבוטלת אוטומטית וללא כל חיוב. תמיד אפשר להצטרף לקבוצה אחרת לאותו נתח או להמשיך לעקוב עד שתיפתח קבוצה חדשה.' },
    { q: 'איפה אוספים את ההזמנה?', a: 'בכל רחבי הארץ יש נקודות איסוף מתואמות מראש. לאחר סגירת הקבוצה תקבלו הודעה עם מיקום ושעת איסוף מדויקים.' },
    { q: 'איך אתם שומרים על איכות הבשר?', a: 'כל ספק עובר תהליך סינון קפדני, וכל נתח מגיע עם תיעוד מקור, דירוג שומן (BMS) ותעודת איכות — בלי הפתעות.' },
  ];

  const testimonials = [
    { name: 'דוד כהן', city: 'תל אביב', text: 'שיניתי לגמרי את הדרך שאני קונה בשר. חסכתי כמעט 800 שקל בחודש ומקבל בשר הרבה יותר טוב!', rating: 5 },
    { name: 'שרה לוי', city: 'ירושלים', text: 'הייתי סקפטית בהתחלה, אבל אחרי ההזמנה הראשונה הפכתי לממנה קבועה. האיכות פשוט מדהימה.', rating: 5 },
    { name: 'מיכאל גרינברג', city: 'חיפה', text: 'הקצב שלי כועס עלי... אבל אני לא יכול לחזור אחורה אחרי שגיליתי את MeatHub.', rating: 5 },
  ];

  const animStyle = (id) => ({
    opacity: visibleSections[id] ? 1 : 0,
    transform: visibleSections[id] ? 'translateY(0)' : 'translateY(30px)',
    transition: 'opacity .7s cubic-bezier(0.23,1,0.32,1), transform .7s cubic-bezier(0.23,1,0.32,1)',
  });

  return (
    <div className="landing-root" style={{ fontFamily: 'inherit' }}>
      {/* Nav */}
      <nav className={`lp-nav${scrolled ? ' scrolled' : ''}`}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span onClick={onEnterApp} style={{ fontWeight: 900, fontSize: 20, letterSpacing: 2, color: '#8B1A1A', cursor: 'pointer' }}>MEATHUB</span>
        </div>
        <div style={{ display: 'flex', gap: 28, alignItems: 'center' }}>
          {['איך זה עובד', 'ביקורות'].map(l => (
            <a key={l} href={`#${l}`} style={{ color: '#5C3535', fontSize: 14, fontWeight: 600, textDecoration: 'none', transition: 'color .2s' }}
              onMouseEnter={e => e.target.style.color = '#1E0E0E'}
              onMouseLeave={e => e.target.style.color = '#5C3535'}
            >{l}</a>
          ))}
          <button
            onClick={onGoToCatalog}
            style={{ color: '#5C3535', fontSize: 14, fontWeight: 600, background: 'none', border: 'none', cursor: 'pointer', padding: 0, fontFamily: 'Heebo, sans-serif', transition: 'color .2s' }}
            onMouseEnter={e => e.target.style.color = '#1E0E0E'}
            onMouseLeave={e => e.target.style.color = '#5C3535'}
          >מוצרים</button>
        </div>
        <div className="topbar-actions">
          <button
            onClick={() => onNavigate ? onNavigate('cart') : onEnterApp()}
            style={{ position: 'relative', background: 'transparent', border: '1px solid rgba(10,7,5,.14)', borderRadius: 2, width: 40, height: 40, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', transition: 'border-color 150ms ease' }}
          >
            <Icon name="cart" size={18} color="#0A0705" />
            {cartCount > 0 && <div style={{ position: 'absolute', top: -6, insetInlineStart: -6, background: '#8B1A1A', color: '#fff', fontSize: 9, fontWeight: 800, borderRadius: '50%', width: 17, height: 17, display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px solid #FFFFFF' }}>{cartCount}</div>}
          </button>
          {user ? (
            <div onClick={() => onNavigate ? onNavigate('profile') : onEnterApp()} style={{ width: 40, height: 40, borderRadius: 0, background: '#0A0705', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 800, fontSize: 15, cursor: 'pointer' }}>{user.name?.charAt(0) || 'מ'}</div>
          ) : (
            <Btn onClick={() => onNavigate ? onNavigate('login') : onEnterApp()} size="sm" style={{ height: 38, padding: '0 16px', fontSize: 13 }}>כניסה</Btn>
          )}
        </div>
      </nav>

      {/* Hero */}
      <section className="hero-section">
        <div className="hero-bg" />

        <div style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', maxWidth: 760 }}>
          <div className="hero-eyebrow">
            <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#C9A44A', animation: 'pulse 2s infinite' }} />
            <span>פלטפורמת רכישת הבשר הפרימיום מספר 1 בישראל</span>
          </div>

          <h1 className="hero-title">
            <span className="accent">בשר פרימיום</span><br />
            ישר מהיבואן<br />
            <span className="accent">חיסכון 40–60%</span>
          </h1>

          <p className="hero-sub">
            הצטרף לאלפי ישראלים שכבר גילו את הסוד — רכישה קבוצתית של נתחים פרימיום ישירות מהיבואן, בלי ביניים, בלי תוספות.
          </p>

          <div className="hero-cta-group">
            <Btn onClick={onEnterApp} size="lg" style={{ padding: '0 36px', fontSize: 16, borderRadius: 2 }}>
              התחל לחסוך עכשיו
              <Icon name="arrowLeft" size={18} color="#fff" />
            </Btn>
            <Btn onClick={onEnterApp} variant="ghost" size="lg" style={{ padding: '0 28px', fontSize: 15, borderRadius: 2 }}>
              ראה קבוצות פעילות
            </Btn>
          </div>

          <div className="hero-stats">
            {[
              { num: '12,000+', label: 'חברים פעילים' },
              { num: '₪2.4M', label: 'נחסכו השנה' },
              { num: '94%', label: 'שביעות רצון' },
            ].map((s, i) => (
              <div key={i} className="hero-stat">
                <div className="hero-stat-num">{s.num}</div>
                <div className="hero-stat-label">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust bar */}
      <div className="trust-bar" style={{ background: 'rgba(255,255,255,.02)' }}>
        {[
          { icon: 'shield', text: 'תשלום מאובטח' },
          { icon: 'check', text: 'כשרות מאומתת' },
          { icon: 'star', text: 'דירוג 4.9/5' },
          { icon: 'users', text: '12,000 חברים' },
          { icon: 'flame', text: 'נתחים פרימיום' },
        ].map((t, i) => (
          <div key={i} className="trust-item">
            <Icon name={t.icon} size={16} color="#8C5859" />
            <span>{t.text}</span>
          </div>
        ))}
      </div>

      {/* Features */}
      <section className="lp-section" id="features" data-animate>
        <div id="feat-header" data-animate style={animStyle('feat-header')}>
          <div className="section-eyebrow">למה MeatHub?</div>
          <h2 className="section-heading">הדרך החכמה לקנות בשר</h2>
          <p className="section-desc">בשר פרימיום לא אמור לעלות פרימיום. אנחנו מחברים אתכם ישירות ליבואנים.</p>
        </div>
        <div className="features-grid">
          {features.map((f, i) => (
            <div key={i} className="feature-card" id={`feat-${i}`} data-animate style={{ ...animStyle(`feat-${i}`), transitionDelay: `${i * 0.08}s` }}>
              <div className="feature-icon"><Icon name={f.icon} size={22} color="#8C5859" /></div>
              <div className="feature-title">{f.title}</div>
              <div className="feature-desc">{f.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section style={{ padding: '80px 24px', background: 'rgba(255,255,255,.02)', borderTop: '1px solid rgba(140,88,89,.12)', borderBottom: '1px solid rgba(140,88,89,.12)' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }} id="איך זה עובד">
          <div style={{ textAlign: 'center', marginBottom: 0 }} id="steps-header" data-animate>
            <div className="section-eyebrow">התהליך</div>
            <h2 className="section-heading">פשוט כמו 1-2-3-4</h2>
          </div>
          <div className="steps-grid" id="steps-grid" data-animate style={animStyle('steps-grid')}>
            {steps.map((s, i) => (
              <div key={i} className="step-item">
                <div className="step-num">{s.num}</div>
                <div className="step-title">{s.title}</div>
                <div className="step-desc">{s.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="lp-section" id="שאלות נפוצות">
        <div id="faq-header" data-animate style={{ ...animStyle('faq-header'), maxWidth: 700, margin: '0 auto' }}>
          <div className="section-eyebrow">שאלות נפוצות</div>
          <h2 className="section-heading">כל מה שצריך לדעת</h2>
        </div>
        <div id="faq-list" data-animate style={{ ...animStyle('faq-list'), maxWidth: 700, margin: '32px auto 0' }}>
          {faqs.map((f, i) => {
            const open = openFaq === i;
            return (
              <div key={i} style={{ borderBottom: '1px solid rgba(140,88,89,.14)' }}>
                <button
                  onClick={() => setOpenFaq(open ? -1 : i)}
                  style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, background: 'none', border: 'none', cursor: 'pointer', padding: '20px 0', textAlign: 'inherit', fontFamily: 'inherit' }}
                >
                  <span style={{ fontSize: 16, fontWeight: 700, color: '#1E0E0E' }}>{f.q}</span>
                  <Icon name="chevronD" size={18} color="#8B1A1A" style={{ transform: open ? 'rotate(180deg)' : 'none', transition: 'transform 200ms ease', flexShrink: 0 }} />
                </button>
                <div style={{ maxHeight: open ? 200 : 0, overflow: 'hidden', transition: 'max-height 250ms cubic-bezier(0.23,1,0.32,1)' }}>
                  <p style={{ margin: '0 0 20px', fontSize: 14.5, lineHeight: 1.7, color: '#5C3535' }}>{f.a}</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Testimonials */}
      <section className="lp-section" id="ביקורות">
        <div id="test-header" data-animate style={animStyle('test-header')}>
          <div className="section-eyebrow">לקוחות מרוצים</div>
          <h2 className="section-heading">הם כבר גילו את הסוד</h2>
        </div>
        <div className="testimonials-grid">
          {testimonials.map((t, i) => (
            <div key={i} className="testimonial-card" id={`test-${i}`} data-animate style={{ ...animStyle(`test-${i}`), transitionDelay: `${i * .12}s` }}>
              <div className="stars">
                {Array(t.rating).fill(0).map((_, j) => <Icon key={j} name="star" size={14} color="#C9A44A" />)}
              </div>
              <div className="testimonial-text">"{t.text}"</div>
              <div className="testimonial-author">
                <div className="author-avatar">{t.name.charAt(0)}</div>
                <div>
                  <div className="author-name">{t.name}</div>
                  <div className="author-meta">{t.city}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <div className="cta-section">
        <div style={{ position: 'relative', zIndex: 1 }}>
          <div className="section-eyebrow" style={{ display: 'block', textAlign: 'center', marginBottom: 16 }}>מוכן להתחיל?</div>
          <h2 style={{ fontSize: 'clamp(32px,5vw,56px)', fontWeight: 900, color: '#1E0E0E', marginBottom: 16, letterSpacing: '-1px' }}>הצטרף ל-12,000 חוסכים</h2>
          <p style={{ fontSize: 18, color: '#5C3535', marginBottom: 40, maxWidth: 440, margin: '0 auto 40px' }}>ההרשמה חינמית לחלוטין. הצטרף עכשיו וחסוך בהזמנה הראשונה.</p>
          <div style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Btn onClick={() => onNavigate ? onNavigate('login', { mode: 'register' }) : onEnterApp()} size="lg" style={{ padding: '0 40px', fontSize: 16 }}>הצטרף עכשיו — חינם</Btn>
            <Btn onClick={onEnterApp} variant="ghost" size="lg" style={{ padding: '0 28px', fontSize: 15 }}>גלה קבוצות פעילות</Btn>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer style={{ borderTop: '1px solid rgba(140,88,89,.12)', padding: '32px 24px' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 20 }}>
          <div>
            <div style={{ fontWeight: 900, fontSize: 18, letterSpacing: 2, color: '#8B1A1A', marginBottom: 4 }}>MEATHUB</div>
            <div style={{ fontSize: 12, color: '#8C6B5A' }}>© 2025 MeatHub. כל הזכויות שמורות.</div>
          </div>
          <div style={{ display: 'flex', gap: 24 }}>
            {['תנאי שימוש', 'פרטיות', 'צור קשר'].map(l => (
              <a key={l} href="#" onClick={e => e.preventDefault()} style={{ fontSize: 13, color: '#8C6B5A', textDecoration: 'none', transition: 'color .2s' }}
                onMouseEnter={e => e.target.style.color = '#5C3535'}
                onMouseLeave={e => e.target.style.color = '#8C6B5A'}
              >{l}</a>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
};
