import { useState, useMemo } from 'react';
import { useProducts } from '../lib/db';
import { Icon } from '../components/Icon';

const getCutType = name => name?.split('/')[0]?.trim() || '';

const FilterChip = ({ active, onClick, children }) => (
  <button
    onClick={onClick}
    style={{
      padding: '4px 12px',
      fontSize: 12,
      fontWeight: active ? 700 : 500,
      fontFamily: 'inherit',
      background: active ? '#8B1A1A' : 'transparent',
      color: active ? '#FFF' : 'var(--ink-3)',
      border: `1px solid ${active ? '#8B1A1A' : 'var(--border)'}`,
      borderRadius: 'var(--r-btn)',
      cursor: 'pointer',
      whiteSpace: 'nowrap',
      transition: 'all 120ms',
    }}
  >{children}</button>
);

const selectStyle = active => ({
  height: 34,
  padding: '0 10px',
  fontSize: 12,
  fontFamily: 'Heebo, sans-serif',
  fontWeight: active ? 700 : 500,
  background: active ? '#8B1A1A' : 'transparent',
  color: active ? '#FFF' : 'var(--ink-3)',
  border: `1px solid ${active ? '#8B1A1A' : 'var(--border)'}`,
  borderRadius: 'var(--r-btn)',
  cursor: 'pointer',
});

const SkeletonRow = () => (
  <tr>
    {[170, 90, 80, 50, 100].map((w, i) => (
      <td key={i}><div className="shimmer" style={{ height: 13, width: w, borderRadius: 0 }} /></td>
    ))}
  </tr>
);

const CatalogRow = ({ product }) => {
  const saving = product.price_retail > product.price_group
    ? Math.round((1 - product.price_group / product.price_retail) * 100)
    : null;

  return (
    <tr style={{ cursor: 'default' }}>
      <td>
        <span style={{ color: 'var(--ink-3, #9C8070)', fontSize: 11, marginInlineEnd: 4 }}>#{product.cut_number}</span>
        <span style={{ fontWeight: 600 }}>{product.name}</span>
        {product.name_en && <div style={{ fontSize: 10, color: 'var(--ink-3)' }}>{product.name_en}</div>}
      </td>
      <td>
        <div style={{ fontSize: 12, color: 'var(--ink-2)' }}>{product.producer || '—'}</div>
        <div style={{ fontSize: 10, color: 'var(--ink-3)' }}>{product.origin_country}</div>
      </td>
      <td>
        <div style={{ fontSize: 12, color: 'var(--ink-2)' }}>{product.importer?.name || '—'}</div>
      </td>
      <td>
        {product.marbling_score
          ? <span className="bms-badge"><span style={{ fontFamily: 'Courier New', fontWeight: 700 }}>{product.marbling_score}</span></span>
          : <span style={{ color: 'var(--ink-3)' }}>—</span>}
      </td>
      <td style={{ whiteSpace: 'nowrap' }}>
        <span className="price-group">&#8362;{product.price_group}</span>
        {saving && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginBlockStart: 2 }}>
            <span className="price-retail">&#8362;{product.price_retail}</span>
            <span className="discount-badge">-{saving}%</span>
          </div>
        )}
      </td>
    </tr>
  );
};

