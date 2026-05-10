export const IMPORTERS = [
  { id: 'i1', name: 'Las Piedras', nameEn: 'Las Piedras', origin: 'אורוגוואי', originEn: 'Uruguay', rating: 4.9, reviews: 312, verified: true, logo: 'LP' },
  { id: 'i2', name: 'פמפס פרימיום', nameEn: 'Pampas Premium', origin: 'ארגנטינה', originEn: 'Argentina', rating: 4.7, reviews: 218, verified: true, logo: 'PP' },
  { id: 'i3', name: 'Black Angus IL', nameEn: 'Black Angus IL', origin: 'ארה"ב', originEn: 'USA', rating: 4.8, reviews: 187, verified: true, logo: 'BA' },
  { id: 'i4', name: 'סטייקהאוס ישראל', nameEn: 'Steakhouse Israel', origin: 'ישראל', originEn: 'Israel', rating: 4.6, reviews: 143, verified: true, logo: 'SI' },
];

export const PRODUCTS = [
  { id: 'p1', name: 'פילה אנטריקוט', nameEn: 'Ribeye Fillet', importer: 'i1', grade: 'F', gradeLabel: 'GRADE F', priceRetail: 320, priceGroup: 195, weight: 1.2, unit: 'ק"ג', category: 'אנטריקוט', categoryEn: 'Ribeye', description: 'אנטריקוט פרימיום מהמגדל ישירות, יישון יבש 21 יום', color1: '#6B1A2A', color2: '#4A1220', imageAlt: 'פילה אנטריקוט פרימיום' },
  { id: 'p2', name: 'אנטריקוט אורוגוואי', nameEn: 'Uruguay Ribeye', importer: 'i1', grade: 'E', gradeLabel: 'GRADE E', priceRetail: 280, priceGroup: 165, weight: 1.0, unit: 'ק"ג', category: 'אנטריקוט', categoryEn: 'Ribeye', description: 'גידול חופשי, תזונה טבעית מלאה, מיושן 14 יום', color1: '#8B4513', color2: '#6B2F0D', imageAlt: 'אנטריקוט אורוגוואי' },
  { id: 'p3', name: 'אסאדו מיוחד', nameEn: 'Special Asado', importer: 'i2', grade: 'C', gradeLabel: 'GRADE C', priceRetail: 160, priceGroup: 89, weight: 1.5, unit: 'ק"ג', category: 'אסאדו', categoryEn: 'Asado', description: 'מהפמפס הארגנטינאי, מעושן קלות, איכות יוצאת דופן', color1: '#A0522D', color2: '#7B3F1A', imageAlt: 'אסאדו ארגנטינאי מיוחד' },
  { id: 'p4', name: 'Las Piedras סינטה', nameEn: 'Las Piedras Sirloin', importer: 'i1', grade: 'D', gradeLabel: 'GRADE D', priceRetail: 220, priceGroup: 139, weight: 1.1, unit: 'ק"ג', category: 'סינטה', categoryEn: 'Sirloin', description: 'סינטה רכה במיוחד, ייחודית ל-Las Piedras', color1: '#7B3F1A', color2: '#5C2E0F', imageAlt: 'סינטה Las Piedras' },
  { id: 'p5', name: 'פילה בקר Black Angus', nameEn: 'Black Angus Tenderloin', importer: 'i3', grade: 'F', gradeLabel: 'GRADE F', priceRetail: 480, priceGroup: 280, weight: 0.8, unit: 'ק"ג', category: 'פילה', categoryEn: 'Tenderloin', description: 'הפילה הנחשק ביותר, רך להפליא, Black Angus אמריקאי', color1: '#5C1A1A', color2: '#3D0F0F', imageAlt: 'פילה Black Angus' },
  { id: 'p6', name: 'טומהוק פרימיום', nameEn: 'Premium Tomahawk', importer: 'i3', grade: 'E', gradeLabel: 'GRADE E', priceRetail: 380, priceGroup: 220, weight: 1.4, unit: 'ק"ג', category: 'אנטריקוט', categoryEn: 'Ribeye', description: 'טומהוק עם עצם ארוכה, מחזה ויזואלי + טעם עמוק', color1: '#8B3A1A', color2: '#6B2A10', imageAlt: 'טומהוק פרימיום עם עצם' },
  { id: 'p7', name: 'שריר ברביקיו', nameEn: 'BBQ Brisket', importer: 'i2', grade: 'B', gradeLabel: 'GRADE B', priceRetail: 110, priceGroup: 62, weight: 2.0, unit: 'ק"ג', category: 'חזה', categoryEn: 'Brisket', description: 'מושלם לעישון ולברביקיו, שומן מחלחל בין הסיבים', color1: '#9B4B1A', color2: '#7A3512', imageAlt: 'שריר בריסקט לברביקיו' },
  { id: 'p8', name: 'כתף פרמה', nameEn: 'Parma Shoulder', importer: 'i4', grade: 'C', gradeLabel: 'GRADE C', priceRetail: 145, priceGroup: 78, weight: 1.8, unit: 'ק"ג', category: 'כתף', categoryEn: 'Shoulder', description: 'כתף מיושנת, מדויקת לקציצות גורמה ולתבשילים', color1: '#7B4515', color2: '#5C3210', imageAlt: 'כתף בקר פרמה' },
];

