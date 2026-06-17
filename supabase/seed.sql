-- Importers
insert into importers (slug, name, name_en, origin, origin_en, rating, reviews, verified, logo) values
  ('i1', 'Las Piedras', 'Las Piedras', 'אורוגוואי', 'Uruguay', 4.9, 312, true, 'LP'),
  ('i2', 'פמפס פרימיום', 'Pampas Premium', 'ארגנטינה', 'Argentina', 4.7, 218, true, 'PP'),
  ('i3', 'Black Angus IL', 'Black Angus IL', 'ארה"ב', 'USA', 4.8, 187, true, 'BA'),
  ('i4', 'סטייקהאוס ישראל', 'Steakhouse Israel', 'ישראל', 'Israel', 4.6, 143, true, 'SI');

-- Products
insert into products (slug, name, name_en, importer_id, grade, grade_label, price_retail, price_group, weight, unit, category, category_en, description, color1, color2) values
  (
    'p1', 'פילה אנטריקוט', 'Ribeye Fillet',
    (select id from importers where slug = 'i1'),
    'F', 'GRADE F', 320, 195, 1.2, 'ק"ג', 'אנטריקוט', 'Ribeye',
    'אנטריקוט פרימיום מהמגדל ישירות, יישון יבש 21 יום',
    '#6B1A2A', '#4A1220'
  ),
  (
    'p2', 'אנטריקוט אורוגוואי', 'Uruguay Ribeye',
    (select id from importers where slug = 'i1'),
    'E', 'GRADE E', 280, 165, 1.0, 'ק"ג', 'אנטריקוט', 'Ribeye',
    'גידול חופשי, תזונה טבעית מלאה, מיושן 14 יום',
    '#8B4513', '#6B2F0D'
  ),
  (
    'p3', 'אסאדו מיוחד', 'Special Asado',
    (select id from importers where slug = 'i2'),
    'C', 'GRADE C', 160, 89, 1.5, 'ק"ג', 'אסאדו', 'Asado',
    'מהפמפס הארגנטינאי, מעושן קלות, איכות יוצאת דופן',
    '#A0522D', '#7B3F1A'
  ),
  (
    'p4', 'Las Piedras סינטה', 'Las Piedras Sirloin',
    (select id from importers where slug = 'i1'),
    'D', 'GRADE D', 220, 139, 1.1, 'ק"ג', 'סינטה', 'Sirloin',
    'סינטה רכה במיוחד, ייחודית ל-Las Piedras',
    '#7B3F1A', '#5C2E0F'
  ),
  (
    'p5', 'פילה בקר Black Angus', 'Black Angus Tenderloin',
    (select id from importers where slug = 'i3'),
    'F', 'GRADE F', 480, 280, 0.8, 'ק"ג', 'פילה', 'Tenderloin',
    'הפילה הנחשק ביותר, רך להפליא, Black Angus אמריקאי',
    '#5C1A1A', '#3D0F0F'
  ),
  (
    'p6', 'טומהוק פרימיום', 'Premium Tomahawk',
    (select id from importers where slug = 'i3'),
    'E', 'GRADE E', 380, 220, 1.4, 'ק"ג', 'אנטריקוט', 'Ribeye',
    'טומהוק עם עצם ארוכה, מחזה ויזואלי + טעם עמוק',
    '#8B3A1A', '#6B2A10'
  ),
  (
    'p7', 'שריר ברביקיו', 'BBQ Brisket',
    (select id from importers where slug = 'i2'),
    'B', 'GRADE B', 110, 62, 2.0, 'ק"ג', 'חזה', 'Brisket',
    'מושלם לעישון ולברביקיו, שומן מחלחל בין הסיבים',
    '#9B4B1A', '#7A3512'
  ),
  (
    'p8', 'כתף פרמה', 'Parma Shoulder',
    (select id from importers where slug = 'i4'),
    'C', 'GRADE C', 145, 78, 1.8, 'ק"ג', 'כתף', 'Shoulder',
    'כתף מיושנת, מדויקת לקציצות גורמה ולתבשילים',
    '#7B4515', '#5C3210'
  );

-- Groups
insert into groups (slug, product_id, importer_id, title, title_en, location, location_en, pickup, pickup_en, total_kg, filled_kg, min_kg, max_participants, ends_at, status) values
  (
    'g1',
    (select id from products where slug = 'p1'),
    (select id from importers where slug = 'i1'),
    'משלוח לוויביץ׳ • ראשל"צ צפון', 'Lovibich Delivery • North RL',
    'ראשון לציון', 'Rishon LeZion',
    'יום שישי 14:30', 'Friday 14:30',
    80, 58, 20, 40,
    now() + interval '3 days',
    'active'
  ),
  (
    'g2',
    (select id from products where slug = 'p2'),
    (select id from importers where slug = 'i1'),
    'קבוצת אנטריקוט • תל אביב מרכז', 'Ribeye Group • Tel Aviv Center',
    'תל אביב', 'Tel Aviv',
    'יום שבת 11:00', 'Saturday 11:00',
    60, 41, 20, 30,
    now() + interval '5 days',
    'active'
  ),
  (
    'g3',
    (select id from products where slug = 'p5'),
    (select id from importers where slug = 'i3'),
    'Black Angus Fillet • הרצליה', 'Black Angus Fillet • Herzliya',
    'הרצליה', 'Herzliya',
    'יום שישי 16:00', 'Friday 16:00',
    40, 28, 15, 20,
    now() + interval '2 days',
    'active'
  ),
  (
    'g4',
    (select id from products where slug = 'p6'),
    (select id from importers where slug = 'i3'),
    'טומהוק גורמה • ירושלים', 'Gourmet Tomahawk • Jerusalem',
    'ירושלים', 'Jerusalem',
    'יום ראשון 10:00', 'Sunday 10:00',
    50, 12, 25, 25,
    now() + interval '7 days',
    'active'
  );
