# MeatHub v3

פלטפורמת רכישת בשר פרימיום קבוצתית — ישר מהיבואן.

## מה זה?

MeatHub מאפשר לקבוצות אנשים לרכוש יחד נתחי בשר פרימיום ישירות מהיבואן, בחיסכון של 40–60% לעומת מחיר הקמעונאות.

## טכנולוגיות

- **React 18** + **Vite**
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
npm run preview
```
