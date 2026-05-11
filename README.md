# MeatHub v3

פלטפורמת רכישת בשר פרימיום קבוצתית — ישר מהיבואן.

## מה זה?

MeatHub מאפשר לקבוצות אנשים לרכוש יחד נתחי בשר פרימיום ישירות מהיבואן, בחיסכון של 40–60% לעומת מחיר הקמעונאות.

## עיצוב

האפליקציה משתמשת בפאלטת צבעים חמה וטבעית:

| צבע | שימוש |
|-----|--------|
| `#8C5859` | צבע ראשי — כפתורים, הדגשות |
| `#EEE9D6` | רקע ראשי |
| `#EFF6D9` | רקע כרטיסים |
| `#EADDBA` | אזורים מוגבהים, תפריט צד |
| `#DBC59F` | גבולות ואקסנטים |
| `#C9A44A` | זהב — לוגו בלבד |

לוגו MEATHUB בצבע זהב ולחיצה עליו מחזירה לדף הבית.

הבילד מייצר קובץ `dist/index.html` יחיד (inline JS+CSS) — ניתן לפתוח ישירות בדפדפן ללא שרת.

## טכנולוגיות

- **React 18** + **Vite 6**
- **vite-plugin-singlefile** — קובץ HTML יחיד עם כל הנכסים inline
- CSS Variables (ללא CSS-in-JS חיצוני)
- RTL מלא (עברית)
- Responsive — Mobile / Tablet / Desktop

## מבנה הפרויקט

```
src/
├── data.js                  # נתוני מוצרים, קבוצות, יבואנים
├── hooks/
│   └── useBreakpoint.js     # hook לרספונסיביות
├── components/
│   ├── Icon.jsx             # מערכת אייקונים SVG
│   ├── Btn.jsx              # כפתור ראשי
│   ├── Tag.jsx              # תגיות סינון
│   ├── GradeBadge.jsx       # תג דרגת בשר (A–F)
│   ├── LiveProgressBar.jsx  # סרגל מילוי קבוצה
│   ├── CountdownTimer.jsx   # טיימר ספירה לאחור
│   ├── ProductCard.jsx      # כרטיסיית מוצר
│   ├── ImporterCard.jsx     # כרטיסיית יבואן
│   ├── Sidebar.jsx          # תפריט צד (desktop)
│   ├── Topbar.jsx           # סרגל עליון (desktop)
│   └── BottomNav.jsx        # ניווט תחתון (mobile)
└── screens/
    ├── LandingPage.jsx      # דף נחיתה
    ├── HomeScreen.jsx       # דף בית
    ├── CatalogScreen.jsx    # קטלוג נתחים
    ├── GroupsScreen.jsx     # רשימת קבוצות
    ├── GroupViewScreen.jsx  # פרטי קבוצה + הצטרפות
    ├── CartScreen.jsx       # עגלת קניות
    ├── CheckoutScreen.jsx   # תשלום
    ├── LoginScreen.jsx      # כניסה / הרשמה
    └── DashboardScreen.jsx  # פרופיל + הזמנות
```

## התקנה והרצה

```bash
npm install
npm run dev
```

## בנייה לפרודקשן

```bash
npm run build
# פותח את dist/index.html ישירות בדפדפן
```
