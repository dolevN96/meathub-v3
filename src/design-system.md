# MeatHub v3 — Design System "Boucherie Élite"

> Read by engineers. Be precise, implement exactly.

---

## 1. Emotional Positioning

**"Precision. Trust. Appetite. Exclusivity."**

The brand is a Michelin-starred butcher — authoritative but inviting. Every pixel communicates quality and care. No decoration without purpose.

---

## 2. Competitive Signal Analysis

| Brand | Premium Signal |
|---|---|
| Crowd Cow | Generous white space, photography-first |
| Holy Grail Steak | Serif headings, minimal palette, grade transparency |
| ButcherBox | Clean UI chrome, product hero |
| Porter Road | Craft typography, price transparency |

**Takeaways:** White space = confidence. Serifs = tradition. Minimal color = restraint = sophistication. Price transparency = trust.

---

## 3. Color System

```css
:root {
  --bg:        #F5F2EC;   /* Warm ivory/parchment — heritage, quality */
  --bg-card:   #FFFFFF;   /* Pure white cards — cleanliness, freshness */
  --bg-dark:   #0A0705;   /* OLED near-black — luxury, depth (hero sections) */
  --ink:       #1A0F0A;   /* Deep warm black — authoritative body text */
  --ink-2:     #5C4033;   /* Medium brown — secondary text */
  --ink-3:     #9C7B6A;   /* Muted captions */
  --crimson:   #8B1A1A;   /* Primary CTA — appetite/urgency */
  --crimson-2: #6B1212;   /* Hover states */
  --gold:      #B8860B;   /* Accent — serious, not flashy */
  --gold-lt:   #D4A017;   /* Light gold — highlights */
  --success:   #2D6A4F;   /* Deep forest green */
  --border:    rgba(26,15,10,.08);
  --border-md: rgba(26,15,10,.14);
}
```

**Psychology:**
- **Crimson:** Appetite and urgency without aggression.
- **Ivory (not white):** Warmth, craft, artisan quality.
- **Deep black on ivory:** Extreme contrast = confidence, no apologies.
- **Gold as accent only:** Too much gold = cheap. Used sparingly = exclusive.

---

## 4. Typography System

### Fonts

| Role | Font | Rationale |
|---|---|---|
| Display / Headings | `'Playfair Display', Georgia, serif` | Craft, tradition, premium |
| Body / UI | `'Heebo', Arial, sans-serif` | Hebrew-optimized, clean, readable |
| Numbers / Grades | `'Courier New', monospace` | Precise, audited, trustworthy |

### Fluid Scale

```css
:root {
  --text-xs:   clamp(11px, 1.2vw, 12px);
  --text-sm:   clamp(13px, 1.4vw, 14px);
  --text-base: clamp(15px, 1.6vw, 16px);
  --text-lg:   clamp(17px, 2vw,   20px);
  --text-xl:   clamp(22px, 3vw,   28px);
  --text-2xl:  clamp(28px, 4vw,   40px);
  --text-3xl:  clamp(36px, 5vw,   56px);
}
```

### Rules

- `letter-spacing: -0.02em` on headings >= 28px (tighter = premium).
- `line-height: 1.15` headings, `1.6` body.
- Minimum `font-weight: 500` for any UI element.
- Price display: Courier New, `font-weight: 700`, no `letter-spacing`.

---

## 5. Spacing System

Base unit: **8px**

```css
:root {
  --space-xs:  4px;
  --space-sm:  8px;
  --space-md:  16px;
  --space-lg:  24px;
  --space-xl:  40px;
  --space-2xl: 64px;
  --space-3xl: 96px;
}
```

| Context | Value |
|---|---|
| Card padding | 24px |
| Section gap — desktop | 64px |
| Section gap — mobile | 40px |

---

## 6. Shape Language

| Element | border-radius |
|---|---|
| Cards | `4px` |
| Buttons | `2px` |
| Tags / chips | `2px` |
| Input fields | `4px` |

**Rationale:** Rounded = friendly/casual. Sharp = precise/professional. Premium Japanese aesthetic — every corner is intentional. Never use `border-radius > 8px` unless explicitly noted.

---

## 7. Component Principles

