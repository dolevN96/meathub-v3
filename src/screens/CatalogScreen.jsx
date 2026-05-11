import { useState, useMemo } from 'react';
import { PRODUCTS, GROUPS, CATEGORIES } from '../data';
import { Icon } from '../components/Icon';
import { Tag } from '../components/Tag';
import { ProductCard } from '../components/ProductCard';

export const CatalogScreen = ({ onNavigate, bp }) => {
  const [search, setSearch] = useState('');
  const [cat, setCat] = useState('הכל');
  const [grade, setGrade] = useState('הכל');

  const filtered = useMemo(() => {
    return PRODUCTS.filter(p => {
      const s = search.toLowerCase();
      if (s && !p.name.includes(s) && !p.category.includes(s)) return false;
      if (cat !== 'הכל' && p.category !== cat) return false;
      if (grade !== 'הכל' && p.grade !== grade) return false;
      return true;
    });
  }, [search, cat, grade]);

  return (
    <div className="fade-up">
      <div style={{ position: 'relative', marginBottom: 16 }} className="px-mobile">
        <div style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}><Icon name="search" size={16} color="#8C6B5A" /></div>
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="חיפוש נתח..."
          style={{ width: '100%', height: 46, borderRadius: 12, border: '1px solid rgba(140,88,89,.18)', background: '#EFF6D9', padding: '0 44px 0 16px', fontSize: 14, fontFamily: 'inherit', color: '#1E0E0E', outline: 'none' }}
        />
      </div>
      <div style={{ display: 'flex', gap: 8, overflowX: 'auto', scrollbarWidth: 'none', paddingBottom: 4, marginBottom: 12 }} className="px-mobile">
        {CATEGORIES.map(c => <Tag key={c} active={cat === c} onClick={() => setCat(c)}>{c}</Tag>)}
      </div>
      <div style={{ display: 'flex', gap: 8, overflowX: 'auto', scrollbarWidth: 'none', paddingBottom: 4, marginBottom: 20 }} className="px-mobile">
        {['הכל', 'F', 'E', 'D', 'C', 'B', 'A'].map(g => (
          <Tag key={g} active={grade === g} onClick={() => setGrade(g)}>{g === 'הכל' ? 'כל הדרגות' : `GRADE ${g}`}</Tag>
        ))}
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: 12 }} className="catalog-grid px-mobile">
        {filtered.map(p => (
          <ProductCard key={p.id} product={p} onPress={() => onNavigate('group', { groupId: GROUPS.find(g => g.productId === p.id)?.id || GROUPS[0].id })} />
        ))}
        {filtered.length === 0 && (
          <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '60px 20px', color: '#8C6B5A' }}>לא נמצאו נתחים</div>
        )}
      </div>
    </div>
  );
};