export const CatalogScreen = ({ onNavigate, bp, searchQuery = '', setSearchQuery }) => {
  const [cat, setCat] = useState('הכל');
  const [selectedImporter, setSelectedImporter] = useState('');
  const [selectedOrigin, setSelectedOrigin] = useState('');
  const [sortPrice, setSortPrice] = useState('none'); // 'none' | 'asc' | 'desc'
  const [selectedBMS, setSelectedBMS] = useState('');

  const { data: products, isLoading, isError, refetch } = useProducts({});

  const uniqueCutTypes = useMemo(() => {
    if (!products?.length) return [];
    return [...new Set(products.map(p => getCutType(p.name)).filter(Boolean))].sort();
  }, [products]);

  const uniqueImporters = useMemo(() => {
    if (!products) return [];
    const names = products
      .map(p => p.importer?.name || p.importer)
      .filter(Boolean);
    return [...new Set(names)].sort();
  }, [products]);

  const uniqueOrigins = useMemo(() => {
    if (!products?.length) return [];
    return [...new Set(products.map(p => p.origin_country).filter(Boolean))].sort();
  }, [products]);

  const uniqueBMS = useMemo(() => {
    if (!products?.length) return [];
    return [...new Set(products.map(p => p.marbling_score).filter(Boolean))]
      .sort((a, b) => Number(a) - Number(b));
  }, [products]);

  const filtered = useMemo(() => {
    if (!products) return [];

    let result = products;

    // Filter by cut type
    if (cat !== 'הכל') {
      result = result.filter(p => getCutType(p.name) === cat);
    }

    // Filter by origin country
    if (selectedOrigin !== '') {
      result = result.filter(p => p.origin_country === selectedOrigin);
    }

    // Filter by BMS
    if (selectedBMS) {
      result = result.filter(p => p.marbling_score === selectedBMS);
    }

    // Filter by importer
    if (selectedImporter) {
      result = result.filter(p => {
        const imp = p.importer?.name || p.importer || '';
        return imp.toLowerCase() === selectedImporter.toLowerCase();
      });
    }

    // Filter by search query (from Topbar)
    if (searchQuery) {
      const s = searchQuery.toLowerCase();
      result = result.filter(p =>
        p.name?.toLowerCase().includes(s) ||
        p.name_en?.toLowerCase().includes(s) ||
        p.category?.toLowerCase().includes(s) ||
        p.producer?.toLowerCase().includes(s) ||
        (p.importer?.name || p.importer || '').toLowerCase().includes(s)
      );
    }

    // Sort by price
    if (sortPrice === 'asc') {
      result = [...result].sort((a, b) =>
        (a.price_group ?? 0) - (b.price_group ?? 0)
      );
    } else if (sortPrice === 'desc') {
      result = [...result].sort((a, b) =>
        (b.price_group ?? 0) - (a.price_group ?? 0)
      );
    }

    return result;
  }, [products, cat, selectedOrigin, selectedImporter, searchQuery, sortPrice, selectedBMS]);

  const clearAllFilters = () => {
    setCat('הכל');
    setSelectedOrigin('');
    setSelectedImporter('');
    setSortPrice('none');
    setSelectedBMS('');
    if (setSearchQuery) setSearchQuery('');
  };

  const cycleSortPrice = () => {
    setSortPrice(s => s === 'none' ? 'asc' : s === 'asc' ? 'desc' : 'none');
  };

  const sortLabel = sortPrice === 'asc' ? 'מחיר ↑' : sortPrice === 'desc' ? 'מחיר ↓' : 'מחיר ↑↓';

  return (
    <div className="fade-up">
      {/* Header */}
      <div className="page-header" style={{ marginBlockEnd: 20 }}>
        <div className="label">MEATHUB — קטלוג נתחים</div>
        <h1>כל הנתחים</h1>
        {!isLoading && !isError && (
          <div className="sub">{filtered.length} נתחים</div>
        )}
      </div>

      {/* Filters — single compact dropdown bar */}
      <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap', marginBlockEnd: 16, paddingBlock: '12px 0', borderBottom: '1px solid var(--border)' }}>
        {/* Cut type */}
        <select
          value={cat}
          onChange={e => setCat(e.target.value)}
          style={selectStyle(cat !== 'הכל')}
        >
          <option value="הכל">כל הנתחים</option>
          {uniqueCutTypes.map(c => <option key={c} value={c}>{c}</option>)}
        </select>

        {/* BMS */}
        <select
          value={selectedBMS}
          onChange={e => setSelectedBMS(e.target.value)}
          style={selectStyle(!!selectedBMS)}
        >
          <option value="">כל BMS</option>
          {uniqueBMS.map(bms => <option key={bms} value={bms}>BMS {bms}</option>)}
        </select>

        {/* Origin */}
        <select
          value={selectedOrigin}
          onChange={e => setSelectedOrigin(e.target.value)}
          style={selectStyle(!!selectedOrigin)}
        >
          <option value="">כל המקורות</option>
          {uniqueOrigins.map(o => <option key={o} value={o}>{o}</option>)}
        </select>

        {/* Importer */}
        <select
          value={selectedImporter}
          onChange={e => setSelectedImporter(e.target.value)}
          style={selectStyle(!!selectedImporter)}
        >
          <option value="">כל היבואנים</option>
          {uniqueImporters.map(imp => <option key={imp} value={imp}>{imp}</option>)}
        </select>

        {/* Price sort */}
        <button
          onClick={cycleSortPrice}
          style={{
            height: 34,
            padding: '0 12px',
            fontSize: 12,
            fontFamily: 'Heebo, sans-serif',
            fontWeight: sortPrice !== 'none' ? 700 : 500,
            background: sortPrice !== 'none' ? '#8B1A1A' : 'transparent',
            color: sortPrice !== 'none' ? '#FFF' : 'var(--ink-3)',
            border: `1px solid ${sortPrice !== 'none' ? '#8B1A1A' : 'var(--border)'}`,
            borderRadius: 'var(--r-btn)',
            cursor: 'pointer',
            whiteSpace: 'nowrap',
            transition: 'all 120ms',
          }}
        >
          {sortLabel}
        </button>

        {/* Clear all — shown only when any filter is active */}
        {(cat !== 'הכל' || selectedBMS || selectedOrigin || selectedImporter || sortPrice !== 'none' || searchQuery) && (
          <button onClick={clearAllFilters} style={{ height: 34, padding: '0 10px', fontSize: 11, fontFamily: 'Heebo, sans-serif', background: 'none', color: '#8B1A1A', border: '1px solid rgba(139,26,26,.4)', borderRadius: 2, cursor: 'pointer' }}>
            ✕ נקה
          </button>
        )}
      </div>

      {isError ? (
        <div style={{ padding: '40px 0', textAlign: 'center' }}>
          <div style={{ fontSize: 14, color: 'var(--ink-3)', marginBlockEnd: 12 }}>שגיאה בטעינת הנתונים</div>
          <button className="btn btn-outline" onClick={() => refetch()}>נסה שוב</button>
        </div>
      ) : !isLoading && filtered.length === 0 ? (
        <div className="catalog-empty-state" style={{ textAlign: 'center', padding: '60px 0' }}>
          <div style={{ fontSize: 48, marginBottom: 12 }}>🔍</div>
          <p style={{ fontSize: 14, color: 'var(--ink-3)', marginBottom: 0 }}>לא נמצאו מוצרים מתאימים</p>
          <button onClick={clearAllFilters} className="btn-ghost" style={{ marginTop: 8, color: '#8B1A1A', border: '1px solid #8B1A1A', borderRadius: 2, padding: '8px 16px', cursor: 'pointer', background: 'none', fontFamily: 'Heebo, sans-serif', fontSize: 13 }}>
            נקה סינון
          </button>
        </div>
      ) : (
        <div style={{ overflowX: 'auto' }}>
          <table className="trading-desk">
            <thead>
              <tr>
                <th>נתח</th>
                <th>מגדל / מקור</th>
                <th>יבואן</th>
                <th>BMS</th>
                <th>מחיר / ק"ג</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <><SkeletonRow /><SkeletonRow /><SkeletonRow /><SkeletonRow /><SkeletonRow /></>
              ) : (
                filtered.map(p => <CatalogRow key={p.id} product={p} />)
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