### Cards
- Background: `--bg-card` (white) on `--bg` (ivory) page.
- Border: `1px solid var(--border-md)` — no shadow at rest.
- Hover: subtle `box-shadow` appears (no movement — stability signals quality).

```css
.card {
  background: var(--bg-card);
  border: 1px solid var(--border-md);
  border-radius: 4px;
  padding: 24px;
  transition: box-shadow 200ms ease;
}
.card:hover {
  box-shadow: 0 4px 16px rgba(26,15,10,.08);
}
```

### Buttons

| Variant | Spec |
|---|---|
| Primary | `--crimson` bg, white text, 2px radius, 48px height |
| Ghost | transparent bg, `--crimson` border + text |
| Disabled | `opacity: 0.4`, `cursor: not-allowed` |
| Loading | inline spinner + text, pointer-events disabled |

### Grade Badges
- Stark black (`--ink`) rectangle, white monospace letter/text.
- `border-radius: 0` — like a quality stamp, authoritative.
- Not rounded, not colorful.

```css
.grade-badge {
  font-family: 'Courier New', monospace;
  font-weight: 700;
  background: var(--ink);
  color: #fff;
  border-radius: 0;
  padding: 2px 6px;
  letter-spacing: 0;
}
```

### Progress Bar
- Height: `4px` (thin = precision).
- Fill: `--crimson` on `--border` track.
- Smooth CSS transition on fill change.

```css
.progress-track {
  height: 4px;
  background: var(--border);
  border-radius: 2px;
}
.progress-fill {
  height: 100%;
  background: var(--crimson);
  border-radius: 2px;
  transition: width 400ms cubic-bezier(0.23, 1, 0.32, 1);
}
```

### Images
- Always `aspect-ratio: 16 / 10` container — no CLS.
- `object-fit: cover`.
- Premium product photography only — no placeholders, no generic stock.

---

## 8. Motion Design

**Rule: Only animate `transform` and `opacity`. Never animate layout properties (`width`, `height`, `top`, `left`, `padding`, `margin`).**

**Rule: `will-change: transform` on any element that animates transform.**

**Rule: Never use `transition: all` — always explicit properties.**

### Timing Functions

| Use | Value |
|---|---|
| Entrance | `cubic-bezier(0.23, 1, 0.32, 1)` — ease-out, natural |
| Button press | `cubic-bezier(0.34, 1.56, 0.64, 1)` — spring, physical |
| Hover color | `150ms linear` |
| Hover transform | `200ms ease` |

### Keyframes

```css
@keyframes fadeUp {
  from { opacity: 0; transform: translateY(12px); }
  to   { opacity: 1; transform: translateY(0); }
}
/* Usage: animation: fadeUp 280ms cubic-bezier(0.23, 1, 0.32, 1) both; */

@keyframes badgePop {
  0%   { transform: scale(1); }
  40%  { transform: scale(1.4); }
  70%  { transform: scale(0.9); }
  100% { transform: scale(1); }
}
/* Usage: animation: badgePop 360ms cubic-bezier(0.34, 1.56, 0.64, 1); */

@keyframes spin {
  to { transform: rotate(360deg); }
}
/* Usage: animation: spin 600ms linear infinite; */

@keyframes shimmer {
  from { background-position: -200% 0; }
  to   { background-position:  200% 0; }
}
/* Usage on skeleton:
   background: linear-gradient(90deg, var(--border) 25%, var(--bg) 50%, var(--border) 75%);
   background-size: 200% 100%;
   animation: shimmer 1.4s ease infinite; */
```

---

## 9. RTL Architecture

App is Hebrew — `direction: rtl` on `<html>`.

**Use CSS Logical Properties throughout. Never use physical left/right in new code.**

| Physical (forbidden) | Logical (use this) |
|---|---|
| `margin-left` / `margin-right` | `margin-inline-start` / `margin-inline-end` |
| `padding-left` / `padding-right` | `padding-inline-start` / `padding-inline-end` |
| `left` / `right` (positioning) | `inset-inline-start` / `inset-inline-end` |
| `border-left` / `border-right` | `border-inline-start` / `border-inline-end` |

---

## 10. iOS Safe Area

```css
.bottom-nav {
  padding-bottom: calc(12px + env(safe-area-inset-bottom));
}
```

`viewport-fit=cover` is already set in `index.html`. Do not remove it.