export const GROUPS = [
  {
    id: 'g1', productId: 'p1', importer: 'i1',
    title: 'משלוח לוויביץ׳ • ראשל"צ צפון',
    titleEn: 'Lovibich Delivery • North RL',
    location: 'ראשון לציון', locationEn: 'Rishon LeZion',
    pickup: 'יום שישי 14:30', pickupEn: 'Friday 14:30',
    totalKg: 80, filledKg: 58, minKg: 20,
    participants: 23, maxParticipants: 40,
    endsAt: new Date(Date.now() + 2 * 60 * 60 * 1000 + 34 * 60 * 1000),
    status: 'active',
    avatars: ['ד', 'מ', 'ר', 'א', 'ש'],
  },
  {
    id: 'g2', productId: 'p2', importer: 'i1',
    title: 'קבוצת אנטריקוט • תל אביב מרכז',
    titleEn: 'Ribeye Group • Tel Aviv Center',
    location: 'תל אביב', locationEn: 'Tel Aviv',
    pickup: 'יום שבת 11:00', pickupEn: 'Saturday 11:00',
    totalKg: 60, filledKg: 41, minKg: 20,
    participants: 17, maxParticipants: 30,
    endsAt: new Date(Date.now() + 5 * 60 * 60 * 1000),
    status: 'active',
    avatars: ['י', 'נ', 'ל', 'ח'],
  },
  {
    id: 'g3', productId: 'p5', importer: 'i3',
    title: 'Black Angus Fillet • הרצליה',
    titleEn: 'Black Angus Fillet • Herzliya',
    location: 'הרצליה', locationEn: 'Herzliya',
    pickup: 'יום שישי 16:00', pickupEn: 'Friday 16:00',
    totalKg: 40, filledKg: 28, minKg: 15,
    participants: 12, maxParticipants: 20,
    endsAt: new Date(Date.now() + 8 * 60 * 60 * 1000),
    status: 'active',
    avatars: ['ס', 'ע', 'פ'],
  },
  {
    id: 'g4', productId: 'p6', importer: 'i3',
    title: 'טומהוק גורמה • ירושלים',
    titleEn: 'Gourmet Tomahawk • Jerusalem',
    location: 'ירושלים', locationEn: 'Jerusalem',
    pickup: 'יום ראשון 10:00', pickupEn: 'Sunday 10:00',
    totalKg: 50, filledKg: 12, minKg: 25,
    participants: 6, maxParticipants: 25,
    endsAt: new Date(Date.now() + 18 * 60 * 60 * 1000),
    status: 'active',
    avatars: ['ב', 'ג'],
  },
];

export const CATEGORIES = ['הכל', 'אנטריקוט', 'פילה', 'סינטה', 'אסאדו', 'חזה', 'כתף'];
export const GRADES = ['הכל', 'F', 'E', 'D', 'C', 'B', 'A'];

export function getProduct(id) { return PRODUCTS.find(p => p.id === id); }
export function getImporter(id) { return IMPORTERS.find(i => i.id === id); }
export function getGroup(id) { return GROUPS.find(g => g.id === id); }
export function getGroupsByProduct(productId) { return GROUPS.filter(g => g.productId === productId && g.status === 'active'); }
export function getSavingPercent(retail, group) { return Math.round((1 - group / retail) * 100); }
export function getProductImageUrl(productId) {
  const colors = {
    p1: ['6B1A2A', '4A1220'], p2: ['8B4513', '6B2F0D'], p3: ['A0522D', '7B3F1A'],
    p4: ['7B3F1A', '5C2E0F'], p5: ['5C1A1A', '3D0F0F'], p6: ['8B3A1A', '6B2A10'],
    p7: ['9B4B1A', '7A3512'], p8: ['7B4515', '5C3210'],
  };
  const c = colors[productId] || ['999999', '666666'];
  return `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='150'%3E%3Cdefs%3E%3ClinearGradient id='g' x1='0%25' y1='0%25' x2='100%25' y2='100%25'%3E%3Cstop offset='0%25' stop-color='%23${c[0]}'/%3E%3Cstop offset='100%25' stop-color='%23${c[1]}'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='200' height='150' fill='url(%23g)'/%3E%3C/svg%3E`;
}
