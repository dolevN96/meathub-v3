-- Step 1: Clear old products (cascade clears groups, order_items, group_participants)
-- NOTE: Run this CAREFULLY — it deletes all group and order data
truncate table order_items cascade;
truncate table group_participants cascade;
truncate table orders cascade;
truncate table groups cascade;
truncate table products cascade;

-- Step 2: Update importers (keep existing, just add image_url)
-- (importers were already seeded in seed.sql — just update image_url)
update importers set image_url = 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400&q=80' where slug = 'i1';
update importers set image_url = 'https://images.unsplash.com/photo-1551024739-78b4a42b2f60?w=400&q=80' where slug = 'i2';
update importers set image_url = 'https://images.unsplash.com/photo-1546793665-c74683f339c1?w=400&q=80' where slug = 'i3';
update importers set image_url = 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=400&q=80' where slug = 'i4';

-- Step 3: Insert corrected products (8 real, accurate cuts)
insert into products (slug, name, name_en, importer_id, grade, grade_label, price_retail, price_group, weight, unit, category, category_en, description, color1, color2, image_url) values

('p1', 'ריביי אורוגוואי', 'Uruguayan Ribeye',
 (select id from importers where slug='i1'),
 'VF', 'Vacuno Pesado', 320, 195, 1.2, 'ק"ג', 'ריביי', 'Ribeye',
 'ריביי קלאסי מגידול חופשי באורוגוואי. שיש טבעי מושלם, יישון יבש 21 יום. הלב של חוות Las Piedras.',
 '#6B1A2A', '#4A1220',
 'https://images.unsplash.com/photo-1558030006-450675393462?w=800&q=80'),

('p2', 'פיקאנייה Las Piedras', 'Picanha Las Piedras',
 (select id from importers where slug='i1'),
 'VF', 'Vacuno Pesado', 260, 158, 1.0, 'ק"ג', 'פיקאנייה', 'Picanha',
 'הנתח הלאומי הברזילאי-אורוגוואי. כובע שומן עבה, בשר אדום עמוק, טעם מרוכז ועז.',
 '#8B4513', '#6B2F0D',
 'https://images.unsplash.com/photo-1594041680534-e8c8cdebd659?w=800&q=80'),

('p3', 'אסאדו ארגנטינאי', 'Argentine Asado',
 (select id from importers where slug='i2'),
 'FE', 'Fina Elección', 160, 89, 1.5, 'ק"ג', 'אסאדו', 'Short Ribs',
 'צלעות קצרות מהפמפס הארגנטינאי. שכבות שומן מתחלפות — מיועד לגריל איטי מסורתי.',
 '#A0522D', '#7B3F1A',
 'https://images.unsplash.com/photo-1544025162-d76694265947?w=800&q=80'),

('p4', 'פלט איירון פמפס', 'Flat Iron Pampas',
 (select id from importers where slug='i2'),
 'FE', 'Fina Elección', 185, 112, 0.9, 'ק"ג', 'כתף', 'Flat Iron',
 'Flat Iron חתוך מהכתף העליונה (Chuck). רך יוצא דופן, שיש בינוני, ערך מעולה.',
 '#7B3F1A', '#5C2E0F',
 'https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?w=800&q=80'),

('p5', 'פילה מיניון Black Angus', 'Filet Mignon Black Angus',
 (select id from importers where slug='i3'),
 'UP', 'USDA Prime', 480, 280, 0.8, 'ק"ג', 'פילה', 'Tenderloin',
 'Filet Mignon מה-Tenderloin המלא. הנתח הרך ביותר בבקר, כמעט ללא שיש, טעם עדין.',
 '#5C1A1A', '#3D0F0F',
 'https://images.unsplash.com/photo-1546833998-877b37c2e5c6?w=800&q=80'),

