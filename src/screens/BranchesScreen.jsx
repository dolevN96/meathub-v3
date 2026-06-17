import { useBranches } from '../lib/db';
import { Icon } from '../components/Icon';

const CRIMSON = '#8B1A1A';
const CARD_BG = '#FFFFFF';
const PAGE_BG = '#FFFFFF';
const TEXT_DARK = '#1A0F0A';
const TEXT_SECONDARY = '#9C7B6A';

const REGION_ORDER = ['צפון', 'שרון', 'מרכז/גוש דן', 'ירושלים', 'דרום'];

const SkeletonCard = () => (
  <div style={{ background: CARD_BG, border: '1px solid rgba(26,15,10,.14)', borderRadius: 0, padding: 24 }}>
    <div className="shimmer" style={{ height: 22, width: '55%', borderRadius: 2, marginBlockEnd: 10 }} />
    <div className="shimmer" style={{ height: 14, width: '30%', borderRadius: 2, marginBlockEnd: 16 }} />
    <div className="shimmer" style={{ height: 14, width: '80%', borderRadius: 2, marginBlockEnd: 8 }} />
    <div className="shimmer" style={{ height: 14, width: '60%', borderRadius: 2, marginBlockEnd: 8 }} />
    <div className="shimmer" style={{ height: 14, width: '70%', borderRadius: 2, marginBlockEnd: 20 }} />
    <div style={{ borderBlockStart: '1px solid rgba(26,15,10,.08)', paddingBlockStart: 16 }}>
      <div className="shimmer" style={{ height: 13, width: '40%', borderRadius: 2 }} />
    </div>
  </div>
);

const CityChip = ({ city }) => (
  <span style={{
    background: 'rgba(139,26,26,.08)',
    border: '1px solid rgba(139,26,26,.3)',
    color: CRIMSON,
    borderRadius: 2,
    padding: '2px 8px',
    fontSize: 11,
    fontWeight: 700,
    display: 'inline-block',
  }}>
    {city}
  </span>
);

const MapsButton = ({ address, city }) => {
  const query = encodeURIComponent(`${address} ${city}`);
  const url = `https://www.google.com/maps/search/?api=1&query=${query}`;
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 5,
        border: `1px solid ${CRIMSON}`,
        color: CRIMSON,
        background: 'none',
        padding: '6px 14px',
        borderRadius: 2,
        fontSize: 12,
        fontWeight: 700,
        textDecoration: 'none',
        cursor: 'pointer',
        transition: 'background .15s',
        fontFamily: 'inherit',
      }}
    >
      <Icon name="map" size={13} color={CRIMSON} />
      פתח במפה
    </a>
  );
};

const BranchRow = ({ branch }) => (
  <div style={{
    display: 'grid',
    gridTemplateColumns: 'auto 1fr auto',
    alignItems: 'center',
    gap: 16,
    padding: '12px 0',
    borderBottom: '1px solid rgba(26,15,10,.08)',
  }}>
    {/* City chip */}
    <CityChip city={branch.city || ''} />

    {/* Info */}
    <div>
      <div style={{ fontWeight: 700, fontSize: 14, color: TEXT_DARK, marginBottom: 2 }}>{branch.name}</div>
      <div style={{ fontSize: 12, color: TEXT_SECONDARY, display: 'flex', gap: 12, flexWrap: 'wrap' }}>
        {branch.address && <span>{branch.address}</span>}
        {branch.phone && <a href={`tel:${branch.phone}`} style={{ color: CRIMSON, textDecoration: 'none', fontWeight: 600 }}>{branch.phone}</a>}
        {branch.opening_hours && <span>{branch.opening_hours}</span>}
      </div>
    </div>

    {/* Map link */}
    <MapsButton address={branch.address || ''} city={branch.city || ''} />
  </div>
);

const RegionDivider = ({ label }) => (
  <div style={{
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    marginBlock: '20px 4px',
  }}>
    <div style={{ flex: 1, height: 1, background: 'rgba(26,15,10,.12)' }} />
    <span style={{
      fontSize: 12,
      fontWeight: 700,
      color: TEXT_SECONDARY,
      letterSpacing: 1.2,
      textTransform: 'uppercase',
      flexShrink: 0,
    }}>
      {label}
    </span>
    <div style={{ flex: 1, height: 1, background: 'rgba(26,15,10,.12)' }} />
  </div>
);

function groupByRegion(branches) {
  const map = {};
  for (const b of branches) {
    const region = b.region || 'אחר';
    if (!map[region]) map[region] = [];
    map[region].push(b);
  }
  // Sort by REGION_ORDER, unknown regions at end
  const keys = Object.keys(map).sort((a, b) => {
    const ai = REGION_ORDER.indexOf(a);
    const bi = REGION_ORDER.indexOf(b);
    const an = ai === -1 ? 99 : ai;
    const bn = bi === -1 ? 99 : bi;
    return an - bn;
  });
  return keys.map(k => ({ region: k, branches: map[k] }));
}

export const BranchesScreen = ({ onNavigate, bp }) => {
  const isDesktop = bp === 'desktop' || bp === 'wide';
  const { data: branches, isLoading, isError, refetch } = useBranches();

  return (
    <div style={{ background: PAGE_BG, minHeight: '100%', padding: isDesktop ? '40px 48px' : '24px 16px' }}>
      {/* Page Header */}
      <div style={{ marginBlockEnd: 8 }}>
        <h1 style={{
          fontSize: isDesktop ? 32 : 26,
          fontWeight: 700,
          color: TEXT_DARK,
          margin: 0,
          marginBlockEnd: 6,
          lineHeight: 1.2,
        }}>
          נקודות איסוף
        </h1>
        <p style={{ margin: 0, fontSize: 14, color: TEXT_SECONDARY, fontWeight: 500 }}>
          בחר נקודת איסוף קרובה אליך
        </p>
      </div>

      {isError ? (
        <div style={{ textAlign: 'center', padding: 40, color: '#9C7B6A' }}>
          <div style={{ fontSize: 16, marginBottom: 8, color: '#1A0F0A' }}>שגיאה בטעינת הנתונים</div>
          <button onClick={() => refetch()} style={{ color: CRIMSON, background: 'none', border: `1px solid ${CRIMSON}`, borderRadius: 2, padding: '8px 20px', cursor: 'pointer', fontFamily: 'inherit' }}>נסה שוב</button>
        </div>
      ) : isLoading ? (
        <div>
          <RegionDivider label="טוען..." />
          <div>
            {Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)}
          </div>
        </div>
      ) :!branches || branches.length === 0 ? (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', paddingBlock: 80, gap: 12 }}>
          <Icon name="map" size={40} color="rgba(26,15,10,.2)" />
          <div style={{ fontSize: 15, color: TEXT_SECONDARY, fontWeight: 600, textAlign: 'center' }}>
            עדיין לא הוגדרו נקודות איסוף
          </div>
        </div>
      ) : (
        <div>
          {groupByRegion(branches).map(({ region, branches: regionBranches }) => (
            <div key={region}>
              <RegionDivider label={region} />
              <div>
                {regionBranches.map(branch => (
                  <BranchRow key={branch.id} branch={branch} />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