('p6', 'טומהוק Black Angus', 'Tomahawk Black Angus',
 (select id from importers where slug='i3'),
 'UP', 'USDA Prime', 420, 245, 1.4, 'ק"ג', 'ריביי', 'Tomahawk',
 'Tomahawk Ribeye עם עצם צלעה שלמה (45 ס"מ). שיש גבוה, שומן בין-שרירי, מחזה ויזואלי.',
 '#8B3A1A', '#6B2A10',
 'https://images.unsplash.com/photo-1615937657715-bc7b4b7962c1?w=800&q=80'),

('p7', 'בריסקט ישראלי', 'Israeli Brisket',
 (select id from importers where slug='i4'),
 'PL', 'Prime Local', 110, 62, 2.0, 'ק"ג', 'חזה', 'Brisket',
 'חזה בקר (Point Cut) מגידול ישראלי מבוקר. אידיאלי לעישון איטי 12–16 שעות.',
 '#9B4B1A', '#7A3512',
 'https://images.unsplash.com/photo-1529693662653-9d480530a697?w=800&q=80'),

('p8', 'סטריפ לוין', 'Strip Loin',
 (select id from importers where slug='i4'),
 'PL', 'Prime Local', 145, 78, 1.1, 'ק"ג', 'סינטה', 'Strip Loin',
 'New York Strip מקומי. שיש אחיד לאורך הנתח, קשה יותר מהריביי, טעם עשיר.',
 '#7B4515', '#5C3210',
 'https://images.unsplash.com/photo-1588168333986-5078d3ae3976?w=800&q=80');

-- Step 4: Insert branches
insert into branches (name, address, city, phone, opening_hours) values
  ('לוויביץ׳ ראשל"צ', 'רחוב הרצל 45', 'ראשון לציון', '054-1234567', 'שישי 14:00–16:00'),
  ('שוק הכרמל תל אביב', 'שוק הכרמל, דוכן 23', 'תל אביב', '052-7654321', 'שבת 10:00–13:00'),
  ('הרצליה פיתוח', 'שדרות בן גוריון 12', 'הרצליה', '053-9876543', 'שישי 15:00–17:00'),
  ('מחנה יהודה', 'שוק מחנה יהודה, כניסה ראשית', 'ירושלים', '050-1112233', 'ראשון 09:00–12:00');

-- Step 5: Re-insert groups with branch_id references
insert into groups (slug, product_id, importer_id, title, title_en, location, location_en, pickup, pickup_en, total_kg, filled_kg, min_kg, max_participants, ends_at, status, branch_id) values

('g1',
 (select id from products where slug='p1'),
 (select id from importers where slug='i1'),
 'ריביי אורוגוואי • ראשל"צ', 'Uruguay Ribeye • RL',
 'ראשון לציון', 'Rishon LeZion',
 'שישי 14:30', 'Friday 14:30',
 80, 58, 20, 40,
 now() + interval '3 days', 'active',
 (select id from branches where city='ראשון לציון')),

('g2',
 (select id from products where slug='p2'),
 (select id from importers where slug='i1'),
 'פיקאנייה Las Piedras • תל אביב', 'Picanha Las Piedras • TLV',
 'תל אביב', 'Tel Aviv',
 'שבת 11:00', 'Saturday 11:00',
 60, 41, 20, 30,
 now() + interval '5 days', 'active',
 (select id from branches where city='תל אביב')),

('g3',
 (select id from products where slug='p5'),
 (select id from importers where slug='i3'),
 'פילה מיניון Black Angus • הרצליה', 'Filet Mignon Black Angus • Herzliya',
 'הרצליה', 'Herzliya',
 'שישי 16:00', 'Friday 16:00',
 40, 28, 15, 20,
 now() + interval '2 days', 'active',
 (select id from branches where city='הרצליה')),

('g4',
 (select id from products where slug='p6'),
 (select id from importers where slug='i3'),
 'טומהוק Black Angus • ירושלים', 'Tomahawk Black Angus • Jerusalem',
 'ירושלים', 'Jerusalem',
 'ראשון 10:00', 'Sunday 10:00',
 50, 12, 25, 25,
 now() + interval '7 days', 'active',
 (select id from branches where city='ירושלים'));
